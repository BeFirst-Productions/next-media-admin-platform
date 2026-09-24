import type { ElementType } from "react";
import type { Role } from "@next-digital-crm/shared-types";

export interface NavItem {
  title: string;
  href: string;
  icon: ElementType;
  badge?: string;
  roles: readonly Role[];
  description?: string;
}

export interface NavSection {
  title: string;
  items: readonly NavItem[];
}
