import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/shared/api/httpClient";

export function useMiActividad() {
  return useQuery({
    queryKey: ["mi-actividad-entregables"],
    queryFn: async () => {
      try {
        const { data } = await httpClient.get("/mi-actividad/entregables");
        return Array.isArray(data) ? data : [];
      } catch {
        return [];
      }
    },
  });
}