import { http, HttpResponse } from "msw";
import { faker } from "@faker-js/faker";

export const register = http.post("/auth/register", async ({ request }) => {
  const body = (await request.json()) as { username: string; email: string };

  if (!body.username || !body.email) {
    return HttpResponse.json(
      { message: "Username and email are required" },
      { status: 422 }
    );
  }

  return HttpResponse.json(
    {
      id: faker.number.int(),
      username: body.username,
      email: body.email,
      status: 1,
    },
    { status: 201 }
  );
});
