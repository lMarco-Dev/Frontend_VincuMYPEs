import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/shared/api/httpClient";

export function useMiActividad() {
  return useQuery({
    queryKey: ["mi-actividad-entregables"],
    queryFn: async () => {
      const { data } = await httpClient.get("/estudiantes/me/entregables");
      return data;
    },
    staleTime: 60_000,
    retry: 1,
    // Si el endpoint aún no existe en el backend, devuelve array vacío en lugar de romper la UI
    onError: () => [],
  });
}
