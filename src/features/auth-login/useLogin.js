import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginApi } from "./authLogin.api";
import { useUserStore } from "@entities/user/userStore";
import { tokenStorage } from "@shared/api/tokenStorage";
import { handleApiError } from "@shared/api/apiErrors";

export function useLogin() {
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const mutation = useMutation({
    mutationFn: loginApi,

    onSuccess: ({ data }) => {
      // data -> Es el AuthResponse del back

      //1. Guardar el token en localStorage
      tokenStorage.setTokens(data.token, null);

      //2. Guarda el usuario en el store global
      setUser({
        id: data.usuarioId,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol,
        token: data.token,
      });

      //3. Redirigir según el rol
      if (data.rol === "ROLE_MYPE") {
        navigate("/dashboard/mype");
      } else if (data.rol === "ROLE_ESTUDIANTE") {
        navigate("/dashboard/estudiante");
      } else {
        navigate("/dashboard/admin");
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
