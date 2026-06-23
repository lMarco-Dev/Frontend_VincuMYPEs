import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useNotificaciones, useLeerNotificacion } from '@/features/notificaciones/useNotificaciones';
import { getMypesPorEstadoApi } from '@/features/admin/adminMypes.api';

// Clave para guardar última visita por módulo en localStorage
const LAST_VISIT_KEY = 'vm_last_visit_';

// Qué tipos de notificación corresponden a cada ruta
const ROUTE_TIPOS = [
  { route: '/mis-postulaciones', exact: true,  tipos: ['POSTULACION'] },
  { route: '/workspace',         exact: false, tipos: ['ENTREGABLE', 'PROYECTO'] },
  { route: '/certificados',      exact: true,  tipos: ['CERTIFICADO'] },
  { route: '/dashboard/mype/ejecucion', exact: true, tipos: ['ENTREGABLE', 'PROYECTO'] },
  { route: '/dashboard/mype/postulantes', exact: true, tipos: ['POSTULACION'] },
  { route: '/dashboard/mype/mensajes', exact: true, tipos: ['MENSAJE'] },
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

  // Actualizar última visita al entrar a un módulo
  const updateLastVisit = useCallback((routeKey) => {
    localStorage.setItem(LAST_VISIT_KEY + routeKey, Date.now().toString());
  }, []);

  // Al entrar a un módulo: marcar notificaciones como leídas Y actualizar última visita
  useEffect(() => {
    const config = ROUTE_TIPOS.find(({ route, exact }) =>
      exact ? location.pathname === route : location.pathname.startsWith(route)
    );
    if (!config) return;

    const routeKey = config.route.replace(/\//g, '_');
    updateLastVisit(routeKey);

    const cache = queryClient.getQueryData(['notificaciones']) || [];
    const toMark = cache.filter((n) => !n.leida && config.tipos.includes(n.tipo));

    if (toMark.length > 0) {
      // Actualizar caché localmente (optimista) antes de llamar al API
      queryClient.setQueryData(['notificaciones'], (old) =>
        (old || []).map((n) =>
          toMark.some((m) => m.id === n.id) ? { ...n, leida: true } : n
        )
      );

      // Llamar al API para cada una (sin depender del estado)
      toMark.forEach((n) => leerNotificacion(n.id));
    }
  }, [location.pathname]);

  // Función helper: ¿hay notificaciones no leídas de cierto tipo creadas después de la última visita?
  const tieneNotifReciente = (tipos, routeKey) => {
    const lastVisit = localStorage.getItem(LAST_VISIT_KEY + routeKey);
    const threshold = lastVisit ? Number(lastVisit) : 0;
    return notificaciones.some(
      (n) =>
        !n.leida &&
        tipos.includes(n.tipo) &&
        new Date(n.fechaCreacion).getTime() > threshold
    );
  };

  // Badge "Explorar Proyectos": proyectos nuevos desde última visita
  let explorar = false;
  const lastVisitProyectos = localStorage.getItem(LAST_VISIT_KEY + '_proyectos');
  if (lastVisitProyectos) {
    const threshold = Number(lastVisitProyectos);
    const cached = queryClient.getQueryData(['proyectos', 0, 10]);
    const lista = cached?.content ?? (Array.isArray(cached) ? cached : []);
    explorar = lista.some(
      (p) => new Date(p.fechaCreacion).getTime() > threshold
    );
  }

  const listaMypes = Array.isArray(mypesPendientes?.data) ? mypesPendientes.data : [];

  return {
    explorar,
    postulaciones: tieneNotifReciente(['POSTULACION'], '_mis-postulaciones'),
    workspace:     tieneNotifReciente(['ENTREGABLE', 'PROYECTO'], '_workspace'),
    certificados:  tieneNotifReciente(['CERTIFICADO'], '_certificados'),
    mensajes:      tieneNotifReciente(['MENSAJE'], '_dashboard_mype_mensajes'),
    proyectosMype: tieneNotifReciente(['PROYECTO'], '_dashboard_mype_ejecucion'),
    mypesPendientes: listaMypes.length > 0,
  };
}