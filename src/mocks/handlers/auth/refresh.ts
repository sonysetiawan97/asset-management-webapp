import { http, HttpResponse } from "msw";

export const refresh = http.post("/auth/refresh", async ({ request }) => {
  const authHeader = request.headers.get("Authorization") ?? "";
  const refreshToken = authHeader.replace("Bearer ", "");

  if (!refreshToken) {
    return HttpResponse.json(
      { message: "Refresh token required" },
      { status: 401 }
    );
  }

  return HttpResponse.json(
    {
      access_token: "mock_access_token_" + crypto.randomUUID(),
      refresh_token: "mock_refresh_token_" + crypto.randomUUID(),
    },
    { status: 200 }
  );
});
