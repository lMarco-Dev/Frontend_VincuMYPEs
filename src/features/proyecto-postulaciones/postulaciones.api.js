import { httpClient } from "@/shared/api/httpClient";

// Vista normal — solo postulantes que el admin ya aprobó
export const getPostulacionesAceptadasApi = (proyectoId) => {
  return httpClient.get(`/proyectos/${proyectoId}/postulaciones/aceptadas`);
};

// Vista completa — cuando la MYPE solicita ver todos
export const getPostulacionesApi = (proyectoId) => {
  return httpClient.get(`/proyectos/${proyectoId}/postulaciones`);
};

// Cambiar estado de una postulación
export const cambiarEstadoPostulacionApi = ({
  proyectoId,
  postulacionId,
  estado,
}) => {
  return httpClient.patch(
    `/proyectos/${proyectoId}/postulaciones/${postulacionId}/estado`,
    { estado },
  );
};
