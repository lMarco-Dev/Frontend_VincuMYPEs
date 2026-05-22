import { useState, useRef, useEffect } from "react";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import { useMisProyectos } from "@/features/proyecto-list-mype/useMisProyectos";
import { AREA_SISTEMAS_LABELS } from "@/entities/proyecto/proyecto.constants";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Pencil,
  Trash2,
  FileText,
  Loader2,
  X,
  Save,
  AlertTriangle,
  Plus,
  Briefcase,
  Calendar,
  FolderOpen,
} from "lucide-react";
import { EstadoBadge } from "./MypeDashboardPage";
import {
  useEditarProyecto,
  useEliminarProyecto,
} from "@/features/proyecto-edit/useEditarProyecto";

const FONT = "'Angro Std', 'Outfit', sans-serif";

/* ─── Animaciones ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ═══════════════════════════════════════════════
   HERO BANNER ANIMADO PARA MIS PROYECTOS
═══════════════════════════════════════════════ */
const MisProyectosHeroBanner = ({ totalProyectos }) => {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext("2d");
    let W, H, animId;
    const mouse = { x: -999, y: -999 };
    const COLORS = ["rgba(27,111,232,", "rgba(6,182,212,", "rgba(245,158,11,"];

    const resize = () => {
      W = canvas.width = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(hero);

    hero.addEventListener("mousemove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    hero.addEventListener("mouseleave", () => {
      mouse.x = -999;
      mouse.y = -999;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.size = Math.random() * 2 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = Math.random() * 0.5 + 0.2;
      }
      update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          this.x += dx * 0.02;
          this.y += dy * 0.02;
        }
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > W) this.speedX *= -1;
        if (this.y < 0 || this.y > H) this.speedY *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ")";
        ctx.fill();
      }
    }

    const particles = Array.from({ length: 50 }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(27,111,232,${0.1 * (1 - dist / 80)})`;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <motion.div
      ref={heroRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "2rem",
        background:
          "linear-gradient(135deg, #0A1628 0%, #0F2A4A 60%, #1E3A5F 100%)",
        padding: "40px 48px",
        color: "#fff",
        marginBottom: 28,
        minHeight: 200,
        display: "flex",
        alignItems: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      {/* Luces Ambientales */}
      <div
        style={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "radial-gradient(circle, #F59E0B, transparent 70%)",
          opacity: 0.12,
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -50,
          left: 100,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, #06B6D4, transparent 70%)",
          opacity: 0.1,
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div style={{ maxWidth: 500 }}>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 20,
              padding: "6px 14px",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#fff",
              marginBottom: 16,
              backdropFilter: "blur(8px)",
            }}
          >
            <FolderOpen size={12} style={{ color: "#06B6D4" }} /> Gestión de
            Proyectos
          </motion.div>
          <h1
            style={{
              fontSize: "clamp(26px, 3vw, 36px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 12,
            }}
          >
            Tus <span style={{ color: "#F59E0B" }}>proyectos tecnológicos</span>
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.6,
              margin: 0,
              fontWeight: 400,
            }}
          >
            Administra, edita y da seguimiento a todas las iniciativas que has
            publicado para conectar con el mejor talento.
          </p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16,
            padding: "16px 28px",
            textAlign: "center",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#06B6D4",
              lineHeight: 1,
            }}
          >
            {totalProyectos}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginTop: 4,
              fontWeight: 600,
            }}
          >
            Total Proyectos
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   TARJETA DE PROYECTO
═══════════════════════════════════════════════ */
const ProjectCard = ({
  proyecto,
  onEdit,
  onDelete,
  onViewPostulantes,
  onReviewEntregables,
}) => {
  const areaLabel =
    AREA_SISTEMAS_LABELS[proyecto.areaSistemas] ?? proyecto.areaSistemas;

  const getAreaColor = (area) => {
    const colors = {
      DESARROLLO_WEB: { bg: "#EFF6FF", color: "#1B6FE8", border: "#BFDBFE" },
      DESARROLLO_MOVIL: { bg: "#F0FDF4", color: "#059669", border: "#BBF7D0" },
      DESARROLLO_SOFTWARE: {
        bg: "#F5F3FF",
        color: "#7C3AED",
        border: "#DDD6FE",
      },
      BASE_DE_DATOS: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
      ANALISIS_DATOS: { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
      SOPORTE_TI: { bg: "#F0F9FF", color: "#0284C7", border: "#BAE6FD" },
      OTRO: { bg: "#F3F4F6", color: "#6B7280", border: "#E5E7EB" },
    };
    return colors[area] || colors.OTRO;
  };

  const areaStyle = getAreaColor(proyecto.areaSistemas);
  const isEnDesarrollo = proyecto.estado === "EN_DESARROLLO";
  const isCompletado = proyecto.estado === "COMPLETADO";
  const isEditable = !isEnDesarrollo && !isCompletado;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: "1.5rem",
        padding: 20,
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.08)";
        e.currentTarget.style.borderColor = "#BFDBFE";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#E5E7EB";
      }}
    >
      {/* Esquina decorativa */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 80,
          height: 80,
          background: `linear-gradient(135deg, transparent 50%, ${areaStyle.bg} 50%)`,
          pointerEvents: "none",
          borderRadius: "0 1.5rem 0 0",
        }}
      />

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {/* Icono del área */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "1rem",
            background: areaStyle.bg,
            border: `1px solid ${areaStyle.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Briefcase size={24} color={areaStyle.color} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header con título y estado */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#0F1F3D",
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {proyecto.titulo}
            </h3>
            <EstadoBadge estado={proyecto.estado} />
          </div>

          {/* Descripción */}
          <p
            style={{
              fontSize: 12,
              color: "#6B7280",
              margin: "0 0 12px 0",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {proyecto.descripcion}
          </p>

          {/* Metadata */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "#9CA3AF",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span
                style={{
                  background: areaStyle.bg,
                  color: areaStyle.color,
                  padding: "2px 8px",
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                {areaLabel}
              </span>
            </span>
            {proyecto.fechaLimite && (
              <span
                style={{
                  fontSize: 11,
                  color: "#9CA3AF",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Calendar size={12} />
                Límite:{" "}
                {new Date(proyecto.fechaLimite).toLocaleDateString("es-PE")}
              </span>
            )}
            {proyecto.cupos && (
              <span
                style={{
                  fontSize: 11,
                  color: "#9CA3AF",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Users size={12} />
                {proyecto.cupos} cupo{proyecto.cupos > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Acciones */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 8,
              borderTop: "1px solid #F3F4F6",
              paddingTop: 14,
            }}
          >
            {isEnDesarrollo ? (
              <button
                onClick={onReviewEntregables}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: "0.75rem",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#0891B2",
                  background: "rgba(8,145,178,0.06)",
                  border: "1px solid rgba(8,145,178,0.15)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(8,145,178,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(8,145,178,0.06)";
                }}
              >
                <FileText size={12} /> Revisar entregables
              </button>
            ) : (
              <button
                onClick={onViewPostulantes}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: "0.75rem",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#1B6FE8",
                  background: "rgba(27,111,232,0.06)",
                  border: "1px solid rgba(27,111,232,0.15)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(27,111,232,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(27,111,232,0.06)";
                }}
              >
                <Users size={12} /> Ver postulantes
              </button>
            )}

            <button
              onClick={onEdit}
              disabled={!isEditable}
              title={
                !isEditable
                  ? "No se puede editar en este estado"
                  : "Editar proyecto"
              }
              style={{
                background: "transparent",
                border: "1px solid transparent",
                borderRadius: "0.5rem",
                padding: 6,
                cursor: isEditable ? "pointer" : "not-allowed",
                color: isEditable ? "#9CA3AF" : "#D1D5DB",
                transition: "all 0.2s",
                opacity: isEditable ? 1 : 0.4,
              }}
              onMouseEnter={(e) => {
                if (isEditable) {
                  e.currentTarget.style.color = "#D97706";
                  e.currentTarget.style.background = "#FFFBEB";
                  e.currentTarget.style.borderColor = "#FDE68A";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#9CA3AF";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <Pencil size={14} />
            </button>

            <button
              onClick={onDelete}
              disabled={isEnDesarrollo}
              title={
                isEnDesarrollo
                  ? "No se puede eliminar un proyecto con estudiantes asignados"
                  : "Eliminar proyecto"
              }
              style={{
                background: "transparent",
                border: "1px solid transparent",
                borderRadius: "0.5rem",
                padding: 6,
                cursor: isEnDesarrollo ? "not-allowed" : "pointer",
                color: "#9CA3AF",
                transition: "all 0.2s",
                opacity: isEnDesarrollo ? 0.4 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isEnDesarrollo) {
                  e.currentTarget.style.color = "#DC2626";
                  e.currentTarget.style.background = "#FEF2F2";
                  e.currentTarget.style.borderColor = "#FECACA";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#9CA3AF";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ── Modal de edición ─────────────────────────────────────────
function ModalEditar({ proyecto, onClose }) {
  const { editarProyecto, isLoading, error } = useEditarProyecto();

  const [form, setForm] = useState({
    titulo: proyecto.titulo ?? "",
    descripcion: proyecto.descripcion ?? "",
    objetivo: proyecto.objetivo ?? "",
    requisitos: proyecto.requisitos ?? "",
    entregablesSugeridos: proyecto.entregablesSugeridos ?? "",
    areaSistemas: proyecto.areaSistemas ?? "OTRO",
    cupos: proyecto.cupos ?? 1,
    fechaInicio: proyecto.fechaInicio ?? "",
    fechaLimite: proyecto.fechaLimite ?? "",
  });

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    editarProyecto(
      { id: proyecto.id, data: { ...form, cupos: Number(form.cupos) } },
      { onSuccess: onClose },
    );
  };

  const inputSt = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
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
    display: "block",
    marginBottom: 6,
  };

  const AREAS = [
    { value: "DESARROLLO_WEB", label: "Desarrollo Web" },
    { value: "DESARROLLO_MOVIL", label: "Desarrollo Móvil" },
    { value: "DESARROLLO_SOFTWARE", label: "Desarrollo Software" },
    { value: "BASE_DE_DATOS", label: "Base de Datos" },
    { value: "ANALISIS_DATOS", label: "Análisis de Datos" },
    { value: "SOPORTE_TI", label: "Soporte TI" },
    { value: "OTRO", label: "Otro" },
  ];

  const hoy = () => new Date().toISOString().split("T")[0];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(15,42,74,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: "#fff",
          borderRadius: "2rem",
          width: "100%",
          maxWidth: 600,
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            background: "linear-gradient(135deg, #F8FAFC, #fff)",
            borderBottom: "1px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: FONT,
                fontSize: 18,
                fontWeight: 800,
                color: "#0F1F3D",
                margin: 0,
              }}
            >
              Editar proyecto
            </h2>
            <p
              style={{
                fontFamily: FONT,
                fontSize: 12,
                color: "#6B7280",
                margin: "2px 0 0",
              }}
            >
              {proyecto.titulo}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#9CA3AF",
              padding: 6,
              borderRadius: "0.5rem",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F3F4F6")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ flex: 1, overflowY: "auto", padding: 24 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={labelSt}>Título del proyecto</label>
              <input
                required
                value={form.titulo}
                onChange={(e) => handleChange("titulo", e.target.value)}
                style={inputSt}
                onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
            </div>

            <div>
              <label style={labelSt}>Descripción del problema</label>
              <textarea
                required
                rows={3}
                value={form.descripcion}
                onChange={(e) => handleChange("descripcion", e.target.value)}
                style={{ ...inputSt, resize: "vertical" }}
                onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <div>
                <label style={labelSt}>Área de sistemas</label>
                <select
                  value={form.areaSistemas}
                  onChange={(e) => handleChange("areaSistemas", e.target.value)}
                  style={{ ...inputSt, cursor: "pointer" }}
                >
                  {AREAS.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelSt}>Cupos</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={form.cupos}
                  onChange={(e) => handleChange("cupos", e.target.value)}
                  style={inputSt}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <div>
                <label style={labelSt}>Fecha de inicio</label>
                <input
                  type="date"
                  value={form.fechaInicio?.split("T")[0] ?? ""}
                  min={hoy()}
                  onChange={(e) => handleChange("fechaInicio", e.target.value)}
                  style={inputSt}
                />
              </div>
              <div>
                <label style={labelSt}>Fecha límite</label>
                <input
                  type="date"
                  value={form.fechaLimite?.split("T")[0] ?? ""}
                  min={form.fechaInicio || hoy()}
                  onChange={(e) => handleChange("fechaLimite", e.target.value)}
                  style={inputSt}
                />
              </div>
            </div>

            <div>
              <label style={labelSt}>Objetivo (opcional)</label>
              <input
                value={form.objetivo}
                onChange={(e) => handleChange("objetivo", e.target.value)}
                style={inputSt}
              />
            </div>

            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 10,
                  padding: "10px 14px",
                }}
              >
                <AlertTriangle size={14} color="#DC2626" />
                <span
                  style={{ fontSize: 12, color: "#DC2626", fontWeight: 500 }}
                >
                  {error}
                </span>
              </div>
            )}
          </div>
        </form>

        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #E5E7EB",
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            flexShrink: 0,
            background: "#F8FAFC",
          }}
        >
          <button
            onClick={onClose}
            disabled={isLoading}
            style={{
              fontFamily: FONT,
              padding: "10px 20px",
              borderRadius: 10,
              background: "transparent",
              border: "1px solid #E5E7EB",
              color: "#6B7280",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              const formEl = document.querySelector("form");
              if (formEl)
                formEl.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true }),
                );
            }}
            disabled={isLoading}
            style={{
              fontFamily: FONT,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 24px",
              borderRadius: 10,
              background: "linear-gradient(135deg, #1B6FE8, #0E54C4)",
              color: "#fff",
              border: "none",
              fontSize: 13,
              fontWeight: 700,
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
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
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Guardando...
              </>
            ) : (
              <>
                <Save size={14} /> Guardar cambios
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Modal de confirmación eliminar ───────────────────────────
function ModalEliminar({ proyecto, onConfirm, onClose, isLoading }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(15,42,74,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: "#fff",
          borderRadius: "2rem",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 4,
            background: "linear-gradient(90deg, #DC2626, #EF4444)",
          }}
        />

        <div style={{ padding: "28px 28px 24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "1rem",
                flexShrink: 0,
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Trash2 size={22} color="#DC2626" />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: FONT,
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#0F1F3D",
                  margin: 0,
                }}
              >
                Eliminar proyecto
              </h3>
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: 12,
                  color: "#9CA3AF",
                  margin: "2px 0 0",
                }}
              >
                Esta acción no se puede deshacer
              </p>
            </div>
          </div>

          <div
            style={{
              background: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 18,
            }}
          >
            <p
              style={{
                fontFamily: FONT,
                fontSize: 10,
                fontWeight: 700,
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                margin: "0 0 4px",
              }}
            >
              Proyecto a eliminar
            </p>
            <p
              style={{
                fontFamily: FONT,
                fontSize: 14,
                fontWeight: 600,
                color: "#111827",
                margin: 0,
              }}
            >
              {proyecto.titulo}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 12,
              padding: "12px 14px",
              marginBottom: 24,
            }}
          >
            <AlertTriangle
              size={16}
              color="#DC2626"
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <p
              style={{
                fontFamily: FONT,
                fontSize: 12,
                color: "#991B1B",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Se eliminarán permanentemente el proyecto y todos sus datos
              asociados. Los estudiantes postulados serán notificados.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={onClose}
              disabled={isLoading}
              style={{
                fontFamily: FONT,
                flex: 1,
                height: 44,
                borderRadius: 10,
                background: "transparent",
                border: "1px solid #E5E7EB",
                color: "#6B7280",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#F9FAFB")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              style={{
                fontFamily: FONT,
                flex: 1,
                height: 44,
                borderRadius: 10,
                background: "linear-gradient(135deg, #DC2626, #B91C1C)",
                color: "#fff",
                border: "none",
                fontSize: 13,
                fontWeight: 700,
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 14px rgba(220,38,38,0.3)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Eliminando...
                </>
              ) : (
                <>
                  <Trash2 size={14} /> Sí, eliminar
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Página principal ─────────────────────────────────────────
export function MisProyectosPage() {
  const { proyectos, isLoading } = useMisProyectos();
  const navigate = useNavigate();
  const { eliminarProyecto, isLoading: eliminando } = useEliminarProyecto();

  const [proyectoEditando, setProyectoEditando] = useState(null);
  const [proyectoEliminando, setProyectoEliminando] = useState(null);

  const handleConfirmarEliminar = () => {
    eliminarProyecto(proyectoEliminando.id, {
      onSuccess: () => setProyectoEliminando(null),
    });
  };

  const totalProyectos = proyectos?.length || 0;

  return (
    <MypeLayout
      titulo="Mis proyectos"
      accion={{ to: "/dashboard/mype/crear", label: "Nuevo proyecto" }}
    >
      {proyectoEditando && (
        <ModalEditar
          proyecto={proyectoEditando}
          onClose={() => setProyectoEditando(null)}
        />
      )}

      {proyectoEliminando && (
        <ModalEliminar
          proyecto={proyectoEliminando}
          onConfirm={handleConfirmarEliminar}
          onClose={() => setProyectoEliminando(null)}
          isLoading={eliminando}
        />
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Hero Banner */}
        <MisProyectosHeroBanner totalProyectos={totalProyectos} />

        {/* Botón de acción rápido */}
        <motion.div
          {...fadeUp(0.1)}
          style={{
            marginBottom: 28,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Link to="/dashboard/mype/crear" style={{ textDecoration: "none" }}>
            <button
              style={{
                fontFamily: FONT,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                borderRadius: "0.75rem",
                background: "linear-gradient(135deg, #1B6FE8, #0E54C4)",
                color: "#fff",
                border: "none",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(27,111,232,0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(27,111,232,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(27,111,232,0.2)";
              }}
            >
              <Plus size={16} /> Nuevo proyecto
            </button>
          </Link>
        </motion.div>

        {/* Lista de proyectos */}
        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: 160,
                  borderRadius: "1.5rem",
                  background: "#E5E7EB",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        ) : totalProyectos === 0 ? (
          <motion.div
            {...fadeUp(0.15)}
            style={{
              textAlign: "center",
              padding: "80px 40px",
              border: "1px dashed #E5E7EB",
              borderRadius: "2rem",
              background: "#fff",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "2rem",
                background: "#F3F4F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <FolderOpen size={40} color="#D1D5DB" />
            </div>
            <h3
              style={{
                fontFamily: FONT,
                fontSize: 18,
                fontWeight: 800,
                color: "#0F1F3D",
                marginBottom: 8,
              }}
            >
              Aún no has publicado proyectos
            </h3>
            <p
              style={{
                fontFamily: FONT,
                fontSize: 13,
                color: "#9CA3AF",
                maxWidth: 400,
                margin: "0 auto 20px",
              }}
            >
              Publica tu primer proyecto y comienza a conectar con talento
              universitario.
            </p>
            <Link to="/dashboard/mype/crear">
              <button
                style={{
                  fontFamily: FONT,
                  padding: "10px 24px",
                  borderRadius: "0.75rem",
                  background: "linear-gradient(135deg, #1B6FE8, #0E54C4)",
                  color: "#fff",
                  border: "none",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Publicar mi primer proyecto
              </button>
            </Link>
          </motion.div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {proyectos.map((proyecto) => (
              <ProjectCard
                key={proyecto.id}
                proyecto={proyecto}
                onEdit={() => setProyectoEditando(proyecto)}
                onDelete={() => setProyectoEliminando(proyecto)}
                onViewPostulantes={() =>
                  navigate(
                    `/dashboard/mype/postulantes?proyecto=${proyecto.id}`,
                  )
                }
                onReviewEntregables={() =>
                  navigate(
                    `/dashboard/mype/proyectos/${proyecto.id}/entregables`,
                  )
                }
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </MypeLayout>
  );
}
