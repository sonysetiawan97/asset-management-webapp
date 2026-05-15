import { atom } from "nanostores";
import type { BreadcrumbItem } from "@/types/Breadcrumbs";

export const breadcrumbsStore = atom<BreadcrumbItem[]>([]);
export const setBreadcrumbs = (breadcrumbs: BreadcrumbItem[]) => {
  breadcrumbsStore.set(breadcrumbs);
};
