import { useQuery } from '@tanstack/react-query';
import { getProyectos } from './proyectos.api';

export const useProyectos = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['proyectos', page, size],
    queryFn: () => getProyectos(page, size),
    keepPreviousData: true,
  });
};
