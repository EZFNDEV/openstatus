'use client';
import React from "react";
import Loading from "./loadingSkeleton";
import { subDays } from "date-fns";

import { EmptyState } from "@/components/dashboard/empty-state";
import { Header } from "@/components/dashboard/header";
import { Feed } from "@/components/status-page/feed";
import { MonitorList } from "@/components/status-page/monitor-list";
import { StatusCheck } from "@/components/status-page/status-check";
import { Separator } from "@openstatus/ui";
import { StatusPage } from "../types/page";
import { getStatus } from "@/API";

import type {
	Maintenance,
	StatusReportWithUpdates,
  } from "@openstatus/db/src/schema";

export default function Page() {
	const [ mounted, setMounted ] = React.useState(false);
	const [ apiPage, setAPIPage ] = React.useState<StatusPage>();
	const [ loading, setLoading ] = React.useState(false);
	const [ lastMaintenances, setLastMaintenances ] = React.useState<Maintenance[]>();
	const [ lastStatusReports, setLastStatusReports ] = React.useState<StatusReportWithUpdates[]>();

	React.useEffect(() => {
		setMounted(true);
		
		getStatus().then((data) => {
			if (!data) return; // TODO: Set error state

			setAPIPage(data);

			// @ts-ignore
			setLastMaintenances(data.maintenances?.filter((maintenance) => {
				const date = (maintenance.from instanceof Date ? maintenance.from : new Date(maintenance.from)).getTime();
				return date > subDays(new Date(), 7).getTime();
			}));

			// @ts-ignore
			setLastStatusReports(data.statusReports?.filter((report) => {
				return report.statusReportUpdates?.some(
					(update: any) => {
						const date = (update.date instanceof Date ? update.date : new Date(update.date)).getTime();
						return date > subDays(new Date(), 7).getTime();
					}
				);
			}));
			
			setLoading(false);
		});
	}, []);

	if (loading || apiPage == undefined || !mounted)
		return <Loading />;

	return (
		<div className="mx-auto flex w-full flex-col gap-12">
			<Header
				title={apiPage.title}
				description={apiPage.description}
				className="text-left"
			/>

			<StatusCheck
				statusReports={apiPage.statusReports}
				incidents={apiPage.incidents}
				maintenances={apiPage.maintenances}
			/>

			{apiPage.monitors?.length ? (
				<MonitorList
					monitors={apiPage.monitors}
					monitorsData={apiPage.monitorsData}
					statusReports={apiPage.statusReports}
					incidents={apiPage.incidents}
					maintenances={apiPage.maintenances}
					showMonitorValues={!!apiPage.showMonitorValues}
				/>
			) : (
				<EmptyState
					icon="activity"
					title="No monitors"
					description="The status page has no connected monitors."
				/>
			)}

			<Separator />

			{lastStatusReports?.length || lastMaintenances?.length ? (
				<Feed
					monitors={apiPage.monitors}
					maintenances={lastMaintenances ?? []}
					statusReports={lastStatusReports?.filter((report) => {
						return report.statusReportUpdates.some(
							(update) =>
							update.date.getTime() > subDays(new Date(), 7).getTime(),
						);
					}) ?? []}
				/>
			) : (
				<EmptyState
					icon="newspaper"
					title="No recent notices"
					description="There have been no reports within the last 7 days."
				/>
			)}
		</div>
	);
}
