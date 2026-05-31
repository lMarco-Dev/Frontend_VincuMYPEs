import { useQuery } from "@tanstack/react-query";
import { getInsumosTipo } from "@/features/admin/insumosTipo.api";

export function useInsumosProyecto(tipoProyectoId) {
  return useQuery({
    queryKey: ["insumosTipo", tipoProyectoId],
    queryFn: () => getInsumosTipo(tipoProyectoId),
    select: (res) => res.data,
    enabled: !!tipoProyectoId,
  });
}