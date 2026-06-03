export const moduleName = "transfers";

export type TransferType = "inter_department" | "inter_location" | "combined";
export type TransferStatus = "pending" | "approved" | "rejected";

export interface TransferRequest {
  id: string;
  asset_id: string;
  asset_name?: string;
  asset_code?: string;
  transfer_type: TransferType;
  from_department_id?: string;
  from_department_name?: string;
  to_department_id?: string;
  to_department_name?: string;
  from_location_id: string;
  from_location_name?: string;
  to_location_id?: string;
  to_location_name?: string;
  from_custodian_id?: string;
  from_custodian_name?: string;
  to_custodian_id?: string;
  to_custodian_name?: string;
  status: TransferStatus;
  reason: string;
  notes?: string;
  approved_by?: string;
  approved_by_name?: string;
  approved_at?: string;
  created_by: string;
  created_by_name?: string;
  created_time: string;
}

export interface CreateTransferModel {
  asset_id: string;
  transfer_type: TransferType;
  from_location_id?: string;
  to_location_id?: string;
  from_custodian_id?: string;
  to_custodian_id?: string;
  from_department_id?: string;
  to_department_id?: string;
  reason: string;
  notes?: string;
}

export interface UpdateTransferModel extends CreateTransferModel {}

export interface ReadTransferModel extends TransferRequest {}

export const TRANSFER_STATUSES: { value: TransferStatus; label: string; className: string; dot: string }[] = [
  { value: "pending", label: "Pending", className: "transfer-badge--pending", dot: "#f59e0b" },
  { value: "approved", label: "Approved", className: "transfer-badge--approved", dot: "#10b981" },
  { value: "rejected", label: "Rejected", className: "transfer-badge--rejected", dot: "#ef4444" },
];

export const TRANSFER_TYPES: { value: TransferType; label: string; className: string }[] = [
  { value: "inter_department", label: "Inter-Department", className: "transfer-type--inter-department" },
  { value: "inter_location", label: "Inter-Location", className: "transfer-type--inter-location" },
  { value: "combined", label: "Combined", className: "transfer-type--combined" },
];
