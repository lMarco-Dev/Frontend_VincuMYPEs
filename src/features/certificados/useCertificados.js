import { httpClient } from "@shared/api/httpClient";
import { useQuery } from "@tanstack/react-query";

export function useCertificados() {
  return useQuery({
    queryKey: ["certificados"],
    queryFn: async () => {
      const response = await httpClient.get("/certificados/mis-certificados");
      const raw = response.data?.data || response.data || [];
      return raw.map(cert => ({
        id: cert.id,
        codigo: cert.codigo,
        proyectoId: cert.proyectoId,
        proyectoTitulo: cert.nombreProyecto,
        estudianteId: cert.estudianteId,
        estudianteNombre: cert.estudianteNombre,
        gerente: cert.gerenteNombre || cert.gerente || "",
        cargo: cert.cargoRepresentante || cert.cargo || "",
        mypeNombre: cert.nombreMype,
        rucMype: cert.rucMype,
        firmaUrl: cert.firmaUrl,
        certificadoId: cert.id,
        fechaEmision: cert.fechaEmision,
        fechaEnvio: cert.fechaEnvio,
        urlCertificado: cert.urlCertificado,
        mypeUsuarioId: cert.mypeUsuarioId,
        pdfBase64: cert.pdfBase64 || null,
      }));
    }
  });
}
