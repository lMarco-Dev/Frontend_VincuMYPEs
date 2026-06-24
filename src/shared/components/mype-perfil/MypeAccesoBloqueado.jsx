import { motion } from "framer-motion";

const FONT = "'Inter', 'Outfit', sans-serif";

export function MypeAccesoBloqueado({ mensaje, submensaje }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: "#FFFFFF",
        border: "1px solid #F1F5F9",
        borderRadius: 16,
        padding: "40px 28px",
        textAlign: "center",
        marginBottom: 14,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
      }}
    >
      <div style={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "#F1F5F9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 16px",
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M8 11l2 2 4-4"/>
        </svg>
      </div>

      <p style={{
        fontFamily: FONT,
        fontSize: 14,
        fontWeight: 600,
        color: "#334155",
        margin: "0 0 6px",
      }}>
        {mensaje || "Información restringida"}
      </p>
      <p style={{
        fontFamily: FONT,
        fontSize: 12,
        color: "#94A3B8",
        maxWidth: 300,
        margin: "0 auto",
        lineHeight: 1.6,
      }}>
        {submensaje || "Esta información solo está disponible para estudiantes aceptados en proyectos de esta empresa."}
      </p>
    </motion.div>
  );
}