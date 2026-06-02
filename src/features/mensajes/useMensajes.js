import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getConversacionesApi,
  getMensajesApi,
  enviarMensajeApi,
} from "./mensajes.api";
import { handleApiError } from "@/shared/api/apiErrors";
import { useAuthStore } from "@/store/authStore";

// Lista de conversaciones de la MYPE
export function useConversaciones() {
  const { isAuthenticated } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ["conversaciones"],
    queryFn: getConversacionesApi,
    select: (res) => res.data,
    refetchInterval: 10_000,
    enabled: isAuthenticated,
  });
  return { conversaciones: data ?? [], isLoading };
}

// Mensajes de una conversación específica
export function useMensajes(conversacionId) {
  const { data, isLoading } = useQuery({
    queryKey: ["mensajes", conversacionId],
    queryFn: () => getMensajesApi(conversacionId),
    enabled: !!conversacionId,
    select: (res) => res.data,
    refetchInterval: 5_000, // polling cada 5s cuando está abierto
  });
  return { mensajes: data ?? [], isLoading };
}

// Enviar mensaje
export function useEnviarMensaje(conversacionId) {
  const queryClient = useQueryClient();
  const m = useMutation({
    mutationFn: (texto) => enviarMensajeApi(conversacionId, { mensaje: texto }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mensajes", conversacionId] });
      queryClient.invalidateQueries({ queryKey: ["conversaciones"] });
    },
    onError: (err) => console.error(handleApiError(err)),
  });
  return { enviar: m.mutate, isLoading: m.isPending };
}
