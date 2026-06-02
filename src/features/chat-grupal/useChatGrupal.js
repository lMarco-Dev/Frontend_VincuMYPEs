import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getChatsGrupoApi,
  getMensajesGrupoApi,
  enviarMensajeGrupoApi,
} from "./chatGrupal.api";

// Obtener chats del proyecto
export function useChatsGrupo(proyectoId) {
  const { data, isLoading } = useQuery({
    queryKey: ["chatsGrupo", proyectoId],
    queryFn: () => getChatsGrupoApi(proyectoId).then((res) => res.data),
    enabled: !!proyectoId,
  });

  return {
    chats: data ?? [],
    isLoading,
  };
}

// Mensajes de un chat
export function useMensajesGrupo(proyectoId, chatId) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["mensajesGrupo", proyectoId, chatId],
    queryFn: () =>
      getMensajesGrupoApi(proyectoId, chatId).then((res) => res.data),
    enabled: !!proyectoId && !!chatId,
    refetchInterval: 5000, // Polling cada 5s
  });

  return {
    mensajes: data ?? [],
    isLoading,
    refetch,
  };
}

// Enviar mensaje
export function useEnviarMensajeGrupo(proyectoId, chatId) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (mensaje) =>
      enviarMensajeGrupoApi(proyectoId, chatId, mensaje),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mensajesGrupo", proyectoId, chatId],
      });
      queryClient.invalidateQueries({
        queryKey: ["chatsGrupo", proyectoId],
      });
    },
  });

  return {
    enviar: mutation.mutate,
    isEnviando: mutation.isPending,
  };
}