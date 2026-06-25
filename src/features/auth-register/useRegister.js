import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { registerEstudianteApi, registerMypeApi } from "./authRegister.api";
import { authRecoveryApi } from "@features/auth-recovery/authRecovery.api";
import { useAuthStore } from "../../store/authStore";
import { tokenStorage } from "@shared/api/tokenStorage";
import { handleApiError } from "@shared/api/apiErrors";

export function useRegister(tipo) {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const apiFn = tipo === "estudiante" ? registerEstudianteApi : registerMypeApi;

  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [successData, setSuccessData] = useState(null);

  const sendOtp = async (email) => {
    setOtpError("");
    try {
      await authRecoveryApi.sendVerificationOtp(email);
      setOtpSent(true);
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || "Error al enviar el código";
      setOtpError(msg);
      return false;
    }
  };

  const mutation = useMutation({
    mutationFn: (data) => {
      return apiFn(data);
    },
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

  // ✅ Reseteo del estado OTP
  const resetOtpState = () => {
    setOtpSent(false);
    setOtpError("");
  };

  return {
    register: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error ? handleApiError(mutation.error) : null,
    successData,
    sendOtp,
    resetOtpState,
    otpSent,
    otpError,
  };
}