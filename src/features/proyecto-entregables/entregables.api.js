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

// ✅ NUEVA FUNCIÓN - Para que la MYPE vea SOLO entregables con archivo (subidos por estudiantes)
export const getEntregablesSubidosPorProyecto = async (proyectoId) => {
  const { data } = await httpClient.get(`/proyectos/${proyectoId}/entregables/subidos`);
  return data;
};

export const lockEntregable = (proyectoId, entregableId) =>
  httpClient.post(`/proyectos/${proyectoId}/entregables/${entregableId}/lock`);

export const unlockEntregable = (proyectoId, entregableId) =>
  httpClient.post(`/proyectos/${proyectoId}/entregables/${entregableId}/unlock`);

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