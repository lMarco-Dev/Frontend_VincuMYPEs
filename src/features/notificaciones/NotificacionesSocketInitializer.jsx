import { useNotificacionesSocket } from './useNotificacionesSocket';

export function NotificacionesSocketInitializer() {
  useNotificacionesSocket(); // No recibe parámetros
  return null;
}