import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCalificacionesAdmin,
  obtenerCalificacionAdmin,
  editarCalificacionAdmin,
  eliminarCalificacionAdmin,
  buscarCalificacionPorProyecto,
} from "./adminCalificaciones.api";

export function useAdminCalificaciones(params = {}) {
  const queryClient = useQueryClient();

  const queryCalificaciones = useQuery({
    queryKey: ["adminCalificaciones", params],
    queryFn: () => getCalificacionesAdmin(params),
    select: (response) => response.data,
  });

  const mutationEditar = useMutation({
    mutationFn: ({ id, data }) => editarCalificacionAdmin(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["adminCalificaciones"] }),
  });

  const mutationEliminar = useMutation({
    mutationFn: eliminarCalificacionAdmin,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["adminCalificaciones"] }),
  });

  const obtenerDetalle = (id) => {
    return useQuery({
      queryKey: ["adminCalificacionDetalle", id],
      queryFn: () => obtenerCalificacionAdmin(id),
      select: (response) => response.data,
      enabled: !!id,
    });
  };

  const buscarPorProyecto = (proyectoId, calificadorId, calificadoId) => {
    return useQuery({
      queryKey: [
        "adminCalificacionBuscar",
        proyectoId,
        calificadorId,
        calificadoId,
      ],
      queryFn: () =>
        buscarCalificacionPorProyecto(proyectoId, calificadorId, calificadoId),
      select: (response) => response.data,
      enabled: !!proyectoId && !!calificadorId && !!calificadoId,
    });
  };

  return {
    calificaciones: queryCalificaciones.data?.content || [],
    totalElements: queryCalificaciones.data?.totalElements || 0,
    totalPages: queryCalificaciones.data?.totalPages || 0,
    isLoading: queryCalificaciones.isLoading,
    isError: queryCalificaciones.isError,
    editarCalificacion: mutationEditar.mutateAsync,
    isEditando: mutationEditar.isPending,
    eliminarCalificacion: mutationEliminar.mutateAsync,
    isEliminando: mutationEliminar.isPending,
    obtenerDetalle,
    buscarPorProyecto,
  };
}
