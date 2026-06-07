import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/shared/api/httpClient";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Building2,
  Globe,
  MapPin,
  ExternalLink,
  AlertCircle,
  Loader2,
} from "lucide-react";

// =========================================================================
// ANIMACIONES
// =========================================================================
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

// =========================================================================
// COMPONENTES REUTILIZABLES
// =========================================================================

const Section = ({ title, children }) => (
  <motion.section
    {...fadeUp(0)}
    style={{
      background: "#fff",
      border: "0.5px solid #e8e8e4",
      borderRadius: 16,
      padding: 24,
    }}
  >
    <h3
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: "#0f1f3d",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {title}
    </h3>
    {children}
  </motion.section>
);

const InfoRow = ({ icon, label, value }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 12px",
      background: "#f8fafc",
      border: "0.5px solid #e8e8e4",
      borderRadius: 10,
    }}
  >
    <span style={{ color: "#1B6FE8" }}>{icon}</span>
    <span style={{ fontSize: 11, fontWeight: 600, color: "#475569", minWidth: 70 }}>
      {label}
    </span>
    <span style={{ fontSize: 13, color: "#0f1f3d", fontWeight: 500 }}>{value || "—"}</span>
  </div>
);

// Hero Banner para MYPE (sin animaciones complejas que puedan dar error)
const MypeHeroBanner = ({ nombre, rubro, descripcion }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    style={{
      position: "relative",
      overflow: "hidden",
      borderRadius: 20,
      background: "linear-gradient(135deg,#0d1b35,#0f2a4a 60%,#0a2240)",
      padding: "40px 44px",
      color: "#fff",
      marginBottom: 24,
    }}
  >
    <div style={{ position: "relative", zIndex: 10 }}>
      <h1 style={{ fontSize: "clamp(23px,2.5vw,30px)", fontWeight: 800, marginBottom: 8 }}>
        {nombre}
      </h1>
      {rubro && (
        <span style={{ padding: "4px 12px", borderRadius: 7, background: "rgba(27,111,232,0.2)", border: "0.5px solid rgba(27,111,232,0.3)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#67d4f8" }}>
          {rubro}
        </span>
      )}
      {descripcion && (
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 16, maxWidth: 500, lineHeight: 1.5 }}>
          {descripcion}
        </p>
      )}
    </div>
  </motion.div>
);

// =========================================================================
// PÁGINA PRINCIPAL
// =========================================================================
export default function PerfilPublicoMypePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: mype, isLoading, error } = useQuery({
    queryKey: ['mype-publico', id],
    queryFn: async () => {
      const { data } = await httpClient.get(`/mypes/${id}/publico`);
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (error || !mype) {
    return (
      <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <AlertCircle size={44} color="#DC2626" />
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f1f3d' }}>Empresa no encontrada</h2>
        <p style={{ fontSize: 13, color: '#64748b', textAlign: 'center' }}>El perfil de esta MYPE no existe o no está disponible.</p>
        <button onClick={() => navigate(-1)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#1B6FE8', color: '#fff', padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
          <ChevronLeft size={14} /> Volver
        </button>
      </div>
    );
  }

  const tieneCoordenadas = mype.latitud && mype.longitud;

  return (
    <div style={{ fontFamily: "Inter, Arial, 'Helvetica Neue', sans-serif", background: "#f8fafc", minHeight: "100vh", padding: "32px 36px", maxWidth: 1440, margin: "0 auto" }}>
      
      {/* Botón volver */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: 12,
          color: "#6B7280",
          fontWeight: 600,
          marginBottom: 14,
          padding: 0,
        }}
      >
        <ChevronLeft size={14} /> Volver
      </button>

      {/* Hero Banner */}
      <MypeHeroBanner
        nombre={mype.nombreComercial}
        rubro={mype.rubro}
        descripcion={mype.descripcion}
      />

      {/* Layout dos columnas */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.9fr", gap: 24 }}>
        
        {/* COLUMNA IZQUIERDA */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Datos de contacto */}
          <Section title="Datos de contacto">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {mype.direccion && <InfoRow icon={<MapPin size={14} />} label="Dirección" value={mype.direccion} />}
              {mype.ciudad && <InfoRow icon={<Building2 size={14} />} label="Ciudad" value={mype.ciudad} />}
              {mype.sector && <InfoRow icon={<MapPin size={14} />} label="Sector" value={mype.sector} />}
              {mype.sitioWeb && (
                <a href={mype.sitioWeb} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <InfoRow icon={<Globe size={14} />} label="Sitio web" value={mype.sitioWeb} />
                </a>
              )}
            </div>
          </Section>

          {/* Redes sociales (solo texto + enlace) */}
          {(mype.instagram || mype.facebook || mype.tiktok || mype.whatsapp) && (
            <Section title="Redes sociales">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {mype.instagram && (
                  <a href={`https://instagram.com/${mype.instagram}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f8fafc", padding: "6px 12px", borderRadius: 20, border: "0.5px solid #e2e8f0" }}>
                      <Globe size={14} /> <span style={{ fontSize: 12 }}>Instagram: {mype.instagram}</span>
                    </div>
                  </a>
                )}
                {mype.facebook && (
                  <a href={`https://facebook.com/${mype.facebook}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f8fafc", padding: "6px 12px", borderRadius: 20, border: "0.5px solid #e2e8f0" }}>
                      <Globe size={14} /> <span style={{ fontSize: 12 }}>Facebook: {mype.facebook}</span>
                    </div>
                  </a>
                )}
                {mype.tiktok && (
                  <a href={`https://tiktok.com/@${mype.tiktok}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f8fafc", padding: "6px 12px", borderRadius: 20, border: "0.5px solid #e2e8f0" }}>
                      <Globe size={14} /> <span style={{ fontSize: 12 }}>TikTok: @{mype.tiktok}</span>
                    </div>
                  </a>
                )}
                {mype.whatsapp && (
                  <a href={`https://wa.me/${mype.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f8fafc", padding: "6px 12px", borderRadius: 20, border: "0.5px solid #e2e8f0" }}>
                      <Globe size={14} /> <span style={{ fontSize: 12 }}>WhatsApp</span>
                    </div>
                  </a>
                )}
              </div>
            </Section>
          )}

          {/* Descripción extendida */}
          {mype.descripcion && (
            <Section title="Acerca de">
              <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, margin: 0 }}>{mype.descripcion}</p>
            </Section>
          )}
        </div>

        {/* COLUMNA DERECHA - Ubicación */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Section title="Ubicación">
            {tieneCoordenadas ? (
              <>
                <div style={{ height: 200, background: "#e2e8f0", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
                  <MapPin size={32} color="#1B6FE8" />
                  <p style={{ fontSize: 12, color: "#475569" }}>Lat: {mype.latitud}, Lng: {mype.longitud}</p>
                  <a 
                    href={`https://www.openstreetmap.org/?mlat=${mype.latitud}&mlon=${mype.longitud}#map=15/${mype.latitud}/${mype.longitud}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 11, color: "#1B6FE8", display: "flex", alignItems: "center", gap: 4 }}
                  >
                    Ver en OpenStreetMap <ExternalLink size={11} />
                  </a>
                </div>
                {mype.direccion && <p style={{ fontSize: 12, color: "#475569", marginTop: 8 }}>{mype.direccion}</p>}
                {mype.ciudad && <p style={{ fontSize: 12, color: "#475569" }}>Ciudad: {mype.ciudad}</p>}
                {mype.sector && <p style={{ fontSize: 12, color: "#475569" }}>Sector: {mype.sector}</p>}
              </>
            ) : (
              <div style={{ height: 120, background: "#f1f5f9", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
                <MapPin size={20} /> No hay coordenadas registradas
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}