import type { z } from "zod";

import type {
  Incident,
  Maintenance,
  PublicMonitor,
  selectPublicStatusReportSchemaWithRelation,
} from "@openstatus/db/src/schema";
import type { ResponseStatusTracker } from "@/lib/tb";

import { Tracker } from "../tracker/tracker";

export const MonitorList = ({
  monitors,
  monitorsData,
  statusReports,
  incidents,
  maintenances,
  showMonitorValues,
}: {
  monitors: PublicMonitor[];
  monitorsData: ResponseStatusTracker[];
  statusReports: z.infer<typeof selectPublicStatusReportSchemaWithRelation>[];
  incidents: Incident[];
  maintenances: Maintenance[];
  showMonitorValues?: boolean;
}) => {
	return (
		<div className="grid gap-4">
			{monitors.map((monitor, _index) => {
				const monitorStatusReport = statusReports.filter((statusReport) =>
					statusReport.monitorsToStatusReports.some(
					(i) => i.monitor.id === monitor.id,
					),
				);

				const monitorIncidents = incidents.filter(
					(incident) => incident.monitorId === monitor.id,
				);
				
				const monitorMaintenances = maintenances.filter((maintenance) =>
					maintenance.monitors?.includes(monitor.id),
				);

				return (
					<Tracker
						key={_index}
						// @ts-ignore uhm, this should be fixed
						data={monitorsData[_index]}
						reports={monitorStatusReport}
						incidents={monitorIncidents}
						maintenances={monitorMaintenances}
						showValues={showMonitorValues}
						{...monitor}
					/>
				);
			})}
		</div>
	);
};
