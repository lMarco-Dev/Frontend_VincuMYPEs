import api from "@shared/api/httpClient";

export const getArbolActivo = () => api.get("/arbol-decision/activo?plazo=CORTO");