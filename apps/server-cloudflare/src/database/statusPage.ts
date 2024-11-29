import knexLib from "knex";

import { Bindings } from "../types/bindings";
import { queryKnexD1 } from ".";
import { Monitor, MonitorData, StatusPage } from "../types/database/statusPage";
import { statusPage } from "../../configurations";

export namespace StatusPageDB {
    const knex = knexLib({ client: 'sqlite3' });
    const table = 'StatusPage';

    function defaultMonitorsData(monitors: Monitor[]): MonitorData[] {
        const todayUTC = new Date();
        todayUTC.setHours(0, 0, 0, 0);

        return Array.from({ length: monitors.length }, () => {
            return Array.from({ length: 45 }, (_, i) => {
                return {
                    day: new Date(todayUTC.getTime() - (i * 24 * 60 * 60 * 1000)),
                    count: 0,
                    ok: 0
                };
            });
        });
    }

    function convertPageResult(result: any): StatusPage {
        if (result.monitors && typeof result.monitors === 'string') {
            result.monitors = JSON.parse(result.monitors as string) as Monitor[];
        }

        if (result.monitorsData && typeof result.monitorsData === 'string') {
            result.monitorsData = JSON.parse(result.monitorsData as string) as { ok: number; count: number; day: Date; }[][];

            // Make sure its a DateObject
            result.monitorsData = result.monitorsData.map((monitorData: any) => {
                return monitorData.map((data: any) => {
                    return {
                        ...data,
                        day: new Date(data.day),
                        lastPing: data.lastPing ? new Date(data.lastPing) : undefined
                    };
                });
            });
        }

        // Automatically add the data if required, or fix issues
        const todayUTC = new Date();
        todayUTC.setHours(0, 0, 0, 0);

        if (!result.monitorsData || result.monitorsData.length !== result.monitors.length) {
            result.monitorsData = defaultMonitorsData(result.monitors);
        }

        for(let i = 0; i < result.monitorsData.length; i++) {
            const monitorsData = result.monitorsData[i];
            if (monitorsData.length !== 45) { // Shouldn't happen
                result.monitorsData[i] = Array.from({ length: 45 }, (_, i) => {
                    return {
                        day: new Date(todayUTC.getTime() - (i * 24 * 60 * 60 * 1000)),
                        count: 0,
                        ok: 0
                    };
                });
            }

            if (monitorsData[0].day.toISOString() !== todayUTC.toISOString()) {
                // Remove the last
                result.monitorsData[i].pop();

                // Add today
                result.monitorsData[i].unshift({
                    day: todayUTC,
                    count: 0,
                    ok: 0
                });
            }
        }

        return result as StatusPage;
    }

    export async function setup(env: Bindings): Promise<boolean> {
        const query = knex(table)
            .insert(statusPage)
            .toSQL();
        
        const result = await queryKnexD1(query, env.DB);
        if (!result)
            return false;
        
        return true;
    }

    export async function getPage(env: Bindings, id: number): Promise<StatusPage | null> {
        const query = knex(table)
            .where('id', id)
            .limit(1)
            .toSQL();

        const result = await queryKnexD1(query, env.DB);
        if (!result)
            return null;

        if (result.results.length === 0)
            return null;

        return convertPageResult(result.results[0]);
    }

    export async function getPages(env: Bindings): Promise<StatusPage[]> {
        const query = knex(table)
            .select()
            .toSQL();

        const result = await queryKnexD1(query, env.DB);
        if (!result)
            return [];

        return result.results.map((page: any) => convertPageResult(page));
    }

    export async function updatePage(env: Bindings, id: number, page: Partial<StatusPage>): Promise<boolean> {
        if (!id)
            return false;

        delete page.id;

        const query = knex(table)
            .where('id', id)
            .update({
                ...page,
                ...page.monitors ? {
                    monitors: JSON.stringify(page.monitors)
                } : {},
                ...page.monitorsData ? {
                    monitorsData: JSON.stringify(page.monitorsData)
                } : {}
            })
            .toSQL();

        const result = await queryKnexD1(query, env.DB);
        if (!result)
            return false;

        return result.meta.rows_written > 0;
    }
}