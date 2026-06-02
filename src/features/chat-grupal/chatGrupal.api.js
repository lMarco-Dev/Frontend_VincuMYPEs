import { httpClient } from "@/shared/api/httpClient";

// Obtener chats del proyecto
export const getChatsGrupoApi = (proyectoId) => {
  return httpClient.get(`/proyectos/${proyectoId}/chat`);
};

// Obtener mensajes de un chat
export const getMensajesGrupoApi = (proyectoId, chatId) => {
  return httpClient.get(`/proyectos/${proyectoId}/chat/${chatId}/mensajes`);
};


// Enviar mensaje a chat grupal
export const enviarMensajeGrupoApi = (proyectoId, chatId, mensaje) => {
  return httpClient.post(`/proyectos/${proyectoId}/chat/${chatId}/mensajes`, {
    mensaje,
  });
  
};
