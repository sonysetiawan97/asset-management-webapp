import { http, HttpResponse } from "msw";
import { mockProducts } from "./data/products";
import type { UpdateModel } from "@modules/products/types/Model";

export const update = http.put(
  "/api/v1/products/:id/update",
  async ({ request, params }) => {
    const { id } = params;
    const data = (await request.json()) as UpdateModel;

    const existing = mockProducts.find((entry) => entry.id === id);

    if (!existing) {
      return HttpResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Return merged result without mutating the shared array
    const updated = { ...existing, ...data };
    return HttpResponse.json(updated, { status: 200 });
  }
);
