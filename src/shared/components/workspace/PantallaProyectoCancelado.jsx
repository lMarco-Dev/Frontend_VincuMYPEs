import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const C = {
  primary: "#1B6FE8",
  bg: "#f8fafc",
  border: "#e8e8e4",
  textPrimary: "#0f1f3d",
  textSecondary: "#6b7280",
};

export function PantallaProyectoCancelado({ proyecto }) {
  const navigate = useNavigate();

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
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#fef2f2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <X size={32} color="#dc2626" />
        </div>

        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#0f1f3d",
            margin: "0 0 8px",
          }}
        >
          Proyecto cancelado
        </h2>
        <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 20px", lineHeight: 1.6 }}>
          El proyecto <strong>{proyecto?.titulo}</strong> ha sido cancelado.
        </p>

        {proyecto?.motivoEstado && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 12,
              padding: "16px",
              marginBottom: 24,
            }}
          >
            <p style={{ fontSize: 13, color: "#991b1b", margin: 0 }}>
              {proyecto.motivoEstado}
            </p>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/proyectos")}
          style={{
            padding: "12px 28px",
            borderRadius: 12,
            border: "none",
            background: C.primary,
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          Ver proyectos disponibles
        </motion.button>
      </motion.div>
    </div>
  );
}