import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInsumosTipo,
  crearInsumoTipo,
  actualizarInsumoTipo,
  eliminarInsumoTipo,
} from "./insumosTipo.api";

export function useInsumosTipo(tipoId) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["insumosTipo", tipoId],
    queryFn: () => getInsumosTipo(tipoId),
    select: (res) => res.data,
    enabled: !!tipoId,
  });

  const crearMutation = useMutation({
    mutationFn: (data) => crearInsumoTipo(tipoId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["insumosTipo", tipoId] }),
  });

  const actualizarMutation = useMutation({
    mutationFn: ({ insumoId, data }) => actualizarInsumoTipo(tipoId, insumoId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["insumosTipo", tipoId] }),
  });

  const eliminarMutation = useMutation({
    mutationFn: (insumoId) => eliminarInsumoTipo(tipoId, insumoId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["insumosTipo", tipoId] }),
  });

  return {
    insumos: query.data || [],
    isLoading: query.isLoading,
    crearInsumo: crearMutation.mutate,
    actualizarInsumo: actualizarMutation.mutate,
    eliminarInsumo: eliminarMutation.mutate,
  };
}