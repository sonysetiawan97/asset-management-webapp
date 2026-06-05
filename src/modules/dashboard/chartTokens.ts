export const CHART_COLORS = [
  "#f59e0b",
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#6b7280",
];

export const STATUS_COLORS: Record<string, string> = {
  available: "#10b981",
  in_use: "#f59e0b",
  under_maintenance: "#ef4444",
  reserved: "#8b5cf6",
  lost: "#6b7280",
  pending_transfer: "#06b6d4",
};

export const STATUS_LABELS: Record<string, string> = {
  available: "Available",
  in_use: "In Use",
  under_maintenance: "Maintenance",
  reserved: "Reserved",
  lost: "Lost",
  pending_transfer: "Pending Transfer",
};

export const MAINTENANCE_COLORS: Record<string, string> = {
  scheduled: "#3b82f6",
  corrective: "#ef4444",
  preventive: "#10b981",
  inspection: "#f59e0b",
};

export const MAINTENANCE_LABELS: Record<string, string> = {
  scheduled: "Scheduled",
  corrective: "Corrective",
  preventive: "Preventive",
  inspection: "Inspection",
};
