import { Hono } from 'hono'
import statusAPI from './status';

const app = new Hono();

app.route('/status', statusAPI);

export default app
