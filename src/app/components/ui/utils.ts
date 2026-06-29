import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { NoteStatus, Priority } from "../../types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}




export const getStatusBadge = (s: NoteStatus) => ({
  active: "bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300",
  draft: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  archived: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  deleted: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
}[s]);

export const getPriorityBadge = (p: Priority) => ({
  low: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
}[p]);

export const getPriorityDot = (p: Priority) => ({
  low: "bg-blue-400", medium: "bg-amber-400", high: "bg-orange-500", urgent: "bg-red-500",
}[p]);
export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const fmtDateShort = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
