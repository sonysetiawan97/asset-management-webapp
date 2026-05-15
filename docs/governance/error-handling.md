# Error Handling

## extractErrors Utility

**Location**: `src/utils/extractError.ts`

Parses an `AxiosError` and returns an array of error messages.

```ts
export const extractErrors = (error: unknown): string[] => {
  const axiosError = error as AxiosError<ErrorResponse>;
  const errors = axiosError.response?.data?.errors;

  if (Array.isArray(errors)) {
    return errors.map((e) => e.message);
  }

  return [axiosError.message];
};
```

## Error Response Format

The backend returns errors in this structure:

```ts
interface ErrorResponse {
  errors: { message: string }[];
}
```

Example response:

```json
{
  "errors": [
    { "message": "Email is required" },
    { "message": "Password must be at least 8 characters" }
  ]
}
```

## Usage Pattern

Use this pattern in all `catch` blocks:

```tsx
import { extractErrors } from "@utils/extractError";
import { useSnackbar } from "notistack";

const { enqueueSnackbar } = useSnackbar();

try {
  await createAsync({ url: moduleName, body: data });
  enqueueSnackbar("Success", { variant: "success" });
} catch (error: unknown) {
  const errors = extractErrors(error);
  errors.forEach((message) => enqueueSnackbar(message, { variant: "error" }));
}
```

## Fallback Behavior

If `response.data.errors` is missing or not an array, `extractErrors` falls back to `error.message` (the axios error message).

## TypeScript Safety

Always type errors as `unknown` and cast to `AxiosError`:

```tsx
catch (error: unknown) {
  const axiosError = error as AxiosError<ErrorResponse>;
  // ...
}
```

This prevents accidental access to undefined properties.
