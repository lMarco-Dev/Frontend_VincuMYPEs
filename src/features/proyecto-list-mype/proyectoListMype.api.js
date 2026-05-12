import { httpClient } from "@/shared/api/httpClient";

export const getMisProyectosApi = () => {
  return httpClient.get("/proyectos/mis-proyectos");
};
