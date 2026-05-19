export const moduleName = "notifications";

export type NotificationType =
  | "warranty_expiry"
  | "license_expiry"
  | "maintenance_due"
  | "overdue_checkin"
  | "asset_lost"
  | "checkout_approved"
  | "transfer_approved"
  | "transfer_rejected";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface ReadNotification extends Notification {}

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  warranty_expiry: "Warranty Expiry",
  license_expiry: "License Expiry",
  maintenance_due: "Maintenance Due",
  overdue_checkin: "Overdue Check-in",
  asset_lost: "Asset Lost",
  checkout_approved: "Checkout Approved",
  transfer_approved: "Transfer Approved",
  transfer_rejected: "Transfer Rejected",
};

export const NOTIFICATION_TYPE_ICONS: Record<NotificationType, string> = {
  warranty_expiry: "M480-80q18 0 33-6.5t27-18.5q-12-10-24-17.5t-36-7.5q-29 0-48.5-19.5T400-160q0-23 13-40.5t33-26.5q-17-11-27.5-28.5T405-300q0-35 24.5-59.5T489-384q35 0 59.5 24.5T573-300q0 20-10.5 37.5T535-235q20 9 33 26.5t13 40.5q0 24-19.5 43.5T480-96q-18 0-36 7.5t-24 17.5q12 12 27 18.5t33 6.5Z",
  license_expiry: "M140-160q-17 0-28.5-11.5T100-200v-560q0-17 11.5-28.5T140-800h680q17 0 28.5 11.5T860-760v560q0 17-11.5 28.5T820-160H140Z",
  maintenance_due: "M440-280v-80h80v80h-80Zm160 0v-80h80v80h-80ZM360-280v-80h80v80h-80Zm0 160v-80h80v80h-80ZM280-280v-80h80v80h-80Zm0 160v-80h80v80h-80Zm160-160v-80h80v80h-80Zm0 160v-80h80v80h-80Z",
  overdue_checkin: "M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Zm0-72q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Z",
  asset_lost: "M480-80q18 0 33-6.5t27-18.5q-12-10-24-17.5t-36-7.5q-29 0-48.5-19.5T400-160q0-23 13-40.5t33-26.5q-17-11-27.5-28.5T405-300q0-35 24.5-59.5T489-384q35 0 59.5 24.5T573-300q0 20-10.5 37.5T535-235q20 9 33 26.5t13 40.5q0 24-19.5 43.5T480-96q-18 0-36 7.5t-24 17.5q12 12 27 18.5t33 6.5ZM480-696Z",
  checkout_approved: "M240-160q-33 0-56.5-23.5T160-240v-560q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v560q0 33-23.5 56.5T720-160H240Zm120-160h320v-80H360v80Z",
  transfer_approved: "M520-80q-17 0-28.5-11.5T480-120q0-17 11.5-28.5T520-160h320q17 0 28.5 11.5T880-120q0 17-11.5 28.5T840-80H520Zm0-160q-17 0-28.5-11.5T480-320q0-17 11.5-28.5T520-360h320q17 0 28.5 11.5T880-320q0 17-11.5 28.5T840-240H520Z",
  transfer_rejected: "M480-80q18 0 33-6.5t27-18.5q-12-10-24-17.5t-36-7.5q-29 0-48.5-19.5T400-160q0-23 13-40.5t33-26.5q-17-11-27.5-28.5T405-300q0-35 24.5-59.5T489-384q35 0 59.5 24.5T573-300q0 20-10.5 37.5T535-235q20 9 33 26.5t13 40.5q0 24-19.5 43.5T480-96q-18 0-36 7.5t-24 17.5q12 12 27 18.5t33 6.5Z",
};