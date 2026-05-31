import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsuariosAdmin,
  cambiarEstadoUsuarioAdmin,
  cambiarBypassLimiteAdmin,
} from "./adminUsuarios.api";

export function useAdminUsuarios() {
  const queryClient = useQueryClient();

  const queryUsuarios = useQuery({
    queryKey: ["adminUsuarios"],
    queryFn: getUsuariosAdmin,
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

  return {
    usuarios: queryUsuarios.data || [],
    isLoading: queryUsuarios.isLoading,
    isError: queryUsuarios.isError,
    cambiarEstado: mutationCambiarEstado.mutate,
    isCambiandoEstado: mutationCambiarEstado.isPending,
    cambiarBypassLimite: mutationCambiarBypassLimite.mutate,
    isCambiandoBypass: mutationCambiarBypassLimite.isPending,
    errorBypass: mutationCambiarBypassLimite.error?.response?.data?.message || null,
  };
}
