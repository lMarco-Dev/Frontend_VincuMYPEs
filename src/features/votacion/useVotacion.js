import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVotacionApi, votarApi, esDelegadoApi } from "./votacion.api";

// Obtener estado de votación
export function useVotacion(proyectoId) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["votacion", proyectoId],
    queryFn: () => getVotacionApi(proyectoId).then((res) => res.data),
    enabled: !!proyectoId,
    refetchInterval: false,
    staleTime: 30000,
  });

  return {
    votacion: data ?? null,
    isLoading,
    error,
    refetch,
  };
}

// Votar
export function useVotar(proyectoId) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (candidatoId) => votarApi(proyectoId, candidatoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votacion", proyectoId] });
    },
  });

  return {
    votar: mutation.mutate,
    isVotando: mutation.isPending,
    error: mutation.error,
  };
}

// Verificar si es delegado
export function useEsDelegado(proyectoId) {
  const { data, isLoading } = useQuery({
    queryKey: ["esDelegado", proyectoId],
    queryFn: () => esDelegadoApi(proyectoId).then((res) => {
      return res.data?.esDelegado ?? false;
    }),
    enabled: !!proyectoId,
  });

  return {
    esDelegado: data ?? false,
    isLoading,
  };
}