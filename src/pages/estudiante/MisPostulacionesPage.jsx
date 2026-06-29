import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  FolderOpen,
  Calendar,
} from "lucide-react";
import { useMisPostulaciones } from "@features/postulaciones-list/useMisPostulaciones";
import { OfertaAceptadaBanner } from "@/features/postulaciones-list/OfertaAceptadaBanner";
import { PreseleccionadoBanner } from "@/features/postulaciones-list/PreseleccionadoBanner";

const FONT = "'Angro Std', 'Outfit', sans-serif";

/* ═══════════════════════════════════════════════
   COMMAND CENTER (banner navy con canvas)
═══════════════════════════════════════════════ */
const PostulacionesCommandCenter = ({ total, enRevision, aceptadas, rechazadas }) => {
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
        ctx.fillStyle = "rgba(56,189,248,0.4)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x;
          const dy = particles[j].y - p.y;
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
        padding: "48px 56px",
        overflow: "hidden",
        boxShadow: "0 24px 48px -12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        marginBottom: 32,
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "stretch",
        gap: 40,
      }}
    >
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: -100, right: -50, width: 300, height: 300, background: "radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />

      {/* Titular + acción */}
      <div style={{ position: "relative", zIndex: 10, flex: "1 1 50%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontFamily: FONT, fontSize: "2.4rem", fontWeight: 500, color: "#FFFFFF", margin: "0 0 12px", letterSpacing: "-0.03em" }}>
            Mis Postulaciones
          </h1>
          <p style={{ fontFamily: FONT, fontSize: 15, color: "#94A3B8", margin: 0, lineHeight: 1.6, fontWeight: 400, maxWidth: "90%" }}>
            Sigue el estado de tus candidaturas activas y el historial de proyectos a los que has aplicado.
          </p>
        </div>
        <div style={{ marginTop: 40 }}>
          <Link to="/proyectos" style={{ textDecoration: "none" }}>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ fontFamily: FONT, background: "#1B6FE8", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "14px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10, boxShadow: "0 8px 16px -4px rgba(27,111,232,0.3)" }}
            >
              Explorar proyectos <ArrowRight size={16} />
            </motion.button>
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ position: "relative", zIndex: 10, flex: "1 1 50%", display: "flex", gap: 16, flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px", backdropFilter: "blur(10px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94A3B8", marginBottom: 12 }}>
              <TrendingUp size={16} />
              <span style={{ fontSize: 11, fontWeight: 600, fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total postulaciones</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 400, color: "#FFFFFF", fontFamily: FONT, lineHeight: 1 }}>{total}</div>

          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px", backdropFilter: "blur(10px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94A3B8", marginBottom: 12 }}>
              <CheckCircle2 size={16} />
              <span style={{ fontSize: 11, fontWeight: 600, fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.05em" }}>En revisión</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 400, color: "#FFFFFF", fontFamily: FONT, lineHeight: 1 }}>{enRevision}</div>
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 12, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 12, color: "#FFFFFF", fontWeight: 600, fontFamily: FONT, marginBottom: 4 }}>Resultados</div>
            <div style={{ fontSize: 11, color: "#64748B", fontFamily: FONT }}>{aceptadas} aceptadas · {rechazadas} no seleccionadas</div>
          </div>
          <div style={{ width: 120, height: 6, background: "#1E293B", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: `${total ? (aceptadas / total) * 100 : 0}%`, height: "100%", background: "linear-gradient(90deg, #1B6FE8, #38BDF8)" }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};


/* ═══════════════════════════════════════════════
   PIPELINE TRACKER — estados de postulación
═══════════════════════════════════════════════ */
const PostulacionPipelineTracker = ({ estado }) => {
  const isEnRevision = ["PRESELECCIONADO", "VALIDADO_MYPE"].includes(estado);
  const isFinalizado = ["CONFIRMADO", "RECHAZADO", "RETIRADO", "EXPIRADO"].includes(estado);

  let currentLevel = 1;
  if (isFinalizado) currentLevel = 3;
  else if (isEnRevision) currentLevel = 2;

  const stages = ["Enviada", "En revisión", "Finalizada"];

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%", gap: 4 }}>
      {stages.map((stg, i) => {
        const isActive = currentLevel === (i + 1);
        const isPast = currentLevel > (i + 1);
        const bg = isPast ? "#10B981" : isActive ? "#1B6FE8" : "#E2E8F0";
        const textColor = isPast || isActive ? "#0F1F3D" : "#94A3B8";

        return (
          <div key={i} style={{ flex: 1, height: "4px", borderRadius: "2px", background: isPast ? "#E0F2FE" : "#F1F5F9", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: isPast || isActive ? "100%" : "0%", background: bg, transition: "width 0.6s ease", borderRadius: "2px" }} />
            {isActive && (
              <span style={{ position: "absolute", top: 12, left: 0, fontSize: 10, fontWeight: 700, fontFamily: FONT, color: textColor, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                {stg}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};


/* ═══════════════════════════════════════════════
   PIPELINE ROW — acordeón expandible
═══════════════════════════════════════════════ */
const getStatusLabel = (estado) => {
  switch (estado) {
    case "PENDIENTE":       return "En revisión";
    case "PRESELECCIONADO": return "Preseleccionado";
    case "VALIDADO_MYPE":   return "Oferta recibida";
    case "CONFIRMADO":      return "Confirmado";
    case "RECHAZADO":       return "No seleccionado";
    case "RETIRADO":        return "Retirado";
    case "EXPIRADO":        return "Expirado";
    default:                return estado;
  }
};

const PostulacionPipelineRow = ({ postulacion, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [verMas, setVerMas] = useState(false);

  const tituloProyecto = postulacion.proyectoTitulo || "Proyecto";
  const mypeNombre = postulacion.mypeNombre || "MYPE";
  const fecha = postulacion.fechaPostulacion
    ? new Date(postulacion.fechaPostulacion).toLocaleDateString("es-PE", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC" 
      })
    : "—";
  const mensaje = postulacion.mensajePostulacion || "";
  const MSG_PREVIEW = 120;
  const mensajeCorto = mensaje.length > MSG_PREVIEW ? mensaje.slice(0, MSG_PREVIEW) + "…" : mensaje;
  const statusLabel = getStatusLabel(postulacion.estado);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      style={{
        background: isExpanded ? "#FFFFFF" : "#FCFDFD",
        border: "1px solid",
        borderColor: isExpanded ? "#E2E8F0" : "#F1F5F9",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: isExpanded ? "0 12px 32px -8px rgba(15,23,42,0.08)" : "0 2px 4px rgba(15,23,42,0.01)",
        transition: "box-shadow 0.3s ease, border-color 0.3s ease",
        marginBottom: 16,
      }}
    >
      {/* Fila principal */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "minmax(280px, 2fr) 1.5fr 1fr 1fr auto", gap: 20, alignItems: "center", cursor: "pointer" }}
      >
        {/* ID + Proyecto */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, fontFamily: FONT, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {`POST-${String(postulacion.id).padStart(4, "0")}`}
            </span>
            <span style={{ fontSize: 9, fontFamily: FONT, fontWeight: 600, color: "#1B6FE8", background: "#EFF6FF", padding: "2px 8px", borderRadius: "4px" }}>
              {mypeNombre}
            </span>
          </div>
          <h3 style={{ margin: 0, fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "#0F1F3D", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {tituloProyecto}
          </h3>
        </div>

        {/* Tracker */}
        <div style={{ paddingRight: 32 }}>
          <PostulacionPipelineTracker estado={postulacion.estado} />
        </div>

        {/* Estado — texto negro, sin fondo */}
        <div>
          <span style={{ fontSize: 12, fontFamily: FONT, fontWeight: 600, color: "#0F1F3D" }}>
            {statusLabel}
          </span>
        </div>

        {/* Fecha */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748B", fontFamily: FONT, fontSize: 12 }}>
          <Calendar size={13} />
          <span style={{ fontWeight: 500 }}>{fecha}</span>
        </div>

        {/* Flecha expandir */}
        <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
          <ChevronRight size={18} color="#94A3B8" />
        </motion.div>
      </div>

      {/* Panel expandido */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden", borderTop: "1px solid #F1F5F9" }}
          >
            <div style={{ padding: "24px 24px 32px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: 48, background: "#FFFFFF" }}>

              {/* Mensaje + datos */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: 11, fontFamily: FONT, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Mensaje de presentación
                  </h4>
                  {mensaje ? (
                    <>
                      <p style={{ margin: 0, fontSize: 13, fontFamily: FONT, color: "#475569", lineHeight: 1.6, fontStyle: "italic" }}>
                        "{verMas ? mensaje : mensajeCorto}"
                      </p>
                      {mensaje.length > MSG_PREVIEW && (
                        <button
                          onClick={() => setVerMas(v => !v)}
                          style={{ marginTop: 6, background: "none", border: "none", fontSize: 11, fontWeight: 600, color: "#1B6FE8", cursor: "pointer", padding: 0, fontFamily: FONT }}
                        >
                          {verMas ? "Ver menos" : "Ver más"}
                        </button>
                      )}
                    </>
                  ) : (
                    <p style={{ margin: 0, fontSize: 13, fontFamily: FONT, color: "#94A3B8", fontStyle: "italic" }}>Sin mensaje adjunto.</p>
                  )}
                </div>

                <div style={{ display: "flex", gap: 40, borderTop: "1px dashed #E2E8F0", paddingTop: 20 }}>
                  <div>
                    <span style={{ display: "block", fontSize: 11, fontFamily: FONT, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Empresa</span>
                    <span style={{ fontSize: 13, fontFamily: FONT, color: "#0F1F3D", fontWeight: 600 }}>{mypeNombre}</span>
                  </div>
                  <div>
                    <span style={{ display: "block", fontSize: 11, fontFamily: FONT, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Fecha de postulación</span>
                    <span style={{ fontSize: 13, fontFamily: FONT, color: "#0F1F3D", fontWeight: 600 }}>{fecha}</span>
                  </div>
                </div>
              </div>

              {/* Panel de acciones */}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", background: "#F8FAFC", borderRadius: "12px", padding: 20, border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: 10, fontFamily: FONT, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>
                  Acciones
                </div>
                {postulacion.estado === "CONFIRMADO" && !["COMPLETADO", "CANCELADO"].includes(postulacion.proyectoEstado) ? (
                  <Link to={`/workspace/${postulacion.proyectoId}`} style={{ textDecoration: "none" }}>
                    <button
                      style={{ background: "#1B6FE8", color: "#FFFFFF", fontFamily: FONT, border: "none", padding: "12px", borderRadius: "8px", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", width: "100%", boxShadow: "0 4px 12px rgba(27,111,232,0.25)", transition: "all 0.2s ease" }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(27,111,232,0.35)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(27,111,232,0.25)"; }}
                    >
                      <span>Ir al workspace</span>
                      <ArrowRight size={14} />
                    </button>
                  </Link>
                ) : (
                  <div style={{ fontSize: 12, fontFamily: FONT, color: "#94A3B8", textAlign: "center", padding: "16px 0" }}>
                    {statusLabel}
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


/* ═══════════════════════════════════════════════
   PAGINACIÓN
═══════════════════════════════════════════════ */
const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32, padding: "16px 24px", border: "1px solid #E2E8F0", borderRadius: 16, background: "#FAFAFA" }}>
    <span style={{ fontSize: 12, fontFamily: FONT, color: "#64748B", fontWeight: 500 }}>
      Página <span style={{ color: "#0F1F3D", fontWeight: 700 }}>{currentPage}</span> de <span style={{ color: "#0F1F3D", fontWeight: 700 }}>{totalPages}</span>
    </span>
    <div style={{ display: "flex", gap: 12 }}>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(p => Math.max(1, p - 1))}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: currentPage === 1 ? "#F1F5F9" : "#FFFFFF", border: "1px solid", borderColor: currentPage === 1 ? "transparent" : "#E2E8F0", color: currentPage === 1 ? "#94A3B8" : "#0F1F3D", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
      >
        <ChevronLeft size={16} />
      </button>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(p => Math.min(totalPages, p + 1))}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: currentPage === totalPages ? "#F1F5F9" : "#FFFFFF", border: "1px solid", borderColor: currentPage === totalPages ? "transparent" : "#E2E8F0", color: currentPage === totalPages ? "#94A3B8" : "#0F1F3D", cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  </div>
);


/* ═══════════════════════════════════════════════
   PÁGINA PRINCIPAL
═══════════════════════════════════════════════ */
const MisPostulacionesPage = () => {
  const { data: postulacionesRaw = [], isLoading, isError, error } = useMisPostulaciones();
  const [activasPage, setActivasPage] = useState(1);
  const [historialPage, setHistorialPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const postulacionesActivas = useMemo(
    () => postulacionesRaw.filter(p => ["PENDIENTE", "PRESELECCIONADO", "VALIDADO_MYPE"].includes(p.estado)),
    [postulacionesRaw]
  );
  const postulacionesHistorial = useMemo(
    () => postulacionesRaw.filter(p => ["CONFIRMADO", "RECHAZADO", "RETIRADO", "EXPIRADO"].includes(p.estado)),
    [postulacionesRaw]
  );

  const total = postulacionesRaw.length;
  const enRevision = postulacionesActivas.filter(p => ["PENDIENTE", "PRESELECCIONADO"].includes(p.estado)).length;
  const aceptadas = postulacionesRaw.filter(p => ["CONFIRMADO", "VALIDADO_MYPE"].includes(p.estado)).length;
  const rechazadas = postulacionesHistorial.filter(p => ["RECHAZADO", "RETIRADO", "EXPIRADO"].includes(p.estado)).length;

  const ofertasPendientes = postulacionesActivas.filter(p => p.estado === "VALIDADO_MYPE");
  const ofertasPreseleccionadas = postulacionesActivas.filter(p => p.estado === "PRESELECCIONADO");

  const totalPaginasActivas = Math.ceil(postulacionesActivas.length / ITEMS_PER_PAGE);
  const activasPaginadas = postulacionesActivas.slice((activasPage - 1) * ITEMS_PER_PAGE, activasPage * ITEMS_PER_PAGE);

  const totalPaginasHistorial = Math.ceil(postulacionesHistorial.length / ITEMS_PER_PAGE);
  const historialPaginado = postulacionesHistorial.slice((historialPage - 1) * ITEMS_PER_PAGE, historialPage * ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 36px 48px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: 80, background: "#F1F5F9", borderRadius: 16, animation: "pulse 2s infinite ease-in-out" }} />
          ))}
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }`}</style>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 36px 48px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <div style={{ background: "#fef2f2", color: "#dc2626", padding: 24, borderRadius: 16, border: "0.5px solid #fecaca", maxWidth: 400, textAlign: "center", fontFamily: FONT }}>
          <p style={{ fontWeight: 700, marginBottom: 4 }}>Error al cargar las postulaciones</p>
          <p style={{ fontSize: 13, opacity: 0.9 }}>{error?.response?.data?.message || error?.message || "Error desconocido"}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 36px 48px", paddingBottom: 120 }}>
      <PostulacionesCommandCenter total={total} enRevision={enRevision} aceptadas={aceptadas} rechazadas={rechazadas} />

      {/* Banners informativos y de acción */}
      {ofertasPreseleccionadas.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {ofertasPreseleccionadas.map(p => <PreseleccionadoBanner key={p.id} postulacion={p} />)}
        </motion.div>
      )}
      {ofertasPendientes.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          {ofertasPendientes.map(p => <OfertaAceptadaBanner key={p.id} postulacion={p} />)}
        </motion.div>
      )}

      {/* Sin postulaciones */}
      {total === 0 ? (
        <div style={{ textAlign: "center", padding: "100px 40px", border: "1px dashed #CBD5E1", borderRadius: 24, background: "#FAFAFA", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <FolderOpen size={48} color="#CBD5E1" strokeWidth={1} style={{ marginBottom: 20 }} />
          <h3 style={{ margin: "0 0 8px 0", fontFamily: FONT, fontSize: 18, fontWeight: 500, color: "#0F1F3D" }}>No tienes postulaciones aún</h3>
          <p style={{ margin: "0 0 24px", fontFamily: FONT, fontSize: 14, color: "#64748B", maxWidth: 400 }}>Explora proyectos disponibles y postula a los que se alineen con tu perfil.</p>
          <Link to="/proyectos" style={{ textDecoration: "none" }}>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ fontFamily: FONT, background: "#1B6FE8", color: "#FFFFFF", border: "none", borderRadius: "10px", padding: "12px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              Explorar proyectos <ArrowRight size={14} />
            </motion.button>
          </Link>
        </div>
      ) : (
        <>
          {/* SECCIÓN ACTIVAS */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, borderBottom: "1px solid #E2E8F0", paddingBottom: 16 }}>
              <div>
                <h2 style={{ fontFamily: FONT, margin: 0, fontSize: 18, color: "#0F1F3D", fontWeight: 600 }}>Postulaciones activas</h2>
                <p style={{ fontFamily: FONT, margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
                  Candidaturas en curso. ({postulacionesActivas.length} {postulacionesActivas.length === 1 ? "registro" : "registros"})
                </p>
              </div>
            </div>

            {postulacionesActivas.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 40px", border: "1px dashed #CBD5E1", borderRadius: 16, background: "#FAFAFA", fontFamily: FONT, fontSize: 13, color: "#64748B", marginBottom: 32 }}>
                No tienes postulaciones activas en este momento.
              </div>
            ) : (
              <>
                <AnimatePresence mode="popLayout">
                  {activasPaginadas.map((p, idx) => (
                    <PostulacionPipelineRow key={p.id} postulacion={p} index={idx} />
                  ))}
                </AnimatePresence>
                {totalPaginasActivas > 1 && (
                  <Pagination currentPage={activasPage} totalPages={totalPaginasActivas} onPageChange={setActivasPage} />
                )}
              </>
            )}
          </div>

          {/* SECCIÓN HISTORIAL */}
          <div style={{ marginTop: 48 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, borderBottom: "1px solid #E2E8F0", paddingBottom: 16 }}>
              <div>
                <h2 style={{ fontFamily: FONT, margin: 0, fontSize: 18, color: "#0F1F3D", fontWeight: 600 }}>Historial</h2>
                <p style={{ fontFamily: FONT, margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
                  Postulaciones finalizadas. ({postulacionesHistorial.length} {postulacionesHistorial.length === 1 ? "registro" : "registros"})
                </p>
              </div>
            </div>

            {postulacionesHistorial.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 40px", border: "1px dashed #CBD5E1", borderRadius: 16, background: "#FAFAFA", fontFamily: FONT, fontSize: 13, color: "#64748B" }}>
                Aún no hay postulaciones en el historial.
              </div>
            ) : (
              <>
                <AnimatePresence mode="popLayout">
                  {historialPaginado.map((p, idx) => (
                    <PostulacionPipelineRow key={p.id} postulacion={p} index={idx} />
                  ))}
                </AnimatePresence>
                {totalPaginasHistorial > 1 && (
                  <Pagination currentPage={historialPage} totalPages={totalPaginasHistorial} onPageChange={setHistorialPage} />
                )}
              </>
            )}
          </div>
        </>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default MisPostulacionesPage;
