import { useState } from "react"; // ← FALTABA ESTA IMPORTACIÓN
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  emitirCertificadoApi,
  getCertificadosEmitidosApi,
  eliminarCertificadoApi,
  enviarCertificadoApi,
} from "./certificados.api";
import { handleApiError } from "@/shared/api/apiErrors";
import { useAuthStore } from "@/store/authStore";

// En useCertificadosMype.js, asegúrate de que el refetch funcione:
export function useCertificadosEmitidos() {
  const { user } = useAuthStore();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["certificados-emitidos", user?.id],
    queryFn: async () => {
      const response = await getCertificadosEmitidosApi();
      console.log("📥 Respuesta cruda:", response);
      
      // Mapear los nombres de campos del backend al frontend
      const certificados = (response.data?.data || response.data || []).map(cert => ({
        id: cert.id,
        codigo: cert.codigo,
        proyectoTitulo: cert.nombreProyecto, // Mapeo importante
        proyectoId: cert.proyectoId,
        estudianteNombre: cert.estudianteNombre,
        estudianteId: cert.estudianteId,
        gerente: cert.gerenteNombre || cert.gerente || cert.nombreGerente || "",
        cargo: cert.cargoRepresentante || cert.cargo || cert.cargoGerente || "",
        mypeNombre: cert.nombreMype,
        rucMype: cert.rucMype,
        firmaUrl: cert.firmaUrl,
        fechaEmision: cert.fechaEmision,
        enviadoEmail: cert.fechaEnvio !== null,
        urlCertificado: cert.urlCertificado,
      }));
      
      console.log("📋 Certificados mapeados:", certificados);
      return certificados;
    },
    enabled: !!user?.id,
  });
  
  return { 
    certificados: Array.isArray(data) ? data : [], 
    isLoading, 
    error,
    refetch 
  };
}

export function useEmitirCertificado() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: emitirCertificadoApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificados-emitidos"] });
      queryClient.invalidateQueries({ queryKey: ["mis-proyectos"] });
    },
    onError: (error) => console.error(handleApiError(error)),
  });
  return {
    emitir: mutation.mutateAsync, // Cambiado a mutateAsync para poder usar await
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error ? handleApiError(mutation.error) : null,
  };
}

// ✅ Hook para eliminar certificado
export function useEliminarCertificado() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: eliminarCertificadoApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificados-emitidos"] });
      queryClient.invalidateQueries({ queryKey: ["mis-proyectos"] });
    },
    onError: (error) => {
      console.error("Error eliminando certificado:", error);
      return handleApiError(error);
    },
  });
  return {
    eliminar: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error ? handleApiError(mutation.error) : null,
  };
}

// ✅ CORREGIDO
export function useEnviarCertificado() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState({});
  const [errorMap, setErrorMap] = useState({});

  const enviar = async (certificadoId, pdfBase64 = null, calificacion = null) => {
    setLoading((p) => ({ ...p, [certificadoId]: true }));
    setErrorMap((p) => ({ ...p, [certificadoId]: null }));
    try {
      await enviarCertificadoApi(certificadoId, pdfBase64, calificacion);
      queryClient.invalidateQueries({ queryKey: ["certificados-emitidos"] });
    } catch (e) {
      setErrorMap((p) => ({
        ...p,
        [certificadoId]: "Error al formalizar despacho. Reintente proceso.",
      }));
    } finally {
      setLoading((p) => ({ ...p, [certificadoId]: false }));
    }
  };

  return { enviar, loading, errorMap };
}