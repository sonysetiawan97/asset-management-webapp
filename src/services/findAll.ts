import { apiAxios } from "@/utils/apiAxios";
import type { AxiosError } from "axios";

interface FindAllProps<T> {
  message?: string;
  code?: string;
  data: DataFindAllProps<T>;
}

interface DataFindAllProps<T> {
  result: T[];
  count: number;
}
function customEncode(obj: Record<string, unknown>): string {
  return Object.entries(obj)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");
}

export const findAll = async <T>(
  url: string,
  params?: Record<string, unknown>
): Promise<FindAllProps<T>> => {
  try {
    const { data } = await apiAxios.get<FindAllProps<T>>(url, {
      params,
      paramsSerializer: customEncode,
    });
    return data;
  } catch (error) {
    const { message } = error as unknown as AxiosError;
    throw new Error(`Error on fetching data: ${message}`);
  }
};
