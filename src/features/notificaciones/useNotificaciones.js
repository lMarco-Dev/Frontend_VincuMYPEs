import { httpClient } from "@shared/api/httpClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useNotificaciones() {
  return useQuery({
    queryKey: ["notificaciones"],
    queryFn: async () => {
      const response = await httpClient.get("/notificaciones");
      return response.data;
    }
  });
}

export function useNotificacionesNoLeidas() {
  return useQuery({
    queryKey: ["notificaciones", "no-leidas"],
    queryFn: async () => {
      const response = await httpClient.get("/notificaciones/no-leidas");
      return response.data;
    },
    refetchInterval: 60000 // Consultar cada minuto
  });
}

export function useLeerNotificacion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const response = await httpClient.patch(`/notificaciones/${id}/leer`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
    }
  });
}
