import { useQuery } from "@tanstack/react-query";
import { getAuditoriaLogsAdmin } from "./adminAuditoria.api";

export function useAdminAuditoria() {
  const queryLogs = useQuery({
    queryKey: ["adminAuditoriaLogs"],
    queryFn: getAuditoriaLogsAdmin,
    select: (response) => response.data,
  });

  return {
    logs: queryLogs.data || [],
    isLoading: queryLogs.isLoading,
    isError: queryLogs.isError,
    refetch: queryLogs.refetch,
  };
}
