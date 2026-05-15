export const moduleName = "products";

export interface Model {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface CreateModel {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface ReadModel {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface UpdateModel {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}
