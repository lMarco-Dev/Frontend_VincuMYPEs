import { httpClient } from "@/shared/api/httpClient";

export const getReportesStatsAdmin = async () => {
  return await httpClient.get("/admin/reportes");
};
