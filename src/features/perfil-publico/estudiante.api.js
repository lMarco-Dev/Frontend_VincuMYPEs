import httpClient from "@/shared/api/httpClient";

export const obtenerPerfilPublicoEstudianteApi = async (estudianteId) => {
  const response = await httpClient.get(`/estudiantes/${estudianteId}/public-profile`);
  return response.data;
};