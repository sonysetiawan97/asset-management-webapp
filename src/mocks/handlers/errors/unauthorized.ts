import { http, HttpResponse } from "msw";

/** Simulates a 401 Unauthorized response */
export const unauthorized = http.get("/api/v1/errors/401", () => {
  return HttpResponse.json(
    { message: "Unauthorized" },
    { status: 401 }
  );
});