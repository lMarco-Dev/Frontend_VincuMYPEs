import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { crearProyectoApi } from "./proyectoCreate.api";
import { publicarProyectoApi } from "@/features/proyecto-publicar/proyectoPublicar.api";
import { handleApiError } from "@/shared/api/apiErrors";

export function useCrearProyecto() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData) => {
      // 1. Crear el proyecto → queda en estado BORRADOR
      const { data: proyecto } = await crearProyectoApi(formData);

      // 2. Publicarlo → pasa a estado PENDIENTE (visible para estudiantes)
      await publicarProyectoApi(proyecto.id);

      return proyecto;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mis-proyectos"] });
      navigate("/dashboard/mype");
    },

    onError: (error) => {
      console.error(handleApiError(error));
    },
  });

  return {
    crearProyecto: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error ? handleApiError(mutation.error) : null,
    isSuccess: mutation.isSuccess,
  };
}
