import { httpClient } from "@/shared/api/httpClient";

export const getMypesPorEstadoApi = async (estado = "PENDIENTE") => {
  return await httpClient.get("/admin/mypes/pendientes", {
    params: { estado },
  });
};

export const aprobarMypeApi = async (mypeId) => {
  return await httpClient.patch(`/admin/mypes/${mypeId}/aprobar`);
};

export const rechazarMypeApi = async (mypeId, motivo) => {
  return await httpClient.patch(`/admin/mypes/${mypeId}/rechazar`, { motivo });
};
