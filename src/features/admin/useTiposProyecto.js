import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTiposProyecto,
  crearTipoProyecto,
  actualizarTipoProyecto,
  toggleActivoTipoProyecto,
  eliminarTipoProyecto,
} from "@/features/admin/tiposProyecto.api";

/**
 * Hook de admin para tipos de proyecto.
 * Cambio: pasa { incluirInactivos: true } al endpoint para traer también
 * los tipos desactivados. Sin esto, en cuanto el admin desactivaba un tipo,
 * éste desaparecía de la lista y no podía reactivarlo.
 */
export function useTiposProyecto() {
  const queryClient = useQueryClient();

  const tiposQuery = useQuery({
    queryKey: ["adminTiposProyecto"],
    queryFn: () => getTiposProyecto({ incluirInactivos: true }),
    select: (res) => res.data,
  });

  const crearMutation = useMutation({
    mutationFn: crearTipoProyecto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminTiposProyecto"] }),
  });

  const actualizarMutation = useMutation({
    mutationFn: ({ id, data }) => actualizarTipoProyecto(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminTiposProyecto"] }),
  });

  const toggleMutation = useMutation({
    mutationFn: toggleActivoTipoProyecto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminTiposProyecto"] }),
  });

  const eliminarMutation = useMutation({
    mutationFn: eliminarTipoProyecto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminTiposProyecto"] }),
  });

  return {
    tiposProyecto: tiposQuery.data || [],
    isLoading: tiposQuery.isLoading,
    crearTipo: crearMutation.mutate,
    actualizarTipo: actualizarMutation.mutate,
    toggleActivo: toggleMutation.mutate,
    eliminarTipo: eliminarMutation.mutate,
  };
}