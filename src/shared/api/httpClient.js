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
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor de solicitudes - Añade el token JWT
httpClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();

    // No enviar el token para rutas de autenticación (login, register)
    const isAuthRoute = config.url?.includes("/auth/");

    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${tokenStorage.getAccessToken()}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor de respuestas - Maneja errores y refresh token
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es error 401 y no es un reintento, intentamos refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
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
    window.location.href = "/login";
    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
}

    // ─── Manejo del 503 modo mantenimiento ───
    if (
      error.response?.status === 503 &&
      (error.response?.data?.error === "MAINTENANCE_MODE" ||
        /mantenimiento/i.test(error.response?.data?.message || ""))
    ) {
      // No hacemos logout: cuando termine el mantenimiento, la sesión sigue.
      // No redirigimos: el MaintenanceGate va a detectarlo via polling.
      // Pero emitimos un evento para que el gate refresque inmediato.
      window.dispatchEvent(new CustomEvent("maintenance-mode-detected"));
      return Promise.reject(error);
    }

   // Manejo de otros códigos de error
    if (error.response?.status === 403) {
      // Redirigir a página de prohibido solo si no estamos ya ahí
      // if (window.location.pathname !== "/forbidden") {
      //   window.location.href = "/forbidden";
      // }
      // Por ahora, solo rechaza el error sin redirigir
      return Promise.reject(error);
    }

    // Para errores de red o tiempo de espera
    if (!error.response) {
      console.error("Error de conexión:", error.message);
      // Podrías mostrar un mensaje de "Sin conexión" aquí
    }

    return Promise.reject(error);
  },
);

// Función auxiliar para verificar si el token está por expirar
export const isTokenExpiringSoon = () => {
  const token = tokenStorage.getAccessToken();
  if (!token) return true;

  try {
    // Decodificar el payload del JWT (parte del medio)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = payload.exp * 1000; // Convertir a milisegundos
    const currentTime = Date.now();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutos en milisegundos

    // Retornar true si el token expirará en los próximos 5 minutos
    return expirationTime - currentTime < fiveMinutes;
  } catch (error) {
    console.error("Error al verificar expiración del token:", error);
    return true;
  }
};

// Función auxiliar para refrescar el token manualmente si es necesario
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
