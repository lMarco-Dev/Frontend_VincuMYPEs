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
    isLoading: queryReportes.isLoading,
    isError: queryReportes.isError,
    refetch: queryReportes.refetch,
  };
}
