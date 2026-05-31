import { httpClient } from "@/shared/api/httpClient";

export const getTiposProyecto = (params = {}) =>
  httpClient.get("/tipos-proyecto", { params });

export const crearTipoProyecto = (data) => httpClient.post("/tipos-proyecto", data);
export const actualizarTipoProyecto = (id, data) => httpClient.put(`/tipos-proyecto/${id}`, data);
export const toggleActivoTipoProyecto = (id) => httpClient.patch(`/tipos-proyecto/${id}/toggle`);
export const eliminarTipoProyecto = (id) => httpClient.delete(`/tipos-proyecto/${id}`);