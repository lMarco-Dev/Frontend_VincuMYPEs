import { useState, useRef } from "react";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import {
  useCertificadosEmitidos,
  useEmitirCertificado,
} from "@/features/certificados/useCertificadosMype";
import { useMisProyectos } from "@/features/proyecto-list-mype/useMisProyectos";
import { useAuthStore } from "@/store/authStore";
import {
  Award,
  Plus,
  X,
  Loader2,
  CheckCircle2,
  User,
  Briefcase,
  Calendar,
  FileText,
  AlertTriangle,
  Download,
  Eye,
} from "lucide-react";

const FONT = "'Angro Std', 'Outfit', sans-serif";

// ── Plantilla visual del certificado ────────────────────────
function PlantillaCertificado({ datos }) {
  const hoy = new Date().toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Usamos el ID del certificado o del proyecto como fallback seguro para evitar Math.random en el render
  const certificadoCodigo = datos.id
    ? String(datos.id).padStart(5, "0")
    : datos.proyectoId
      ? String(datos.proyectoId).padStart(5, "0")
      : "00000";

  return (
    <div
      id="certificado-preview"
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 12,
        padding: "40px 48px",
        maxWidth: 680,
        position: "relative",
        fontFamily: "'Outfit', Georgia, serif",
        margin: "0 auto",
      }}
    >
      {/* Marco decorativo */}
      <div
        style={{
          position: "absolute",
          inset: 8,
          border: "2px solid #1B6FE8",
          borderRadius: 8,
          opacity: 0.15,
          pointerEvents: "none",
        }}
      />
      {[
        {
          top: 14,
          left: 14,
          borderTop: "2px solid #1B6FE8",
          borderLeft: "2px solid #1B6FE8",
          borderRadius: "4px 0 0 0",
        },
        {
          top: 14,
          right: 14,
          borderTop: "2px solid #1B6FE8",
          borderRight: "2px solid #1B6FE8",
          borderRadius: "0 4px 0 0",
        },
        {
          bottom: 14,
          left: 14,
          borderBottom: "2px solid #1B6FE8",
          borderLeft: "2px solid #1B6FE8",
          borderRadius: "0 0 0 4px",
        },
        {
          bottom: 14,
          right: 14,
          borderBottom: "2px solid #1B6FE8",
          borderRight: "2px solid #1B6FE8",
          borderRadius: "0 0 4px 0",
        },
      ].map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 24,
            height: 24,
            opacity: 0.5,
            ...s,
          }}
        />
      ))}

      {/* Header con logo */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
            <path d="M20 15 L50 85 L65 85 L35 15 Z" fill="#1B6FE8" />
            <path
              d="M80 15 L50 85 L35 85 L65 15 Z"
              fill="#06B6D4"
              opacity="0.9"
            />
            <circle cx="50" cy="85" r="8" fill="#F97316" />
          </svg>
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#1E3A5F",
              letterSpacing: -0.5,
            }}
          >
            Vincu<span style={{ color: "#06B6D4" }}>MYPEs</span>
          </span>
        </div>
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg,transparent,#1B6FE8,transparent)",
            width: "80%",
            margin: "0 auto 16px",
          }}
        />
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#9CA3AF",
            textTransform: "uppercase",
            letterSpacing: 2,
            marginBottom: 6,
          }}
        >
          Certificado de participación
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#111827",
            letterSpacing: -0.5,
            marginBottom: 4,
          }}
        >
          VincuMYPEs
        </div>
        <div style={{ fontSize: 13, color: "#6B7280" }}>
          Plataforma de vinculación académico-empresarial · Cajamarca, Perú
        </div>
      </div>

      {/* Cuerpo */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 6 }}>
          Este certificado se otorga a
        </p>
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#1B6FE8",
            fontStyle: "italic",
            borderBottom: "2px solid #E5E7EB",
            paddingBottom: 6,
            display: "inline-block",
            marginBottom: 12,
          }}
        >
          {datos.estudianteNombre || "Nombre del Estudiante"}
        </div>
        <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 6 }}>
          por su participación y culminación exitosa del proyecto
        </p>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#111827",
            marginBottom: 8,
          }}
        >
          {datos.proyectoTitulo || "Título del Proyecto"}
        </div>
        <p
          style={{
            fontSize: 12,
            color: "#9CA3AF",
            maxWidth: 480,
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          {datos.descripcion ||
            "El estudiante demostró compromiso y habilidades técnicas durante el desarrollo del proyecto, entregando los resultados acordados de manera satisfactoria."}
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingTop: 20,
          borderTop: "1px solid #F3F4F6",
        }}
      >
        {/* Firma */}
        <div style={{ textAlign: "center", flex: 1 }}>
          {datos.firmaUrl ? (
            <img
              src={datos.firmaUrl}
              alt="Firma"
              style={{ height: 40, marginBottom: 4, objectFit: "contain" }}
            />
          ) : (
            <div
              style={{
                height: 24,
                marginBottom: 4,
                fontSize: 11,
                color: "#9CA3AF",
                fontStyle: "italic",
              }}
            >
              firma digital
            </div>
          )}
          <div
            style={{
              width: 120,
              height: 1,
              background: "#D1D5DB",
              margin: "0 auto 6px",
            }}
          />
          <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
            {datos.gerente || "Nombre del Gerente"}
          </div>
          <div style={{ fontSize: 11, color: "#9CA3AF" }}>
            {datos.mypeNombre || "Nombre de la Empresa"}
          </div>
        </div>

        {/* Sello central */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: "2px solid #1B6FE8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Award size={24} color="#1B6FE8" />
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 10,
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 2,
              }}
            >
              Fecha de emisión
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
              {hoy}
            </div>
          </div>
        </div>

        {/* Código QR mock */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              background: "#F3F4F6",
              border: "1px solid #E5E7EB",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileText size={20} color="#D1D5DB" />
          </div>
          <div style={{ fontSize: 11, color: "#9CA3AF" }}>
            Verificación digital
          </div>
          <div style={{ fontSize: 9, color: "#D1D5DB" }}>
            CERT-{new Date().getFullYear()}-{certificadoCodigo}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Modal para emitir certificado ────────────────────────────
function ModalEmitirCertificado({ proyectosCompletados, mypeNombre, onClose }) {
  const { emitir, isLoading, isSuccess, error } = useEmitirCertificado();
  const [preview, setPreview] = useState(false);
  const [exportando, setExportando] = useState(false);

  const [form, setForm] = useState({
    proyectoId: "",
    proyectoTitulo: "",
    estudianteId: "",
    estudianteNombre: "",
    gerente: "",
    descripcion: "",
    firmaUrl: "",
  });

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleProyectoChange = (e) => {
    const p = proyectosCompletados.find((p) => p.id === Number(e.target.value));
    if (p) handleChange("proyectoId", p.id);
    if (p) handleChange("proyectoTitulo", p.titulo);
  };

  // Subida de firma como imagen local
  const handleFirma = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => handleChange("firmaUrl", ev.target.result);
    reader.readAsDataURL(file);
  };

  // Exportar a PDF con html2pdf.js
  const handleExportarPDF = async () => {
    setExportando(true);
    const html2pdf = (await import("html2pdf.js")).default;
    const elemento = document.getElementById("certificado-preview");
    await html2pdf()
      .set({
        margin: 10,
        filename: `certificado-${form.estudianteNombre || "estudiante"}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
      })
      .from(elemento)
      .save();
    setExportando(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emitir({
      proyectoId: Number(form.proyectoId),
      estudianteId: Number(form.estudianteId),
      tituloCertificado: `Certificado de Participación — ${form.proyectoTitulo}`,
      descripcionCertificado: form.descripcion,
    });
  };

  const inputSt = {
    width: "100%",
    padding: "9px 12px",
    borderRadius: 8,
    fontFamily: FONT,
    fontSize: 13,
    border: "1px solid #E5E7EB",
    outline: "none",
    background: "#fff",
    color: "#111827",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  const labelSt = {
    fontFamily: FONT,
    fontSize: 11,
    fontWeight: 700,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    display: "flex",
    alignItems: "center",
    gap: 5,
    marginBottom: 6,
  };

  if (isSuccess) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          background: "rgba(15,42,74,0.55)",
          backdropFilter: "blur(3px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            width: "100%",
            maxWidth: 420,
            padding: 32,
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#F0FDF4",
              border: "2px solid #BBF7D0",
              margin: "0 auto 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircle2 size={28} color="#15803D" />
          </div>
          <h3
            style={{
              fontFamily: FONT,
              fontSize: 17,
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 8px",
            }}
          >
            ¡Certificado emitido!
          </h3>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 13,
              color: "#6B7280",
              margin: "0 0 8px",
            }}
          >
            El certificado fue registrado en el sistema.
          </p>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 12,
              color: "#9CA3AF",
              margin: "0 0 20px",
            }}
          >
            Descárgalo ahora en PDF para enviarlo al estudiante:
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button
              onClick={handleExportarPDF}
              disabled={exportando}
              style={{
                fontFamily: FONT,
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "0 20px",
                height: 40,
                borderRadius: 9,
                background: "linear-gradient(135deg,#1B6FE8,#0E54C4)",
                color: "#fff",
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {exportando ? (
                <Loader2
                  size={14}
                  style={{ animation: "spin 1s linear infinite" }}
                />
              ) : (
                <Download size={14} />
              )}
              Descargar PDF
            </button>
            <button
              onClick={onClose}
              style={{
                fontFamily: FONT,
                padding: "0 20px",
                height: 40,
                borderRadius: 9,
                background: "transparent",
                border: "1px solid #E5E7EB",
                color: "#6B7280",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(15,42,74,0.55)",
        backdropFilter: "blur(3px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        overflow: "auto",
      }}
    >
      <div
        style={{
          background: "#F8FAFC",
          borderRadius: 16,
          width: "100%",
          maxWidth: preview ? 780 : 540,
          maxHeight: "95vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          transition: "max-width 0.3s ease",
        }}
      >
        {/* Franja */}
        <div
          style={{
            height: 4,
            background: "linear-gradient(90deg,#1B6FE8,#06B6D4)",
            flexShrink: 0,
          }}
        />

        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            background: "#fff",
            borderBottom: "0.5px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#EFF6FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Award size={18} color="#1B6FE8" />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: FONT,
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Emitir certificado
              </h2>
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: 11,
                  color: "#9CA3AF",
                  margin: "1px 0 0",
                }}
              >
                Llena los datos y descarga el PDF
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setPreview(!preview)}
              style={{
                fontFamily: FONT,
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 12px",
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                background: preview ? "rgba(27,111,232,0.08)" : "#F3F4F6",
                color: preview ? "#1B6FE8" : "#6B7280",
                border: `1px solid ${preview ? "rgba(27,111,232,0.2)" : "#E5E7EB"}`,
                cursor: "pointer",
              }}
            >
              <Eye size={13} /> {preview ? "Ocultar" : "Ver"} preview
            </button>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#9CA3AF",
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Contenido scrollable */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          <div style={{ display: "flex", gap: 20 }}>
            {/* Formulario */}
            <form
              onSubmit={handleSubmit}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div>
                <label style={labelSt}>
                  <Briefcase size={12} /> Proyecto completado
                </label>
                <select
                  required
                  value={form.proyectoId}
                  onChange={handleProyectoChange}
                  style={{ ...inputSt, cursor: "pointer" }}
                  onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                >
                  <option value="">Selecciona un proyecto...</option>
                  {proyectosCompletados.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.titulo}
                    </option>
                  ))}
                </select>
                {proyectosCompletados.length === 0 && (
                  <p
                    style={{
                      fontFamily: FONT,
                      fontSize: 11,
                      color: "#F97316",
                      margin: "4px 0 0",
                    }}
                  >
                    ⚠ Solo proyectos en estado COMPLETADO
                  </p>
                )}
              </div>

              <div>
                <label style={labelSt}>
                  <User size={12} /> Nombre del estudiante
                </label>
                <input
                  required
                  placeholder="Ej: Marco Antonio Chuquilín Pérez"
                  value={form.estudianteNombre}
                  onChange={(e) =>
                    handleChange("estudianteNombre", e.target.value)
                  }
                  style={inputSt}
                  onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>

              <div>
                <label style={labelSt}>
                  <User size={12} /> ID del estudiante
                </label>
                <input
                  required
                  type="number"
                  min={1}
                  placeholder="ID del estudiante en el sistema"
                  value={form.estudianteId}
                  onChange={(e) => handleChange("estudianteId", e.target.value)}
                  style={inputSt}
                  onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>

              <div>
                <label style={labelSt}>
                  <User size={12} /> Nombre del gerente
                </label>
                <input
                  required
                  placeholder="Ej: Juan Carlos Rojas Mendoza"
                  value={form.gerente}
                  onChange={(e) => handleChange("gerente", e.target.value)}
                  style={inputSt}
                  onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>

              <div>
                <label style={labelSt}>
                  <Calendar size={12} /> Descripción / fecha de culminación
                </label>
                <textarea
                  rows={3}
                  placeholder="Ej: Proyecto finalizado el 30 de mayo de 2026..."
                  value={form.descripcion}
                  onChange={(e) => handleChange("descripcion", e.target.value)}
                  style={{ ...inputSt, resize: "vertical" }}
                  onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>

              {/* Subida de firma */}
              <div>
                <label style={labelSt}>
                  <FileText size={12} /> Firma del gerente (imagen PNG/JPG)
                </label>
                <div
                  style={{
                    border: "1.5px dashed #E5E7EB",
                    borderRadius: 8,
                    padding: "14px 16px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                    background: "#F9FAFB",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "#1B6FE8")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "#E5E7EB")
                  }
                  onClick={() => document.getElementById("firma-input").click()}
                >
                  {form.firmaUrl ? (
                    <img
                      src={form.firmaUrl}
                      alt="firma"
                      style={{ height: 40, objectFit: "contain" }}
                    />
                  ) : (
                    <>
                      <FileText
                        size={20}
                        color="#D1D5DB"
                        style={{ marginBottom: 4 }}
                      />
                      <p
                        style={{
                          fontFamily: FONT,
                          fontSize: 12,
                          color: "#9CA3AF",
                          margin: 0,
                        }}
                      >
                        Clic para cargar tu firma
                      </p>
                      <p
                        style={{
                          fontFamily: FONT,
                          fontSize: 10,
                          color: "#D1D5DB",
                          margin: "2px 0 0",
                        }}
                      >
                        PNG o JPG con fondo transparente recomendado
                      </p>
                    </>
                  )}
                  <input
                    id="firma-input"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFirma}
                  />
                </div>
              </div>

              {error && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#FEF2F2",
                    border: "1px solid #FECACA",
                    borderRadius: 8,
                    padding: "10px 12px",
                  }}
                >
                  <AlertTriangle size={14} color="#DC2626" />
                  <span
                    style={{ fontFamily: FONT, fontSize: 12, color: "#DC2626" }}
                  >
                    {error}
                  </span>
                </div>
              )}
            </form>

            {/* Preview del certificado */}
            {preview && (
              <div style={{ flex: 1.2, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: 10,
                  }}
                >
                  Vista previa
                </p>
                <div
                  style={{
                    transform: "scale(0.6)",
                    transformOrigin: "top left",
                    width: "167%",
                    pointerEvents: "none",
                  }}
                >
                  <PlantillaCertificado datos={{ ...form, mypeNombre }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 20px",
            background: "#fff",
            borderTop: "0.5px solid #E5E7EB",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <button
            onClick={handleExportarPDF}
            disabled={exportando || !form.proyectoId}
            style={{
              fontFamily: FONT,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "0 16px",
              height: 38,
              borderRadius: 8,
              background: form.proyectoId ? "#F0FDF4" : "#F9FAFB",
              color: form.proyectoId ? "#15803D" : "#D1D5DB",
              border: `1px solid ${form.proyectoId ? "#BBF7D0" : "#E5E7EB"}`,
              fontSize: 12,
              fontWeight: 600,
              cursor: form.proyectoId ? "pointer" : "not-allowed",
            }}
          >
            {exportando ? (
              <Loader2
                size={13}
                style={{ animation: "spin 1s linear infinite" }}
              />
            ) : (
              <Download size={13} />
            )}
            Descargar PDF
          </button>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              disabled={isLoading}
              style={{
                fontFamily: FONT,
                padding: "0 18px",
                height: 38,
                borderRadius: 8,
                background: "transparent",
                border: "1px solid #E5E7EB",
                color: "#6B7280",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                isLoading ||
                !form.proyectoId ||
                !form.estudianteId ||
                !form.estudianteNombre ||
                !form.gerente
              }
              style={{
                fontFamily: FONT,
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "0 18px",
                height: 38,
                borderRadius: 8,
                background: "linear-gradient(135deg,#1B6FE8,#0E54C4)",
                color: "#fff",
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity:
                  isLoading || !form.proyectoId || !form.estudianteId ? 0.6 : 1,
              }}
            >
              {isLoading ? (
                <>
                  <Loader2
                    size={14}
                    style={{ animation: "spin 1s linear infinite" }}
                  />{" "}
                  Emitiendo...
                </>
              ) : (
                <>
                  <Award size={14} /> Emitir y guardar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Página principal ─────────────────────────────────────────
export function CertificadosPage() {
  const { certificados, isLoading } = useCertificadosEmitidos();
  const { proyectos } = useMisProyectos();
  const { user } = useAuthStore();
  const [modalAbierto, setModalAbierto] = useState(false);

  const proyectosCompletados = proyectos.filter(
    (p) => p.estado === "COMPLETADO",
  );

  return (
    <MypeLayout titulo="Certificados">
      {modalAbierto && (
        <ModalEmitirCertificado
          proyectosCompletados={proyectosCompletados}
          mypeNombre={user?.nombre ?? ""}
          onClose={() => setModalAbierto(false)}
        />
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <p
          style={{
            fontFamily: FONT,
            fontSize: 13,
            color: "#6B7280",
            margin: 0,
          }}
        >
          Emite certificados para los estudiantes que completaron proyectos
          contigo.
        </p>
        <button
          onClick={() => setModalAbierto(true)}
          disabled={proyectosCompletados.length === 0}
          title={
            proyectosCompletados.length === 0
              ? "Solo puedes emitir certificados de proyectos completados"
              : ""
          }
          style={{
            fontFamily: FONT,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "0 16px",
            height: 36,
            borderRadius: 9,
            border: "none",
            background:
              proyectosCompletados.length === 0
                ? "#E5E7EB"
                : "linear-gradient(135deg,#1B6FE8,#0E54C4)",
            color: proyectosCompletados.length === 0 ? "#9CA3AF" : "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor:
              proyectosCompletados.length === 0 ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (proyectosCompletados.length > 0) {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 4px 14px rgba(27,111,232,0.3)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <Plus size={14} /> Emitir certificado
        </button>
      </div>

      {/* Lista */}
      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: 72,
                borderRadius: 10,
                background: "#E5E7EB",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
      ) : certificados.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 24px",
            border: "1px dashed #E5E7EB",
            borderRadius: 12,
            background: "#fff",
          }}
        >
          <Award size={28} color="#D1D5DB" style={{ marginBottom: 10 }} />
          <p
            style={{
              fontFamily: FONT,
              fontSize: 14,
              color: "#9CA3AF",
              marginBottom: 4,
            }}
          >
            Aún no has emitido ningún certificado
          </p>
          <p style={{ fontFamily: FONT, fontSize: 12, color: "#D1D5DB" }}>
            Cuando un proyecto esté completado, podrás emitir certificados a los
            estudiantes
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {certificados.map((cert) => (
            <div
              key={cert.id}
              style={{
                background: "#fff",
                border: "0.5px solid #E5E7EB",
                borderRadius: 12,
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "box-shadow 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 2px 12px rgba(0,0,0,0.05)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: "#EFF6FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Award size={18} color="#1B6FE8" />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: FONT,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    {cert.tituloCertificado}
                  </p>
                  <p
                    style={{
                      fontFamily: FONT,
                      fontSize: 11,
                      color: "#9CA3AF",
                      margin: "2px 0 0",
                    }}
                  >
                    Emitido el{" "}
                    {new Date(cert.fechaEmision).toLocaleDateString("es-PE")}
                  </p>
                </div>
              </div>
              {cert.urlCertificado && (
                <a
                  href={cert.urlCertificado}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: FONT,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#1B6FE8",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "6px 12px",
                    borderRadius: 7,
                    background: "rgba(27,111,232,0.06)",
                    border: "1px solid rgba(27,111,232,0.15)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(27,111,232,0.12)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "rgba(27,111,232,0.06)")
                  }
                >
                  <FileText size={12} /> Ver PDF
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </MypeLayout>
  );
}
