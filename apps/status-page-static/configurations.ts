import { PageConfigurations } from "./src/types/page";

export const pageConfiguration: PageConfigurations = {
    APIBaseUrl: 'https://openstatus-server-cloudflare.XXXX.workers.dev',
    APIType: 'serverless',
    pageId: 1, // required for serverless

    icon: 'https://status.openstatus.dev/_next/image?url=https%3A%2F%2Fywhufit3czohfser.public.blob.vercel-storage.com%2Ffavicon-5KRUI2vACIJo6fdXzRgs2l6nyXkXk8.ico&w=96&q=75',
    workspacePlan: 'pro',
    slug: 'status-page-static',

    metadata: {
        title: 'OpenStatus',
        description: "A better way to monitor your API and your website. Don't let downtime or a slow response time ruin your user experience. Try the open-source synthetic monitoring platform for free!",
        imageBaseURL: new URL("https://www.openstatus.dev"),
        twitter: {
            images: ["/api/og"]
        },
        og: {
            images: ["/api/og"]
        }
    }
};

export default pageConfiguration;