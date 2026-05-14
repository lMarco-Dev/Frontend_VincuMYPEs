import { httpClient } from "@shared/api/httpClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";

export function usePerfil() {
  const rol = useAuthStore((state) => state.rol);

  return useQuery({
    queryKey: ["perfil", rol],
    queryFn: async () => {
      // Si es estudiante llamamos al endpoint detallado, si no, al perfil general
      const endpoint = rol === "ESTUDIANTE" ? "/estudiantes/me" : "/usuarios/me";
      const response = await httpClient.get(endpoint);
      return response.data;
    }
  });
}

export function useUpdatePerfil() {
  const queryClient = useQueryClient();
  const rol = useAuthStore((state) => state.rol);
  
  return useMutation({
    mutationFn: async (data) => {
      // Si es estudiante llamamos al endpoint detallado, si no, al perfil general
      const endpoint = rol === "ESTUDIANTE" ? "/estudiantes/me" : "/usuarios/me";
      const response = await httpClient.put(endpoint, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["perfil"] });
    }
  });
}

