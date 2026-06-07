import { useQuery } from "@tanstack/react-query";
import { obtenerRatingUsuarioApi } from "./calificaciones.api";

export function useRating(usuarioId, opciones = {}) {
  const { enabled = true } = opciones;

  // DEBUG — confirmar si queryFn corre o si React Query sirve caché
  console.log("[useRating] render", { usuarioId, enabled });

  const { data, isLoading, error } = useQuery({
    queryKey: ["rating", usuarioId],
    queryFn: async () => {
      console.log("[useRating] queryFn EJECUTÁNDOSE, usuarioId =", usuarioId);
      const data = await obtenerRatingUsuarioApi(usuarioId);
      console.log("[useRating] respuesta:", data);
      return data;
    },
    enabled: enabled && Number(usuarioId) > 0,
    retry: false,
    // Anula el staleTime global (5 min) para que la petición siempre vaya a la red
    staleTime: 0,
    refetchOnMount: "always",
  });

  const isForbidden = error?.response?.status === 403;
  return {
    rating: data ?? null,
    isLoading,
    isForbidden,
    error,
  };
}