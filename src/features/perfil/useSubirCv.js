import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subirCvApi } from "./cvApi";

export function useSubirCv() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: subirCvApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["perfil"] });
    },
  });

  return {
    subirCv: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
}
