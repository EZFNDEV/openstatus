import { Monitor } from "./src/types/database/statusPage";

export const setupPassword = '!VERY_SECURE_PASSWORD!';

export const statusPage = {
    id: 1,
    title: 'OpenStatus Status Page',
    description: 'Our own status page 🚀',
    monitors: JSON.stringify([
        {
            id: 0,
            name: 'OpenStatus',
            createdAt: new Date(),
            updatedAt: new Date(),
            workspaceId: 1,
            description: 'Our website 🌐',
            status: 'active',
            jobType: 'http',
            periodicity: '30s',
            active: true,
            regions: [],
            timeout: 5000,
            url: 'https://www.openstatus.dev',
            degradedAfter: 5000,
            public: true,
            assertions: ''
        } as Monitor,
        {
            id: 1,
            name: 'OpenStatus Status Page',
            createdAt: new Date(),
            updatedAt: new Date(),
            workspaceId: 1,
            description: 'We are monitoring our own Status Page 📝',
            status: 'active',
            jobType: 'http',
            periodicity: '30s',
            active: true,
            regions: [],
            timeout: 5000,
            url: 'https://status.openstatus.dev/',
            degradedAfter: 5000,
            public: true,
            assertions: ''
        } as Monitor,
        {
            id: 2,
            name: 'OpenStatus API',
            createdAt: new Date(),
            updatedAt: new Date(),
            workspaceId: 1,
            description: 'Our API Server 🔌',
            status: 'active',
            jobType: 'http',
            periodicity: '30s',
            active: true,
            regions: [],
            timeout: 5000,
            url: 'https://api.openstatus.dev/ping',
            degradedAfter: 5000,
            public: true,
            assertions: ''
        } as Monitor,
        {
            id: 3,
            name: 'OpenStatus Astro Status Page',
            createdAt: new Date(),
            updatedAt: new Date(),
            workspaceId: 1,
            description: '',
            status: 'active',
            jobType: 'http',
            periodicity: '30s',
            active: true,
            regions: [],
            timeout: 5000,
            url: 'https://astro.openstat.us/',
            degradedAfter: 5000,
            public: true,
            assertions: ''
        } as Monitor
    ]),
    statusReports: [],
    incidents: [],
    maintenances: [],
    showMonitorValues: false,
    workspaceId: 1
};