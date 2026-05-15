import type { ReactNode } from 'react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: ReactNode;
}