import { httpClient } from "@/shared/api/httpClient";

export const getCalificacionesAdmin = async (params = {}) => {
  const {
    page = 0,
    size = 20,
    sortField = "createdAt",
    sortDirection = "desc",
  } = params;
  return await httpClient.get("/admin/calificaciones", {
    params: { page, size, sortField, sortDirection },
  });
};

export const obtenerCalificacionAdmin = async (id) => {
  return await httpClient.get(`/admin/calificaciones/${id}`);
};

export const editarCalificacionAdmin = async (id, data) => {
  return await httpClient.put(`/admin/calificaciones/${id}`, data);
};

export const eliminarCalificacionAdmin = async (id) => {
  return await httpClient.delete(`/admin/calificaciones/${id}`);
};

export const buscarCalificacionPorProyecto = async (
  proyectoId,
  calificadorId,
  calificadoId,
) => {
  return await httpClient.get("/admin/calificaciones/buscar", {
    params: { proyectoId, calificadorId, calificadoId },
  });
};
