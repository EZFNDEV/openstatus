'use client';
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@openstatus/ui/src/components/button";

import { EmptyState } from "@/components/dashboard/empty-state";
import { Header } from "@/components/dashboard/header";
// import { SimpleChart } from "@/components/monitor-charts/simple-chart";
// import { groupDataByTimestamp } from "@/components/monitor-charts/utils";
// import { prepareMetricByIntervalByPeriod } from "@/lib/tb";
import React from "react";
import { StatusPage } from "@/types/page";
import Loading from "../loadingSkeleton";
import page from "configurations";
import { set } from "date-fns";

// Add loading page

export default function Page() {
    const [ mounted, setMounted ] = React.useState(false);
	const [ apiPage, setAPIPage ] = React.useState<StatusPage>();
	const [ loading, setLoading ] = React.useState(false);
	const [ period, setPeriod ] = React.useState<'7d'>('7d');
	const [ quantile, setQuantile ] = React.useState<95>(95);

	//const { quantile, period } = searchParamsCache.parse(searchParams);

	// filter monitor by public or not

	//const publicMonitors = page.monitors.filter((monitor) => monitor.public);

	const monitorsWithData =
		/*publicMonitors.length > 0
		? await Promise.all(
			publicMonitors?.map(async (monitor) => {
				const type = monitor.jobType as "http" | "tcp";
				const data = await prepareMetricByIntervalByPeriod(
				period,
				type,
				).getData({
				monitorId: String(monitor.id),
				interval: 60,
				});

				return { monitor, data };
			}),
			)
		:*/ undefined;

	React.useEffect(() => {
		setMounted(true);
		
		fetch('http://localhost:8787')
			.then((res) => res.json())
			.then((data) => {
				setAPIPage(data);
				setLoading(false);
			});
	}, []);

	if (loading || apiPage == undefined || !mounted)
		return <Loading />;

	return (
		<div className="grid gap-8">
			<Header
				title={apiPage.title}
				description={apiPage.description}
				className="text-left"
			/>

			{monitorsWithData ? (
				/*<div className="grid gap-6">
					<p className="text-muted-foreground">
						Response time over the{" "}
						<span className="font-medium text-foreground">last {period}</span>{" "}
						across{" "}
						<span className="font-medium text-foreground">
						all selected regions
						</span>{" "}
						within a{" "}
						<span className="font-medium text-foreground">p95 quantile</span>.
					</p>
					<ul className="grid gap-6">
						{monitorsWithData?.map(({ monitor, data }) => {
							const group =
								data.data && groupDataByTimestamp(data.data, period, quantile);
							return (
								<li key={monitor.id} className="grid gap-2">
								<div className="flex w-full min-w-0 items-center justify-between gap-3">
									<div className="w-full min-w-0">
									<p className="font-semibold text-sm">{monitor.name}</p>
									<p className="truncate text-muted-foreground text-sm">
										{monitor.url}
									</p>
									</div>
									<Button variant="link" size="sm" asChild>
									<Link href={`./monitors/${monitor.id}`}>
										Details <ChevronRight className="h-4 w-4" />
									</Link>
									</Button>
								</div>
								{group ? (
									<SimpleChart data={group.data} region="ams" />
								) : (
									<p>missing data</p>
								)}
								</li>
							);
						})}
					</ul>
				</div>*/
				<></>
			) : (
				<EmptyState
					icon="activity"
					title="No public monitors"
					description="No public monitors have been added to this page."
				/>
			)}
		</div>
	);
}
