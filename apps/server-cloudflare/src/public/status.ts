import { Hono } from "hono";
import { endTime, startTime } from "hono/timing";
import { Status } from "@openstatus/tracker";

import { StatusPageDB } from "../database/statusPage";
import { Bindings } from "../types/bindings";

export const status = new Hono<{ Bindings: Bindings, strict: false }>();

status.get("/:id", async (c) => {
	const { id } = c.req.param();

	// @ts-ignore
	startTime(c, "database");

	const currentPage = await StatusPageDB.getPage(c.env, parseInt(id) || 0);

	if (!currentPage)
		return c.json({ status: Status.Unknown });
	
	// @ts-ignore
	endTime(c, "database");

	// WIP!
	return c.json({
		status: 'operational'
	});
});