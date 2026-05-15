import { useQuery } from "@tanstack/react-query";
import { findAll } from "@services/findAll";

interface UseListProps {
  module: string;
  skip?: number;
  limit?: number;
  params?: Record<string, unknown>;
}

const VITE_PAGE_LIMIT = Number(import.meta.env.VITE_PAGE_LIMIT) || 0;

export const useList = <T>({
  module,
  skip = 0,
  limit = VITE_PAGE_LIMIT,
  params,
}: UseListProps) => {
  const filteredParams = params ? formatParams(params) : {};

  return useQuery({
    queryKey: [module, skip, limit, filteredParams],
    queryFn: async () => {
      const response = await findAll<T>(module, {
        "!skip": skip,
        "!limit": limit,
        ...filteredParams,
      });
      return response;
    },
  });
};

function formatParams<T extends Record<string, unknown>>(
  params: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== "")
  ) as Partial<T>;
}
