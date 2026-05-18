import { httpClient } from "@/shared/api/httpClient";

// Obtener la lista de entregables de un proyecto
export const getEntregablesPorProyecto = async (proyectoId) => {
  const { data } = await httpClient.get(`/entregables/proyecto/${proyectoId}`);
  return data;
};

// Obtener entregables subidos por el estudiante para este proyecto
export const getMisEntregablesPorProyecto = async (proyectoId) => {
  const { data } = await httpClient.get(`/proyectos/${proyectoId}/entregables/mis-entregables`);
  return data;
};

// Cambiar el estado del entregable (Aprobar/Corregir)
export const revisarEntregableApi = async (proyectoId, entregableId, payload) => {
  // payload: { estado: "ACEPTADO" | "RECHAZADO", observaciones: "..." }
  const { data } = await httpClient.patch(`/entregables/${proyectoId}/revisar/${entregableId}`, payload);
  return data;
};

// Subir entregable a AWS S3 (para Estudiantes)
export const subirEntregableApi = async (proyectoId, formData) => {
  const { data } = await httpClient.post(`/proyectos/${proyectoId}/entregables`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};