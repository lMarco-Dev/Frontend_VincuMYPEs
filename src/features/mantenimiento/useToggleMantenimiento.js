import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarMantenimientoApi } from "./mantenimiento.api";

/**
 * Hook para que el admin active/desactive el modo mantenimiento.
 */
export function useToggleMantenimiento() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: actualizarMantenimientoApi,
    onSuccess: () => {
      // Refrescamos el estado público para que el gate y otros componentes vean el cambio.
      queryClient.invalidateQueries({ queryKey: ["mantenimiento-estado"] });
    },
  });

  return {
    toggleMantenimiento: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}