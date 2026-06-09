import httpClient from "@/shared/api/httpClient";

export const crearCalificacionApi = (data) =>
  httpClient.post("/calificaciones", data).then(r => r.data);

export const obtenerPendientesApi = () =>
  httpClient.get("/calificaciones/me/pendientes").then(r => r.data);

export const obtenerRatingUsuarioApi = (usuarioId) =>
  httpClient.get(`/calificaciones/usuarios/${usuarioId}/rating`).then(r => r.data);