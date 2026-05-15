import { apiAxios } from "@/utils/apiAxios";
import type { AxiosRequestConfig, AxiosError } from "axios";

export const partialUpdate = async <T>(
  url: string,
  id: string,
  body: Partial<T>,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const { data } = await apiAxios.patch<T>(`${url}/${id}`, body, {
      headers: {
        "Content-Type": "application/json",
      },
      ...config,
    });
    return data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(`Error on fetching data: ${axiosError.message}`);
  }
};
