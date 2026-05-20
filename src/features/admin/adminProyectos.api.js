import { httpClient } from "@/shared/api/httpClient";

export const getProyectosAdmin = async () => {
  return await httpClient.get("/admin/proyectos");
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
