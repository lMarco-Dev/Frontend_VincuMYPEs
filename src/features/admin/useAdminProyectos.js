import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProyectosAdmin, cederGestionMype, auditarAbandonoEstudiante } from "./adminProyectos.api";

export function useAdminProyectos() {
  const queryClient = useQueryClient();

  // 1. Obtener la lista de proyectos
  const queryProyectos = useQuery({
    queryKey: ["adminProyectos"],
    queryFn: getProyectosAdmin,
    select: (response) => response.data,
  });

  // 2. Ceder gestión a la MYPE
  const mutationCederGestion = useMutation({
    mutationFn: cederGestionMype,
    onSuccess: () => {
      queryClient.invalidateQueries(["adminProyectos"]);
    },
  });

  // 3. Auditar y liberar cupo
  const mutationAuditarAbandono = useMutation({
    mutationFn: auditarAbandonoEstudiante,
    onSuccess: () => {
      queryClient.invalidateQueries(["adminProyectos"]);
    },
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