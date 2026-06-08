import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Shield, ArrowLeft } from "lucide-react";

const C = {
  primary: "#1B6FE8",
  bg: "#f8fafc",
  border: "#e8e8e4",
  textPrimary: "#0f1f3d",
  textSecondary: "#6b7280",
  textMuted: "#94a3b8",
};

export function PantallaEsperandoValidacion({ proyecto }) {
  const navigate = useNavigate();
  const [tiempoRestante, setTiempoRestante] = useState("Calculando...");

  useEffect(() => {
    if (!proyecto?.fechaInicioValidacion) return;

    const fechaInicio = new Date(proyecto.fechaInicioValidacion);
    const plazoHoras = proyecto.plazoValidacionHoras || 48;
    const fechaLimite = new Date(fechaInicio.getTime() + plazoHoras * 60 * 60 * 1000);

    const actualizar = () => {
      const ahora = new Date();
      const diff = fechaLimite - ahora;
      if (diff <= 0) {
        setTiempoRestante("Expirado");
      } else {
        const horas = Math.floor(diff / (1000 * 60 * 60));
        const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diff % (1000 * 60)) / 1000);
        setTiempoRestante(
          `${horas}h ${minutos.toString().padStart(2, "0")}m ${segundos.toString().padStart(2, "0")}s`
        );
      }
    };

    actualizar();
    const intervalo = setInterval(actualizar, 1000);
    return () => clearInterval(intervalo);
  }, [proyecto]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "#fff",
          borderRadius: 24,
          border: `0.5px solid ${C.border}`,
          padding: "40px 36px",
          maxWidth: 520,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        {/* Icono animado */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: "0 8px 24px rgba(245,158,11,0.25)",
          }}
        >
          <Clock size={32} color="#fff" />
        </motion.div>

        {/* Título */}
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#0f1f3d",
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
          }}
        >
          Esperando validación del administrador
        </h2>

        {/* Descripción */}
        <p
          style={{
            fontSize: 14,
            color: "#6b7280",
            margin: "0 0 6px",
            lineHeight: 1.6,
          }}
        >
          El proyecto <strong>{proyecto?.titulo}</strong> se encuentra en revisión
          administrativa porque algunos integrantes no participaron en la votación.
        </p>

        {proyecto?.motivoEstado && (
          <p
            style={{
              fontSize: 12,
              color: "#9ca3af",
              margin: "0 0 20px",
              fontStyle: "italic",
            }}
          >
            {proyecto.motivoEstado}
          </p>
        )}

        {/* Cronómetro */}
        <div
          style={{
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: 16,
            padding: "20px",
            marginBottom: 20,
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#92400e",
              margin: "0 0 8px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            ⏳ Tiempo restante para decisión
          </p>
          <span
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#d97706",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "0.05em",
            }}
          >
            {tiempoRestante}
          </span>
          <p
            style={{
              fontSize: 11,
              color: "#a16207",
              margin: "8px 0 0",
            }}
          >
            Si el administrador no responde, el proyecto se habilitará automáticamente.
          </p>
        </div>

        {/* Badge informativo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "12px 16px",
            background: "#eff6ff",
            borderRadius: 12,
            border: "1px solid #bfdbfe",
          }}
        >
          <Shield size={16} color="#1d4ed8" />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#1d4ed8" }}>
            El administrador está revisando tu caso
          </span>
        </div>

        {/* Botón volver */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/mis-postulaciones")}
          style={{
            marginTop: 24,
            padding: "12px 24px",
            borderRadius: 12,
            border: `0.5px solid ${C.border}`,
            background: "#fff",
            color: C.textSecondary,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <ArrowLeft size={16} /> Volver a mis proyectos
        </motion.button>
      </motion.div>
    </div>
  );
}