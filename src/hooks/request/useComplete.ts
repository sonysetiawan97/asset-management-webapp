import { useMutation, useQueryClient } from "@tanstack/react-query";
import { complete } from "@services/complete";
import type { AxiosError, AxiosRequestConfig } from "axios";

interface CompleteMutationProps<T> {
  url: string;
  id: string;
  body: T;
  config?: AxiosRequestConfig;
}

export const useComplete = <T>(queryKey: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<T, AxiosError, CompleteMutationProps<T>>({
    mutationFn: ({ url, id, body, config }) => {
      return complete<T>(url, id, body, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
    },
    onError: (error) => {
      console.error("Complete failed:", error);
    },
  });

  return {
    completeAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};