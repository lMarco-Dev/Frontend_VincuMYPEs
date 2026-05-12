import { httpClient } from "@/shared/api/httpClient";

export const publicarProyectoApi = (proyectoId) => {
  return httpClient.patch(`/proyectos/${proyectoId}/publicar`);
};
