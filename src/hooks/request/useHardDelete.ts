import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hardDelete } from "@services/hardDelete";
import type { AxiosError } from "axios";

interface HardDeleteMutationProps {
  url: string;
  id: string;
}

export const useHardDelete = (queryKey: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<void, AxiosError, HardDeleteMutationProps>({
    mutationFn: ({ url, id }) => {
      return hardDelete(url, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
    },
    onError: (error) => {
      console.error("Hard delete failed:", error);
    },
  });

  return {
    hardDelete: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
