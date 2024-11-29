import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { timing } from "hono/timing";

import { status } from "./status";

export const publicRoute = new Hono();
publicRoute.use("*", cors());
// @ts-ignore
publicRoute.use("*", logger());
// @ts-ignore
publicRoute.use("*", timing());

publicRoute.route("/status", status);
