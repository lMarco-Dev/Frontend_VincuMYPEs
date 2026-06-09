import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getEntregablesPorProyecto, 
  revisarEntregableApi, 
  subirEntregableApi, 
  getMisEntregablesPorProyecto,
  getEntregablesSubidosPorProyecto
} from "./entregables.api";

export function useEntregables(proyectoId, isEstudiante = false, soloSubidos = false) {
  const queryClient = useQueryClient();

  const { data: entregables = [], isLoading, refetch } = useQuery({
    queryKey: ["entregables", proyectoId, isEstudiante, soloSubidos],
    queryFn: () => {
      if (isEstudiante) {
        // ✅ ESTUDIANTE: solo sus entregables subidos
        return getMisEntregablesPorProyecto(proyectoId);
      } else if (soloSubidos) {
        // ✅ MYPE en REVISIÓN: solo entregables con archivo
        return getEntregablesSubidosPorProyecto(proyectoId);
      } else {
        // ✅ MYPE en EJECUCIÓN: TODOS los entregables (sugeridos + subidos)
        return getEntregablesPorProyecto(proyectoId);
      }
    },
    enabled: !!proyectoId,
  });

  const revisarMutation = useMutation({
    mutationFn: ({ entregableId, payload }) => revisarEntregableApi(proyectoId, entregableId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entregables", proyectoId] });
      queryClient.invalidateQueries({ queryKey: ["proyecto", proyectoId] });
      queryClient.invalidateQueries({ queryKey: ["proyectos"] });
    },
  });

  const subirMutation = useMutation({
    mutationFn: (formData) => subirEntregableApi(proyectoId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entregables", proyectoId] });
      queryClient.invalidateQueries({ queryKey: ["proyecto", proyectoId] });
    },
  });

  return {
    entregables,
    isLoading,
    refetch,
    revisarEntregable: revisarMutation.mutate,
    isRevisando: revisarMutation.isPending,
    subirEntregable: subirMutation.mutateAsync,
    isSubiendo: subirMutation.isPending,
  };
}