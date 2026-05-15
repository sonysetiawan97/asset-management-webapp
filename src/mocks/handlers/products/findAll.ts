import { http, HttpResponse } from "msw";
import { mockProducts } from "./data/products";

export const findAll = http.get("/api/v1/products", ({ request }) => {
  const url = new URL(request.url);
  const skip = Number(url.searchParams.get("skip") || 0);
  const limit = Number(url.searchParams.get("limit") || 10);

  const entries = mockProducts.filter((entry) => entry.status === 1);

  const data = entries.slice(skip, skip + limit);
  const body = {
    data,
    count: entries.length,
  };
  return HttpResponse.json(body, { status: 200, statusText: "Data retrieve." });
});
