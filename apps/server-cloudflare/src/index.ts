import { Hono } from 'hono'
import { cors } from 'hono/cors';

import routes from './routes';
import scheduled from './cron';
import { Bindings } from './types/bindings';
import { StatusPageDB } from './database/statusPage';
import { setupPassword } from '../configurations';

const app = new Hono<{ Bindings: Bindings }>();

app.use('/*', cors())
app.route('/', routes);

app.get('/setup', async (c) => {
	if (c.req.query('password') !== setupPassword)
		return c.json({ error: 'Invalid password' }, 401);

	const response = await StatusPageDB.setup(c.env);
	if (!response)
		return c.json({ error: 'Failed to setup' }, 500);
	
	return c.json({ success: true });
});

export default {
	scheduled,
    async fetch(request: Request, env: Bindings, ctx: any) {
        return await app.fetch(request, env, ctx);
    }
}