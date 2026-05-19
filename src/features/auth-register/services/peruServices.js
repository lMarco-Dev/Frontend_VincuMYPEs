// src/features/auth-register/services/peruServices.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Instancia sin interceptores para endpoints públicos
const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const consultarDni = async (dni) => {
  try {
    console.log("Consultando DNI:", dni);
    const response = await publicApi.get(`/reniec/dni/${dni}`);
    console.log("Respuesta del backend:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error detallado:", error);
    console.error("Error response:", error.response);
    
    if (error.response?.data?.mensaje) {
      throw new Error(error.response.data.mensaje);
    }
    throw new Error("Error al consultar el DNI");
  }
};
export const consultarRuc = async (ruc) => {
  try {
    console.log("Consultando RUC:", ruc);
    const response = await publicApi.get(`/reniec/ruc/${ruc}`);
    console.log("Respuesta del backend RUC:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error detallado RUC:", error);
    console.error("Error response RUC:", error.response);
    
    if (error.response?.data?.mensaje) {
      throw new Error(error.response.data.mensaje);
    }
    throw new Error("Error al consultar el RUC");
  }
};