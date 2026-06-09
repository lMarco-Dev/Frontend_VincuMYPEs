import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  emitirCertificadoApi,
  getCertificadosEmitidosApi,
  eliminarCertificadoApi,
} from "./certificados.api";
import { handleApiError } from "@/shared/api/apiErrors";
import { useAuthStore } from "@/store/authStore";

export function useCertificadosEmitidos() {
  const { user } = useAuthStore();
  const { data, isLoading, error } = useQuery({
    queryKey: ["certificados-emitidos", user?.id],
    queryFn: getCertificadosEmitidosApi,
    enabled: !!user?.id,
  });
  return { certificados: data?.data ?? [], isLoading, error };
}

export function useEmitirCertificado() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: emitirCertificadoApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificados-emitidos"] });
    },
    onError: (error) => console.error(handleApiError(error)),
  });
  return {
    emitir: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error ? handleApiError(mutation.error) : null,
  };
}

// ✅ Hook para eliminar certificado
export function useEliminarCertificado() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: eliminarCertificadoApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificados-emitidos"] });
    },
    onError: (error) => {
      console.error("Error eliminando certificado:", error);
      return handleApiError(error);
    },
  });
  return {
    eliminar: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error ? handleApiError(mutation.error) : null,
  };
}
