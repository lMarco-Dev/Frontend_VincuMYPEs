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
    satisfaccionPromedio: queryReportes.data?.satisfaccionPromedio ?? 5.0,
    tiempoPromedio: queryReportes.data?.tiempoPromedio ?? 15,
    tasaExito: queryReportes.data?.tasaExito ?? 100.0,
    totalMypes: queryReportes.data?.totalMypes ?? 0,
    estudiantesActivos: queryReportes.data?.estudiantesActivos ?? 0,
    proyectosEnDesarrollo: queryReportes.data?.proyectosEnDesarrollo ?? 0,
    totalEvaluaciones: queryReportes.data?.totalEvaluaciones ?? 0,
    distribucionAreas: queryReportes.data?.distribucionAreas || [],
    isLoading: queryReportes.isLoading,
};
}
