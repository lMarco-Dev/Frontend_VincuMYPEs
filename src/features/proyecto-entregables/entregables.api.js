import { httpClient } from "@/shared/api/httpClient";

export const getEntregablesPorProyecto = async (proyectoId) => {
  const { data } = await httpClient.get(`/proyectos/${proyectoId}/entregables`);
  return data;
};

export const getMisEntregablesPorProyecto = async (proyectoId) => {
  const { data } = await httpClient.get(
    `/proyectos/${proyectoId}/entregables/mis-entregables`,
  );
  return data;
};

export const revisarEntregableApi = async (
  proyectoId,
  entregableId,
  payload,
) => {
  const { data } = await httpClient.patch(
    `/proyectos/${proyectoId}/entregables/${entregableId}/estado`,
    payload,
  );
  return data;
};

export const subirEntregableApi = async (proyectoId, formData) => {
  const { data } = await httpClient.post(
    `/proyectos/${proyectoId}/entregables`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
};
