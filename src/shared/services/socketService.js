import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const SOCKET_URL = 'http://localhost:8080/ws';

let stompClient = null;

export const connectSocket = (userId, onNotificacion) => {
  if (stompClient?.connected) return stompClient;

  const socket = new SockJS(SOCKET_URL);
  stompClient = Stomp.over(socket);

  stompClient.connect(
    {},
    () => {
      console.log('🟢 WebSocket conectado para usuario:', userId);

      // Suscribirse a notificaciones personales
      stompClient.subscribe(`/user/queue/notificaciones`, (message) => {
        const notificacion = JSON.parse(message.body);
        console.log('🔔 Nueva notificación recibida:', notificacion);
        if (onNotificacion) onNotificacion(notificacion);
      });
    },
    (error) => {
      console.error('❌ Error WebSocket:', error);
    }
  );

  return stompClient;
};

export const disconnectSocket = () => {
  if (stompClient) {
    stompClient.disconnect();
    stompClient = null;
    console.log('🔴 WebSocket desconectado');
  }
};