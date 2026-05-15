# Testing

## Tools

| Tool | Version | Purpose |
|---|---|---|
| **MSW** (Mock Service Worker) | `^2.12.14` | API mocking in dev and tests |
| **Vitest** | `^4.1.2` | Unit testing framework |

## MSW (Mock Service Worker)

### Setup

**Key files**:
- `src/mocks/browser.ts` — Browser worker for dev mode
- `src/mocks/server.ts` — Node server for testing
- `src/mocks/setupTest.ts` — Vitest integration

**Run MSW** (initializes the browser worker in `public/`):
```bash
npm run msw
```
This generates the worker script in `public/` directory.

### Handler Structure

Handlers are organized by module in `src/mocks/handlers/`:

```
src/mocks/handlers/
├── index.ts        # Re-exports all handlers
├── auth/           # Auth handlers (signin, register, refresh)
│   ├── handlers.ts
│   ├── signin.ts
│   ├── register.ts
│   └── refresh.ts
├── errors/         # Error simulation (500, 401, slow)
│   ├── handlers.ts
│   ├── serverError.ts
│   ├── unauthorized.ts
│   └── slow.ts
└── products/       # Reference CRUD implementation
    ├── handlers.ts # Re-exports product handlers
    ├── create.ts
    ├── findAll.ts
    ├── findOne.ts
    ├── update.ts
    ├── softDelete.ts
    └── data/
        └── products.ts
```

### Creating a New Handler

Follow the `products/` pattern. Example (`src/mocks/handlers/users/findAll.ts`):

```ts
import { http, HttpResponse } from "msw";
import { mockUsers } from "./data/users";

export const findAll = http.get("/api/v1/users", ({ request }) => {
  const url = new URL(request.url);
  const skip = Number(url.searchParams.get("skip") || 0);
  const limit = Number(url.searchParams.get("limit") || 10);

  const data = mockUsers.slice(skip, skip + limit);
  return HttpResponse.json({ data, count: mockUsers.length }, { status: 200 });
});
```

> **Note**: MSW handlers mock the backend, so they use plain query params (`skip`, `limit`) — not the `!skip`, `!limit` convention used by the actual API service layer.

Then export from `src/mocks/handlers/users/handlers.ts`:

```ts
import { findAll } from "./findAll";
import { create } from "./create";
// ...

export const handlers = [findAll, create, /* ... */];
```

And update `src/mocks/handlers/index.ts`:

```ts
import { handlers as authHandlers } from "./auth/handlers";
import { handlers as errorHandlers } from "./errors/handlers";
import { handlers as productHandlers } from "./products/handlers";
// Add: import and spread new module handlers

export const handlers = [...authHandlers, ...errorHandlers, ...productHandlers];
```

### Dummy Data Utilities

Reusable dummy data helpers in `src/mocks/dummy/`:

| File | Purpose |
|---|---|---|
| `dummyGender.ts` | Gender options (Male/Female) |
| `dummyFruits.ts` | Fruit list for examples |
| `dummyStatus.ts` | Status values (0/1) |

Create new dummy data files alongside your handlers:

```ts
// src/mocks/handlers/users/data/users.ts
import { faker } from "@faker-js/faker";

export const mockUsers = Array.from({ length: 20 }, () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  status: 1,
}));
```

## Vitest

### Test Setup

`src/mocks/setupTest.ts` configures MSW for Vitest:

```ts
import { server } from "./server";

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

> Note: The app's MSW setup is designed for Vitest integration. Import `setupTest.ts` in your test files to activate the mock server before each test suite.

### Writing Tests

Create test files next to the component: `ComponentName.test.tsx`.

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ListPage } from "./ListPage";

describe("ListPage", () => {
  it("renders table with data", () => {
    render(<ListPage data={mockData} count={2} isLoading={false} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
```

### Running Tests

```bash
npm run test       # Run once
npm run test:ui    # Run with Vitest UI
```

## Mock Mode

Set `VITE_APP_MODE_MOCK=true` in `.env` to enable MSW for development. This is useful for frontend work when the backend is unavailable.

## Notes

- `products/`, `auth/`, and `errors/` handlers are implemented — use as reference
- Add handlers for other modules as needed (follow `products/` module pattern)
- Keep dummy data minimal but realistic; use Faker for variety
- Test coverage is not enforced — add tests for critical paths only
- State changes (create/update/delete) return new objects without mutating the mock data array — safe for hot-reload and tests
