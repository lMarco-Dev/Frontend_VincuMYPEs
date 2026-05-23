import { httpClient } from "@/shared/api/httpClient";

export const getAuditoriaLogsAdmin = async () => {
  return await httpClient.get("/admin/auditoria");
};
