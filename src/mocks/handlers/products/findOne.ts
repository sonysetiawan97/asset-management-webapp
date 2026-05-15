import { http, HttpResponse } from "msw";
import { mockProducts } from "./data/products";

export const findOne = http.get("/api/v1/products/:id", ({ params }) => {
  const { id } = params;

  const data = mockProducts.find((entry) => entry.id === id);

  if (!data) {
    return new HttpResponse(null, { status: 404, statusText: "Not found" });
  }

  return HttpResponse.json(data, { status: 200, statusText: "Data retrieve." });
});
