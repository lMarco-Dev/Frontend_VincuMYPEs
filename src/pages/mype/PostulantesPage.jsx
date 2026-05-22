import { useState, useRef, useEffect } from "react";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import { useMisProyectos } from "@/features/proyecto-list-mype/useMisProyectos";
import {
  usePostulaciones,
  useCambiarEstadoPostulacion,
} from "@/features/proyecto-postulaciones/usePostulaciones";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  Loader2,
  Eye,
  EyeOff,
  FileText,
  UserCheck,
  UserX,
  UserPlus,
  Briefcase,
  Calendar,
  Star,
  Award,
} from "lucide-react";

const FONT = "'Angro Std', 'Outfit', sans-serif";

/* ─── Animaciones ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ═══════════════════════════════════════════════
   HERO BANNER PARA POSTULANTES (SIN MÉTRICAS)
═══════════════════════════════════════════════ */
const PostulantesHeroBanner = () => {
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
        <div style={{ maxWidth: 600 }}>
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
            <UserPlus size={12} style={{ color: "#F59E0B" }} /> Gestión de
            Talento
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
            Conoce a tus{" "}
            <span style={{ color: "#F59E0B" }}>futuros colaboradores</span>
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
            Revisa los perfiles preseleccionados, evalúa sus propuestas y
            selecciona al talento ideal para tus proyectos tecnológicos.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   BADGE DE ESTADO PARA POSTULACIONES
═══════════════════════════════════════════════ */
function EstadoPostBadge({ estado }) {
  const map = {
    PENDIENTE: {
      bg: "#FFFBEB",
      color: "#B45309",
      border: "#FDE68A",
      label: "Pendiente",
      icon: <Clock size={10} />,
    },
    PRESELECCIONADO: {
      bg: "#EFF6FF",
      color: "#1D4ED8",
      border: "#BFDBFE",
      label: "Preseleccionado",
      icon: <Star size={10} />,
    },
    VALIDADO_MYPE: {
      bg: "#F0FDF4",
      color: "#15803D",
      border: "#BBF7D0",
      label: "Validado",
      icon: <CheckCircle size={10} />,
    },
    CONFIRMADO: {
      bg: "#ECFDF5",
      color: "#065F46",
      border: "#6EE7B7",
      label: "Confirmado",
      icon: <Award size={10} />,
    },
    RECHAZADO: {
      bg: "#FEF2F2",
      color: "#DC2626",
      border: "#FECACA",
      label: "Rechazado",
      icon: <XCircle size={10} />,
    },
    RETIRADO: {
      bg: "#F3F4F6",
      color: "#6B7280",
      border: "#E5E7EB",
      label: "Retirado",
      icon: <UserX size={10} />,
    },
    EXPIRADO: {
      bg: "#FFF7ED",
      color: "#C2410C",
      border: "#FED7AA",
      label: "Expirado",
      icon: <Clock size={10} />,
    },
  };
  const s = map[estado] ?? map.PENDIENTE;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontFamily: FONT,
        fontSize: 10,
        fontWeight: 700,
        padding: "2px 9px",
        borderRadius: 20,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {s.icon}
      {s.label}
    </span>
  );
}

/* ═══════════════════════════════════════════════
   TARJETA DE CANDIDATO (VISTA MODERNA)
═══════════════════════════════════════════════ */
function CandidateCard({ postulacion, proyectoId, verTodos, onEstadoChange }) {
  const { cambiarEstado, isLoading } = useCambiarEstadoPostulacion(proyectoId);
  const [expanded, setExpanded] = useState(false);

  const iniciales =
    postulacion.estudianteNombre
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";

  const puedeValidar = postulacion.estado === "PRESELECCIONADO";
  const puedeRechazar =
    postulacion.estado === "PRESELECCIONADO" ||
    (verTodos && postulacion.estado === "PENDIENTE");

  const handleValidar = () => {
    if (
      window.confirm(
        `¿Validar la selección de ${postulacion.estudianteNombre}? Pasa a oferta pendiente para el alumno.`,
      )
    ) {
      cambiarEstado({
        proyectoId,
        postulacionId: postulacion.id,
        estado: "VALIDADO_MYPE",
      });
      onEstadoChange?.();
    }
  };

  const handleRechazar = () => {
    if (
      window.confirm(
        `¿Rechazar a ${postulacion.estudianteNombre}? Se notificará al Administrador.`,
      )
    ) {
      cambiarEstado({
        proyectoId,
        postulacionId: postulacion.id,
        estado: "RECHAZADO",
      });
      onEstadoChange?.();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
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
      {/* Esquina decorativa según estado */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 60,
          height: 60,
          background:
            postulacion.estado === "PRESELECCIONADO"
              ? "linear-gradient(135deg, transparent 50%, #EFF6FF 50%)"
              : postulacion.estado === "VALIDADO_MYPE"
                ? "linear-gradient(135deg, transparent 50%, #F0FDF4 50%)"
                : "linear-gradient(135deg, transparent 50%, #F8FAFC 50%)",
          pointerEvents: "none",
          borderRadius: "0 1.5rem 0 0",
        }}
      />

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {/* Avatar */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "1rem",
            background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
            border: "2px solid #BFDBFE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 700, color: "#1D4ED8" }}>
            {iniciales}
          </span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header con nombre y estado */}
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
              }}
            >
              {postulacion.estudianteNombre}
            </h3>
            <EstadoPostBadge estado={postulacion.estado} />
          </div>

          {/* Fecha de postulación */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
              flexWrap: "wrap",
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
              <Calendar size={11} />
              Postuló el{" "}
              {new Date(postulacion.fechaPostulacion).toLocaleDateString(
                "es-PE",
              )}
            </span>
            {postulacion.estudianteCvUrl && (
              <a
                href={postulacion.estudianteCvUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#1B6FE8",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#06B6D4")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#1B6FE8")}
              >
                <FileText size={11} /> Ver CV
              </a>
            )}
          </div>

          {/* Mensaje de postulación */}
          <div
            style={{
              background: "#F8FAFC",
              borderRadius: "0.75rem",
              padding: "12px 14px",
              marginBottom: 12,
              border: "1px solid #E5E7EB",
              cursor: "pointer",
            }}
            onClick={() => setExpanded(!expanded)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Mensaje de postulación
              </span>
              <ChevronDown
                size={12}
                color="#9CA3AF"
                style={{
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            </div>
            <AnimatePresence>
              {expanded && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    margin: "8px 0 0 0",
                    lineHeight: 1.6,
                  }}
                >
                  {postulacion.mensajePostulacion || (
                    <span style={{ color: "#D1D5DB", fontStyle: "italic" }}>
                      Sin mensaje adicional
                    </span>
                  )}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Acciones */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
            {puedeValidar && !isLoading && (
              <button
                onClick={handleValidar}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 18px",
                  borderRadius: "0.75rem",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#15803D",
                  background: "rgba(21,128,61,0.08)",
                  border: "1px solid rgba(21,128,61,0.2)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(21,128,61,0.15)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(21,128,61,0.08)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <UserCheck size={14} /> Validar candidato
              </button>
            )}

            {puedeRechazar && !isLoading && (
              <button
                onClick={handleRechazar}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 18px",
                  borderRadius: "0.75rem",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#DC2626",
                  background: "rgba(220,38,38,0.06)",
                  border: "1px solid rgba(220,38,38,0.15)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(220,38,38,0.1)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(220,38,38,0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <UserX size={14} /> Rechazar
              </button>
            )}

            {isLoading && (
              <Loader2 size={16} className="animate-spin text-slate-400" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   SECCIÓN DE PROYECTO CON CANDIDATOS
═══════════════════════════════════════════════ */
function ProjectSection({ proyecto, verTodos }) {
  const [expanded, setExpanded] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const { postulaciones, isLoading } = usePostulaciones(proyecto.id);

  const preseleccionados = postulaciones.filter(
    (p) => p.estado === "PRESELECCIONADO",
  );
  const confirmados = postulaciones.filter((p) => p.estado === "CONFIRMADO");
  const validados = postulaciones.filter((p) => p.estado === "VALIDADO_MYPE");

  const postulantesVisibles = verTodos
    ? postulaciones
    : postulaciones.filter((p) =>
        ["PRESELECCIONADO", "CONFIRMADO", "VALIDADO_MYPE"].includes(p.estado),
      );

  if (!isLoading && postulaciones.length === 0 && !verTodos) return null;

  const handleEstadoChange = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <motion.div
      key={refreshKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: "1.5rem",
        overflow: "hidden",
        marginBottom: 20,
      }}
    >
      {/* Cabecera del proyecto */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 24px",
          background: "linear-gradient(135deg, #F8FAFC, #fff)",
          border: "none",
          cursor: "pointer",
          transition: "all 0.2s",
          fontFamily: FONT,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#F3F4F6")}
        onMouseLeave={(e) =>
          (e.currentTarget.style.background =
            "linear-gradient(135deg, #F8FAFC, #fff)")
        }
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "1rem",
              background: "#EFF6FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Briefcase size={20} color="#1B6FE8" />
          </div>
          <div style={{ textAlign: "left" }}>
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#0F1F3D",
                margin: 0,
              }}
            >
              {proyecto.titulo}
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 4,
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
                <Calendar size={11} />
                {proyecto.fechaLimite
                  ? `Límite: ${new Date(proyecto.fechaLimite).toLocaleDateString("es-PE")}`
                  : "Sin fecha límite"}
              </span>
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
                  <Users size={11} />
                  {proyecto.cupos} cupo{proyecto.cupos > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {confirmados.length > 0 && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                background: "#ECFDF5",
                color: "#065F46",
                border: "1px solid #6EE7B7",
                padding: "4px 10px",
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Award size={10} />
              {confirmados.length} confirmado{confirmados.length > 1 ? "s" : ""}
            </span>
          )}
          {preseleccionados.length > 0 && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                background: "rgba(245,158,11,0.1)",
                color: "#D97706",
                border: "1px solid rgba(245,158,11,0.2)",
                padding: "4px 10px",
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Star size={10} />
              {preseleccionados.length} por validar
            </span>
          )}
          {validados.length > 0 && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                background: "#F0FDF4",
                color: "#059669",
                border: "1px solid #BBF7D0",
                padding: "4px 10px",
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <UserCheck size={10} />
              {validados.length} validados
            </span>
          )}
          <ChevronDown
            size={18}
            color="#9CA3AF"
            style={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        </div>
      </button>

      {/* Contenido expandible */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 24px 24px 24px" }}>
              {isLoading ? (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        height: 140,
                        borderRadius: "1rem",
                        background: "#F3F4F6",
                        animation: "pulse 1.5s ease-in-out infinite",
                      }}
                    />
                  ))}
                </div>
              ) : postulantesVisibles.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "48px 24px",
                    background: "#F8FAFC",
                    borderRadius: "1rem",
                    border: "1px dashed #E5E7EB",
                  }}
                >
                  <UserPlus
                    size={32}
                    color="#D1D5DB"
                    style={{ marginBottom: 12 }}
                  />
                  <p
                    style={{ fontFamily: FONT, fontSize: 13, color: "#9CA3AF" }}
                  >
                    No hay candidatos en esta sección
                  </p>
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {postulantesVisibles.map((p) => (
                    <CandidateCard
                      key={p.id}
                      postulacion={p}
                      proyectoId={proyecto.id}
                      verTodos={verTodos}
                      onEstadoChange={handleEstadoChange}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   PÁGINA PRINCIPAL DE POSTULANTES
═══════════════════════════════════════════════ */
export function PostulantesPage() {
  const { proyectos, isLoading } = useMisProyectos();
  const [verTodos, setVerTodos] = useState(false);

  const proyectosActivos = proyectos.filter(
    (p) => p.estado === "PENDIENTE" || p.estado === "EN_DESARROLLO",
  );

  return (
    <MypeLayout titulo="Gestión de Postulantes">
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Hero Banner sin métricas */}
        <PostulantesHeroBanner />

        {/* Header con toggle de vista */}
        <motion.div
          {...fadeUp(0.1)}
          style={{
            marginBottom: 24,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={() => setVerTodos(!verTodos)}
            style={{
              fontFamily: FONT,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              padding: "10px 20px",
              borderRadius: "0.75rem",
              transition: "all 0.2s",
              ...(verTodos
                ? {
                    background: "rgba(27,111,232,0.08)",
                    color: "#1B6FE8",
                    border: "1px solid rgba(27,111,232,0.2)",
                  }
                : {
                    background: "#F8FAFC",
                    color: "#6B7280",
                    border: "1px solid #E5E7EB",
                  }),
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = verTodos
                ? "rgba(27,111,232,0.14)"
                : "#F3F4F6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = verTodos
                ? "rgba(27,111,232,0.08)"
                : "#F8FAFC";
            }}
          >
            {verTodos ? (
              <>
                <EyeOff size={14} /> Modo Bandeja de Entrada
              </>
            ) : (
              <>
                <Eye size={14} /> Ver Historial Completo
              </>
            )}
          </button>
        </motion.div>

        {/* Contenido principal */}
        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: 100,
                  borderRadius: "1.5rem",
                  background: "#E5E7EB",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        ) : proyectos.length === 0 ? (
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
              <Briefcase size={40} color="#D1D5DB" />
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
              No tienes proyectos creados
            </h3>
            <p
              style={{
                fontFamily: FONT,
                fontSize: 13,
                color: "#9CA3AF",
                maxWidth: 400,
                margin: "0 auto",
              }}
            >
              Publica tu primer proyecto para comenzar a recibir postulaciones
              de estudiantes talentosos.
            </p>
          </motion.div>
        ) : proyectosActivos.length === 0 ? (
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
              <UserPlus size={40} color="#D1D5DB" />
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
              No hay proyectos activos
            </h3>
            <p
              style={{
                fontFamily: FONT,
                fontSize: 13,
                color: "#9CA3AF",
                maxWidth: 400,
                margin: "0 auto",
              }}
            >
              Tus proyectos deben estar en estado "Publicado" para recibir
              postulaciones de estudiantes.
            </p>
          </motion.div>
        ) : (
          <div>
            {proyectosActivos.map((proyecto) => (
              <ProjectSection
                key={proyecto.id}
                proyecto={proyecto}
                verTodos={verTodos}
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
