import { useState } from "react";
import { useCalificacionesPendientes } from "./useCalificacionesPendientes";
import RateUserModal from "./RateUserModal";
import { Star } from "lucide-react";

const FONT = "'Angro Std', 'Outfit', sans-serif";

const panelStyle = {
  background: "#FFFFFF",
  border: "1px solid #E5E7EB",
  borderRadius: 22,
  padding: 24,
  fontFamily: FONT,
  boxShadow: "0 2px 8px rgba(15,23,42,0.06)",
  height: "100%",
  boxSizing: "border-box",
  position: "relative",
  overflow: "hidden",
};

export function CalificacionesPendientesCard() {
  const { pendientes, isLoading } = useCalificacionesPendientes();
  const [seleccionado, setSeleccionado] = useState(null);

  return (
    <>
      <div style={panelStyle}>
        <div style={{ margin:"-24px -24px 18px -24px", padding:"14px 24px", borderBottom:"1px solid #F1F5F9", borderRadius:"22px 22px 0 0", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ display:"block", width:3, height:14, background:"#7C3AED", borderRadius:2, flexShrink:0 }} />
          <span style={{ fontSize:14, fontWeight:600, color:"#0F1F3D", letterSpacing:"-0.01em" }}>
            Calificaciones pendientes
          </span>
          {!isLoading && pendientes.length > 0 && (
            <span style={{ background:"#F5F3FF", color:"#7C3AED", fontSize:10, fontWeight:600, borderRadius:20, padding:"2px 8px", marginLeft:2 }}>
              {pendientes.length}
            </span>
          )}
        </div>

        {isLoading ? (
          <div style={{ padding: "20px 0", textAlign: "center", color: "#94A3B8", fontSize: 12 }}>
            Cargando…
          </div>
        ) : pendientes.length === 0 ? (
          <div style={{ padding: "24px 0", textAlign: "center", color: "#94A3B8", fontSize: 12, border: "1px dashed #E2E8F0", borderRadius: 10 }}>
            Sin calificaciones pendientes.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {pendientes.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setSeleccionado(p)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px",
                  border: "1px solid #F1F5F9",
                  borderRadius: 10,
                  background: "#FCFDFD",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  fontFamily: FONT,
                  transition: "background 0.15s, border-color 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#FAF8FF"; e.currentTarget.style.borderColor = "#EDE9FE"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#FCFDFD"; e.currentTarget.style.borderColor = "#F1F5F9"; }}
              >
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Star size={15} color="#f59e0b" fill="#fde68a" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#0F1F3D", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.calificadoNombre}
                  </p>
                  <p style={{ fontSize: 11, color: "#94A3B8", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.proyectoTitulo}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <RateUserModal
        open={!!seleccionado}
        pendiente={seleccionado}
        onClose={() => setSeleccionado(null)}
      />
    </>
  );
}

export default CalificacionesPendientesCard;
