import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginApi } from "./authLogin.api";
import { useAuthStore } from "../../store/authStore";
import { tokenStorage } from "@shared/api/tokenStorage";
import { handleApiError } from "@shared/api/apiErrors";

export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const mutation = useMutation({
    mutationFn: loginApi,

    onSuccess: ({ data }) => {
      // data -> Es el AuthResponse del back

      // 1. Guardar el token para httpClient (nuevo sistema de peticiones)
      tokenStorage.setTokens(data.token, null);

      // 2. Guarda el usuario en el store antiguo
      login(data);

      // 3. Redirigir según el rol
      if (data.rol === "MYPE" || data.rol === "ROLE_MYPE") {
        navigate("/dashboard/mype");
      } else if (data.rol === "ESTUDIANTE" || data.rol === "ROLE_ESTUDIANTE") {
        navigate("/dashboard/estudiante");
      } else {
        navigate("/");
      }
    },

    onError: (error) => {
      console.error(handleApiError(error));
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error ? handleApiError(mutation.error) : null,
  };
}
