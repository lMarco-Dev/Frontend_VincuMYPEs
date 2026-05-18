import { httpClient } from "@/shared/api/httpClient";

// Obtener la lista de entregables de un proyecto
export const getEntregablesPorProyecto = async (proyectoId) => {
  const { data } = await httpClient.get(`/entregables/proyecto/${proyectoId}`);
  return data;
};

// Cambiar el estado del entregable (Aprobar/Corregir)
export const revisarEntregableApi = async (proyectoId, entregableId, payload) => {
  // payload: { estado: "ACEPTADO" | "RECHAZADO", observaciones: "..." }
  const { data } = await httpClient.patch(`/entregables/${proyectoId}/revisar/${entregableId}`, payload);
  return data;
};