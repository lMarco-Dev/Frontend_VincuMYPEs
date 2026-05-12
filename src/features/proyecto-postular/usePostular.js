import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enviarPostulacionAlBackend } from "./postular.api";
import { handleApiError } from "@shared/api/apiErrors";

/**
 * Hook para manejar la lógica de postulación a un proyecto.
 */
export function usePostular() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ proyectoId, datos }) => enviarPostulacionAlBackend(proyectoId, datos),
    
    onSuccess: () => {
      // Invalidamos las consultas de proyectos para refrescar el estado de "yaPostulado"
      queryClient.invalidateQueries({ queryKey: ["proyectos"] });
      queryClient.invalidateQueries({ queryKey: ["proyecto"] });
      alert("¡Postulación enviada con éxito!");
    },

    onError: (error) => {
      const mensajeError = handleApiError(error);
      alert(mensajeError);
    },
  });

  return {
    postular: mutation.mutate, // Nombre de función solicitado: postular
    estaCargando: mutation.isPending,
    error: mutation.error,
  };
}
