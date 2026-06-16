import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  FolderOpen,
  Users,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building2,
  ArrowRight,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { useMisPostulaciones } from "@/features/postulaciones-list/useMisPostulaciones";
import { useMiActividad } from "@/features/workspace/useMiActividad";

const FONT = "'Angro Std', 'Outfit', sans-serif";
const ESTADOS_CONFIRMADO = ["CONFIRMADO", "Confirmado", "ACEPTADO"];
const ACTIVOS_PER_PAGE = 5;
const HISTORIAL_PER_PAGE = 10;

/* ═══════════════════════════════════════════════
   BANNER NAVY CON CANVAS
═══════════════════════════════════════════════ */
function WorkspacesCommandCenter({ activos, completados }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);

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
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.fillStyle = "rgba(56,189,248,0.35)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x;
          const dy = particles[j].y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.strokeStyle = `rgba(56,189,248,${0.1 * (1 - dist / 100)})`;
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
        borderRadius: 20,
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
      <div style={{ position: "absolute", top: -120, right: -60, width: 450, height: 450, background: "radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />

      {/* Texto izquierda */}
      <div style={{ position: "relative", zIndex: 10, flex: "1 1 45%", minWidth: 280 }}>

        <h1 style={{ fontFamily: FONT, fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: "#FFFFFF", margin: "0 0 14px", letterSpacing: "-0.03em" }}>
          Mis Workspaces
        </h1>
        <p style={{ fontFamily: FONT, fontSize: 15, color: "#94A3B8", margin: 0, lineHeight: 1.7, maxWidth: "90%" }}>
          Proyectos activos y historial de colaboraciones completadas.
        </p>
      </div>

      {/* KPIs derecha */}
      <div style={{ position: "relative", zIndex: 10, flex: "1 1 45%", minWidth: 280, display: "flex", gap: 16, alignItems: "center", justifyContent: "flex-end" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px", backdropFilter: "blur(10px)", display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 120 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94A3B8", marginBottom: 16 }}>
            <Activity size={16} />
            <span style={{ fontSize: 10, fontWeight: 600, fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.06em" }}>Activos</span>
          </div>
          <div style={{ fontSize: 44, fontWeight: 400, color: "#FFFFFF", fontFamily: FONT, lineHeight: 1, letterSpacing: "-0.03em" }}>
            {activos.toString().padStart(2, "0")}
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px", backdropFilter: "blur(10px)", display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 120 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94A3B8", marginBottom: 16 }}>
            <CheckCircle2 size={16} />
            <span style={{ fontSize: 10, fontWeight: 600, fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.06em" }}>Completados</span>
          </div>
          <div style={{ fontSize: 44, fontWeight: 400, color: "#FFFFFF", fontFamily: FONT, lineHeight: 1, letterSpacing: "-0.03em" }}>
            {completados.toString().padStart(2, "0")}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   ENCABEZADO DE SECCIÓN
═══════════════════════════════════════════════ */
function SectionHeader({ title, subtitle, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #E2E8F0" }}>
      <div>
        <h3 style={{ margin: 0, fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#0F172A" }}>{title}</h3>
        {subtitle && <p style={{ margin: "4px 0 0", fontFamily: FONT, fontSize: 12, color: "#64748B" }}>{subtitle}</p>}
      </div>
      {count != null && (
        <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: "#64748B", background: "#F1F5F9", padding: "4px 12px", borderRadius: 8 }}>{count}</span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TARJETA WORKSPACE (ACORDEÓN)
═══════════════════════════════════════════════ */
function WorkspaceRow({ p, index, onOpen }) {
  const [expandido, setExpandido] = useState(false);
  const mypeNombre = p.mypeNombre || "MYPE Asociada";
  const wsId = `WS-${String(p.proyectoId || p.id || index + 1).padStart(4, "0")}`;

  const tipoDe = (cupos) => {
    if (cupos == null) return "—";
    return cupos === 1 ? "Individual" : "Grupal";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 18,
        marginBottom: 16,
        boxShadow: expandido ? "0 10px 30px -10px rgba(0,0,0,0.06)" : "0 4px 6px -1px rgba(0,0,0,0.02)",
        overflow: "hidden",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Header siempre visible */}
      <div
        onClick={() => setExpandido(!expandido)}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, padding: "24px 28px", cursor: "pointer", userSelect: "none" }}
      >
        <div style={{ flex: "1 1 auto", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#475569", padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: FONT }}>
              {wsId}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#10B981", fontSize: 11, fontWeight: 600, fontFamily: FONT }}>
              <span style={{ width: 6, height: 6, background: "#10B981", borderRadius: "50%", boxShadow: "0 0 8px rgba(16,185,129,0.4)" }} />
              Confirmado
            </span>
          </div>
          <h2 style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#0F172A", margin: "0 0 8px", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {p.proyectoTitulo || "Proyecto sin título"}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#64748B", fontSize: 12, fontFamily: FONT }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Building2 size={13} /> {mypeNombre}
            </span>
            <span style={{ color: "#E2E8F0" }}>|</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Users size={13} /> {tipoDe(p.cupos)}
            </span>
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <button
            onClick={onOpen}
            style={{ fontFamily: FONT, background: "#1B6FE8", color: "#FFFFFF", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, boxShadow: "0 4px 8px -4px rgba(27,111,232,0.3)" }}
          >
            Abrir <ArrowRight size={13} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setExpandido(!expandido); }}
            style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: expandido ? "#F1F5F9" : "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 8, color: "#475569", cursor: "pointer", transition: "all 0.2s" }}
          >
            <motion.div animate={{ rotate: expandido ? 180 : 0 }} transition={{ duration: 0.3, ease: "anticipate" }}>
              <ChevronDown size={16} />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Detalle expandido */}
      <AnimatePresence>
        {expandido && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 28px 24px" }}>
              <div style={{ height: 1, background: "#F1F5F9", marginBottom: 20 }} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
                <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "14px 16px", border: "1px solid #F1F5F9" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: FONT, marginBottom: 6 }}>Tipo</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", fontFamily: FONT }}>{tipoDe(p.cupos)}</div>
                </div>
                {p.cupos != null && (
                  <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "14px 16px", border: "1px solid #F1F5F9" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: FONT, marginBottom: 6 }}>Cupos</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", fontFamily: FONT }}>{p.cupos} integrante{p.cupos !== 1 ? "s" : ""}</div>
                  </div>
                )}
                {p.proyectoArea && (
                  <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "14px 16px", border: "1px solid #F1F5F9" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: FONT, marginBottom: 6 }}>Área</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", fontFamily: FONT }}>{p.proyectoArea}</div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   HISTORIAL ITEM (ACORDEÓN COMPACTO)
═══════════════════════════════════════════════ */
function HistorialRow({ p }) {
  const [open, setOpen] = useState(false);
  const [openInt, setOpenInt] = useState(false);
  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" }) : null;
  const integrantes = p.integrantes || [];
  const tipoDe = (cupos) => (cupos == null ? "—" : cupos === 1 ? "Individual" : "Grupal");

  const rows = [
    ["Tipo", tipoDe(p.cupos)],
    p.proyectoArea && ["Área", p.proyectoArea],
    fmt(p.proyectoFechaInicioReal) && ["Inicio", fmt(p.proyectoFechaInicioReal)],
    fmt(p.proyectoFechaFin) && ["Culminación", fmt(p.proyectoFechaFin)],
    ["Tu rol", p.esDelegado ? "Delegado" : "Integrante"],
  ].filter(Boolean);

  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 14, marginBottom: 10, overflow: "hidden" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: open ? "#F8FAFC" : "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: "#0F172A", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.proyectoTitulo}</p>
          <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: "#10B981" }}>Completado</span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={16} color="#94A3B8" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "4px 18px 14px" }}>
              {rows.map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "6px 0", borderBottom: "0.5px solid #F1F5F9" }}>
                  <span style={{ fontFamily: FONT, fontSize: 11, color: "#94A3B8" }}>{label}</span>
                  <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: "#0F172A", textAlign: "right" }}>{value}</span>
                </div>
              ))}

              <button
                onClick={() => setOpenInt((o) => !o)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0 6px", background: "transparent", border: "none", cursor: "pointer" }}
              >
                <span style={{ fontFamily: FONT, fontSize: 11, color: "#94A3B8" }}>Integrantes</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: "#0F172A" }}>{p.cupos ?? integrantes.length}</span>
                  <ChevronDown size={14} color="#94A3B8" style={{ transform: openInt ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </span>
              </button>

              {openInt && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 4 }}>
                  {integrantes.length ? (
                    integrantes.map((n, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 7, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: 10, fontWeight: 700, color: "#475569", flexShrink: 0 }}>
                          {n?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span style={{ fontFamily: FONT, fontSize: 11, color: "#0F172A" }}>{n}</span>
                      </div>
                    ))
                  ) : (
                    <span style={{ fontFamily: FONT, fontSize: 11, color: "#94A3B8" }}>Sin datos de integrantes</span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGINACIÓN
═══════════════════════════════════════════════ */
function Pagination({ total, page, setPage, perPage }) {
  const totalPaginas = Math.ceil(total / perPage);
  if (totalPaginas <= 1) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 24 }}>
      <button
        disabled={page === 0}
        onClick={() => setPage((p) => Math.max(0, p - 1))}
        style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #E2E8F0", borderRadius: 10, background: page === 0 ? "#F8FAFC" : "#FFFFFF", color: page === 0 ? "#CBD5E1" : "#1E293B", cursor: page === 0 ? "not-allowed" : "pointer" }}
      >
        <ChevronLeft size={16} />
      </button>
      <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#475569" }}>
        {page + 1} / {totalPaginas}
      </span>
      <button
        disabled={page >= totalPaginas - 1}
        onClick={() => setPage((p) => Math.min(totalPaginas - 1, p + 1))}
        style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #E2E8F0", borderRadius: 10, background: page >= totalPaginas - 1 ? "#F8FAFC" : "#FFFFFF", color: page >= totalPaginas - 1 ? "#CBD5E1" : "#1E293B", cursor: page >= totalPaginas - 1 ? "not-allowed" : "pointer" }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   HEATMAP DE ACTIVIDAD
═══════════════════════════════════════════════ */
function ActivityHeatmap({ entregables }) {
  const dates = (entregables || []).map((e) => e.fechaEntrega || e.fechaSubida).filter(Boolean);
  const counts = {};
  dates.forEach((d) => {
    const key = new Date(d).toISOString().slice(0, 10);
    counts[key] = (counts[key] || 0) + 1;
  });

  const WEEKS = 13;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - (WEEKS * 7 - 1));
  start.setDate(start.getDate() - start.getDay());

  const days = [];
  for (let cur = new Date(start); cur <= today; cur.setDate(cur.getDate() + 1)) {
    const key = cur.toISOString().slice(0, 10);
    days.push({ date: new Date(cur), count: counts[key] || 0 });
  }
  const cols = [];
  for (let i = 0; i < days.length; i += 7) cols.push(days.slice(i, i + 7));

  const totalEntregas = dates.length;
  const diasTrabajados = Object.keys(counts).length;
  const color = (c) =>
    !c ? "#E2E8F0" : c === 1 ? "#BFDBFE" : c <= 3 ? "#93B8F3" : c <= 5 ? "#4D8AE9" : "#1B6FE8";

  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  let lastMonth = -1;
  const monthLabels = cols.map((col) => {
    const m = col[0].date.getMonth();
    if (m !== lastMonth) { lastMonth = m; return meses[m]; }
    return "";
  });

  const CELL = 10, GAP = 2;

  return (
    <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", padding: "24px 28px", marginTop: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #E2E8F0" }}>
        <div>
          <h3 style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>Actividad de entregas</h3>
          <p style={{ fontFamily: FONT, fontSize: 12, color: "#64748B", margin: "4px 0 0" }}>
            Últimos 3 meses · {diasTrabajados} día{diasTrabajados !== 1 ? "s" : ""} activo{diasTrabajados !== 1 ? "s" : ""} · {totalEntregas} entrega{totalEntregas !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "flex", gap: GAP, marginBottom: 3 }}>
          {monthLabels.map((m, i) => (
            <div key={i} style={{ width: CELL, fontFamily: FONT, fontSize: 8, color: "#94A3B8" }}>{m}</div>
          ))}
        </div>
        <div style={{ display: "flex", gap: GAP }}>
          {cols.map((col, ci) => (
            <div key={ci} style={{ display: "flex", flexDirection: "column", gap: GAP }}>
              {col.map((d, di) => (
                <div
                  key={di}
                  title={`${d.date.toLocaleDateString("es-PE")} · ${d.count} entrega${d.count !== 1 ? "s" : ""}`}
                  style={{ width: CELL, height: CELL, borderRadius: 2, background: color(d.count) }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 10, justifyContent: "flex-end" }}>
        <span style={{ fontFamily: FONT, fontSize: 9, color: "#94A3B8" }}>Menos</span>
        {["#E2E8F0","#BFDBFE","#93B8F3","#4D8AE9","#1B6FE8"].map((c) => (
          <div key={c} style={{ width: 9, height: 9, borderRadius: 2, background: c }} />
        ))}
        <span style={{ fontFamily: FONT, fontSize: 9, color: "#94A3B8" }}>Más</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PÁGINA PRINCIPAL
═══════════════════════════════════════════════ */
export function WorkspaceSelectorPage() {
  const navigate = useNavigate();
  const { data: postulaciones = [], isLoading } = useMisPostulaciones();
  const { data: actividad = [] } = useMiActividad();
  const [activosPage, setActivosPage] = useState(0);
  const [historialPage, setHistorialPage] = useState(0);

  const confirmados = postulaciones.filter((p) => ESTADOS_CONFIRMADO.includes(p.estado));
  const completados = confirmados.filter((p) => p.proyectoEstado === "COMPLETADO");
  const activos = confirmados.filter((p) => p.proyectoEstado !== "COMPLETADO");

  const activosPaginados = activos.slice(activosPage * ACTIVOS_PER_PAGE, (activosPage + 1) * ACTIVOS_PER_PAGE);
  const historialPaginado = completados.slice(historialPage * HISTORIAL_PER_PAGE, (historialPage + 1) * HISTORIAL_PER_PAGE);

  if (isLoading) {
    return (
      <div style={{ fontFamily: FONT, background: "#F8FAFC", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#64748B" }}>
          <div style={{ width: 22, height: 22, border: "3px solid #E2E8F0", borderTopColor: "#1B6FE8", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <span style={{ fontWeight: 600, fontSize: 13, fontFamily: FONT }}>Cargando workspaces...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: FONT, background: "#F8FAFC", minHeight: "100vh", padding: "32px 36px", maxWidth: 1440, margin: "0 auto" }}>
      <style>{`
        @keyframes vping { 75%, 100% { transform: scale(2.4); opacity: 0; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <WorkspacesCommandCenter activos={activos.length} completados={completados.length} />

      {confirmados.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", padding: "100px 24px", border: "1px dashed #CBD5E1", borderRadius: 24, background: "#FFFFFF" }}
        >
          <div style={{ width: 80, height: 80, borderRadius: 20, background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.03)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <FolderOpen size={36} color="#94A3B8" strokeWidth={1.5} />
          </div>
          <h2 style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: "#1E293B", marginBottom: 10 }}>Sin workspaces aún</h2>
          <p style={{ fontFamily: FONT, fontSize: 14, color: "#64748B", maxWidth: 400, margin: "0 auto 24px", lineHeight: 1.6 }}>
            Acepta una postulación para acceder a tu workspace colaborativo.
          </p>
          <Link
            to="/mis-postulaciones"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1B6FE8", color: "#fff", padding: "12px 24px", borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: "none" }}
          >
            <Briefcase size={16} /> Ver Mis Postulaciones
          </Link>
        </motion.div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 28, alignItems: "start" }}>
            {/* COLUMNA IZQUIERDA: ACTIVOS */}
            <div>
              <SectionHeader title="Proyectos Activos" subtitle="Workspaces abiertos y listos para trabajar" count={activos.length} />
              {activos.length > 0 ? (
                <>
                  {activosPaginados.map((p, i) => (
                    <WorkspaceRow
                      key={p.id}
                      p={p}
                      index={i}
                      onOpen={() => navigate(`/workspace/${p.proyectoId}`)}
                    />
                  ))}
                  <Pagination total={activos.length} page={activosPage} setPage={setActivosPage} perPage={ACTIVOS_PER_PAGE} />
                </>
              ) : (
                <div style={{ padding: "40px 20px", textAlign: "center", border: "1px dashed #E2E8F0", borderRadius: 16, background: "#FFFFFF" }}>
                  <p style={{ fontFamily: FONT, fontSize: 13, color: "#94A3B8", fontWeight: 600 }}>No tienes proyectos activos</p>
                </div>
              )}
            </div>

            {/* COLUMNA DERECHA: HISTORIAL */}
            <div>
              <SectionHeader title="Historial" subtitle="Proyectos completados" count={completados.length} />
              {completados.length > 0 ? (
                <>
                  {historialPaginado.map((p) => (
                    <HistorialRow key={p.id} p={p} />
                  ))}
                  <Pagination total={completados.length} page={historialPage} setPage={setHistorialPage} perPage={HISTORIAL_PER_PAGE} />
                </>
              ) : (
                <div style={{ padding: "40px 20px", textAlign: "center", border: "1px dashed #E2E8F0", borderRadius: 16, background: "#FFFFFF" }}>
                  <p style={{ fontFamily: FONT, fontSize: 13, color: "#94A3B8", fontWeight: 600 }}>Aún no completas proyectos</p>
                </div>
              )}
            </div>
          </div>

          <ActivityHeatmap entregables={actividad} />
        </>
      )}
    </div>
  );
}

export default WorkspaceSelectorPage;
