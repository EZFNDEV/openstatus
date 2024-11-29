import { OpenAPIHono } from "@hono/zod-openapi";

import { handleZodError } from "@openstatus/api/src/errors";
import type { Variables } from "../index";
import { registerGetStatusReportUpdate } from "./get";
import { registerPostStatusReportUpdate } from "./post";

export const statusReportUpdatesApi = new OpenAPIHono<{
  Variables: Variables;
}>({
  defaultHook: handleZodError,
});

registerGetStatusReportUpdate(statusReportUpdatesApi);
registerPostStatusReportUpdate(statusReportUpdatesApi);
