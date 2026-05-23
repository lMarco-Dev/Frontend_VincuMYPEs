import { httpClient } from "@/shared/api/httpClient";

export const getConversacionesApi = () =>
  httpClient.get("/mensajes/conversaciones");
export const getMensajesApi = (id) =>
  httpClient.get(`/mensajes/conversaciones/${id}`);
export const enviarMensajeApi = (id, d) =>
  httpClient.post(`/mensajes/conversaciones/${id}`, d);
