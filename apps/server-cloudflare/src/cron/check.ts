import { Monitor } from "../types/database/statusPage";

export async function checkHTTP(monitor: Monitor) {
    const startTime = new Date();

    const controller = new AbortController();
    const signal = controller.signal;

    // For now we handle degradedAfter and timeout the same way
    let timeout: number = -1;
    if (monitor.degradedAfter && monitor.timeout) {
        timeout = Math.min(monitor.degradedAfter, monitor.timeout);
    } else if (monitor.degradedAfter) {
        timeout = monitor.degradedAfter;
    } else if (monitor.timeout) {
        timeout = monitor.timeout;
    }

    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(monitor.url, {
            headers: {
                "User-Agent": "OpenStatus/1.0",
            },
            signal: timeout !== -1 ? signal : undefined
        });

        clearTimeout(timeoutId);

        return {
            ok: response.ok,
            status: response.status,
            startTime: startTime,
            endTime: new Date()
        };
    } catch (error) {
        clearInterval(timeoutId);

        return {
            ok: false,
            status: 500,
            startTime: startTime,
            endTime: new Date()
        };
    }
}

export async function monitorCheck(monitor: Monitor) {
    if (monitor.jobType === 'http')
        return await checkHTTP(monitor);

    return {
        ok: false,
        status: 500,
        startTime: new Date(),
        endTime: new Date()
    };
}