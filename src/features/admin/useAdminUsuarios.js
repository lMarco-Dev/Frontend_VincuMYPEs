// src/features/admin/useAdminUsuarios.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsuariosAdmin,
  cambiarEstadoUsuarioAdmin,
  cambiarBypassLimiteAdmin,
} from "./adminUsuarios.api";

export function useAdminUsuarios(page = 0, size = 10, sortField = "id", sortDirection = "asc", rol = null) {
  const queryUsuarios = useQuery({
    queryKey: ["adminUsuarios", page, size, sortField, sortDirection, rol],
    queryFn: () => getUsuariosAdmin(page, size, sortField, sortDirection, rol),
    select: (response) => response.data,
    keepPreviousData: true,
  });

  const mutationCambiarEstado = useMutation({
    mutationFn: cambiarEstadoUsuarioAdmin,
    onSuccess: () => queryClient.invalidateQueries(["adminUsuarios"]),
  });

  const mutationCambiarBypassLimite = useMutation({
    mutationFn: cambiarBypassLimiteAdmin,
    onSuccess: () => queryClient.invalidateQueries(["adminUsuarios"]),
  });

  return {
    usuariosPage: queryUsuarios.data,
    isLoading: queryUsuarios.isLoading,
    isError: queryUsuarios.isError,
    cambiarEstado: mutationCambiarEstado.mutate,
    isCambiandoEstado: mutationCambiarEstado.isPending,
    cambiarBypassLimite: mutationCambiarBypassLimite.mutate,
    isCambiandoBypass: mutationCambiarBypassLimite.isPending,
    errorBypass: mutationCambiarBypassLimite.error?.response?.data?.message || null,
  };
}