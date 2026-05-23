import { httpClient } from "@/shared/api/httpClient";

export const actualizarInfoApi = (data) =>
  httpClient.patch("/usuarios/me/info", data);
export const cambiarPasswordApi = (data) =>
  httpClient.patch("/usuarios/me/password", data);
export const cambiarEmailApi = (data) =>
  httpClient.patch("/usuarios/me/email", data);
export const desactivarCuentaApi = (data) =>
  httpClient.patch("/usuarios/me/desactivar", data);
