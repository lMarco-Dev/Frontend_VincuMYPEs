import httpClient from "@/shared/api/httpClient";

// MYPE emite un certificado
export const emitirCertificadoApi = (data) => {
  return httpClient.post("/certificados", data);
};

// MYPE ve los certificados que ha emitido
export const getCertificadosEmitidosApi = () => {
  return httpClient.get("/certificados/emitidos");
};
