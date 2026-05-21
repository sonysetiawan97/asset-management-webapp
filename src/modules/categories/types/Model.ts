export const moduleName = "categories";

export interface Model {
  id: string;
  name: string;
  parent_id: string | null;
  useful_life_years: number;
  salvage_value_pct: number;
  created_time: string;
  updated_time: string;
}

export interface CreateModel {
  name: string;
  parent_id: string | null;
  useful_life_years: number;
  salvage_value_pct: number;
}

export interface ReadModel {
  id: string;
  name: string;
  parent_id: string | null;
  useful_life_years: number;
  salvage_value_pct: number;
  created_time: string;
  updated_time: string;
}

export interface UpdateModel {
  name: string;
  parent_id: string | null;
  useful_life_years: number;
  salvage_value_pct: number;
}