import { useQuery } from "@tanstack/react-query";
import { getMisProyectosApi } from "./proyectoListMype.api";

export function useMisProyectos() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["mis-proyectos"],
    queryFn: getMisProyectosApi,
  });

  // GET /api/proyectos devuelve Page<ProyectoResponse>
  // La estructura es: response.data.content (array de proyectos)
  return {
    proyectos: data?.data ?? [],
    isLoading,
    error,
  };
}
