import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { crearProyectoApi } from "./proyectoCreate.api";
import { handleApiError } from "@/shared/api/apiErrors";

export function useCrearProyecto() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: crearProyectoApi,

    onSuccess: () => {
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
