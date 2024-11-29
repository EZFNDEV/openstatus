import { Knex } from "knex";
import { D1Database, D1Result } from "@cloudflare/workers-types";

// D1_ERROR: UNIQUE constraint failed
// export type D1UniqueConstraintError = Error;
export class D1UniqueConstraintError extends Error {
    table: string;
    column: string;

    constructor(message: string, table: string, column: string) {
        super(message);
        this.name = 'D1UniqueConstraintError';
        
        this.table = table;
        this.column = column;
    }
}

// D1_ERROR: near "DEFAULT": syntax error at offset 185: SQLITE_ERROR
export type D1SyntaxError = Error;

export function queryKnexD1<T>(knexSql: Knex.Sql, database: D1Database): Promise<D1Result<T>> {
    const native = knexSql.toNative();
    // @ts-ignore
    return queryD1<T>(native.sql, native.bindings, database);
}

export async function queryD1<T>(
    command: string,
    values: any[],
    database: D1Database,
    maxAmountOfRetries: number = 3,
    amountOfRetries: number = 0,
    disableAutoConvertTypes: boolean = false
): Promise<D1Result<T> | null> {
    if (!disableAutoConvertTypes) {
        // Convert all values to strings
        values = values.map(value => {
            if (value instanceof Date) return value.toISOString();

            return value;
        });
    }

    try {
        const prepare = database.prepare(command);
        const result = await prepare.bind(...values).all<T>();

        return result;
    } catch (_e: unknown) {
        const e = _e as Error;
        
        console.error(e);

        const message = e.message;
        // D1_ERROR: Prefix as seen here: https://github.com/cloudflare/workerd/blob/c7745796da2ff857841e0a6830ec50c6ca3b1b73/src/cloudflare/internal/d1-api.ts#L192
        if (message.includes('D1_ERROR:')) {
            let canRetry = amountOfRetries < maxAmountOfRetries;
            let shouldReportError = false;
            let shouldReportOnLastRetry = false;
            // let error: Error = internal.d1_error;

            if (message.includes('D1_ERROR: Network connection lost.')) {
                // error = internal.d1_network_error;
                shouldReportOnLastRetry = true;
            } else if (message.includes('D1_ERROR: Cannot resolve D1 due to transient issue on remote node.')) {
                // error = internal.d1_transient_error;
                shouldReportOnLastRetry = true;
            } else if (message.includes('D1_ERROR: internal error.')) {
                // error = internal.d1_internal_error;
                shouldReportOnLastRetry = true;
            } else if (message.includes('D1_ERROR: UNIQUE constraint failed')) {
                // parse it, D1_ERROR: UNIQUE constraint failed: accounts.username_l: SQLITE_CONSTRAINT
                let table = message.split('UNIQUE constraint failed: ')[1].split('.')[0];
                let column = message.split('UNIQUE constraint failed: ')[1].split('.')[1].split(':')[0];
                
                // error = new D1UniqueConstraintError(message, table, column);
                canRetry = false;
            } else if (message.includes('D1_ERROR') && message.includes('SQLITE_ERROR')) {
                // error = error as D1SyntaxError;
                canRetry = false;
                shouldReportError = true;
            } else {
                shouldReportError = true;
                canRetry = amountOfRetries < maxAmountOfRetries;
            }

            if (canRetry)
                return queryD1<T>(command, values, database, maxAmountOfRetries, amountOfRetries + 1);

            // throw error;
        }
        // D1_COLUMN_NOTFOUND
        // D1_DUMP_ERROR

        // throw internal.d1_error;
    }

    return null;
}