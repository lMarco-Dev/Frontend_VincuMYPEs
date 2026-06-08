import { useState, useCallback, useEffect, useRef } from "react";
import { httpClient } from "@/shared/api/httpClient";

export function useEspacioEntregables(proyectoId) {
  const [estadoEspacio, setEstadoEspacio] = useState({
    ocupado: false,
    ocupadoPor: null,
    esMiSesion: false,
    minutosRestantes: 0,
    puedeSolicitar: false,
    solicitudPendiente: false,
    solicitante: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const pollingRef = useRef(null);

  // Consultar estado del espacio
  const consultarEstado = useCallback(async () => {
    try {
      const { data } = await httpClient.get(
        `/proyectos/${proyectoId}/espacio-entregables/estado`
      );
      setEstadoEspacio(data);
      setError(null);
      return data;
    } catch (err) {
      console.warn("Error al consultar estado del espacio:", err);
      return null;
    }
  }, [proyectoId]);

  // Iniciar polling cada 5 segundos
  useEffect(() => {
    consultarEstado();
    pollingRef.current = setInterval(consultarEstado, 5000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [consultarEstado]);

  // Ingresar al espacio
  const ingresar = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await httpClient.post(
        `/proyectos/${proyectoId}/espacio-entregables/ingresar`
      );
      setEstadoEspacio(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || "Error al ingresar";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [proyectoId]);

  // Solicitar permiso
  const solicitarAcceso = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await httpClient.post(
        `/proyectos/${proyectoId}/espacio-entregables/solicitar-acceso`
      );
      return data;
    } catch (err) {
      const message = err.response?.data?.message || "Error al solicitar acceso";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [proyectoId]);

  // Transferir acceso
  const transferirAcceso = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await httpClient.post(
        `/proyectos/${proyectoId}/espacio-entregables/transferir-acceso`
      );
      await consultarEstado();
      return data;
    } catch (err) {
      const message = err.response?.data?.message || "Error al transferir";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [proyectoId, consultarEstado]);

  // Rechazar solicitud
  const rechazarSolicitud = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await httpClient.post(
        `/proyectos/${proyectoId}/espacio-entregables/rechazar-solicitud`
      );
      await consultarEstado();
      return data;
    } catch (err) {
      const message = err.response?.data?.message || "Error al rechazar";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [proyectoId, consultarEstado]);

  // Salir del espacio
  const salir = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await httpClient.post(
        `/proyectos/${proyectoId}/espacio-entregables/salir`
      );
      setEstadoEspacio({
        ocupado: false,
        ocupadoPor: null,
        esMiSesion: false,
        minutosRestantes: 0,
        puedeSolicitar: false,
        solicitudPendiente: false,
        solicitante: null,
      });
      return data;
    } catch (err) {
      const message = err.response?.data?.message || "Error al salir";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [proyectoId]);

  return {
    estadoEspacio,
    isLoading,
    error,
    ingresar,
    solicitarAcceso,
    transferirAcceso,
    rechazarSolicitud,
    salir,
    consultarEstado,
  };
}