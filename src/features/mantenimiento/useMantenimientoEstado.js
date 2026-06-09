import { useQuery } from "@tanstack/react-query";
import { obtenerEstadoMantenimientoApi } from "./mantenimiento.api";

/**
 * Consulta el estado de mantenimiento con polling automático.
 * Se usa en el MaintenanceGate para detectar cambios en tiempo casi real.
 */
export function useMantenimientoEstado() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["mantenimiento-estado"],
    queryFn: obtenerEstadoMantenimientoApi,
    refetchInterval: 30 * 1000, // cada 30 segundos
    refetchOnWindowFocus: true, // re-consulta al volver a la pestaña
    staleTime: 0,
    retry: 1,
  });

  return {
    estaEnMantenimiento: data?.modoMantenimiento === true,
    isLoading,
    error,
    refetch,
  };
}