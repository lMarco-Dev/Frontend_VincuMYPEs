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
} from "lucide-react";
import { useWorkspaceRealTime } from "@/features/workspace/useWorkspaceRealTime";
import { useWorkspaceActions } from "@/features/workspace/useWorkspaceActions";
import { VotacionModal } from "@/shared/components/votacion/VotacionModal";
import { ChatGrupalPanel } from "@/shared/components/chat/ChatGrupalPanel";
import { ChatTabs } from "@/shared/components/chat/ChatTabs";
import { useVotacion, useEsDelegado } from "@/features/votacion/useVotacion";
import { useChatsGrupo } from "@/features/chat-grupal/useChatGrupal";
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

const LinearStatsChart = ({
  completados,
  enRevision,
  pendientes,
  rechazados = 0,
  total,
}) => {
  const pctCompletados = total > 0 ? (completados / total) * 100 : 0;
  const pctEnRevision = total > 0 ? (enRevision / total) * 100 : 0;
  const pctPendientes = total > 0 ? (pendientes / total) * 100 : 0;
  const pctRechazados = total > 0 ? (rechazados / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: C.card,
        borderRadius: 20,
        border: `0.5px solid ${C.border}`,
        padding: "20px 28px",
        marginBottom: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 4,
            height: 20,
            borderRadius: 2,
            background: C.primary,
          }}
        />
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: C.textPrimary,
            margin: 0,
          }}
        >
          Distribución de entregables
        </h3>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            height: 12,
            borderRadius: 12,
            overflow: "hidden",
            background: "#f1f5f9",
          }}
        >
          {pctCompletados > 0 && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pctCompletados}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ height: "100%", background: CHART_COLORS.completados }}
            />
          )}
          {pctEnRevision > 0 && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pctEnRevision}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              style={{ height: "100%", background: CHART_COLORS.enRevision }}
            />
          )}
          {pctPendientes > 0 && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pctPendientes}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              style={{ height: "100%", background: CHART_COLORS.pendientes }}
            />
          )}
          {pctRechazados > 0 && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pctRechazados}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              style={{ height: "100%", background: CHART_COLORS.rechazados }}
            />
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          paddingTop: 16,
          borderTop: `0.5px solid ${C.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              background: CHART_COLORS.completados,
            }}
          />
          <span style={{ fontSize: 12, color: C.textSecondary }}>
            Aprobados
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>
            {completados}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              background: CHART_COLORS.enRevision,
            }}
          />
          <span style={{ fontSize: 12, color: C.textSecondary }}>
            En revisión
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>
            {enRevision}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              background: CHART_COLORS.pendientes,
            }}
          />
          <span style={{ fontSize: 12, color: C.textSecondary }}>
            Pendientes
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>
            {pendientes}
          </span>
        </div>
        {rechazados > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background: CHART_COLORS.rechazados,
              }}
            />
            <span style={{ fontSize: 12, color: C.textSecondary }}>
              Requieren cambios
            </span>
            <span
              style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}
            >
              {rechazados}
            </span>
          </div>
        )}
      </div>
      <div
        style={{
          marginTop: 18,
          paddingTop: 12,
          borderTop: `0.5px solid ${C.border}`,
        }}
      >
        <p
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: C.textSecondary,
            margin: 0,
          }}
        >
          {completados === total && total > 0
            ? "🎉 ¡Felicidades! Todos los entregables aprobados."
            : completados > 0
              ? `✅ Llevas ${completados} de ${total} aprobados.`
              : pendientes > 0
                ? `${pendientes} entregable${pendientes !== 1 ? "s" : ""} pendiente${pendientes !== 1 ? "s" : ""}.`
                : "Sube tus entregables para avanzar."}
        </p>
      </div>
    </motion.div>
  );
};

const HeroRing = ({ value = 0, max = 1, size = 88 }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const sw = 7,
    r = (size - sw) / 2,
    circ = 2 * Math.PI * r,
    offset = circ - (pct / 100) * circ,
    id = "multiRing";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="33%" stopColor="#eab308" />
            <stop offset="66%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#eef0f3"
          strokeWidth={sw}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#${id})`}
          strokeWidth={sw}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#0f1f3d",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {Math.round(pct)}%
        </span>
        <span
          style={{
            fontSize: 8,
            fontWeight: 600,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginTop: 2,
          }}
        >
          completado
        </span>
      </div>
    </div>
  );
};

const EstadoBadge = ({ estado }) => {
  const configs = {
    APROBADO: { bg: "#ecfdf5", color: "#10b981", label: "Aprobado" },
    EN_REVISION: { bg: "#fffbeb", color: "#eab308", label: "En Revisión" },
    PENDIENTE_REVISION: {
      bg: "#eff6ff",
      color: "#eab308",
      label: "Pendiente Revisión",
    },
    PENDIENTE: { bg: "#f3f4f6", color: "#6b7280", label: "Pendiente" },
    RECHAZADO: { bg: "#fef2f2", color: "#ef4444", label: "Requiere Cambios" },
  };
  const cfg = configs[estado] || configs.PENDIENTE;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 9,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        background: cfg.bg,
        color: cfg.color,
        border: `0.5px solid ${cfg.color}30`,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: cfg.color,
          display: "inline-block",
        }}
      />
      {cfg.label}
    </span>
  );
};

const EntregableCard = ({
  titulo,
  entregable,
  onUpload,
  onDownload,
  onDelete,
  index,
  esDelegado,
  esProyectoIndividual,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const tieneArchivo = !!entregable?.archivo;
  const estado = entregable?.estado || "PENDIENTE";
  const tieneFeedback = !!entregable?.observaciones;
  const entregaId = entregable?.id;
  const barColor =
    estado === "APROBADO"
      ? "#10b981"
      : estado === "EN_REVISION" || estado === "PENDIENTE_REVISION"
        ? "#eab308"
        : estado === "RECHAZADO"
          ? "#ef4444"
          : "#9ca3af";

  // ✅ Si es proyecto individual, siempre puede subir
  const puedeSubir = esProyectoIndividual || esDelegado;

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
    const ext = (entregable?.archivoNombre || "")
      .split(".")
      .pop()
      ?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
      return <FileImage size={18} color={C.primary} />;
    if (ext === "pdf") return <FileText size={18} color="#dc2626" />;
    return <FileArchive size={18} color={C.textMuted} />;
  };

  const handleUploadClick = () => {
    if (!puedeSubir) {
      alert("Solo el delegado del equipo puede subir entregables.");
      return;
    }
    onUpload(titulo);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ height: "100%", position: "relative" }}
    >
      <div
        style={{
          background: C.card,
          borderRadius: 16,
          border: `1px solid ${hovered ? `${C.primary}30` : C.border}`,
          overflow: "hidden",
          transition: "all 0.3s",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {showDeleteConfirm && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(2px)",
              zIndex: 10,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 16,
                width: "80%",
                maxWidth: 260,
                textAlign: "center",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                border: `1px solid ${C.border}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.textPrimary,
                  marginBottom: 16,
                }}
              >
                ¿Eliminar "
                {titulo.length > 40 ? titulo.slice(0, 40) + "…" : titulo}"?
              </p>
              <div
                style={{ display: "flex", gap: 8, justifyContent: "center" }}
              >
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: `0.5px solid ${C.border}`,
                    background: "#fff",
                    fontSize: 11,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: "none",
                    background: "#dc2626",
                    color: "#fff",
                    fontSize: 11,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <div
          style={{
            height: 90,
            background: tieneArchivo
              ? `linear-gradient(135deg, ${barColor}12, ${barColor}06)`
              : "#f8fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: `3px solid ${barColor}`,
            position: "relative",
          }}
        >
          {tieneArchivo ? (
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 36,
                  height: 46,
                  background: "#fff",
                  borderRadius: 6,
                  border: `0.5px solid ${C.border}`,
                  borderTop: `3px solid ${barColor}`,
                  margin: "0 auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {getFileIcon()}
              </div>
              <span
                style={{
                  fontSize: 7,
                  fontWeight: 600,
                  color: barColor,
                  marginTop: 5,
                  display: "block",
                }}
              >
                {(entregable?.archivoNombre || "")
                  .split(".")
                  .pop()
                  ?.toUpperCase()}
              </span>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: `2px dashed ${hovered ? C.primary : "#d1d5db"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                }}
              >
                <Upload size={16} color={hovered ? C.primary : "#d1d5db"} />
              </div>
              <span
                style={{
                  fontSize: 9,
                  color: "#9ca3af",
                  fontWeight: 500,
                  marginTop: 5,
                  display: "block",
                }}
              >
                Sin archivo
              </span>
            </div>
          )}
        </div>

        <div style={{ padding: "14px 16px", flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  color: C.textMuted,
                  background: "#f1f5f9",
                  padding: "2px 6px",
                  borderRadius: 8,
                }}
              >
                #{index + 1}
              </span>
              <EstadoBadge estado={estado} />
            </div>
            {tieneArchivo && puedeSubir && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#9ca3af",
                  cursor: "pointer",
                  padding: 4,
                  borderRadius: 4,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#dc2626")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>

          <h4
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: C.textPrimary,
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {titulo}
          </h4>

          {tieneArchivo && (
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 8,
                padding: 8,
                marginTop: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 5,
                    background: "#fff",
                    border: `0.5px solid ${C.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {getFileIcon()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: C.textPrimary,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {entregable.archivoNombre || "Archivo"}
                    </span>
                    {entregable.subidoPorNombre && (
                      <span
                        style={{
                          fontSize: 8,
                          fontWeight: 600,
                          background: "#fef3c7",
                          color: "#92400e",
                          padding: "1px 6px",
                          borderRadius: 6,
                          border: "0.5px solid #fbbf24",
                          whiteSpace: "nowrap",
                        }}
                      >
                        📎 {entregable.subidoPorNombre}
                      </span>
                    )}
                  </div>
                  {entregable.fechaSubida && (
                    <p
                      style={{
                        fontSize: 8,
                        color: C.textMuted,
                        margin: "2px 0 0",
                      }}
                    >
                      {formatDistanceToNow(new Date(entregable.fechaSubida), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
            {tieneArchivo ? (
              <>
                <button
                  onClick={handleViewFile}
                  style={{
                    flex: 1,
                    padding: "7px",
                    borderRadius: 8,
                    border: `0.5px solid ${C.border}`,
                    background: "#fff",
                    color: C.primary,
                    fontSize: 10,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <Eye size={12} /> Ver
                </button>
                <button
                  onClick={() =>
                    onDownload(
                      entregable.archivoUrl || entregable.archivo,
                      entregable.archivoNombre,
                    )
                  }
                  style={{
                    flex: 1,
                    padding: "7px",
                    borderRadius: 8,
                    border: `0.5px solid ${C.border}`,
                    background: "#fff",
                    color: C.textSecondary,
                    fontSize: 10,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <Download size={12} /> Descargar
                </button>
                {puedeSubir ? (
                  <button
                    onClick={() => onUpload(titulo)}
                    style={{
                      padding: "7px 10px",
                      borderRadius: 8,
                      border: `0.5px solid ${C.border}`,
                      background: "#f8fafc",
                      cursor: "pointer",
                    }}
                    title="Actualizar archivo"
                  >
                    <RefreshCw size={12} color={C.textMuted} />
                  </button>
                ) : (
                  <button
                    disabled
                    style={{
                      padding: "7px 10px",
                      borderRadius: 8,
                      border: `0.5px solid ${C.border}`,
                      background: "#f1f5f9",
                      cursor: "not-allowed",
                      opacity: 0.5,
                    }}
                    title="Solo el delegado puede actualizar"
                  >
                    <RefreshCw size={12} color="#9ca3af" />
                  </button>
                )}
              </>
            ) : puedeSubir ? (
              <button
                onClick={handleUploadClick}
                style={{
                  width: "100%",
                  padding: "9px",
                  borderRadius: 8,
                  border: "none",
                  background: C.primary,
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <Upload size={14} /> Subir entregable
              </button>
            ) : (
              <button
                disabled
                style={{
                  width: "100%",
                  padding: "9px",
                  borderRadius: 8,
                  border: "none",
                  background: "#e2e8f0",
                  color: "#94a3b8",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
                title="Solo el delegado puede subir entregables"
              >
                🔒 Solo el delegado puede subir
              </button>
            )}
          </div>

          {tieneFeedback && (
            <div style={{ marginTop: 12 }}>
              <button
                onClick={() => setExpanded(!expanded)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: `0.5px solid #fde68a`,
                  background: "#fffbeb",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{ fontSize: 10, fontWeight: 700, color: C.warning }}
                >
                  📝 Recomendaciones
                </span>
                <ChevronDown
                  size={12}
                  color={C.warning}
                  style={{
                    transform: expanded ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                  }}
                />
              </button>
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      style={{
                        marginTop: 6,
                        padding: 10,
                        borderRadius: 8,
                        background: "#fffbeb",
                        border: `0.5px solid #fde68a`,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 11,
                          color: C.textPrimary,
                          margin: 0,
                          lineHeight: 1.5,
                        }}
                      >
                        {entregable.observaciones}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
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
  const [chatTabActivo, setChatTabActivo] = useState("EQUIPO");

  const quickEmojis = [
    "👍",
    "👏",
    "🎉",
    "💪",
    "🔥",
    "✅",
    "🙌",
    "😊",
    "🚀",
    "⭐",
    "😄",
    "🙏",
    "👀",
    "📄",
    "💡",
    "⏰",
  ];

  const {
    proyecto,
    entregables,
    mensajes,
    conversacionId,
    mype,
    isLoading,
    errorProyecto,
    proyectoError,
    recargarWorkspace,
  } = useWorkspaceRealTime(proyectoId);
  const {
    subirEntregable,
    isSubiendo,
    uploadProgress,
    enviarMensaje,
    isEnviandoMensaje,
    descargarArchivo,
    eliminarEntregable,
    resetUpload,
  } = useWorkspaceActions(proyectoId);
  const { votacion, isLoading: isLoadingVotacion } = useVotacion(proyectoId);
  const { esDelegado } = useEsDelegado(proyectoId);
  const { chats: chatsGrupales } = useChatsGrupo(proyectoId);

  const votacionActiva = votacion?.estado === "EN_VOTACION";
  const votacionCompletada = votacion?.estado === "COMPLETADA";
  const ganador = votacion?.candidatos?.find((c) => c.esGanador);

  // ✅ NUEVO: Detectar si es proyecto individual
  const esProyectoIndividual = proyecto?.cupos === 1;

  useEffect(() => {
    if (activeTab === "chat" && chatEndRef.current && mensajes.length > 0) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mensajes, activeTab]);
  useEffect(() => {
    const handler = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target))
        setShowEmoji(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
    if (!esDelegado && !esProyectoIndividual) {
      setUploadError("Solo el delegado del equipo puede subir entregables");
      return;
    }
    if (!uploadFile || !selectedEntregable) {
      setUploadError("Selecciona un archivo");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("titulo", selectedEntregable);
      formData.append(
        "descripcion",
        uploadDescripcion || `Entrega: ${selectedEntregable}`,
      );
      formData.append("archivo", uploadFile);
      await subirEntregable({ formData });
      setUploadSuccess(true);
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadSuccess(false);
        setUploadFile(null);
        setUploadDescripcion("");
        setSelectedEntregable(null);
        resetUpload();
        recargarWorkspace();
      }, 1800);
    } catch (err) {
      setUploadError(
        err.response?.data?.message || err.message || "Error al subir",
      );
    }
  };

  const handleEliminarEntregable = async (entregableId) => {
    if (!esDelegado && !esProyectoIndividual) {
      alert("Solo el delegado puede eliminar entregables");
      return;
    }
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
    if (Array.isArray(raw))
      return raw.filter((e) => e && String(e).trim().length > 0);
    if (typeof raw === "string") {
      const texto = raw.trim();
      let items = texto
        .split("•")
        .map((e) => e.trim())
        .filter((e) => e.length > 0);
      if (items.length <= 1)
        items = texto
          .split("\n")
          .map((e) => e.trim())
          .filter((e) => e.length > 0)
          .map((e) => e.replace(/^[•\-*\d+.)]\s*/, "").trim());
      if (items.length <= 1)
        items = texto
          .split(/\.\s+(?=[A-ZÁÉÍÓÚÑ])/)
          .map((e) => e.trim())
          .filter((e) => e.length > 0)
          .map((e) => (e.endsWith(".") ? e : e + "."));
      return items.filter((i) => i.length > 3);
    }
    return [];
  };

  const entregablesProyecto = parseEntregablesDelProyecto();
  const mypeNombre = mype?.nombre || proyecto?.mypeNombre || "MYPE";

  const currentStats = {
    total: entregablesProyecto.length,
    completados: entregables.filter((e) => e.estado === "APROBADO").length,
    enRevision: entregables.filter(
      (e) => e.estado === "EN_REVISION" || e.estado === "PENDIENTE_REVISION",
    ).length,
    pendientes: entregables.filter((e) => e.estado === "PENDIENTE").length,
    rechazados: entregables.filter((e) => e.estado === "RECHAZADO").length,
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 20,
              background: `linear-gradient(135deg, ${C.primary}, ${C.purple})`,
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Loader2 size={28} color="#fff" />
          </motion.div>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>
            Cargando Workspace
          </p>
        </div>
      </div>
    );
  }

  if (errorProyecto || !proyecto) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 360 }}>
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: 20,
              background: "#fef2f2",  fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <AlertCircle size={32} color="#dc2626" />
          </div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: C.textPrimary,
              marginBottom: 8,
            }}
          >
            Error al cargar
          </h1>
          <p style={{ fontSize: 13, color: C.textSecondary, marginBottom: 24 }}>
            {proyectoError?.message || "No se pudo cargar el proyecto"}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={recargarWorkspace}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: "none",
                background: C.primary,
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Reintentar
            </button>
            <button
              onClick={() => navigate(-1)}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: `0.5px solid ${C.border}`,
                background: "#fff",
                color: C.textPrimary,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "Inter, Arial, 'Helvetica Neue', sans-serif",
        background: C.bg,
        minHeight: "100vh",
        padding: "28px 32px",
        maxWidth: 1400,
        margin: "0 auto",
      }}
    >
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Hero Banner */}
<motion.div
  initial={{ opacity: 0, y: -16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  style={{
    background: "#fff",
    borderRadius: 20,
    border: `0.5px solid ${C.border}`,
    padding: "24px 28px",
    marginBottom: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  }}
>
  <div style={{ flex: 1, minWidth: 0 }}>
    {/* Línea azul + título (estilo Mis Workspaces) */}
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <div style={{ width: 4, height: 20, borderRadius: 2, background: C.primary, flexShrink: 0 }} />
      <h1
        style={{
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "#0f1f3d",
          margin: 0,
          lineHeight: 1.25,
        }}
      >
        {proyecto.titulo}
      </h1>
    </div>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 12,
        fontWeight: 500,
        color: "#6b6b7a",
        flexWrap: "wrap",
        marginLeft: 14,
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <motion.span
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(16,185,129,0.5)",
              "0 0 0 6px rgba(16,185,129,0)",
              "0 0 0 0 rgba(16,185,129,0)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }}
        />
        Proyecto activo
      </span>

      <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#cbd5e1", display: "inline-block" }} />
      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <User size={12} /> {mypeNombre}
      </span>

      {proyecto.fechaLimite && (
        <>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#cbd5e1", display: "inline-block" }} />
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Calendar size={12} /> Límite:{" "}
            <span style={{ color: "#dc2626", fontWeight: 600 }}>
              {format(new Date(proyecto.fechaLimite), "d 'de' MMMM, yyyy", { locale: es })}
            </span>
          </span>
        </>
      )}

       

    </div>
  </div>

  <div style={{ flexShrink: 0 }}>
    <HeroRing value={currentStats.completados} max={currentStats.total} size={88} />
  </div>
</motion.div>

      <LinearStatsChart
        completados={currentStats.completados}
        enRevision={currentStats.enRevision}
        pendientes={currentStats.pendientes}
        rechazados={currentStats.rechazados}
        total={currentStats.total}
      />
            {/* ✅ BANNER: Elegir delegado (solo proyectos en equipo con votación activa) */}
      {!esProyectoIndividual && votacionActiva && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{
            background: "linear-gradient(135deg, #fef3c7, #fffbeb)",
            border: "1px solid #fbbf24",
            borderRadius: 14,
            padding: "14px 20px",
            marginBottom: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
              }}
            >
              <Vote size={20} color="#fff" />
            </motion.div>
            <div>
              <h4
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#92400e",
                  margin: "0 0 3px",
                }}
              >
                 ¡Elige al delegado del equipo!
              </h4>
              <p
                style={{
                  fontSize: 12,
                  color: "#a16207",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Solo el delegado podrá subir los entregables.{" "}
                <strong>Tu voto es importante</strong> para coordinar mejor.
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab("votacion")}
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              color: "#7c2d12",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 7,
              boxShadow: "0 3px 10px rgba(245,158,11,0.25)",
              flexShrink: 0,
            }}
          >
            <Vote size={15} /> Ir a votar
          </motion.button>
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: "#fff",
          borderRadius: 20,
          border: `0.5px solid ${C.border}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            borderBottom: `0.5px solid ${C.border}`,
            padding: "0 8px",
          }}
        >
          {[
            {
              id: "entregables",
              label: "Entregables",
              count: `${currentStats.completados}/${currentStats.total}`,
              icon: <ListChecks size={15} />,
            },
            {
              id: "chat",
              label: "Chat",
              count: (mensajes?.length || 0) + (chatsGrupales?.length || 0),
              icon: <MessageSquare size={15} />,
            },
            // ✅ OCULTAR pestaña Votación si es proyecto individual
            ...(esProyectoIndividual
              ? []
              : [
                  {
                    id: "votacion",
                    label: "Votación",
                    count: votacionActiva
                      ? "🔴"
                      : votacionCompletada
                        ? "✅"
                        : "",
                    icon: <Vote size={15} />,
                  },
                ]),
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ y: -1 }}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                padding: "13px 20px",
                fontSize: 13,
                fontWeight: 700,
                border: "none",
                background: "transparent",
                color: activeTab === tab.id ? C.primary : C.textMuted,
                cursor: "pointer",
                position: "relative",
                transition: "color 0.2s",
              }}
            >
              {tab.icon} {tab.label}
              {tab.count > 0 && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 12,
                    background: activeTab === tab.id ? "#eff6ff" : "#f1f5f9",
                    color: activeTab === tab.id ? C.primary : C.textMuted,
                  }}
                >
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: C.primary,
                    borderRadius: "2px 2px 0 0",
                  }}
                />
              )}
            </motion.button>
          ))}
        </div>

        <div style={{ padding: "24px 28px" }}>
          <AnimatePresence mode="wait">
            {/* TAB: ENTREGABLES */}
            {activeTab === "entregables" && (
              <motion.div
                key="entregables"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* ✅ OCULTAR banner delegado si es proyecto individual */}
                {votacionCompletada && ganador && !esProyectoIndividual && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: esDelegado
                        ? "linear-gradient(135deg, #ecfdf5, #d1fae5)"
                        : "linear-gradient(135deg, #eff6ff, #dbeafe)",
                      border: esDelegado
                        ? "1px solid #6ee7b7"
                        : "1px solid #bfdbfe",
                      borderRadius: 12,
                      padding: "12px 16px",
                      marginBottom: 20,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: esDelegado
                          ? "linear-gradient(135deg, #10b981, #059669)"
                          : "linear-gradient(135deg, #1B6FE8, #06B6D4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {esDelegado ? (
                        <Crown size={20} color="#fff" />
                      ) : (
                        <Shield size={20} color="#fff" />
                      )}
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#0f1f3d",
                          margin: 0,
                        }}
                      >
                        {esDelegado
                          ? "¡Eres el delegado del equipo!"
                          : `Delegado: ${ganador.estudianteNombre}`}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#6b7280",
                          margin: "2px 0 0",
                        }}
                      >
                        {esDelegado
                          ? "Solo tú puedes subir los entregables del equipo."
                          : `Solo el puede subir entregables.`}
                      </p>
                    </div>  
                  </motion.div>
                )}
                {entregablesProyecto.length > 0 ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 20,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 4,
                            height: 18,
                            borderRadius: 2,
                            background: C.primary,
                            flexShrink: 0,
                          }}
                        />
                        <h3
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: C.textPrimary,
                            margin: 0,
                          }}
                        >
                          Lista de entregables
                        </h3>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: C.textMuted,
                            background: "#f1f5f9",
                            padding: "3px 10px",
                            borderRadius: 12,
                          }}
                        >
                          {entregablesProyecto.length}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(360px, 1fr))",
                        gap: 16,
                      }}
                    >
                      {entregablesProyecto.map((titulo, idx) => {
                        const entrega = entregables.find(
                          (e) =>
                            e.titulo?.toLowerCase() === titulo.toLowerCase(),
                        );
                        return (
                          <EntregableCard
                            key={`e-${idx}`}
                            titulo={titulo}
                            index={idx}
                            entregable={entrega || null}
                            esDelegado={esDelegado}
                            esProyectoIndividual={esProyectoIndividual}
                            onUpload={(t) => {
                              if (!esDelegado && !esProyectoIndividual) {
                                alert(
                                  "Solo el delegado puede subir entregables",
                                );
                                return;
                              }
                              setSelectedEntregable(t);
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
                    <FileText
                      size={48}
                      color={C.textMuted}
                      style={{ marginBottom: 16 }}
                    />
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: C.textPrimary,
                        marginBottom: 6,
                      }}
                    >
                      No hay entregables definidos
                    </h3>
                    <p style={{ fontSize: 13, color: C.textMuted }}>
                      La MYPE aún no ha definido los entregables para este
                      proyecto.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB: CHAT */}
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
                    <div
                      style={{
                        padding: "14px 20px",
                        borderBottom: "1px solid #e5e7eb",
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        flexShrink: 0,
                      }}
                    >
                      <div style={{ position: "relative" }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #10b981, #059669)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 15,
                            fontWeight: 700,
                            color: "#fff",
                          }}
                        >
                          {mypeNombre.charAt(0).toUpperCase()}
                        </div>
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            width: 11,
                            height: 11,
                            borderRadius: "50%",
                            background: "#10b981",
                            border: "2px solid #fff",
                          }}
                        />
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#0F1F3D",
                            margin: 0,
                          }}
                        >
                          {mypeNombre}
                        </p>
                        <p
                          style={{
                            fontSize: 10,
                            color: "#10b981",
                            fontWeight: 600,
                            margin: 0,
                          }}
                        >
                          Chat directo
                        </p>
                      </div>
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
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
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
                            fontFamily: "Inter, Arial, sans-serif",
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
                        <button
                          onClick={() => setChatTabActivo("EQUIPO")}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            background:
                              chatTabActivo === "EQUIPO"
                                ? "#eff6ff"
                                : "transparent",
                            border: "none",
                            borderBottom: "1px solid #f9fafb",
                            borderLeft:
                              chatTabActivo === "EQUIPO"
                                ? "3px solid #1B6FE8"
                                : "3px solid transparent",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.15s",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                          onMouseEnter={(e) => {
                            if (chatTabActivo !== "EQUIPO")
                              e.currentTarget.style.background = "#f9fafb";
                          }}
                          onMouseLeave={(e) => {
                            if (chatTabActivo !== "EQUIPO")
                              e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background:
                                chatTabActivo === "EQUIPO"
                                  ? "linear-gradient(135deg, #1B6FE8, #06B6D4)"
                                  : "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
                              border:
                                chatTabActivo === "EQUIPO"
                                  ? "2px solid #1B6FE8"
                                  : "2px solid #BFDBFE",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Users
                              size={16}
                              color={
                                chatTabActivo === "EQUIPO" ? "#fff" : "#1D4ED8"
                              }
                            />
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
                              Chat de Equipo
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
                        <button
                          onClick={() => setChatTabActivo("PROYECTO")}
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            background:
                              chatTabActivo === "PROYECTO"
                                ? "#eff6ff"
                                : "transparent",
                            border: "none",
                            borderBottom: "1px solid #f9fafb",
                            borderLeft:
                              chatTabActivo === "PROYECTO"
                                ? "3px solid #1B6FE8"
                                : "3px solid transparent",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.15s",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                          onMouseEnter={(e) => {
                            if (chatTabActivo !== "PROYECTO")
                              e.currentTarget.style.background = "#f9fafb";
                          }}
                          onMouseLeave={(e) => {
                            if (chatTabActivo !== "PROYECTO")
                              e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background:
                                chatTabActivo === "PROYECTO"
                                  ? "linear-gradient(135deg, #7C3AED, #A855F7)"
                                  : "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
                              border:
                                chatTabActivo === "PROYECTO"
                                  ? "2px solid #7C3AED"
                                  : "2px solid #DDD6FE",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Building2
                              size={16}
                              color={
                                chatTabActivo === "PROYECTO"
                                  ? "#fff"
                                  : "#7C3AED"
                              }
                            />
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
                              Chat del Proyecto
                            </p>
                            <p
                              style={{
                                fontFamily: FONT,
                                fontSize: 10,
                                color: "#9CA3AF",
                                margin: "2px 0 0",
                              }}
                            >
                              Equipo + {mypeNombre}
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
                    <Loader2
                      size={32}
                      className="animate-spin"
                      color="#1B6FE8"
                    />
                    <p
                      style={{ marginTop: 12, color: "#6b7280", fontSize: 13 }}
                    >
                      Cargando votación...
                    </p>
                  </div>
                ) : votacionCompletada && ganador ? (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    {/* ✅ Si son 2: mostrar dado animado. Si son más: corona */}
                    {votacion.candidatos?.length === 2 ? (
                                                  <div style={{ perspective: "300px", margin: "0 auto 16px", width: 80, height: 80 }}>
                        <motion.div
                          animate={{ 
                            rotateX: [0, 360, 720],
                            rotateY: [0, 360, 720],
                            rotateZ: [0, 90, 180]
                          }}
                          transition={{ duration: 8, ease: "easeInOut", repeat: Infinity, repeatDelay: 4 }}
                          style={{
                            width: 80,
                            height: 80,
                            position: "relative",
                            transformStyle: "preserve-3d",
                            transform: "rotateX(-25deg) rotateY(-35deg)",
                          }}
                        >
                          {/* Cara 1 - FRONTAL (⚀ 1) */}
                          <div style={{
                            position: "absolute", width: 80, height: 80,
                            background: "linear-gradient(135deg, #fff, #fef3c7)",
                            border: "2px solid #fbbf24",
                            borderRadius: 12,
                            transform: "translateZ(40px)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "inset 0 0 15px rgba(0,0,0,0.05)"
                          }}>
                            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#1a1a2e" }} />
                          </div>
                          {/* Cara 2 - TRASERA (⚅ 6) */}
                          <div style={{
                            position: "absolute", width: 80, height: 80,
                            background: "linear-gradient(135deg, #fff, #fef3c7)",
                            border: "2px solid #fbbf24",
                            borderRadius: 12,
                            transform: "rotateY(180deg) translateZ(40px)",
                            display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr 1fr",
                            padding: 12, boxSizing: "border-box",
                            boxShadow: "inset 0 0 15px rgba(0,0,0,0.05)"
                          }}>
                            {[...Array(6)].map((_, i) => (
                              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1a1a2e" }} />
                              </div>
                            ))}
                          </div>
                          {/* Cara 3 - DERECHA (⚃ 4) */}
                          <div style={{
                            position: "absolute", width: 80, height: 80,
                            background: "linear-gradient(135deg, #fff, #fef3c7)",
                            border: "2px solid #fbbf24",
                            borderRadius: 12,
                            transform: "rotateY(90deg) translateZ(40px)",
                            display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr",
                            padding: 14, boxSizing: "border-box", gap: 4,
                            boxShadow: "inset 0 0 15px rgba(0,0,0,0.05)"
                          }}>
                            {[...Array(4)].map((_, i) => (
                              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#1a1a2e" }} />
                              </div>
                            ))}
                          </div>
                          {/* Cara 4 - IZQUIERDA (⚂ 3) */}
                          <div style={{
                            position: "absolute", width: 80, height: 80,
                            background: "linear-gradient(135deg, #fff, #fef3c7)",
                            border: "2px solid #fbbf24",
                            borderRadius: 12,
                            transform: "rotateY(-90deg) translateZ(40px)",
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            gap: 10, boxSizing: "border-box",
                            boxShadow: "inset 0 0 15px rgba(0,0,0,0.05)"
                          }}>
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1a1a2e" }} />
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1a1a2e" }} />
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1a1a2e" }} />
                          </div>
                          {/* Cara 5 - ARRIBA (⚄ 5) */}
                          <div style={{
                            position: "absolute", width: 80, height: 80,
                            background: "linear-gradient(135deg, #fff, #fef3c7)",
                            border: "2px solid #fbbf24",
                            borderRadius: 12,
                            transform: "rotateX(90deg) translateZ(40px)",
                            display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr 1fr",
                            padding: 10, boxSizing: "border-box",
                            boxShadow: "inset 0 0 15px rgba(0,0,0,0.05)"
                          }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1a1a2e" }} />
                            </div>
                            <div />
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1a1a2e" }} />
                            </div>
                            <div />
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1a1a2e" }} />
                            </div>
                            <div />
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1a1a2e" }} />
                            </div>
                            <div />
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1a1a2e" }} />
                            </div>
                          </div>
                          {/* Cara 6 - ABAJO (⚁ 2) */}
                          <div style={{
                            position: "absolute", width: 80, height: 80,
                            background: "linear-gradient(135deg, #fff, #fef3c7)",
                            border: "2px solid #fbbf24",
                            borderRadius: 12,
                            transform: "rotateX(-90deg) translateZ(40px)",
                            display: "flex", flexDirection: "column", justifyContent: "center",
                            gap: 12, boxSizing: "border-box",
                            boxShadow: "inset 0 0 15px rgba(0,0,0,0.05)"
                          }}>
                            <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: 14 }}>
                              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1a1a2e" }} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-start", paddingLeft: 14 }}>
                              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1a1a2e" }} />
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 16px",
                        }}
                      >
                        <Crown size={36} color="#fff" />
                      </motion.div>
                    )}
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: "#0f1f3d",
                        marginBottom: 4,
                      }}
                    >
                      {ganador.estudianteNombre}
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#6b7280",
                        marginBottom: 8,
                      }}
                    >
                      {votacion.candidatos?.length === 2 ? (
                        <span> Elegido al azar por el sistema</span>
                      ) : (
                        <span>
                          Delegado del equipo · {ganador.votosRecibidos} voto
                          {ganador.votosRecibidos !== 1 ? "s" : ""} recibido
                          {ganador.votosRecibidos !== 1 ? "s" : ""}
                        </span>
                      )}
                    </p>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 16px",
                        borderRadius: 12,
                        background: "#eff6ff",
                        border: "1px solid #bfdbfe",
                        color: "#1d4ed8",
                        fontSize: 12,
                        fontWeight: 600,
                        marginBottom: 24,
                      }}
                    >
                      <Shield size={14} />
                      Solo el delegado puede subir entregables
                    </div>

                    {/* ✅ Ranking ordenado por votos (3+ candidatos) */}
                    {votacion.candidatos?.length > 2 && (
                      <div style={{ maxWidth: 480, margin: "0 auto" }}>
                        <div style={{
                          display: "flex", alignItems: "center", gap: 8,
                          marginBottom: 14,
                        }}>
                          <div style={{ width: 4, height: 16, borderRadius: 2, background: "#059669" }} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Clasificación
                          </span>
                        </div>
                        {[...votacion.candidatos]
                          .sort((a, b) => (b.votosRecibidos || 0) - (a.votosRecibidos || 0))
                          .map((c, idx) => {
                            const pct = votacion.totalVotos > 0
                              ? Math.round((c.votosRecibidos / votacion.totalVotos) * 100)
                              : 0;
                            // Escala de verdes para los 3 primeros, plomo para el resto
                            const pos = idx === 0
                              ? { bg: "#ecfdf5", border: "#a7f3d0", badge: "#059669", barra: "#059669", textBadge: "#fff", label: "1°" }
                              : idx === 1
                              ? { bg: "#f0fdf4", border: "#bbf7d0", badge: "#22c55e", barra: "#22c55e", textBadge: "#fff", label: "2°" }
                              : idx === 2
                              ? { bg: "#f9fafb", border: "#d1d5db", badge: "#86efac", barra: "#86efac", textBadge: "#166534", label: "3°" }
                              : { bg: "#fff", border: "#e8e8e4", badge: "#d6d3d1", barra: "#a8a29e", textBadge: "#78716c", label: `${idx + 1}°` };
                            return (
                              <div key={c.estudianteId} style={{
                                display: "flex", alignItems: "center", gap: 12,
                                padding: "14px 18px", borderRadius: 12,
                                background: pos.bg, border: `1px solid ${pos.border}`,
                                marginBottom: 6,
                                boxShadow: idx === 0 ? "0 2px 8px rgba(5,150,105,0.1)" : "none",
                              }}>
                                <span style={{
                                  width: 32, height: 32, borderRadius: 8,
                                  background: c.esGanador ? "#059669" : pos.badge,
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  color: c.esGanador ? "#fff" : pos.textBadge,
                                  fontSize: 13, fontWeight: 700, flexShrink: 0,
                                }}>
                                  {idx + 1}
                                </span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                      <span style={{ fontSize: 13, fontWeight: 600, color: "#1c1917" }}>
                                        {c.estudianteNombre}
                                      </span>
                                      {c.esGanador && (
                                        <span style={{
                                          fontSize: 9, fontWeight: 600, color: "#059669",
                                          background: "#ecfdf5", padding: "1px 7px",
                                          borderRadius: 5, border: "0.5px solid #a7f3d0",
                                        }}>Ganador</span>
                                      )}
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                      <span style={{ fontSize: 14, fontWeight: 700, color: "#1c1917" }}>
                                        {c.votosRecibidos}
                                      </span>
                                      <span style={{ fontSize: 10, color: "#78716c", marginLeft: 3 }}>
                                        {c.votosRecibidos !== 1 ? "votos" : "voto"}
                                      </span>
                                    </div>
                                  </div>
                                  <div style={{ height: 6, borderRadius: 4, background: "#e7e5e4", overflow: "hidden" }}>
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${pct}%` }}
                                      transition={{ duration: 1, ease: "easeOut" }}
                                      style={{
                                        height: "100%", borderRadius: 4,
                                        background: c.esGanador
                                          ? "linear-gradient(90deg, #059669, #10b981)"
                                          : idx === 0
                                          ? "linear-gradient(90deg, #059669, #34d399)"
                                          : idx === 1
                                          ? "linear-gradient(90deg, #22c55e, #86efac)"
                                          : idx === 2
                                          ? "linear-gradient(90deg, #86efac, #bbf7d0)"
                                          : "linear-gradient(90deg, #d6d3d1, #a8a29e)",
                                      }}
                                    />
                                  </div>
                                  <span style={{ fontSize: 10, color: "#9ca3af", marginTop: 3, display: "block" }}>
                                    {pct}%
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}

                    {/* ✅ Si son 2: mostrar tarjetas simples SIN votos ni barras */}
                    {votacion.candidatos?.length === 2 && (
                      <div style={{ maxWidth: 400, margin: "0 auto", display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        {votacion.candidatos?.map((c, idx) => (
                          <motion.div
                            key={c.estudianteId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.15 }}
                            style={{
                              flex: 1,
                              minWidth: 140,
                              padding: "16px 18px",
                              borderRadius: 14,
                              background: c.esGanador
                                ? "linear-gradient(135deg, #fffbeb, #fef3c7)"
                                : "#f9fafb",
                              border: c.esGanador
                                ? "2px solid #fbbf24"
                                : "1px solid #e5e7eb",
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: "50%",
                                background: c.esGanador
                                  ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
                                  : "linear-gradient(135deg, #e0e7ff, #c7d2fe)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 10px",
                                color: c.esGanador ? "#fff" : "#4f46e5",
                                fontWeight: 700,
                                fontSize: 16,
                              }}
                            >
                              {c.esGanador ? "👑" : c.estudianteNombre?.charAt(0)}
                            </div>
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#0f1f3d",
                                display: "block",
                              }}
                            >
                              {c.estudianteNombre}
                            </span>
                            <span
                              style={{
                                fontSize: 11,
                                color: c.esGanador ? "#92400e" : "#6b7280",
                                fontWeight: 600,
                                marginTop: 4,
                                display: "block",
                              }}
                            >
                              {c.esGanador ? " Delegado elegido" : " Miembro del equipo"}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : votacionActiva ? (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #1B6FE8, #06B6D4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                      }}
                    >
                      <Vote size={32} color="#fff" />
                    </motion.div>
                    <h3
                      style={{
                        fontSize: 17,
                        fontWeight: 800,
                        color: "#0f1f3d",
                        marginBottom: 6,
                      }}
                    >
                       Votación en curso
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#6b7280",
                        marginBottom: 20,
                      }}
                    >
                      Elige al delegado del equipo. Solo él podrá subir
                      entregables.
                    </p>
                    <button
                      onClick={() => setShowVotacionModal(true)}
                      style={{
                        padding: "12px 28px",
                        borderRadius: 12,
                        border: "none",
                        background: "linear-gradient(135deg, #1B6FE8, #06B6D4)",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        boxShadow: "0 4px 16px rgba(27,111,232,0.3)",
                      }}
                    >
                      <Vote size={16} />
                      Ir a votar
                    </button>
                    <div
                      style={{
                        marginTop: 24,
                        display: "flex",
                        gap: 12,
                        justifyContent: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      {votacion?.candidatos?.slice(0, 4).map((c) => (
                        <div
                          key={c.estudianteId}
                          style={{
                            padding: "12px 16px",
                            borderRadius: 12,
                            background: "#f9fafb",
                            border: "1px solid #e5e7eb",
                            textAlign: "center",
                            minWidth: 80,
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              background:
                                "linear-gradient(135deg, #e0e7ff, #c7d2fe)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto 6px",
                              color: "#4f46e5",
                              fontWeight: 700,
                              fontSize: 13,
                            }}
                          >
                            {c.estudianteNombre?.charAt(0)}
                          </div>
                          <span style={{ fontSize: 11, color: "#6b7280" }}>
                            {c.estudianteNombre?.split(" ")[0]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 20px" }}>
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: "#f3f4f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                      }}
                    >
                      <Clock size={28} color="#9ca3af" />
                    </div>
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#0f1f3d",
                        marginBottom: 6,
                      }}
                    >
                      Votación no disponible
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#6b7280",
                        maxWidth: 360,
                        margin: "0 auto",
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

      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}
      >
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(-1)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 18px",
            borderRadius: 9,
            border: `0.5px solid ${C.border}`,
            background: "#fff",
            fontSize: 12,
            fontWeight: 600,
            color: C.textSecondary,
            cursor: "pointer",
          }}
        >
          ← Volver a proyectos
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
                background: "rgba(0,0,0,0.6)",
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
                borderRadius: 24,
                width: "100%",
                maxWidth: 480,
                overflow: "hidden",
                boxShadow: "0 32px 64px rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  padding: "20px 24px",
                  borderBottom: `0.5px solid ${C.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: `linear-gradient(135deg, ${C.primary}08, transparent)`,
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: C.textPrimary,
                      margin: 0,
                    }}
                  >
                    {uploadSuccess ? "¡Subida exitosa!" : "Subir entregable"}
                  </h3>
                  <p
                    style={{
                      fontSize: 12,
                      color: C.textSecondary,
                      margin: "4px 0 0",
                    }}
                  >
                    {selectedEntregable}
                  </p>
                </div>
                {!isSubiendo && (
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setShowUploadModal(false);
                      setUploadError("");
                      setUploadFile(null);
                    }}
                    style={{
                      padding: 6,
                      borderRadius: 10,
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: C.textMuted,
                      display: "flex",
                    }}
                  >
                    <X size={20} />
                  </motion.button>
                )}
              </div>
              <AnimatePresence mode="wait">
                {uploadSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ padding: "48px 24px", textAlign: "center" }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        delay: 0.1,
                      }}
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: "#ecfdf5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                      }}
                    >
                      <CheckCircle2 size={32} color={C.success} />
                    </motion.div>
                    <h4
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: C.textPrimary,
                        margin: "0 0 8px",
                      }}
                    >
                      Archivo subido correctamente
                    </h4>
                    <p
                      style={{
                        fontSize: 13,
                        color: C.textSecondary,
                        margin: 0,
                      }}
                    >
                      La MYPE será notificada
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubirEntregable}
                    style={{ padding: 24 }}
                  >
                    <div style={{ marginBottom: 16 }}>
                      <label
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: C.textMuted,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          display: "block",
                          marginBottom: 7,
                        }}
                      >
                        Descripción
                      </label>
                      <textarea
                        value={uploadDescripcion}
                        onChange={(e) => setUploadDescripcion(e.target.value)}
                        placeholder="Describe esta entrega..."
                        rows={3}
                        style={{
                          width: "100%",
                          padding: "11px 13px",
                          borderRadius: 12,
                          border: `0.5px solid ${C.border}`,
                          fontSize: 13,
                          outline: "none",
                          resize: "none",
                          color: C.textPrimary,
                          fontFamily: "inherit",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                    <div
                      onDragEnter={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          if (file.size > 15 * 1024 * 1024)
                            setUploadError("Máx 15 MB");
                          else {
                            setUploadFile(file);
                            setUploadError("");
                          }
                        }
                      }}
                      style={{
                        padding: "28px 20px",
                        borderRadius: 14,
                        textAlign: "center",
                        cursor: "pointer",
                        border: `2px dashed ${dragActive ? C.primary : uploadFile ? "#10b981" : C.border}`,
                        background: dragActive
                          ? "#eff6ff"
                          : uploadFile
                            ? "#ecfdf5"
                            : "#fafaf8",
                        transition: "all 0.3s",
                        marginBottom: 18,
                      }}
                    >
                      <input
                        type="file"
                        id="file-input"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 15 * 1024 * 1024)
                              setUploadError("Máx 15 MB");
                            else {
                              setUploadFile(file);
                              setUploadError("");
                            }
                          }
                        }}
                      />
                      {uploadFile ? (
                        <div>
                          <FileText
                            size={32}
                            color={C.primary}
                            style={{ marginBottom: 10 }}
                          />
                          <p
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: C.textPrimary,
                              margin: "0 0 4px",
                            }}
                          >
                            {uploadFile.name}
                          </p>
                          <p
                            style={{
                              fontSize: 11,
                              color: C.textMuted,
                              margin: "0 0 10px",
                            }}
                          >
                            {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <button
                            type="button"
                            onClick={() => setUploadFile(null)}
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "#dc2626",
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                            }}
                          >
                            Cambiar archivo
                          </button>
                        </div>
                      ) : (
                        <label
                          htmlFor="file-input"
                          style={{ cursor: "pointer" }}
                        >
                          <Upload
                            size={30}
                            color={C.textMuted}
                            style={{ marginBottom: 10 }}
                          />
                          <p
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: C.textSecondary,
                              margin: "0 0 4px",
                            }}
                          >
                            Arrastra tu archivo o haz clic
                          </p>
                          <p
                            style={{
                              fontSize: 11,
                              color: C.textMuted,
                              margin: 0,
                            }}
                          >
                            PDF, DOCX, ZIP, JPG (Máx. 15 MB)
                          </p>
                        </label>
                      )}
                    </div>
                    {isSubiendo && (
                      <div style={{ marginBottom: 16 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 5,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              color: C.textMuted,
                            }}
                          >
                            Subiendo…
                          </span>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              color: C.primary,
                            }}
                          >
                            {uploadProgress}%
                          </span>
                        </div>
                        <div
                          style={{
                            width: "100%",
                            height: 6,
                            borderRadius: 3,
                            background: "#f1f5f9",
                            overflow: "hidden",
                          }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.3 }}
                            style={{
                              height: "100%",
                              borderRadius: 3,
                              background: `linear-gradient(90deg, ${C.primary}, ${C.purple})`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {uploadError && (
                      <p
                        style={{
                          fontSize: 12,
                          color: "#dc2626",
                          fontWeight: 600,
                          textAlign: "center",
                          marginBottom: 14,
                        }}
                      >
                        {uploadError}
                      </p>
                    )}
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        type="button"
                        onClick={() => setShowUploadModal(false)}
                        style={{
                          flex: 1,
                          padding: "11px 16px",
                          borderRadius: 12,
                          border: `0.5px solid ${C.border}`,
                          background: "#f8fafc",
                          fontSize: 13,
                          fontWeight: 600,
                          color: C.textSecondary,
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
                          padding: "11px 16px",
                          borderRadius: 12,
                          border: "none",
                          background: !uploadFile ? "#e2e8f0" : C.primary,
                          color: "#fff",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: !uploadFile ? "default" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                        }}
                      >
                        {isSubiendo ? (
                          <>
                            <Loader2
                              size={15}
                              style={{ animation: "spin 1s linear infinite" }}
                            />{" "}
                            Subiendo…
                          </>
                        ) : (
                          <>
                            <Send size={14} /> Subir entregable
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Votación */}
      <AnimatePresence>
        {showVotacionModal && (
          <VotacionModal
            proyectoId={proyectoId}
            onClose={() => setShowVotacionModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProyectoWorkspacePage;
