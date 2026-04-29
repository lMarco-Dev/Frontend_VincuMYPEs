import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // No recarga la petición si cambias de pestaña
      retry: 1, // Solo reintenta 1 vez si falla
      staleTime: 5 * 60 * 1000, // La data se considera "fresca" por 5 minutos
    },
  },
});
