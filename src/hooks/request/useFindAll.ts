import { useQuery } from "@tanstack/react-query";
import { findAll } from "@services/findAll";

export const useFindAll = <T>(
  queryKey: string,
  url: string,
  params?: Record<string, unknown>
) => {
  return useQuery<{ result: T[]; count: number }, Error>({
    queryKey: [queryKey],
    initialData: {
      result: [],
      count: 0,
    },
    queryFn: async () => {
      const { data } = await findAll<T>(url, params);
      return data;
    },
  });
};
