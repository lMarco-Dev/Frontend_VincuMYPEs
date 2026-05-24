import { httpClient } from "@shared/api/httpClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

function playNotificationSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const playTone = (frequency, duration, startTime, volume = 0.2) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, startTime);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    const now = audioContext.currentTime;
    playTone(880, 0.15, now, 0.2);
    playTone(1108.73, 0.15, now + 0.12, 0.2);
    playTone(1318.51, 0.25, now + 0.24, 0.25);
    setTimeout(() => audioContext.close(), 800);
  } catch (e) {}
}

export function useNotificaciones() {
  const prevNoLeidasRef = useRef(0);
  const prevTotalRef = useRef(0);

  const query = useQuery({
    queryKey: ["notificaciones"],
    queryFn: async () => {
      const response = await httpClient.get("/notificaciones");
      return response.data?.data || response.data || [];
    },
    refetchInterval: 15000,
    staleTime: 10000,
  });

  useEffect(() => {
    const notificaciones = query.data || [];
    const noLeidas = notificaciones.filter(n => !n.leida).length;
    const total = notificaciones.length;

    if (prevTotalRef.current > 0 && noLeidas > prevNoLeidasRef.current) {
      playNotificationSound();
    }

    prevNoLeidasRef.current = noLeidas;
    prevTotalRef.current = total;
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