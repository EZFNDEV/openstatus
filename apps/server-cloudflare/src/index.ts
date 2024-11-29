import { Hono, Context } from 'hono'
import { cors } from 'hono/cors';
import { handleError } from "@openstatus/api/src/errors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { publicRoute } from "./public";
import routes from './routes';
import scheduled from './cron';
import { Bindings } from './types/bindings';
import { StatusPageDB } from './database/statusPage';
import { setupPassword } from '../configurations';

const app = new Hono<{ Bindings: Bindings, strict: false }>();

// app.use("*", sentry({ dsn: process.env.SENTRY_DSN }));
app.use('/*', cors());

// @ts-ignore (Not sure why it's not working)
app.onError(handleError);

/**
 * Public Routes
 */
app.route("/public", publicRoute);

/**
 * Ping Pong
 */
// @ts-ignore (Not sure why it's not working)
app.use("/ping", logger());
app.get("/ping", (c) => c.json({ ping: "pong" }, 200));

/**
 * API Routes v1
 */
// app.route("/v1", api);

app.route('/', routes);

app.get('/setup', async (c) => {
	if (c.req.query('password') !== setupPassword)
		throw new HTTPException(401, { message: 'Unauthorized' });

	const response = await StatusPageDB.setup(c.env);
	if (!response)
		throw new HTTPException(500, { message: 'Failed to setup the database' });
	
	return c.json({ success: true });
});

export default {
	scheduled,
    async fetch(request: Request, env: Bindings, ctx: any) {
        return await app.fetch(request, env, ctx);
    }
}