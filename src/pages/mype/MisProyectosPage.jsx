import { useState, useRef, useEffect, useMemo } from "react";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import { useMisProyectos } from "@/features/proyecto-list-mype/useMisProyectos";
import { AREA_SISTEMAS_LABELS } from "@/entities/proyecto/proyecto.constants";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmModal } from '@/shared/components/ConfirmModal';
import { CalificacionesPendientesCard } from "@/features/calificaciones/CalificacionesPendientesCard";
import {
  Users,
  Pencil,
  Trash2,
  FileText,
  Loader2,
  X,
  Save,
  AlertTriangle,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight
} from "lucide-react";
import { useEditarProyecto, useEliminarProyecto } from "@/features/proyecto-edit/useEditarProyecto";

const FONT = "'Angro Std', 'Outfit', sans-serif";

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

    // Red de puntos corporativos (estilo neural/empresarial)
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
        gap: 40
      }}
    >
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: -100, right: -50, width: 300, height: 300, background: "radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)", filter: "blur(40px)" }}/>

      {/* Titular y Acción (Integrados sin redundancia) */}
      <div style={{ position: "relative", zIndex: 10, flex: "1 1 50%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: "8px", padding: "6px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#38BDF8", marginBottom: 16 }}>
            Panel Ejecutivo
          </div>
          <h1 style={{ fontFamily: FONT, fontSize: "2.4rem", fontWeight: 500, color: "#FFFFFF", margin: "0 0 12px", letterSpacing: "-0.03em" }}>
           Centro de Proyectos
          </h1>
          <p style={{ fontFamily: FONT, fontSize: 15, color: "#94A3B8", margin: 0, lineHeight: 1.6, fontWeight: 400, maxWidth: "90%" }}>
            Controla el progreso de tus proyectos, las postulaciones recibidas y los entregables pendientes.
          </p>
        </div>
        
        {/* ÚNICO BOTÓN PRINCIPAL - Elimina el anterior fuera del banner */}
        <div style={{ marginTop: 40 }}>
          <Link to="/dashboard/mype/crear" style={{ textDecoration: "none" }}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ fontFamily: FONT, background: "#1B6FE8", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "14px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10, boxShadow: "0 8px 16px -4px rgba(27,111,232,0.3)", textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
              Crear Proyecto <ArrowRight size={16} />
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Analytics Insights Dashboard (Generado desde los props) */}
      <div style={{ position: "relative", zIndex: 10, flex: "1 1 50%", display: "flex", gap: 16, flexDirection: "column", justifyContent: "center" }}>
        
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px", backdropFilter: "blur(10px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94A3B8", marginBottom: 12 }}>
               <TrendingUp size={16} /> <span style={{ fontSize: 11, fontWeight: 600, fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.05em" }}>Proyectos Activos</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 400, color: "#FFFFFF", fontFamily: FONT, lineHeight: 1 }}>{totalProyectos}</div>
            <div style={{ marginTop: 8, fontSize: 12, color: "#10B981", display: "flex", alignItems: "center", gap: 4, fontFamily: FONT }}><span style={{ width:6, height:6, background:"#10B981", borderRadius:"50%"}}></span> Activas en plataforma</div>
          </div>
          
          <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px", backdropFilter: "blur(10px)" }}>
             <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94A3B8", marginBottom: 12 }}>
               <CheckCircle2 size={16} /> <span style={{ fontSize: 11, fontWeight: 600, fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.05em" }}>Nivel de Avance</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 400, color: "#FFFFFF", fontFamily: FONT, lineHeight: 1 }}>{metrics.activos}</div>
             <div style={{ marginTop: 8, fontSize: 12, color: "#38BDF8", display: "flex", alignItems: "center", gap: 4, fontFamily: FONT }}>En ejecución crítica</div>
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 12, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
               <div style={{ fontSize: 12, color: "#FFFFFF", fontWeight: 600, fontFamily: FONT, marginBottom: 4 }}>Proyectos por Atender</div>
               <div style={{ fontSize: 11, color: "#64748B", fontFamily: FONT }}>{metrics.pendientes} requieren asignación de talento.</div>
            </div>
            {/* Visual Mini Progress Bar based on completed vs active */}
            <div style={{ width: 120, height: 6, background: "#1E293B", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${totalProyectos ? (metrics.activos/totalProyectos)*100 : 0}%`, height: "100%", background: "linear-gradient(90deg, #1B6FE8, #38BDF8)" }} />
            </div>
        </div>
      </div>
    </motion.div>
  );
};


/* ═══════════════════════════════════════════════
   WORKFLOW PIPELINE TRACKER
═══════════════════════════════════════════════ */
const WorkflowPipelineTracker = ({ estado }) => {
  const isEnDesarrollo = estado === "EN_DESARROLLO";
  const isCompletado = estado === "COMPLETADO";
  
  let currentLevel = 1;
  if (isCompletado) currentLevel = 3;
  else if (isEnDesarrollo) currentLevel = 2;

  const stages = ["Inicio", "Equipo Completo", "Completado"];

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%", gap: 4 }}>
       {stages.map((stg, i) => {
         const isActive = currentLevel === (i + 1);
         const isPast = currentLevel > (i + 1);
         
         const bg = isPast ? "#10B981" : isActive ? "#1B6FE8" : "#E2E8F0";
         const textColor = (isPast || isActive) ? "#0F1F3D" : "#94A3B8";

         return (
           <div key={i} style={{ flex: 1, height: "4px", borderRadius: "2px", background: isPast ? "#E0F2FE" : "#F1F5F9", position: "relative" }}>
             <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: (isPast || isActive) ? "100%" : "0%", background: bg, transition: "width 0.6s ease", borderRadius: "2px" }}/>
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
   BUSINESS PIPELINE ROW (Expande con acordeón)
═══════════════════════════════════════════════ */
const BusinessPipelineRow = ({ proyecto, onEdit, onDelete, onViewPostulantes, onReviewEntregables }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const areaLabel = AREA_SISTEMAS_LABELS[proyecto.areaSistemas] ?? proyecto.areaSistemas;
  const isEnDesarrollo = proyecto.estado === "EN_DESARROLLO";
  const isCompletado = proyecto.estado === "COMPLETADO";
  const isEditable = !isEnDesarrollo && !isCompletado;

  // Derive "Pace" fake visual based on urgency
  const daysLeft = proyecto.fechaLimite ? Math.ceil((new Date(proyecto.fechaLimite) - new Date()) / (1000 * 60 * 60 * 24)) : 30;
  const healthStatus = isCompletado ? { color: "#10B981", bg: "#F0FDF4", t: "Finalizado" } : 
                       (daysLeft < 7 ? { color: "#EF4444", bg: "#FEF2F2", t: "En Riesgo" } : 
                                       { color: "#38BDF8", bg: "#F0F9FF", t: "En curso" });

  const ActionFn = isEnDesarrollo ? onReviewEntregables : onViewPostulantes;
  const actionTxt = isEnDesarrollo ? "Ver Entregables" : "Ver Postulantes";

  return (
    <motion.div 
      layout
      style={{ 
        background: isExpanded ? "#FFFFFF" : "#FCFDFD",
        border: "1px solid", 
        borderColor: isExpanded ? "#E2E8F0" : "#F1F5F9",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: isExpanded ? "0 12px 32px -8px rgba(15,23,42,0.08)" : "0 2px 4px rgba(15,23,42,0.01)",
        transition: "box-shadow 0.3s ease, border-color 0.3s ease",
        marginBottom: 16
      }}
    >
      {/* Resumen Principal Visible */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "minmax(300px, 2fr) 1.5fr 1fr 1fr auto", gap: 20, alignItems: "center", cursor: "pointer", position: "relative" }}
      >
        {/* Identificador & Area */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
           <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
             <span style={{ fontSize: 10, fontFamily: FONT, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em" }}>{`IDX-${proyecto.id.toString().padStart(4,"0")}`}</span>
             <span style={{ fontSize: 9, fontFamily: FONT, fontWeight: 600, color: "#1B6FE8", background: "#EFF6FF", padding: "2px 8px", borderRadius: "4px" }}>{areaLabel}</span>
           </div>
           <h3 style={{ margin: 0, fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "#0F1F3D", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {proyecto.titulo}
           </h3>
        </div>

        {/* Flujo Timeline Minimalista */}
        <div style={{ paddingRight: 32 }}>
          <WorkflowPipelineTracker estado={proyecto.estado} />
        </div>

        {/* System Insights Generados */}
        <div>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontFamily: FONT, fontWeight: 600, color: healthStatus.color, background: healthStatus.bg, padding: "4px 8px", borderRadius: "6px", width: "fit-content" }}>
            <Activity size={12} /> {healthStatus.t}
          </span>
        </div>

        {/* Recursos */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748B", fontFamily: FONT, fontSize: 12 }}>
           <Users size={14} /> <span style={{ fontWeight: 500 }}>{proyecto.cupos} Vacantes Disponibles</span>
        </div>

        {/* Indicador de Acción */}
        <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
          <ChevronRight size={18} color="#94A3B8"/>
        </motion.div>
      </div>

      {/* ÁREA EXPANDIDA (Datos Crudos & Acciones Corporativas) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            style={{ overflow: "hidden", borderTop: "1px solid #F1F5F9" }}
          >
             <div style={{ padding: "24px 24px 32px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: 48, background: "#FFFFFF" }}>
                
                {/* Lado Contextual */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                   <div>
                     <h4 style={{ margin: "0 0 8px 0", fontSize: 11, fontFamily: FONT, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Alcance de Requerimiento Funcional</h4>
                     <p style={{ margin: 0, fontSize: 13, fontFamily: FONT, color: "#475569", lineHeight: 1.6 }}>{proyecto.descripcion}</p>
                   </div>
                   
                   <div style={{ display: "flex", gap: 40, borderTop: "1px dashed #E2E8F0", paddingTop: 20 }}>
                     <div>
                       <span style={{ display: "block", fontSize: 11, fontFamily: FONT, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Fecha de Inicio</span>
                       <span style={{ fontSize: 13, fontFamily: FONT, color: "#0F1F3D", fontWeight: 600 }}>{proyecto.fechaInicio ? new Date(proyecto.fechaInicio).toLocaleDateString('es-PE') : "Inmediato"}</span>
                     </div>
                     <div>
                       <span style={{ display: "block", fontSize: 11, fontFamily: FONT, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Fecha de Entrega</span>
                       <span style={{ fontSize: 13, fontFamily: FONT, color: "#0F1F3D", fontWeight: 600 }}>{proyecto.fechaLimite ? new Date(proyecto.fechaLimite).toLocaleDateString('es-PE') : "N/A"}</span>
                     </div>
                   </div>
                </div>

                {/* Panel de Operaciones del Workspace */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", background: "#F8FAFC", borderRadius: "12px", padding: 20, border: "1px solid #E2E8F0" }}>
                   <div style={{ fontSize: 10, fontFamily: FONT, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Consola de Mando Operativa</div>
                   
                   <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                     <button 
                        onClick={(e) => { e.stopPropagation(); ActionFn(); }}
                        style={{ 
                          background: "linear-gradient(135deg, #19407a , #3b5474 )", 
                          color: "#FFFFFF", 
                          fontFamily: FONT, 
                          border: "none", 
                          padding: "12px", 
                          borderRadius: "8px", 
                          fontSize: 12, 
                          fontWeight: 600, 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "space-between", 
                          cursor: "pointer",
                          boxShadow: "0 4px 12px rgba(27,111,232,0.3)",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-1px)";
                          e.currentTarget.style.boxShadow = "0 8px 20px rgba(27,111,232,0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(27,111,232,0.3)";
                        }}
                      >
                        <span>{actionTxt}</span>
                        <ArrowRight size={14} />
                      </button>
                     
                     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <button 
                           onClick={(e) => { e.stopPropagation(); onEdit(); }} disabled={!isEditable}
                           style={{ background: "#FFFFFF", color: isEditable ? "#64748B" : "#CBD5E1", border: "1px solid", borderColor: isEditable ? "#CBD5E1" : "#E2E8F0", padding: "8px", borderRadius: "8px", fontFamily: FONT, fontSize: 11, fontWeight: 600, cursor: isEditable ? "pointer" : "not-allowed", display: "flex", justifyContent: "center", gap: 6, alignItems: "center" }}
                         >
                           <Pencil size={12}/> Editar
                        </button>
                        <button 
                           onClick={(e) => { e.stopPropagation(); onDelete(); }} disabled={isEnDesarrollo}
                           style={{ background: "transparent", color: isEnDesarrollo ? "#CBD5E1" : "#EF4444", border: "1px dashed", borderColor: isEnDesarrollo ? "#CBD5E1" : "#FCA5A5", padding: "8px", borderRadius: "8px", fontFamily: FONT, fontSize: 11, fontWeight: 600, cursor: isEnDesarrollo ? "not-allowed" : "pointer", display: "flex", justifyContent: "center", gap: 6, alignItems: "center" }}
                         >
                           <Trash2 size={12}/> Eliminar
                        </button>
                     </div>
                   </div>
                </div>

             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};


/* ═══════════════════════════════════════════════
   PREMIUM CONFIGURATION MODAL (BLUE AESTHETIC - LINEAR INSPIRED)
   El "Modal Azul Actual" mejorado y empresarial.
═══════════════════════════════════════════════ */
function PremiumConfigurationModal({ proyecto, onClose }) {
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

  const handleChange = (field, value) => setForm(p => ({ ...p, [field]: value }));
  const handleSubmit = (e) => { e.preventDefault(); editarProyecto({ id: proyecto.id, data: { ...form, cupos: Number(form.cupos) } }, { onSuccess: onClose }); };

  // Theme constants para el Modal Corporativo "Blue"
  const theme = { bg: "#040914", panelBg: "#0B1526", border: "#1A2C4A", textPrm: "#FFFFFF", textSec: "#8C9BB4", inputBg: "#08101E" };
  const stInput = { width: "100%", padding: "14px 16px", borderRadius: "8px", fontFamily: FONT, fontSize: 13, border: `1px solid ${theme.border}`, background: theme.inputBg, color: theme.textPrm, outline: "none", boxSizing: "border-box" };
  const stLabel = { fontFamily: FONT, fontSize: 11, fontWeight: 700, color: theme.textSec, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 };

  const AREAS = [ { value: "DESARROLLO_WEB", label: "Web Deployment" }, { value: "DESARROLLO_MOVIL", label: "Mobile Dev Ops" }, { value: "DESARROLLO_SOFTWARE", label: "Core Software Systems" }, { value: "BASE_DE_DATOS", label: "Database / Arch" }, { value: "ANALISIS_DATOS", label: "Data Science & BI" }, { value: "SOPORTE_TI", label: "IT Infrastructure" }, { value: "OTRO", label: "Other Technical Array" } ];
  const hoy = () => new Date().toISOString().split("T")[0];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
      {/* Immersive Overlay Backdrop */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
        style={{ position: "absolute", inset: 0, background: "rgba(2, 6, 15, 0.8)", backdropFilter: "blur(12px)" }} onClick={onClose} 
      />

      {/* Main Terminal Window */}
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} transition={{ duration: 0.4, type: "spring", damping: 25, stiffness: 300 }}
        style={{ position: "relative", zIndex: 110, width: "100%", maxWidth: 760, maxHeight: "90vh", display: "flex", flexDirection: "column", background: theme.bg, borderRadius: "20px", border: `1px solid ${theme.border}`, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)" }}
      >
        <div style={{ position: "absolute", top: -100, left: "20%", width: 300, height: 100, background: "#1B6FE8", filter: "blur(80px)", opacity: 0.15 }} />

        {/* Modal Header */}
        <div style={{ padding: "32px 40px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: theme.panelBg }}>
           <div>
              <div style={{ fontSize: 10, fontFamily: FONT, color: "#38BDF8", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>Configuración del Proyecto</div>
              <h2 style={{ margin: 0, fontSize: 24, fontFamily: FONT, color: theme.textPrm, fontWeight: 500, letterSpacing: "-0.02em" }}>Datos del proyecto</h2>
           </div>
           <button onClick={onClose} style={{ background: "transparent", border: "none", color: theme.textSec, cursor: "pointer", padding: 8 }}>
              <X size={20} />
           </button>
        </div>

        {/* Configuration Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "40px" }}>
           <form id="blue-edit-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
             
             <div>
                <label style={stLabel}>Nombre del Proyecto</label>
                <input required value={form.titulo} onChange={e => handleChange("titulo", e.target.value)} style={stInput} onFocus={e => e.target.style.borderColor = "#1B6FE8"} onBlur={e => e.target.style.borderColor = theme.border} />
             </div>

             <div>
                <label style={stLabel}>Descripción del Proyecto</label>
                <textarea required rows={4} value={form.descripcion} onChange={e => handleChange("descripcion", e.target.value)} style={{ ...stInput, resize: "vertical", lineHeight: 1.5 }} onFocus={e => e.target.style.borderColor = "#1B6FE8"} onBlur={e => e.target.style.borderColor = theme.border} />
             </div>

             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, padding: "24px", background: theme.panelBg, border: `1px solid ${theme.border}`, borderRadius: 12 }}>
                <div>
                   <label style={stLabel}>Área de Desarrollo</label>
                   <select value={form.areaSistemas} onChange={e => handleChange("areaSistemas", e.target.value)} style={{ ...stInput, cursor: "pointer" }} onFocus={e => e.target.style.borderColor = "#1B6FE8"} onBlur={e => e.target.style.borderColor = theme.border}>
                     {AREAS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                   </select>
                </div>
                <div>
                   <label style={stLabel}>Cantidad de Estudiantes</label>
                   <input type="number" min={1} max={5} value={form.cupos} onChange={e => handleChange("cupos", e.target.value)} style={stInput} onFocus={e => e.target.style.borderColor = "#1B6FE8"} onBlur={e => e.target.style.borderColor = theme.border}/>
                </div>
                <div>
                   <label style={stLabel}>Fecha de Inicio</label>
                   <input type="date" value={form.fechaInicio?.split("T")[0] ?? ""} min={hoy()} onChange={e => handleChange("fechaInicio", e.target.value)} style={{...stInput, colorScheme:"dark"}} onFocus={e => e.target.style.borderColor = "#1B6FE8"} onBlur={e => e.target.style.borderColor = theme.border} />
                </div>
                <div>
                   <label style={stLabel}>Fecha de Entrega</label>
                   <input type="date" value={form.fechaLimite?.split("T")[0] ?? ""} min={form.fechaInicio || hoy()} onChange={e => handleChange("fechaLimite", e.target.value)} style={{...stInput, colorScheme:"dark"}} onFocus={e => e.target.style.borderColor = "#1B6FE8"} onBlur={e => e.target.style.borderColor = theme.border} />
                </div>
             </div>

             {error && (
               <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: 16, display: "flex", gap: 10, alignItems: "center", color: "#FCA5A5", fontSize: 13, fontFamily: FONT }}>
                 <AlertTriangle size={16} /> Error al guardar: {error}
               </div>
             )}
           </form>
        </div>

        {/* Footer actions */}
        <div style={{ padding: "24px 40px", borderTop: `1px solid ${theme.border}`, background: theme.panelBg, display: "flex", justifyContent: "flex-end", gap: 16 }}>
           <button type="button" onClick={onClose} disabled={isLoading} style={{ background: "transparent", color: theme.textSec, fontFamily: FONT, fontSize: 13, fontWeight: 600, padding: "12px 24px", cursor: "pointer", border: "none" }}>Cancelar</button>
           <button type="submit" form="blue-edit-form" disabled={isLoading} style={{ background: "#1B6FE8", color: "#FFFFFF", fontFamily: FONT, fontSize: 13, fontWeight: 700, padding: "12px 32px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 8, cursor: isLoading ? "not-allowed":"pointer", boxShadow:"0 4px 12px rgba(27,111,232,0.4)" }}>
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16}/> } Guardar cambios
           </button>
        </div>
      </motion.div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   MAIN SYSTEM WORKSPACE CONTROLLER
═══════════════════════════════════════════════ */
export function MisProyectosPage() {
  const { proyectos, isLoading } = useMisProyectos();
  const navigate = useNavigate();
  const { eliminarProyecto, isLoading: eliminando } = useEliminarProyecto();

  // Internal Logic Engine remains untouched. UI architecture adapted on top.
  const [proyectoEditando, setProyectoEditando] = useState(null);
  const [proyectoEliminando, setProyectoEliminando] = useState(null);
  

    // Paginación y estado para el flujo de Marco
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const handleDeleteClick = (proyecto) => { setProjectToDelete(proyecto); setShowDeleteProjectModal(true); };
  const handleConfirmDeleteProject = () => { if (projectToDelete) { eliminarProyecto(projectToDelete.id, { onSuccess: () => { setShowDeleteProjectModal(false); setProjectToDelete(null); } }); } };

  // Data pre-processing for intelligence visualizations
  const metrics = useMemo(() => {
    if (!proyectos) return { activos: 0, completados: 0, pendientes: 0 };
    return proyectos.reduce((acc, p) => {
      if (p.estado === 'EN_DESARROLLO') acc.activos++;
      else if (p.estado === 'COMPLETADO') acc.completados++;
      else acc.pendientes++;
      return acc;
    }, { activos: 0, completados: 0, pendientes: 0 });
  }, [proyectos]);

  const totalProyectos = proyectos?.length || 0;
  const totalPages = Math.ceil(totalProyectos / itemsPerPage);
  
  const currentProyectos = useMemo(() => {
    if (!proyectos) return [];
    return proyectos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [proyectos, currentPage, itemsPerPage]);

  return (
    <MypeLayout titulo="Mis proyectos">
      {/* Editor Immersivo Azul Empresarial */}
      <AnimatePresence>
         {proyectoEditando && <PremiumConfigurationModal key="edit-modal" proyecto={proyectoEditando} onClose={() => setProyectoEditando(null)} />}
      </AnimatePresence>

      {/* Eliminación del actionTop redundante porque lo integraremos en el Master Command Center para una vista más limpia */}
      <div style={{ maxWidth: 1200, margin: "0 auto", paddingBottom: "120px", display: "flex", flexDirection: "column" }}>
        
        <ExecutiveCommandCenter totalProyectos={totalProyectos} metrics={metrics} />

        {/* ESTRUCTURA CORE DE INICIATIVAS (PIPELINE) */}
        <div>
           {/* Section Header */}
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, borderBottom: "1px solid #E2E8F0", paddingBottom: 16 }}>
             <div>
               <h2 style={{ fontFamily: FONT, margin: 0, fontSize: 18, color: "#0F1F3D", fontWeight: 600 }}>Gestión de Proyectos</h2>
               <p style={{ fontFamily: FONT, margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>Supervisa el avance, las postulaciones y los entregables de tus proyectos. (Mapeados {totalProyectos} clústeres)</p>
             </div>
           </div>

           {/* Workspace Items (No traditional cards) */}
           {isLoading ? (
             <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[1,2,3].map(i => <div key={i} style={{ height: 80, background: "#F1F5F9", borderRadius: 16, animation: "pulse 2s infinite ease-in-out" }} />)}
             </div>
           ) : totalProyectos === 0 ? (
             <div style={{ textAlign: "center", padding: "100px 40px", border: "1px dashed #CBD5E1", borderRadius: 24, background: "#FAFAFA", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <FolderOpen size={48} color="#CBD5E1" strokeWidth={1} style={{ marginBottom: 20 }}/>
                <h3 style={{ margin: "0 0 8px 0", fontFamily: FONT, fontSize: 18, fontWeight: 500, color: "#0F1F3D" }}>No hay proyectos creados</h3>
                <p style={{ margin: "0 0 24px", fontFamily: FONT, fontSize: 14, color: "#64748B", maxWidth: 400 }}>No hay proyectos registrados. Crea tu primer proyecto para empezar.</p>
             </div>
           ) : (
             <>
               <AnimatePresence mode="popLayout">
                 {currentProyectos.map(p => (
                   <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                     <BusinessPipelineRow 
                        proyecto={p}
                        onEdit={() => setProyectoEditando(p)}
                        onDelete={() => handleDeleteClick(p)}
                        onViewPostulantes={() => navigate(`/dashboard/mype/postulantes?proyecto=${p.id}`)}
                        onReviewEntregables={() => navigate(`/dashboard/mype/proyectos/${p.id}/entregables`)}
                     />
                   </motion.div>
                 ))}
               </AnimatePresence>

               {/* Paginación Inteligente Corporativa */}
               {totalPages > 1 && (
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32, padding: "16px 24px", border: "1px solid #E2E8F0", borderRadius: 16, background: "#FAFAFA" }}>
                   <span style={{ fontSize: 12, fontFamily: FONT, color: "#64748B", fontWeight: 500 }}>
                     Mostrando página: <span style={{ color: "#0F1F3D", fontWeight: 700 }}>{currentPage}</span> de <span style={{ color: "#0F1F3D", fontWeight: 700 }}>{totalPages}</span>
                   </span>
                   <div style={{ display: "flex", gap: 12 }}>
                      <button 
                         disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                         style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: currentPage === 1 ? "#F1F5F9" : "#FFFFFF", border: "1px solid", borderColor: currentPage === 1 ? "transparent" : "#E2E8F0", color: currentPage === 1 ? "#94A3B8" : "#0F1F3D", cursor: currentPage === 1 ? "not-allowed" : "pointer", boxShadow: currentPage === 1 ? "none" : "0 2px 4px rgba(0,0,0,0.02)" }}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button 
                         disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                         style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: currentPage === totalPages ? "#F1F5F9" : "#FFFFFF", border: "1px solid", borderColor: currentPage === totalPages ? "transparent" : "#E2E8F0", color: currentPage === totalPages ? "#94A3B8" : "#0F1F3D", cursor: currentPage === totalPages ? "not-allowed" : "pointer", boxShadow: currentPage === totalPages ? "none" : "0 2px 4px rgba(0,0,0,0.02)" }}
                      >
                        <ChevronRight size={16} />
                      </button>
                   </div>
                 </div>
               )}
             </>
           )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteProjectModal}
        title="Confirmar eliminación"
        message={`¿Eliminar el proyecto "${projectToDelete?.titulo}"? Esta acción es definitiva y no se puede revertir.`}
        confirmText="Eliminar Registro"
        variant="danger"
        onConfirm={handleConfirmDeleteProject}
        onCancel={() => { setShowDeleteProjectModal(false); setProjectToDelete(null); }}
        isLoading={eliminando}
      />

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </MypeLayout>
  );
}
