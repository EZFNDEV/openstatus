import { StatusPageDB } from "../database/statusPage";
import { Bindings } from "../types/bindings";
import pLimit from "p-limit";
import { MonitorData, Periodicity } from "../types/database/statusPage";
import { monitorCheck } from "./check";

function getNextPing(lastPing: Date, periodicity: Periodicity) {
    let periodicityInMS = 0;

    if (periodicity === '30s')
        periodicityInMS = 30 * 1000;
    else if (periodicity === '1m')
        periodicityInMS = 60 * 1000;
    else if (periodicity === '5m')
        periodicityInMS = 5 * 60 * 1000;
    else if (periodicity === '15m')
        periodicityInMS = 15 * 60 * 1000;
    else if (periodicity === '30m')
        periodicityInMS = 30 * 60 * 1000;
    else if (periodicity === '1h')
        periodicityInMS = 60 * 60 * 1000;
    else if (periodicity === '6h')
        periodicityInMS = 6 * 60 * 60 * 1000;
    else if (periodicity === '12h')
        periodicityInMS = 12 * 60 * 60 * 1000;
    else if (periodicity === '24h')
        periodicityInMS = 24 * 60 * 60 * 1000;

    return new Date(lastPing.getTime() + periodicityInMS);
} 

export default async function scheduled(_event: any, env: Bindings, _ctx: any) {
    const pages = await StatusPageDB.getPages(env);
    console.log(`Monitoring ${pages.length} pages`);

    const limit = pLimit(6); // Limit by cloudflare worker only
    
    const allTasks = pages.map((page) => {
        console.log(`Monitoring page: ${page.title}`);
        const monitorData = page.monitorsData;

        // Iterate through monitors
        return page.monitors.map((monitor, i) => {
            if (!monitor.active) return;

            // Check periodicity
            const lastPing = monitorData[i][0].lastPing || new Date(0);
            const nextPing = getNextPing(lastPing, monitor.periodicity);

            if (new Date() < nextPing) return;

            // Add monitoring task to the queue
            return limit(() => monitorCheck(monitor));
        });
    });

    const results = await Promise.all(allTasks.flat());

    const pagesResults = pages.map((page, i) => {
        return {
            page: page.id,
            monitorsData: page.monitorsData,
            monitors: results.slice(i * page.monitors.length, (i + 1) * page.monitors.length),
        };
    });

    // We could also add updateMultiple to the database?
    for(const pageResult of pagesResults) {
        let monitorData: MonitorData[] = pageResult.monitorsData;
        
        let updated: boolean = false;
        for(let i = 0; i < pageResult.monitors.length; i++) {
            const response = pageResult.monitors[i];
            if (!response) continue;

            // Update monitor data
            monitorData[i][0].count += 1;
            monitorData[i][0].ok += response.ok ? 1 : 0;
            monitorData[i][0].lastPing = response.endTime;

            updated = true;
        }

        if (!updated) continue;
        await StatusPageDB.updatePage(env, pageResult.page, {
            monitorsData: monitorData
        });
    }
}