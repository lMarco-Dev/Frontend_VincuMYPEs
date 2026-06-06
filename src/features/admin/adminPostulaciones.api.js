import { httpClient } from '@/shared/api/httpClient';

export const getPostulacionesAdmin = (params) =>
  httpClient.get('/admin/postulaciones', { params }).then((r) => r.data);

export const cambiarEstadoPostulacionAdmin = ({ proyectoId, postulacionId, estado }) =>
  httpClient.patch(
    `/proyectos/${proyectoId}/postulaciones/${postulacionId}/estado`,
    { estado },
  );
