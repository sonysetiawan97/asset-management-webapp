import { apiAxios } from "@/utils/apiAxios";
import type { AxiosRequestConfig, AxiosError } from "axios";

export const create = async <T>(
  url: string,
  body: T,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const { data } = await apiAxios.post<T>(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
      ...config,
    });
    return data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError;
  }
};
