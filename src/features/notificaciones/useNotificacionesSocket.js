import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

function playNotificationSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContext.resume();
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
          console.log('🟢 WebSocket conectado');
          isConnected = true;
          
          // Suscribirse al canal personal
          ws.send(JSON.stringify({
            type: 'SUBSCRIBE',
            destination: `/user/queue/notificaciones`
          }));
        };

        ws.onmessage = (event) => {
          try {
            const notificacion = JSON.parse(event.data);
            console.log('🔔 WebSocket: Nueva notificación:', notificacion);

            queryClient.setQueryData(['notificaciones'], (oldData) => {
              if (!oldData) return [notificacion];
              return [notificacion, ...oldData];
            });

            playNotificationSound();
          } catch (e) {}
        };

        ws.onclose = () => {
          console.log('🔴 WebSocket desconectado, reintentando...');
          isConnected = false;
          reconnectTimer = setTimeout(connect, 5000);
        };

        ws.onerror = () => {
          console.log('⚠️ WebSocket error');
        };

      } catch (error) {
        console.log('⚠️ WebSocket no disponible');
        reconnectTimer = setTimeout(connect, 5000);
      }
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [userId, queryClient]);
}