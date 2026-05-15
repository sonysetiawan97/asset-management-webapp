import { http, HttpResponse } from "msw";
import { mockProducts } from "./data/products";

export const softDelete = http.patch(
  "/api/v1/products/:id/delete",
  async ({ params }) => {
    const { id } = params;

    const existing = mockProducts.find((entry) => entry.id === id);

    if (!existing) {
      return HttpResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Return soft-deleted record without mutating the shared array
    const deleted = { ...existing, status: 0 };
    return HttpResponse.json(deleted, { status: 200 });
  }
);
