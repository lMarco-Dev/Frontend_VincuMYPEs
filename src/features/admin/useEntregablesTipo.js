import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEntregablesTipo,
  crearEntregableTipo,
  actualizarEntregableTipo,
  eliminarEntregableTipo,
} from "./entregablesTipo.api";

export function useEntregablesTipo(tipoId) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["entregablesTipo", tipoId],
    queryFn: () => getEntregablesTipo(tipoId),
    select: (res) => res.data,
    enabled: !!tipoId,
  });

  const crearMutation = useMutation({
    mutationFn: (data) => crearEntregableTipo(tipoId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["entregablesTipo", tipoId] }),
  });

  const actualizarMutation = useMutation({
    mutationFn: ({ entregableId, data }) => actualizarEntregableTipo(tipoId, entregableId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["entregablesTipo", tipoId] }),
  });

  const eliminarMutation = useMutation({
    mutationFn: (entregableId) => eliminarEntregableTipo(tipoId, entregableId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["entregablesTipo", tipoId] }),
  });

  return {
    entregables: query.data || [],
    isLoading: query.isLoading,
    crearEntregable: crearMutation.mutate,
    actualizarEntregable: actualizarMutation.mutate,
    eliminarEntregable: eliminarMutation.mutate,
  };
}