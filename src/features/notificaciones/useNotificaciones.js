import { httpClient } from "@shared/api/httpClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

export function useNotificaciones() {
  const hasCheckedRef = useRef(false);

  const query = useQuery({
    queryKey: ["notificaciones"],
    queryFn: async () => {
      const response = await httpClient.get("/notificaciones");
      return response.data?.data || response.data || [];
    },
    refetchInterval: 5000,
    staleTime: 10000,
  });

  return query;
}

export function useLeerNotificacion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await httpClient.patch(`/notificaciones/${id}/leer`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
    },
  });
}

export function useEliminarNotificacion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await httpClient.delete(`/notificaciones/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
    },
  });
}
