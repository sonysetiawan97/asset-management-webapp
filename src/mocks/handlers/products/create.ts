import { http, HttpResponse } from "msw";
import type { CreateModel } from "@modules/products/types/Model";

export const create = http.post("/api/v1/products", async ({ request }) => {
  const data = (await request.json()) as CreateModel;
  // Return new product without mutating shared state — safe for tests & hot-reload
  const product = { id: crypto.randomUUID(), ...data, status: 1 };
  return HttpResponse.json(product, { status: 201 });
});
