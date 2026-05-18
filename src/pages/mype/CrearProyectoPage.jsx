import { MypeLayout } from "@shared/layouts/MypeLayout";
import { CrearProyectoForm } from "@/features/proyecto-create/CrearProyectoForm";

export function CrearProyectoPage() {
  return (
    <MypeLayout titulo="Publicar nuevo proyecto">
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "'Angro Std', 'Outfit', sans-serif",
            fontSize: 13,
            color: "#6B7280",
            marginBottom: 20,
            marginTop: -4,
          }}
        >
          Describe la problemática de tu negocio y te sugerimos el tipo de
          solución ideal.
        </p>
        <div
          style={{
            background: "linear-gradient(170deg,#081828,#0F2A4A)",
            border: "0.5px solid rgba(27,111,232,0.2)",
            borderRadius: 16,
            padding: 24,
          }}
        >
          <CrearProyectoForm />
        </div>
      </div>
    </MypeLayout>
  );
}
