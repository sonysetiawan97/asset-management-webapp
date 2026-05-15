import { apiAxios } from "@/utils/apiAxios";
import type { AxiosError } from "axios";

interface FindOneByIdProps<T> {
  data: T;
}

export const findOneById = async <T>(url: string, id: string): Promise<T> => {
  try {
    const { data } = await apiAxios.get<FindOneByIdProps<T>>(`${url}/${id}`);
    return data.data;
  } catch (error) {
    const { message } = error as unknown as AxiosError;
    throw new Error(`Error on fetching data: ${message}`);
  }
};
