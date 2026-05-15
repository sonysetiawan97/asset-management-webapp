import { useMutation, useQueryClient } from "@tanstack/react-query";
import { softDelete } from "@services/softDelete";
import type { AxiosError } from "axios";

interface SoftDeleteMutationProps {
  url: string;
  id: string;
}

export const useSoftDelete = (queryKey: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<void, AxiosError, SoftDeleteMutationProps>({
    mutationFn: ({ url, id }) => {
      return softDelete(url, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
    },
    onError: (error) => {
      console.error("Soft delete failed:", error);
    },
  });

  return {
    softDelete: mutation.mutate,
    softDeleteAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
