import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearCalificacionApi } from "./calificaciones.api";

export function useCalificarUsuario() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: crearCalificacionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calificaciones-pendientes"] });
      queryClient.invalidateQueries({ queryKey: ["rating"] });
    },
  });
  return {
    calificar: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error?.response?.data?.message ?? mutation.error?.message ?? null,
    isSuccess: mutation.isSuccess,
  };
}