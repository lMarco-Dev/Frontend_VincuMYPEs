import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPostulacionesApi,
  getPostulacionesAceptadasApi,
  cambiarEstadoPostulacionApi,
  confirmarPostulacionApi,
} from "./postulaciones.api";
import { handleApiError } from "@/shared/api/apiErrors";

// Vista normal — solo ACEPTADOS (admin ya validó)
export function usePostulacionesAceptadas(proyectoId) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["postulaciones-aceptadas", proyectoId],
    queryFn: () => getPostulacionesAceptadasApi(proyectoId),
    enabled: !!proyectoId,
  });

  return {
    postulaciones: data?.data ?? [],
    isLoading,
    error,
  };
}

// Vista completa — todos los estados (modo solicitado)
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

// Aceptar o rechazar
export function useCambiarEstadoPostulacion(proyectoId) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: cambiarEstadoPostulacionApi,
    onSuccess: () => {
      // Invalida ambas queries para refrescar las dos vistas
      queryClient.invalidateQueries({
        queryKey: ["postulaciones", proyectoId],
      });
      queryClient.invalidateQueries({
        queryKey: ["postulaciones-aceptadas", proyectoId],
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

//Nuevo
export function useConfirmarPostulacion() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: confirmarPostulacionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mis-postulaciones"] });
    },
    onError: (error) => console.error(handleApiError(error)),
  });

  return {
    confirmar: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error ? handleApiError(mutation.error) : null,
  };
}
