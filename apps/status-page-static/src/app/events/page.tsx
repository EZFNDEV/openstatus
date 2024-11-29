'use client';
import { Header } from "@/components/dashboard/header";
import { Feed } from "@/components/status-page/feed";
import { formatter } from "./utils";
import React from "react";
import Loading from "../loadingSkeleton";
import { StatusPage } from "@/types/page";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@openstatus/ui/src/components/select";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

function SearchParamsPreset<T extends string>({
	defaultValue,
	values,
	value,
	setValue,
	formatter,
	className,
}: {
	defaultValue?: T;
	values: readonly T[] | T[];
	value: string;
	setValue: React.Dispatch<React.SetStateAction<string>>;
	formatter?(value: T): ReactNode;
	className?: string;
}) {
	return (
		<Select
			defaultValue={defaultValue}
			value={value || defaultValue}
			onValueChange={setValue}
		>
			<SelectTrigger
				className={cn("w-[150px] bg-background text-left", className)}
			>
				<span className="flex items-center gap-2">
					<SelectValue />
				</span>
			</SelectTrigger>

			<SelectContent>
				{values.map((value) => (
					<SelectItem key={value} value={value}>
					{formatter?.(value) || value}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

export default function Page() {
	const [ mounted, setMounted ] = React.useState(false);
	const [ apiPage, setAPIPage ] = React.useState<StatusPage>();
	const [ loading, setLoading ] = React.useState(false);
	const [ filter, setFilter ] = React.useState("all");

	React.useEffect(() => {
		setMounted(true);

		if (typeof window === "undefined") return;

		const currentURL = new URL(window.location.href);
		if (currentURL.searchParams.has("filter")) {
			setFilter(currentURL.searchParams.get("filter") || "all");
		}
		
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
				actions={
					<SearchParamsPreset
						value={filter}
						setValue={setFilter}
						defaultValue={filter}
						values={["all", "maintenances", "reports"]}
						className="w-auto sm:w-[150px]"
						formatter={formatter}
					/>
				}
				className="text-left"
			/>

			<Feed
				monitors={apiPage.monitors}
				maintenances={
					["all", "maintenances"].includes(filter) ? apiPage.maintenances : []
				}
				statusReports={
					["all", "reports"].includes(filter) ? apiPage.statusReports : []
				}
			/>
		</div>
	);
}
