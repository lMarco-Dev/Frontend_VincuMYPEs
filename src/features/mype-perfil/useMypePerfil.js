import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMypePerfilApi,
  getMiPerfilMypeApi,
  actualizarMypePerfilApi,
} from "./mypePerfil.api";
import { handleApiError } from "@/shared/api/apiErrors";
import { useAuthStore } from "@/store/authStore";

// Hook para ver el perfil de CUALQUIER MYPE (lo usa el estudiante también)
export function useMypePerfil(mypeId) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["mype-perfil", mypeId],
    queryFn: () => getMypePerfilApi(mypeId),
    enabled: !!mypeId,
    select: (res) => res.data,
  });
  return { perfil: data ?? null, isLoading, error };
}

// Hook para la MYPE ver su propio perfil
export function useMiPerfilMype() {
  const { user } = useAuthStore();
  const { data, isLoading, error } = useQuery({
    queryKey: ["mi-perfil-mype", user?.id],
    queryFn: getMiPerfilMypeApi,
    enabled: !!user?.id,
    select: (res) => res.data,
  });
  return { perfil: data ?? null, isLoading, error };
}

// Hook para actualizar el perfil
export function useActualizarMypePerfil(mypeId) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data) => actualizarMypePerfilApi(mypeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mype-perfil", mypeId] });
      queryClient.invalidateQueries({ queryKey: ["mi-perfil-mype"] });
    },
    onError: (err) => console.error(handleApiError(err)),
  });
  return {
    actualizar: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error ? handleApiError(mutation.error) : null,
  };
}
