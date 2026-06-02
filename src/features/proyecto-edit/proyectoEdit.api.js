import { httpClient } from "@/shared/api/httpClient";

// PUT /api/proyectos/{id}
export const editarProyectoApi = (id, data) => {
  return httpClient.put(`/proyectos/${id}`, data);
};

export const completarProyectoApi = (id) =>
  httpClient.patch(`/proyectos/${id}/completar`);

// DELETE /api/proyectos/{id}
export const eliminarProyectoApi = (id) => {
  return httpClient.delete(`/proyectos/${id}`);
};
