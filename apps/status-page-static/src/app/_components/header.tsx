"use client";

import Image from "next/image";
import { useSelectedLayoutSegment } from "next/navigation";

import type { PublicPage } from "@openstatus/db/src/schema";
import { allPlans } from "@openstatus/db/src/schema/plan/config";
import type { WorkspacePlan } from "@openstatus/db/src/schema/workspaces/validation";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Menu } from "./menu";
import { PageConfigurations } from "@/types/page";

type Props = {
  navigation: {
    label: string;
    href: string;
    segment: string | null;
    disabled?: boolean;
  }[];
  plan: WorkspacePlan;
  page: PageConfigurations;
};

export function Header({ navigation, plan, page }: Props) {
  const selectedSegment = useSelectedLayoutSegment();
  const isSubscribers = false; // allPlans[plan].limits["status-subscribers"]; // FIXME: use the workspace.limits

  return (
    <header className="sticky top-3 z-10 w-full">
      <div className="flex w-full items-center justify-between gap-8 rounded-full border border-border px-2.5 py-1.5 backdrop-blur-lg md:top-6">
        <div className="relative sm:w-[120px]">
          {page?.icon ? (
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
              <Image
                height={36}
                width={36}
                src={page.icon}
                alt={'Page icon'}
                className="object-cover"
                unoptimized={true}
              />
            </div>
          ) : null}
        </div>
        <ul className="hidden items-center space-x-1 sm:flex">
          {navigation.map(({ label, href, disabled, segment }) => {
            const active = segment === selectedSegment;
            return (
              <li key={segment}>
                <Link
                  className={cn(
                    "h-9 rounded-full bg-transparent px-4 py-2 font-medium text-muted-foreground hover:bg-accent/50",
                    { "text-foreground": active },
                  )}
                  {...{ href, disabled }}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-3">
          <div className="block sm:hidden">
            <Menu navigation={navigation} />
          </div>
          <div className="text-end sm:w-[120px]">
            {null /* Subscribe button here */}
          </div>
        </div>
      </div>
    </header>
  );
}
