import { httpClient } from "@/shared/api/httpClient";

// Perfil público de cualquier MYPE (estudiante o admin lo llama)
export const getMypePerfilApi = (mypeId) =>
  httpClient.get(`/mypes/${mypeId}/perfil`);

// La MYPE obtiene su propio perfil
export const getMiPerfilMypeApi = () => httpClient.get("/mypes/mi-perfil");

// La MYPE actualiza su perfil
export const actualizarMypePerfilApi = (mypeId, data) =>
  httpClient.put(`/mypes/${mypeId}/perfil`, data);
