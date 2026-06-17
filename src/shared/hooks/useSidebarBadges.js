import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useNotificaciones, useLeerNotificacion } from '@/features/notificaciones/useNotificaciones';
import { getMypesPorEstadoApi } from '@/features/admin/adminMypes.api';

// Qué tipos de notificación se marcan como leídas al entrar a cada ruta
const ROUTE_TIPOS = [
  { route: '/mis-postulaciones', exact: true,  tipos: ['POSTULACION'] },
  { route: '/workspace',         exact: false, tipos: ['ENTREGABLE', 'PROYECTO'] },
  { route: '/certificados',      exact: true,  tipos: ['CERTIFICADO'] },
];

export function useSidebarBadges() {
  const { data: notificaciones = [] } = useNotificaciones();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { mutate: leerNotificacion } = useLeerNotificacion();

  const { data: mypesPendientes } = useQuery({
    queryKey: ["admin", "mypes", "PENDIENTE"],
    queryFn: () => getMypesPorEstadoApi("PENDIENTE"),
    refetchInterval: 30000,
    enabled: location.pathname.startsWith("/admin"),
  });

  // Registrar visita a /proyectos para resetear el badge de Explorar
  useEffect(() => {
    if (location.pathname === '/proyectos') {
      localStorage.setItem('vm_last_visit_proyectos', Date.now().toString());
    }
  }, [location.pathname]);

  // Al entrar a un módulo relevante, marcar sus notificaciones no leídas como leídas
  useEffect(() => {
    const config = ROUTE_TIPOS.find(({ route, exact }) =>
      exact ? location.pathname === route : location.pathname.startsWith(route)
    );
    if (!config) return;

    // Leer directo del caché para no depender del state en este efecto
    const cache = queryClient.getQueryData(['notificaciones']) || [];
    cache
      .filter((n) => !n.leida && config.tipos.includes(n.tipo))
      .forEach((n) => leerNotificacion(n.id));

  // Solo se dispara al cambiar de ruta; queryClient y leerNotificacion son referencias estables
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Badge "Explorar Proyectos": proyectos nuevos desde última visita
  let explorar = false;
  const lastVisit = localStorage.getItem('vm_last_visit_proyectos');
  if (lastVisit) {
    const cached = queryClient.getQueryData(['proyectos', 0, 10]);
    const lista = cached?.content ?? (Array.isArray(cached) ? cached : []);
    if (lista.length > 0) {
      explorar = lista.some(
        (p) => new Date(p.fechaCreacion) > new Date(Number(lastVisit))
      );
    }
  }

  const tieneNotifDeTipo = (...tipos) =>
    notificaciones.some((n) => !n.leida && tipos.includes(n.tipo));

  const listaMypes = Array.isArray(mypesPendientes?.data) ? mypesPendientes.data : [];

  return {
    explorar,
    postulaciones: tieneNotifDeTipo('POSTULACION'),
    workspace:     tieneNotifDeTipo('ENTREGABLE', 'PROYECTO'),
    certificados:  tieneNotifDeTipo('CERTIFICADO'),
    mensajes:      tieneNotifDeTipo('MENSAJE'),
    proyectosMype: tieneNotifDeTipo('PROYECTO'),
    mypesPendientes: listaMypes.length > 0,
  };
}
