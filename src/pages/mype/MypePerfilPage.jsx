import { useState } from "react";
import { motion } from "framer-motion";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import { useMiPerfilMype } from "@/features/mype-perfil/useMypePerfil";
import { useNivelAccesoMype } from "@/features/mype-perfil/useNivelAccesoMype";
import { MypeProfileHeader } from "@/shared/components/mype-perfil/MypeProfileHeader";
import { MypeInfoCard } from "@/shared/components/mype-perfil/MypeInfoCard";
import { MypeContactCard } from "@/shared/components/mype-perfil/MypeContactCard";
import { MypeProyectosCard } from "@/shared/components/mype-perfil/MypeProyectosCard";
import { MypeSocialLinks } from "@/shared/components/mype-perfil/MypeSocialLinks"; // ← COMENTADO
import { MypeMapaCard } from "@/shared/components/mype-perfil/MypeMapaCard";
import { MypePerfilEditarModal } from "@/shared/components/mype-perfil/MypePerfilEditarModal";
import { Building2 } from "lucide-react";

const FONT = "'Angro Std', 'Outfit', sans-serif";
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

export function MypePerfilPage() {
  const { perfil, isLoading } = useMiPerfilMype();
  const { puedeVerContacto, puedeEditar } = useNivelAccesoMype(perfil);
  const [editando, setEditando] = useState(false);
  const proyectos = perfil?.proyectos ?? [];

  if (isLoading) {
    return (
      <MypeLayout titulo="Mi Perfil">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[280, 100, 160].map((h, i) => (
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
        <style>{`
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        `}</style>
      </MypeLayout>
    );
  }

  if (!perfil) {
    return (
      <MypeLayout titulo="Mi Perfil">
        <div style={{ textAlign: "center", padding: "60px 24px" }}>
          <p style={{ fontFamily: FONT, fontSize: 14, color: "#9CA3AF" }}>
            No se encontró el perfil
          </p>
        </div>
      </MypeLayout>
    );
  }

  return (
    <MypeLayout titulo="Mi Perfil">
      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
      `}</style>

      {editando && perfil && (
        <MypePerfilEditarModal
          perfil={perfil}
          onClose={() => setEditando(false)}
        />
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header con avatar, stats y botón editar */}
        <MypeProfileHeader
          perfil={perfil}
          puedeEditar={puedeEditar}
          onEditar={() => setEditando(true)}
        />

        {/* Redes sociales - TEMPORALMENTE DESACTIVADO */}
        <div style={{ marginBottom: 20 }}>
          <MypeSocialLinks perfil={perfil} variant="full" />
        </div>

        {/* Layout 2 columnas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 20,
            alignItems: "start",
          }}
        >
          {/* Columna principal */}
          <div>
            {/* Descripción */}
            {perfil.descripcion && (
              <motion.div
                {...fadeUp(0.05)}
                style={{
                  background: "#fff",
                  border: "0.5px solid #E5E7EB",
                  borderRadius: "1rem",
                  padding: "18px 20px",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <Building2 size={15} color="#1B6FE8" />
                  <span
                    style={{
                      fontFamily: FONT,
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#111827",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Sobre la empresa
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: 13,
                    color: "#4B5563",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {perfil.descripcion}
                </p>
              </motion.div>
            )}

            {/* Stats de proyectos (totales/activos) */}
            <motion.div {...fadeUp(0.1)} style={{ marginBottom: 16 }}>
              <MypeInfoCard perfil={perfil} />
            </motion.div>

            {/* Proyectos */}
            <motion.div {...fadeUp(0.15)}>
              <MypeProyectosCard
                proyectos={proyectos}
                puedeVerContacto={puedeVerContacto}
              />
            </motion.div>
          </div>

          {/* Columna lateral */}
          <div>
            <motion.div {...fadeUp(0.08)}>
              <MypeContactCard
                perfil={perfil}
                puedeVerContacto={puedeVerContacto}
              />
              <MypeMapaCard
                direccion={perfil.direccion}
                puedeVerContacto={puedeVerContacto}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </MypeLayout>
  );
}
