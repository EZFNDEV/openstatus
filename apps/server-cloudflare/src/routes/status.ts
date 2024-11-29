import { Hono } from 'hono'

import { Bindings } from '../types/bindings';
import { RequestBody } from '../types/status';
import { StatusPageDB } from '../database/statusPage';

const app = new Hono<{ Bindings: Bindings }>();

function convertMonitorsData(monitorsData: { ok: number; count: number; day: Date }[][]): any {
    // Return 30d instead of 45 if we don't have enough data
    return monitorsData.map((monitorData: { ok: number; count: number; day: Date }[]) => {
        const earliestDate = monitorData.findIndex(data => data.count !== 0);
        const lastDate = /*monitorData.reverse().findIndex(data => data.count !== 0);*/ monitorData.length - 1;

        return monitorData.slice(
            0,
            (lastDate - earliestDate < 45 || earliestDate == -1) ? 30 : 45
        );
    });
}

app.post('/', async (c) => {
    const requestBody = await c.req.json() as RequestBody;

    if (!requestBody.pageId)
        return c.json({
            error: 'Page ID is required'
        }, 400);

    const page = await StatusPageDB.getPage(c.env, requestBody.pageId);
    if (!page)
        return c.json({
            error: 'Page not found'
        }, 404);

	return c.json({
		title: page.title,
		description: page.description,
		statusReports: [],
		showMonitorValues: true,
        // Remove data for security reasons
		monitors: page.monitors.map((monitor) => {
            return {
                id: monitor.id,
                name: monitor.name,
                description: monitor.description
            };
        }),
        monitorsData: convertMonitorsData(page.monitorsData),
		maintenances: [/*{
			message: 'Hello World',
			id: 1,
			title: 'Hello World',
			createdAt: new Date(),
			updatedAt: new Date(),
			workspaceId: 1,
			pageId: 1,
			from: new Date(),
			to: new Date(),
			monitors: [1, 2]
		}*/],
        incidents: []
	});
});

export default app
