import { useState } from "react";
import { motion } from "framer-motion";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import { useMiPerfilMype } from "@/features/mype-perfil/useMypePerfil";
import { useNivelAccesoMype } from "@/features/mype-perfil/useNivelAccesoMype";
import { MypeProfileHeader } from "@/shared/components/mype-perfil/MypeProfileHeader";
import { MypeInfoCard } from "@/shared/components/mype-perfil/MypeInfoCard";
import { MypeContactCard } from "@/shared/components/mype-perfil/MypeContactCard";
import { MypeProyectosCard } from "@/shared/components/mype-perfil/MypeProyectosCard";
import { MypeSocialLinks } from "@/shared/components/mype-perfil/MypeSocialLinks";
import { MypeMapaCard } from "@/shared/components/mype-perfil/MypeMapaCard";
import { MypePerfilEditarModal } from "@/shared/components/mype-perfil/MypePerfilEditarModal";

const FONT = "'Inter', 'Outfit', sans-serif";

export function MypePerfilPage() {
  const { perfil, isLoading } = useMiPerfilMype();
  const { puedeVerContacto, puedeEditar } = useNivelAccesoMype(perfil);
  const [editando, setEditando] = useState(false);
  const proyectos = perfil?.proyectos ?? [];

  if (isLoading) {
    return (
      <MypeLayout titulo="Mi Perfil">
        <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 1100, margin: "0 auto" }}>
          {[280, 100, 160].map((h, i) => (
            <div
              key={i}
              style={{
                height: h,
                borderRadius: 16,
                background: "#F1F5F9",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
      </MypeLayout>
    );
  }

  if (!perfil) {
    return (
      <MypeLayout titulo="Mi Perfil">
        <div style={{ textAlign: "center", padding: "60px 24px" }}>
          <p style={{ fontFamily: FONT, fontSize: 14, color: "#94A3B8" }}>
            No se encontró el perfil
          </p>
        </div>
      </MypeLayout>
    );
  }

  return (
    <MypeLayout titulo="Mi Perfil">
      {editando && perfil && (
        <MypePerfilEditarModal perfil={perfil} onClose={() => setEditando(false)} />
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <MypeProfileHeader perfil={perfil} puedeEditar={puedeEditar} onEditar={() => setEditando(true)} />

        <MypeSocialLinks perfil={perfil} variant="full" />

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 14,
          alignItems: "start",
        }}>
          <div>
            {/* Descripción */}
            {perfil.descripcion && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #F1F5F9",
                  borderRadius: 16,
                  padding: "20px 24px",
                  marginBottom: 14,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
                }}
              >
                <h3 style={{
                  fontFamily: FONT,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#0F172A",
                  margin: "0 0 10px",
                  letterSpacing: "-0.01em",
                }}>
                  Sobre la empresa
                </h3>
                <p style={{
                  fontFamily: FONT,
                  fontSize: 13,
                  color: "#475569",
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  {perfil.descripcion}
                </p>
              </motion.div>
            )}

            <MypeInfoCard perfil={perfil} />
            <MypeProyectosCard proyectos={proyectos} puedeVerContacto={puedeVerContacto} />
          </div>

          <div>
            <MypeContactCard perfil={perfil} puedeVerContacto={puedeVerContacto} />
            <MypeMapaCard direccion={perfil.direccion} puedeVerContacto={puedeVerContacto} />
          </div>
        </div>
      </div>
    </MypeLayout>
  );
}