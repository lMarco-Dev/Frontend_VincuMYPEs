import React, { useState } from "react";
import { usePostular } from "./usePostular";
import { Send, Loader2, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PostularButton = ({ proyectoId, yaPostulo, disabled }) => {
  const [mensaje, setMensaje] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { postular, estaCargando } = usePostular();

  // Si ya postuló, mostrar botón deshabilitado
  if (yaPostulo) {
    return (
      <button
        disabled
        style={{
          width: "100%",
          padding: "12px 20px",
          borderRadius: 10,
          border: "1px solid #d1d5db",
          background: "#f9fafb",
          color: "#6b7280",
          fontSize: 14,
          fontWeight: 600,
          cursor: "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <CheckCircle size={16} style={{ color: "#059669" }} />
        Ya has postulado a este proyecto
      </button>
    );
  }

  // Si está deshabilitado por límite de proyectos
  if (disabled) {
    return (
      <button
        disabled
        style={{
          width: "100%",
          padding: "12px 20px",
          borderRadius: 10,
          border: "1px solid #d1d5db",
          background: "#f9fafb",
          color: "#9ca3af",
          fontSize: 14,
          fontWeight: 600,
          cursor: "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        Límite de proyectos alcanzado
      </button>
    );
  }

  const manejarEnvioDePostulacion = (e) => {
    e.preventDefault();
    if (mensaje.length > 200) {
      setErrorMessage("El mensaje no puede superar los 200 caracteres");
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }
    if (mensaje.trim().length === 0) {
      setErrorMessage("Por favor, escribe un mensaje de presentación");
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    postular(
      {
        proyectoId: proyectoId,
        datos: {
          mensajePostulacion: mensaje,
          archivoAdjunto: "",
        },
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          setMensaje("");
          setShowForm(false);
          // Recargar la página para actualizar el estado de postulación
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
        onError: (err) => {
          const msg =
            err.response?.data?.message ||
            err.message ||
            "Error al enviar la postulación";
          setErrorMessage(msg);
          setTimeout(() => setErrorMessage(""), 5000);
        },
      },
    );
  };

  // Estado: éxito después de postular
  if (isSuccess) {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          width: "100%",
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          padding: "16px",
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "#22c55e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <CheckCircle size={24} color="#fff" />
        </div>
        <h4
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#166534",
            marginBottom: 4,
          }}
        >
          ¡Postulación Enviada!
        </h4>
        <p style={{ fontSize: 11, color: "#15803d", fontWeight: 500 }}>
          Tu aplicación ha sido registrada exitosamente.
        </p>
      </motion.div>
    );
  }

  // Estado: botón normal (no ha postulado)
  return (
    <div style={{ width: "100%" }}>
      {!showForm ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          style={{
            width: "100%",
            padding: "12px 20px",
            borderRadius: 10,
            border: "none",
            background: "linear-gradient(135deg, #1B6FE8, #2563eb)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: "0 2px 8px rgba(27,111,232,0.25)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow =
              "0 4px 14px rgba(27,111,232,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(27,111,232,0.25)";
          }}
        >
          <Send size={14} />
          Postular ahora
        </motion.button>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          onSubmit={manejarEnvioDePostulacion}
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e0e7ff",
            padding: 16,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <label style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>
              Mensaje de presentación
            </label>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 4,
                borderRadius: 4,
              }}
            >
              <X size={16} color="#94a3b8" />
            </button>
          </div>

          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Cuéntanos por qué te interesa este proyecto y qué habilidades puedes aportar..."
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 8,
              border:
                mensaje.length > 200
                  ? "1px solid #fecaca"
                  : "1px solid #e2e8f0",
              fontSize: 13,
              outline: "none",
              resize: "vertical",
              minHeight: 100,
              fontFamily: "inherit",
            }}
            required
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 8,
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: mensaje.length > 200 ? "#ef4444" : "#94a3b8",
              }}
            >
              {mensaje.length}/200 caracteres
            </span>
            {mensaje.length > 200 && (
              <span style={{ fontSize: 10, color: "#ef4444" }}>
                Máximo 200 caracteres
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                background: "#fff",
                color: "#64748b",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f8fafc";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff";
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={
                estaCargando ||
                mensaje.length > 200 ||
                mensaje.trim().length === 0
              }
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                background: "linear-gradient(135deg, #1B6FE8, #2563eb)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                cursor:
                  estaCargando ||
                  mensaje.length > 200 ||
                  mensaje.trim().length === 0
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  estaCargando ||
                  mensaje.length > 200 ||
                  mensaje.trim().length === 0
                    ? 0.6
                    : 1,
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              {estaCargando ? (
                <>
                  <Loader2
                    size={16}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={14} />
                  Enviar postulación
                </>
              )}
            </button>
          </div>

          {errorMessage && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                fontSize: 11,
                color: "#dc2626",
                fontWeight: 500,
                textAlign: "center",
                background: "#fef2f2",
                padding: "8px 12px",
                borderRadius: 8,
                marginTop: 12,
                border: "1px solid #fecaca",
              }}
            >
              ⚠️ {errorMessage}
            </motion.p>
          )}
        </motion.form>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PostularButton;
