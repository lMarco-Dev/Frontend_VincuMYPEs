import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cambiarEstadoPostulacionApi,
  getPostulacionesApi,
} from "./postulaciones.api";
import { handleApiError } from "@/shared/api/apiErrors";

export function usePostulaciones(proyectoId) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["postulaciones", proyectoId],
    queryFn: () => getPostulacionesApi(proyectoId),
    enabled: !!proyectoId,
  });

  return {
    postulaciones: data?.data ?? [],
    isLoading,
    error,
  };
}

// Para aceptar o rechazar una postulación
export function useCambiarEstadoPostulacion(proyectoId) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: cambiarEstadoPostulacionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["postulaciones", proyectoId],
      });
    },
    onError: (error) => {
      console.error(handleApiError(error));
    },
  });

  return {
    cambiarEstado: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error ? handleApiError(mutation.error) : null,
  };
}
