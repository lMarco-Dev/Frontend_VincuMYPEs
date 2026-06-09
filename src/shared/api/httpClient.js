// src/shared/api/httpClient.js
import axios from "axios";
import { tokenStorage } from "./tokenStorage";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor de solicitudes - Añade el token JWT (sin cambios)
httpClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    const isAuthRoute = config.url?.includes("/auth/");
    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${tokenStorage.getAccessToken()}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor de respuestas - Maneja errores y refresh token
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ 1. Si es un error 401 y NO es una petición de autenticación, intentamos refrescar
    const isAuthRequest = originalRequest.url?.includes("/auth/login") ||
                          originalRequest.url?.includes("/auth/register") ||
                          originalRequest.url?.includes("/auth/refresh");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return httpClient(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = tokenStorage.getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        if (data.accessToken) {
          tokenStorage.setTokens(data.accessToken, data.refreshToken || refreshToken);
          processQueue(null, data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return httpClient(originalRequest);
        } else {
          throw new Error("No access token");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStorage.clearTokens();
        // Solo redirigir si no es una petición de login (ya excluida, pero por seguridad)
        if (!originalRequest.url?.includes("/auth/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ✅ 2. Manejo del 503 modo mantenimiento (sin cambios)
    if (
      error.response?.status === 503 &&
      (error.response?.data?.error === "MAINTENANCE_MODE" ||
        /mantenimiento/i.test(error.response?.data?.message || ""))
    ) {
      window.dispatchEvent(new CustomEvent("maintenance-mode-detected"));
      return Promise.reject(error);
    }

    // ✅ 3. Manejo de otros códigos de error (403, etc.)
    if (error.response?.status === 403) {
      return Promise.reject(error);
    }

    // ✅ 4. Para errores de red o tiempo de espera, solo registramos
    if (!error.response) {
      console.error("Error de conexión:", error.message);
    }

    // ✅ 5. Siempre rechazamos con el error original para que el frontend lo maneje
    return Promise.reject(error);
  },
);

// Función auxiliar para verificar si el token está por expirar (sin cambios)
export const isTokenExpiringSoon = () => {
  const token = tokenStorage.getAccessToken();
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    return expirationTime - currentTime < fiveMinutes;
  } catch (error) {
    console.error("Error al verificar expiración del token:", error);
    return true;
  }
};

// Función auxiliar para refrescar el token manualmente (sin cambios)
export const refreshTokenIfNeeded = async () => {
  if (!isTokenExpiringSoon()) return null;

  try {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) throw new Error("No hay refresh token");

    const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
      refreshToken: refreshToken,
    });

    if (data.accessToken) {
      tokenStorage.setTokens(
        data.accessToken,
        data.refreshToken || refreshToken,
      );
      return data.accessToken;
    }
  } catch (error) {
    console.error("Error al refrescar token:", error);
    tokenStorage.clearTokens();
  }
  return null;
};

export default httpClient;