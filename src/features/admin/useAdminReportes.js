import { useQuery } from "@tanstack/react-query";
import { getReportesStatsAdmin } from "./adminReportes.api";

export function useAdminReportes() {
  const queryReportes = useQuery({
    queryKey: ["adminReportesStats"],
    queryFn: getReportesStatsAdmin,
    select: (response) => response.data,
  });

  return {
    reportes: queryReportes.data?.reportes || [],
    promedioGeneral: queryReportes.data?.promedioGeneral ?? 0,
    promedioMypeAEstudiante: queryReportes.data?.promedioMypeAEstudiante ?? 0,
    promedioEstudianteAMype: queryReportes.data?.promedioEstudianteAMype ?? 0,
    totalCalificaciones: queryReportes.data?.totalCalificaciones ?? 0,
    isLoading: queryReportes.isLoading,
  };
}