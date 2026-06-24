import { Briefcase, ArrowRight, Eye, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const FONT = "'Inter', 'Outfit', sans-serif";

const ESTADO_BADGE = {
  PENDIENTE: {
    label: "Publicado",
    bg: "#F8FAFC",
    color: "#475569",
    border: "#E2E8F0",
  },
  EN_DESARROLLO: {
    label: "En desarrollo",
    bg: "#F8FAFC",
    color: "#475569",
    border: "#E2E8F0",
  },
  COMPLETADO: {
    label: "Completado",
    bg: "#F8FAFC",
    color: "#475569",
    border: "#E2E8F0",
  },
  BORRADOR: {
    label: "Borrador",
    bg: "#F8FAFC",
    color: "#94A3B8",
    border: "#E2E8F0",
  },
};

export function MypeProyectosCard({ proyectos = [], puedeVerContacto }) {
  const proyectosVisibles = puedeVerContacto
    ? proyectos
    : proyectos.filter((p) => p.estado === "PENDIENTE");

  const completados = proyectosVisibles.filter((p) => p.estado === "COMPLETADO").length;

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
        padding: "20px 24px",
        borderBottom: "1px solid #F8FAFC",
        background: "#FAFBFC",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <div>
            <h3 style={{
              fontFamily: FONT,
              fontSize: 14,
              fontWeight: 600,
              color: "#0F172A",
              margin: 0,
              letterSpacing: "-0.01em",
            }}>
              Proyectos publicados
            </h3>
            <p style={{
              fontFamily: FONT,
              fontSize: 11,
              color: "#94A3B8",
              margin: "2px 0 0",
            }}>
              Gestiona y da seguimiento a tus iniciativas
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", fontFamily: FONT }}>
              {completados}
            </div>
            <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 500, fontFamily: FONT }}>
              Completados
            </div>
          </div>
        </div>
      </div>

      {/* Grid de proyectos */}
      {proyectosVisibles.length === 0 ? (
        <div style={{ padding: "60px 32px", textAlign: "center" }}>
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
            <Briefcase size={24} color="#CBD5E1" />
          </div>
          <p style={{
            fontFamily: FONT,
            fontSize: 14,
            fontWeight: 600,
            color: "#94A3B8",
            margin: 0,
          }}>
            No hay proyectos disponibles
          </p>
          <p style={{
            fontFamily: FONT,
            fontSize: 12,
            color: "#CBD5E1",
            marginTop: 4,
          }}>
            Publica tu primer proyecto para comenzar
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 14,
          padding: 18,
        }}>
          {proyectosVisibles.map((proyecto, idx) => {
            const badge = ESTADO_BADGE[proyecto.estado] ?? ESTADO_BADGE.BORRADOR;
            const isPending = proyecto.estado === "PENDIENTE";
            const isActive = proyecto.estado === "EN_DESARROLLO";

            return (
              <motion.div
                key={proyecto.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #F1F5F9",
                  borderRadius: 12,
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
                  e.currentTarget.style.borderColor = "#E2E8F0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "#F1F5F9";
                }}
              >
                <div style={{ padding: "16px" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}>
                    <span style={{
                      fontFamily: FONT,
                      fontSize: 10,
                      fontWeight: 500,
                      color: "#94A3B8",
                      background: "#F8FAFC",
                      padding: "3px 8px",
                      borderRadius: 6,
                      border: "1px solid #F1F5F9",
                    }}>
                      {proyecto.areaSistemas?.replace(/_/g, " ") || "Sistemas"}
                    </span>
                    <span style={{
                      fontFamily: FONT,
                      fontSize: 10,
                      fontWeight: 500,
                      color: badge.color,
                      background: badge.bg,
                      padding: "3px 8px",
                      borderRadius: 6,
                      border: `1px solid ${badge.border}`,
                    }}>
                      {badge.label}
                    </span>
                  </div>

                  <h4 style={{
                    fontFamily: FONT,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#0F172A",
                    margin: "0 0 6px 0",
                    lineHeight: 1.4,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: 36,
                  }}>
                    {proyecto.titulo}
                  </h4>

                  {proyecto.descripcion && (
                    <p style={{
                      fontFamily: FONT,
                      fontSize: 11,
                      color: "#94A3B8",
                      margin: "0 0 10px 0",
                      lineHeight: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>
                      {proyecto.descripcion}
                    </p>
                  )}

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 12,
                    flexWrap: "wrap",
                    paddingTop: 8,
                    borderTop: "1px solid #F8FAFC",
                  }}>
                    {proyecto.fechaLimite && (
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Calendar size={11} color="#94A3B8" />
                        <span style={{
                          fontFamily: FONT,
                          fontSize: 10,
                          color: "#64748B",
                          fontWeight: 500,
                        }}>
                          {new Date(proyecto.fechaLimite).toLocaleDateString("es-PE")}
                        </span>
                      </div>
                    )}
                    {proyecto.cupos && (
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Users size={11} color="#94A3B8" />
                        <span style={{
                          fontFamily: FONT,
                          fontSize: 10,
                          color: "#64748B",
                          fontWeight: 500,
                        }}>
                          {proyecto.cupos} cupo{proyecto.cupos > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 8,
                    paddingTop: 8,
                    borderTop: "1px solid #F8FAFC",
                  }}>
                    {isPending && (
                      <Link
                        to={`/proyectos/${proyecto.id}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 11,
                          fontWeight: 500,
                          color: "#0F172A",
                          textDecoration: "none",
                          padding: "5px 10px",
                          borderRadius: 6,
                          transition: "all 0.15s",
                          background: "#F8FAFC",
                          border: "1px solid #F1F5F9",
                          fontFamily: FONT,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#F1F5F9";
                          e.currentTarget.style.borderColor = "#E2E8F0";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#F8FAFC";
                          e.currentTarget.style.borderColor = "#F1F5F9";
                        }}
                      >
                        Ver proyecto <Eye size={11} />
                      </Link>
                    )}
                    {isActive && (
                      <Link
                        to={`/dashboard/mype/proyectos/${proyecto.id}/entregables`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 11,
                          fontWeight: 500,
                          color: "#0F172A",
                          textDecoration: "none",
                          padding: "5px 10px",
                          borderRadius: 6,
                          transition: "all 0.15s",
                          background: "#F8FAFC",
                          border: "1px solid #F1F5F9",
                          fontFamily: FONT,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#F1F5F9";
                          e.currentTarget.style.borderColor = "#E2E8F0";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#F8FAFC";
                          e.currentTarget.style.borderColor = "#F1F5F9";
                        }}
                      >
                        Revisar entregables <ArrowRight size={11} />
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