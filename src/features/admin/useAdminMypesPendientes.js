import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMypesPorEstadoApi,
  aprobarMypeApi,
  rechazarMypeApi,
} from "./adminMypes.api";

export function useAdminMypesPendientes(estado = "PENDIENTE") {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin", "mypes", estado],
    queryFn: () => getMypesPorEstadoApi(estado),
    refetchInterval: 30000,
  });

  const aprobar = useMutation({
    mutationFn: aprobarMypeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "mypes"] });
    },
  });

  const rechazar = useMutation({
    mutationFn: ({ mypeId, motivo }) => rechazarMypeApi(mypeId, motivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "mypes"] });
    },
  });

  return {
    mypes: query.data?.data?.content ?? query.data?.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    aprobar: aprobar.mutate,
    rechazar: rechazar.mutate,
    isApproving: aprobar.isPending,
    isRechazando: rechazar.isPending,
  };
}
