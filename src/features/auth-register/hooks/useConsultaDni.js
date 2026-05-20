import { useState, useCallback } from "react";
import { consultarDni } from "../services/peruServices";
import { checkDniApi } from "../authRegister.api";

export function useConsultaDni() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarDni = useCallback(async (dni) => {
    if (!dni || dni.length !== 8) {
      setError("El DNI debe tener 8 dígitos");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Validar duplicidad en NUESTRO backend
      const { data: exists } = await checkDniApi(dni);
      if (exists) {
        throw new Error("El DNI ya se encuentra registrado en nuestra plataforma.");
      }

      // 2. Si no existe, consultar RENIEC
      const data = await consultarDni(dni);
      if (!data || (data.code && data.code !== "200")) {
        throw new Error(data?.mensaje || "Error al consultar el DNI");
      }

      return {
        dni: data.dni || dni,
        nombres: data.nombres || "",
        apellidoPaterno: data.apellido_paterno || "",
        apellidoMaterno: data.apellido_materno || "",
      };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error al consultar el DNI";
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { buscarDni, isLoading, error, clearError: () => setError(null) };
}