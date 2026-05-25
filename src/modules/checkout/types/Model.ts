export const moduleName = "checkouts";

export type CheckoutCondition = "new" | "good" | "fair" | "poor";

export interface CheckoutLog {
  id: string;
  asset_id: string;
  asset_name?: string;
  asset_code?: string;
  assigned_to: string;
  assigned_to_name?: string;
  checkout_date: string;
  expected_return_date: string;
  assigned_by: string;
  assigned_by_name?: string;
  return_date?: string;
  condition_on_return?: CheckoutCondition;
  notes?: string;
  created_time: string;
}

export interface CreateCheckoutModel {
  asset_id: string;
  assigned_to: string;
  expected_return_date: string;
  notes?: string;
}

export interface CheckinModel {
  return_date?: string;
  condition_on_return: CheckoutCondition;
  notes?: string;
}

export interface ReadCheckoutModel extends CheckoutLog {}

export const CONDITION_OPTIONS: { value: CheckoutCondition; label: string; className: string }[] = [
  { value: "new", label: "New", className: "condition-badge--new" },
  { value: "good", label: "Good", className: "condition-badge--good" },
  { value: "fair", label: "Fair", className: "condition-badge--fair" },
  { value: "poor", label: "Poor", className: "condition-badge--poor" },
];