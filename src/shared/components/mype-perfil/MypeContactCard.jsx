import {
  MapPin,
  Phone,
  Mail,
  Building2,
  Shield,
  Copy,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const FONT = "'Angro Std', 'Outfit', sans-serif";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

export function MypeContactCard({ perfil, puedeVerContacto }) {
  const [copiedField, setCopiedField] = useState(null);

  const items = [
    {
      icon: MapPin,
      label: "Dirección",
      valor: perfil.direccion,
      color: "#1B6FE8",
      bg: "#EFF6FF",
    },
    {
      icon: Phone,
      label: "Teléfono",
      valor: perfil.telefono,
      color: "#059669",
      bg: "#F0FDF4",
    },
    {
      icon: Mail,
      label: "Email contacto",
      valor: perfil.emailContacto,
      color: "#D97706",
      bg: "#FFFBEB",
    },
    {
      icon: Building2,
      label: "RUC",
      valor: perfil.ruc,
      color: "#8B5CF6",
      bg: "#F5F3FF",
    },
  ];

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <motion.div
      {...fadeUp(0.15)}
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: "1.5rem",
        overflow: "hidden",
        marginBottom: 28,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #F3F4F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "0.75rem",
              background: "#EFF6FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Shield size={16} color="#1B6FE8" />
          </div>
          <h3
            style={{
              fontFamily: FONT,
              fontSize: 14,
              fontWeight: 700,
              color: "#0F1F3D",
              margin: 0,
            }}
          >
            Información de contacto
          </h3>
        </div>
        <motion.span
          whileHover={{ scale: 1.02 }}
          style={{
            fontFamily: FONT,
            fontSize: 10,
            fontWeight: 700,
            padding: "4px 14px",
            borderRadius: 30,
            background: puedeVerContacto ? "#F0FDF4" : "#F3F4F6",
            color: puedeVerContacto ? "#15803D" : "#9CA3AF",
            border: `1px solid ${puedeVerContacto ? "#BBF7D0" : "#E5E7EB"}`,
          }}
        >
          {puedeVerContacto ? "✓ Acceso completo" : "🔒 Solo datos públicos"}
        </motion.span>
      </div>

      {/* Contenido */}
      {!puedeVerContacto ? (
        <div style={{ padding: "48px 32px", textAlign: "center" }}>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#F8FAFC",
              border: "1px solid #E5E7EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Shield size={28} color="#D1D5DB" />
          </motion.div>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 15,
              fontWeight: 700,
              color: "#374151",
              marginBottom: 8,
            }}
          >
            Información privada
          </p>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 12,
              color: "#9CA3AF",
              maxWidth: 300,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Los datos de contacto estarán disponibles cuando seas aceptado en un
            proyecto de esta empresa.
          </p>
        </div>
      ) : (
        <div style={{ padding: "8px 0" }}>
          {items.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "14px 24px",
                transition: "background 0.2s",
                borderBottom:
                  idx < items.length - 1 ? "0.5px solid #F9FAFB" : "none",
              }}
              whileHover={{ background: "#F9FAFB" }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "0.75rem",
                  background: item.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <item.icon size={18} color={item.color} />
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    margin: 0,
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#111827",
                    margin: "4px 0 0",
                    wordBreak: "break-word",
                  }}
                >
                  {item.valor || (
                    <span style={{ color: "#D1D5DB", fontStyle: "italic" }}>
                      No especificado
                    </span>
                  )}
                </p>
              </div>
              {item.valor && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCopy(item.valor, item.label)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: copiedField === item.label ? "#059669" : "#1B6FE8",
                    padding: 8,
                    borderRadius: "0.5rem",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                  onMouseEnter={(e) => {
                    if (copiedField !== item.label) {
                      e.currentTarget.style.background = "#EFF6FF";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {copiedField === item.label ? (
                    <>
                      <Check size={14} /> Copiado
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copiar
                    </>
                  )}
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
