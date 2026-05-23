import { Shield, Lock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const FONT = "'Angro Std', 'Outfit', sans-serif";

export function MypeAccesoBloqueado({ mensaje, submensaje }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      style={{
        background: "linear-gradient(135deg, #F8FAFC, #fff)",
        border: "1px solid #E5E7EB",
        borderRadius: "1.5rem",
        padding: "36px 28px",
        textAlign: "center",
        marginBottom: 20,
        transition: "all 0.2s",
      }}
    >
      {/* Icono animado */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "relative",
          width: 64,
          height: 64,
          margin: "0 auto 18px",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#F1F5F9",
            border: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Shield size={26} color="#CBD5E1" />
        </div>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: -4,
            right: -4,
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "#FEF3C7",
            border: "2px solid #fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Lock size={12} color="#D97706" />
        </motion.div>
      </motion.div>

      <p
        style={{
          fontFamily: FONT,
          fontSize: 15,
          fontWeight: 700,
          color: "#374151",
          margin: "0 0 8px",
        }}
      >
        {mensaje || "Información restringida"}
      </p>
      <p
        style={{
          fontFamily: FONT,
          fontSize: 12,
          color: "#9CA3AF",
          maxWidth: 320,
          margin: "0 auto",
          lineHeight: 1.6,
        }}
      >
        {submensaje ||
          "Esta información solo está disponible para estudiantes aceptados en proyectos de esta empresa."}
      </p>
    </motion.div>
  );
}
