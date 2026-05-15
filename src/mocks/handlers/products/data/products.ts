import { faker } from "@faker-js/faker";
import type { CreateModel, Model } from "@modules/products/types/Model";

export const mockProducts: Model[] = Array.from({ length: 50 }, (_, i) => ({
  id: (i + 1).toString(),
  name: faker.food.vegetable(),
  status: 1,
}));

export const mockCreateProduct = (data: CreateModel): Model => {
  return { id: (mockProducts.length + 1).toString(), ...data };
};
