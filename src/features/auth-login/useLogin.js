import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginApi } from "./authLogin.api";
import { useAuthStore } from "../../store/authStore";

export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const mutation = useMutation({
    mutationFn: loginApi,

    onSuccess: ({ data }) => {
      // login(data) llama a tokenStorage.setTokens internamente (access + refresh)
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
      const data = error?.response?.data;
      const esMantenimiento =
        status === 503 &&
        (data?.error === "MAINTENANCE_MODE" ||
          /mantenimiento/i.test(data?.message || ""));

      if (esMantenimiento) {
        // No tocamos el mensaje aquí; LoginPage mostrará un modal específico.
        return;
      }

      if (status === 401 || status === 403) {
        error.message = "Credenciales incorrectas. Verifica tu email y contraseña.";
      } else if (status === 429) {
        error.message = "Demasiados intentos. Espera un momento.";
      } else if (!error.response) {
        error.message = "Error de conexión. Verifica tu internet.";
      } else {
        // Cualquier otro error que llegue: no mostramos el "status code XXX" crudo
        error.message = data?.message || "Ocurrió un error inesperado. Inténtalo de nuevo.";
      }
    },
  });

  const status = mutation.error?.response?.status;
  const data = mutation.error?.response?.data;
  const isMaintenance =
    status === 503 &&
    (data?.error === "MAINTENANCE_MODE" ||
      /mantenimiento/i.test(data?.message || ""));

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    // Cuando es mantenimiento NO devolvemos error (lo maneja el modal)
    error: !isMaintenance && mutation.error ? mutation.error.message : null,
    isMaintenance,
  };
}