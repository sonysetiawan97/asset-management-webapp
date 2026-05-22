export const moduleName = "departments";

export interface Model {
  id: string;
  name: string;
  code: string;
  description: string;
  manager_id: string | null;
  parent_id: string | null;
  headcount: number;
  budget: number;
  created_time: string;
  updated_time: string;
}

export interface CreateModel {
  name: string;
  code?: string;
  description?: string;
  manager_id?: string;
  parent_id?: string;
  budget?: number;
  headcount?: number;
}

export interface ReadModel extends Model {}

export interface UpdateModel extends CreateModel {}