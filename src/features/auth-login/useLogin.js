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

      if (data.rol === "MYPE") {
        navigate("/dashboard/mype");
      } else if (data.rol === "ESTUDIANTE") {
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
