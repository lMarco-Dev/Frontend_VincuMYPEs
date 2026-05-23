import { MapPin, Lock } from "lucide-react";

const FONT = "'Angro Std', 'Outfit', sans-serif";

export function MypeMapaCard({ direccion, puedeVerContacto }) {
  const query = encodeURIComponent((direccion || "") + ", Cajamarca, Peru");

  return (
    <div
      style={{
        background: "#fff",
        border: "0.5px solid #E5E7EB",
        borderRadius: "1rem",
        overflow: "hidden",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "0.5px solid #F3F4F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <MapPin size={14} color="#1B6FE8" />
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
            Ubicación
          </span>
        </div>
        {!puedeVerContacto && (
          <span
            style={{
              fontFamily: FONT,
              fontSize: 10,
              fontWeight: 700,
              background: "#FEF3C7",
              color: "#D97706",
              border: "1px solid #FDE68A",
              padding: "2px 8px",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Lock size={9} /> Privado
          </span>
        )}
      </div>

      {!puedeVerContacto ? (
        <div style={{ padding: "24px 16px", textAlign: "center" }}>
          <MapPin size={24} color="#D1D5DB" style={{ marginBottom: 6 }} />
          <p
            style={{
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 600,
              color: "#374151",
              margin: "0 0 3px",
            }}
          >
            Cajamarca, Perú
          </p>
          <p style={{ fontFamily: FONT, fontSize: 11, color: "#9CA3AF" }}>
            Dirección exacta disponible al ser aceptado
          </p>
        </div>
      ) : direccion ? (
        <>
          <div
            style={{
              padding: "8px 14px 6px",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <MapPin size={12} color="#6B7280" />
            <span style={{ fontFamily: FONT, fontSize: 12, color: "#374151" }}>
              {direccion}
            </span>
          </div>
          <iframe
            title="Mapa"
            loading="lazy"
            src={`https://maps.google.com/maps?q=${query}&output=embed`}
            width="100%"
            height="180"
            style={{ border: "none", display: "block" }}
            referrerPolicy="no-referrer-when-downgrade"
          />
        </>
      ) : (
        <div style={{ padding: "20px 16px", textAlign: "center" }}>
          <p style={{ fontFamily: FONT, fontSize: 12, color: "#9CA3AF" }}>
            Sin dirección especificada
          </p>
        </div>
      )}
    </div>
  );
}
