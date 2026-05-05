import { httpClient } from "@/shared/api/httpClient";

export const registerEstudianteApi = (data) => {
  return httpClient.post("/auth/register/estudiante", data);
};

export const registerMypeApi = (data) => {
  return httpClient.post("/auth/register/mype", data);
};
