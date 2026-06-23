import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { playNotificationSound } from '@shared/lib/notificationSound';
import { Client } from '@stomp/stompjs';
import { useAuthStore } from '@/store/authStore';

// Variable global para mantener la instancia única del cliente STOMP
let stompClientInstance = null;

export function useNotificacionesSocket() {
  const queryClient = useQueryClient();
  const { user, token } = useAuthStore();
  const userId = user?.id;

  useEffect(() => {
    // Si no hay usuario o token, desconectar si existe
    if (!userId || !token) {
      if (stompClientInstance) {
        console.log('🔌 Desconectando STOMP por logout');
        stompClientInstance.deactivate();
        stompClientInstance = null;
      }
      return;
    }

    // Si ya hay una instancia activa, no crear otra
    if (stompClientInstance && stompClientInstance.connected) {
      console.log('⚠️ Cliente STOMP ya conectado y activo');
      return;
    }

    console.log('🔑 Token disponible, conectando WebSocket...');

    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (msg) => console.log('[STOMP]', msg),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('✅ STOMP conectado');
        // Suscribirse al destino del usuario
        client.subscribe('/user/queue/notificaciones', (message) => {
          try {
            const notificacion = JSON.parse(message.body);
            console.log('📨 Notificación recibida:', notificacion);
            
            // Actualizar caché de React Query
            queryClient.setQueryData(['notificaciones'], (oldData) => {
              if (!oldData) return [notificacion];
              return [notificacion, ...oldData];
            });
            
            // Reproducir sonido
            playNotificationSound();
          } catch (e) {
            console.error('Error al procesar mensaje:', e);
          }
        });
      },
      onStompError: (frame) => {
        console.error('❌ Error STOMP:', frame);
      },
      onWebSocketError: (event) => {
        console.error('❌ Error WebSocket:', event);
      },
      onDisconnect: () => {
        console.log('STOMP desconectado');
      },
    });

    client.activate();
    stompClientInstance = client;

    // No limpiamos en el cleanup, para mantener la conexión viva
  }, [userId, token, queryClient]);
}