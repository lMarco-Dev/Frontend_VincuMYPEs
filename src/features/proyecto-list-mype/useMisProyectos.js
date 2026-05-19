import { useQuery } from "@tanstack/react-query";
import { getMisProyectosApi } from "./proyectoListMype.api";
import { useAuthStore } from "@/store/authStore";

export function useMisProyectos() {
  const { user } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["mis-proyectos", user?.id],
    queryFn: getMisProyectosApi,
    enabled: !!user?.id,
  });

  return {
    proyectos: data?.data ?? [],
    isLoading,
    error,
  };
}
