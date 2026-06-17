import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { registerEstudianteApi, registerMypeApi } from "./authRegister.api";
import { useAuthStore } from "../../store/authStore";
import { tokenStorage } from "@shared/api/tokenStorage";
import { handleApiError } from "@shared/api/apiErrors";

export function useRegister(tipo) {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [successData, setSuccessData] = useState(null);

  const apiFn = tipo === "estudiante" ? registerEstudianteApi : registerMypeApi;

  const mutation = useMutation({
    mutationFn: apiFn,

    onSuccess: ({ data }) => {
      if (tipo === "mype" && !data.token) {
        setSuccessData(data);
        return;
      }

      tokenStorage.setTokens(data.token, null);
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
    successData,
  };
}
