import { useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/shared/api/httpClient";
import { useAuthStore } from "@/store/authStore";

export function useWorkspaceRealTime(proyectoId) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const rol = useAuthStore((state) => state.rol);

  // 1. Obtener datos del proyecto
  const {
    data: proyecto,
    isLoading: loadingProyecto,
    isError: errorProyecto,
    error: proyectoError,
    refetch: refetchProyecto,
  } = useQuery({
    queryKey: ["workspace-proyecto", proyectoId],
    queryFn: async () => {
      const { data } = await httpClient.get(`/proyectos/${proyectoId}`);
      return data;
    },
    enabled: !!proyectoId,
    retry: 2, // Reintentar 2 veces si falla
    retryDelay: 1000, // Esperar 1 segundo entre reintentos
    staleTime: 10000,
    refetchOnWindowFocus: false, // Evitar llamadas extra
    refetchInterval: false, // Desactivar polling automático para evitar spam de errores
  });

  // 2. Obtener entregables del estudiante
 // En la sección de entregables:
const {
    data: entregables = [],
    isLoading: loadingEntregables,
    refetch: refetchEntregables,
} = useQuery({
    queryKey: ["workspace-entregables", proyectoId],
    queryFn: async () => {
        try {
            // ✅ Endpoint corregido con proyectoId
            const { data } = await httpClient.get(
                `/proyectos/${proyectoId}/entregables/mis-entregables`
            );
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.warn("⚠️ No se pudieron cargar entregables");
            return [];
        }
    },
    enabled: !!proyectoId,
    retry: 1,
    staleTime: 5000,
});

 // En la sección de mensajes, cambia TODO el bloque por esto:

// 3. Obtener mensajes del chat (MANEJO ROBUSTO DE ERRORES)
const {
    data: conversacion,
    isLoading: loadingMensajes,
    refetch: refetchMensajes,
} = useQuery({
    queryKey: ["workspace-mensajes", proyectoId],
    queryFn: async () => {
        try {
            // Intentar obtener conversaciones
            const response = await httpClient.get("/mensajes/conversaciones/estudiante");
            const conversaciones = response.data || response.data?.data || [];
            
            const conversacionesArray = Array.isArray(conversaciones) 
                ? conversaciones 
                : [];

            // Buscar la conversación de este proyecto
            const conversacionProyecto = conversacionesArray.find(
                (c) => c.proyectoId === Number(proyectoId)
            );

            // ✅ Si no hay conversación, devolver vacío (NO error)
            if (!conversacionProyecto) {
                return { mensajes: [], id: null };
            }

            // Intentar obtener mensajes
            const mensajesResponse = await httpClient.get(
                `/mensajes/conversaciones/${conversacionProyecto.id}`
            );
            
            return {
                id: conversacionProyecto.id,
                mensajes: mensajesResponse.data || mensajesResponse.data?.data || [],
            };
        } catch (error) {
            // ✅ Si falla (404, 500, etc.), devolver vacío sin mostrar error
            console.log("ℹ️ No hay conversación aún para este proyecto");
            return { mensajes: [], id: null };
        }
    },
    enabled: !!proyectoId,
    retry: 0, // ✅ No reintentar para evitar spam de errores
    staleTime: 30000,
    refetchInterval: false, // ✅ Sin polling automático
});

  // 4. Obtener datos de la MYPE (perfil público)
  const {
    data: mypeData,
    isLoading: loadingMype,
  } = useQuery({
    queryKey: ["workspace-mype", proyecto?.mypeId],
    queryFn: async () => {
      if (!proyecto?.mypeId) return null;
      try {
        const { data } = await httpClient.get(`/mypes/${proyecto.mypeId}/perfil`);
        return data;
      } catch (error) {
        console.warn("No se pudo cargar perfil MYPE:", error.message);
        return null;
      }
    },
    enabled: !!proyecto?.mypeId,
    retry: 1,
    staleTime: 300000,
  });

  // 5. Estadísticas calculadas en tiempo real
  const entregablesStats = {
    total: entregables?.length || 0,
    completados: entregables?.filter((e) => e.estado === "APROBADO").length || 0,
    enRevision: entregables?.filter((e) => e.estado === "EN_REVISION" || e.estado === "PENDIENTE_REVISION").length || 0,
    pendientes: entregables?.filter((e) => e.estado === "PENDIENTE").length || 0,
    porcentaje: entregables?.length
      ? Math.round(
          ((entregables?.filter((e) => e.estado === "APROBADO").length || 0) /
            entregables.length) *
            100
        )
      : 0,
  };

  // 6. Función para recargar todo manualmente
  const recargarWorkspace = async () => {
    try {
      await refetchProyecto();
      await refetchEntregables();
      await refetchMensajes();
    } catch (error) {
      console.warn("Error al recargar workspace:", error);
    }
  };

  // 7. Última actualización
  const ultimaActualizacion = new Date();

  return {
    proyecto,
    entregables,
    mensajes: conversacion?.mensajes || [],
    conversacionId: conversacion?.id,
    mype: mypeData,
    loadingProyecto,
    loadingEntregables,
    loadingMensajes,
    loadingMype,
    isLoading: loadingProyecto || loadingEntregables || loadingMensajes,
    errorProyecto,
    proyectoError,
    stats: entregablesStats,
    recargarWorkspace,
    refetchProyecto,
    refetchEntregables,
    refetchMensajes,
    ultimaActualizacion,
    isOnline: navigator.onLine,
  };
}