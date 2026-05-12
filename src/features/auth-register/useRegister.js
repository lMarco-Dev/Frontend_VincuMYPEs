import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { registerEstudianteApi, registerMypeApi } from "./authRegister.api";
import { useAuthStore } from "../../store/authStore";
import { tokenStorage } from "@shared/api/tokenStorage";
import { handleApiError } from "@shared/api/apiErrors";

export function useRegister(tipo) {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const apiFn = tipo === "estudiante" ? registerEstudianteApi : registerMypeApi;

  const mutation = useMutation({
    mutationFn: apiFn,

    onSuccess: ({ data }) => {
      // 1. Guardar el token para httpClient
      tokenStorage.setTokens(data.token, null);

      // 2. Guardar en el store antiguo
      login(data);

      if (data.rol === "MYPE" || data.rol === "ROLE_MYPE") {
        navigate("/dashboard/mype");
      } else {
        navigate("/dashboard/estudiante");
      }
    },

    onError: (error) => {
      console.error(handleApiError(error));
    },
  });

  return {
    register: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error ? handleApiError(mutation.error) : null,
  };
}
