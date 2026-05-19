export const moduleName = "vendors";

export type VendorCategory = "supplier" | "service_provider" | "manufacturer";

export interface Model {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  contact_person: string;
  category: VendorCategory;
  is_active: boolean;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface CreateModel {
  name: string;
  code: string;
  email?: string;
  phone?: string;
  address?: string;
  contact_person?: string;
  category: VendorCategory;
  is_active?: boolean;
  notes?: string;
}

export interface ReadModel {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  contact_person: string;
  category: VendorCategory;
  is_active: boolean;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateModel {
  id: string;
  name: string;
  code: string;
  email?: string;
  phone?: string;
  address?: string;
  contact_person?: string;
  category: VendorCategory;
  is_active?: boolean;
  notes?: string;
}

export const VENDOR_CATEGORIES: { value: VendorCategory; label: string }[] = [
  { value: "supplier", label: "Supplier" },
  { value: "service_provider", label: "Service Provider" },
  { value: "manufacturer", label: "Manufacturer" },
];

export const VENDOR_CATEGORY_COLORS: Record<VendorCategory, { bg: string; text: string; shadow: string }> = {
  supplier: { bg: "#dbeafe", text: "#1e40af", shadow: "inset 0 -2px 0 rgba(30, 64, 175, 0.2)" },
  service_provider: { bg: "#fef3c7", text: "#78350f", shadow: "inset 0 -2px 0 rgba(120, 53, 15, 0.2)" },
  manufacturer: { bg: "#d1fae5", text: "#065f46", shadow: "inset 0 -2px 0 rgba(6, 95, 70, 0.2)" },
};