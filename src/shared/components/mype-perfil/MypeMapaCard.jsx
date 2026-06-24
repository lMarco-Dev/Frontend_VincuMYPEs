import { MapPin, Navigation, Building2 } from "lucide-react";
import { motion } from "framer-motion";

const FONT = "'Inter', 'Outfit', sans-serif";

export function MypeMapaCard({ direccion, puedeVerContacto }) {
  const query = encodeURIComponent((direccion || "") + ", Cajamarca, Peru");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: "#FFFFFF",
        border: "1px solid #F1F5F9",
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 14,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
      }}
    >
      {/* Header */}
      <div style={{
        padding: "14px 18px",
        borderBottom: "1px solid #F8FAFC",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#FAFBFC",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "#F1F5F9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <MapPin size={15} color="#64748B" />
          </div>
          <div>
            <p style={{
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 600,
              color: "#0F172A",
              margin: 0,
              letterSpacing: "-0.01em",
            }}>
              Ubicación
            </p>
            <p style={{
              fontFamily: FONT,
              fontSize: 10,
              color: "#94A3B8",
              margin: "1px 0 0",
              fontWeight: 400,
            }}>
              {puedeVerContacto ? "Dirección fiscal registrada" : "Información restringida"}
            </p>
          </div>
        </div>
        {!puedeVerContacto && (
          <span style={{
            fontFamily: FONT,
            fontSize: 10,
            fontWeight: 500,
            background: "#F8FAFC",
            color: "#94A3B8",
            border: "1px solid #F1F5F9",
            padding: "4px 10px",
            borderRadius: 6,
          }}>
            Privado
          </span>
        )}
      </div>

      {/* Sin acceso */}
      {!puedeVerContacto ? (
        <div style={{
          padding: "40px 24px",
          textAlign: "center",
          background: "#FAFBFC",
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "#F1F5F9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
          }}>
            <Building2 size={22} color="#94A3B8" />
          </div>
          <p style={{
            fontFamily: FONT,
            fontSize: 13,
            fontWeight: 600,
            color: "#334155",
            margin: "0 0 4px",
          }}>
            Cajamarca, Perú
          </p>
          <p style={{
            fontFamily: FONT,
            fontSize: 11,
            color: "#94A3B8",
            margin: 0,
            maxWidth: 220,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.5,
          }}>
            La dirección exacta estará disponible cuando seas aceptado en un proyecto
          </p>
        </div>
      ) : direccion ? (
        <>
          {/* Dirección */}
          <div style={{
            padding: "10px 18px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            borderBottom: "1px solid #F8FAFC",
          }}>
            <div style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#22C55E",
              flexShrink: 0,
            }} />
            <Navigation size={13} color="#64748B" style={{ flexShrink: 0 }} />
            <span style={{
              fontFamily: FONT,
              fontSize: 12,
              color: "#475569",
              fontWeight: 500,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {direccion}
            </span>
          </div>

          {/* Mapa */}
          <div style={{ position: "relative", background: "#F1F5F9" }}>
            <div style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: 1,
              background: "linear-gradient(90deg, transparent, #94A3B840, transparent)",
              zIndex: 1,
              pointerEvents: "none",
            }} />
            <iframe
              title="Mapa de ubicación"
              loading="lazy"
              src={`https://maps.google.com/maps?q=${query}&output=embed`}
              width="100%"
              height="220"
              style={{ border: "none", display: "block" }}
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Link Google Maps */}
          <div style={{
            padding: "8px 18px",
            borderTop: "1px solid #F8FAFC",
            display: "flex",
            justifyContent: "flex-end",
          }}>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${query}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: FONT,
                fontSize: 11,
                fontWeight: 500,
                color: "#94A3B8",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 4,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#0F172A"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#94A3B8"; }}
            >
              <Navigation size={11} />
              Ver en Google Maps
            </a>
          </div>
        </>
      ) : (
        <div style={{
          padding: "40px 24px",
          textAlign: "center",
          background: "#FAFBFC",
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "#F1F5F9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
          }}>
            <MapPin size={22} color="#CBD5E1" />
          </div>
          <p style={{
            fontFamily: FONT,
            fontSize: 12,
            fontWeight: 500,
            color: "#94A3B8",
            margin: 0,
          }}>
            Sin dirección especificada
          </p>
        </div>
      )}
    </motion.div>
  );
}