export const moduleName = "audit-trail";

export type AuditAction =
  | "ASSET_CREATED"
  | "ASSET_UPDATED"
  | "ASSET_DELETED"
  | "STATUS_CHANGED"
  | "CHECKED_OUT"
  | "CHECKED_IN"
  | "MAINTENANCE_LOGGED"
  | "ASSET_DISPOSED"
  | "TRANSFER_INITIATED"
  | "TRANSFER_APPROVED"
  | "TRANSFER_REJECTED"
  | "USER_LOGIN"
  | "REPORT_DOWNLOADED";

export interface ActivityLog {
  id: string;
  asset_id: string;
  asset_name?: string;
  asset_code?: string;
  user_id: string;
  user_name?: string;
  action: AuditAction;
  field_changed?: string;
  old_value?: string;
  new_value?: string;
  ip_address?: string;
  created_at: string;
}

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  ASSET_CREATED: "Asset Created",
  ASSET_UPDATED: "Asset Updated",
  ASSET_DELETED: "Asset Deleted",
  STATUS_CHANGED: "Status Changed",
  CHECKED_OUT: "Checked Out",
  CHECKED_IN: "Checked In",
  MAINTENANCE_LOGGED: "Maintenance Logged",
  ASSET_DISPOSED: "Asset Disposed",
  TRANSFER_INITIATED: "Transfer Initiated",
  TRANSFER_APPROVED: "Transfer Approved",
  TRANSFER_REJECTED: "Transfer Rejected",
  USER_LOGIN: "User Login",
  REPORT_DOWNLOADED: "Report Downloaded",
};

export const AUDIT_ACTION_COLORS: Record<AuditAction, string> = {
  ASSET_CREATED: "#10b981",
  ASSET_UPDATED: "#3b82f6",
  ASSET_DELETED: "#ef4444",
  STATUS_CHANGED: "#f59e0b",
  CHECKED_OUT: "#8b5cf6",
  CHECKED_IN: "#06b6d4",
  MAINTENANCE_LOGGED: "#f97316",
  ASSET_DISPOSED: "#6b7280",
  TRANSFER_INITIATED: "#0ea5e9",
  TRANSFER_APPROVED: "#10b981",
  TRANSFER_REJECTED: "#ef4444",
  USER_LOGIN: "#6b7280",
  REPORT_DOWNLOADED: "#8b5cf6",
};