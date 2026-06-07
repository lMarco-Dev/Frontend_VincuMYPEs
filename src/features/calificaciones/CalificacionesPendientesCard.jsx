import { useState } from "react";
import { useCalificacionesPendientes } from "./useCalificacionesPendientes";
import RateUserModal from "./RateUserModal";
import { Star } from "lucide-react";

export default function CalificacionesPendientesCard() {
  const { pendientes, isLoading } = useCalificacionesPendientes();
  const [seleccionado, setSeleccionado] = useState(null);

  if (isLoading || pendientes.length === 0) return null;

  return (
    <>
      <div style={{
        background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #e5e7eb",
        marginBottom: 24
      }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
          Tienes {pendientes.length} calificación{pendientes.length > 1 ? "es" : ""} pendiente{pendientes.length > 1 ? "s" : ""}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {pendientes.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setSeleccionado(p)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: 10,
                border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff",
                cursor: "pointer", textAlign: "left", width: "100%",
              }}
            >
              <Star size={16} color="#facc15" />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{p.calificadoNombre}</p>
                <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>{p.proyectoTitulo}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <RateUserModal
        open={!!seleccionado}
        pendiente={seleccionado}
        onClose={() => setSeleccionado(null)}
      />
    </>
  );
}