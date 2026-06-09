import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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

// Aceptar o rechazar (con bloqueo por 409)
export function useCambiarEstadoPostulacion(proyectoId) {
  const queryClient = useQueryClient();
  const [postulacionesBloqueadas, setPostulacionesBloqueadas] = useState(new Set());
  const [errorActual, setErrorActual] = useState(null);

  const mutation = useMutation({
    mutationFn: cambiarEstadoPostulacionApi,
    // AQUÍ: Agrega 'variables' a los parámetros de onSuccess
    onSuccess: (data, variables) => {
      // Usa variables.proyectoId en lugar de proyectoId
      queryClient.invalidateQueries({ queryKey: ["postulaciones", variables.proyectoId] });
      queryClient.invalidateQueries({ queryKey: ["postulaciones-aceptadas", variables.proyectoId] });
      setErrorActual(null);
    },
    onError: (error, variables) => {
      const status = error.response?.status;
      const mensaje = error.response?.data?.message || error.message;
      if (status === 409 && variables?.postulacionId) {
        // Estudiante ocupado: bloqueamos esa postulación en UI.
        setPostulacionesBloqueadas(prev => {
          const next = new Set(prev);
          next.add(variables.postulacionId);
          return next;
        });
        setErrorActual({
          tipo: "ocupado",
          postulacionId: variables.postulacionId,
          mensaje,
        });
      } else {
        setErrorActual({ tipo: "generico", mensaje });
      }
    },
  });

  return {
    cambiarEstado: mutation.mutate,
    isLoading: mutation.isPending,
    postulacionesBloqueadas,
    errorActual,
    limpiarError: () => setErrorActual(null),
    estaBloqueada: (postulacionId) => postulacionesBloqueadas.has(postulacionId),
  };
}

// Confirmar postulación
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