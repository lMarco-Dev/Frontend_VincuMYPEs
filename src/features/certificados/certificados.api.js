import { httpClient } from "@/shared/api/httpClient";

// MYPE emite un certificado
export const emitirCertificadoApi = (data) => {
  return httpClient.post("/certificados", data);
};

// MYPE ve los certificados que ha emitido
export const getCertificadosEmitidosApi = () => {
  return httpClient.get("/certificados/emitidos");
};

// ✅ Eliminar certificado
export const eliminarCertificadoApi = (certificadoId) => {
  return httpClient.delete(`/certificados/${certificadoId}`);
};

// ✅ Obtener detalle de un certificado específico
export const getCertificadoByIdApi = (certificadoId) => {
  return httpClient.get(`/certificados/${certificadoId}`);
};

// ✅ CORREGIDO
export const enviarCertificadoApi = (certificadoId, pdfBase64 = null, calificacion = null) => {
  return httpClient.post(`/certificados/${certificadoId}/enviar`, { 
    pdfBase64, 
    calificacion 
  });
};