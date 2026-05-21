export const moduleName = "disposals";

export type DisposalStatus = "pending" | "approved" | "rejected";
export type DisposalMethod = "resale" | "scrapped" | "donated" | "recycled";

export interface DisposalRequest {
  id: string;
  asset_id: string;
  asset_name?: string;
  asset_code?: string;
  method: DisposalMethod;
  reason: string;
  sale_price?: number;
  buyer?: string;
  transaction_date?: string;
  certificate_ref?: string;
  status: DisposalStatus;
  approved_by?: string;
  approved_by_name?: string;
  approved_at?: string;
  created_by: string;
  created_by_name?: string;
  created_time: string;
}

export interface CreateDisposalModel {
  asset_id: string;
  method: DisposalMethod;
  reason: string;
  sale_price?: number;
  buyer?: string;
  transaction_date?: string;
  certificate_ref?: string;
}

export interface ReadDisposalModel extends DisposalRequest {}

export const DISPOSAL_METHODS: { value: DisposalMethod; label: string; className: string }[] = [
  { value: "resale", label: "Resale", className: "method-badge--resale" },
  { value: "scrapped", label: "Scrapped", className: "method-badge--scrapped" },
  { value: "donated", label: "Donated", className: "method-badge--donated" },
  { value: "recycled", label: "Recycled", className: "method-badge--recycled" },
];

export const DISPOSAL_STATUSES: { value: DisposalStatus; label: string; dot: string }[] = [
  { value: "pending", label: "Pending", dot: "#f59e0b" },
  { value: "approved", label: "Approved", dot: "#10b981" },
  { value: "rejected", label: "Rejected", dot: "#ef4444" },
];