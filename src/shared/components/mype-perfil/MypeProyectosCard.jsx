import {
  Briefcase,
  Clock,
  CheckCircle2,
  ArrowRight,
  Eye,
  Users,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const FONT = "'Angro Std', 'Outfit', sans-serif";

const ESTADO_BADGE = {
  PENDIENTE: {
    label: "Publicado",
    bg: "#EFF6FF",
    color: "#1D4ED8",
    border: "#BFDBFE",
    icon: <Eye size={10} />,
  },
  EN_DESARROLLO: {
    label: "En desarrollo",
    bg: "#FFFBEB",
    color: "#B45309",
    border: "#FDE68A",
    icon: <Clock size={10} />,
  },
  COMPLETADO: {
    label: "Completado",
    bg: "#F0FDF4",
    color: "#15803D",
    border: "#BBF7D0",
    icon: <CheckCircle2 size={10} />,
  },
  BORRADOR: {
    label: "Borrador",
    bg: "#F3F4F6",
    color: "#6B7280",
    border: "#E5E7EB",
    icon: <Briefcase size={10} />,
  },
};

const getAreaColor = (area) => {
  const areas = {
    DESARROLLO_WEB: {
      bg: "#EFF6FF",
      color: "#1B6FE8",
      border: "#BFDBFE",
      icon: "🌐",
    },
    DESARROLLO_MOVIL: {
      bg: "#F0FDF4",
      color: "#059669",
      border: "#BBF7D0",
      icon: "📱",
    },
    DESARROLLO_SOFTWARE: {
      bg: "#F5F3FF",
      color: "#7C3AED",
      border: "#DDD6FE",
      icon: "💻",
    },
    BASE_DE_DATOS: {
      bg: "#FFFBEB",
      color: "#D97706",
      border: "#FDE68A",
      icon: "🗄️",
    },
    ANALISIS_DATOS: {
      bg: "#FEF2F2",
      color: "#DC2626",
      border: "#FECACA",
      icon: "📊",
    },
    SOPORTE_TI: {
      bg: "#F0F9FF",
      color: "#0284C7",
      border: "#BAE6FD",
      icon: "🔧",
    },
    OTRO: { bg: "#F3F4F6", color: "#6B7280", border: "#E5E7EB", icon: "📁" },
  };
  return areas[area] || areas.OTRO;
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

export function MypeProyectosCard({ proyectos = [], puedeVerContacto }) {
  const proyectosVisibles = puedeVerContacto
    ? proyectos
    : proyectos.filter((p) => p.estado === "PENDIENTE");

  // Estadísticas rápidas
  const stats = {
    total: proyectosVisibles.length,
    enDesarrollo: proyectosVisibles.filter((p) => p.estado === "EN_DESARROLLO")
      .length,
    completados: proyectosVisibles.filter((p) => p.estado === "COMPLETADO")
      .length,
    publicados: proyectosVisibles.filter((p) => p.estado === "PENDIENTE")
      .length,
  };

  return (
    <motion.div
      {...fadeUp(0.2)}
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: "1.5rem",
        overflow: "hidden",
      }}
    >
      {/* Header con estadísticas */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid #F3F4F6",
          background: "linear-gradient(135deg, #F8FAFC, #fff)",
        }}
      >
        <div
          style={{
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
                width: 40,
                height: 40,
                borderRadius: "1rem",
                background: "#EFF6FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Briefcase size={20} color="#1B6FE8" />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: FONT,
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#0F1F3D",
                  margin: 0,
                }}
              >
                Proyectos publicados
              </h3>
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: 11,
                  color: "#9CA3AF",
                  margin: "2px 0 0",
                }}
              >
                Gestiona y da seguimiento a tus iniciativas
              </p>
            </div>
          </div>

          {/* Stats mini */}
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#1B6FE8" }}>
                {stats.total}
              </div>
              <div style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 600 }}>
                Total
              </div>
            </div>
            <div style={{ width: 1, background: "#E5E7EB" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#D97706" }}>
                {stats.enDesarrollo}
              </div>
              <div style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 600 }}>
                Activos
              </div>
            </div>
            <div style={{ width: 1, background: "#E5E7EB" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>
                {stats.completados}
              </div>
              <div style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 600 }}>
                Completados
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de proyectos */}
      {proyectosVisibles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ padding: "60px 32px", textAlign: "center" }}
        >
          <Briefcase
            size={48}
            color="#D1D5DB"
            style={{ marginBottom: 16, opacity: 0.5 }}
          />
          <p
            style={{
              fontFamily: FONT,
              fontSize: 14,
              fontWeight: 600,
              color: "#9CA3AF",
              margin: 0,
            }}
          >
            No hay proyectos disponibles
          </p>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 12,
              color: "#D1D5DB",
              marginTop: 4,
            }}
          >
            Publica tu primer proyecto para comenzar
          </p>
        </motion.div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 16,
            padding: 20,
          }}
        >
          {proyectosVisibles.map((proyecto, idx) => {
            const badge =
              ESTADO_BADGE[proyecto.estado] ?? ESTADO_BADGE.BORRADOR;
            const areaStyle = getAreaColor(proyecto.areaSistemas);
            const isPending = proyecto.estado === "PENDIENTE";
            const isActive = proyecto.estado === "EN_DESARROLLO";

            return (
              <motion.div
                key={proyecto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                style={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: "1.25rem",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 12px 24px rgba(0,0,0,0.08)";
                  e.currentTarget.style.borderColor = "#BFDBFE";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "#E5E7EB";
                }}
              >
                {/* Barra superior de color por área */}
                <div
                  style={{
                    height: 4,
                    background: `linear-gradient(90deg, ${areaStyle.color}, ${areaStyle.color}80)`,
                  }}
                />

                <div style={{ padding: "18px" }}>
                  {/* Header con área y estado */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: areaStyle.bg,
                        padding: "4px 10px",
                        borderRadius: 20,
                      }}
                    >
                      <span style={{ fontSize: 12 }}>{areaStyle.icon}</span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: areaStyle.color,
                        }}
                      >
                        {proyecto.areaSistemas?.replace(/_/g, " ") ||
                          "Sistemas"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        background: badge.bg,
                        padding: "4px 10px",
                        borderRadius: 20,
                      }}
                    >
                      {badge.icon}
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: badge.color,
                        }}
                      >
                        {badge.label}
                      </span>
                    </div>
                  </div>

                  {/* Título */}
                  <h4
                    style={{
                      fontFamily: FONT,
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#0F1F3D",
                      margin: "0 0 8px 0",
                      lineHeight: 1.4,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: 40,
                    }}
                  >
                    {proyecto.titulo}
                  </h4>

                  {/* Descripción corta */}
                  {proyecto.descripcion && (
                    <p
                      style={{
                        fontFamily: FONT,
                        fontSize: 11,
                        color: "#6B7280",
                        margin: "0 0 12px 0",
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {proyecto.descripcion}
                    </p>
                  )}

                  {/* Metadata */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 16,
                      flexWrap: "wrap",
                      paddingTop: 8,
                      borderTop: "1px solid #F3F4F6",
                    }}
                  >
                    {proyecto.fechaLimite && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Calendar size={11} color="#9CA3AF" />
                        <span
                          style={{
                            fontFamily: FONT,
                            fontSize: 10,
                            color: isActive ? "#D97706" : "#9CA3AF",
                            fontWeight: isActive ? 600 : 400,
                          }}
                        >
                          {new Date(proyecto.fechaLimite).toLocaleDateString(
                            "es-PE",
                          )}
                        </span>
                      </div>
                    )}
                    {proyecto.cupos && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Users size={11} color="#9CA3AF" />
                        <span
                          style={{
                            fontFamily: FONT,
                            fontSize: 10,
                            color: "#9CA3AF",
                          }}
                        >
                          {proyecto.cupos} cupo{proyecto.cupos > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 8,
                      paddingTop: 8,
                      borderTop: "1px solid #F3F4F6",
                    }}
                  >
                    {isPending && (
                      <Link
                        to={`/proyectos/${proyecto.id}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#1B6FE8",
                          textDecoration: "none",
                          padding: "6px 12px",
                          borderRadius: "0.5rem",
                          transition: "all 0.2s",
                          background: "rgba(27,111,232,0.06)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(27,111,232,0.12)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "rgba(27,111,232,0.06)";
                        }}
                      >
                        Ver proyecto <Eye size={12} />
                      </Link>
                    )}
                    {isActive && (
                      <Link
                        to={`/dashboard/mype/proyectos/${proyecto.id}/entregables`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#0891B2",
                          textDecoration: "none",
                          padding: "6px 12px",
                          borderRadius: "0.5rem",
                          transition: "all 0.2s",
                          background: "rgba(8,145,178,0.06)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(8,145,178,0.12)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "rgba(8,145,178,0.06)";
                        }}
                      >
                        Revisar entregables <ArrowRight size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
