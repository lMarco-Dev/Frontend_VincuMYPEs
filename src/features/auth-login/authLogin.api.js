import { httpClient } from "@/shared/api/httpClient";

//Llamamos al backend
export const loginApi = (credentials) => {
  return httpClient.post("/auth/login", credentials);
};
