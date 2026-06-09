import { useQuery } from "@tanstack/react-query";
import { obtenerPendientesApi } from "./calificaciones.api";

export function useCalificacionesPendientes() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["calificaciones-pendientes"],
    queryFn: obtenerPendientesApi,
    staleTime: 60 * 1000,
  });
  return { pendientes: data ?? [], isLoading, error };
}