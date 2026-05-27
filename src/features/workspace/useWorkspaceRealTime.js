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
    retry: 2,
    retryDelay: 1000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  // 2. Obtener entregables del estudiante (CORREGIDO)
  const {
    data: entregables = [],
    isLoading: loadingEntregables,
    refetch: refetchEntregables,
    error: entregablesError,
  } = useQuery({
    queryKey: ["workspace-entregables", proyectoId],
    queryFn: async () => {
      try {
        // ✅ Usar el endpoint correcto que TIENE el parámetro proyectoId
        const { data } = await httpClient.get(
          `/proyectos/${proyectoId}/entregables/mis-entregables`
        );
        
        // Asegurar que data sea un array
        if (!Array.isArray(data)) return [];
        
        // Transformar datos al formato que espera el componente
        const entregablesFormateados = data.map(ent => ({
         id: ent.id,
    titulo: ent.titulo,
    estado: ent.estado,
    archivo: ent.archivo,                           // ✅ URL del archivo
    archivoUrl: ent.archivo,                        // ✅ Alias para compatibilidad
    archivoNombre: ent.archivoNombre ||            // ✅ Si viene del backend
                  (ent.archivo ? ent.archivo.split('/').pop() : null),
    fechaSubida: ent.fechaEntrega || ent.createdAt || new Date().toISOString(),
    observaciones: ent.observaciones || ent.feedback || null,
    estudianteNombre: ent.estudianteNombre,
    descripcion: ent.descripcion
        }));
        
        console.log("✅ Entregables cargados:", entregablesFormateados.length);
        return entregablesFormateados;
      } catch (error) {
        console.warn("⚠️ Error al cargar entregables:", error.response?.status, error.message);
        return [];
      }
    },
    enabled: !!proyectoId,
    retry: 1,
    staleTime: 5000,
  });

  // 3. Obtener mensajes del chat
  const {
    data: conversacion,
    isLoading: loadingMensajes,
    refetch: refetchMensajes,
  } = useQuery({
    queryKey: ["workspace-mensajes", proyectoId],
    queryFn: async () => {
      try {
        const response = await httpClient.get("/mensajes/conversaciones/estudiante");
        const conversaciones = response.data || response.data?.data || [];
        
        const conversacionesArray = Array.isArray(conversaciones) 
          ? conversaciones 
          : [];

        const conversacionProyecto = conversacionesArray.find(
          (c) => c.proyectoId === Number(proyectoId)
        );

        if (!conversacionProyecto) {
          return { mensajes: [], id: null };
        }

        const mensajesResponse = await httpClient.get(
          `/mensajes/conversaciones/${conversacionProyecto.id}`
        );
        
        return {
          id: conversacionProyecto.id,
          mensajes: mensajesResponse.data || mensajesResponse.data?.data || [],
        };
      } catch (error) {
        console.log("ℹ️ No hay conversación aún para este proyecto");
        return { mensajes: [], id: null };
      }
    },
    enabled: !!proyectoId,
    retry: 0,
    staleTime: 30000,
    refetchInterval: false,
  });

  // 4. Obtener datos de la MYPE
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

  // 5. Estadísticas calculadas
  const entregablesStats = {
    total: entregables?.length || 0,
    completados: entregables?.filter((e) => e.estado === "APROBADO").length || 0,
    enRevision: entregables?.filter((e) => e.estado === "EN_REVISION" || e.estado === "PENDIENTE_REVISION").length || 0,
    pendientes: entregables?.filter((e) => e.estado === "PENDIENTE").length || 0,
    rechazados: entregables?.filter((e) => e.estado === "RECHAZADO").length || 0,
    porcentaje: entregables?.length
      ? Math.round(
          ((entregables?.filter((e) => e.estado === "APROBADO").length || 0) /
            entregables.length) *
            100
        )
      : 0,
  };

  // 6. Función para recargar todo
  const recargarWorkspace = async () => {
    try {
      await Promise.all([
        refetchProyecto(),
        refetchEntregables(),
        refetchMensajes(),
      ]);
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