import { http, HttpResponse } from "msw";
import { faker } from "@faker-js/faker";

const mockUser = {
  id: faker.number.int(),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  username: faker.internet.username(),
  email: faker.internet.email(),
  status: 1,
};

const mockRole = {
  id: 1,
  name: "Admin",
  privileges: [
    { id: 1, name: "products.view" },
    { id: 2, name: "products.create" },
    { id: 3, name: "products.update" },
    { id: 4, name: "products.delete" },
  ],
};

// Valid credentials for dev testing
const VALID_USERNAME = "admin";
const VALID_PASSWORD = "password";

export const signin = http.post("/auth/signin", async ({ request }) => {
  const body = (await request.json()) as { username: string; password: string };

  if (body.username !== VALID_USERNAME || body.password !== VALID_PASSWORD) {
    return HttpResponse.json(
      { message: "Invalid username or password" },
      { status: 401 }
    );
  }

  return HttpResponse.json(
    {
      access_token: "mock_access_token_" + crypto.randomUUID(),
      refresh_token: "mock_refresh_token_" + crypto.randomUUID(),
      user: mockUser,
      role: mockRole,
    },
    { status: 200 }
  );
});
