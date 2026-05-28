export const moduleName = "scan";

export interface AssetLookupResult {
  id: string;
  name: string;
  asset_code: string;
  serial_number: string;
  asset_status: string;
  condition: string;
  location_id: string | null;
  location_name: string | null;
  department_id: string | null;
  department_name: string | null;
  custodian_id: string | null;
  custodian_name: string | null;
  category_id: string | null;
  category_name: string | null;
  purchase_date: string | null;
  purchase_price: number | null;
  notes: string | null;
  book_value: number | null;
  useful_life_years: number | null;
  created_time: string;
}
