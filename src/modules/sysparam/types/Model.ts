export const moduleName = "sysparams";

export interface Model {
  id: string;
  group: string;
  key: string;
  value: string;
  long_value: string;
  status: 0 | 1;
}

export interface CreateModel {
  group: string;
  key: string;
  value: string;
  long_value: string;
  status: 0 | 1;
}

export interface ReadModel {
  id: string;
  name: string;
  nik: string;
  status: 0 | 1;
}

export interface UpdateModel {
  id: string;
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
