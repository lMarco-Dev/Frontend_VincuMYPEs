import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, ArrowRight, Building2, FolderOpen, Users, ChevronDown } from "lucide-react";
import { useMisPostulaciones } from "@/features/postulaciones-list/useMisPostulaciones";
import { useMiActividad } from "@/features/workspace/useMiActividad";

const FONT = "Inter, Arial, 'Helvetica Neue', sans-serif";
const ESTADOS_CONFIRMADO = ["CONFIRMADO", "Confirmado", "ACEPTADO"];

function SectionTitle({ text, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{ width: 4, height: 18, borderRadius: 2, background: "#1B6FE8" }} />
      <h2 style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#0f1f3d", margin: 0 }}>{text}</h2>
      <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, color: "#94a3b8", background: "#f1f5f9", padding: "3px 10px", borderRadius: 12 }}>{count}</span>
    </div>
  );
}

function Chip({ children }) {
  return (
    <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, color: "#475569", background: "#f1f5f9", padding: "3px 9px", borderRadius: 8, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function tipoDe(cupos) {
  if (cupos == null) return "—";
  return cupos === 1 ? "Individual" : "Grupal";
}

/* ─── Tarjeta de proyecto activo ─── */
function TarjetaActiva({ p, color, onClick }) {
  const iniciales = (p.proyectoTitulo || "P").slice(0, 2).toUpperCase();
  return (
    <div
      onClick={onClick}
      style={{ background: "#fff", borderRadius: 20, border: "0.5px solid #e8e8e4", cursor: "pointer", transition: "all 0.25s ease", overflow: "hidden" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = `${color}40`; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e8e8e4"; }}
    >
      <div style={{ height: 90, background: `linear-gradient(135deg, ${color}, ${color}CC)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}>
          <span style={{ fontFamily: FONT, fontSize: 20, fontWeight: 800, background: `linear-gradient(135deg, ${color}, ${color}CC)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{iniciales}</span>
        </div>
      </div>
      <div style={{ padding: 18 }}>
        <h3 style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: "#0f1f3d", margin: "0 0 8px", lineHeight: 1.3 }}>{p.proyectoTitulo || "Proyecto sin título"}</h3>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
          <Building2 size={11} color="#94a3b8" />
          <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 500, color: "#6b6b7a" }}>MYPE Asociada</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#cbd5e1" }} />
          <Users size={11} color="#94a3b8" />
          <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 500, color: "#6b6b7a" }}>Workspace activo</span>
        </div>

        {/* ✅ tipo + total de integrantes */}
        <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
          <Chip>{tipoDe(p.cupos)}</Chip>
          <Chip>{p.cupos != null ? `${p.cupos} integrante${p.cupos !== 1 ? "s" : ""}` : "—"}</Chip>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "0.5px solid #e8e8e4" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 0 3px rgba(16,185,129,0.2)" }} />
            <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, color: "#10b981" }}>CONFIRMADO</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color, fontFamily: FONT, fontSize: 11, fontWeight: 700 }}>
            <span>Abrir Workspace</span>
            <ArrowRight size={13} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Item desplegable del historial ─── */
function DetalleFila({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "6px 0", borderBottom: "0.5px solid #f1f5f9" }}>
      <span style={{ fontFamily: FONT, fontSize: 11, color: "#94a3b8" }}>{label}</span>
      <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: "#0f1f3d", textAlign: "right" }}>{value}</span>
    </div>
  );
}

function HistorialItem({ p }) {
  const [open, setOpen] = useState(false);
  const [openInt, setOpenInt] = useState(false);
  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  const integrantes = p.integrantes || [];

  return (
    <div style={{ border: "0.5px solid #e8e8e4", borderRadius: 14, background: "#fff", overflow: "hidden" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: open ? "#f8fafc" : "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: FONT, fontSize: 12.5, fontWeight: 700, color: "#0f1f3d", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.proyectoTitulo}</p>
          <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, color: "#059669" }}>Completado</span>
        </div>
        <ChevronDown size={16} color="#94a3b8" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
      </button>

      {open && (
        <div style={{ padding: "4px 14px 12px" }}>
          <DetalleFila label="Tipo" value={tipoDe(p.cupos)} />
          <DetalleFila label="Área" value={p.proyectoArea || "—"} />
          <DetalleFila label="Inicio del proyecto" value={fmt(p.proyectoFechaInicioReal)} />
          <DetalleFila label="Culminación" value={fmt(p.proyectoFechaFin)} />
          <DetalleFila label="Tu rol" value={p.esDelegado ? "Delegado" : "Integrante"} />

          {/* Integrantes desplegable */}
          <button
            onClick={() => setOpenInt((o) => !o)}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "8px 0 6px", background: "transparent", border: "none", cursor: "pointer" }}
          >
            <span style={{ fontFamily: FONT, fontSize: 11, color: "#94a3b8" }}>Integrantes</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: "#0f1f3d" }}>{p.cupos ?? integrantes.length}</span>
              <ChevronDown size={14} color="#94a3b8" style={{ transform: openInt ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </span>
          </button>

          {openInt && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 4 }}>
              {integrantes.length ? (
                integrantes.map((n, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 7, background: "linear-gradient(135deg,#e0e7ff,#c7d2fe)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: 10, fontWeight: 700, color: "#4f46e5", flexShrink: 0 }}>
                      {n?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <span style={{ fontFamily: FONT, fontSize: 11, color: "#0f1f3d" }}>{n}</span>
                  </div>
                ))
              ) : (
                <span style={{ fontFamily: FONT, fontSize: 11, color: "#94a3b8" }}>Sin datos de integrantes</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
/* ─── Gráfica de actividad estilo GitHub (general, todos los proyectos) ─── */
function ActivityHeatmap({ entregables }) {
  const dates = (entregables || []).map((e) => e.fechaEntrega || e.fechaSubida).filter(Boolean);
  const counts = {};
  dates.forEach((d) => {
    const key = new Date(d).toISOString().slice(0, 10);
    counts[key] = (counts[key] || 0) + 1;
  });

  const WEEKS = 26;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - (WEEKS * 7 - 1));
  start.setDate(start.getDate() - start.getDay()); // alinear a domingo

  const days = [];
  for (let cur = new Date(start); cur <= today; cur.setDate(cur.getDate() + 1)) {
    const key = cur.toISOString().slice(0, 10);
    days.push({ date: new Date(cur), count: counts[key] || 0 });
  }
  const cols = [];
  for (let i = 0; i < days.length; i += 7) cols.push(days.slice(i, i + 7));

  const totalEntregas = dates.length;
  const diasTrabajados = Object.keys(counts).length;
  const color = (c) => (!c ? "#eef0f3" : c === 1 ? "#cfe0fb" : c <= 3 ? "#93b8f3" : c <= 5 ? "#4d8ae9" : "#1B6FE8");

  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  let lastMonth = -1;
  const monthLabels = cols.map((col) => {
    const m = col[0].date.getMonth();
    if (m !== lastMonth) { lastMonth = m; return meses[m]; }
    return "";
  });

  const CELL = 12, GAP = 3;

  return (
    <div style={{ background: "#fff", borderRadius: 20, border: "0.5px solid #e8e8e4", padding: "20px 24px", marginTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div style={{ width: 4, height: 18, borderRadius: 2, background: "#1B6FE8" }} />
        <h2 style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#0f1f3d", margin: 0 }}>Actividad de entregas</h2>
      </div>
      <p style={{ fontFamily: FONT, fontSize: 12, color: "#6b6b7a", margin: "0 0 16px 14px" }}>
        {diasTrabajados} día{diasTrabajados !== 1 ? "s" : ""} con actividad · {totalEntregas} entrega{totalEntregas !== 1 ? "s" : ""} en total
      </p>

      <div style={{ overflowX: "auto", paddingBottom: 4 }}>
        <div style={{ display: "flex", gap: GAP, marginBottom: 4 }}>
          {monthLabels.map((m, i) => (
            <div key={i} style={{ width: CELL, fontFamily: FONT, fontSize: 9, color: "#94a3b8" }}>{m}</div>
          ))}
        </div>
        <div style={{ display: "flex", gap: GAP }}>
          {cols.map((col, ci) => (
            <div key={ci} style={{ display: "flex", flexDirection: "column", gap: GAP }}>
              {col.map((d, di) => (
                <div
                  key={di}
                  title={`${d.date.toLocaleDateString("es-PE")} · ${d.count} entrega${d.count !== 1 ? "s" : ""}`}
                  style={{ width: CELL, height: CELL, borderRadius: 3, background: color(d.count) }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, justifyContent: "flex-end" }}>
        <span style={{ fontFamily: FONT, fontSize: 10, color: "#94a3b8" }}>Menos</span>
        {["#eef0f3", "#cfe0fb", "#93b8f3", "#4d8ae9", "#1B6FE8"].map((c) => (
          <div key={c} style={{ width: 11, height: 11, borderRadius: 3, background: c }} />
        ))}
        <span style={{ fontFamily: FONT, fontSize: 10, color: "#94a3b8" }}>Más</span>
      </div>
    </div>
  );
}

export function WorkspaceSelectorPage() {
  const navigate = useNavigate();
  const { data: postulaciones = [], isLoading } = useMisPostulaciones();
  const { data: actividad = [] } = useMiActividad();

  const confirmados = postulaciones.filter((p) => ESTADOS_CONFIRMADO.includes(p.estado));
  const completados = confirmados.filter((p) => p.proyectoEstado === "COMPLETADO");
  const activos = confirmados.filter((p) => p.proyectoEstado !== "COMPLETADO");
  const colores = ["#1B6FE8", "#06B6D4", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];

  if (isLoading) {
    return (
      <div style={{ fontFamily: FONT, background: "#f8fafc", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#6b6b7a" }}>
          <div className="animate-spin" style={{ width: 22, height: 22, border: "3px solid #e2e8f0", borderTopColor: "#1B6FE8", borderRadius: "50%" }} />
          <span style={{ fontWeight: 600, fontSize: 13 }}>Cargando workspaces...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: FONT, background: "#f8fafc", minHeight: "100vh", padding: "32px 36px", maxWidth: 1440, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 4, height: 20, borderRadius: 2, background: "#1B6FE8" }} />
          <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: "#0f1f3d", margin: 0 }}>Mis Workspaces</h1>
        </div>
        <p style={{ fontSize: 13, fontWeight: 500, color: "#6b6b7a", margin: 0, marginLeft: 14 }}>
          Proyectos activos e historial de los completados
        </p>
      </div>

      {confirmados.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 40px", background: "#fff", borderRadius: 24, border: "0.5px solid #e8e8e4" }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <FolderOpen size={40} color="#94a3b8" strokeWidth={1.5} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f1f3d", marginBottom: 8 }}>No tienes workspaces aún</h3>
          <p style={{ fontSize: 13, color: "#6b6b7a", fontWeight: 500, marginBottom: 24 }}>Acepta una postulación para acceder al workspace</p>
          <Link to="/mis-postulaciones" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1B6FE8", color: "#fff", padding: "12px 24px", borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            <Briefcase size={16} /> Ver Mis Postulaciones
          </Link>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "start" }}>
            {/* COLUMNA IZQUIERDA: ACTIVOS */}
            <div>
              <SectionTitle text="Proyectos Activos" count={activos.length} />
              {activos.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
                  {activos.map((p, i) => (
                    <TarjetaActiva key={p.id} p={p} color={colores[i % colores.length]} onClick={() => navigate(`/workspace/${p.proyectoId}`)} />
                  ))}
                </div>
              ) : (
                <div style={{ padding: "40px 20px", textAlign: "center", border: "1px dashed #e8e8e4", borderRadius: 16, background: "#fff" }}>
                  <p style={{ fontFamily: FONT, fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>No tienes proyectos activos</p>
                </div>
              )}
            </div>

            {/* COLUMNA DERECHA: HISTORIAL */}
            <div>
              <SectionTitle text="Historial" count={completados.length} />
              {completados.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {completados.map((p) => <HistorialItem key={p.id} p={p} />)}
                </div>
              ) : (
                <div style={{ padding: "40px 20px", textAlign: "center", border: "1px dashed #e8e8e4", borderRadius: 16, background: "#fff" }}>
                  <p style={{ fontFamily: FONT, fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>Aún no completas proyectos</p>
                </div>
              )}
            </div>
          </div>

          {/* GRÁFICA GENERAL DE ACTIVIDAD (abajo, ancho completo) */}
          <ActivityHeatmap entregables={actividad} />
        </>
      )}
    </div>
  );
}

export default WorkspaceSelectorPage;