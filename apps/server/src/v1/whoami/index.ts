import { OpenAPIHono } from "@hono/zod-openapi";
import type { Variables } from "..";
import { handleZodError } from "@openstatus/api/src/errors";
import { registerGetWhoami } from "./get";

export const whoamiApi = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: handleZodError,
});

registerGetWhoami(whoamiApi);
