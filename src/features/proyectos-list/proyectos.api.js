import { httpClient } from '@shared/api/httpClient';

export const getProyectos = async (page = 0, size = 10) => {
  const response = await httpClient.get('/proyectos', {
    params: { page, size, sort: 'fechaCreacion,desc' },
  });
  return response.data;
};

export const puedeEmitirCertificado = async (proyectoId) => {
  const response = await httpClient.get(`/proyectos/${proyectoId}/puede-emitir-certificado`);
  return response.data;
};