export const moduleName = "opname";

export type OpnameStatus = "draft" | "in_progress" | "pending_approval" | "approved" | "closed";

export type CountedStatus = "match" | "mismatch" | "not_found" | "extra";

export interface OpnameSession {
  id: string;
  name: string;
  department_id?: string;
  location_id?: string;
  start_date: string;
  end_date?: string;
  status: OpnameStatus;
  notes?: string;
  total_items: number;
  counted_items: number;
  created_by: string;
  created_time: string;
  updated_time: string;
}

export interface CreateModel {
  name: string;
  department_id?: string;
  location_id?: string;
  start_date: string;
  end_date?: string;
  notes?: string;
}

export interface ReadModel extends OpnameSession {
  department?: { id: string; name: string };
  location?: { id: string; name: string };
  creator?: { id: string; first_name: string; last_name: string };
}

export type UpdateModel = CreateModel

export interface OpnameItem {
  id: string;
  session_id: string;
  asset_id: string;
  expected_status: string;
  expected_location_id?: string;
  expected_condition: string;
  counted_status?: CountedStatus;
  counted_location_id?: string;
  counted_condition?: string;
  counted_at?: string;
  counted_by?: string;
  notes?: string;
  adjustment_approved_by?: string;
  adjustment_approved_at?: string;
  asset?: {
    id: string;
    name: string;
    asset_code: string;
  };
  expected_location?: { id: string; name: string };
  counted_location?: { id: string; name: string };
  countedByUser?: { id: string; first_name: string; last_name: string };
}

export const OPNAME_STATUSES: { value: OpnameStatus; label: string; className: string }[] = [
  { value: "draft", label: "Draft", className: "status-badge--draft" },
  { value: "in_progress", label: "In Progress", className: "status-badge--in-progress" },
  { value: "pending_approval", label: "Pending Approval", className: "status-badge--pending-approval" },
  { value: "approved", label: "Approved", className: "status-badge--approved" },
  { value: "closed", label: "Closed", className: "status-badge--closed" },
];

export const COUNTED_STATUSES: { value: CountedStatus; label: string; className: string }[] = [
  { value: "match", label: "Match", className: "status-badge--match" },
  { value: "mismatch", label: "Mismatch", className: "status-badge--mismatch" },
  { value: "not_found", label: "Not Found", className: "status-badge--not-found" },
  { value: "extra", label: "Extra", className: "status-badge--extra" },
];

export const STATUS_COLORS: Record<OpnameStatus, { bg: string; text: string; dot: string }> = {
  draft: { bg: "#f3f4f6", text: "#374151", dot: "#9ca3af" },
  in_progress: { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
  pending_approval: { bg: "#fef3c7", text: "#78350f", dot: "#f59e0b" },
  approved: { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
  closed: { bg: "#e0f2fe", text: "#075985", dot: "#0ea5e9" },
};
