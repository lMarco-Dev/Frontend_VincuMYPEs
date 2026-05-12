import axios from "axios";
import { tokenStorage } from "./tokenStorage";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

httpClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  
  // No enviar el token para rutas de autenticación (login, register)
  const isAuthRoute = config.url.includes('/auth/');
  
  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenStorage.getRefreshToken();
        if (!refreshToken) throw new Error("No hay refresh token");

        const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
        const { data } = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken,
        });

        tokenStorage.setTokens(data.accessToken, data.refreshToken); // ¡Guardamos fácil!

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return httpClient(originalRequest);
      } catch (refreshError) {
        tokenStorage.clearTokens(); // ¡Limpiamos fácil!
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) window.location.href = "/forbidden";

    return Promise.reject(error);
  },
);
