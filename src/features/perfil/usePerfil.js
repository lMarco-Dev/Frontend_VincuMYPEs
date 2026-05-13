import { httpClient } from "@shared/api/httpClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function usePerfil() {
  return useQuery({
    queryKey: ["perfil"],
    queryFn: async () => {
      const response = await httpClient.get("/estudiantes/me");
      return response.data;
    }
  });
}

export function useUpdatePerfil() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await httpClient.put("/estudiantes/me", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["perfil"] });
    }
  });
}

