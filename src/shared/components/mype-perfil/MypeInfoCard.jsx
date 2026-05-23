import { Briefcase, TrendingUp, Calendar, Award } from "lucide-react";
import { motion } from "framer-motion";

const FONT = "'Angro Std', 'Outfit', sans-serif";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

export function MypeInfoCard({ perfil }) {
  const fechaRegistro = perfil.fechaRegistro
    ? new Date(perfil.fechaRegistro).toLocaleDateString("es-PE", {
        month: "long",
        year: "numeric",
      })
    : null;

  const items = [
    {
      icon: Briefcase,
      label: "Proyectos totales",
      valor: perfil.totalProyectos ?? 0,
      color: "#1B6FE8",
      bg: "#EFF6FF",
      gradient: "linear-gradient(135deg, #1B6FE8, #06B6D4)",
    },
    {
      icon: TrendingUp,
      label: "Proyectos activos",
      valor: perfil.proyectosActivos ?? 0,
      color: "#059669",
      bg: "#F0FDF4",
      gradient: "linear-gradient(135deg, #059669, #10B981)",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        marginBottom: 28,
      }}
    >
      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {items.map((s, idx) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              {...fadeUp(0.1 + idx * 0.05)}
              whileHover={{ y: -4 }}
              style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: "1.5rem",
                padding: "24px",
                display: "flex",
                alignItems: "center",
                gap: 18,
                transition: "all 0.3s ease",
                cursor: "default",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(0,0,0,0.06)";
                e.currentTarget.style.borderColor = s.border || "#BFDBFE";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "#E5E7EB";
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "1rem",
                  background: s.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={26} color={s.color} />
              </div>
              <div>
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 4,
                  }}
                >
                  {s.label}
                </p>
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: 32,
                    fontWeight: 800,
                    color: "#0F1F3D",
                    margin: 0,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.valor}
                </p>
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 80,
                  height: 80,
                  background: s.bg,
                  borderRadius: "50%",
                  filter: "blur(30px)",
                  opacity: 0.5,
                  pointerEvents: "none",
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Info adicional - Fecha de registro */}
      {fechaRegistro && (
        <motion.div
          {...fadeUp(0.2)}
          whileHover={{ y: -2 }}
          style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: "1rem",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            transition: "all 0.2s",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "0.75rem",
              background: "#F3F4F6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Calendar size={16} color="#6B7280" />
          </div>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 12,
              color: "#6B7280",
              margin: 0,
            }}
          >
            Empresa registrada en{" "}
            <span style={{ fontWeight: 700, color: "#1B6FE8" }}>
              {fechaRegistro}
            </span>
          </p>
          <Award size={14} color="#D1D5DB" style={{ marginLeft: "auto" }} />
        </motion.div>
      )}
    </div>
  );
}
