export const moduleName = "privileges";

export interface Model {
  id: string;
  module: string,
  submodule: string,
  ordering: number,
  action: string,
  method: string,
  uri: string,
  status: 0 | 1;
}

export interface CreateModel {
  name: string;
  nik: string;
  status: 0 | 1;
}

export interface ReadModel {
  id: string;
  name: string;
  nik: string;
  status: 0 | 1;
}

export interface UpdateModel {
  name: string;
  nik: string;
  status: 0 | 1;
}

interface PrivilegeMapping {
  id: number;
  module: string;
  submodule: string;
  ordering: string;
  action: string;
  method: string;
  uri: string;
  created_by: string | null;
  updated_by: string | null;
  created_time: string;
  updated_time: string;
  status: number;
}

interface PrivilegeGroup {
  name: string;
  mapping: PrivilegeMapping[];
}

export interface ApiResponsePrivilegeMapping {
  data: PrivilegeGroup[];
}

interface PrivilegeOptionMapping {
  label: string;
  value: string;
}

export interface PrivilegeOption {
  name: string;
  mapping: PrivilegeOptionMapping[];
}