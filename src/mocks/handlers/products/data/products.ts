import { faker } from "@faker-js/faker";
import type { CreateModel, Model } from "@modules/products/types/Model";

export const mockProducts: Model[] = Array.from({ length: 50 }, (_, i) => ({
  id: (i + 1).toString(),
  name: faker.food.vegetable(),
  description: faker.commerce.productDescription(),
  price: Number(faker.commerce.price()),
  stock: faker.number.int({ min: 0, max: 100 }),
}));

export const mockCreateProduct = (data: CreateModel): Model => {
  return { id: (mockProducts.length + 1).toString(), ...data };
};
