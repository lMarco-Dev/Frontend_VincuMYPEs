import { useState, useRef, useEffect } from "react";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import { useMisProyectos } from "@/features/proyecto-list-mype/useMisProyectos";
import {
  usePostulaciones,
  usePostulacionesAceptadas,
  useCambiarEstadoPostulacion,
} from "@/features/proyecto-postulaciones/usePostulaciones";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, CheckCircle, XCircle, Clock, ChevronDown, Loader2,
  Eye, EyeOff, FileText, UserCheck, UserX, UserPlus,
  Briefcase, Calendar, Star, Award, Crown, User, 
  TrendingUp, CheckCircle2, ArrowRight, LayoutDashboard,
  Shield, Building2, CheckSquare
} from "lucide-react";
import { Link } from "react-router-dom";
import { ConfirmModal } from "../../shared/components/ConfirmModal";

const FONT = "'Angro Std', 'Outfit', sans-serif";

/* ─── Animaciones ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ═══════════════════════════════════════════════
   WORKSPACE INTELLIGENCE BANNER (COMMAND CENTER)
═══════════════════════════════════════════════ */
const ExecutiveCommandCenter = ({ totalProyectos, metrics }) => {
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
        size: Math.random() * 1.5 + 0.5
      });
    }

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x;
          const dy = particles[j].y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.1 * (1 - dist / 80)})`;
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

    const ro = new ResizeObserver(() => {
      if (!canvas) return;
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
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
        flexWrap: "wrap",
        gap: 40
      }}
    >
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: -100, right: -50, width: 300, height: 300, background: "radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)", filter: "blur(40px)" }}/>

      <div style={{ position: "relative", zIndex: 10, flex: "1 1 50%", minWidth: "300px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: "8px", padding: "6px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#38BDF8", marginBottom: 16 }}>
              Gestión Estratégica de Talento
          </div>
          <h1 style={{ fontFamily: FONT, fontSize: "clamp(2rem, 3vw, 2.4rem)", fontWeight: 600, color: "#FFFFFF", margin: "0 0 12px", letterSpacing: "-0.03em" }}>
            Módulo Integrado de Proyectos
          </h1>
          <p style={{ fontFamily: FONT, fontSize: 15, color: "#94A3B8", margin: 0, lineHeight: 1.6, fontWeight: 400, maxWidth: "90%" }}>
            Central de seguimiento para revisar perfiles corporativos, aprobar candidaturas y asegurar la consolidación óptima de tus equipos tecnológicos.
          </p>
        </div>
        
        <div style={{ marginTop: 40 }}>
          <Link to="/dashboard/mype/crear" style={{ textDecoration: "none" }}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ fontFamily: FONT, background: "#1B6FE8", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "14px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10, boxShadow: "0 8px 16px -4px rgba(27,111,232,0.3)", textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
              Publicar Nuevo Proyecto <ArrowRight size={16} />
            </motion.button>
          </Link>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 10, flex: "1 1 40%", minWidth: "300px", display: "flex", gap: 16, flexDirection: "column", justifyContent: "center" }}>
        
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "140px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px", backdropFilter: "blur(10px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94A3B8", marginBottom: 12 }}>
               <TrendingUp size={16} /> <span style={{ fontSize: 11, fontWeight: 600, fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.05em" }}>Iniciativas Vigentes</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 400, color: "#FFFFFF", fontFamily: FONT, lineHeight: 1 }}>{totalProyectos}</div>
            <div style={{ marginTop: 8, fontSize: 12, color: "#10B981", display: "flex", alignItems: "center", gap: 4, fontFamily: FONT }}><span style={{ width:6, height:6, background:"#10B981", borderRadius:"50%"}}></span> Activas y operativas</div>
          </div>
          
          <div style={{ flex: 1, minWidth: "140px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px", backdropFilter: "blur(10px)" }}>
             <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94A3B8", marginBottom: 12 }}>
               <CheckCircle2 size={16} /> <span style={{ fontSize: 11, fontWeight: 600, fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.05em" }}>Fase Consolidada</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 400, color: "#FFFFFF", fontFamily: FONT, lineHeight: 1 }}>{metrics.enDesarrollo}</div>
             <div style={{ marginTop: 8, fontSize: 12, color: "#38BDF8", display: "flex", alignItems: "center", gap: 4, fontFamily: FONT }}>Equipos en despliegue</div>
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 12, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
               <div style={{ fontSize: 12, color: "#FFFFFF", fontWeight: 600, fontFamily: FONT, marginBottom: 4 }}>Procesos de Reclutamiento</div>
               <div style={{ fontSize: 11, color: "#64748B", fontFamily: FONT }}>{metrics.porAtender} iniciativas esperando evaluación.</div>
            </div>
            <div style={{ width: 120, height: 6, background: "#1E293B", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${totalProyectos > 0 ? (metrics.enDesarrollo/totalProyectos)*100 : 0}%`, height: "100%", background: "linear-gradient(90deg, #1B6FE8, #38BDF8)", transition: "width 1s ease" }} />
            </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   ESTILOS PREMIUM Y FORMATOS DE ESTADO MYPE
═══════════════════════════════════════════════ */
function EtiquetaCorporativa({ estado }) {
  const map = {
    PENDIENTE: { color: "#64748B", dot: "#94A3B8", label: "Postulado" },
    PRESELECCIONADO: { color: "#1B6FE8", dot: "#3B82F6", label: "Pre-seleccionado" },
    VALIDADO_MYPE: { color: "#10B981", dot: "#34D399", label: "Aprobado" },
    CONFIRMADO: { color: "#059669", dot: "#10B981", label: "Confirmado" },
    RECHAZADO: { color: "#EF4444", dot: "#F87171", label: "Rechazado" },
    RETIRADO: { color: "#94A3B8", dot: "#CBD5E1", label: "Retirado" },
    EXPIRADO: { color: "#D97706", dot: "#F59E0B", label: "Expirado" },
  };
  const statusConfig = map[estado] ?? map.PENDIENTE;

  return (
    <span style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontFamily: FONT, fontSize: 11, fontWeight: 600,
        padding: "4px 10px", borderRadius: "6px",
        background: statusConfig.bg, color: statusConfig.color, border: `1px solid ${statusConfig.border}`,
      }}
      title={estado === "RECHAZADO" ? "Decidido internamente no proceder con el perfil" : ""}
    >
      {statusConfig.icon} {statusConfig.label}
    </span>
  );
}


/* ═══════════════════════════════════════════════
   MÓDULO DE VALORACIÓN DEL TALENTO
═══════════════════════════════════════════════ */
function TalentExecutiveModule({ postulacion, proyectoId, verTodos, onEstadoChange }) {
  const { cambiarEstado, isLoading } = useCambiarEstadoPostulacion(proyectoId);
  const [expanded, setExpanded] = useState(false);
  const [modalAction, setModalAction] = useState(null);

  const isDelegate = postulacion.esDelegado === true;

  const puedeValidar = postulacion.estado === "PRESELECCIONADO";
  const puedeRechazar = postulacion.estado === "PRESELECCIONADO" || (verTodos && postulacion.estado === "PENDIENTE");

  const avatarText = postulacion.estudianteNombre?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() ?? "?";

  const confirmChoice = () => {
    if (modalAction === "validar") {
      cambiarEstado({ proyectoId, postulacionId: postulacion.id, estado: "VALIDADO_MYPE" });
    } else if (modalAction === "rechazar") {
      cambiarEstado({ proyectoId, postulacionId: postulacion.id, estado: "RECHAZADO" });
    }
  };

  const getContainerStyle = () => {
    if (isDelegate) {
      return { background: "#FFFFFF", border: "1px solid #FDE68A", boxShadow: "0 4px 20px rgba(251,191,36,0.06)", overflow: "hidden", position: "relative" };
    }
    return { background: "#FFFFFF", border: "1px solid #E2E8F0", overflow: "hidden", position: "relative", boxShadow: "0 2px 4px rgba(0,0,0,0.01)" };
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
      style={{ ...getContainerStyle(), borderRadius: "12px", transition: "all 0.2s" }}>

      <div style={{ width: 4, position: "absolute", left: 0, top: 0, bottom: 0, background: isDelegate ? "#F59E0B" : "transparent" }} />
      
      {isDelegate && (
        <div style={{ padding: "6px 20px", background: "linear-gradient(90deg, #FFFBF0, transparent)", borderBottom: "1px solid #FEF3C7", display: "flex", alignItems: "center", gap: 6, paddingLeft: "24px" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#D97706", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: FONT }}>Coordinación Técnica y Liderazgo de Equipo</span>
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        
        {/* IDENTIDAD & PERFIL */}
        <div style={{ flex: "1 1 340px", padding: "20px 24px", display: "flex", gap: 16, alignItems: "flex-start", borderRight: "1px dashed #E2E8F0" }}>
          <div style={{ width: 48, height: 48, borderRadius: "10px", background: isDelegate ? "#FEF3C7" : "#F8FAFC", border: `1px solid ${isDelegate ? '#FCD34D' : '#E2E8F0'}`, display: "flex", alignItems: "center", justifyContent: "center", color: isDelegate ? "#D97706" : "#475569", fontWeight: 600, fontSize: 16 }}>
             {avatarText}
          </div>

          <div style={{ flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#1E293B", fontFamily: FONT }}>
        {postulacion.estudianteNombre}
    </h3>
    
    {/* Etiqueta de estado - EN LA MISMA LÍNEA QUE EL NOMBRE */}
    <EtiquetaCorporativa estado={postulacion.estado} />
</div>

<div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", marginTop: "4px" }}>
    <span style={{ fontSize: 11, color: "#64748B", display: "flex", alignItems: "center", gap: 4, fontFamily: FONT }}>
        Fecha: {new Date(postulacion.fechaPostulacion).toLocaleDateString("es-PE")}
    </span>
</div>

{/* BOTONES EN DOS CUADROS */}
<div style={{ display: "flex", gap: 10, marginTop: 12 }}>
    {/* Cuadro 1: Analizar trayectoria */}
    <Link to={`/estudiante/${postulacion.estudianteId}`} 
        style={{ 
            flex: 1,
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            gap: 6, 
            fontSize: 12, 
            fontWeight: 500, 
            color: "#475569", 
            textDecoration: "none", 
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            padding: "8px 12px", 
            borderRadius: "8px", 
            fontFamily: FONT, 
            transition: "all 0.2s" 
        }} 
        onMouseEnter={e => { e.currentTarget.style.background = "#F1F5F9"; e.currentTarget.style.color = "#0F1F3D"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.color = "#475569"; }}
    >
        <User size={14}/> Analizar trayectoria
    </Link>

    {/* Cuadro 2: Currículum Adjunto */}
    {postulacion.estudianteCvUrl ? (
        <a href={postulacion.estudianteCvUrl} target="_blank" rel="noopener noreferrer"
            style={{ 
                flex: 1,
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                gap: 6, 
                fontSize: 12, 
                fontWeight: 500, 
                color: "#1B6FE8", 
                textDecoration: "none", 
                background: "#EFF6FF",
                border: "1px solid #BFDBFE",
                padding: "8px 12px", 
                borderRadius: "8px", 
                fontFamily: FONT, 
                transition: "all 0.2s" 
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#DBEAFE"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#EFF6FF"; }}
        >
            <FileText size={14}/> Ver currículum
        </a>
    ) : (
        <div
            style={{ 
                flex: 1,
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                fontSize: 11, 
                fontWeight: 500, 
                color: "#64748B", 
                background: "#F1F5F9",
                border: "1px solid #E2E8F0",
                padding: "8px 12px", 
                borderRadius: "8px", 
                fontFamily: FONT 
            }}
        >
            Sin currículum
        </div>
    )}
</div>
              </div>
          </div>
        </div>

        {/* TOMA DE DECISIONES */}
        <div style={{ flex: "2 1 400px", display: "flex", flexDirection: "column", padding: "20px 24px" }}>
            
            <div style={{ flex: 1, cursor: "pointer", background: expanded ? "rgba(248, 250, 252, 0.7)" : "transparent", padding: expanded ? "10px" : "0", borderRadius: "8px", transition: "all 0.2s", marginBottom: expanded ? 12 : 0 }} onClick={() => setExpanded(!expanded)}>
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: expanded ? 8 : 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#64748B", fontFamily: FONT, display: "flex", gap: 6, alignItems: "center" }}>
                    <Shield size={12}/> PRESENTACIÓN Y OBJETIVOS DEL ESTUDIANTE
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#1B6FE8", fontFamily: FONT }}>
                    {expanded ? 'Ocultar documento' : 'Lectura rápida de presentación'}
                    <ChevronDown size={14} style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s" }}/>
                  </span>
               </div>

               <AnimatePresence>
                 {expanded && (
                   <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
                     <p style={{ margin: 0, fontSize: 13, color: "#334155", lineHeight: 1.6, fontFamily: FONT, background: "#FFFFFF", padding: "12px", border: "1px solid #E2E8F0", borderRadius: "8px" }}>
                        {postulacion.mensajePostulacion || <span style={{ fontStyle: "italic", color: "#94A3B8" }}>Presentación mediante documentación estándar adjunta.</span>}
                     </p>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "12px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, marginTop: expanded ? 0 : "auto" }}>
               {isLoading && <Loader2 size={16} className="animate-spin" style={{ color: "#94A3B8" }}/>}
               
               {!isLoading && puedeRechazar && (
                  <button onClick={() => setModalAction("rechazar")}
                    style={{ background: "transparent", color: "#64748B", fontSize: 13, fontWeight: 600, border: "1px solid #E2E8F0", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontFamily: FONT, transition: "all 0.2s" }}
                    onMouseEnter={e => {e.currentTarget.style.color="#B91C1C"; e.currentTarget.style.background="#FEF2F2"; e.currentTarget.style.borderColor="#FECACA";}}
                    onMouseLeave={e => {e.currentTarget.style.color="#64748B"; e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="#E2E8F0";}}>
                    Descartar Candidato
                  </button>
               )}
               
               {!isLoading && puedeValidar && (
                  <button onClick={() => setModalAction("validar")}
                    style={{ background: "#1B6FE8", color: "#FFFFFF", fontSize: 13, fontWeight: 600, border: "1px solid rgba(255,255,255,0.1)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 2px 4px rgba(27,111,232,0.15)", fontFamily: FONT, transition: "all 0.2s" }}
                    onMouseEnter={e => {e.currentTarget.style.background="#1862D1"; e.currentTarget.style.transform="translateY(-1px)";}}
                    onMouseLeave={e => {e.currentTarget.style.background="#1B6FE8"; e.currentTarget.style.transform="translateY(0)";}}>
                    Aprobar y Confirmar Ingreso
                  </button>
               )}
               {!isLoading && !puedeValidar && !puedeRechazar && (
                   <span style={{ fontSize: 12, color: "#94A3B8", fontFamily: FONT }}>Ninguna acción pendiente de tu parte en este perfil.</span>
               )}
            </div>

        </div>

      </div>

      <ConfirmModal
        isOpen={modalAction !== null}
        title={modalAction === "validar" ? "Confirmar Talento" : "Descartar Perfil"}
        message={
          modalAction === "validar"
            ? `Al validar a ${postulacion.estudianteNombre}, apruebas su paso a la integración directa a la empresa. ¿Deseas aprobar su entrada al equipo?`
            : `El expediente de ${postulacion.estudianteNombre} pasará al registro histórico y no será incorporado a tu proyecto. ¿Confirmas tu decisión?`
        }
        confirmText={modalAction === "validar" ? "Aprobar Perfil" : "Confirmar Descartes"}
        variant={modalAction === "validar" ? "success" : "danger"}
        onConfirm={confirmChoice}
        onCancel={() => setModalAction(null)}
        isLoading={isLoading && modalAction !== null}
      />
    </motion.div>
  );
}


/* ═══════════════════════════════════════════════
   WORKSPACE DE SUPERVISIÓN DEL PROYECTO
═══════════════════════════════════════════════ */
function ProjectEcosystemSection({ proyecto, globalOpenStateFilter }) {
  const [expanded, setExpanded] = useState(false);
  const [internalViewAll, setInternalViewAll] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const hookNormal = usePostulacionesAceptadas(proyecto.id);
  const hookCompleto = usePostulaciones(internalViewAll ? proyecto.id : null);
  
  const selectedHook = internalViewAll ? hookCompleto : hookNormal;
  const postulaciones = selectedHook?.postulaciones || [];
  const isLoading = selectedHook?.isLoading || false;

  const validPendingEvaluation = postulaciones.filter((p) => p.estado === "PRESELECCIONADO");
  const puedeExpandir = postulaciones.length > 0;
  const consolidated = postulaciones.filter((p) => ["CONFIRMADO", "VALIDADO_MYPE"].includes(p.estado));

  const postulantesRenders = internalViewAll 
     ? postulaciones
     : postulaciones.filter((p) => ["PRESELECCIONADO", "CONFIRMADO", "VALIDADO_MYPE"].includes(p.estado));

  if (globalOpenStateFilter === 'operativos' && proyecto.estado !== 'EN_DESARROLLO') return null;
  if (globalOpenStateFilter === 'pendientes' && proyecto.estado !== 'PENDIENTE') return null;

  return (
    <motion.div key={`${refreshKey}-${proyecto.id}`}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      style={{ background: expanded ? "#FFFFFF" : "transparent", border: "1px solid", borderColor: expanded ? "#E2E8F0" : "transparent", borderRadius: "16px", marginBottom: "16px", transition: "all 0.3s", boxShadow: expanded ? "0 10px 25px -5px rgba(0, 0, 0, 0.05)" : "none", overflow: "hidden" }}
    >
      <div 
        onClick={() => puedeExpandir && setExpanded(!expanded)}
        style={{ 
          width: "100%", 
          display: "grid", 
          gridTemplateColumns: "minmax(250px, 2fr) auto auto 40px", 
          gap: 24, 
          padding: expanded ? "24px 28px 20px" : "20px 24px", 
          background: expanded ? "transparent" : "#FFFFFF", 
          border: expanded ? "none" : "1px solid #E2E8F0", 
          borderRadius: expanded ? "0" : "16px", 
          cursor: puedeExpandir ? "pointer" : "default",
          opacity: puedeExpandir ? 1 : 0.7,
          transition: "background 0.2s", 
          alignItems: "center" 
        }}
        onMouseEnter={(e) => !expanded && puedeExpandir && (e.currentTarget.style.boxShadow = "0 4px 12px -4px rgba(0,0,0,0.06)")}
        onMouseLeave={(e) => !expanded && (e.currentTarget.style.boxShadow = "none")}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", minWidth: 0 }}>
          {/* El icono ya no está aquí */}
          <div style={{ textAlign: "left", minWidth: 0, display: "flex", flexDirection: "column", gap: "2px", overflow: "hidden" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F1F3D", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: FONT }}>{proyecto.titulo}</h3>
              <p style={{ margin: 0, fontSize: 13, color: "#64748B", fontFamily: FONT }}>{proyecto.fechaLimite ? `Tope Integración: ${new Date(proyecto.fechaLimite).toLocaleDateString("es-PE")}` : 'Programa Activo Permanente'}</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
           <div style={{ display: "flex", flexDirection: "column", gap: "2px", textAlign: "right" }}>
              <span style={{ fontSize: 10, color: "#64748B", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: FONT }}>PROGRESO CENTRAL</span>
              <span style={{ fontSize: 13, color: "#0F1F3D", fontWeight: 600, fontFamily: FONT }}>
                {proyecto.estado === 'EN_DESARROLLO' ? 'Producción y Trabajo' : 'Evaluación MYPE'}
              </span>
           </div>
           {proyecto.cupos && (
             <div style={{ padding: "0 24px", borderLeft: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "4px" }}>
                 <div style={{ fontSize: 13, color: "#334155", display: "flex", alignItems: "center", gap: 6, fontWeight: 500, fontFamily: FONT }}>
                   <Users size={14}/> {proyecto.cupos} requeridos
                 </div>
             </div>
           )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, borderLeft: "1px solid #E2E8F0", paddingLeft: "24px" }}>
           {validPendingEvaluation.length > 0 && !expanded && (
               <div style={{ display: "inline-flex", gap: 6, alignItems: "center", background: "#FEF9C3", padding: "2px 8px", borderRadius: "4px", fontSize: 11, fontWeight: 600, color: "#854D0E", fontFamily: FONT }}>
                   Acción solicitada ({validPendingEvaluation.length})
               </div>
           )}
           {/* Barra de progreso de ocupación */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 120 }}>
              <div style={{ 
                width: "100%", 
                height: 6, 
                background: "#E2E8F0", 
                borderRadius: 3, 
                overflow: "hidden" 
              }}> 
                <div style={{ 
                  width: `${Math.min(100, (consolidated.length / (proyecto.cupos || 1)) * 100)}%`, 
                  height: "100%", 
                  background: consolidated.length === 0 ? "#CBD5E1" : 
                              consolidated.length >= (proyecto.cupos || 1) ? "#10B981" : "#1B6FE8",
                  borderRadius: 3,
                  transition: "width 0.3s ease"
                }} />
              </div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                fontSize: 10, 
                fontFamily: FONT, 
                color: "#64748B" 
              }}>
                <span>{consolidated.length} cubiertos</span>
                <span>{(proyecto.cupos || 1) - consolidated.length} pendientes</span>
              </div>
            </div>
        </div>

       <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {puedeExpandir ? (
                <ChevronDown size={20} color={expanded ? "#1E293B" : "#94A3B8"} style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }} />
            ) : (
                <div style={{ width: 20, height: 20 }} />
            )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            style={{ overflow: "hidden", borderTop: "1px solid #F1F5F9" }}>
              
            <div style={{ padding: "24px 28px", background: "#FAFAFA" }}>
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
                   <div style={{ maxWidth: 500 }}>
                       <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1E293B", fontFamily: FONT }}>Administración Estratégica del Equipo</h4>
                       <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748B", fontFamily: FONT, lineHeight: 1.6 }}>Define con precisión a quién integras y de quién decides prescindir dentro de los bloques asignados para la consolidación de tecnología en la empresa.</p>
                   </div>
                   <div style={{ display: "flex", background: "#E2E8F0", padding: "4px", borderRadius: "8px", gap: "2px" }}>
                       <button onClick={() => setInternalViewAll(false)} style={{ border: "none", background: !internalViewAll ? "#FFFFFF" : "transparent", color: !internalViewAll ? "#0F1F3D" : "#475569", fontWeight: !internalViewAll ? 600 : 500, padding: "6px 14px", borderRadius: "6px", fontSize: 12, cursor: "pointer", boxShadow: !internalViewAll ? "0 1px 2px rgba(0,0,0,0.06)" : "none", fontFamily: FONT, transition: "0.2s" }}>
                          Evaluación Principal
                       </button>
                       <button onClick={() => setInternalViewAll(true)} style={{ border: "none", background: internalViewAll ? "#FFFFFF" : "transparent", color: internalViewAll ? "#0F1F3D" : "#475569", fontWeight: internalViewAll ? 600 : 500, padding: "6px 14px", borderRadius: "6px", fontSize: 12, cursor: "pointer", boxShadow: internalViewAll ? "0 1px 2px rgba(0,0,0,0.06)" : "none", fontFamily: FONT, transition: "0.2s" }}>
                          Registro Completo
                       </button>
                   </div>
               </div>

               {isLoading ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
                    <div style={{ height: 160, borderRadius: "12px", background: "linear-gradient(90deg, #F1F5F9 0%, #E2E8F0 50%, #F1F5F9 100%)", backgroundSize: "200% 100%", animation: "loadingShift 1.5s infinite" }} />
                    <div style={{ height: 160, borderRadius: "12px", background: "linear-gradient(90deg, #F1F5F9 0%, #E2E8F0 50%, #F1F5F9 100%)", backgroundSize: "200% 100%", animation: "loadingShift 1.5s infinite", animationDelay: "0.2s" }} />
                  </div>
               ) : postulantesRenders.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 40px", border: "1px dashed #CBD5E1", borderRadius: "12px", background: "#FFFFFF", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.01)" }}>
                    <div style={{ width: 64, height: 64, borderRadius: "16px", background: "#F1F5F9", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                      <LayoutDashboard size={28} color="#94A3B8" />
                    </div>
                    <h3 style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: "#1E293B", margin: "0 0 8px" }}>Sin talento a procesar</h3>
                    <p style={{ fontFamily: FONT, fontSize: 13, color: "#64748B", margin: "0 auto", maxWidth: 450, lineHeight: 1.5 }}>
                      No se encontraron perfiles en esta vista del módulo. Permite que más tiempo corra para consolidar datos en las propuestas operativas empresariales.
                    </p>
                  </div>
               ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
                     {postulantesRenders.map(p => (
                         <TalentExecutiveModule 
                            key={p.id} postulacion={p} proyectoId={proyecto.id} 
                            verTodos={internalViewAll} onEstadoChange={() => setRefreshKey(prev => prev + 1)} 
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
   PÁGINA RAÍZ CORPORATIVA
═══════════════════════════════════════════════ */
export function PostulantesPage() {
  const { proyectos, isLoading } = useMisProyectos();
  
  const [tabFocus, setTabFocus] = useState('todos'); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getProyectosActivosRaiz = () => {
      let f = proyectos.filter((p) => p.estado === "PENDIENTE" || p.estado === "EN_DESARROLLO");
      return f.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
  };
  
  const listToIterate = getProyectosActivosRaiz();
  const totalPages = Math.ceil(listToIterate.length / itemsPerPage);
  const currentViewList = listToIterate.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const metricsObject = {
     enDesarrollo: proyectos.filter(p => p.estado === 'EN_DESARROLLO').length,
     porAtender: proyectos.filter(p => p.estado === 'PENDIENTE').length
  };

  return (
    <MypeLayout titulo="Área Ejecutiva del Talento" descripton="Acepta propuestas, maneja el reclutamiento o aprueba miembros organizacionales con reportes estratégicos empresariales.">
      <style>{`
        @keyframes loadingShift { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .animate-spin { animation: core-spin 1s linear infinite; }
        @keyframes core-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      
      <div style={{ maxWidth: 1240, margin: "0 auto", paddingBottom: "80px" }}>
        
        <ExecutiveCommandCenter totalProyectos={listToIterate.length} metrics={metricsObject} />

        <motion.div {...fadeUp(0.1)} style={{ marginBottom: 32 }}>
            <div style={{ display: "inline-flex", background: "#F1F5F9", padding: "6px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
                 <button onClick={() => setTabFocus('todos')} style={{ border: "none", cursor: "pointer", fontFamily: FONT, background: tabFocus === 'todos' ? "#FFFFFF" : "transparent", padding: "10px 24px", borderRadius: "8px", color: tabFocus === 'todos' ? "#0F1F3D" : "#64748B", fontWeight: 600, fontSize: 13, transition: "all 0.3s", boxShadow: tabFocus === 'todos' ? "0 2px 4px rgba(0,0,0,0.04)" : "none" }}>Visión General</button>
                 <button onClick={() => setTabFocus('pendientes')} style={{ border: "none", cursor: "pointer", fontFamily: FONT, background: tabFocus === 'pendientes' ? "#FFFFFF" : "transparent", padding: "10px 24px", borderRadius: "8px", color: tabFocus === 'pendientes' ? "#0F1F3D" : "#64748B", fontWeight: 600, fontSize: 13, transition: "all 0.3s", boxShadow: tabFocus === 'pendientes' ? "0 2px 4px rgba(0,0,0,0.04)" : "none" }}>Fase de Reclutamiento</button>
                 <button onClick={() => setTabFocus('operativos')} style={{ border: "none", cursor: "pointer", fontFamily: FONT, background: tabFocus === 'operativos' ? "#FFFFFF" : "transparent", padding: "10px 24px", borderRadius: "8px", color: tabFocus === 'operativos' ? "#0F1F3D" : "#64748B", fontWeight: 600, fontSize: 13, transition: "all 0.3s", boxShadow: tabFocus === 'operativos' ? "0 2px 4px rgba(0,0,0,0.04)" : "none" }}>Equipos en Desarrollo</button>
            </div>
        </motion.div>

        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ height: 110, borderRadius: "16px", border: "1px solid #E2E8F0", background: "linear-gradient(90deg, #F8FAFC 0%, #F1F5F9 50%, #F8FAFC 100%)", backgroundSize: "200% 100%", animation: "loadingShift 1.8s infinite" }}/>
            ))}
          </div>
        ) : listToIterate.length === 0 ? (
          <motion.div {...fadeUp(0.15)} style={{ textAlign: "center", padding: "100px 40px", border: "1px dashed #CBD5E1", borderRadius: "20px", background: "#FFFFFF" }}>
            <div style={{ width: 88, height: 88, borderRadius: "24px", background: "#F8FAFC", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.02)" }}>
              <UserPlus size={40} color="#64748B" />
            </div>
            <h3 style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: "#1E293B", marginBottom: 12, letterSpacing: "-0.01em" }}>Centro de Operaciones Limpio</h3>
            <p style={{ fontFamily: FONT, fontSize: 14, color: "#64748B", maxWidth: 450, margin: "0 auto", lineHeight: 1.6 }}>Publica tu primera oportunidad de vinculación en el apartado de proyectos para empezar a construir aquí tu red de perfiles tecnológicos evaluables.</p>
          </motion.div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {currentViewList.map((proyecto) => (
                <ProjectEcosystemSection key={proyecto.id} proyecto={proyecto} globalOpenStateFilter={tabFocus} />
            ))}
            
            {totalPages > 1 && (
               <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 48 }}>
                   {[...Array(totalPages)].map((_, index) => (
                      <button key={index} onClick={() => setCurrentPage(index + 1)}
                         style={{ fontFamily: FONT, background: currentPage === index + 1 ? "#1B6FE8" : "#FFFFFF", color: currentPage === index + 1 ? "#FFFFFF" : "#64748B", width: 40, height: 40, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, border: `1px solid ${currentPage === index + 1 ? "transparent" : "#E2E8F0"}`, cursor: "pointer", boxShadow: currentPage === index + 1 ? "0 4px 12px rgba(27,111,232,0.3)" : "none", transition: "all 0.2s" }}
                         onMouseEnter={e => {if(currentPage !== index + 1){ e.currentTarget.style.borderColor="#CBD5E1"; e.currentTarget.style.background="#F8FAFC" }}}
                         onMouseLeave={e => {if(currentPage !== index + 1){ e.currentTarget.style.borderColor="#E2E8F0"; e.currentTarget.style.background="#FFFFFF" }}}>
                         {index + 1}
                      </button>
                   ))}
               </div>
            )}

            {currentViewList.length > 0 && currentViewList.filter(p => tabFocus === 'operativos' ? p.estado === 'EN_DESARROLLO' : tabFocus === 'pendientes' ? p.estado === 'PENDIENTE' : true).length === 0 && (
                <div style={{ textAlign: "center", padding: "60px", background: "transparent" }}>
                   <p style={{ margin: 0, fontFamily: FONT, fontSize: 14, color: "#64748B" }}>
                       Ninguno de tus procesos visibles en esta sección corresponde a tu segmentación solicitada. Selecciona "Visión General" para tener perspectiva absoluta.
                   </p>
                </div>
            )}
          </div>
        )}
      </div>
    </MypeLayout>
  );
}