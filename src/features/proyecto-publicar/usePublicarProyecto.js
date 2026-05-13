import { useMutation, useQueryClient } from "@tanstack/react-query";
import { publicarProyectoApi } from "./proyectoPublicar.api";
import { handleApiError } from "@/shared/api/apiErrors";

export function usePublicarProyecto() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: publicarProyectoApi,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mis-proyectos"] });
    },

    onError: (error) => {
      console.error(handleApiError(error));
    },
  });

  return {
    publicar: mutation.mutate, // llamar con: publicar(proyectoId)
    isLoading: mutation.isPending,
    error: mutation.error ? handleApiError(mutation.error) : null,
    isSuccess: mutation.isSuccess,
  };
}
