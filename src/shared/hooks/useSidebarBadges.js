import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useNotificaciones } from '@/features/notificaciones/useNotificaciones';

export function useSidebarBadges() {
  const { data: notificaciones = [] } = useNotificaciones();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Registrar visita a /proyectos para resetear el badge
  useEffect(() => {
    if (location.pathname === '/proyectos') {
      localStorage.setItem('vm_last_visit_proyectos', Date.now().toString());
    }
  }, [location.pathname]);

  // Badge "Explorar Proyectos": proyectos nuevos desde última visita
  let explorar = false;
  const lastVisit = localStorage.getItem('vm_last_visit_proyectos');
  if (lastVisit) {
    const cached = queryClient.getQueryData(['proyectos', 0, 10]);
    // La API puede devolver { content: [...] } (paginado) o un array plano
    const lista = cached?.content ?? (Array.isArray(cached) ? cached : []);
    if (lista.length > 0) {
      explorar = lista.some(
        (p) => new Date(p.fechaCreacion) > new Date(Number(lastVisit))
      );
    }
  }

  const tieneNotifDeTipo = (tipo) =>
    notificaciones.some((n) => !n.leida && n.tipo === tipo);

  return {
    explorar,
    postulaciones: tieneNotifDeTipo('POSTULACION'),
    workspace: tieneNotifDeTipo('ENTREGABLE'),
    certificados: tieneNotifDeTipo('CERTIFICADO'),
    mensajes: tieneNotifDeTipo('MENSAJE'),
    proyectosMype: tieneNotifDeTipo('PROYECTO'),
  };
}
