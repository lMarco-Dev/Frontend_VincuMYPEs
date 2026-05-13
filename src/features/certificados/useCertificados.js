import { httpClient } from "@shared/api/httpClient";
import { useQuery } from "@tanstack/react-query";

export function useCertificados() {
  return useQuery({
    queryKey: ["certificados"],
    queryFn: async () => {
      const response = await httpClient.get("/certificados/mis-certificados");
      return response.data;
    }
  });
}
