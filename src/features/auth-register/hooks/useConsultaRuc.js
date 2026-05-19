// src/features/auth-register/hooks/useConsultaRuc.js
import { useState, useCallback } from "react";
import { consultarRuc } from "../services/peruServices";

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
      const data = await consultarRuc(ruc);
      console.log("Datos recibidos RUC:", data);
      
      if (!data) {
        throw new Error("No se recibieron datos");
      }

      // Validar que la respuesta sea exitosa
      if (data.code && data.code !== "200") {
        throw new Error(data.mensaje || "Error al consultar el RUC");
      }

      const resultado = {
        ruc: data.ruc || ruc,
        razonSocial: data.razon_social || "",
        nombreComercial: data.razon_social || "", // Usamos la razón social como nombre comercial
        direccion: data.direccion || "",
        departamento: data.departamento || "",
        provincia: data.provincia || "",
        distrito: data.distrito || "",
        estado: data.estado || "",
        condicion: data.condicion || "",
      };
      
      console.log("Resultado RUC procesado:", resultado);
      return resultado;
      
    } catch (err) {
      console.error("Error en buscarRuc:", err);
      const errorMessage = err.response?.data?.mensaje || err.message || "Error al consultar el RUC";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    buscarRuc,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}