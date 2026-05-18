import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEntregablesPorProyecto, revisarEntregableApi } from "./entregables.api";

export function useEntregables(proyectoId) {
  const queryClient = useQueryClient();

  const { data: entregables = [], isLoading } = useQuery({
    queryKey: ["entregables", proyectoId],
    queryFn: () => getEntregablesPorProyecto(proyectoId),
    enabled: !!proyectoId,
  });

  const revisarMutation = useMutation({
    mutationFn: ({ entregableId, payload }) => revisarEntregableApi(proyectoId, entregableId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entregables", proyectoId] });
    },
  });

  return {
    entregables,
    isLoading,
    revisarEntregable: revisarMutation.mutate,
    isRevisando: revisarMutation.isPending,
  };
}