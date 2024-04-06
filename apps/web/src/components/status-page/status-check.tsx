import type {
  Incident,
  Maintenance,
  StatusReport,
} from "@openstatus/db/src/schema";
import type { StatusVariant } from "@openstatus/tracker";
import { Tracker } from "@openstatus/tracker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@openstatus/ui";

import {
  getServerTimezoneFormat,
  getServerTimezoneUTCFormat,
} from "@/lib/timezone";
import { cn } from "@/lib/utils";
import { Icons } from "../icons";

export async function StatusCheck({
  statusReports,
  incidents,
  maintenances,
}: {
  statusReports: StatusReport[];
  incidents: Incident[];
  maintenances: Maintenance[];
}) {
  const tracker = new Tracker({ statusReports, incidents, maintenances });
  const className = tracker.currentClassName;
  const details = tracker.currentDetails;

  const formattedUTCServerDate = getServerTimezoneUTCFormat();
  const formattedServerDate = getServerTimezoneFormat();

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <h2 className="font-semibold text-xl">{details.long}</h2>
        <span className={cn("rounded-full border p-1.5", className)}>
          <StatusIcon variant={details.variant} />
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <p className="text-muted-foreground text-xs">Status Check</p>
        <span className="text-muted-foreground/50 text-xs">•</span>{" "}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="text-muted-foreground text-xs underline decoration-dashed underline-offset-4">
              {formattedServerDate}
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-muted-foreground text-xs">
                {formattedUTCServerDate}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export function StatusIcon({ variant }: { variant: StatusVariant }) {
  if (variant === "incident") {
    const AlertTriangleIcon = Icons["alert-triangle"];
    return <AlertTriangleIcon className="h-5 w-5 text-background" />;
  }
  if (variant === "maintenance") {
    return <Icons.hammer className="h-5 w-5 text-background" />;
  }
  if (variant === "degraded") {
    return <Icons.minus className="h-5 w-5 text-background" />;
  }
  if (variant === "down") {
    return <Icons.minus className="h-5 w-5 text-background" />;
  }
  return <Icons.check className="h-5 w-5 text-background" />;
}
