import { StatusPage } from "@/types/page";
import page from "configurations";

export async function getStatus(): Promise<StatusPage> {
    const res = await fetch(
        `${page.APIBaseUrl}/status`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pageId: page.pageId!,
                timeframe: '30d'
            })
        }
    );

    let response = await res.json() as StatusPage;

    // Format the date to be more readable
    response.monitorsData = response.monitorsData.map((monitorData: any) => {
        return monitorData.map((data: any) => {
            return {
                ...data,
                day: new Intl.DateTimeFormat('en-US' /* navigator.language */, {
                    month: 'short', // Short month format (e.g., "Nov")
                    day: 'numeric', // Numeric day (e.g., "16")
                }).format(new Date(data.day)),
                lastPing: new Date(data.lastPing)
            };
        });
    });

    return response;
}