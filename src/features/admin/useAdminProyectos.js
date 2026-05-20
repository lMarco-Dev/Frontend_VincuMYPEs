import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProyectosAdmin,
  cederGestionMype,
  auditarAbandonoEstudiante,
  getPostulacionesAdmin,
  cambiarEstadoPostulacionAdmin,
} from "./adminProyectos.api";

export function useAdminProyectos() {
  const queryClient = useQueryClient();

  const queryProyectos = useQuery({
    queryKey: ["adminProyectos"],
    queryFn: getProyectosAdmin,
    select: (response) => response.data,
  });

  const mutationCederGestion = useMutation({
    mutationFn: cederGestionMype,
    onSuccess: () => queryClient.invalidateQueries(["adminProyectos"]),
  });

  const mutationAuditarAbandono = useMutation({
    mutationFn: auditarAbandonoEstudiante,
    onSuccess: () => queryClient.invalidateQueries(["adminProyectos"]),
  });

  return {
    proyectos: queryProyectos.data || [],
    isLoading: queryProyectos.isLoading,
    isError: queryProyectos.isError,
    cederGestion: mutationCederGestion.mutate,
    isCediendo: mutationCederGestion.isPending,
    auditarAbandono: mutationAuditarAbandono.mutate,
    isAuditando: mutationAuditarAbandono.isPending,
  };
}

// ← AGREGAR ESTO: hook separado para postulaciones de un proyecto
export function usePostulacionesAdmin(proyectoId) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["adminPostulaciones", proyectoId],
    queryFn: () => getPostulacionesAdmin(proyectoId),
    enabled: !!proyectoId,
    select: (res) => res.data,
  });

  const mutation = useMutation({
    mutationFn: cambiarEstadoPostulacionAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries(["adminPostulaciones", proyectoId]);
      queryClient.invalidateQueries(["adminProyectos"]);
    },
  });

  return {
    postulaciones: data ?? [],
    isLoading,
    cambiarEstado: mutation.mutate,
    isCambiando: mutation.isPending,
  };
}
