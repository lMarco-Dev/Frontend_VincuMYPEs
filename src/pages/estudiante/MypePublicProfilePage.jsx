import { useParams } from "react-router-dom";
import { useMypePerfil } from "@/features/mype-perfil/useMypePerfil";
import { useNivelAccesoMype } from "@/features/mype-perfil/useNivelAccesoMype";
import { MypeProfileHeader } from "@/shared/components/mype-perfil/MypeProfileHeader";
import { MypeInfoCard } from "@/shared/components/mype-perfil/MypeInfoCard";
import { MypeContactCard } from "@/shared/components/mype-perfil/MypeContactCard";
import { MypeProyectosCard } from "@/shared/components/mype-perfil/MypeProyectosCard";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const FONT = "'Angro Std', 'Outfit', sans-serif";

export default function MypePublicProfilePage() {
  const { id } = useParams();
  const { perfil, isLoading } = useMypePerfil(id);
  const { puedeVerContacto } = useNivelAccesoMype(perfil);

  // Proyectos del perfil (se obtendrán desde el backend)
  const proyectos = perfil?.proyectos ?? [];

  return (
    <div
      style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: FONT }}
    >
      {/* Topbar mínimo */}
      <div
        style={{
          background: "#fff",
          borderBottom: "0.5px solid #E5E7EB",
          padding: "14px 32px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Link
          to="/proyectos"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            color: "#6B7280",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#1B6FE8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
        >
          <ArrowLeft size={15} /> Volver a proyectos
        </Link>
      </div>

      <div style={{ maxWidth: 760, margin: "32px auto", padding: "0 24px" }}>
        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[180, 90, 140, 200].map((h, i) => (
              <div
                key={i}
                style={{
                  height: h,
                  borderRadius: "1.5rem",
                  background: "#E5E7EB",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        ) : perfil ? (
          <>
            {/* Header — versión sin botón editar (solo lectura) */}
            <MypeProfileHeader
              perfil={perfil}
              puedeEditar={false}
              onEditar={null}
            />

            {/* Stats de proyectos */}
            <MypeInfoCard perfil={perfil} />

            {/* Información de contacto (con bloqueo si no tiene acceso) */}
            <MypeContactCard
              perfil={perfil}
              puedeVerContacto={puedeVerContacto}
            />

            {/* Lista de proyectos visibles según nivel de acceso */}
            <MypeProyectosCard
              proyectos={proyectos}
              puedeVerContacto={puedeVerContacto}
            />
          </>
        ) : (
          <div style={{ textAlign: "center", padding: 60 }}>
            <p style={{ fontFamily: FONT, fontSize: 14, color: "#9CA3AF" }}>
              No se encontró la empresa
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
      `}</style>
    </div>
  );
}
