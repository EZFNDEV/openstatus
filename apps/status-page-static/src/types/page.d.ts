import type { PublicPage, WorkspacePlan } from "@openstatus/db/src/schema";
import type { ResponseStatusTracker } from "@/lib/tb";

import type {
    Incident,
    Maintenance,
    StatusReport,
    StatusReportUpdate,
} from "@openstatus/db/src/schema";

export type APIType = 'self-hosted' | 'serverless' | 'official';

export interface StatusPage extends PublicPage {
    APIBaseUrl: string;
    APIType: APIType;
    APIKey?: string;
    pageId?: number;
    monitorsData: ResponseStatusTracker[];
}

export interface PageConfigurations {
    APIBaseUrl: string;
    APIType: APIType;
    APIKey?: string;
    pageId?: number;
    icon: string;
    passwordProtected?: boolean;
    workspacePlan: WorkspacePlan;
    slug: string;

    metadata: {
        title: string;
        description: string;
        imageBaseURL?: URL;
        twitter: {
            images: any | any[];
        },
        og: {
            images: any | any[];
        }
    }
}