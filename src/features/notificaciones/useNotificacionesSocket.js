import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { playNotificationSound } from '@shared/lib/notificationSound';

export function useNotificacionesSocket(userId) {
  const queryClient = useQueryClient();
  const wsRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    let reconnectTimer;
    let isConnected = false;

    const connect = () => {
      if (isConnected) return;
      try {
        const ws = new WebSocket('ws://localhost:8080/ws/websocket');
        wsRef.current = ws;

        ws.onopen = () => {
          isConnected = true;
          ws.send(JSON.stringify({
            type: 'SUBSCRIBE',
            destination: `/user/queue/notificaciones`,
          }));
        };

        ws.onmessage = (event) => {
          try {
            const notificacion = JSON.parse(event.data);
            queryClient.setQueryData(['notificaciones'], (oldData) => {
              if (!oldData) return [notificacion];
              return [notificacion, ...oldData];
            });
            playNotificationSound();
          } catch (e) {}
        };

        ws.onclose = () => {
          isConnected = false;
          reconnectTimer = setTimeout(connect, 5000);
        };

        ws.onerror = () => {};
      } catch (error) {
        reconnectTimer = setTimeout(connect, 5000);
      }
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (wsRef.current) wsRef.current.close();
    };
  }, [userId, queryClient]);
}
