// src/shared/api/httpClient.js
import axios from "axios";
import { tokenStorage } from "./tokenStorage";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor de solicitudes - Añade el token JWT
httpClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    
    // No enviar el token para rutas de autenticación (login, register)
    const isAuthRoute = config.url?.includes('/auth/');
    
    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas - Maneja errores y refresh token
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es error 401 y no es un reintento, intentamos refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenStorage.getRefreshToken();
        
        if (!refreshToken) {
          throw new Error("No hay refresh token disponible");
        }

        // Intentamos obtener un nuevo access token
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken: refreshToken,
        });

        // Guardamos los nuevos tokens
        if (data.accessToken) {
          tokenStorage.setTokens(data.accessToken, data.refreshToken || refreshToken);
        } else {
          throw new Error("No se recibió un nuevo access token");
        }

        // Reintentamos la petición original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return httpClient(originalRequest);
        
      } catch (refreshError) {
        // Si falla el refresh, limpiamos tokens y redirigimos al login
        tokenStorage.clearTokens();
        
        // Solo redirigir si no estamos ya en la página de login
        if (window.location.pathname !== '/login') {
          window.location.href = "/login";
        }
        
        return Promise.reject(refreshError);
      }
    }

    // Manejo de otros códigos de error
    if (error.response?.status === 403) {
      // Redirigir a página de prohibido solo si no estamos ya ahí
      if (window.location.pathname !== '/forbidden') {
        window.location.href = "/forbidden";
      }
    }

    // Para errores de red o tiempo de espera
    if (!error.response) {
      console.error("Error de conexión:", error.message);
      // Podrías mostrar un mensaje de "Sin conexión" aquí
    }

    return Promise.reject(error);
  }
);

// Función auxiliar para verificar si el token está por expirar
export const isTokenExpiringSoon = () => {
  const token = tokenStorage.getAccessToken();
  if (!token) return true;

  try {
    // Decodificar el payload del JWT (parte del medio)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convertir a milisegundos
    const currentTime = Date.now();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutos en milisegundos

    // Retornar true si el token expirará en los próximos 5 minutos
    return (expirationTime - currentTime) < fiveMinutes;
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
      tokenStorage.setTokens(data.accessToken, data.refreshToken || refreshToken);
      return data.accessToken;
    }
  } catch (error) {
    console.error("Error al refrescar token:", error);
    tokenStorage.clearTokens();
  }

  return null;
};

export default httpClient;