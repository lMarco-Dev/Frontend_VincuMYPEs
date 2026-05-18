import { httpClient } from "@/shared/api/httpClient";

export const getProyectosAdmin = async () => {
  return await httpClient.get("/admin/proyectos");
};

export const cederGestionMype = async (proyectoId) => {
  return await httpClient.patch(`/admin/proyectos/${proyectoId}/ceder-gestion`);
};

export const auditarAbandonoEstudiante = async ({ proyectoId, postulacionId }) => {
  return await httpClient.post(`/admin/proyectos/${proyectoId}/postulaciones/${postulacionId}/auditar-abandono`);
};