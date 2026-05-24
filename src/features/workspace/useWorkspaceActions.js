import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/shared/api/httpClient";
import { useState } from "react";

export function useWorkspaceActions(proyectoId) {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);

  // Subir entregable
  const subirEntregableMutation = useMutation({
    mutationFn: async ({ formData }) => {
      const { data } = await httpClient.post(
        `/proyectos/${proyectoId}/entregables`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-entregables", proyectoId],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace-proyecto", proyectoId],
      });
      setUploadProgress(0);
    },
    onError: () => {
      setUploadProgress(0);
    },
  });

  // ✅ NUEVO: Crear conversación y enviar primer mensaje
  const crearYEnviarMensajeMutation = useMutation({
    mutationFn: async ({ mensaje }) => {
      // Crear conversación con el primer mensaje
      const { data } = await httpClient.post("/mensajes/conversaciones", {
        proyectoId: Number(proyectoId),
        mensaje: mensaje,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-mensajes", proyectoId],
      });
    },
  });

  // ✅ MODIFICADO: Enviar mensaje (o crear conversación si no existe)
  const enviarMensajeMutation = useMutation({
    mutationFn: async ({ conversacionId, mensaje }) => {
      if (!conversacionId) {
        // Si no hay conversación, crear una nueva con el mensaje
        const { data } = await httpClient.post("/mensajes/conversaciones", {
          proyectoId: Number(proyectoId),
          mensaje: mensaje,
        });
        return { data, esNueva: true };
      } else {
        // Si ya existe, enviar mensaje normalmente
        const { data } = await httpClient.post(
          `/mensajes/conversaciones/${conversacionId}`,
          { mensaje }
        );
        return { data, esNueva: false };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-mensajes", proyectoId],
      });
    },
  });

  // Descargar archivo
  const descargarArchivo = async (url, nombreArchivo) => {
    try {
      const response = await httpClient.get(url, {
        responseType: "blob",
      });
      
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = nombreArchivo || "entregable";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error al descargar:", error);
      throw error;
    }
  };

  return {
    subirEntregable: subirEntregableMutation.mutateAsync,
    isSubiendo: subirEntregableMutation.isPending,
    uploadProgress,
    errorSubida: subirEntregableMutation.error,

    // ✅ Chat
    enviarMensaje: enviarMensajeMutation.mutateAsync,
    isEnviandoMensaje: enviarMensajeMutation.isPending,

    descargarArchivo,
    resetUpload: () => setUploadProgress(0),
  };
}