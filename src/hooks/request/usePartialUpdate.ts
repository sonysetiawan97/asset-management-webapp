import { useMutation, useQueryClient } from "@tanstack/react-query";
import { partialUpdate } from "@services/partialUpdate";
import type { AxiosError, AxiosRequestConfig } from "axios";

interface PartialUpdateMutationProps<T> {
  url: string;
  id: string;
  body: Partial<T>;
  config?: AxiosRequestConfig;
}

export const usePartialUpdate = <T>(queryKey: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<T, AxiosError, PartialUpdateMutationProps<T>>({
    mutationFn: ({ url, id, body, config }) => {
      return partialUpdate<T>(url, id, body, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
    },
    onError: (error) => {
      console.error("Partial update failed:", error);
    },
  });

  return {
    partialUpdate: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
