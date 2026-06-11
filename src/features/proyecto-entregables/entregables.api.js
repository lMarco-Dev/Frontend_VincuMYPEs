import { httpClient } from "@/shared/api/httpClient";

export const getEntregablesPorProyecto = async (proyectoId) => {
  const { data } = await httpClient.get(`/proyectos/${proyectoId}/entregables`);
  // Transformar para incluir historial real
  return data.map(transformarConHistorial);
};

export const getMisEntregablesPorProyecto = async (proyectoId) => {
  const { data } = await httpClient.get(
    `/proyectos/${proyectoId}/entregables/mis-entregables`,
  );
  return data.map(transformarConHistorial);
};

// ✅ MODIFICADA - Para que la MYPE vea entregables CON historial
export const getEntregablesSubidosPorProyecto = async (proyectoId) => {
  const { data } = await httpClient.get(`/proyectos/${proyectoId}/entregables/subidos`);
  return data.map(transformarConHistorial);
};

export const lockEntregable = (proyectoId, entregableId) =>
  httpClient.post(`/proyectos/${proyectoId}/entregables/${entregableId}/lock`);

export const unlockEntregable = (proyectoId, entregableId) =>
  httpClient.post(`/proyectos/${proyectoId}/entregables/${entregableId}/unlock`);

export const revisarEntregableApi = async (
  proyectoId,
  entregableId,
  payload,
) => {
  const { data } = await httpClient.patch(
    `/proyectos/${proyectoId}/entregables/${entregableId}/estado`,
    payload,
  );
  return transformarConHistorial(data);
};

export const subirEntregableApi = async (proyectoId, formData) => {
  const { data } = await httpClient.post(
    `/proyectos/${proyectoId}/entregables`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return transformarConHistorial(data);
};

// ✅ FUNCIÓN DE TRANSFORMACIÓN - Convierte el historial del backend al formato de la gráfica
function transformarConHistorial(entregable) {
  // Si es un array, transformar cada elemento
  if (Array.isArray(entregable)) {
    return entregable.map(transformarConHistorial);
  }
  
  // Transformar un solo entregable
  return {
    ...entregable,
    // ✅ USAR HISTORIAL REAL si existe
    historialReal: (entregable.historial || []).map(evento => ({
      id: evento.id,
      estado: evento.estadoNuevo,
      fechaObj: new Date(evento.fechaCambio),
      fechaStr: new Date(evento.fechaCambio).toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      comentario: evento.comentario || 'Sin comentarios',
      responsable: evento.responsableNombre || 'Sistema',
      colorEstado: getColorPorEstado(evento.estadoNuevo)
    }))
  };
}

function getColorPorEstado(estado) {
  switch(estado) {
    case 'APROBADO': return '#10B981';
    case 'RECHAZADO': return '#F97316';
    case 'PENDIENTE': return '#3B82F6';
    default: return '#64748B';
  }
}