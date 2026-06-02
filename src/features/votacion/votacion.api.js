import { httpClient } from "@/shared/api/httpClient";

// Obtener estado de votación
export const getVotacionApi = (proyectoId) => {
  return httpClient.get(`/proyectos/${proyectoId}/votacion`);
};

// Votar por un candidato
export const votarApi = (proyectoId, candidatoId) => {
  return httpClient.post(`/proyectos/${proyectoId}/votacion/votar`, {
    candidatoId,
  });
};

// Verificar si el usuario actual es delegado
export const esDelegadoApi = (proyectoId) => {
  return httpClient.get(`/proyectos/${proyectoId}/votacion/es-delegado`);
};