export const moduleName = "roles";

export interface Model {
  id?: number | string;
  code?: string;
  name: string;
}

export interface ModelCreate {
  id?: number | string;
  code?: string;
  name: string;
  privilege?: Array<string> | string;
}
