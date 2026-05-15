import { http, HttpResponse } from "msw";

/** Simulates a slow network response (2 second delay) */
export const slow = http.get("/api/v1/errors/slow", async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return HttpResponse.json({ message: "Delayed response" }, { status: 200 });
});