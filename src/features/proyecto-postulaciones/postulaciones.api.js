import { httpClient } from "@/shared/api/httpClient";

export const getPostulacionesApi = (proyectoId) => {
  return httpClient.get(`/proyectos/${proyectoId}/postulaciones`);
};

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
