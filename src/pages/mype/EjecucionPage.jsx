import { useRef, useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import { useMisProyectos } from "@/features/proyecto-list-mype/useMisProyectos";
import { usePostulacionesAceptadas } from "@/features/proyecto-postulaciones/usePostulaciones";
import { useEntregables } from "@/features/proyecto-entregables/useEntregables";
import { getEntregablesPorProyecto } from "@/features/proyecto-entregables/entregables.api";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  UserCheck,
  FileBox,
  CheckCircle2,
  Clock,
  ExternalLink,
  Milestone,
  TrendingUp,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  FileBarChart,
  Eye,
  EyeOff
} from "lucide-react";

const FONT = "'Outfit', 'Angro Std', sans-serif";

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

const ESTADOS_OPERATIVOS = {
  PENDIENTE: {
    badge: "En ejecución",
    text: "A la espera del equipo",
    color: "#64748B",
    bg: "#F8FAFC",
    border: "#E2E8F0",
    ring: "rgba(100,116,139,0.1)",
    pulse: false,
  },
  EN_REVISION: {
    badge: "Auditoría requerida",
    text: "Requiere validación",
    color: "#0284C7",
    bg: "#F0F9FF",
    border: "#BAE6FD",
    ring: "rgba(2,132,199,0.15)",
    pulse: true,
  },
  APROBADO: {
    badge: "Hito cumplido",
    text: "Completado y cerrado",
    color: "#10B981",
    bg: "#F0FDF4",
    border: "#A7F3D0",
    ring: "rgba(16,185,129,0.1)",
    pulse: false,
  },
};

/* ═══════════════════════════════════════════════
   BANNER EJECUTIVO: CENTRO DE CONTROL
═══════════════════════════════════════════════ */
function CentroOperativoHero({ activas, talentoAsignado, hitosPendientes }) {
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
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
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

        ctx.fillStyle = "rgba(56, 189, 248, 0.35)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x;
          const dy = particles[j].y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.1 * (1 - dist / 100)})`;
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
        marginBottom: 40,
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "stretch",
        flexWrap: "wrap",
        gap: 40,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      />
      <div
        style={{ position: "absolute", top: -120, right: -60, width: 450, height: 450, background: "radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)", filter: "blur(40px)" }}
      />

      <div style={{ position: "relative", zIndex: 10, flex: "1 1 45%", minWidth: 320 }}>
        <h1 style={{ fontFamily: FONT, fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 600, color: "#FFFFFF", margin: "0 0 16px", letterSpacing: "-0.03em" }}>
          Monitoreo de Avance
        </h1>
        <p style={{ fontFamily: FONT, fontSize: 15, color: "#94A3B8", margin: 0, lineHeight: 1.7, fontWeight: 400, maxWidth: "90%" }}>
          Monitoriza el desempeño de tus equipos asignados, visualiza el cumplimiento de hitos estructurados y gestiona las auditorías corporativas pendientes.
        </p>
      </div>

      <div style={{ position: "relative", zIndex: 10, flex: "1 1 45%", minWidth: 320, display: "flex", flexDirection: "column", gap: 16, justifyContent: "center" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16 }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px", backdropFilter: "blur(10px)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94A3B8", marginBottom: 16 }}>
              <TrendingUp size={16} /> <span style={{ fontSize: 10, fontWeight: 600, fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.06em" }}>Despliegues</span>
            </div>
            <div style={{ fontSize: 44, fontWeight: 400, color: "#FFFFFF", fontFamily: FONT, lineHeight: 1, letterSpacing: "-0.03em" }}>
              {activas.toString().padStart(2, "0")}
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: "#10B981", display: "flex", alignItems: "center", gap: 6, fontFamily: FONT, fontWeight: 500 }}>
              <span style={{ width: 8, height: 8, background: "#10B981", borderRadius: "50%", boxShadow: "0 0 10px #10B981" }} /> Fase Operativa
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px", backdropFilter: "blur(10px)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94A3B8", marginBottom: 16 }}>
              <UserCheck size={16} /> <span style={{ fontSize: 10, fontWeight: 600, fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.06em" }}>Estudiante Activo</span>
            </div>
            <div style={{ fontSize: 44, fontWeight: 400, color: "#FFFFFF", fontFamily: FONT, lineHeight: 1, letterSpacing: "-0.03em" }}>
              {talentoAsignado.toString().padStart(2, "0")}
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: "#94A3B8", fontFamily: FONT, fontWeight: 500 }}>Capacidad total en acción</div>
          </div>
        </div>

        <div style={{ background: "linear-gradient(to right, rgba(255,255,255,0.02), rgba(56, 189, 248, 0.05))", border: "1px solid rgba(56, 189, 248, 0.15)", borderRadius: 14, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, color: "#FFFFFF", fontWeight: 600, fontFamily: FONT, marginBottom: 5 }}>Documentación en flujo</div>
            <div style={{ fontSize: 12, color: "#64748B", fontFamily: FONT }}>{hitosPendientes === 0 ? "Sin auditorías pendientes." : `${hitosPendientes} validación(es) a la espera de su resolución.`}</div>
          </div>
          {hitosPendientes > 0 && (
             <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(245, 158, 11, 0.15)", color: "#F59E0B", padding: "8px 14px", borderRadius: "10px", fontSize: 13, fontWeight: 600, border: "1px solid rgba(245, 158, 11, 0.2)" }}>
               <Clock size={16} /> Revisión
             </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   PAGINACIÓN
═══════════════════════════════════════════════ */
function TablaPaginacion({ totalPaginas, paginaActual, setPagina }) {
  if (totalPaginas <= 1) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 40 }}>
      <button 
        disabled={paginaActual === 1}
        onClick={() => setPagina(paginaActual - 1)}
        style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #E2E8F0", borderRadius: 10, background: paginaActual === 1 ? "#F8FAFC" : "#FFFFFF", color: paginaActual === 1 ? "#CBD5E1" : "#1E293B", cursor: paginaActual === 1 ? "not-allowed" : "pointer", transition: "all 0.2s" }}
      >
         <ChevronLeft size={16} />
      </button>

      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pag) => (
         <button 
           key={pag}
           onClick={() => setPagina(pag)}
           style={{
             minWidth: 36, height: 36, padding: "0 12px", border: pag === paginaActual ? "1px solid #1B6FE8" : "1px solid #E2E8F0",
             borderRadius: 10, fontFamily: FONT, fontSize: 13, fontWeight: 600,
             background: pag === paginaActual ? "#EFF6FF" : "#FFFFFF",
             color: pag === paginaActual ? "#1B6FE8" : "#475569",
             cursor: "pointer", transition: "all 0.2s"
           }}
         >
           {pag}
         </button>
      ))}

      <button 
        disabled={paginaActual === totalPaginas}
        onClick={() => setPagina(paginaActual + 1)}
        style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #E2E8F0", borderRadius: 10, background: paginaActual === totalPaginas ? "#F8FAFC" : "#FFFFFF", color: paginaActual === totalPaginas ? "#CBD5E1" : "#1E293B", cursor: paginaActual === totalPaginas ? "not-allowed" : "pointer", transition: "all 0.2s" }}
      >
         <ChevronRight size={16} />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TABLERO CORPORATIVO DEL PROYECTO (PLEGABLE)
═══════════════════════════════════════════════ */
function TableroOperativoProyecto({ proyecto, delay }) {
  const [expandido, setExpandido] = useState(false);
  const [verTodosHitos, setVerTodosHitos] = useState(false);

  const { postulaciones: equipo } = usePostulacionesAceptadas(proyecto.id);
  const { entregables, isLoading } = useEntregables(proyecto.id);

  // Orden: Históricos abajo, recientes arriba en visualización estructural.
  const hitosOrdenados = [...entregables].sort((a, b) => new Date(a.fechaEntrega) - new Date(b.fechaEntrega));

  const pendientesAuditoria = entregables.filter((e) => e.estado === "EN_REVISION").length;
  const completados = entregables.filter((e) => e.estado === "APROBADO").length;
  
  const porcentajeRealizado = entregables.length > 0
      ? Math.round((completados / entregables.length) * 100)
      : 0;

  const esCritico = porcentajeRealizado < 50 && pendientesAuditoria > 0;
  
  const hitosLimitados = verTodosHitos ? hitosOrdenados : hitosOrdenados.slice(0, 4);
  const hitosOcultosNum = hitosOrdenados.length - hitosLimitados.length;

  return (
    <motion.div
      {...fadeIn(delay)}
      style={{
        background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "18px", 
        marginBottom: 20, boxShadow: expandido ? "0 10px 30px -10px rgba(0,0,0,0.06)" : "0 4px 6px -1px rgba(0,0,0,0.02)",
        position: "relative", overflow: "hidden", transition: "box-shadow 0.3s ease"
      }}
    >
      <div style={{ position: "absolute", top: -70, left: -70, width: 250, height: 250, background: esCritico ? "radial-gradient(circle, rgba(245, 158, 11, 0.05) 0%, transparent 70%)" : "radial-gradient(circle, rgba(27, 111, 232, 0.04) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none", zIndex: 0 }} />

      {/* --- HEADER DEL TABLERO (SIEMPRE VISIBLE) --- */}
      <div 
        onClick={() => setExpandido(!expandido)}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap", position: "relative", zIndex: 1, padding: "28px 32px", cursor: "pointer", userSelect: "none" }}
      >
        <div style={{ flex: "1 1 min-content" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#475569", padding: "4px 10px", borderRadius: "6px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: FONT }}>
              Ejecución Corporativa
            </span>
            {pendientesAuditoria > 0 && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#D97706", fontSize: 11, fontWeight: 600, fontFamily: FONT }}>
                 <span style={{ width: 6, height: 6, background: "#D97706", borderRadius: "50%", animation: "pulse 2s infinite" }} /> Auditoría Pendiente
              </span>
            )}
          </div>
          
          <h2 style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#0F172A", margin: "0 0 10px", lineHeight: 1.2 }}>
            {proyecto.titulo}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#64748B", fontSize: 13, fontFamily: FONT, flexWrap: "wrap" }}>
             {proyecto.fechaLimite && (
                <span>Cierre Estimado: <strong style={{ color: "#334155" }}>{new Date(proyecto.fechaLimite).toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" })}</strong></span>
             )}
             <span style={{ color: "#E2E8F0" }}>|</span>
             <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Milestone size={14}/> {entregables.length} Hitos
             </span>
             <span style={{ color: "#E2E8F0" }}>|</span>
             <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <UserCheck size={14}/> {equipo.length} Estudiantes
             </span>
          </div>
        </div>

        {/* Acciones y Métricas lado derecho del Header */}
        <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: 24, flexShrink: 0 }}>
          {entregables.length > 0 && (
             <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", fontFamily: FONT, lineHeight: 1 }}>
                   {porcentajeRealizado}%
                </div>
                <div style={{ fontSize: 12, color: "#64748B", fontFamily: FONT, marginTop: 4, fontWeight: 500 }}>Nivel de Madurez</div>
             </div>
          )}
          
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Link to={`/dashboard/mype/proyectos/${proyecto.id}/entregables`} style={{ textDecoration: "none" }}>
                <motion.button 
                  whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                  style={{
                    fontFamily: FONT, background: "#1B6FE8", color: "#FFFFFF",
                    border: "none", borderRadius: "10px", padding: "8px 16px",
                    fontSize: 12, fontWeight: 600, cursor: "pointer",
                    display: "inline-flex", alignItems: "center", gap: 6,
                    boxShadow: "0 4px 8px -4px rgba(27, 111, 232, 0.3)"
                  }}
                >
                  Gestionar Entregables <ChevronRight size={14} />
                </motion.button>
              </Link>

              {/* Botón Acordeón Desplegar */}
             <button
              onClick={(e) => { setExpandido(!expandido); }}
              style={{
                width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                background: expandido ? "#F1F5F9" : "#FFFFFF", border: "1px solid #E2E8F0",
                borderRadius: "8px", color: "#475569", cursor: "pointer", transition: "all 0.2s"
              }}
            >
              <motion.div animate={{ rotate: expandido ? 180 : 0 }} transition={{ duration: 0.3, ease: "anticipate" }}>
                <ChevronDown size={16} />
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* --- CONTENIDO DETALLADO (OCULTO POR DEFECTO, EXPANDE SUAVE) --- */}
      <AnimatePresence>
        {expandido && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ padding: "0 32px 32px", position: "relative", zIndex: 1 }}>
              <div style={{ height: "1px", background: "#F1F5F9", width: "100%", margin: "0 0 32px" }} />

              {/* --- GRID DE DETALLES: FLUJO OPERATIVO & EQUIPO --- */}
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 48 }}>
                
                {/* LADO IZQUIERDO: FLUJO OPERATIVO DE HITOS */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#334155", margin: "0 0 20px", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 8 }}>
                    <FileBarChart size={16} color="#1B6FE8"/> Registro de todos los Entregables
                  </h3>

                  <div style={{ background: "#F8FAFC", borderRadius: "16px", border: "1px solid #F1F5F9", padding: "32px", flex: 1 }}>
                    {isLoading ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        {[1, 2, 3].map(i => <div key={i} style={{ height: 28, background: "#E2E8F0", borderRadius: 8, animation: "pulse 1.5s infinite" }} />)}
                      </div>
                    ) : hitosOrdenados.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "30px 10px", color: "#64748B" }}>
                          <FileBox size={36} color="#CBD5E1" style={{ marginBottom: 12 }} strokeWidth={1.5}/>
                          <p style={{ margin: 0, fontFamily: FONT, fontSize: 14, fontWeight: 500, color: "#475569" }}>Línea de tiempo no inicializada.</p>
                          <p style={{ margin: "6px 0 0", fontFamily: FONT, fontSize: 13, color: "#94A3B8" }}>El control documentario integrará hitos automáticamente.</p>
                        </div>
                    ) : (
                        <div style={{ position: "relative" }}>
                          {/* Línea conectora base */}
                          <div style={{ position: "absolute", top: 15, left: 15, bottom: 20, width: 2, background: "#E2E8F0" }} />
                          
                          <AnimatePresence>
                            {hitosLimitados.map((hito, i) => {
                              const estadoDef = ESTADOS_OPERATIVOS[hito.estado] || ESTADOS_OPERATIVOS.PENDIENTE;
                              const esUltimoEnVista = i === hitosLimitados.length - 1 && hitosOcultosNum === 0;

                              return (
                                  <motion.div
                                    key={hito.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ position: "relative", paddingLeft: 46, marginBottom: esUltimoEnVista ? 0 : 32 }}
                                  >
                                    {/* Nodo central de tiempo */}
                                    <div style={{ position: "absolute", left: 0, top: 0, width: 32, height: 32, background: estadoDef.bg, border: `2px solid ${estadoDef.border}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 6px #F8FAFC`, zIndex: 2 }}>
                                        {hito.estado === "APROBADO" && <CheckCircle2 size={16} color={estadoDef.color} strokeWidth={2.5} />}
                                        {hito.estado === "EN_REVISION" && <Clock size={14} color={estadoDef.color} />}
                                        {hito.estado === "PENDIENTE" && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#CBD5E1" }} />}
                                        
                                        {estadoDef.pulse && (
                                          <div style={{ position: "absolute", inset: -4, border: `1.5px solid ${estadoDef.color}`, borderRadius: "50%", animation: "pulse 2s infinite", opacity: 0.5 }} />
                                        )}
                                    </div>

                                    <div style={{ paddingTop: 3 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                                          <p style={{ margin: 0, fontFamily: FONT, fontSize: 14, fontWeight: 600, color: "#1E293B", lineHeight: 1.4 }}>
                                              {hito.titulo}
                                          </p>
                                          <span style={{ fontSize: 11, fontFamily: FONT, fontWeight: 600, color: estadoDef.color, background: estadoDef.ring, padding: "4px 10px", borderRadius: "8px", flexShrink: 0 }}>
                                              {estadoDef.badge}
                                          </span>
                                        </div>
                                        <p style={{ margin: "6px 0 0", fontFamily: FONT, fontSize: 12, color: "#64748B", display: "flex", alignItems: "center", gap: 6 }}>
                                          Registro fechado: <strong style={{ color: "#334155" }}>{new Date(hito.fechaEntrega).toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" })}</strong>
                                          
                                          {hito.archivo && (
                                              <>
                                                <span style={{ color: "#CBD5E1" }}>|</span>
                                                <a href={hito.archivo} target="_blank" rel="noopener noreferrer" style={{ color: "#1B6FE8", display: "inline-flex", alignItems: "center", gap: 4, textDecoration: "none", fontWeight: 500 }}>
                                                  Abrir adjunto operativo <ExternalLink size={13}/>
                                                </a>
                                              </>
                                          )}
                                        </p>
                                    </div>
                                  </motion.div>
                              );
                            })}
                          </AnimatePresence>

                          {/* Control Interactivo de Hitos Históricos Ocultos */}
                          {hitosOcultosNum > 0 && (
                            <div style={{ position: "relative", paddingLeft: 46, marginTop: 32 }}>
                                <div style={{ position: "absolute", left: 8, top: 4, background: "#F8FAFC" }}>
                                  <MoreHorizontal size={18} color="#94A3B8" />
                                </div>
                                <div 
                                  onClick={() => setVerTodosHitos(true)}
                                  style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", background: "#FFFFFF", padding: "6px 14px", border: "1px solid #E2E8F0", borderRadius: 10, fontFamily: FONT, fontSize: 12, fontWeight: 600, color: "#475569", transition: "all 0.2s" }}
                                >
                                   <Eye size={14}/> Desplegar {hitosOcultosNum} registro(s) históricos anteriores.
                                </div>
                            </div>
                          )}
                          {verTodosHitos && hitosOrdenados.length > 4 && (
                            <div style={{ paddingLeft: 46, marginTop: 20 }}>
                               <div 
                                 onClick={() => setVerTodosHitos(false)}
                                 style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", background: "transparent", padding: "6px 14px", fontFamily: FONT, fontSize: 12, fontWeight: 600, color: "#64748B", transition: "all 0.2s" }}
                               >
                                  <EyeOff size={14}/> Contraer flujo histórico
                               </div>
                            </div>
                          )}

                        </div>
                    )}
                  </div>
                </div>


                {/* LADO DERECHO: EQUIPO EJECUTIVO & QUICK CONTEXT */}
                <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                  
                  {/* Tarjeta de Talento Asignado */}
                  <div>
                    <h3 style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#334155", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 8 }}>
                      <UserCheck size={16} color="#10B981"/> Panel de Estudiantes Asignado
                    </h3>
                    
                    <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "6px 20px", background: "#FFFFFF" }}>
                      {equipo.length === 0 ? (
                          <p style={{ fontFamily: FONT, fontSize: 14, color: "#64748B", padding: "20px 0", margin: 0, textAlign: "center" }}>
                            Pendiente asignación definitiva
                          </p>
                      ) : (
                          equipo.map((miembro, i) => {
                            const iniciales = miembro.estudianteNombre?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "EC";
                            const lider = miembro.esDelegado === true;

                            return (
                                <div key={miembro.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 0", borderBottom: i === equipo.length - 1 ? "none" : "1px solid #F1F5F9" }}>
                                  <div style={{ width: 44, height: 44, borderRadius: "12px", flexShrink: 0, background: lider ? "#1E293B" : "#F8FAFC", border: `1px solid ${lider ? "#0F172A" : "#E2E8F0"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: 14, fontWeight: 700, color: lider ? "#F8FAFC" : "#475569" }}>
                                    {iniciales}
                                  </div>
                                  
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                      <p style={{ margin: 0, fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "#0F172A", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                                        {miembro.estudianteNombre}
                                      </p>
                                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
                                        <span style={{ fontSize: 11, fontFamily: FONT, color: "#64748B", fontWeight: 500 }}>Estudiante</span>
                                        {lider && (
                                            <>
                                            <span style={{ color: "#E2E8F0", fontSize: 10 }}>•</span>
                                            <span style={{ fontSize: 11, fontFamily: FONT, fontWeight: 700, background: "rgba(27,111,232,0.1)", color: "#1B6FE8", padding: "2px 8px", borderRadius: "6px", border: "1px solid rgba(27,111,232,0.15)" }}>Delegado</span>
                                            </>
                                        )}
                                      </div>
                                  </div>
                                </div>
                            )
                          })
                      )}
                    </div>
                  </div>

                  {/* Contexto Operativo Visual Rápido */}
                  <div style={{ background: "#F1F5F9", borderRadius: "16px", padding: "24px" }}>
                    <p style={{ margin: 0, fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#334155", display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                        <Activity size={15}/> Progreso Modular Integrado
                    </p>
                    <p style={{ margin: 0, fontFamily: FONT, fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
                      Avance trazable de acuerdo al contrato de servicios mutuo. Todo avance en flujos debe validarse activamente para ser consolidado a "Nivel de Madurez".
                    </p>
                    
                    {entregables.length > 0 && (
                        <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ height: 8, flex: 1, background: "#E2E8F0", borderRadius: 4, overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${porcentajeRealizado}%`, background: esCritico ? "#F59E0B" : "linear-gradient(90deg, #1B6FE8, #38BDF8)", borderRadius: 4, transition: "width 1s cubic-bezier(0.22, 1, 0.36, 1)" }} />
                          </div>
                          <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: esCritico ? "#D97706" : "#0F172A" }}>
                            Madurez global: {porcentajeRealizado}%
                          </span>
                        </div>
                    )}
                  </div>
                  
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   PANTALLA PRINCIPAL MYPE (CONTENEDOR GLOBAL)
═══════════════════════════════════════════════ */
export function EjecucionPage() {
  const { proyectos, isLoading } = useMisProyectos();
  
  // Extraemos toda la data sin perder consistencia del sistema actual.
  const operacionesActivas = proyectos.filter((p) => p.estado === "EN_DESARROLLO" || p.estado === "EN_VOTACION_DELEGADO" || p.estado === "EN_REVISION");
  const conteoOperaciones = operacionesActivas.length;

  const hitosData = useQueries({
    queries: operacionesActivas.map((p) => ({
      queryKey: ["entregables", p.id],
      queryFn: () => getEntregablesPorProyecto(p.id),
      enabled: !isLoading && operacionesActivas.length > 0,
      staleTime: 1000 * 30,
    })),
  });

  const flujosGlobales = hitosData.flatMap((q) => q.data ?? []);
  const revisionesCriticas = flujosGlobales.filter((e) => e.estado === "EN_REVISION").length;

  const capacidadTotalAsignada = operacionesActivas.reduce(
    (acumulador, op) => acumulador + (op.cupos ?? 0),
    0
  );

  // Configuración de la Paginación Corporativa Frontend
  const limitProyectosPaginados = 5;
  const [paginaActual, setPaginaActual] = useState(1);
  const offsetIndex = (paginaActual - 1) * limitProyectosPaginados;
  const listadoVistaOperaciones = operacionesActivas.slice(offsetIndex, offsetIndex + limitProyectosPaginados);
  const calculoTotalPaginas = Math.ceil(operacionesActivas.length / limitProyectosPaginados);

  return (
    <MypeLayout titulo="Panel de Ejecución">
      <style>{`
        @keyframes pulse { 
          0% { box-shadow: 0 0 0 0 rgba(217, 119, 6, 0.4); } 
          70% { box-shadow: 0 0 0 8px rgba(217, 119, 6, 0); } 
          100% { box-shadow: 0 0 0 0 rgba(217, 119, 6, 0); } 
        }
      `}</style>

      {/* Contenedor fluido, se expande a las pantallas ejecutivas utilizando 100% disponible */}
      <div style={{ width: "100%", maxWidth: 1600, margin: "0 auto", paddingBottom: 80 }}>
          
          <CentroOperativoHero
            activas={conteoOperaciones}
            talentoAsignado={capacidadTotalAsignada}
            hitosPendientes={revisionesCriticas}
          />

          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ height: 160, borderRadius: "20px", background: "#F8FAFC", border: "1px solid #E2E8F0", animation: "pulse 1.5s ease-in-out infinite", opacity: 0.6 }} />
              ))}
            </div>
          ) : operacionesActivas.length === 0 ? (
            <motion.div {...fadeIn(0.1)}
              style={{
                textAlign: "center", padding: "100px 24px",
                border: "1px dashed #CBD5E1", borderRadius: "24px", background: "#F8FAFC",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
              }}
            >
              <div style={{
                  width: 80, height: 80, borderRadius: "20px", background: "#FFFFFF",
                  border: "1px solid #E2E8F0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.03)",
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28
                }}>
                <Activity size={36} color="#94A3B8" />
              </div>
              <h2 style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, color: "#1E293B", marginBottom: 12 }}>
                Línea Operativa sin registros actuales
              </h2>
              <p style={{ fontFamily: FONT, fontSize: 16, color: "#64748B", maxWidth: 600, lineHeight: 1.6 }}>
                Las identidades corporativas de despliegue sincronizarán sus indicadores en este portal en tiempo real cuando consoliden asignación efectiva de personal consultor.
              </p>
            </motion.div>
          ) : (
            <div style={{ position: "relative" }}>
               <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, paddingBottom: 16, borderBottom: "1px solid #E2E8F0" }}>
                  <h3 style={{ margin: 0, fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#0F172A" }}>
                    Panel de Proyectos
                  </h3>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontFamily: FONT, fontSize: 12, color: "#64748B", fontWeight: 500 }}>
                    OP-{new Date().getFullYear()}
                  </span>
                </div>
               </div>
               
               {/* Contenedor Paginado */}
               <AnimatePresence mode="wait">
                 <motion.div
                   key={paginaActual}
                   initial={{ opacity: 0, y: 15 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -15 }}
                   transition={{ duration: 0.3 }}
                 >
                   {listadoVistaOperaciones.map((operacion, i) => (
                     <TableroOperativoProyecto
                       key={operacion.id}
                       proyecto={operacion}
                       delay={i * 0.05}
                     />
                   ))}
                 </motion.div>
               </AnimatePresence>
               
               <TablaPaginacion 
                  totalPaginas={calculoTotalPaginas}
                  paginaActual={paginaActual}
                  setPagina={setPaginaActual}
               />
               
            </div>
          )}
      </div>
    </MypeLayout>
  );
}