import { createRoute, z } from "@hono/zod-openapi";

import { db, eq } from "@openstatus/db";
import { statusReport } from "@openstatus/db/src/schema";

import { HTTPException } from "hono/http-exception";
import { openApiErrorResponses } from "@openstatus/api/src/errors/openapi-error-responses";
import type { statusReportsApi } from "./index";
import { StatusReportSchema } from "./schema";

const getAllRoute = createRoute({
  method: "get",
  tags: ["status_report"],
  description: "Get all Status Reports",
  path: "/",
  request: {},
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(StatusReportSchema),
        },
      },
      description: "Get all status reports",
    },
    ...openApiErrorResponses,
  },
});

export function registerGetAllStatusReports(api: typeof statusReportsApi) {
  return api.openapi(getAllRoute, async (c) => {
    const workspaceId = c.get("workspaceId");

    const _statusReports = await db.query.statusReport.findMany({
      with: {
        statusReportUpdates: true,
        monitorsToStatusReports: true,
      },
      where: eq(statusReport.workspaceId, Number(workspaceId)),
    });

    if (!_statusReports) {
      throw new HTTPException(404, { message: "Not Found" });
    }

    const data = z.array(StatusReportSchema).parse(
      _statusReports.map((r) => ({
        ...r,
        statusReportUpdateIds: r.statusReportUpdates.map((u) => u.id),
        monitorIds: r.monitorsToStatusReports.map((m) => m.monitorId),
      })),
    );

    return c.json(data, 200);
  });
}
