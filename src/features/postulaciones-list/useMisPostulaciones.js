import { httpClient } from "@shared/api/httpClient";
import { useQuery } from "@tanstack/react-query";

export function useMisPostulaciones(options = {}) {
  return useQuery({
    queryKey: ["mis-postulaciones"],
    queryFn: async () => {
      const response = await httpClient.get("/estudiantes/me/postulaciones");
      return response.data;
    },
    ...options,
  });
}
