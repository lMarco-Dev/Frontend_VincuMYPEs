import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cambiarEstadoPostulacionAdmin } from './adminPostulaciones.api';

export function useCambiarEstadoPostulacion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cambiarEstadoPostulacionAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'postulaciones'] });
    },
  });
}
