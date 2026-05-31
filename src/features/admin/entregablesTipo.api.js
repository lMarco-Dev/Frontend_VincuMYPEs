import { httpClient } from "@/shared/api/httpClient";

export const getEntregablesTipo = (tipoId) =>
  httpClient.get(`/tipos-proyecto/${tipoId}/entregables`);

export const crearEntregableTipo = (tipoId, data) =>
  httpClient.post(`/tipos-proyecto/${tipoId}/entregables`, data);

export const actualizarEntregableTipo = (tipoId, entregableId, data) =>
  httpClient.put(`/tipos-proyecto/${tipoId}/entregables/${entregableId}`, data);

export const eliminarEntregableTipo = (tipoId, entregableId) =>
  httpClient.delete(`/tipos-proyecto/${tipoId}/entregables/${entregableId}`);