import { OpenAPIHono } from "@hono/zod-openapi";

import { handleZodError } from "@openstatus/api/src/errors";
import type { Variables } from "../index";
import { registerPostPageSubscriber } from "./post";

export const pageSubscribersApi = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: handleZodError,
});

registerPostPageSubscriber(pageSubscribersApi);
