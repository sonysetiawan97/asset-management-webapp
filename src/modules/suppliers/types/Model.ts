export const moduleName = "suppliers";

export interface Model {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
}

export interface CreateModel {
  code: string;
  name: string;
  phone: string;
  email: string;
}

export interface ReadModel {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
}

export interface UpdateModel {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
}