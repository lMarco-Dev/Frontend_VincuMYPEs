import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, ArrowLeft } from "lucide-react";

const C = {
  primary: "#1B6FE8",
  bg: "#f8fafc",
  border: "#e8e8e4",
  textPrimary: "#0f1f3d",
  textSecondary: "#6b7280",
};

export function PantallaBuscandoReemplazos({ proyecto }) {
  const navigate = useNavigate();
  const [tiempoRestante, setTiempoRestante] = useState("Calculando...");

  useEffect(() => {
    if (!proyecto?.fechaFinBusquedaReemplazos) return;

    const fechaFin = new Date(proyecto.fechaFinBusquedaReemplazos);

    const actualizar = () => {
      const ahora = new Date();
      const diff = fechaFin - ahora;
      if (diff <= 0) {
        setTiempoRestante("Expirado");
      } else {
        const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTiempoRestante(
          `${dias}d ${horas}h ${minutos.toString().padStart(2, "0")}m`
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
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: "0 8px 24px rgba(139,92,246,0.25)",
          }}
        >
          <Users size={32} color="#fff" />
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
          Esperando nuevos integrantes
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
          Se abrieron vacantes en <strong>{proyecto?.titulo}</strong> porque algunos
          integrantes fueron retirados por inactividad.
        </p>
        <p
          style={{
            fontSize: 13,
            color: "#9ca3af",
            margin: "0 0 20px",
          }}
        >
          Nuevos estudiantes pueden postular durante el período de búsqueda.
        </p>

        {/* Cronómetro */}
        <div
          style={{
            background: "#f5f3ff",
            border: "1px solid #ddd6fe",
            borderRadius: 16,
            padding: "20px",
            marginBottom: 20,
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#6d28d9",
              margin: "0 0 8px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            ⏳ Tiempo restante de búsqueda
          </p>
          <span
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#7c3aed",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "0.05em",
            }}
          >
            {tiempoRestante}
          </span>
          <p
            style={{
              fontSize: 11,
              color: "#7c3aed",
              margin: "8px 0 0",
            }}
          >
            Si no se encuentran reemplazos, el proyecto continuará con los integrantes actuales.
          </p>
        </div>

        {/* Badge de cupos */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "12px 16px",
            background: "#f5f3ff",
            borderRadius: 12,
            border: "1px solid #ddd6fe",
            marginBottom: 20,
          }}
        >
          <Users size={16} color="#7c3aed" />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#6d28d9" }}>
            {proyecto?.cuposOcupados || "?"} de {proyecto?.cupos || "?"} cupos ocupados
          </span>
        </div>

        {/* Botón volver */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/mis-postulaciones")}
          style={{
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