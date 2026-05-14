import { httpClient } from "@shared/api/httpClient";
import { useQuery } from "@tanstack/react-query";

export function useMisPostulaciones(options = {}) {
  return useQuery({
    queryKey: ["mis-postulaciones"],
    queryFn: async () => {
      const response = await httpClient.get("/proyectos/mis-postulaciones");
      return response.data;
    },
    ...options
  });
}
