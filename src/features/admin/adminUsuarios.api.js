// src/features/admin/adminUsuarios.api.js
import { httpClient } from "@/shared/api/httpClient";

export const getUsuariosAdmin = async (page = 0, size = 10, sortField = "id", sortDirection = "asc", rol = null) => {
  return await httpClient.get("/admin/usuarios", {
    params: { page, size, sortField, sortDirection, rol }
  });
};
export const cambiarEstadoUsuarioAdmin = async (usuarioId) => {
  return await httpClient.patch(`/admin/usuarios/${usuarioId}/estado`);
};

export const cambiarBypassLimiteAdmin = async ({ estudianteId, nuevoLimite }) => {
  return await httpClient.patch(`/admin/estudiantes/usuario/${estudianteId}/limite-proyectos`, {
    nuevoLimite,
  });
};