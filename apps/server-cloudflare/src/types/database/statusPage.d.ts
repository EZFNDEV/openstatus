export type Periodicity = '30s' | '1m' | '5m' | '15m' | '30m' | '1h' | '6h' | '12h' | '24h';

export interface Monitor {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    workspaceId: number;
    description: string;
    status: 'active' | 'error' | 'degraded';
    jobType: 'http' | 'tcp' | 'udp' | 'ping' | 'ssh' | 'rdp';
    periodicity: Periodicity;
    active: boolean;
    regions?: string[]; // Not supported on cloudflare workers
    timeout?: number;
    url: string;
    degradedAfter?: number;
    public?: boolean;
    assertions?: string;
    deletedAt?: Date;
}

export type MonitorData = {
    ok: number;
    count: number;
    day: Date;
    lastPing?: Date;
}[];

export interface StatusPage {
    id: number;
    
    //  Whether to show monitor values
    showMonitorValues: boolean;

    //  The title of the page
    title: string;

    //  The description of the page
    description: string;

    // Monitors
    monitors: Monitor[];

    // Monitors Data
    monitorsData: MonitorData[];
}