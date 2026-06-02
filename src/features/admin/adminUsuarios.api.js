import { httpClient } from "@/shared/api/httpClient";

export const getUsuariosAdmin = async () => {
  return await httpClient.get("/admin/usuarios");
};

export const cambiarEstadoUsuarioAdmin = async (usuarioId) => {
  return await httpClient.patch(`/admin/usuarios/${usuarioId}/estado`);
};

export const cambiarBypassLimiteAdmin = async ({ estudianteId, nuevoLimite }) => {
  return await httpClient.patch(`/admin/estudiantes/usuario/${estudianteId}/limite-proyectos`, {
    nuevoLimite,
  });
};
