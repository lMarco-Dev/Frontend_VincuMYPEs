import React, { useRef, useState, useEffect, useMemo } from "react";
import { useProyectos } from "../../features/proyectos-list/useProyectos";
import { useMisPostulaciones } from "../../features/postulaciones-list/useMisPostulaciones";
import { usePerfil } from "../../features/perfil/usePerfil";
import { httpClient } from "../../shared/api/httpClient";
import RatingDisplay from "../../features/calificaciones/RatingDisplay";
import {
  Search,
  X,
  MapPin,
  Users,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Globe,
  Server,
  Wifi,
  Monitor,
  SlidersHorizontal,
  UserPlus,
  UserCheck,
  AlertCircle,
  Zap,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import PostularButton from "../../features/proyecto-postular/PostularButton";

const FONT = "'Angro Std', 'Outfit', sans-serif";

// ═══════════════════════════════════════════════
// CONSTANTES DE ESTADOS
// ═══════════════════════════════════════════════
const ESTADOS_POSTULACION_ACTIVA = ['CONFIRMADO', 'ACEPTADO', 'Aceptado'];
const ESTADOS_PROYECTO_ACTIVOS = ['PENDIENTE', 'EN_DESARROLLO', 'EN_REVISION'];
const ESTADOS_PROYECTO_INACTIVOS = ['COMPLETADO', 'FINALIZADO', 'CANCELADO', 'ARCHIVADO'];

/* ─── Colores de área ─── */
const AREA_STYLES = {
  WEB: { bg: "#eff6ff", color: "#1B6FE8" },
  DATA: { bg: "#f0fdf4", color: "#059669" },
  UX: { bg: "#f5f3ff", color: "#8B5CF6" },
  INFRAESTRUCTURA: { bg: "#fef3c7", color: "#d97706" },
  SOPORTE_TI: { bg: "#eff6ff", color: "#1B6FE8" },
  REDES: { bg: "#f0f9ff", color: "#0284c7" },
  DEFAULT: { bg: "#eff6ff", color: "#1B6FE8" },
};

const getAreaStyle = (area = "") => {
  const key = area.toUpperCase().replace(/[\s_]/g, "_");
  return AREA_STYLES[key] || AREA_STYLES.DEFAULT;
};

/* ─── Avatar de MYPE: foto si existe, si no, inicial con color por hash ───
   TODO backend: cuando la MYPE pueda subir su logo desde su perfil,
   exponer la URL en `proyecto.mypeFotoUrl` (o el campo que se acuerde
   en el endpoint de listado/detalle de proyectos). Este componente ya
   está listo para recibirla — solo falta que el campo llegue con datos. */
const AVATAR_PALETTE = [
  "#1B6FE8", "#059669", "#8B5CF6", "#D97706",
  "#0284C7", "#DB2777", "#65A30D", "#DC2626",
];

const getAvatarColor = (seed = "") => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
};

const MypeAvatar = ({ nombre, fotoUrl, size = 40 }) => {
  const inicial = (nombre || "E").trim().charAt(0).toUpperCase();
  const color = getAvatarColor(nombre || "Empresa");

  if (fotoUrl) {
    return (
      <img
        src={fotoUrl}
        alt={nombre || "Empresa"}
        style={{ width: size, height: size, borderRadius: "10px", objectFit: "cover", flexShrink: 0, border: "1px solid #F1F5F9" }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "10px",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `${color}1A`,
        color,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: size * 0.4,
      }}
    >
      {inicial}
    </div>
  );
};

const getGradient = (area = "") => {
  const key = area.toUpperCase().replace(/[\s_]/g, "_");
  const gradients = {
    WEB: "linear-gradient(135deg, #1B6FE8, #3b82f6)",
    DATA: "linear-gradient(135deg, #059669, #10b981)",
    UX: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
    INFRAESTRUCTURA: "linear-gradient(135deg, #d97706, #f59e0b)",
    SOPORTE_TI: "linear-gradient(135deg, #1B6FE8, #3b82f6)",
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

const renderDuracion = (proyecto) => {
  if (proyecto.fechaLimiteCalculada) return { label: "Fecha límite", value: new Date(proyecto.fechaLimiteCalculada).toLocaleDateString("es-PE") };
  if (proyecto.diasEstimados) return { label: "Días de duración", value: `${proyecto.diasEstimados} días` };
  return { label: "Duración", value: "Por definir" };
};

const getVacancyStatus = (proyecto, postulacionesCount = 0) => {
  const totalVacantes = proyecto.cupos || 1;
  const vacantesDisponibles = totalVacantes - postulacionesCount;
  if (vacantesDisponibles <= 0) return { status: "complete", message: "Equipo completo", icon: <UserCheck size={14} />, color: "#059669", bg: "#ecfdf5", border: "#a7f3d0", remaining: 0 };
  if (vacantesDisponibles === 1) return { status: "urgent", message: "Solo 1 vacante", icon: <Zap size={14} />, color: "#dc2626", bg: "#fef2f2", border: "#fecaca", remaining: 1 };
  if (vacantesDisponibles <= 3) return { status: "limited", message: `${vacantesDisponibles} vacantes`, icon: <AlertCircle size={14} />, color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", remaining: vacantesDisponibles };
  return { status: "available", message: `${vacantesDisponibles} vacantes`, icon: <UserPlus size={14} />, color: "#1B6FE8", bg: "#eff6ff", border: "#bfdbfe", remaining: vacantesDisponibles };
};


/* ═══════════════════════════════════════════════
   COMMAND CENTER (banner navy idéntico al de MYPE)
═══════════════════════════════════════════════ */
const ProyectosCommandCenter = ({ totalDisponibles, totalPostulaciones }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2, size: Math.random() * 1.5 + 0.5 });
    }

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.fillStyle = "rgba(56,189,248,0.4)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x, dy = particles[j].y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.strokeStyle = `rgba(56,189,248,${0.1 * (1 - dist / 80)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "relative",
        background: "linear-gradient(135deg, #0A1628 0%, #0F2A4A 55%, #1E3A5F 100%)",
        borderRadius: "20px",
        padding: "40px 48px",
        overflow: "hidden",
        boxShadow: "0 24px 48px -12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        marginBottom: 28,
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "stretch",
        gap: 40,
      }}
    >
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: -100, right: -50, width: 300, height: 300, background: "radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />

      {/* Titular */}
      <div style={{ position: "relative", zIndex: 10, flex: "1 1 50%", display: "flex", flexDirection: "column", justifyContent: "center" }}>

        <h1 style={{ fontFamily: FONT, fontSize: "2.2rem", fontWeight: 500, color: "#FFFFFF", margin: "0 0 10px", letterSpacing: "-0.03em" }}>
          Explora proyectos
        </h1>
        <p style={{ fontFamily: FONT, fontSize: 14, color: "#94A3B8", margin: 0, lineHeight: 1.6, fontWeight: 400, maxWidth: "88%" }}>
          Conecta con empresas de Cajamarca. Postula a proyectos reales y construye tu experiencia.
        </p>
      </div>

      {/* KPIs */}
      <div style={{ position: "relative", zIndex: 10, flex: "1 1 50%", display: "flex", gap: 16, flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "20px", backdropFilter: "blur(10px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94A3B8", marginBottom: 10 }}>
              <TrendingUp size={15} />
              <span style={{ fontSize: 10, fontWeight: 600, fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.05em" }}>Disponibles</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 400, color: "#FFFFFF", fontFamily: FONT, lineHeight: 1 }}>{totalDisponibles}</div>

          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "20px", backdropFilter: "blur(10px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94A3B8", marginBottom: 10 }}>
              <CheckCircle2 size={15} />
              <span style={{ fontSize: 10, fontWeight: 600, fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.05em" }}>Postuladas</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 400, color: "#FFFFFF", fontFamily: FONT, lineHeight: 1 }}>{totalPostulaciones}</div>
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 11, color: "#FFFFFF", fontWeight: 600, fontFamily: FONT, marginBottom: 3 }}>Cajamarca, Perú</div>
          </div>
          <div style={{ width: 100, height: 5, background: "#1E293B", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: `${totalDisponibles ? Math.min((totalPostulaciones / totalDisponibles) * 100, 100) : 0}%`, height: "100%", background: "linear-gradient(90deg, #1B6FE8, #38BDF8)" }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};


/* ═══════════════════════════════════════════════
   PROJECT ROW — estilo MYPE compacto (izquierda)
═══════════════════════════════════════════════ */
const ProyectoRow = ({ proyecto, onClick, yaPostulo, isSelected, postulacionesCount }) => {
  const duracion = renderDuracion(proyecto);

  return (
    <motion.div
      onClick={onClick}
      style={{
        background: isSelected ? "#FFFFFF" : "#FCFDFD",
        border: "1px solid",
        borderColor: isSelected ? "#E2E8F0" : "#F1F5F9",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: isSelected ? "0 12px 32px -8px rgba(15,23,42,0.08)" : "0 2px 4px rgba(15,23,42,0.01)",
        marginBottom: 16,
        cursor: "pointer",
        padding: "14px 16px",
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileHover={!isSelected ? { background: "#F5F9FF", borderColor: "#DBEAFE", boxShadow: "0 4px 8px rgba(15,23,42,0.04)" } : {}}
    >
      <div style={{ display: "flex", gap: 12 }}>
        <MypeAvatar nombre={proyecto.mypeNombre} fotoUrl={proyecto.mypeFotoUrl} size={40} />

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* ID + postulado */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
            <span style={{ fontSize: 9, fontFamily: FONT, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {`PROJ-${String(proyecto.id).padStart(4, "0")}`}
            </span>
            {yaPostulo && (
              <span style={{ marginLeft: "auto", fontSize: 9, fontFamily: FONT, fontWeight: 600, color: "#059669", background: "#F0FDF4", padding: "1px 6px", borderRadius: "4px", display: "flex", alignItems: "center", gap: 3 }}>
                <CheckCircle2 size={8} /> Postulado
              </span>
            )}
          </div>

          {/* Título */}
          <h3 style={{ margin: "0 0 3px", fontFamily: FONT, fontSize: 14, fontWeight: 600, color: "#0F1F3D", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {proyecto.titulo}
          </h3>

          {/* MYPE */}
          <div style={{ fontSize: 12, fontFamily: FONT, color: "#64748B", marginBottom: 8, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {proyecto.mypeNombre || "Empresa"}
          </div>

          {/* Footer: duración */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 10, color: "#94A3B8", display: "flex", alignItems: "center", gap: 3, fontFamily: FONT }}>
              <Calendar size={9} /> {duracion.value}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


/* ═══════════════════════════════════════════════
   PAGINACIÓN — círculos estilo MYPE
═══════════════════════════════════════════════ */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32, padding: "16px 24px", border: "1px solid #E2E8F0", borderRadius: 16, background: "#FAFAFA" }}>
      <span style={{ fontSize: 12, fontFamily: FONT, color: "#64748B", fontWeight: 500 }}>
        Página <span style={{ color: "#0F1F3D", fontWeight: 700 }}>{currentPage}</span> de <span style={{ color: "#0F1F3D", fontWeight: 700 }}>{totalPages}</span>
      </span>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: currentPage === 1 ? "#F1F5F9" : "#FFFFFF", border: "1px solid", borderColor: currentPage === 1 ? "transparent" : "#E2E8F0", color: currentPage === 1 ? "#94A3B8" : "#0F1F3D", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
        >
          <ChevronLeft size={16} />
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: currentPage === totalPages ? "#F1F5F9" : "#FFFFFF", border: "1px solid", borderColor: currentPage === totalPages ? "transparent" : "#E2E8F0", color: currentPage === totalPages ? "#94A3B8" : "#0F1F3D", cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};


/* ═══════════════════════════════════════════════
   PANEL DE DETALLE
═══════════════════════════════════════════════ */
const DESC_PREVIEW = 300;

const ProjectDetailPanel = ({
  proyecto,
  cargando = false,
  error = null,
  haySeleccion = false,
  yaPostulo,
  haSuperadoLimite,
  limiteProyectos = 1,
  onClose,
  postulacionesCount = 0,
}) => {
  const [verMasDesc, setVerMasDesc] = React.useState(false);

  if (cargando) {
    return (
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: 60, textAlign: "center" }}>
        <div style={{ width: 32, height: 32, border: "3px solid #E2E8F0", borderTopColor: "#1B6FE8", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 14px" }} />
        <p style={{ fontSize: 13, fontFamily: FONT, color: "#64748B", margin: 0 }}>Cargando detalle del proyecto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #FECACA", padding: 40, textAlign: "center" }}>
        <AlertCircle size={36} style={{ margin: "0 auto 12px", color: "#EF4444" }} />
        <p style={{ fontSize: 13, fontFamily: FONT, color: "#EF4444", fontWeight: 600, marginBottom: 4 }}>Error al cargar el detalle</p>
        <p style={{ fontSize: 12, fontFamily: FONT, color: "#94A3B8", margin: 0 }}>{error}</p>
      </div>
    );
  }

  if (!proyecto) {
    return (
      <div style={{ background: "#F8FAFC", borderRadius: 16, border: "1px solid #E2E8F0", minHeight: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 40 }}>
        <Briefcase size={38} style={{ margin: "0 auto 14px", opacity: 0.15, color: "#1B6FE8" }} />
        <h3 style={{ fontSize: 14, fontFamily: FONT, fontWeight: 600, color: "#6B7280", marginBottom: 6 }}>Selecciona un proyecto para ver los detalles</h3>
        <p style={{ fontSize: 12, fontFamily: FONT, color: "#9CA3AF", margin: 0 }}>Haz clic en cualquier proyecto de la lista</p>
      </div>
    );
  }

  const area = proyecto.areaSistemas?.replace(/_/g, " ") || "SISTEMAS";
  const { bg, color } = getAreaStyle(area);
  const vacancyStatus = getVacancyStatus(proyecto, postulacionesCount);
  const totalVacantes = proyecto.cupos || 1;
  const esProyectoCompleto = vacancyStatus.status === "complete";

  const renderDuracionLocal = (proj) => {
    if (proj.fechaLimiteCalculada) return { label: "Fecha límite", value: new Date(proj.fechaLimiteCalculada).toLocaleDateString("es-PE") };
    if (proj.diasEstimados) return { label: "Días de duración", value: `${proj.diasEstimados} días` };
    return { label: "Duración", value: "Por definir" };
  };

  const duracion = renderDuracionLocal(proyecto);

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden", position: "sticky", top: 20, boxShadow: "0 2px 8px rgba(15,23,42,0.04)" }}>

      <div style={{ padding: "20px 20px 0", position: "relative" }}>
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 12, right: 12, background: "#F1F5F9", border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B", transition: "all 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#E2E8F0"; e.currentTarget.style.color = "#0F1F3D"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#F1F5F9"; e.currentTarget.style.color = "#64748B"; }}
        >
          <X size={14} />
        </button>

        {/* Área badge */}
        <div style={{ display: "inline-flex", alignItems: "center", background: bg, color, padding: "3px 10px", borderRadius: 16, fontSize: 9, fontWeight: 700, fontFamily: FONT, marginBottom: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {area}
        </div>

        {/* Título */}
        <h2 style={{ fontFamily: FONT, fontSize: 18, fontWeight: 600, color: "#0F1F3D", lineHeight: 1.3, marginBottom: 10, paddingRight: 32 }}>
          {proyecto.titulo}
        </h2>

        {/* Fila MYPE: nombre + rating */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", paddingBottom: 16, borderBottom: "1px solid #F1F5F9" }}>
          {proyecto.mypeId ? (
            <Link
              to={`/mypes/${proyecto.mypeId}`}
              style={{ textDecoration: "none", color: "#0F1F3D", fontWeight: 600, fontSize: 13, fontFamily: FONT, transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1B6FE8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#0F1F3D")}
            >
              {proyecto.mypeNombre || "Empresa"}
            </Link>
          ) : (
            <span style={{ fontWeight: 600, fontSize: 13, fontFamily: FONT, color: "#0F1F3D" }}>{proyecto.mypeNombre || "Empresa"}</span>
          )}
          {proyecto.mypeUsuarioId && (
            <>
              <span style={{ color: "#E5E7EB", fontSize: 13 }}>·</span>
              <RatingDisplay usuarioId={proyecto.mypeUsuarioId} size="sm" />
            </>
          )}
        </div>
      </div>

      <div style={{ padding: "16px 20px 20px" }}>
        {/* Duración + Cupos (con conteo de vacantes) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {/* Duración */}
          <div style={{ background: "linear-gradient(135deg, #EFF6FF, #F8FAFC)", padding: "12px 14px", borderRadius: 12, border: "1px solid #DBEAFE" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: 7, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", color: "#1B6FE8" }}>
                <Calendar size={12} />
              </div>
              <span style={{ fontSize: 9, fontFamily: FONT, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {duracion.label}
              </span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, fontFamily: FONT, color: "#0F1F3D" }}>
              {duracion.value}
            </div>
          </div>

          {/* Cupos con conteo de vacantes */}
          <div style={{ background: "linear-gradient(135deg, #F0FDF4, #F8FAFC)", padding: "12px 14px", borderRadius: 12, border: "1px solid #D1FAE5" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: 7, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669" }}>
                <Users size={12} />
              </div>
              <span style={{ fontSize: 9, fontFamily: FONT, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Cupos totales
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700, fontFamily: FONT, color: "#0F1F3D" }}>{postulacionesCount}/{totalVacantes}</span>
              <span style={{ fontSize: 10, fontFamily: FONT, color: "#64748B", fontWeight: 500 }}>ocupadas</span>
            </div>
            <div style={{ height: 5, background: "rgba(15,23,42,0.06)", borderRadius: 3, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(postulacionesCount / totalVacantes) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ height: "100%", background: esProyectoCompleto ? "linear-gradient(90deg, #10B981, #34D399)" : postulacionesCount / totalVacantes > 0.7 ? "linear-gradient(90deg, #F59E0B, #D97706)" : "linear-gradient(90deg, #1B6FE8, #38BDF8)", borderRadius: 3 }}
              />
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 10, fontFamily: FONT, fontWeight: 700, color: "#64748B", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Descripción</h4>
          {(() => {
            const desc = proyecto.descripcion || "";
            const larga = desc.length > DESC_PREVIEW;
            const texto = larga && !verMasDesc ? desc.slice(0, DESC_PREVIEW) + "…" : desc;
            return (
              <>
                <p style={{ fontSize: 13, fontFamily: FONT, color: "#475569", lineHeight: 1.6, margin: 0 }}>{texto}</p>
                {larga && (
                  <button onClick={() => setVerMasDesc((v) => !v)} style={{ marginTop: 6, fontSize: 11, fontWeight: 600, fontFamily: FONT, color: "#1B6FE8", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    {verMasDesc ? "Ver menos ▲" : "Ver más ▼"}
                  </button>
                )}
              </>
            );
          })()}
        </div>

        {/* Objetivo */}
        {proyecto.objetivo && (
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: 10, fontFamily: FONT, fontWeight: 700, color: "#64748B", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Objetivo</h4>
            <p style={{ fontSize: 13, fontFamily: FONT, color: "#475569", lineHeight: 1.6, margin: 0 }}>{proyecto.objetivo}</p>
          </div>
        )}

        {/* Ubicación */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 10, fontFamily: FONT, fontWeight: 700, color: "#64748B", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Ubicación</h4>
          <p style={{ fontSize: 13, fontFamily: FONT, color: "#475569", lineHeight: 1.6, margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
            <MapPin size={13} style={{ color: "#94A3B8", flexShrink: 0 }} />
            {proyecto.mypeDireccion || "Cajamarca"}
          </p>
        </div>

        {/* Empresa (rubro + descripción, sin nombre que ya aparece arriba) */}
        {(proyecto.mypeRubro || proyecto.mypeDescripcion) && (
          <div style={{ marginBottom: 20, padding: "12px 14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: 9, fontFamily: FONT, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              Empresa
            </div>
            {proyecto.mypeRubro && (
              <span style={{ display: "inline-block", fontSize: 11, fontFamily: FONT, fontWeight: 500, color: "#4B5563", background: "#E5E7EB", padding: "2px 8px", borderRadius: 6, marginBottom: proyecto.mypeDescripcion ? 8 : 0 }}>
                {proyecto.mypeRubro}
              </span>
            )}
            {proyecto.mypeDescripcion && (
              <p style={{ fontSize: 12, fontFamily: FONT, color: "#6B7280", lineHeight: 1.5, margin: 0 }}>{proyecto.mypeDescripcion}</p>
            )}
          </div>
        )}

        {/* Postulación */}
        <div style={{ marginTop: 4, paddingTop: 16, borderTop: "1px solid #F1F5F9" }}>
          {esProyectoCompleto ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              style={{ background: "#F8FAFC", border: "1px solid #E5E7EB", borderRadius: 10, padding: "16px", textAlign: "center" }}>
              <UserCheck size={22} style={{ color: "#6B7280", marginBottom: 8 }} />
              <div style={{ fontSize: 13, fontFamily: FONT, fontWeight: 700, color: "#374151", marginBottom: 4 }}>Vacantes cubiertas</div>
              <div style={{ fontSize: 12, fontFamily: FONT, color: "#9CA3AF" }}>Este proyecto ya no tiene plazas disponibles.</div>
            </motion.div>
          ) : (
            <>
              <PostularButton proyectoId={proyecto.id} yaPostulo={yaPostulo} disabled={haSuperadoLimite && !yaPostulo} />
              {haSuperadoLimite && !yaPostulo && (
                <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  style={{ fontSize: 10, fontFamily: FONT, color: "#64748B", marginTop: 6, textAlign: "center", background: "#EFF6FF", padding: "6px 10px", borderRadius: 8, border: "1px solid #DBEAFE" }}>
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
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════ */
const ITEMS_PER_PAGE = 5;

const ProyectosPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [proyectoDetalle, setProyectoDetalle] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [errorDetalle, setErrorDetalle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [panelCerrado, setPanelCerrado] = useState(false);

  const { data: proyectosData, isLoading, refetch } = useProyectos(0, 1000);
  const { data: postulaciones } = useMisPostulaciones();
  const { data: userProfile } = usePerfil();

  const proyectos = proyectosData?.content || [];

  useEffect(() => {
    const id = selectedProyecto?.id;
    if (!id) { setProyectoDetalle(null); setCargandoDetalle(false); setErrorDetalle(null); return; }
    const controller = new AbortController();
    setCargandoDetalle(true);
    setErrorDetalle(null);
    httpClient.get(`/proyectos/${id}`, { signal: controller.signal })
      .then((res) => { setProyectoDetalle(res.data); setCargandoDetalle(false); })
      .catch((err) => {
        if (err.code === "ERR_CANCELED" || err.name === "CanceledError") return;
        setErrorDetalle("No se pudo cargar el detalle del proyecto.");
        setCargandoDetalle(false);
      });
    return () => controller.abort();
  }, [selectedProyecto?.id]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => { refetch(); setLastRefresh(new Date()); }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, refetch]);

  const yaPostuloMap = useMemo(() => {
    const map = {};
    postulaciones?.forEach((p) => { map[p.proyectoId] = true; });
    return map;
  }, [postulaciones]);

  const proyectosActivos = useMemo(() => {
    return postulaciones?.filter(p => {
      const postulacionActiva = ESTADOS_POSTULACION_ACTIVA.includes(p.estado);
      const proyectoActivo = p.proyectoEstado && ESTADOS_PROYECTO_ACTIVOS.includes(p.proyectoEstado);
      const proyectoEstadoVacio = !p.proyectoEstado;
      return postulacionActiva && (proyectoActivo || proyectoEstadoVacio);
    }) || [];
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
      const matchesSearch = !searchTerm ||
        proyecto.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proyecto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proyecto.mypeNombre?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesArea = !selectedArea || proyecto.areaSistemas?.toUpperCase().includes(selectedArea);
      return matchesSearch && matchesArea;
    });
  }, [proyectos, searchTerm, selectedArea]);

  const searchParams = new URLSearchParams(window.location.search);
  const selectedIdFromUrl = searchParams.get('selected');

  useEffect(() => {
    if (!isLoading && selectedIdFromUrl && proyectos.length > 0) {
      const proyectoFromUrl = proyectos.find(p => p.id === Number(selectedIdFromUrl));
      if (proyectoFromUrl) {
        setSearchTerm('');
        setSelectedArea('');
        setSelectedProyecto(proyectoFromUrl);
        const index = proyectos.findIndex(p => p.id === Number(selectedIdFromUrl));
        if (index >= 0) setCurrentPage(Math.floor(index / ITEMS_PER_PAGE) + 1);
        setTimeout(() => { window.scrollTo({ top: 400, behavior: 'smooth' }); }, 800);
      }
    }
  }, [isLoading, selectedIdFromUrl, proyectos.length]);

  const totalPages = Math.ceil(filteredProyectos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProyectos = filteredProyectos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedArea]);

  useEffect(() => {
    if (paginatedProyectos.length > 0 && !selectedProyecto && !selectedIdFromUrl && !panelCerrado) {
      setSelectedProyecto(paginatedProyectos[0]);
    }
  }, [paginatedProyectos, selectedProyecto, selectedIdFromUrl, panelCerrado]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const currentStillExists = paginatedProyectos.find((p) => p.id === selectedProyecto?.id);
    if (!currentStillExists && paginatedProyectos.length > 0) setSelectedProyecto(paginatedProyectos[0]);
  };

  return (
    <div style={{ fontFamily: FONT, background: "#F8FAFC", minHeight: "100vh", padding: "20px", maxWidth: 1200, margin: "0 auto" }}>

      {/* Hero Command Center */}
      <ProyectosCommandCenter totalDisponibles={proyectos.length} totalPostulaciones={postulaciones?.length || 0} />

      {/* Barra de búsqueda */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 1px 3px rgba(15,23,42,0.03)" }}>
        <Search size={15} style={{ color: "#94A3B8", flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Buscar por título, empresa o palabra clave..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: "7px 0", border: "none", background: "transparent", fontSize: 13, fontFamily: FONT, fontWeight: 400, outline: "none", color: "#1E293B" }}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: 3, borderRadius: "50%", display: "flex", alignItems: "center" }}>
            <X size={13} />
          </button>
        )}
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 20, border: `1px solid ${showFilters || selectedArea ? "#1B6FE8" : "#E2E8F0"}`, background: showFilters || selectedArea ? "#EFF6FF" : "#fff", cursor: "pointer", fontSize: 12, fontFamily: FONT, fontWeight: 500, color: showFilters || selectedArea ? "#1B6FE8" : "#475569", whiteSpace: "nowrap", transition: "all 0.15s" }}
        >
          <SlidersHorizontal size={13} />
          Filtros
          {selectedArea && (
            <span style={{ background: "#1B6FE8", color: "#fff", borderRadius: "50%", width: 16, height: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>1</span>
          )}
        </button>
      </div>

      {/* Panel de filtros */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden", marginBottom: 14 }}>
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", padding: 14 }}>
              <div style={{ fontSize: 11, fontFamily: FONT, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Filtrar por área</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {areasFiltro.map((area) => (
                  <button key={area.value} onClick={() => setSelectedArea(area.value)}
                    style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontFamily: FONT, fontWeight: 500, border: selectedArea === area.value ? "2px solid #1B6FE8" : "1px solid #E2E8F0", background: selectedArea === area.value ? "#EFF6FF" : "#fff", color: selectedArea === area.value ? "#1B6FE8" : "#475569", cursor: "pointer", transition: "all 0.12s" }}>
                    {area.label}
                  </button>
                ))}
              </div>
              {selectedArea && (
                <button onClick={() => setSelectedArea("")} style={{ marginTop: 10, fontSize: 11, fontFamily: FONT, color: "#DC2626", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
                  Limpiar filtro
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layout dos columnas */}
      <div style={{ display: "grid", gridTemplateColumns: "460px 1fr", gap: 20, alignItems: "start" }}>

        {/* Lista de proyectos */}
        <div>
          {/* Section header estilo MYPE */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16, borderBottom: "1px solid #E2E8F0", paddingBottom: 12 }}>
            <div>
              <h2 style={{ fontFamily: FONT, margin: 0, fontSize: 16, color: "#0F1F3D", fontWeight: 600 }}>Proyectos disponibles</h2>
              <p style={{ fontFamily: FONT, margin: "4px 0 0", fontSize: 12, color: "#64748B" }}>
                {filteredProyectos.length} resultado{filteredProyectos.length !== 1 ? "s" : ""}
                {totalPages > 1 && ` · Pág. ${currentPage}/${totalPages}`}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[1, 2, 3].map(i => <div key={i} style={{ height: 90, background: "#F1F5F9", borderRadius: 14, animation: "pulse 2s infinite ease-in-out" }} />)}
            </div>
          ) : paginatedProyectos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 40px", border: "1px dashed #CBD5E1", borderRadius: 16, background: "#FAFAFA" }}>
              <Search size={32} style={{ margin: "0 auto 12px", color: "#CBD5E1" }} />
              <h3 style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Sin resultados</h3>
              <p style={{ fontFamily: FONT, fontSize: 12, color: "#94A3B8" }}>Intenta ajustar los filtros</p>
            </div>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                {paginatedProyectos.map((proyecto) => (
                  <ProyectoRow
                    key={proyecto.id}
                    proyecto={proyecto}
                    onClick={() => setSelectedProyecto(proyecto)}
                    yaPostulo={!!yaPostuloMap[proyecto.id]}
                    isSelected={selectedProyecto?.id === proyecto.id}
                    postulacionesCount={proyecto.cuposOcupados ?? 0}
                  />
                ))}
              </AnimatePresence>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          )}
        </div>

        {/* Panel de detalle */}
        <div>
          <ProjectDetailPanel
            proyecto={proyectoDetalle}
            cargando={cargandoDetalle}
            error={errorDetalle}
            haySeleccion={!!selectedProyecto}
            yaPostulo={selectedProyecto ? !!yaPostuloMap[selectedProyecto.id] : false}
            haSuperadoLimite={haSuperadoLimite}
            limiteProyectos={limiteProyectos}
            onClose={() => { setSelectedProyecto(null); setPanelCerrado(true); }}
            postulacionesCount={proyectoDetalle?.cuposOcupados ?? selectedProyecto?.cuposOcupados ?? 0}
          />
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes vping { 75%, 100% { transform: scale(2.4); opacity: 0; } }
        @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default ProyectosPage;
