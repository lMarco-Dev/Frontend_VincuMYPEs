import { httpClient } from "@/shared/api/httpClient";

export const registerEstudianteApi = (data) => {
  return httpClient.post("/auth/register/estudiante", data);
};

export const registerMypeApi = (data) => {
  return httpClient.post("/auth/register/mype", data);
};

export const checkDniApi = (dni) => httpClient.get(`/auth/check-dni`, { params: { dni } });
export const checkRucApi = (ruc) => httpClient.get(`/auth/check-ruc`, { params: { ruc } });
export const checkEmailApi = (email) => httpClient.get(`/auth/check-email`, { params: { email } });
export const checkCodigoApi = (codigo) => httpClient.get(`/auth/check-codigo`, { params: { codigo } });
export const checkTelefonoApi = (telefono) => httpClient.get(`/auth/check-telefono`, { params: { telefono } });