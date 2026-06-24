import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Send,
  Smile,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  MessageSquare,
  Calendar,
  Upload,
  Download,
  ListChecks,
  Loader2,
  X,
  RefreshCw,
  User,
  ChevronDown,
  FileImage,
  FileArchive,
  Trash2,
  Vote,
  Crown,
  Shield,
  Users,
  Building2,
  Eye,
  Shuffle,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useWorkspaceRealTime } from "@/features/workspace/useWorkspaceRealTime";
import { useWorkspaceActions } from "@/features/workspace/useWorkspaceActions";
import { VotacionModal } from "@/shared/components/votacion/VotacionModal";
import { ChatGrupalPanel } from "@/shared/components/chat/ChatGrupalPanel";
import { ChatTabs } from "@/shared/components/chat/ChatTabs";
import { useVotacion, useEsDelegado } from "@/features/votacion/useVotacion";
import { useChatsGrupo } from "@/features/chat-grupal/useChatGrupal";
import { lockEntregable, unlockEntregable } from "@/features/proyecto-entregables/entregables.api";
import { formatDistanceToNow, format } from "date-fns";
import { es } from "date-fns/locale/es";

// ═══════════════════════════════════════════════
// PALETA DE COLORES
// ═══════════════════════════════════════════════
const C = {
  primary: "#1B6FE8",
  success: "#059669",
  warning: "#d4580a",
  purple: "#8B5CF6",
  bg: "#f8fafc",
  card: "#ffffff",
  border: "#e8e8e4",
  textPrimary: "#0f1f3d",
  textSecondary: "#6b6b7a",
  textMuted: "#94a3b8",
};

const CHART_COLORS = {
  completados: "#10b981",
  enRevision: "#eab308",
  pendientes: "#9ca3af",
  rechazados: "#ef4444",
};
const FONT = "'Angro Std', 'Outfit', sans-serif";

const getFullFileUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("data:")) return url;
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;
  return `${baseUrl}${cleanUrl}`;
};

const LinearStatsChart = ({ completados, enRevision, pendientes, rechazados = 0, total }) => {
  const pctCompletados = total > 0 ? (completados / total) * 100 : 0;
  const pctEnRevision = total > 0 ? (enRevision / total) * 100 : 0;
  const pctPendientes = total > 0 ? (pendientes / total) * 100 : 0;
  const pctRechazados = total > 0 ? (rechazados / total) * 100 : 0;

  return (
    <div style={{ background: '#fff', borderRadius: 20, border: `0.5px solid ${C.border}`, padding: '20px 28px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ width: 4, height: 20, borderRadius: 2, background: C.primary }} />
        <h3 style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, margin: 0, fontFamily: FONT }}>Distribución de entregables</h3>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: C.textMuted, fontFamily: FONT }}>{completados}/{total} aprobados</span>
      </div>

      {/* Barra de progreso */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', height: 14, borderRadius: 10, overflow: 'hidden', background: '#f1f5f9', marginBottom: 16 }}>
          {pctCompletados > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${pctCompletados}%` }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ height: "100%", background: CHART_COLORS.completados }} />}
          {pctEnRevision > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${pctEnRevision}%` }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }} style={{ height: "100%", background: CHART_COLORS.enRevision }} />}
          {pctPendientes > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${pctPendientes}%` }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }} style={{ height: "100%", background: CHART_COLORS.pendientes }} />}
          {pctRechazados > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${pctRechazados}%` }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }} style={{ height: "100%", background: CHART_COLORS.rechazados }} />}
        </div>

        {/* Solo texto resumen, sin círculos de colores */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748B', fontFamily: FONT }}>
          <span>Aprobados: {completados}</span>
          <span>En revisión: {enRevision}</span>
          <span>Pendientes: {pendientes}</span>
          {rechazados > 0 && <span>Requieren cambios: {rechazados}</span>}
        </div>
      </div>

      <div style={{ marginTop: 16, paddingTop: 12, borderTop: `0.5px solid ${C.border}` }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: C.textSecondary, margin: 0, fontFamily: FONT }}>
          {completados === total && total > 0 ? "🎉 ¡Felicidades! Todos los entregables aprobados." : completados > 0 ? `✅ Llevas ${completados} de ${total} aprobados.` : pendientes > 0 ? `${pendientes} entregable${pendientes !== 1 ? "s" : ""} pendiente${pendientes !== 1 ? "s" : ""}.` : "Sube tus entregables para avanzar."}
        </p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   PANEL DETALLES DEL PROYECTO
═══════════════════════════════════════════════ */
const ProjectDetailsPanel = ({ proyecto, mype, mypeNombre }) => {
  const estadoConfig = {
    ACTIVO: { label: 'Activo', bg: '#ECFDF5', color: '#059669', border: '#A7F3D0' },
    COMPLETADO: { label: 'Completado', bg: '#EFF6FF', color: '#1B6FE8', border: '#BFDBFE' },
    EN_PROGRESO: { label: 'En progreso', bg: '#FFFBEB', color: '#D97706', border: '#FDE68A' },
    PENDIENTE: { label: 'Pendiente', bg: '#F8FAFC', color: '#64748B', border: '#E2E8F0' },
  };
  const estadoStyle = estadoConfig[proyecto?.estado] || estadoConfig.PENDIENTE;
  const cupos = proyecto?.cupos || 1;
  const esIndividual = cupos === 1;

  return (
    <div style={{ background: '#fff', borderRadius: 20, border: `0.5px solid ${C.border}`, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 4, height: 16, borderRadius: 2, background: C.primary, flexShrink: 0 }} />
        <h3 style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, margin: 0, fontFamily: FONT }}>Detalles</h3>
      </div>

      {proyecto?.descripcion && (
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', margin: '0 0 5px', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: FONT }}>Descripción</p>
          <p style={{ fontSize: 12, color: C.textSecondary, margin: 0, lineHeight: 1.6, fontFamily: FONT, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {proyecto.descripcion}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: 10, border: '0.5px solid #E2E8F0' }}>
          <span style={{ fontSize: 11, color: '#64748B', fontWeight: 500, fontFamily: FONT }}>Tipo</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.textPrimary, fontFamily: FONT }}>
            {esIndividual ? 'Individual' : `Equipo · ${cupos} cupos`}
          </span>
        </div>

        {mypeNombre && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: 10, border: '0.5px solid #E2E8F0' }}>
            <span style={{ fontSize: 11, color: '#64748B', fontWeight: 500, fontFamily: FONT }}>MYPE</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.textPrimary, fontFamily: FONT, textAlign: 'right', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mypeNombre}</span>
          </div>
        )}

        {mype?.sector && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: 10, border: '0.5px solid #E2E8F0' }}>
            <span style={{ fontSize: 11, color: '#64748B', fontWeight: 500, fontFamily: FONT }}>Sector</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.textPrimary, fontFamily: FONT }}>{mype.sector}</span>
          </div>
        )}

        {proyecto?.fechaLimite && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#FFF7ED', borderRadius: 10, border: '0.5px solid #FED7AA' }}>
            <span style={{ fontSize: 11, color: '#92400E', fontWeight: 500, fontFamily: FONT }}>Fecha límite</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#C2410C', fontFamily: FONT }}>
              {format(new Date(proyecto.fechaLimite), "d MMM yyyy", { locale: es })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   HERO BANNER NAVY (canvas + partículas)
═══════════════════════════════════════════════ */
function WorkspaceHero({ proyecto, mypeNombre, completados, total }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);

    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 1.5 + 0.5,
      });
    }

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.fillStyle = "rgba(56,189,248,0.35)";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x, dy = particles[j].y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.strokeStyle = `rgba(56,189,248,${0.08 * (1 - dist / 90)})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
          }
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    const ro = new ResizeObserver(() => {
      if (!canvas) return;
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    });
    ro.observe(canvas);
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);

  const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "relative",
        background: "linear-gradient(135deg, #0A1628 0%, #0F2A4A 55%, #1E3A5F 100%)",
        borderRadius: 20,
        padding: "48px 56px",
        overflow: "hidden",
        boxShadow: "0 24px 48px -12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        marginBottom: 32,
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 32,
        flexWrap: "wrap",
      }}
    >
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: -80, right: -40, width: 320, height: 320, background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />

      {/* Info principal */}
      <div style={{ position: "relative", zIndex: 10, flex: "1 1 auto", minWidth: 0 }}>

        <h1 style={{ fontFamily: FONT, fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 600, color: "#FFFFFF", margin: "0 0 12px", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
          {proyecto.titulo}
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <span style={{ fontFamily: FONT, fontSize: 13, color: "#94A3B8", display: "flex", alignItems: "center", gap: 6 }}>
            <User size={13} color="#64748B" /> {mypeNombre}
          </span>
          {proyecto.fechaLimite && (
            <span style={{ fontFamily: FONT, fontSize: 13, color: "#94A3B8", display: "flex", alignItems: "center", gap: 6 }}>
              <Calendar size={13} color="#64748B" />
              Límite:{" "}
              <span style={{ color: "#FCA5A5", fontWeight: 600 }}>
                {format(new Date(proyecto.fechaLimite), "d 'de' MMMM, yyyy", { locale: es })}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Progreso */}
      {total > 0 && (
        <div style={{ position: "relative", zIndex: 10, flexShrink: 0, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 28px", textAlign: "center", minWidth: 120 }}>
          <div style={{ fontSize: 38, fontWeight: 400, color: "#FFFFFF", fontFamily: FONT, lineHeight: 1, letterSpacing: "-0.03em" }}>
            {porcentaje}<span style={{ fontSize: 18, color: "#64748B" }}>%</span>
          </div>
          <div style={{ marginTop: 10, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${porcentaje}%` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: "100%", background: "linear-gradient(90deg, #1B6FE8, #38BDF8)", borderRadius: 4 }}
            />
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: "#64748B", fontFamily: FONT }}>
            {completados}/{total} entregables
          </div>
        </div>
      )}
    </motion.div>
  );
}

const EntregableCard = ({ titulo, entregable, onUpload, onDownload, onDelete, index, esDelegado, esProyectoIndividual }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const tieneArchivo = !!entregable?.archivo;
  const estado = entregable?.estado || "PENDIENTE";
  const tieneFeedback = !!entregable?.observaciones;
  const entregaId = entregable?.id;
  const puedeSubir = true;

  const statusLabel = estado === "APROBADO" ? "Aprobado"
    : estado === "EN_REVISION" || estado === "PENDIENTE_REVISION" ? "En revisión"
    : estado === "RECHAZADO" ? "Requiere cambios"
    : "Pendiente";

  const statusColor = estado === "APROBADO" ? "#10b981"
    : estado === "EN_REVISION" ? "#eab308"
    : estado === "RECHAZADO" ? "#ef4444"
    : "#94a3b8";

  const handleViewFile = () => {
    const fileUrl = entregable?.archivoUrl || entregable?.archivo;
    if (!fileUrl) return;
    const fullUrl = getFullFileUrl(fileUrl);
    if (fullUrl) window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  const confirmDelete = () => {
    if (onDelete && entregaId) onDelete(entregaId);
    setShowDeleteConfirm(false);
  };

  const getFileIcon = () => {
    const ext = (entregable?.archivoNombre || "").split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return <FileImage size={14} color={C.primary} />;
    if (ext === "pdf") return <FileText size={14} color="#dc2626" />;
    return <FileArchive size={14} color={C.textMuted} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ position: "relative" }}
    >
      {showDeleteConfirm && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 10, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: "#fff", borderRadius: 10, padding: 16, width: "80%", maxWidth: 240, textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }} onClick={(e) => e.stopPropagation()}>
            <p style={{ fontSize: 12, fontWeight: 600, color: C.textPrimary, marginBottom: 14 }}>¿Eliminar "{titulo.length > 30 ? titulo.slice(0, 30) + "…" : titulo}"?</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#fff", fontSize: 11, cursor: "pointer" }}>Cancelar</button>
              <button onClick={confirmDelete} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: "#dc2626", color: "#fff", fontSize: 11, cursor: "pointer" }}>Eliminar</button>
            </div>
          </motion.div>
        </div>
      )}

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 10,
          border: `1px solid ${hovered ? "#CBD5E1" : "#E2E8F0"}`,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          transition: "border-color 0.15s",
        }}
      >
        {/* Número y estado */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 60 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", background: "#F1F5F9", padding: "1px 6px", borderRadius: 4 }}>#{index+1}</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: statusColor }}>{statusLabel}</span>
        </div>

        {/* Título y detalles */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {titulo}
            </span>
            {tieneArchivo && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#64748B", background: "#F8FAFC", padding: "1px 6px", borderRadius: 4 }}>
                {getFileIcon()}
                <span style={{ maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {entregable?.archivoNombre || "Archivo"}
                </span>
              </span>
            )}
          </div>
          {tieneArchivo && entregable?.subidoPorNombre && (
            <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>
              Subido por {entregable.subidoPorNombre}
              {entregable.fechaSubida && ` · ${formatDistanceToNow(new Date(entregable.fechaSubida), { addSuffix: true, locale: es })}`}
            </div>
          )}
        </div>

        {/* Acciones */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          {tieneArchivo ? (
            <>
              <button onClick={handleViewFile} title="Ver" style={{ padding: "4px 8px", borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", color: "#64748B", fontSize: 12, display: "flex", alignItems: "center", gap: 3 }}>
                <Eye size={13} /> Ver
              </button>
              <button onClick={() => onDownload(entregable.archivoUrl || entregable.archivo, entregable.archivoNombre)} title="Descargar" style={{ padding: "4px 8px", borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", color: "#64748B", fontSize: 12, display: "flex", alignItems: "center", gap: 3 }}>
                <Download size={13} /> Bajar
              </button>
              <button onClick={() => onUpload(titulo, entregable)} title="Actualizar" style={{ padding: "4px 6px", borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", color: "#64748B" }}>
                <RefreshCw size={13} />
              </button>
              {puedeSubir && (
                <button onClick={() => setShowDeleteConfirm(true)} title="Eliminar" style={{ padding: "4px 6px", borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", color: "#94a3b8" }}>
                  <Trash2 size={13} />
                </button>
              )}
            </>
          ) : (
            <button onClick={() => onUpload(titulo, null)} style={{ padding: "4px 12px", borderRadius: 6, border: "none", background: C.primary, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              <Upload size={12} /> Subir
            </button>
          )}
          {tieneFeedback && (
            <button onClick={() => setExpanded(!expanded)} style={{ padding: "2px 4px", border: "none", background: "transparent", cursor: "pointer", color: "#94a3b8" }}>
              <ChevronDown size={14} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>
          )}
        </div>
      </div>

      {tieneFeedback && (
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
              <div style={{ marginTop: 4, padding: "8px 12px", borderRadius: 6, background: "#F8FAFC", border: "1px solid #E2E8F0", fontSize: 11, color: "#475569" }}>
                {entregable.observaciones}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

// ═══════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ═══════════════════════════════════════════════
export function ProyectoWorkspacePage() {
  const { proyectoId } = useParams();
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const queryClient = useQueryClient();
  const emojiPickerRef = useRef(null);
  const [activeTab, setActiveTab] = useState("entregables");
const [nuevoMensaje, setNuevoMensaje] = useState("");
const [showUploadModal, setShowUploadModal] = useState(false);
const [selectedEntregable, setSelectedEntregable] = useState(null);
const [uploadFile, setUploadFile] = useState(null);
const [uploadDescripcion, setUploadDescripcion] = useState("");
const [uploadError, setUploadError] = useState("");
const [uploadSuccess, setUploadSuccess] = useState(false);
const [dragActive, setDragActive] = useState(false);
const [showEmoji, setShowEmoji] = useState(false);
const [showVotacionModal, setShowVotacionModal] = useState(false);
const [lockedEntregableId, setLockedEntregableId] = useState(null);
const [chatTabActivo, setChatTabActivo] = useState("EQUIPO");
const [showCompletadoModal, setShowCompletadoModal] = useState(false);
const [entregableIdEnEdicion, setEntregableIdEnEdicion] = useState(null); // ✅ NUEVO


  const { proyecto, entregables, mensajes, conversacionId, mype, isLoading, errorProyecto, proyectoError, recargarWorkspace } = useWorkspaceRealTime(proyectoId);
  const { subirEntregable, isSubiendo, uploadProgress, enviarMensaje, isEnviandoMensaje, descargarArchivo, eliminarEntregable, resetUpload } = useWorkspaceActions(proyectoId);
  const { votacion, isLoading: isLoadingVotacion } = useVotacion(proyectoId);
  const { esDelegado } = useEsDelegado(proyectoId);
  const { chats: chatsGrupales } = useChatsGrupo(proyectoId);

  const votacionActiva = votacion?.estado === "EN_VOTACION";
  const votacionCompletada = votacion?.estado === "COMPLETADA";

  // Limpia el caché de mensajes y chats del proyecto anterior al cambiar de proyectoId
  // evitando que mensajes del proyecto A aparezcan brevemente en el proyecto B.
  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ["workspace-mensajes", proyectoId] });
      queryClient.removeQueries({ queryKey: ["chatsGrupo", proyectoId] });
      queryClient.removeQueries({ queryKey: ["mensajesGrupo", proyectoId] });
      queryClient.removeQueries({ queryKey: ["workspace-entregables", proyectoId] });
    };
  }, [proyectoId, queryClient]);

  useEffect(() => {
    if (proyecto?.estado !== "COMPLETADO") return;
    const key = `estudianteProyectoCompletado_${proyectoId}`;
    if (!localStorage.getItem(key)) {
      setShowCompletadoModal(true);
      localStorage.setItem(key, "1");
    }
  }, [proyecto?.estado, proyectoId]);
  const ganador = votacion?.candidatos?.find((c) => c.esGanador);
  const esProyectoIndividual = proyecto?.cupos === 1;

  useEffect(() => {
    if (activeTab === "chat" && chatEndRef.current && mensajes.length > 0) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mensajes, activeTab]);

  useEffect(() => {
    const handler = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) setShowEmoji(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!showUploadModal && lockedEntregableId) {
      unlockEntregable(proyectoId, lockedEntregableId)
        .then(() => setLockedEntregableId(null))
        .catch(console.error);
    }
  }, [showUploadModal, lockedEntregableId, proyectoId]);

  const handleEnviarMensaje = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;
    try {
      await enviarMensaje({ conversacionId, mensaje: nuevoMensaje.trim() });
      setNuevoMensaje("");
      setShowEmoji(false);
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
    }
  };

  const handleSubirEntregable = async (e) => {
  e.preventDefault();
  if (!uploadFile || !selectedEntregable) {
    setUploadError("Selecciona un archivo");
    return;
  }
  try {
    const formData = new FormData();
    formData.append("titulo", selectedEntregable);
    formData.append("descripcion", uploadDescripcion || `Entrega: ${selectedEntregable}`);
    formData.append("archivo", uploadFile);
    if (entregableIdEnEdicion) {
      formData.append("entregableId", entregableIdEnEdicion); // ✅ Enviar ID
    }
    await subirEntregable({ formData });
    setUploadSuccess(true);
    setTimeout(() => {
      setShowUploadModal(false);
      setUploadSuccess(false);
      setUploadFile(null);
      setUploadDescripcion("");
      setSelectedEntregable(null);
      setEntregableIdEnEdicion(null); // ✅ Limpiar
      resetUpload();
      recargarWorkspace();
    }, 1800);
  } catch (err) {
    setUploadError(err.message || "Error al subir el archivo");
  }
};

  const handleEliminarEntregable = async (entregableId) => {
    try {
      await eliminarEntregable(entregableId);
      recargarWorkspace();
    } catch (err) {
      console.error("Error al eliminar entregable:", err);
      alert(err.response?.data?.message || "Error al eliminar el entregable");
    }
  };

  const parseEntregablesDelProyecto = () => {
    const raw = proyecto?.entregablesSugeridos || proyecto?.entregables;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.filter((e) => e && String(e).trim().length > 0);
    if (typeof raw === "string") {
      const texto = raw.trim();
      let items = texto.split("•").map((e) => e.trim()).filter((e) => e.length > 0);
      if (items.length <= 1) items = texto.split("\n").map((e) => e.trim()).filter((e) => e.length > 0).map((e) => e.replace(/^[•\-*\d+.)]\s*/, "").trim());
      if (items.length <= 1) items = texto.split(/\.\s+(?=[A-ZÁÉÍÓÚÑ])/).map((e) => e.trim()).filter((e) => e.length > 0).map((e) => (e.endsWith(".") ? e : e + "."));
      return items.filter((i) => i.length > 3);
    }
    return [];
  };

  const entregablesProyecto = parseEntregablesDelProyecto();
  const mypeNombre = mype?.nombre || proyecto?.mypeNombre || "MYPE";

  const currentStats = {
    total: entregablesProyecto.length,
    completados: entregables.filter((e) => e.estado === "APROBADO").length,
    enRevision: entregables.filter((e) => e.estado === "EN_REVISION" || e.estado === "PENDIENTE_REVISION").length,
    pendientes: entregables.filter((e) => e.estado === "PENDIENTE").length,
    rechazados: entregables.filter((e) => e.estado === "RECHAZADO").length,
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 60, height: 60, borderRadius: 20, background: `linear-gradient(135deg, ${C.primary}, ${C.purple})`, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Loader2 size={28} color="#fff" />
          </motion.div>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>Cargando Workspace</p>
        </div>
      </div>
    );
  }

  if (errorProyecto || !proyecto) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 360 }}>
          <div style={{ width: 70, height: 70, borderRadius: 20, background: "#fef2f2", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}><AlertCircle size={32} color="#dc2626" /></div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>Error al cargar</h1>
          <p style={{ fontSize: 13, color: C.textSecondary, marginBottom: 24 }}>{proyectoError?.message || "No se pudo cargar el proyecto"}</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={recargarWorkspace} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: C.primary, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Reintentar</button>
            <button onClick={() => navigate(-1)} style={{ padding: "10px 20px", borderRadius: 10, border: `0.5px solid ${C.border}`, background: "#fff", color: C.textPrimary, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Volver</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: FONT, maxWidth: 1200, margin: "0 auto", padding: "32px 36px", paddingBottom: 120 }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes vping { 75%, 100% { transform: scale(2.4); opacity: 0; } }
      `}</style>

      {/* Modal proyecto completado (estudiante) */}
      {showCompletadoModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            style={{ background: "#fff", borderRadius: 20, padding: "40px 36px", maxWidth: 400, width: "90%", textAlign: "center", border: `1px solid ${C.border}`, boxShadow: "0 24px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#059669,#34d399)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <CheckCircle2 size={32} color="#fff" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: C.textPrimary, marginBottom: 12 }}>
              ¡Proyecto completado!
            </h2>
            <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6, marginBottom: 28 }}>
              ¡Felicitaciones! El proyecto ha concluido exitosamente. Recibirás tu certificado en breve.
            </p>
            <button onClick={() => setShowCompletadoModal(false)}
              style={{ padding: "12px 32px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Entendido
            </button>
          </motion.div>
        </div>
      )}

      {/* Hero Banner */}
      <WorkspaceHero
        proyecto={proyecto}
        mypeNombre={mypeNombre}
        completados={currentStats.completados}
        total={currentStats.total}
      />

      <div style={{ marginBottom: 20 }}>
        <LinearStatsChart 
          completados={currentStats.completados} 
          enRevision={currentStats.enRevision} 
          pendientes={currentStats.pendientes} 
          rechazados={currentStats.rechazados} 
          total={currentStats.total} 
        />
      </div>

      {/* Banners informativos */}
      {!esProyectoIndividual && votacionActiva && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }} style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 14, padding: "14px 20px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #1B6FE8, #0F1F3D)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(27,111,232,0.25)" }}><Vote size={20} color="#fff" /></motion.div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0F1F3D", margin: "0 0 3px", fontFamily: FONT }}>Elige al delegado del equipo</h4>
              <p style={{ fontSize: 12, color: "#475569", margin: 0, lineHeight: 1.5, fontFamily: FONT }}>El delegado será el representante, pero <strong>todos los miembros pueden subir entregables</strong>. El sistema evita conflictos automáticamente.</p>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setActiveTab("votacion")} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "#1B6FE8", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 7, boxShadow: "0 3px 10px rgba(27,111,232,0.2)", flexShrink: 0, fontFamily: FONT }}><Vote size={15} /> Ir a votar</motion.button>
        </motion.div>
      )}

      {proyecto?.estado === "PENDIENTE_ADMIN" && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 14, padding: "14px 20px", marginBottom: 18, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #475569, #334155)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><AlertCircle size={20} color="#fff" /></div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0F1F3D", margin: "0 0 3px", fontFamily: FONT }}>Proyecto en revisión</h4>
              <p style={{ fontSize: 12, color: "#475569", margin: 0, lineHeight: 1.5, fontFamily: FONT }}>El administrador está revisando tu proyecto debido a inactividad en la votación. Recibirás una notificación cuando se tome una decisión.</p>
            </div>
          </div>
        </motion.div>
      )}

      {proyecto?.estado === "VACANTES_ABIERTAS" && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }} style={{ background: "linear-gradient(135deg, #ecfeff, #cffafe)", border: "1px solid #67e8f9", borderRadius: 14, padding: "14px 20px", marginBottom: 18, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #06b6d4, #0891b2)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(8,145,178,0.3)" }}><Users size={20} color="#fff" /></motion.div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#155e75", margin: "0 0 3px" }}>Buscando nuevos integrantes</h4>
              <p style={{ fontSize: 12, color: "#0e7490", margin: 0, lineHeight: 1.5 }}>Se están buscando reemplazos para los estudiantes inactivos. El proyecto continuará cuando se complete el equipo.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ background: "#fff", borderRadius: 20, border: `0.5px solid ${C.border}`, overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: `0.5px solid ${C.border}`, padding: "0 8px" }}>
          {[
            { id: "entregables", label: "Entregables", count: `${currentStats.completados}/${currentStats.total}`, icon: <ListChecks size={15} /> },
            { id: "chat", label: "Chat", count: (mensajes?.length || 0) + (chatsGrupales?.length || 0), icon: <MessageSquare size={15} /> },
            ...(esProyectoIndividual ? [] : [{ id: "votacion", label: "Votación", count: votacionActiva ? "🔴" : votacionCompletada ? "✅" : "", icon: <Vote size={15} /> }]),
          ].map((tab) => (
            <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)} whileHover={{ y: -1 }} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "13px 20px", fontSize: 13, fontWeight: 700, border: "none", background: "transparent", color: activeTab === tab.id ? C.primary : C.textMuted, cursor: "pointer", position: "relative", transition: "color 0.2s" }}>
              {tab.icon} {tab.label}
              {tab.count > 0 && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 12, background: activeTab === tab.id ? "#eff6ff" : "#f1f5f9", color: activeTab === tab.id ? C.primary : C.textMuted }}>{tab.count}</span>}
              {activeTab === tab.id && <motion.div layoutId="activeTab" transition={{ type: "spring", stiffness: 500, damping: 30 }} style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: C.primary, borderRadius: "2px 2px 0 0" }} />}
            </motion.button>
          ))}
        </div>

        <div style={{ padding: "24px 28px" }}>
          <AnimatePresence mode="wait">
            {/* TAB: ENTREGABLES */}
            {activeTab === "entregables" && (
            <motion.div key="entregables" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              {entregablesProyecto.length > 0 ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 4, height: 18, borderRadius: 2, background: C.primary, flexShrink: 0 }} />
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, margin: 0 }}>Lista de entregables</h3>
                    </div>
                    {/* Badge de delegado justificado a la derecha */}
                    {votacionCompletada && ganador && !esProyectoIndividual && (
                      <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: 6, 
                        fontSize: 11, 
                        color: '#64748B', 
                        fontFamily: FONT,
                        fontWeight: 500,
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: 6,
                        padding: '3px 10px',
                        whiteSpace: 'nowrap',
                      }}>
                        {esDelegado ? (
                          <><Crown size={12} color="#1B6FE8" /> Eres el delegado</>
                        ) : (
                          <><Shield size={12} color="#64748B" /> Delegado: {ganador.estudianteNombre}</>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 16 }}>
                    {entregablesProyecto.map((titulo, idx) => {
                      const entrega = entregables.find((e) => e.titulo?.toLowerCase() === titulo.toLowerCase());
                      return (
                        <EntregableCard
                          key={`e-${idx}`}
                          titulo={titulo}
                          index={idx}
                          entregable={entrega || null}
                          esDelegado={esDelegado}
                          esProyectoIndividual={esProyectoIndividual}
                          onUpload={async (titulo, entregaExistente) => {
  if (entregaExistente?.id) {
    try {
      await lockEntregable(proyectoId, entregaExistente.id);
      setLockedEntregableId(entregaExistente.id);
      setEntregableIdEnEdicion(entregaExistente.id); // ✅ Guardar ID
    } catch (err) {
      const msg = err.response?.data?.message || "Otro usuario está editando este entregable";
      alert(msg);
      return;
    }
  } else {
    setEntregableIdEnEdicion(null); // ✅ Nuevo entregable
  }
  setSelectedEntregable(titulo);
  setShowUploadModal(true);
}}
                          onDownload={descargarArchivo}
                          onDelete={handleEliminarEntregable}
                        />
                      );
                    })}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                  <FileText size={48} color={C.textMuted} style={{ marginBottom: 16 }} />
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary, marginBottom: 6 }}>No hay entregables definidos</h3>
                  <p style={{ fontSize: 13, color: C.textMuted }}>La MYPE aún no ha definido los entregables para este proyecto.</p>
                </div>
              )}
            </motion.div>
          )}

            {activeTab === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {esProyectoIndividual ? (
                /* ─── PROYECTO INDIVIDUAL: Solo chat directo con MYPE ─── */
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "500px",
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
                  }}
                >
                  {/* Cabecera simplificada para proyecto individual */}
                  <div
                    style={{
                      padding: "12px 20px",
                      borderBottom: "1px solid #e5e7eb",
                      background: "#fff",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 4,
                        height: 16,
                        borderRadius: 2,
                        background: "#10b981",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: FONT,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#0f1f3d",
                      }}
                    >
                      {mypeNombre}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT,
                        fontSize: 10,
                        color: "#9ca3af",
                        marginLeft: 4,
                      }}
                    >
                      Chat directo
                    </span>
                  </div>

                  <div
                    style={{
                      flex: 1,
                      overflowY: "auto",
                      padding: "16px 20px",
                      background: "#f8fafc",
                    }}
                  >
                    {mensajes.length === 0 ? (
                      <div
                        style={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div style={{ textAlign: "center" }}>
                          <MessageSquare
                            size={36}
                            color="#9ca3af"
                            style={{ marginBottom: 10 }}
                          />
                          <p
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#9ca3af",
                            }}
                          >
                            Sin mensajes aún
                          </p>
                          <p style={{ fontSize: 11, color: "#9ca3af" }}>
                            Envía un mensaje para coordinar
                          </p>
                        </div>
                      </div>
                    ) : (
                      mensajes.map((msg, idx) => {
                        const isEstudiante =
                          msg.remitenteId === "estudiante" ||
                          msg.rol === "ESTUDIANTE" ||
                          msg.esMio ||
                          msg.remitente?.toLowerCase() === "tú";
                        const hora =
                          msg.fechaEnvio || msg.fecha
                            ? format(
                                new Date(msg.fechaEnvio || msg.fecha),
                                "HH:mm",
                              )
                            : "";
                        const mostrarFecha =
                          idx === 0 ||
                          (msg.fechaEnvio &&
                            mensajes[idx - 1]?.fechaEnvio &&
                            format(new Date(msg.fechaEnvio), "yyyy-MM-dd") !==
                              format(
                                new Date(mensajes[idx - 1].fechaEnvio),
                                "yyyy-MM-dd",
                              ));
                        return (
                          <React.Fragment key={msg.id || idx}>
                            {mostrarFecha && (
                              <div
                                style={{
                                  textAlign: "center",
                                  margin: "14px 0 10px",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: 10,
                                    fontWeight: 600,
                                    color: "#9ca3af",
                                    background: "#fff",
                                    padding: "3px 12px",
                                    borderRadius: 12,
                                    border: "0.5px solid #e5e7eb",
                                  }}
                                >
                                  {msg.fechaEnvio
                                    ? format(
                                        new Date(msg.fechaEnvio),
                                        "EEEE d 'de' MMMM",
                                        { locale: es },
                                      )
                                    : ""}
                                </span>
                              </div>
                            )}
                            <motion.div
                              initial={{
                                opacity: 0,
                                x: isEstudiante ? 16 : -16,
                                scale: 0.92,
                              }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              style={{
                                display: "flex",
                                justifyContent: isEstudiante
                                  ? "flex-end"
                                  : "flex-start",
                                marginBottom: 6,
                              }}
                            >
                              <div style={{ maxWidth: "76%" }}>
                                {!isEstudiante && (
                                  <p
                                    style={{
                                      fontSize: 10,
                                      fontWeight: 700,
                                      color: "#059669",
                                      margin: "0 0 2px 10px",
                                    }}
                                  >
                                    {mypeNombre}
                                  </p>
                                )}
                                <div
                                  style={{
                                    padding: "8px 13px",
                                    borderRadius: 12,
                                    background: isEstudiante
                                      ? "#dcf8c5"
                                      : "#fff",
                                    border: isEstudiante
                                      ? "none"
                                      : "0.5px solid #e5e7eb",
                                    borderTopRightRadius: isEstudiante
                                      ? 4
                                      : 12,
                                    borderTopLeftRadius: isEstudiante
                                      ? 12
                                      : 4,
                                  }}
                                >
                                  <p
                                    style={{
                                      fontSize: 13,
                                      color: "#0f1f3d",
                                      margin: 0,
                                      lineHeight: 1.5,
                                      whiteSpace: "pre-wrap",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {msg.mensaje || msg.contenido}
                                  </p>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 4,
                                      justifyContent: "flex-end",
                                      marginTop: 4,
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: 9,
                                        color: "#9ca3af",
                                      }}
                                    >
                                      {hora}
                                    </span>
                                    {isEstudiante && (
                                      <CheckCircle2
                                        size={10}
                                        color="#9ca3af"
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </React.Fragment>
                        );
                      })
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div
                    style={{
                      padding: "12px 16px",
                      borderTop: "1px solid #e5e7eb",
                      background: "#fff",
                      display: "flex",
                      gap: 10,
                      flexShrink: 0,
                    }}
                  >
                    <input
                      type="text"
                      value={nuevoMensaje}
                      onChange={(e) => setNuevoMensaje(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleEnviarMensaje(e)
                      }
                      placeholder="Escribe un mensaje..."
                      disabled={isEnviandoMensaje}
                      style={{
                        flex: 1,
                        padding: "10px 16px",
                        borderRadius: 24,
                        border: "0.5px solid #e5e7eb",
                        background: "#f8fafc",
                        fontSize: 13,
                        outline: "none",
                        color: "#0f1f3d",
                        fontFamily: "inherit",
                      }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={handleEnviarMensaje}
                      disabled={!nuevoMensaje.trim() || isEnviandoMensaje}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        border: "none",
                        background: nuevoMensaje.trim()
                          ? "#10b981"
                          : "#e2e8f0",
                        color: "#fff",
                        cursor: nuevoMensaje.trim() ? "pointer" : "default",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isEnviandoMensaje ? (
                        <Loader2
                          size={16}
                          style={{ animation: "spin 1s linear infinite" }}
                        />
                      ) : (
                        <Send size={16} />
                      )}
                    </motion.button>
                  </div>
                </div>
              ) : (
                /* ─── PROYECTO EN EQUIPO: Sidebar + Chat Grupal ─── */
                <div
                  style={{
                    display: "flex",
                    height: "500px",
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: 260,
                      borderRight: "1px solid #e5e7eb",
                      display: "flex",
                      flexDirection: "column",
                      flexShrink: 0,
                      background: "#fff",
                    }}
                  >
                    <div
                      style={{
                        padding: "14px 16px",
                        borderBottom: "1px solid #f3f4f6",
                      }}
                    >
                      <h2
                        style={{
                          fontFamily: FONT,
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#0F1F3D",
                          margin: 0,
                        }}
                      >
                        Conversaciones
                      </h2>
                    </div>
                    <div style={{ flex: 1, overflowY: "auto" }}>
                      {/* Botón Equipo */}
                      <button
                        onClick={() => setChatTabActivo("EQUIPO")}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          background:
                            chatTabActivo === "EQUIPO" ? "#f8fafc" : "transparent",
                          border: "none",
                          borderLeft:
                            chatTabActivo === "EQUIPO"
                              ? "3px solid #1B6FE8"
                              : "3px solid transparent",
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          if (chatTabActivo !== "EQUIPO")
                            e.currentTarget.style.background = "#f8fafc";
                        }}
                        onMouseLeave={(e) => {
                          if (chatTabActivo !== "EQUIPO")
                            e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background:
                              chatTabActivo === "EQUIPO" ? "#1B6FE8" : "#e2e8f0",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            fontWeight: 700,
                          }}
                        >
                          EQ
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontFamily: FONT,
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#0F1F3D",
                              margin: 0,
                            }}
                          >
                            Equipo
                          </p>
                          <p
                            style={{
                              fontFamily: FONT,
                              fontSize: 10,
                              color: "#9CA3AF",
                              margin: "2px 0 0",
                            }}
                          >
                            Solo estudiantes
                          </p>
                        </div>
                      </button>

                      {/* Botón MYPE */}
                      <button
                        onClick={() => setChatTabActivo("PROYECTO")}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          background:
                            chatTabActivo === "PROYECTO" ? "#f8fafc" : "transparent",
                          border: "none",
                          borderLeft:
                            chatTabActivo === "PROYECTO"
                              ? "3px solid #10b981"
                              : "3px solid transparent",
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          if (chatTabActivo !== "PROYECTO")
                            e.currentTarget.style.background = "#f8fafc";
                        }}
                        onMouseLeave={(e) => {
                          if (chatTabActivo !== "PROYECTO")
                            e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background:
                              chatTabActivo === "PROYECTO" ? "#10b981" : "#e2e8f0",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            fontWeight: 700,
                          }}
                        >
                          {mypeNombre?.charAt(0) || "M"}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontFamily: FONT,
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#0F1F3D",
                              margin: 0,
                            }}
                          >
                            {mypeNombre}
                          </p>
                          <p
                            style={{
                              fontFamily: FONT,
                              fontSize: 10,
                              color: "#9CA3AF",
                              margin: "2px 0 0",
                            }}
                          >
                            Equipo + MYPE
                          </p>
                        </div>
                      </button>
                    </div>
                    <div
                      style={{
                        padding: "10px 16px",
                        borderTop: "1px solid #f3f4f6",
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: FONT,
                          fontSize: 10,
                          color: "#d1d5db",
                        }}
                      >
                        2 conversaciones
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {chatsGrupales?.length > 0 ? (
                      <ChatGrupalPanel
                        proyectoId={proyectoId}
                        chat={chatsGrupales.find(
                          (c) => c.tipo === chatTabActivo,
                        )}
                        mypeNombre={mypeNombre}
                      />
                    ) : (
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#f8fafc",
                        }}
                      >
                        <div style={{ textAlign: "center" }}>
                          <div
                            style={{
                              width: 64,
                              height: 64,
                              borderRadius: 16,
                              background: "#f1f5f9",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto 16px",
                            }}
                          >
                            <MessageSquare size={28} color="#d1d5db" />
                          </div>
                          <p
                            style={{
                              fontFamily: FONT,
                              fontSize: 15,
                              fontWeight: 600,
                              color: "#9CA3AF",
                            }}
                          >
                            Chats no disponibles
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

            {/* TAB: VOTACIÓN - SOLO si NO es proyecto individual */}
            {!esProyectoIndividual && activeTab === "votacion" && (
              <motion.div
                key="votacion"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{ padding: "20px 0" }}
              >
                {isLoadingVotacion ? (
                  <div style={{ textAlign: "center", padding: 40 }}>
                    <p style={{ color: "#64748b", fontSize: 13, fontFamily: FONT }}>
                      Cargando votación...
                    </p>
                  </div>
                ) : votacionCompletada && ganador ? (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: "#0f1f3d",
                        marginBottom: 4,
                        fontFamily: FONT,
                      }}
                    >
                      {ganador.estudianteNombre}
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#64748b",
                        marginBottom: 24,
                        fontFamily: FONT,
                      }}
                    >
                      Delegado del equipo
                    </p>

                    {votacion.candidatos?.length === 2 && (
                      <p
                        style={{
                          fontSize: 12,
                          color: "#94a3b8",
                          marginBottom: 32,
                          fontFamily: FONT,
                        }}
                      >
                        Elegido al azar por el sistema
                      </p>
                    )}

                    {/* Ranking para 3+ candidatos */}
                    {votacion.candidatos?.length > 2 && (
                      <div style={{ maxWidth: 400, margin: "0 auto 32px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 14,
                            justifyContent: "center",
                          }}
                        >
                          <div
                            style={{
                              width: 4,
                              height: 16,
                              borderRadius: 2,
                              background: "#64748b",
                            }}
                          />
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#64748b",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              fontFamily: FONT,
                            }}
                          >
                            Resultado
                          </span>
                        </div>
                        {[...votacion.candidatos]
                          .sort(
                            (a, b) =>
                              (b.votosRecibidos || 0) - (a.votosRecibidos || 0)
                          )
                          .map((c, idx) => {
                            const pct =
                              votacion.totalVotos > 0
                                ? Math.round(
                                    (c.votosRecibidos / votacion.totalVotos) * 100
                                  )
                                : 0;
                            return (
                              <div
                                key={c.estudianteId}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 12,
                                  padding: "12px 16px",
                                  borderRadius: 10,
                                  background: idx === 0 ? "#f8fafc" : "#ffffff",
                                  border:
                                    idx === 0
                                      ? "1px solid #cbd5e1"
                                      : "1px solid #e2e8f0",
                                  marginBottom: 6,
                                }}
                              >
                                <span
                                  style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 6,
                                    background:
                                      idx === 0 ? "#0f1f3d" : "#e2e8f0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: idx === 0 ? "#fff" : "#64748b",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    flexShrink: 0,
                                  }}
                                >
                                  {idx + 1}
                                </span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      marginBottom: 4,
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: "#0f1f3d",
                                        fontFamily: FONT,
                                      }}
                                    >
                                      {c.estudianteNombre}
                                    </span>
                                    <span
                                      style={{
                                        fontSize: 12,
                                        fontWeight: 500,
                                        color: "#64748b",
                                        fontFamily: FONT,
                                      }}
                                    >
                                      {c.votosRecibidos}{" "}
                                      {c.votosRecibidos !== 1
                                        ? "votos"
                                        : "voto"}{" "}
                                      · {pct}%
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      height: 4,
                                      borderRadius: 2,
                                      background: "#f1f5f9",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${pct}%` }}
                                      transition={{
                                        duration: 0.8,
                                        ease: "easeOut",
                                      }}
                                      style={{
                                        height: "100%",
                                        borderRadius: 2,
                                        background:
                                          idx === 0
                                            ? "#0f1f3d"
                                            : "#cbd5e1",
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}

                    <p
                      style={{
                        fontSize: 11,
                        color: "#94a3b8",
                        fontFamily: FONT,
                      }}
                    >
                      Todos los miembros pueden subir entregables
                    </p>
                  </div>
                ) : votacionActiva ? (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <h3
                      style={{
                        fontSize: 17,
                        fontWeight: 600,
                        color: "#0f1f3d",
                        marginBottom: 6,
                        fontFamily: FONT,
                      }}
                    >
                      Votación en curso
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#64748b",
                        marginBottom: 24,
                        fontFamily: FONT,
                      }}
                    >
                      Elige al delegado del equipo
                    </p>
                    <button
                      onClick={() => setShowVotacionModal(true)}
                      style={{
                        padding: "10px 24px",
                        borderRadius: 10,
                        border: "1px solid #0f1f3d",
                        background: "transparent",
                        color: "#0f1f3d",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: FONT,
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#0f1f3d";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#0f1f3d";
                      }}
                    >
                      Ir a votar
                    </button>

                    {/* Lista simple de candidatos */}
                    <div
                      style={{
                        marginTop: 28,
                        display: "flex",
                        gap: 12,
                        justifyContent: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      {votacion?.candidatos?.map((c) => (
                        <div
                          key={c.estudianteId}
                          style={{
                            padding: "10px 16px",
                            borderRadius: 10,
                            background: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            textAlign: "center",
                            minWidth: 120,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#0f1f3d",
                              fontFamily: FONT,
                            }}
                          >
                            {c.estudianteNombre}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 20px" }}>
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#0f1f3d",
                        marginBottom: 8,
                        fontFamily: FONT,
                      }}
                    >
                      Votación no disponible
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#64748b",
                        maxWidth: 360,
                        margin: "0 auto",
                        fontFamily: FONT,
                      }}
                    >
                      La votación de delegado se abrirá automáticamente cuando
                      todos los cupos del proyecto estén confirmados.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(-1)}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, border: "1px solid #E2E8F0", background: "#FFFFFF", fontSize: 12, fontWeight: 600, color: "#475569", cursor: "pointer", fontFamily: FONT }}
        >
          <ArrowLeft size={14} /> Volver
        </motion.button>
      </div>

      {/* Modal de subida */}
<AnimatePresence>
  {showUploadModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          if (!isSubiendo) {
            setShowUploadModal(false);
            setUploadError("");
            setUploadFile(null);
          }
        }}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{
          position: "relative",
          background: "#fff",
          borderRadius: 16,
          width: "100%",
          maxWidth: 440,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E2E8F0" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f1f3d", margin: 0 }}>Subir entregable</h3>
          <p style={{ fontSize: 12, color: "#64748B", margin: "4px 0 0" }}>{selectedEntregable}</p>
        </div>

        <div style={{ padding: "20px" }}>
          {uploadSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "20px 0" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                style={{ width: 48, height: 48, borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}
              >
                <CheckCircle2 size={24} color="#059669" />
              </motion.div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0f1f3d", margin: "0 0 4px" }}>Archivo subido</h4>
              <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>La MYPE será notificada</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubirEntregable}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4 }}>
                  Descripción <span style={{ fontWeight: 400, color: "#94a3b8" }}>(opcional)</span>
                </label>
                <textarea
                  value={uploadDescripcion}
                  onChange={(e) => setUploadDescripcion(e.target.value)}
                  placeholder="Breve descripción de la entrega..."
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #E2E8F0",
                    fontSize: 12,
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div
                onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                onDrop={(e) => {
  e.preventDefault();
  setDragActive(false);
  const file = e.dataTransfer.files?.[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("El archivo supera el tamaño máximo de 5 MB");
      setUploadFile(null);
      return;
    }
    const allowedExtensions = ['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !allowedExtensions.includes(ext)) {
      setUploadError("Formato no permitido. Solo se aceptan: PDF, Word, TXT y PowerPoint.");
      setUploadFile(null);
      return;
    }
    setUploadFile(file);
    setUploadError("");
  }
}}
                style={{
                  padding: "20px",
                  borderRadius: 10,
                  textAlign: "center",
                  border: `2px dashed ${dragActive ? "#1B6FE8" : uploadFile ? "#10b981" : "#E2E8F0"}`,
                  background: dragActive ? "#EFF6FF" : uploadFile ? "#ECFDF5" : "#FAFAFA",
                  transition: "all 0.2s",
                  marginBottom: 16,
                  cursor: "pointer",
                }}
              >
                <input
                  type="file"
                  id="file-input"
                  style={{ display: "none" }}
                  onChange={(e) => {
  const file = e.target.files?.[0];
  if (file) {
    // Validar tamaño
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("El archivo supera el tamaño máximo de 5 MB");
      setUploadFile(null);
      return;
    }
    // Validar extensión
    const allowedExtensions = ['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !allowedExtensions.includes(ext)) {
      setUploadError("Formato no permitido. Solo se aceptan: PDF, Word, TXT y PowerPoint.");
      setUploadFile(null);
      return;
    }
    setUploadFile(file);
    setUploadError("");
  }
}}
                />
                {uploadFile ? (
                  <div>
                    <FileText size={24} color="#1B6FE8" style={{ marginBottom: 6 }} />
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#0f1f3d", margin: "0 0 2px" }}>{uploadFile.name}</p>
                    <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 6px" }}>{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button type="button" onClick={() => setUploadFile(null)} style={{ fontSize: 11, color: "#dc2626", border: "none", background: "none", cursor: "pointer" }}>Cambiar archivo</button>
                  </div>
                ) : (
                  <label htmlFor="file-input" style={{ cursor: "pointer" }}>
                    <Upload size={24} color="#94a3b8" style={{ marginBottom: 6 }} />
                    <p style={{ fontSize: 12, fontWeight: 500, color: "#64748B", margin: "0 0 4px" }}>Arrastra tu archivo o haz clic</p>
                    <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>
                      PDF, Word, TXT, PowerPoint · Máx. 5 MB
                    </p>
                  </label>
                )}
              </div>

              {uploadError && (
                <p style={{ fontSize: 11, color: "#dc2626", marginBottom: 12 }}>{uploadError}</p>
              )}

              {isSubiendo && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: "#64748B" }}>Subiendo…</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: "#1B6FE8" }}>{uploadProgress}%</span>
                  </div>
                  <div style={{ width: "100%", height: 4, borderRadius: 2, background: "#F1F5F9", overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                      style={{ height: "100%", background: "linear-gradient(90deg, #1B6FE8, #8B5CF6)", borderRadius: 2 }}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadError("");
                    setUploadFile(null);
                  }}
                  style={{
                    flex: 1,
                    padding: "9px 0",
                    borderRadius: 8,
                    border: "1px solid #E2E8F0",
                    background: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#64748B",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!uploadFile || isSubiendo}
                  style={{
                    flex: 1,
                    padding: "9px 0",
                    borderRadius: 8,
                    border: "none",
                    background: !uploadFile ? "#E2E8F0" : "#1B6FE8",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: !uploadFile ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  {isSubiendo ? (
                    <>
                      <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Subiendo…
                    </>
                  ) : (
                    <>Subir entregable</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      {/* Modal de Votación */}
      <AnimatePresence>
        {showVotacionModal && <VotacionModal proyectoId={proyectoId} onClose={() => setShowVotacionModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default ProyectoWorkspacePage;
