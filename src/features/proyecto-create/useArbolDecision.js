import { useQuery } from "@tanstack/react-query";
import { getArbolActivo } from "./arbolDecision.api";

export function useArbolDecision() {
  return useQuery({
    queryKey: ["arbol-decision", "CORTO"],
    queryFn: () => getArbolActivo().then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
    retry: 1,
  });
}