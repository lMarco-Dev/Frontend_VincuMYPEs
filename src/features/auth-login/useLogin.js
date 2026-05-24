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
      tokenStorage.setTokens(data.token, null);

      login(data);

      if (data.rol === "MYPE" || data.rol === "ROLE_MYPE") {
        navigate("/dashboard/mype");
      } else if (data.rol === "ESTUDIANTE" || data.rol === "ROLE_ESTUDIANTE") {
        navigate("/dashboard/estudiante");
      } else if (data.rol === "ADMIN" || data.rol === "ROLE_ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    },

    onError: (error) => {
  const status = error?.response?.status;
  if (status === 401 || status === 403) {
    error.message = "Credenciales incorrectas. Verifica tu email y contraseña.";
  } else if (status === 429) {
    error.message = "Demasiados intentos. Espera un momento.";
  } else if (!error.response) {
    error.message = "Error de conexión. Verifica tu internet.";
  }
},
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error ? mutation.error.message : null,
};
}