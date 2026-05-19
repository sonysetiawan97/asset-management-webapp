export const moduleName = "assets";

export type AssetStatus =
  | "available"
  | "in_use"
  | "under_maintenance"
  | "reserved"
  | "lost"
  | "disposed"
  | "pending_transfer";

export type AssetCondition = "new" | "good" | "fair" | "poor";

export interface Model {
  id: string;
  name: string;
  asset_code: string;
  serial_number: string;
  category_id: string;
  location_id: string;
  department_id: string;
  vendor_id: string;
  custodian_id: string;
  purchase_price: number;
  purchase_date: string;
  salvage_value: number;
  useful_life_years: number;
  book_value: number;
  asset_status: AssetStatus;
  condition: AssetCondition;
  warranty_start: string;
  warranty_end: string;
  license_key: string;
  license_expiry: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface CreateModel {
  name: string;
  asset_code: string;
  serial_number?: string;
  category_id: string;
  location_id?: string;
  department_id?: string;
  vendor_id?: string;
  custodian_id?: string;
  purchase_price: number;
  purchase_date: string;
  salvage_value?: number;
  useful_life_years?: number;
  condition?: AssetCondition;
  warranty_start?: string;
  warranty_end?: string;
  license_key?: string;
  license_expiry?: string;
  notes?: string;
}

export interface ReadModel extends Model {}

export interface UpdateModel {
  id: string;
  name: string;
  asset_code: string;
  serial_number?: string;
  category_id: string;
  location_id?: string;
  department_id?: string;
  vendor_id?: string;
  custodian_id?: string;
  purchase_price: number;
  purchase_date: string;
  salvage_value?: number;
  useful_life_years?: number;
  asset_status?: AssetStatus;
  condition?: AssetCondition;
  warranty_start?: string;
  warranty_end?: string;
  license_key?: string;
  license_expiry?: string;
  notes?: string;
}

export const ASSET_STATUSES: { value: AssetStatus; label: string; className: string }[] = [
  { value: "available", label: "Available", className: "status-badge--available" },
  { value: "in_use", label: "In Use", className: "status-badge--in-use" },
  { value: "under_maintenance", label: "Maintenance", className: "status-badge--maintenance" },
  { value: "reserved", label: "Reserved", className: "status-badge--reserved" },
  { value: "lost", label: "Lost", className: "status-badge--lost" },
  { value: "disposed", label: "Disposed", className: "status-badge--disposed" },
  { value: "pending_transfer", label: "Pending Transfer", className: "status-badge--pending" },
];

export const ASSET_CONDITIONS: { value: AssetCondition; label: string; className: string }[] = [
  { value: "new", label: "New", className: "condition-badge--new" },
  { value: "good", label: "Good", className: "condition-badge--good" },
  { value: "fair", label: "Fair", className: "condition-badge--fair" },
  { value: "poor", label: "Poor", className: "condition-badge--poor" },
];

export const STATUS_COLORS: Record<AssetStatus, { bg: string; text: string; dot: string }> = {
  available: { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
  in_use: { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
  under_maintenance: { bg: "#fef3c7", text: "#78350f", dot: "#f59e0b" },
  reserved: { bg: "#f3e8ff", text: "#6b21a8", dot: "#a855f7" },
  lost: { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
  disposed: { bg: "#f3f4f6", text: "#374151", dot: "#6b7280" },
  pending_transfer: { bg: "#e0f2fe", text: "#075985", dot: "#0ea5e9" },
};

export const CONDITION_COLORS: Record<AssetCondition, { bg: string; text: string }> = {
  new: { bg: "#d1fae5", text: "#065f46" },
  good: { bg: "#dbeafe", text: "#1e40af" },
  fair: { bg: "#fef3c7", text: "#78350f" },
  poor: { bg: "#fee2e2", text: "#991b1b" },
};