import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { registerEstudianteApi, registerMypeApi } from "./authRegister.api";
import { useUserStore } from "@entities/user/userStore";
import { tokenStorage } from "@shared/api/tokenStorage";
import { handleApiError } from "@shared/api/apiErrors";

export function useRegister(tipo) {
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const apiFn = tipo === "estudiante" ? registerEstudianteApi : registerMypeApi;

  const mutation = useMutation({
    mutationFn: apiFn,

    onSuccess: ({ data }) => {
      tokenStorage.setTokens(data.token, null);

      setUser({
        id: data.usuarioId,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol,
        token: data.token,
      });

      if (data.rol === "ROLE_MYPE") {
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
