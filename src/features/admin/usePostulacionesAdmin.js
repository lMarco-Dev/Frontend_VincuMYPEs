import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getPostulacionesAdmin } from './adminPostulaciones.api';

export function usePostulacionesAdmin(params) {
  return useQuery({
    queryKey: ['admin', 'postulaciones', params],
    queryFn: () => getPostulacionesAdmin(params),
    placeholderData: keepPreviousData,
  });
}
