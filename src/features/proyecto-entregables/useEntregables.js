import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEntregablesPorProyecto, revisarEntregableApi, subirEntregableApi, getMisEntregablesPorProyecto } from "./entregables.api";

export function useEntregables(proyectoId, isEstudiante = false) {
  const queryClient = useQueryClient();

  const { data: entregables = [], isLoading, refetch } = useQuery({
    queryKey: ["entregables", proyectoId, isEstudiante],
    queryFn: () => isEstudiante ? getMisEntregablesPorProyecto(proyectoId) : getEntregablesPorProyecto(proyectoId),
    enabled: !!proyectoId,
  });

  const revisarMutation = useMutation({
    mutationFn: ({ entregableId, payload }) => revisarEntregableApi(proyectoId, entregableId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entregables", proyectoId] });
    },
  });

  const subirMutation = useMutation({
    mutationFn: (formData) => subirEntregableApi(proyectoId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entregables", proyectoId] });
      queryClient.invalidateQueries({ queryKey: ["proyecto", proyectoId] }); // También recargar el estado del proyecto
    },
  });

  return {
    entregables,
    isLoading,
    refetch,
    revisarEntregable: revisarMutation.mutate,
    isRevisando: revisarMutation.isPending,
    subirEntregable: subirMutation.mutateAsync, // Usamos mutateAsync para poder manejar promesas en el componente
    isSubiendo: subirMutation.isPending,
  };
}