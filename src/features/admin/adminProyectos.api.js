import { httpClient } from "@/shared/api/httpClient";

export const getProyectosAdmin = async (page = 0, size = 10, sortField = "id", sortDirection = "asc") => {
  return await httpClient.get("/admin/proyectos", {
    params: { page, size, sortField, sortDirection }
  });
};

export const cederGestionMype = async (proyectoId) => {
  return await httpClient.patch(`/admin/proyectos/${proyectoId}/ceder-gestion`);
};

export const auditarAbandonoEstudiante = async ({
  proyectoId,
  postulacionId,
}) => {
  return await httpClient.post(
    `/admin/proyectos/${proyectoId}/postulaciones/${postulacionId}/auditar-abandono`,
  );
};

export const getPostulacionesAdmin = async (proyectoId) => {
  return await httpClient.get(`/proyectos/${proyectoId}/postulaciones`);
};

export const cambiarEstadoPostulacionAdmin = async ({
  proyectoId,
  postulacionId,
  estado,
}) => {
  return await httpClient.patch(
    `/proyectos/${proyectoId}/postulaciones/${postulacionId}/estado`,
    { estado },
  );
};

export const cancelarProyectoAdmin = async (proyectoId) => {
  const response = await httpClient.post(`/admin/proyectos/${proyectoId}/cancelar`);
  return response.data;
};

// Abrir vacantes (expulsar múltiples estudiantes)
export const abrirVacantesAdmin = async ({ proyectoId, estudianteIds }) => {
  const response = await httpClient.post(`/admin/proyectos/${proyectoId}/abrir-vacantes`, {
    estudianteIds,
  });
  return response.data;
};
