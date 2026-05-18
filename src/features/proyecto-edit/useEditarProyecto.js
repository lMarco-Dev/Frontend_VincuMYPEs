import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editarProyectoApi, eliminarProyectoApi } from "./proyectoEdit.api";
import { handleApiError } from "@/shared/api/apiErrors";

// Hook para editar
export function useEditarProyecto() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }) => editarProyectoApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mis-proyectos"] });
    },
    onError: (error) => {
      console.error(handleApiError(error));
    },
  });

  return {
    editarProyecto: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error ? handleApiError(mutation.error) : null,
    isSuccess: mutation.isSuccess,
  };
}

// Hook para eliminar
export function useEliminarProyecto() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id) => eliminarProyectoApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mis-proyectos"] });
    },
    onError: (error) => {
      console.error(handleApiError(error));
    },
  });

  return {
    eliminarProyecto: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error ? handleApiError(mutation.error) : null,
  };
}
