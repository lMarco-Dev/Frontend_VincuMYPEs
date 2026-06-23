import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/shared/api/httpClient";
import { useState } from "react";

export function useWorkspaceActions(proyectoId) {
  // ✅ TODOS los Hooks deben llamarse AL INICIO, sin condiciones
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);

  // ✅ Subir entregable
  const subirEntregableMutation = useMutation({
  mutationFn: async ({ formData }) => {
    const { data } = await httpClient.post(
      `/proyectos/${proyectoId}/entregables`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent?.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          }
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
  onError: (error) => {
    setUploadProgress(0);
    // Extraer mensaje del backend o usar uno genérico
    let mensaje = "Error al subir el archivo. Verifica que no supere los 5 MB y que el formato sea válido (PDF, Word, TXT, PPT).";
    if (error.response?.data?.message) {
      mensaje = error.response.data.message;
    } else if (error.message) {
      mensaje = error.message;
    }
    // Lanzar el error para que el componente lo capture
    throw new Error(mensaje);
  },
});

  // ✅ Eliminar entregable
  const eliminarEntregableMutation = useMutation({
    mutationFn: async (entregableId) => {
      const { data } = await httpClient.delete(
        `/proyectos/${proyectoId}/entregables/${entregableId}`
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
    },
    onError: (error) => {
      console.error("Error al eliminar entregable:", error);
      const message = error.response?.data?.message || error.message || "Error al eliminar el entregable";
      alert(message);
    },
  });

  // ✅ Crear conversación y enviar primer mensaje
  const crearYEnviarMensajeMutation = useMutation({
    mutationFn: async ({ mensaje }) => {
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

  // ✅ Enviar mensaje (o crear conversación si no existe)
  const enviarMensajeMutation = useMutation({
    mutationFn: async ({ conversacionId, mensaje }) => {
      if (!conversacionId) {
        const { data } = await httpClient.post("/mensajes/conversaciones", {
          proyectoId: Number(proyectoId),
          mensaje: mensaje,
        });
        return { data, esNueva: true };
      } else {
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

  // ✅ Descargar archivo (función normal, NO es Hook)
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

  // ✅ FINAL - Devolver todo
  return {
    // Subir entregable
    subirEntregable: subirEntregableMutation.mutateAsync,
    isSubiendo: subirEntregableMutation.isPending,
    uploadProgress,
    errorSubida: subirEntregableMutation.error,

    // Eliminar entregable
    eliminarEntregable: eliminarEntregableMutation.mutateAsync,
    isEliminando: eliminarEntregableMutation.isPending,

    // Chat
    enviarMensaje: enviarMensajeMutation.mutateAsync,
    isEnviandoMensaje: enviarMensajeMutation.isPending,
    crearYEnviarMensaje: crearYEnviarMensajeMutation.mutateAsync,
    isCreandoConversacion: crearYEnviarMensajeMutation.isPending,

    // Descargar
    descargarArchivo,
    
    // Reset
    resetUpload: () => setUploadProgress(0),
  };
}