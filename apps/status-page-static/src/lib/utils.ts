import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatDuration(ms: number) {
  let v = ms;
  if (ms < 0) v = -ms;
  const time = {
    day: Math.floor(v / 86400000),
    hour: Math.floor(v / 3600000) % 24,
    min: Math.floor(v / 60000) % 60,
    sec: Math.floor(v / 1000) % 60,
    ms: Math.floor(v) % 1000,
  };
  return Object.entries(time)
    .filter((val) => val[1] !== 0)
    .map(([key, val]) => `${val} ${key}${val !== 1 && key !== "ms" ? "s" : ""}`)
    .join(", ");
}

export function notEmpty<TValue>(
  value: TValue | null | undefined,
): value is TValue {
  return value !== null && value !== undefined;
}