import { useQuery } from '@tanstack/react-query';
import { getProyectos } from './proyectos.api';

export const useProyectos = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['proyectos', page, size],
    queryFn: async () => {
      const res = await getProyectos(page, size);
      return res.data;
    },
    keepPreviousData: true,
  });
};
