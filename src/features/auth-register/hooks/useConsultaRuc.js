import { useState, useCallback } from "react";
import { consultarRuc } from "../services/peruServices";
import { checkRucApi } from "../authRegister.api";

export function useConsultaRuc() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarRuc = useCallback(async (ruc) => {
    if (!ruc || ruc.length !== 11) {
      setError("El RUC debe tener 11 dígitos");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Validar duplicidad en NUESTRO backend
      const { data: exists } = await checkRucApi(ruc);
      if (exists) {
        throw new Error("El RUC ya se encuentra registrado en nuestra plataforma.");
      }

      // 2. Si no existe, consultar SUNAT
      const data = await consultarRuc(ruc);
      if (!data || (data.code && data.code !== "200")) {
        throw new Error(data?.mensaje || "Error al consultar el RUC");
      }

      return {
        ruc: data.ruc || ruc,
        razonSocial: data.razon_social || "",
        nombreComercial: data.razon_social || "",
        direccion: data.direccion || "",
      };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error al consultar el RUC";
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { buscarRuc, isLoading, error, clearError: () => setError(null) };
}