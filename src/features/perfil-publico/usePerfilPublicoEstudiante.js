import { useQuery } from "@tanstack/react-query";
import { obtenerPerfilPublicoEstudianteApi } from "./estudiante.api";

/**
 * Hook para cargar el perfil público de un estudiante.
 * Expone flags útiles para que la página renderice 403/404/loading
 * sin tener que inspeccionar el error directamente.
 */
export function usePerfilPublicoEstudiante(estudianteId) {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["estudiante-publico", estudianteId],
    queryFn: () => obtenerPerfilPublicoEstudianteApi(estudianteId),
    enabled: !!estudianteId,
    retry: false, // 403 y 404 no se reintentan
    staleTime: 5 * 60 * 1000, // 5 min: el perfil no cambia seguido
  });

  const status = error?.response?.status;
  const perfilConUsuarioId = data ? { ...data, usuarioId: data.usuarioId || data.usuario?.id } : null;

  return {
    perfil: perfilConUsuarioId,
    isLoading,
    isError,
    isForbidden: status === 403,
    isNotFound: status === 404,
    errorMessage: error?.response?.data?.message || error?.message || null,
  };
}