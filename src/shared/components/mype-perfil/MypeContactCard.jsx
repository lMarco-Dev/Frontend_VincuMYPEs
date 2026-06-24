import { MapPin, Phone, Mail, Building2, Shield, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const FONT = "'Inter', 'Outfit', sans-serif";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] },
});

export function MypeContactCard({ perfil, puedeVerContacto }) {
  const [copiedField, setCopiedField] = useState(null);

  const items = [
    { icon: MapPin, label: "Dirección", valor: perfil.direccion },
    { icon: Phone, label: "Teléfono", valor: perfil.telefono },
    { icon: Mail, label: "Correo electrónico", valor: perfil.emailContacto },
    { icon: Building2, label: "RUC", valor: perfil.ruc },
  ];

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <motion.div
      {...fadeUp(0.1)}
      style={{
        background: "#ffffff",
        border: "1px solid #e4e4e7",
        borderRadius: "16px",
        overflow: "hidden",
        marginBottom: 28,
        boxShadow: "0 1px 3px rgba(0,0,0,0.02), 0 4px 6px rgba(0,0,0,0.02)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid #f4f4f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          
          <h3
            style={{
              fontFamily: FONT,
              fontSize: "14px",
              fontWeight: 600,
              color: "#09090b",
              margin: 0,
              letterSpacing: "-0.2px",
            }}
          >
            Información de contacto
          </h3>
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: "12px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#71717a",
          }}
        >
          <div style={{ 
            width: "6px", height: "6px", borderRadius: "50%", 
            background: puedeVerContacto ? "#10b981" : "#d4d4d8" 
          }} />
          {puedeVerContacto ? "Acceso completo" : "Información restringida"}
        </div>
      </div>

      {!puedeVerContacto ? (
        <div style={{ padding: "40px 32px", textAlign: "center", background: "#fafafa" }}>
          <p style={{ fontFamily: FONT, fontSize: "14px", fontWeight: 600, color: "#09090b", marginBottom: 6 }}>
            Información privada
          </p>
          <p style={{ fontFamily: FONT, fontSize: "13px", color: "#71717a", maxWidth: 300, margin: "0 auto", lineHeight: 1.5 }}>
            Los datos de contacto estarán disponibles cuando seas aceptado en un proyecto de esta empresa.
          </p>
        </div>
      ) : (
        <div style={{ padding: "8px 0" }}>
          {items.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 24px",
                transition: "background 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                borderBottom: idx < items.length - 1 ? "1px solid #f4f4f5" : "none",
              }}
              whileHover={{ background: "#fafafa" }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "8px",
                  background: "#ffffff",
                  border: "1px solid #e4e4e7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                }}
              >
                <item.icon size={16} color="#71717a" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: FONT, fontSize: "11px", fontWeight: 500, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                  {item.label}
                </p>
                <p style={{ fontFamily: FONT, fontSize: "14px", fontWeight: 500, color: "#09090b", margin: "4px 0 0", wordBreak: "break-word" }}>
                  {item.valor || <span style={{ color: "#a1a1aa", fontWeight: 400 }}>No especificado</span>}
                </p>
              </div>
              
              {item.valor && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCopy(item.valor, item.label)}
                  style={{
                    background: copiedField === item.label ? "#f4f4f5" : "#ffffff",
                    border: "1px solid #e4e4e7",
                    color: copiedField === item.label ? "#09090b" : "#71717a",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: FONT,
                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: copiedField === item.label ? "none" : "0 1px 2px rgba(0,0,0,0.02)",
                  }}
                  onMouseEnter={(e) => { if (copiedField !== item.label) { e.currentTarget.style.color = "#09090b"; e.currentTarget.style.background = "#fafafa"; } }}
                  onMouseLeave={(e) => { if (copiedField !== item.label) { e.currentTarget.style.color = "#71717a"; e.currentTarget.style.background = "#ffffff"; } }}
                >
                  {copiedField === item.label ? <> <Check size={14} /> </> : <> <Copy size={14} /> </>}
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}