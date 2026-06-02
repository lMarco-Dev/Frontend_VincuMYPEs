import React, { useState, useEffect, useRef } from "react";
import { usePostular } from "./usePostular";
import { usePerfil } from "../perfil/usePerfil";
import { subirCvApi } from "../perfil/cvApi";
import { useQueryClient } from "@tanstack/react-query";
import {
  Send, Loader2, CheckCircle, X, FileText, Upload,
  AlertCircle, Check,
} from "lucide-react";
import { motion } from "framer-motion";

const PostularButton = ({ proyectoId, yaPostulo, disabled }) => {
  const [mensaje, setMensaje] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cvOption, setCvOption] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [subiendoCv, setSubiendoCv] = useState(false);
  const fileInputRef = useRef(null);

  const { postular, estaCargando } = usePostular();
  const { data: perfil } = usePerfil();
  const queryClient = useQueryClient();

  const cvActual = perfil?.cvUrl || null;
  const tieneCvActual = Boolean(cvActual);

  useEffect(() => {
    if (showForm && cvOption === null) {
      setCvOption(tieneCvActual ? "actual" : "nuevo");
    }
  }, [showForm, tieneCvActual, cvOption]);

  if (yaPostulo) {
    return (
      <button
        disabled
        style={{
          width: "100%", padding: "12px 20px", borderRadius: 10,
          border: "1px solid #d1d5db", background: "#f9fafb",
          color: "#6b7280", fontSize: 14, fontWeight: 600,
          cursor: "not-allowed",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
      >
        <CheckCircle size={16} style={{ color: "#059669" }} />
        Ya has postulado a este proyecto
      </button>
    );
  }

  if (disabled) {
    return (
      <button
        disabled
        style={{
          width: "100%", padding: "12px 20px", borderRadius: 10,
          border: "1px solid #d1d5db", background: "#f9fafb",
          color: "#9ca3af", fontSize: 14, fontWeight: 600,
          cursor: "not-allowed",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
      >
        Límite de proyectos alcanzado
      </button>
    );
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          width: "100%", background: "#f0fdf4",
          border: "1px solid #bbf7d0", padding: 16, borderRadius: 12,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", textAlign: "center",
        }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "#22c55e", display: "flex",
          alignItems: "center", justifyContent: "center", marginBottom: 12,
        }}>
          <CheckCircle size={24} color="#fff" />
        </div>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: "#166534", marginBottom: 4 }}>
          ¡Postulación Enviada!
        </h4>
        <p style={{ fontSize: 11, color: "#15803d", fontWeight: 500 }}>
          Tu aplicación ha sido registrada exitosamente.
        </p>
      </motion.div>
    );
  }

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      setErrorMessage("El CV debe ser un archivo PDF");
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setErrorMessage("El CV no puede superar los 5 MB");
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }
    setCvFile(f);
    setCvOption("nuevo");
    setErrorMessage("");
  };

  const handleSelectActual = () => {
    if (!tieneCvActual) return;
    setCvOption("actual");
    setCvFile(null);
  };

  const handleSelectNuevo = () => {
    setCvOption("nuevo");
    if (!cvFile) {
      fileInputRef.current?.click();
    }
  };

  const handleAbrir = () => {
    setShowForm(true);
    setErrorMessage("");
  };

  const handleCancelar = () => {
    setShowForm(false);
    setMensaje("");
    setCvFile(null);
    setCvOption(null);
    setErrorMessage("");
  };

  const manejarEnvioDePostulacion = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (mensaje.length > 200) {
      setErrorMessage("El mensaje no puede superar los 200 caracteres");
      return;
    }

    let cvUrlAEnviar = null;

    if (cvOption === "actual") {
      if (!cvActual) {
        setErrorMessage("No tienes un CV en tu perfil. Sube uno nuevo.");
        return;
      }
      cvUrlAEnviar = cvActual;
    } else if (cvOption === "nuevo") {
      if (!cvFile) {
        setErrorMessage("Selecciona un archivo PDF para tu CV");
        return;
      }
      try {
        setSubiendoCv(true);
        const resp = await subirCvApi(cvFile);
        cvUrlAEnviar = resp.cvUrl;
        queryClient.invalidateQueries({ queryKey: ["perfil"] });
        setSubiendoCv(false);
      } catch (err) {
        setSubiendoCv(false);
        const msg = err.response?.data?.message || "Error al subir el CV";
        setErrorMessage(msg);
        return;
      }
    } else {
      setErrorMessage("Selecciona una opción para tu CV");
      return;
    }

    postular(
      {
        proyectoId,
        datos: {
          mensajePostulacion: mensaje.trim() || null,
          archivoAdjunto: cvUrlAEnviar,
        },
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          setMensaje("");
          setCvFile(null);
          setShowForm(false);
          setTimeout(() => window.location.reload(), 2000);
        },
        onError: (err) => {
          const status = err.response?.status;
          const msg = err.response?.data?.message || err.message || "Error al enviar la postulación";
          setErrorMessage(msg);
          setTimeout(() => setErrorMessage(""), status === 409 ? 8000 : 5000);
        },
      }
    );
  };

  const cargando = estaCargando || subiendoCv;

  if (!showForm) {
    return (
      <div style={{ width: "100%" }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAbrir}
          style={{
            width: "100%", padding: "12px 20px", borderRadius: 10,
            border: "none",
            background: "linear-gradient(135deg, #1B6FE8, #2563eb)",
            color: "#fff", fontSize: 14, fontWeight: 600,
            cursor: "pointer", transition: "all 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: "0 2px 8px rgba(27,111,232,0.25)",
          }}
        >
          <Send size={14} />
          Postular ahora
        </motion.button>
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={manejarEnvioDePostulacion}
        style={{
          background: "#fff", borderRadius: 12,
          border: "1px solid #e0e7ff", padding: 16,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 14,
        }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>
            Postular al proyecto
          </label>
          <button
            type="button"
            onClick={handleCancelar}
            style={{
              background: "transparent", border: "none",
              cursor: "pointer", padding: 4, borderRadius: 4,
            }}
          >
            <X size={16} color="#94a3b8" />
          </button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{
            fontSize: 12, fontWeight: 600, color: "#374151",
            display: "block", marginBottom: 8,
          }}>
            Tu CV <span style={{ color: "#ef4444" }}>*</span>
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div
              role="button"
              tabIndex={tieneCvActual ? 0 : -1}
              onClick={handleSelectActual}
              style={{
                padding: 12, borderRadius: 10,
                border: cvOption === "actual" ? "2px solid #1B6FE8" : "1px solid #e2e8f0",
                background: cvOption === "actual" ? "#eff6ff" : tieneCvActual ? "#fff" : "#f8fafc",
                cursor: tieneCvActual ? "pointer" : "not-allowed",
                opacity: tieneCvActual ? 1 : 0.55,
                transition: "all 0.2s", position: "relative", minHeight: 90,
                display: "flex", flexDirection: "column", justifyContent: "center", gap: 6,
                userSelect: "none",
              }}
            >
              {cvOption === "actual" && (
                <div style={{
                  position: "absolute", top: 8, right: 8,
                  width: 18, height: 18, borderRadius: "50%",
                  background: "#1B6FE8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Check size={11} color="#fff" />
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <FileText size={16} color={cvOption === "actual" ? "#1B6FE8" : "#64748b"} />
                <span style={{
                  fontSize: 12, fontWeight: 700,
                  color: cvOption === "actual" ? "#1B6FE8" : "#1e293b",
                }}>
                  Enviar mi CV
                </span>
              </div>
              <p style={{ fontSize: 10, color: "#64748b", margin: 0, lineHeight: 1.4 }}>
                {tieneCvActual ? "Usar el CV de tu perfil" : "No tienes un CV en tu perfil"}
              </p>
              {tieneCvActual && (
                <a
                  href={cvActual}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    fontSize: 10, fontWeight: 600,
                    color: "#1B6FE8", textDecoration: "none",
                    alignSelf: "flex-start",
                  }}
                >
                  Ver actual
                </a>
              )}
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={handleSelectNuevo}
              style={{
                padding: 12, borderRadius: 10,
                border: cvOption === "nuevo" ? "2px solid #1B6FE8" : "1px solid #e2e8f0",
                background: cvOption === "nuevo" ? "#eff6ff" : "#fff",
                cursor: "pointer",
                transition: "all 0.2s", position: "relative", minHeight: 90,
                display: "flex", flexDirection: "column", justifyContent: "center", gap: 6,
                userSelect: "none",
              }}
            >
              {cvOption === "nuevo" && (
                <div style={{
                  position: "absolute", top: 8, right: 8,
                  width: 18, height: 18, borderRadius: "50%",
                  background: "#1B6FE8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Check size={11} color="#fff" />
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Upload size={16} color={cvOption === "nuevo" ? "#1B6FE8" : "#64748b"} />
                <span style={{
                  fontSize: 12, fontWeight: 700,
                  color: cvOption === "nuevo" ? "#1B6FE8" : "#1e293b",
                }}>
                  Cargar nuevo CV
                </span>
              </div>
              <p style={{ fontSize: 10, color: "#64748b", margin: 0, lineHeight: 1.4 }}>
                {cvFile ? cvFile.name : "Subir un PDF (máx 5 MB)"}
              </p>
              {cvFile && (
                <span style={{ fontSize: 10, fontWeight: 600, color: "#059669" }}>
                  Archivo seleccionado
                </span>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {tieneCvActual && cvOption === "nuevo" && (
            <p style={{
              fontSize: 10, color: "#94a3b8",
              marginTop: 6, fontStyle: "italic",
            }}>
              Al subir un nuevo CV, reemplazará el actual en tu perfil para futuras postulaciones.
            </p>
          )}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{
            fontSize: 12, fontWeight: 600, color: "#374151",
            display: "block", marginBottom: 6,
          }}>
            Mensaje de presentación{" "}
            <span style={{ color: "#9ca3af", fontWeight: 400 }}>(opcional)</span>
          </label>
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Cuéntale a la empresa por qué te interesa este proyecto..."
            style={{
              width: "100%", padding: "10px 12px", borderRadius: 8,
              border: mensaje.length > 200 ? "1px solid #fecaca" : "1px solid #e2e8f0",
              fontSize: 13, outline: "none", resize: "vertical",
              minHeight: 80, fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
            <span style={{
              fontSize: 10,
              color: mensaje.length > 200 ? "#ef4444" : "#94a3b8",
            }}>
              {mensaje.length}/200
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={handleCancelar}
            disabled={cargando}
            style={{
              flex: 1, padding: "10px 16px", borderRadius: 8,
              border: "1px solid #e2e8f0", background: "#fff", color: "#64748b",
              fontSize: 13, fontWeight: 600,
              cursor: cargando ? "not-allowed" : "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={cargando || mensaje.length > 200}
            style={{
              flex: 1, padding: "10px 16px", borderRadius: 8,
              border: "none",
              background: "linear-gradient(135deg, #1B6FE8, #2563eb)",
              color: "#fff", fontSize: 13, fontWeight: 700,
              cursor: cargando ? "not-allowed" : "pointer",
              opacity: cargando ? 0.6 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            {cargando ? (
              <>
                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                {subiendoCv ? "Subiendo CV..." : "Enviando..."}
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              marginTop: 12, padding: "8px 12px", borderRadius: 8,
              background: "#fef2f2", border: "1px solid #fecaca",
              color: "#dc2626", fontSize: 11,
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <AlertCircle size={13} />
            {errorMessage}
          </motion.div>
        )}

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </motion.form>
    </div>
  );
};

export default PostularButton;