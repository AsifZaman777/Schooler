import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: "badge-success",
    inactive: "badge-danger",
    pending: "badge-warning",
    paid: "badge-success",
    overdue: "badge-danger",
    present: "badge-success",
    absent: "badge-danger",
    late: "badge-warning",
    excused: "badge-info",
    graduated: "badge-info",
    suspended: "badge-danger",
    "on-leave": "badge-warning",
    published: "badge-success",
    draft: "badge-warning",
    archived: "badge-info",
    scheduled: "badge-info",
    completed: "badge-success",
    cancelled: "badge-danger",
  };
  return map[status?.toLowerCase()] ?? "badge-info";
}
