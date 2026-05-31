import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { crearProyectoApi } from "./proyectoCreate.api";
import { publicarProyectoApi } from "@/features/proyecto-publicar/proyectoPublicar.api";
import { handleApiError } from "@/shared/api/apiErrors";
import api from "@shared/api/httpClient";

export function useCrearProyecto() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const crearYPublicar = async (payload, insumos) => {
    // 1. Crear proyecto en BORRADOR
    const { data: proyecto } = await crearProyectoApi(payload);
    const proyectoId = proyecto.id;

    // 2. Subir insumos si los hay
    if (insumos && insumos.length > 0) {
      const formData = new FormData();
      insumos.forEach(({ insumoTipoId, file }) => {
        formData.append("archivos", file);
        formData.append("insumoTipoIds", insumoTipoId);
      });
      try {
        await api.post(`/proyectos/${proyectoId}/insumos`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (error) {
        throw new Error(
          error.response?.data?.message || "Error al subir los insumos. Intenta de nuevo."
        );
      }
    }

    // 3. Publicar el proyecto
    await publicarProyectoApi(proyectoId);
  };

  const mutation = useMutation({
    mutationFn: ({ payload, insumos }) => crearYPublicar(payload, insumos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mis-proyectos"] });
      navigate("/dashboard/mype");
    },
    onError: (error) => {
      console.error("Error en crear/publicar proyecto:", error?.response?.data?.message || error.message);
    },
  });

  return {
    crearProyecto: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error ? handleApiError(mutation.error) : null,
    rawError: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}