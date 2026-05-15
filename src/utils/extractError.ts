import { AxiosError } from "axios";

type ErrorResponse = {
  errors?: { message: string }[];
  [key: string]: unknown;
};

export const extractErrors = (error: unknown): string[] => {
  const axiosError = error as AxiosError<ErrorResponse>;
  const errors = axiosError.response?.data?.errors;

  if (Array.isArray(errors)) {
    return errors.map((e) => e.message);
  }

  return [axiosError.message];
};
