import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  actualizarInfoApi,
  cambiarPasswordApi,
  cambiarEmailApi,
  desactivarCuentaApi,
} from "./configuracion.api";
import { handleApiError } from "@/shared/api/apiErrors";
import { useAuthStore } from "@/store/authStore";
import { httpClient } from "@/shared/api/httpClient"; // ← named, no default
import { tokenStorage } from "@/shared/api/tokenStorage"; // ← para guardar el nuevo token

// ── Datos frescos del usuario desde el backend ────────────────
export function useUsuarioMe() {
  const { user } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ["usuario-me", user?.id],
    queryFn: () => httpClient.get("/usuarios/me"),
    enabled: !!user?.id,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5,
  });
  return { usuario: data ?? null, isLoading };
}

// ── Hook genérico para mutaciones simples ─────────────────────
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
export const useDesactivarCuenta = (onSuccess) =>
  useMutacion(desactivarCuentaApi, onSuccess);

// ── useCambiarEmail — separado porque guarda el nuevo token ───
export function useCambiarEmail() {
  const queryClient = useQueryClient();
  const m = useMutation({
    mutationFn: cambiarEmailApi,
    onSuccess: (response) => {
      const nuevoToken = response.data?.nuevoToken;
      if (nuevoToken) {
        // Reemplaza el access token — el refresh token no cambia
        tokenStorage.setTokens(nuevoToken, tokenStorage.getRefreshToken());
      }
      queryClient.invalidateQueries({ queryKey: ["usuario-me"] });
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
