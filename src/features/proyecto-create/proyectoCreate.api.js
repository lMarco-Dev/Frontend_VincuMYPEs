import { httpClient } from "@/shared/api/httpClient";

export const crearProyectoApi = (data) => {
  return httpClient.post("/proyectos", data);
};
