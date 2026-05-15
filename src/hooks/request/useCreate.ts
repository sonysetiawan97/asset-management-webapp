import { create } from "@services/create";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosRequestConfig } from "axios";

interface createProps<T> {
  url: string;
  body: T;
  config?: AxiosRequestConfig;
}

export const useCreate = <T>(queryKey: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<T, AxiosError, createProps<T>>({
    mutationFn: ({ url, body, config }) => {
      return create<T>(url, body, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
    },
    onError: (error) => {
      console.error("Create failed:", error);
    },
  });

  return {
    create: mutation.mutate,
    createAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
