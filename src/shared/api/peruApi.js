// src/shared/api/peruApi.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Cambiamos para usar nuestro backend como proxy
export const peruApi = axios.create({
  baseURL: BASE_URL, // Apuntamos a nuestro backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para manejar errores
peruApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 404) {
        throw new Error(data?.mensaje || "No encontrado");
      }
      if (status === 401 || status === 403) {
        throw new Error("Error de autenticación");
      }
      throw new Error(data?.mensaje || "Error en la consulta");
    }
    throw new Error("Error de conexión con el servidor");
  }
);