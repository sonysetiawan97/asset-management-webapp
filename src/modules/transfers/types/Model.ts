export const moduleName = "transfers";

export type TransferStatus = "pending" | "approved" | "rejected";

export interface TransferRequest {
  id: string;
  asset_id: string;
  asset_name?: string;
  asset_code?: string;
  from_location_id: string;
  from_location_name?: string;
  to_location_id: string;
  to_location_name?: string;
  from_custodian_id: string;
  from_custodian_name?: string;
  to_custodian_id: string;
  to_custodian_name?: string;
  status: TransferStatus;
  reason: string;
  approved_by?: string;
  approved_by_name?: string;
  approved_at?: string;
  created_by: string;
  created_by_name?: string;
  created_time: string;
}

export interface CreateTransferModel {
  asset_id: string;
  from_location_id: string;
  to_location_id: string;
  from_custodian_id?: string;
  to_custodian_id?: string;
  reason: string;
}

export interface UpdateTransferModel extends CreateTransferModel {}

export interface ReadTransferModel extends TransferRequest {}

export const TRANSFER_STATUSES: { value: TransferStatus; label: string; className: string; dot: string }[] = [
  { value: "pending", label: "Pending", className: "transfer-badge--pending", dot: "#f59e0b" },
  { value: "approved", label: "Approved", className: "transfer-badge--approved", dot: "#10b981" },
  { value: "rejected", label: "Rejected", className: "transfer-badge--rejected", dot: "#ef4444" },
];