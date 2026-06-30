import { useState } from "react";
import { Star, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCalificarUsuario } from "./useCalificarUsuario";

export default function RateUserModal({ open, onClose, pendiente, onSuccess, closeOnSuccess = true }) {
  const [puntuacion, setPuntuacion] = useState(0);
  const [hover, setHover] = useState(0);
  const { calificar, isLoading, error } = useCalificarUsuario();

  if (!open || !pendiente) return null;

  // ✅ En RateUserModal, el onSuccess debe pasar la puntuación
  const handleSubmit = () => {
    if (puntuacion < 1) return;
    calificar(
      { proyectoId: pendiente.proyectoId, calificadoId: pendiente.calificadoId, puntuacion },
      {
        onSuccess: () => {
          setPuntuacion(0);
          if (onSuccess) onSuccess(puntuacion);
          if (closeOnSuccess && onClose) onClose();
        },
      }
    );
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        background: "rgba(13,27,53,0.6)", backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 20, padding: 28,
          maxWidth: 420, width: "100%", textAlign: "center",
          fontFamily: "'Outfit', sans-serif", position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            background: "transparent", border: "none", cursor: "pointer",
          }}
        >
          <X size={18} />
        </button>

        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
          Calificar a {pendiente.calificadoNombre}
        </h3>
        <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 20 }}>
          Proyecto: <strong>{pendiente.proyectoTitulo}</strong>
        </p>

        <div style={{
          display: "flex", justifyContent: "center", gap: 8, marginBottom: 24,
        }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setPuntuacion(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              style={{
                background: "transparent", border: "none", cursor: "pointer", padding: 4,
              }}
            >
              <Star
                size={32}
                fill={(hover || puntuacion) >= n ? "#facc15" : "transparent"}
                color={(hover || puntuacion) >= n ? "#facc15" : "#d1d5db"}
              />
            </button>
          ))}
        </div>

        {error && (
          <p style={{ color: "#dc2626", fontSize: 12, marginBottom: 12 }}>
            {error}
          </p>
        )}

        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
          <button
            onClick={onClose}
            disabled={isLoading}
            style={{
              padding: "10px 20px", borderRadius: 10, border: "1px solid #e2e8f0",
              background: "#fff", color: "#64748b", fontWeight: 600, cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={isLoading || puntuacion < 1}
            style={{
              padding: "10px 24px", borderRadius: 10, border: "none",
              background: puntuacion >= 1 ? "linear-gradient(135deg, #1B6FE8, #0E54C4)" : "#cbd5e1",
              color: "#fff", fontWeight: 700,
              cursor: puntuacion >= 1 && !isLoading ? "pointer" : "not-allowed",
              display: "inline-flex", alignItems: "center", gap: 6,
            }}
          >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : null}
            Enviar calificación
            </button>
        </div>
      </motion.div>
    </div>
  );
}