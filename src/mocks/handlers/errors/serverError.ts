import { http, HttpResponse } from "msw";

/** Simulates a 500 Internal Server Error */
export const serverError = http.get("/api/v1/errors/500", () => {
  return HttpResponse.json(
    { message: "Internal Server Error" },
    { status: 500 }
  );
});