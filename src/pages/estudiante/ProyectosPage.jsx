import React, { useRef, useState, useEffect, useMemo } from "react";
import { useProyectos } from "../../features/proyectos-list/useProyectos";
import { useMisPostulaciones } from "../../features/postulaciones-list/useMisPostulaciones";
import { usePerfil } from "../../features/perfil/usePerfil";
import {
  ArrowRight,
  Search,
  Building2,
  X,
  MapPin,
  Users,
  CheckCircle2,
  Sparkles,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Globe,
  Server,
  Wifi,
  Monitor,
  Send,
  SlidersHorizontal,
  Filter,
  UserPlus,
  UserCheck,
  AlertCircle,
  TrendingUp,
  Zap,
  Eye,
  Star,
  Hash,
  Target,
  GraduationCap,
  Award,
  Bell,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import PostularButton from "../../features/proyecto-postular/PostularButton";

/* ─── Variantes de animación ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ─── Colores de área ─── */
const AREA_STYLES = {
  WEB: { bg: "#eff6ff", color: "#1B6FE8" },
  DATA: { bg: "#f0fdf4", color: "#059669" },
  UX: { bg: "#f5f3ff", color: "#8B5CF6" },
  INFRAESTRUCTURA: { bg: "#fef3c7", color: "#d97706" },
  SOPORTE_TI: { bg: "#fff1f2", color: "#e11d48" },
  REDES: { bg: "#f0f9ff", color: "#0284c7" },
  DEFAULT: { bg: "#eff6ff", color: "#1B6FE8" },
};

const getAreaStyle = (area = "") => {
  const key = area.toUpperCase().replace(/[\s_]/g, "_");
  return AREA_STYLES[key] || AREA_STYLES.DEFAULT;
};

const getGradient = (area = "") => {
  const key = area.toUpperCase().replace(/[\s_]/g, "_");
  const gradients = {
    WEB: "linear-gradient(135deg, #1B6FE8, #3b82f6)",
    DATA: "linear-gradient(135deg, #059669, #10b981)",
    UX: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
    INFRAESTRUCTURA: "linear-gradient(135deg, #d97706, #f59e0b)",
    SOPORTE_TI: "linear-gradient(135deg, #e11d48, #f43f5e)",
    REDES: "linear-gradient(135deg, #0284c7, #38bdf8)",
  };
  return gradients[key] || gradients.WEB;
};

const getAreaIcon = (area = "") => {
  const key = area.toUpperCase().replace(/[\s_]/g, "_");
  const icons = {
    INFRAESTRUCTURA: <Server size={22} />,
    SOPORTE_TI: <Monitor size={22} />,
    REDES: <Wifi size={22} />,
    WEB: <Globe size={22} />,
  };
  return icons[key] || <Briefcase size={22} />;
};

/* ─── Función para calcular estado de vacantes ─── */
const getVacancyStatus = (proyecto, postulacionesCount = 0) => {
  const totalVacantes = proyecto.cupos || 1;
  const vacantesDisponibles = totalVacantes - postulacionesCount;
  
  if (vacantesDisponibles <= 0) {
    return {
      status: "complete",
      message: "¡Equipo completo! Todas las vacantes han sido cubiertas",
      icon: <UserCheck size={14} />,
      color: "#059669",
      bg: "#ecfdf5",
      border: "#a7f3d0",
      remaining: 0
    };
  }
  
  if (vacantesDisponibles === 1) {
    return {
      status: "urgent",
      message: "¡Última oportunidad! Solo queda 1 vacante disponible",
      icon: <Zap size={14} />,
      color: "#dc2626",
      bg: "#fef2f2",
      border: "#fecaca",
      remaining: 1
    };
  }
  
  if (vacantesDisponibles <= 3) {
    return {
      status: "limited",
      message: `¡Apresúrate! Solo quedan ${vacantesDisponibles} vacantes`,
      icon: <AlertCircle size={14} />,
      color: "#f59e0b",
      bg: "#fffbeb",
      border: "#fde68a",
      remaining: vacantesDisponibles
    };
  }
  
  return {
    status: "available",
    message: `${vacantesDisponibles} vacantes disponibles`,
    icon: <UserPlus size={14} />,
    color: "#1B6FE8",
    bg: "#eff6ff",
    border: "#bfdbfe",
    remaining: vacantesDisponibles
  };
};

/* ═══════════════════════════════════════════════
   HERO BANNER - COMPACTO Y ELEGANTE
═══════════════════════════════════════════════ */
const ExploreHero = () => {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const [badgeText, setBadgeText] = useState("+28 proyectos activos");
  const [badgeColor, setBadgeColor] = useState("#67d4f8");

  const messages = [
    { text: "+28 proyectos activos", color: "#67d4f8" },
    { text: "+12 empresas registradas", color: "#f59e0b" },
    { text: "+45 vacantes disponibles", color: "#4ade80" },
    { text: "3 proyectos urgentes", color: "#f43f5e" },
    { text: "Nuevas oportunidades cada semana", color: "#8b5cf6" },
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setBadgeText(messages[index].text);
      setBadgeColor(messages[index].color);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;

    const ctx = canvas.getContext("2d");
    let W, H, animId;
    const mouse = { x: -999, y: -999 };

    const resize = () => {
      W = canvas.width = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(hero);

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -999;
      mouse.y = -999;
    };

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);

    class WaveParticle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H * 0.6;
        this.size = Math.random() * 2 + 0.8;
        this.speed = Math.random() * 0.5 + 0.2;
        this.opacity = Math.random() * 0.3 + 0.15;
        this.hue = Math.random() > 0.5 ? 210 : 195;
      }
      update() {
        this.y -= this.speed;
        this.opacity -= 0.002;
        if (this.y < 0 || this.opacity <= 0) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = `hsl(${this.hue}, 90%, 65%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const particles = Array.from({ length: 70 }, () => new WaveParticle());

    const animate = () => {
      ctx.fillStyle = "rgba(13, 27, 53, 0.1)";
      ctx.fillRect(0, 0, W, H);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      ctx.strokeStyle = "rgba(103, 212, 248, 0.06)";
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i += 4) {
        for (let j = i + 1; j < particles.length; j += 5) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
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
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <motion.div
      ref={heroRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        background:
          "linear-gradient(135deg, #0d1b35 0%, #1e3a5f 50%, #1B6FE8 100%)",
        padding: "32px 36px",
        color: "#fff",
        marginBottom: 20,
        minHeight: 140,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.7,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,0.1)",
              padding: "4px 14px",
              borderRadius: 30,
              fontSize: 11,
              fontWeight: 600,
              marginBottom: 16,
              backdropFilter: "blur(8px)",
            }}
          >
            <Sparkles size={12} /> OPORTUNIDADES EN TIEMPO REAL
          </motion.div>

          <h1
            style={{
              fontSize: "clamp(22px, 2.5vw, 28px)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              marginBottom: 6,
            }}
          >
            Descubre tu próximo reto profesional
          </h1>

          <p
            style={{
              fontSize: 13,
              opacity: 0.8,
              lineHeight: 1.5,
              fontWeight: 400,
              maxWidth: 400,
            }}
          >
            Proyectos reales con empresas locales. Construye experiencia
            mientras estudias.
          </p>
        </div>

        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3.5, repeat: Infinity }}
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
            padding: "8px 18px",
            borderRadius: 40,
            fontSize: 12,
            fontWeight: 600,
            border: `1px solid ${badgeColor}40`,
            color: badgeColor,
            flexShrink: 0,
          }}
        >
          {badgeText}
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   PROJECT CARD - COMPACTA ESTILO LINKEDIN
═══════════════════════════════════════════════ */
const ProjectCardLinkedIn = ({ proyecto, onClick, yaPostulo, isSelected, postulacionesCount }) => {
  const area = proyecto.areaSistemas?.replace(/_/g, " ") || "SISTEMAS";
  const { bg, color } = getAreaStyle(area);
  const vacancyStatus = getVacancyStatus(proyecto, postulacionesCount);

  const isSoporteTI = area === "SOPORTE TI";
  const displayColor = isSoporteTI ? "#1B6FE8" : color;
  const displayBg = isSoporteTI ? "#eff6ff" : bg;

  return (
    <motion.div
      whileHover={{ backgroundColor: "#f8fafc" }}
      onClick={onClick}
      style={{
        background: isSelected ? "#f0f7ff" : "#fff",
        border: isSelected ? "1px solid #bfdbfe" : "1px solid transparent",
        borderBottom: "1px solid #f1f5f9",
        borderLeft: isSelected
          ? `3px solid ${displayColor}`
          : "3px solid transparent",
        padding: "12px 16px",
        cursor: "pointer",
        transition: "all 0.12s ease",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 2,
            }}
          >
            <h3
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#0f172a",
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                paddingRight: 6,
              }}
            >
              {proyecto.titulo}
            </h3>
            <div style={{ display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }}>
              {yaPostulo && (
                <span
                  style={{
                    background: "#f0fdf4",
                    color: "#059669",
                    padding: "1px 7px",
                    borderRadius: 10,
                    fontSize: 9,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <CheckCircle2 size={9} />
                  Postulado
                </span>
              )}
              {/* Badge de vacantes */}
              <span
                style={{
                  background: vacancyStatus.bg,
                  color: vacancyStatus.color,
                  padding: "1px 7px",
                  borderRadius: 10,
                  fontSize: 9,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  border: `1px solid ${vacancyStatus.border}`,
                }}
              >
                {vacancyStatus.icon}
                {vacancyStatus.remaining > 0 ? `${vacancyStatus.remaining} vacante${vacancyStatus.remaining !== 1 ? 's' : ''}` : 'Completo'}
              </span>
            </div>
          </div>

          <p
            style={{
              fontSize: 12,
              color: "#64748b",
              margin: "0 0 4px 0",
              fontWeight: 500,
            }}
          >
            {proyecto.mypeNombre || "Empresa"}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "#94a3b8",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <MapPin size={10} /> {proyecto.ubicacion || "Cajamarca"}
            </span>
            <span
              style={{
                background: displayBg,
                color: displayColor,
                padding: "1px 8px",
                borderRadius: 10,
                fontSize: 10,
                fontWeight: 600,
              }}
            >
              {area}
            </span>
            <span
              style={{
                fontSize: 11,
                color: "#94a3b8",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Calendar size={10} /> {proyecto.fechaLimite}
            </span>
          </div>

          <p
            style={{
              fontSize: 11,
              color: "#94a3b8",
              margin: "6px 0 0 0",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {proyecto.descripcion}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   PANEL DE DETALLE - MEJORADO
═══════════════════════════════════════════════ */
const ProjectDetailPanel = ({
  proyecto,
  yaPostulo,
  haSuperadoLimite,
  limiteProyectos = 1,
  onClose,
  postulacionesCount = 0,
}) => {
  if (!proyecto) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          padding: 40,
          textAlign: "center",
          color: "#9ca3af",
        }}
      >
        <Briefcase size={40} style={{ margin: "0 auto 14px", opacity: 0.25 }} />
        <h3
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#6b7280",
            marginBottom: 6,
          }}
        >
          Selecciona un proyecto
        </h3>
        <p style={{ fontSize: 12, color: "#9ca3af" }}>
          Haz clic en un proyecto para ver sus detalles y postularte
        </p>
      </div>
    );
  }

  const area = proyecto.areaSistemas?.replace(/_/g, " ") || "SISTEMAS";
  const { bg, color } = getAreaStyle(area);
  const vacancyStatus = getVacancyStatus(proyecto, postulacionesCount);
  const totalVacantes = proyecto.cupos || 1;
  const esProyectoCompleto = vacancyStatus.status === "complete";

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        position: "sticky",
        top: 20,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          height: 4,
          background: "linear-gradient(90deg, #1B6FE8, #3b82f6, #60a5fa)",
          width: "100%",
        }}
      />

      <div
        style={{
          padding: "24px 20px 20px",
          position: "relative",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "#f1f5f9",
            border: "none",
            borderRadius: "50%",
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#64748b",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#e2e8f0";
            e.currentTarget.style.color = "#0f172a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f1f5f9";
            e.currentTarget.style.color = "#64748b";
          }}
        >
          <X size={14} />
        </button>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: area === "SOPORTE TI" ? "#eff6ff" : bg,
            color: area === "SOPORTE TI" ? "#1B6FE8" : color,
            padding: "4px 12px",
            borderRadius: 16,
            fontSize: 11,
            fontWeight: 700,
            marginBottom: 14,
            letterSpacing: "0.02em",
          }}
        >
          {area}
        </div>

        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#0f172a",
            lineHeight: 1.3,
            marginBottom: 6,
          }}
        >
          {proyecto.titulo}
        </h2>

       <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "#64748b",
        }}
      >
  <span style={{ fontWeight: 500 }}>
    {proyecto.mypeNombre || "Empresa"}
  </span>
</div>
      </div>

      <div style={{ padding: 20 }}>
       

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
            marginBottom: 20,
          }}
        >
          {[
            {
              label: "Fecha límite",
              value: proyecto.fechaLimite,
              icon: <Calendar size={13} />,
            },
            {
              label: "Cupos totales",
              value: totalVacantes,
              icon: <Users size={13} />,
            },
            {
              label: "Ubicación",
              value: proyecto.ubicacion || "Cajamarca",
              icon: <MapPin size={13} />,
            },
          ].map((metric, idx) => (
            <div
              key={idx}
              style={{
                background: "#f8fafc",
                padding: "10px 8px",
                borderRadius: 8,
                border: "1px solid #dbeafe",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: "#020f21",
                  fontWeight: 500,
                  marginBottom: 4,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {metric.label}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#1e40af",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                }}
              >
                {metric.icon}
                {metric.value}
              </div>
            </div>
          ))}
        </div>

        {/* Barra de progreso de vacantes - NUEVO */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>
              Progreso de vacantes
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, color: vacancyStatus.color }}>
              {postulacionesCount}/{totalVacantes} ocupadas
            </span>
          </div>
          <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(postulacionesCount / totalVacantes) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{
                height: "100%",
                background: esProyectoCompleto
                  ? "linear-gradient(90deg, #059669, #10b981)"
                  : postulacionesCount / totalVacantes > 0.7
                  ? "linear-gradient(90deg, #f59e0b, #d97706)"
                  : "linear-gradient(90deg, #1B6FE8, #3b82f6)",
                borderRadius: 3,
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <h4
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#000000",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Descripción
          </h4>
          <p
            style={{
              fontSize: 13,
              color: "#475569",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {proyecto.descripcion}
          </p>
        </div>

        {proyecto.objetivo && (
          <div style={{ marginBottom: 20 }}>
            <h4
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#000000",
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Objetivo
            </h4>
            <p
              style={{
                fontSize: 13,
                color: "#475569",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {proyecto.objetivo}
            </p>
          </div>
        )}

        {/* Requisitos del proyecto - NUEVO */}
        <div style={{ marginBottom: 20 }}>
          <h4
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#000000",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
           
            Habilidades requeridas
          </h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {[
              "Trabajo en equipo",
              "Comunicación",
              "Proactividad",
              "Responsabilidad",
            ].map((skill, idx) => (
              <span
                key={idx}
                style={{
                  background: "#f1f5f9",
                  color: "#475569",
                  padding: "3px 10px",
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 500,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            marginBottom: 20,
            background: "#f8fafc",
            borderRadius: 10,
            border: "1px solid #dbeafe",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 14px",
              borderBottom: "1px solid #dbeafe",
              background: "#eff6ff",
            }}
          >
           <h4
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#000000",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Sobre la empresa
          </h4>
          </div>
          <div style={{ padding: "14px" }}>
            <div style={{ marginBottom: 8 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1e293b",
                  marginBottom: 4,
                }}
              >
                {proyecto.mypeNombre || "Empresa"}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <MapPin size={10} style={{ color: "#3b82f6" }} />
                {proyecto.ubicacion || "Cajamarca"}
              </div>
            </div>
            {proyecto.mypeDescripcion && (
              <p
                style={{
                  fontSize: 12,
                  color: "#64748b",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {proyecto.mypeDescripcion}
              </p>
            )}
          </div>
        </div>

        <div style={{ marginTop: 4 }}>
          {esProyectoCompleto ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: "#ecfdf5",
                border: "2px solid #a7f3d0",
                borderRadius: 10,
                padding: "16px",
                textAlign: "center",
              }}
            >
              <UserCheck size={24} style={{ color: "#059669", marginBottom: 8 }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: "#059669", marginBottom: 4 }}>
                ¡Proyecto completado!
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                Todas las vacantes han sido cubiertas. ¡Sigue explorando otras oportunidades!
              </div>
            </motion.div>
          ) : (
            <>
              <PostularButton
                proyectoId={proyecto.id}
                yaPostulo={yaPostulo}
                disabled={haSuperadoLimite && !yaPostulo}
              />

              {haSuperadoLimite && !yaPostulo && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    fontSize: 10,
                    color: "#64748b",
                    marginTop: 6,
                    textAlign: "center",
                    background: "#eff6ff",
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: "1px solid #dbeafe",
                  }}
                >
                  Has alcanzado el límite de {limiteProyectos} proyecto{limiteProyectos !== 1 ? 's' : ''} activo{limiteProyectos !== 1 ? 's' : ''}
                </motion.p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   PAGINACIÓN
═══════════════════════════════════════════════ */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        padding: "12px 0",
        borderTop: "1px solid #f1f5f9",
      }}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: "5px 10px",
          borderRadius: 6,
          border: "1px solid #e5e7eb",
          background: "#fff",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
          opacity: currentPage === 1 ? 0.4 : 1,
          display: "flex",
          alignItems: "center",
          gap: 3,
          fontSize: 12,
          fontWeight: 500,
          color: "#374151",
        }}
      >
        <ChevronLeft size={13} /> Ant
      </button>

      {getVisiblePages().map((page, index) =>
        page === "..." ? (
          <span
            key={`dots-${index}`}
            style={{ padding: "5px 6px", color: "#9ca3af", fontSize: 12 }}
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              padding: "5px 10px",
              borderRadius: 6,
              border:
                currentPage === page
                  ? "1px solid #1B6FE8"
                  : "1px solid transparent",
              background: currentPage === page ? "#eff6ff" : "transparent",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: currentPage === page ? 700 : 500,
              color: currentPage === page ? "#1B6FE8" : "#374151",
              minWidth: 32,
            }}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: "5px 10px",
          borderRadius: 6,
          border: "1px solid #e5e7eb",
          background: "#fff",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          opacity: currentPage === totalPages ? 0.4 : 1,
          display: "flex",
          alignItems: "center",
          gap: 3,
          fontSize: 12,
          fontWeight: 500,
          color: "#374151",
        }}
      >
        Sig <ChevronRight size={13} />
      </button>
    </div>
  );
};


/* ═══════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════ */
const ITEMS_PER_PAGE = 10;

const ProyectosPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const { data: proyectosData, isLoading, refetch } = useProyectos(0, 1000);
  const { data: postulaciones } = useMisPostulaciones();
  const { data: userProfile } = usePerfil();

  const proyectos = proyectosData?.content || [];

    

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      refetch();
      setLastRefresh(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, refetch]);

  const postulacionesPorProyecto = useMemo(() => {
    const map = {};
    postulaciones?.forEach((p) => {
      if (!map[p.proyectoId]) {
        map[p.proyectoId] = [];
      }
      map[p.proyectoId].push(p);
    });
    return map;
  }, [postulaciones]);

  const yaPostuloMap = useMemo(() => {
    const map = {};
    postulaciones?.forEach((p) => {
      map[p.proyectoId] = true;
    });
    return map;
  }, [postulaciones]);

  const proyectosActivos = useMemo(() => {
    return (
      postulaciones?.filter(
        (p) => p.estado === "CONFIRMADO" || p.estado === "ACEPTADO" || p.estado === "Aceptado",
      ) || []
    );
  }, [postulaciones]);

  const limiteProyectos = userProfile?.limiteProyectos ?? 1;
  const haSuperadoLimite = proyectosActivos.length >= limiteProyectos;

  const areasFiltro = [
    { value: "", label: "Todas las áreas" },
    { value: "DESARROLLO_WEB", label: "Desarrollo Web" },
    { value: "DATA", label: "Ciencia de Datos" },
    { value: "UX", label: "Diseño UX/UI" },
    { value: "INFRAESTRUCTURA", label: "Infraestructura" },
    { value: "SOPORTE_TI", label: "Soporte TI" },
    { value: "REDES", label: "Redes" },
  ];

  const filteredProyectos = useMemo(() => {
    return proyectos.filter((proyecto) => {
      const matchesSearch =
        !searchTerm ||
        proyecto.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proyecto.descripcion
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        proyecto.mypeNombre?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesArea =
        !selectedArea ||
        proyecto.areaSistemas?.toUpperCase().includes(selectedArea);
      return matchesSearch && matchesArea;
    });
  }, [proyectos, searchTerm, selectedArea]);
    // ✅ Detectar proyecto desde URL y seleccionarlo automáticamente
  const searchParams = new URLSearchParams(window.location.search);
  const selectedIdFromUrl = searchParams.get('selected');

    useEffect(() => {
    if (!isLoading && selectedIdFromUrl && proyectos.length > 0) {
      const proyectoFromUrl = proyectos.find(p => p.id === Number(selectedIdFromUrl));
      if (proyectoFromUrl) {
        // Limpiar filtros para asegurar que el proyecto sea visible
        setSearchTerm('');
        setSelectedArea('');
        
        // Seleccionar el proyecto
        setSelectedProyecto(proyectoFromUrl);
        
        // Buscar en qué página está dentro de TODOS los proyectos (sin filtrar)
        const allProyectos = proyectos;
        const index = allProyectos.findIndex(p => p.id === Number(selectedIdFromUrl));
        if (index >= 0) {
          const page = Math.floor(index / ITEMS_PER_PAGE) + 1;
          setCurrentPage(page);
        }
        
        // Scroll después de que se renderice
        setTimeout(() => {
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }, 800);
      }
    }
  }, [isLoading, selectedIdFromUrl, proyectos.length]);

  const totalPages = Math.ceil(filteredProyectos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProyectos = filteredProyectos.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Resetear página cuando cambian filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedArea]);

    // Seleccionar primer proyecto cuando cambia la lista (SOLO si no hay proyecto desde URL)
  useEffect(() => {
    if (paginatedProyectos.length > 0 && !selectedProyecto && !selectedIdFromUrl) {
      setSelectedProyecto(paginatedProyectos[0]);
    }
  }, [paginatedProyectos, selectedProyecto, selectedIdFromUrl]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const currentStillExists = paginatedProyectos.find(
      (p) => p.id === selectedProyecto?.id,
    );
    if (!currentStillExists && paginatedProyectos.length > 0) {
      setSelectedProyecto(paginatedProyectos[0]);
    }
  };

  const getPostulacionesCount = (proyectoId) => {
    return postulacionesPorProyecto[proyectoId]?.length || 0;
  };

  return (
    <div
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        background: '#f8fafc',
        minHeight: "100vh",
        padding: "20px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      {/* Top Bar */} 
      <motion.div
        {...fadeUp(0)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#0f172a",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Proyectos disponibles
            <motion.span
              animate={{ rotate: autoRefresh ? 360 : 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{ display: "inline-flex" }}
            >
              <RefreshCw size={14} style={{ color: autoRefresh ? "#059669" : "#94a3b8" }} />
            </motion.span>
          </h1>
          <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0 0" }}>
            {filteredProyectos.length} proyecto
            {filteredProyectos.length !== 1 ? "s" : ""} encontrado
            {filteredProyectos.length !== 1 ? "s" : ""}
            {autoRefresh && (
              <span style={{ color: "#059669", marginLeft: 8 }}>
                • Actualización automática activada
              </span>
            )}
          </p>
        </div>
       
      </motion.div>

      {/* Hero Banner */}
      <ExploreHero />

      

      {/* Barra de búsqueda */}
      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          border: "1px solid #e2e8f0",
          padding: "10px 14px",
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Search size={16} style={{ color: "#94a3b8", flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Buscar por título, empresa o palabra clave..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: "8px 0",
            border: "none",
            background: "transparent",
            fontSize: 13,
            fontWeight: 400,
            outline: "none",
            color: "#1e293b",
          }}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              padding: 3,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={14} />
          </button>
        )}
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "7px 14px",
            borderRadius: 20,
            border: `1px solid ${showFilters || selectedArea ? "#1B6FE8" : "#e2e8f0"}`,
            background: showFilters || selectedArea ? "#eff6ff" : "#fff",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 500,
            color: showFilters || selectedArea ? "#1B6FE8" : "#475569",
            whiteSpace: "nowrap",
            transition: "all 0.15s",
          }}
        >
          <SlidersHorizontal size={13} />
          Filtros
          {selectedArea && (
            <span
              style={{
                background: "#1B6FE8",
                color: "#fff",
                borderRadius: "50%",
                width: 16,
                height: 16,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                fontWeight: 700,
              }}
            >
              1
            </span>
          )}
        </button>
      </div>

      {/* Panel de filtros */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden", marginBottom: 14 }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                padding: 14,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 10,
                }}
              >
                Filtrar por área
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {areasFiltro.map((area) => (
                  <button
                    key={area.value}
                    onClick={() => setSelectedArea(area.value)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 500,
                      border:
                        selectedArea === area.value
                          ? "2px solid #1B6FE8"
                          : "1px solid #e2e8f0",
                      background:
                        selectedArea === area.value ? "#eff6ff" : "#fff",
                      color:
                        selectedArea === area.value ? "#1B6FE8" : "#475569",
                      cursor: "pointer",
                      transition: "all 0.12s",
                    }}
                  >
                    {area.label}
                  </button>
                ))}
              </div>
              {selectedArea && (
                <button
                  onClick={() => setSelectedArea("")}
                  style={{
                    marginTop: 10,
                    fontSize: 11,
                    color: "#dc2626",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Limpiar filtro
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layout dos columnas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "490px 1fr",
          gap: 14,
          alignItems: "start",
        }}
      >
        {/* Lista de proyectos */}
        <div
          style={{
            background: "#fff",
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "10px 16px",
              borderBottom: "1px solid #f1f5f9",
              fontSize: 12,
              fontWeight: 600,
              color: "#475569",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              {filteredProyectos.length} resultado
              {filteredProyectos.length !== 1 ? "s" : ""}
            </span>
            {totalPages > 1 && (
              <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>
                Pág. {currentPage}/{totalPages}
              </span>
            )}
          </div>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: 50 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  border: "3px solid #e2e8f0",
                  borderTopColor: "#1B6FE8",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 14px",
                }}
              />
              <p style={{ color: "#64748b", fontSize: 13 }}>
                Cargando proyectos...
              </p>
            </div>
          ) : paginatedProyectos.length === 0 ? (
            <div style={{ textAlign: "center", padding: 50 }}>
              <Search
                size={32}
                style={{ margin: "0 auto 12px", color: "#cbd5e1" }}
              />
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#475569",
                  marginBottom: 4,
                }}
              >
                Sin resultados
              </h3>
              <p style={{ fontSize: 12, color: "#94a3b8" }}>
                Intenta ajustar los filtros
              </p>
            </div>
          ) : (
            <div>
              {paginatedProyectos.map((proyecto) => (
                <ProjectCardLinkedIn
                  key={proyecto.id}
                  proyecto={proyecto}
                  onClick={() => setSelectedProyecto(proyecto)}
                  yaPostulo={!!yaPostuloMap[proyecto.id]}
                  isSelected={selectedProyecto?.id === proyecto.id}
                  postulacionesCount={getPostulacionesCount(proyecto.id)}
                />
              ))}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Panel de detalle */}
        <div>
          <ProjectDetailPanel
            proyecto={selectedProyecto}
            yaPostulo={
              selectedProyecto ? !!yaPostuloMap[selectedProyecto.id] : false
            }
            haSuperadoLimite={haSuperadoLimite}
            limiteProyectos={limiteProyectos}
            onClose={() => setSelectedProyecto(null)}
            postulacionesCount={
              selectedProyecto ? getPostulacionesCount(selectedProyecto.id) : 0
            }
          />
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProyectosPage;