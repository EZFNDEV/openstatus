## Getting Started 🚀

This is a basic serverless version of **OpenStatus** that you can self-host.  
[Demo](https://93da53f6.status-page-static.pages.dev)

---

## Limits/Costs

If you want to self-host for cost reasons, here’s a breakdown of the **Cloudflare free tier** costs and limitations:

### **Cloudflare D1**
- **Writing (used by the checker)**:
  - The free tier allows **100,000 rows written per day**, which supports approximately **70 monitors** with a **1-minute interval** before hitting the daily write limit.
- **Reading (used when opening the site)**:
  - The free tier allows **5 million rows read per day**.
  - Site views consume read operations, but considering the checker reads about **3,000 rows per day** with 70 monitors, you can **theoretically** handle **~5 million site views per day**.

---

### **Cloudflare Workers**
- **Requests**:
  - The free tier allows **100,000 requests per day**.
  - **Note**: Cron Triggers counts as one request toward this limit.
- **CPU Time**:
  - Limited to **10 milliseconds of CPU time per invocation**.
  - External operations (e.g., `fetch` calls) do not count toward this, but the time spent processing responses does.
- **Cron Job Execution Time**:
  - Each cron job must finish within **30 seconds**.
- **Conclusion**:
  - Avoid too many monitors to stay within the free-tier limits, and set a monitor timeout to avoid hitting the 30 seconds limit
  - The page will only function for **up to 100,000 requests per day**.

---

### **Cloudflare Pages**
- Cloudflare Pages has **no notable free-tier limits** for hosting static sites.  
- You don’t have to worry about requests or bandwidth limits here. Thank you, Cloudflare! 🎉

---

### **Conclusion**
The free tier is suitable for small projects with about **5-10 monitors** and fewer than **100,000 API requests (site views) per day**.

---

## Requirements

- [Cloudflare Account](https://www.cloudflare.com/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

---

## Setup

1. Clone the repository

```sh
git clone https://github.com/openstatushq/openstatus.git
```

2. Install dependencies

```sh
pnpm install
```

3. Setup the monitoring service

   Currently, only `apps/server-cloudflare` is supported.  
Scroll down to the **Setting up `server-cloudflare`** section to learn how to configure it.

4. Setup the page   
   To configure your status page, edit the `apps/status-page-static/configurations.ts` file to suit your needs.

   You must set the API that the page will use by modifying the `APIBaseUrl` with your Cloudflare Worker URL

```typescript
APIBaseUrl: 'https://openstatus-server-cloudflare.XXX.workers.dev', // Replace with your Worker URL
APIType: 'serverless', // Keep this as 'serverless' for the current setup
pageId: 1, // Required for serverless API, set it to the ID you set in `apps/server-cloudflare/configurations.ts`
```

5. Deploy the page   
  To publish the page, run the following command inside the `apps/status-page-static` directory:  
  ```sh
  pnpm pages:deploy
  ```

6. Connecting a custom domain  
  To connect a custom domain, go to your **Cloudflare Dashboard** → **Workers & Pages** → **status-page-static** → **Custom Domains**, and click **"Set up a custom domain"**.

### Setting up `server-cloudflare`
1. Go to your **Cloudflare Dashboard** → **Workers & Pages** → **D1 SQL Database**, and create a new database called `openstatus`
2. Create the `StatusPage` table by running the following SQL command in the Cloudflare console:
``` sql
CREATE TABLE StatusPage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    showMonitorValues BOOLEAN DEFAULT FALSE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    monitors TEXT,
    monitorsData TEXT,
    statusReports TEXT,
    slug TEXT,
    customDomain TEXT,
    published BOOLEAN DEFAULT TRUE,
    passwordProtected BOOLEAN DEFAULT FALSE,
    password TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    maintenances TEXT,
    incidents TEXT,
    workspaceId INTEGER,
    workspacePlan TEXT
)
```    
3. Modify `apps/server-cloudflare/wrangler.toml.example`

   Replace the placeholders with your D1 database details
   ```
    [[d1_databases]]
    database_name = "YOUR_DATABASE_NAME_HERE"
    database_id = "YOUR_DATABASE_ID_HERE"
   ```

   By default, the cron job runs every minute, you should modify it if you don't need to check every minute
   ```
    [triggers]
    crons = ["* * * * *"]
   ```

   Optionally, customize the worker name:
   ```
   name = "your-worker-name"
   ```
   Then rename the file to `wrangler.toml`

4. Configuring the page

   After creating the database, insert your initial values. For simplicity, an API endpoint is provided to assist with this step.

   Modify the template values in `apps/server-cloudflare/configurations.ts`

5. To deploy the Cloudflare Worker, navigate to the `apps/server-cloudflare` directory and run the following command:
```sh
wrangler deploy
```
A successful output should look like this:
```
Total Upload: 1140.42 KiB / gzip: 195.99 KiB
Worker Startup Time: 44 ms
Your worker has access to the following bindings:
- D1 Databases:
  - DB: openstatus (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)
Uploaded openstatus-server-cloudflare (8.04 sec)
Deployed openstatus-server-cloudflare triggers (2.50 sec)
  https://openstatus-server-cloudflare.XXXX.workers.dev
  schedule: * * * * *
Current Version ID: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
   ```

   Initialize the database by sending a request to your deployed Cloudflare Worker URL with the password you set in the configuration:

```sh
https://openstatus-server-cloudflare.XXXX.workers.dev?password=!VERY_SECURE_PASSWORD!
```

   Once that's done you can remove/comment the endpoint in `apps/server-cloudflare/index.ts` and then deploy it again.