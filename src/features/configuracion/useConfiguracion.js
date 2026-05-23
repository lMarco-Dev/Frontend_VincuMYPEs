import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  actualizarInfoApi,
  cambiarPasswordApi,
  cambiarEmailApi,
  desactivarCuentaApi,
} from "./configuracion.api";
import { handleApiError } from "@/shared/api/apiErrors";
import { useAuthStore } from "@/store/authStore";

// Hook genérico reutilizable para todas las mutaciones de config
function useMutacion(fn, onSuccessExtra) {
  const queryClient = useQueryClient();
  const m = useMutation({
    mutationFn: fn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["usuario-me"] });
      onSuccessExtra?.(data);
    },
    onError: (err) => console.error(handleApiError(err)),
  });
  return {
    ejecutar: m.mutate,
    isLoading: m.isPending,
    isSuccess: m.isSuccess,
    error: m.error ? handleApiError(m.error) : null,
    reset: m.reset,
  };
}

export const useActualizarInfo = () => useMutacion(actualizarInfoApi);
export const useCambiarPassword = () => useMutacion(cambiarPasswordApi);
export const useCambiarEmail = () => useMutacion(cambiarEmailApi);
export const useDesactivarCuenta = (onSuccess) =>
  useMutacion(desactivarCuentaApi, onSuccess);
