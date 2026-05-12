import { httpClient } from "@shared/api/httpClient";
import { useQuery } from "@tanstack/react-query";

export function usePerfil() {
  return useQuery({
    queryKey: ["perfil"],
    queryFn: async () => {
      const response = await httpClient.get("/usuarios/me");
      return response.data;
    }
  });
}
