import { useQuery } from "@tanstack/react-query";
import { getMisProyectosApi } from "./proyectoListMype.api";

export function useMisProyectos() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["mis-proyectos"],
    queryFn: getMisProyectosApi,
  });

  return {
    proyectos: data?.data ?? data ?? [],
    isLoading,
    error,
  };
}
