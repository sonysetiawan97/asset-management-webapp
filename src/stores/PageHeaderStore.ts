import type { PageHeaderProps } from "@/types/PageHeader";
import { atom } from "nanostores";

export const pageHeaderStore = atom<PageHeaderProps>({ title: "" });

export const setPageTitle = (title: string) => {
  pageHeaderStore.set({ title, ...pageHeaderStore });
};
