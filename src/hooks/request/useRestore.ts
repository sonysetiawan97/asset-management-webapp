import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { restore } from "@services/restore";

interface useRestoreMutationProps {
  url: string;
  id: string;
}

export const useRestore = (queryKey: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<void, AxiosError, useRestoreMutationProps>({
    mutationFn: ({ url, id }) => {
      return restore(url, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
    },
    onError: (error) => {
      console.error("Restore failed:", error);
    },
  });

  return {
    restore: mutation.mutate,
    restoreAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
