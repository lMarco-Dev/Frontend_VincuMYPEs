import { httpClient } from "@shared/api/httpClient";

/**
 * Envía una solicitud de postulación para un proyecto específico.
 * @param {string|number} proyectoId - ID del proyecto al que se postula.
 * @param {Object} datosPostulacion - Objeto con mensaje y archivo opcionales.
 */
export const enviarPostulacionAlBackend = async (proyectoId, datosPostulacion) => {
  const response = await httpClient.post(`/proyectos/${proyectoId}/postular`, datosPostulacion);
  return response.data;
};
