import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listarEstudiantesAdminApi,
  actualizarLimiteProyectosApi,
} from "./adminEstudiantes.api";
import { handleApiError } from "@/shared/api/apiErrors";

export function useEstudiantesAdmin() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-estudiantes"],
    queryFn: listarEstudiantesAdminApi,
  });

  return {
    estudiantes: data?.data ?? [],
    isLoading,
    error: error ? handleApiError(error) : null,
  };
}

export function useActualizarLimite() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: actualizarLimiteProyectosApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-estudiantes"] });
    },
  });

  return {
    actualizarLimite: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error ? handleApiError(mutation.error) : null,
  };
}