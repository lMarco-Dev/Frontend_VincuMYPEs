// src/features/auth-register/hooks/useConsultaDni.js
import { useState, useCallback } from "react";
import { consultarDni } from "../services/peruServices";

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
      const data = await consultarDni(dni);
      console.log("Datos recibidos:", data);
      
      // Validar que la respuesta tenga los datos esperados
      if (!data) {
        throw new Error("No se recibieron datos");
      }

      // CORRECCIÓN: La API devuelve code="200" y mensaje="OK" cuando es exitoso
      // Solo es error si code NO es "200" o si mensaje NO es "OK"
      if (data.code && data.code !== "200") {
        throw new Error(data.mensaje || "Error al consultar el DNI");
      }

      // Si llegamos aquí, la consulta fue exitosa
      const resultado = {
        dni: data.dni || dni,
        nombres: data.nombres || "",
        apellidoPaterno: data.apellido_paterno || "",
        apellidoMaterno: data.apellido_materno || "",
        nombreCompleto: data.cliente || `${data.nombres || ""} ${data.apellido_paterno || ""} ${data.apellido_materno || ""}`.trim(),
      };
      
      console.log("Resultado procesado:", resultado);
      return resultado;
      
    } catch (err) {
      console.error("Error en buscarDni:", err);
      const errorMessage = err.response?.data?.mensaje || err.message || "Error al consultar el DNI";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    buscarDni,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}