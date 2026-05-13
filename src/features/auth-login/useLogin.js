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
      // data -> AuthResponse del back: { token, tipo, usuarioId, nombre, email, rol }
      // IMPORTANTE: el campo es "rol", no "role". El backend manda "MYPE" o "ESTUDIANTE" (sin prefijo ROLE_)

      // 1. Guardar el token en localStorage
      tokenStorage.setTokens(data.token, null);

      // 2. Guardar el usuario en el store global
      setUser({
        id: data.usuarioId,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol, // "MYPE" | "ESTUDIANTE" (así lo manda el backend)
        token: data.token,
      });

      // 3. Redirigir según el rol (sin prefijo ROLE_, igual que en ProtectedRoute)
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
