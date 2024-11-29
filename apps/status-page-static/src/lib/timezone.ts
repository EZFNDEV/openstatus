import { format, getTimezoneOffset, utcToZonedTime } from "date-fns-tz";
import { headers } from "next/headers";

export function getServerTimezoneUTCFormat() {
  const now = new Date();
  const now_utc = new Date(now.toUTCString().slice(0, -4)); // remove the GMT end

  return format(now_utc, "LLL dd, y HH:mm:ss (z)", { timeZone: "UTC" });
}

export function getServerTimezoneFormat() {
  return format(new Date(), "LLL dd, y HH:mm:ss (z)");
}

export function formatDate(date: Date) {
  return format(date, "LLL dd, y", { timeZone: "UTC" });
}

export function formatDateTime(date: Date) {
  return format(date, "LLL dd, y HH:mm:ss zzz", { timeZone: "UTC" });
}

export function formatTime(date: Date) {
  return format(date, "HH:mm:ss zzz", { timeZone: "UTC" });
}