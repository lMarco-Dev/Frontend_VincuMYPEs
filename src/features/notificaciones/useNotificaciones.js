import { httpClient } from "@shared/api/httpClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { playNotificationSound } from "@shared/lib/notificationSound";

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

  useEffect(() => {
    if (hasCheckedRef.current) return;
    if (!query.data) return;

    hasCheckedRef.current = true;

    const lastLogout = localStorage.getItem('vm_last_logout');
    if (!lastLogout) return;

    const hasNew = query.data.some(
      (n) => !n.leida && new Date(n.fechaCreacion) > new Date(Number(lastLogout))
    );

    if (hasNew) playNotificationSound();

    localStorage.removeItem('vm_last_logout');
  }, [query.data]);

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
