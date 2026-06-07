import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldAlert, Lock, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function MaintenanceScreen() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

  const irALogin = () => {
    if (isAuthenticated) {
      logout();
    }
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0d1b35, #0f2a4a 60%, #0a2240)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "'Outfit', 'Inter', sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: "48px 40px",
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #fef3c7, #fde68a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <ShieldAlert size={36} color="#d97706" />
        </div>

        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#0f1f3d",
            margin: 0,
            marginBottom: 8,
          }}
        >
          Sistema en mantenimiento
        </h1>

        <p
          style={{
            fontSize: 14,
            color: "#64748b",
            lineHeight: 1.6,
            margin: 0,
            marginBottom: 28,
          }}
        >
          MYPElink está realizando tareas de mantenimiento. Solo los
          administradores pueden ingresar en este momento. Volvé a intentar en
          unos minutos.
        </p>

        <div
          style={{
            background: "#f8fafc",
            borderRadius: 12,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
            border: "1px solid #e2e8f0",
          }}
        >
          <Lock size={14} color="#94a3b8" />
          <span style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>
            Tu sesión sigue activa. Cuando termine el mantenimiento, podrás
            seguir donde dejaste.
          </span>
        </div>

        <button
          onClick={irALogin}
          style={{
            background: "linear-gradient(135deg, #1B6FE8, #2563eb)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "10px 24px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <RefreshCw size={13} />
          Ingresar como administrador
        </button>
      </motion.div>
    </div>
  );
}