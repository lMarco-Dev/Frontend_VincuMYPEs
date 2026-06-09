import { Clock } from "lucide-react";

export function CalificacionesPendientesCard({ pendientes = 0 }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Clock size={18} color="#f59e0b" />
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}>Calificaciones pendientes</p>
          <p style={{ fontSize: 20, fontWeight: 700, color: "#f59e0b" }}>{pendientes}</p>
        </div>
      </div>
    </div>
  );
}