import { httpClient } from "@/shared/api/httpClient";

export const getInsumosTipo = (tipoId) =>
  httpClient.get(`/tipos-proyecto/${tipoId}/insumos`);

export const crearInsumoTipo = (tipoId, data) =>
  httpClient.post(`/tipos-proyecto/${tipoId}/insumos`, data);

export const actualizarInsumoTipo = (tipoId, insumoId, data) =>
  httpClient.put(`/tipos-proyecto/${tipoId}/insumos/${insumoId}`, data);

export const eliminarInsumoTipo = (tipoId, insumoId) =>
  httpClient.delete(`/tipos-proyecto/${tipoId}/insumos/${insumoId}`);