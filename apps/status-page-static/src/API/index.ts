import { StatusPage } from "@/types/page";
import page from "configurations";

import { getStatus as getStatusServerless } from "./serverless";

export async function getStatusReports() {
    const res = await fetch(
        'https://api.openstatus.dev/v1/monitor',
        {
            method: 'GET',
            headers: {
                'x-openstatus-key': page.APIKey!,
                'Content-Type': 'application/json',
            },
        },
    );

    const data = await res.json() as {}
}

export async function getStatus(): Promise<StatusPage | null> {
    try {
        if (page.APIType === 'serverless')
            return await getStatusServerless();
    } catch (e) {
        console.error(e);
    }

    return null;
}