import { columns } from "@/components/data-table/check/columns";
import { DataTable } from "@/components/data-table/check/data-table";
import { env } from "@/env";
import { api } from "@/trpc/server";
import { OSTinybird } from "@openstatus/tinybird";
import { searchParamsCache } from "./search-params";

const tb = new OSTinybird({ token: env.TINY_BIRD_API_KEY });

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ searchParams }: Props) {
  const { page, pageSize } = searchParamsCache.parse(searchParams);
  const data = await api.check.getChecksByWorkspace.query();

  return <div>{data ? <DataTable columns={columns} data={data} /> : null}</div>;
}