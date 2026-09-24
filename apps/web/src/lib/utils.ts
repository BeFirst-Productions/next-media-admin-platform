import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatRole(role: string): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super Administrator";
    case "ADMIN":
      return "Operations Administrator";
    case "SALES_STAFF":
      return "Sales Executive";
    case "MARKETING_TEAM":
      return "Marketing Lead";
    default:
      return role.replace(/_/g, " ");
  }
}
