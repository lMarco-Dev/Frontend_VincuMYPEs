import { httpClient } from '@shared/api/httpClient';

export const getProyectos = async (page = 0, size = 10) => {
  const response = await httpClient.get('/proyectos', {
    params: { page, size, sort: 'fechaCreacion,desc' },
  });
  return response.data;
};