import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProyectosAdmin,
  cederGestionMype,
  auditarAbandonoEstudiante,
  getPostulacionesAdmin,
  cambiarEstadoPostulacionAdmin,
  cancelarProyectoAdmin,      // ← nueva
  abrirVacantesAdmin,         // ← nueva
} from "./adminProyectos.api";

export function useAdminProyectos(page = 0, size = 10, sortField = "id", sortDirection = "asc") {
  const queryClient = useQueryClient();

  const queryProyectos = useQuery({
    queryKey: ["adminProyectos", page, size, sortField, sortDirection],
    queryFn: () => getProyectosAdmin(page, size, sortField, sortDirection),
    select: (response) => response.data,
    keepPreviousData: true,
  });

  // Ceder gestión a la MYPE
  const mutationCederGestion = useMutation({
    mutationFn: cederGestionMype,
    onSuccess: () => queryClient.invalidateQueries(["adminProyectos"]),
  });

  // Auditar abandono (versión antigua, un estudiante)
  const mutationAuditarAbandono = useMutation({
    mutationFn: auditarAbandonoEstudiante,
    onSuccess: () => queryClient.invalidateQueries(["adminProyectos"]),
  });

  // 🆕 Cancelar proyecto completo
  const mutationCancelarProyecto = useMutation({
  mutationFn: cancelarProyectoAdmin,
  onSuccess: () => queryClient.invalidateQueries(["adminProyectos"]),
});

  // 🆕 Abrir vacantes (múltiples estudiantes)
  const mutationAbrirVacantes = useMutation({
    mutationFn: abrirVacantesAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries(["adminProyectos"]);
    },
  });

  return {
    proyectosPage: queryProyectos.data,
    isLoading: queryProyectos.isLoading,
    isError: queryProyectos.isError,
    cederGestion: mutationCederGestion.mutate,
    isCediendo: mutationCederGestion.isPending,
    auditarAbandono: mutationAuditarAbandono.mutate,
    isAuditando: mutationAuditarAbandono.isPending,
    // 🆕 nuevas funciones
    cancelarProyecto: mutationCancelarProyecto.mutate,
    isCancelando: mutationCancelarProyecto.isPending,
    abrirVacantes: mutationAbrirVacantes.mutate,
    isAbriendoVacantes: mutationAbrirVacantes.isPending,
  };
}

// Hook para postulaciones (sin cambios)
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

