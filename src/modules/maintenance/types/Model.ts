export const moduleName = "maintenance";

export type MaintenanceType = "scheduled" | "corrective" | "preventive" | "inspection";

export interface MaintenanceLog {
  id: string;
  asset_id: string;
  asset_name?: string;
  asset_code?: string;
  type: MaintenanceType;
  date_performed: string;
  performed_by?: string;
  performed_by_name?: string;
  description: string;
  cost?: number;
  next_maintenance_date?: string;
  status: "open" | "completed";
  created_by: string;
  created_by_name?: string;
  created_at: string;
}

export interface CreateMaintenanceModel {
  asset_id: string;
  type: MaintenanceType;
  date_performed: string;
  performed_by?: string;
  description: string;
  cost?: number;
  next_maintenance_date?: string;
}

export interface CompleteMaintenanceModel {
  date_performed: string;
  performed_by?: string;
  description: string;
  cost?: number;
  next_maintenance_date?: string;
}

export interface ReadMaintenanceModel extends MaintenanceLog {}

export const MAINTENANCE_TYPES: { value: MaintenanceType; label: string; className: string }[] = [
  { value: "scheduled", label: "Scheduled", className: "maint-badge--scheduled" },
  { value: "corrective", label: "Corrective", className: "maint-badge--corrective" },
  { value: "preventive", label: "Preventive", className: "maint-badge--preventive" },
  { value: "inspection", label: "Inspection", className: "maint-badge--inspection" },
];