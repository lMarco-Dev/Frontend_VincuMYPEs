import httpClient from "@/shared/api/httpClient";

/**
 * Endpoint público — cualquier usuario (incluso no logueado) lo puede llamar.
 * Devuelve { modoMantenimiento: boolean }
 */
export const obtenerEstadoMantenimientoApi = async () => {
  const response = await httpClient.get("/configuracion/estado");
  return response.data;
};

/**
 * Endpoint admin — solo ROLE_ADMIN. Cambia el flag.
 */
export const actualizarMantenimientoApi = async (modoMantenimiento) => {
  const response = await httpClient.put("/admin/configuracion/mantenimiento", {
    modoMantenimiento,
  });
  return response.data;
};