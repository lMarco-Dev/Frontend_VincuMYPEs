// src/features/admin/useAdminUsuarios.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsuariosAdmin,
  cambiarEstadoUsuarioAdmin,
  cambiarBypassLimiteAdmin,
  obtenerDetalleUsuarioAdmin,
  crearUsuarioAdmin,
  actualizarUsuarioAdmin,
  eliminarUsuarioAdmin,
} from "./adminUsuarios.api";

export function useAdminUsuarios(params = {}) {
  const queryClient = useQueryClient();

  const queryUsuarios = useQuery({
    queryKey: ["adminUsuarios", params],
    queryFn: () => getUsuariosAdmin(params),
    select: (response) => response.data,
  });

  const mutationCambiarEstado = useMutation({
    mutationFn: cambiarEstadoUsuarioAdmin,
    onSuccess: () => queryClient.invalidateQueries(["adminUsuarios"]),
  });

  const mutationCambiarBypassLimite = useMutation({
    mutationFn: cambiarBypassLimiteAdmin,
    onSuccess: () => queryClient.invalidateQueries(["adminUsuarios"]),
  });

  // NUEVAS MUTACIONES
  const mutationCrearUsuario = useMutation({
    mutationFn: crearUsuarioAdmin,
    onSuccess: () => queryClient.invalidateQueries(["adminUsuarios"]),
  });

  const mutationActualizarUsuario = useMutation({
    mutationFn: ({ usuarioId, data }) =>
      actualizarUsuarioAdmin(usuarioId, data),
    onSuccess: () => queryClient.invalidateQueries(["adminUsuarios"]),
  });

  const mutationEliminarUsuario = useMutation({
    mutationFn: ({ usuarioId, permanente }) =>
      eliminarUsuarioAdmin(usuarioId, permanente),
    onSuccess: () => queryClient.invalidateQueries(["adminUsuarios"]),
  });

  const obtenerDetalle = (usuarioId) => {
    return useQuery({
      queryKey: ["adminUsuarioDetalle", usuarioId],
      queryFn: () => obtenerDetalleUsuarioAdmin(usuarioId),
      select: (response) => response.data,
      enabled: !!usuarioId,
    });
  };

  return {
    usuarios: queryUsuarios.data?.content || [],
    totalElements: queryUsuarios.data?.totalElements || 0,
    totalPages: queryUsuarios.data?.totalPages || 0,
    isLoading: queryUsuarios.isLoading,
    isError: queryUsuarios.isError,
    cambiarEstado: mutationCambiarEstado.mutate,
    isCambiandoEstado: mutationCambiarEstado.isPending,
    cambiarBypassLimite: mutationCambiarBypassLimite.mutate,
    isCambiandoBypass: mutationCambiarBypassLimite.isPending,
    errorBypass:
      mutationCambiarBypassLimite.error?.response?.data?.message || null,
    // Nuevos
    crearUsuario: mutationCrearUsuario.mutateAsync,
    isCreando: mutationCrearUsuario.isPending,
    actualizarUsuario: mutationActualizarUsuario.mutateAsync,
    isActualizando: mutationActualizarUsuario.isPending,
    eliminarUsuario: mutationEliminarUsuario.mutateAsync,
    isEliminando: mutationEliminarUsuario.isPending,
    obtenerDetalle,
  };
}
