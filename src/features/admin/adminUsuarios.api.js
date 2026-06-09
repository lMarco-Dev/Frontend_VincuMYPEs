// src/features/admin/adminUsuarios.api.js
import { httpClient } from "@/shared/api/httpClient";

// Existentes
export const getUsuariosAdmin = async (params = {}) => {
  const {
    page = 0,
    size = 10,
    sortField = "id",
    sortDirection = "asc",
    rol,
  } = params;
  return await httpClient.get("/admin/usuarios", {
    params: { page, size, sortField, sortDirection, rol },
  });
};

export const cambiarEstadoUsuarioAdmin = async (usuarioId) => {
  return await httpClient.patch(`/admin/usuarios/${usuarioId}/estado`);
};

export const cambiarBypassLimiteAdmin = async ({
  estudianteId,
  nuevoLimite,
}) => {
  return await httpClient.patch(
    `/admin/estudiantes/usuario/${estudianteId}/limite-proyectos`,
    {
      nuevoLimite,
    },
  );
};

// NUEVOS - CRUD Completo
export const obtenerDetalleUsuarioAdmin = async (usuarioId) => {
  return await httpClient.get(`/admin/usuarios/${usuarioId}`);
};

export const crearUsuarioAdmin = async (data) => {
  return await httpClient.post("/admin/usuarios", data);
};

export const actualizarUsuarioAdmin = async (usuarioId, data) => {
  return await httpClient.put(`/admin/usuarios/${usuarioId}`, data);
};

export const eliminarUsuarioAdmin = async (usuarioId, permanente = false) => {
  return await httpClient.delete(`/admin/usuarios/${usuarioId}`, {
    params: { permanente },
  });
};
