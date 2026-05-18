import { MypeLayout } from "@shared/layouts/MypeLayout";
import { useMisProyectos } from "@/features/proyecto-list-mype/useMisProyectos";
import { PROYECTO_ESTADO } from "@/entities/proyecto/proyecto.constants";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Users,
  Play,
  CheckCircle,
  Plus,
  ArrowRight,
} from "lucide-react";

const FONT = "'Angro Std', 'Outfit', sans-serif";

export function EstadoBadge({ estado }) {
  const map = {
    BORRADOR: {
      bg: "#F3F4F6",
      color: "#4B5563",
      border: "#E5E7EB",
      label: "Borrador",
    },
    PENDIENTE: {
      bg: "#EFF6FF",
      color: "#1D4ED8",
      border: "#BFDBFE",
      label: "Publicado",
    },
    EN_DESARROLLO: {
      bg: "#FFFBEB",
      color: "#B45309",
      border: "#FDE68A",
      label: "En desarrollo",
    },
    EN_REVISION: {
      bg: "#F5F3FF",
      color: "#6D28D9",
      border: "#DDD6FE",
      label: "En revisión",
    },
    COMPLETADO: {
      bg: "#F0FDF4",
      color: "#15803D",
      border: "#BBF7D0",
      label: "Completado",
    },
  };
  const s = map[estado] ?? map.BORRADOR;
  return (
    <span
      style={{
        fontFamily: FONT,
        fontSize: 10,
        fontWeight: 700,
        padding: "2px 9px",
        borderRadius: 10,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}

function Sk({ h = 80 }) {
  return (
    <div
      style={{
        height: h,
        borderRadius: 10,
        background: "#E5E7EB",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    />
  );
}

export function MypeDashboardPage() {
  const { proyectos, isLoading } = useMisProyectos();
  const navigate = useNavigate();

  const pendientes = proyectos.filter(
    (p) => p.estado === PROYECTO_ESTADO.PENDIENTE,
  ).length;
  const enDesarrollo = proyectos.filter(
    (p) => p.estado === PROYECTO_ESTADO.EN_DESARROLLO,
  ).length;
  const completados = proyectos.filter(
    (p) => p.estado === PROYECTO_ESTADO.COMPLETADO,
  ).length;
  const borradores = proyectos.filter(
    (p) => p.estado === PROYECTO_ESTADO.BORRADOR,
  ).length;

  const recientes = [...proyectos]
    .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
    .slice(0, 4);

  const stats = [
    {
      label: "Total proyectos",
      valor: proyectos.length,
      icon: FileText,
      bg: "#EFF6FF",
      color: "#1B6FE8",
    },
    {
      label: "Publicados",
      valor: pendientes,
      icon: Users,
      bg: "#F0F9FF",
      color: "#0891B2",
    },
    {
      label: "En desarrollo",
      valor: enDesarrollo,
      icon: Play,
      bg: "#FFFBEB",
      color: "#D97706",
    },
    {
      label: "Completados",
      valor: completados,
      icon: CheckCircle,
      bg: "#F0FDF4",
      color: "#16A34A",
    },
  ];

  const barras = [
    {
      label: "Publicados",
      count: pendientes,
      bar: "linear-gradient(90deg,#1B6FE8,#06B6D4)",
    },
    { label: "En desarrollo", count: enDesarrollo, bar: "#F97316" },
    { label: "Borradores", count: borradores, bar: "#6B7280" },
    { label: "Completados", count: completados, bar: "#10B981" },
  ];

  return (
    <MypeLayout
      titulo="Dashboard"
      accion={{ to: "/dashboard/mype/crear", label: "Nuevo proyecto" }}
    >
      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 10,
          marginBottom: 16,
        }}
      >
        {isLoading
          ? [1, 2, 3, 4].map((i) => <Sk key={i} h={76} />)
          : stats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  style={{
                    background: "#fff",
                    border: "0.5px solid #E5E7EB",
                    borderRadius: 10,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    transition: "box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(0,0,0,0.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = "none")
                  }
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: s.bg,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={17} color={s.color} />
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: FONT,
                        fontSize: 22,
                        fontWeight: 700,
                        color: "#111827",
                        margin: 0,
                        lineHeight: 1,
                      }}
                    >
                      {s.valor}
                    </p>
                    <p
                      style={{
                        fontFamily: FONT,
                        fontSize: 10,
                        color: "#9CA3AF",
                        margin: "3px 0 0",
                        fontWeight: 500,
                      }}
                    >
                      {s.label}
                    </p>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Dos columnas */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 12 }}
      >
        {/* Proyectos recientes */}
        <div
          style={{
            background: "#fff",
            border: "0.5px solid #E5E7EB",
            borderRadius: 10,
            overflow: "hidden",
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
            <p
              style={{
                fontFamily: FONT,
                fontSize: 11,
                fontWeight: 700,
                color: "#111827",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                margin: 0,
              }}
            >
              Proyectos recientes
            </p>
            <Link
              to="/dashboard/mype/proyectos"
              style={{
                fontFamily: FONT,
                fontSize: 11,
                fontWeight: 600,
                color: "#1B6FE8",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>

          {isLoading ? (
            <div
              style={{
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {[1, 2, 3].map((i) => (
                <Sk key={i} h={52} />
              ))}
            </div>
          ) : recientes.length === 0 ? (
            <div style={{ padding: "40px 16px", textAlign: "center" }}>
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: 13,
                  color: "#9CA3AF",
                  marginBottom: 12,
                }}
              >
                Aún no tienes proyectos publicados
              </p>
              <Link to="/dashboard/mype/crear">
                <button
                  style={{
                    fontFamily: FONT,
                    padding: "0 16px",
                    height: 34,
                    borderRadius: 8,
                    background: "linear-gradient(135deg,#1B6FE8,#0E54C4)",
                    color: "#fff",
                    border: "none",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Crear mi primer proyecto
                </button>
              </Link>
            </div>
          ) : (
            recientes.map((p, i) => (
              <div
                key={p.id}
                onClick={() => navigate("/dashboard/mype/proyectos")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 16px",
                  cursor: "pointer",
                  borderBottom:
                    i < recientes.length - 1 ? "0.5px solid #F9FAFB" : "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#F9FAFB")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div style={{ minWidth: 0, flex: 1, paddingRight: 12 }}>
                  <p
                    style={{
                      fontFamily: FONT,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#1F2937",
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {p.titulo}
                  </p>
                  <p
                    style={{
                      fontFamily: FONT,
                      fontSize: 11,
                      color: "#9CA3AF",
                      margin: "2px 0 0",
                    }}
                  >
                    {p.fechaLimite
                      ? `Límite: ${new Date(p.fechaLimite).toLocaleDateString("es-PE")}`
                      : "Sin fecha límite"}
                  </p>
                </div>
                <EstadoBadge estado={p.estado} />
              </div>
            ))
          )}
        </div>

        {/* Panel oscuro */}
        <div
          style={{
            background: "linear-gradient(170deg,#081828,#0F2A4A)",
            border: "0.5px solid rgba(27,111,232,0.2)",
            borderRadius: 10,
            padding: 16,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "radial-gradient(circle,#06B6D4,transparent 70%)",
              opacity: 0.1,
              filter: "blur(30px)",
              pointerEvents: "none",
            }}
          />

          <p
            style={{
              fontFamily: FONT,
              fontSize: 10,
              fontWeight: 700,
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              margin: 0,
            }}
          >
            Estado de proyectos
          </p>

          {isLoading ? (
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  height: 28,
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.07)",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))
          ) : proyectos.length === 0 ? (
            <p
              style={{
                fontFamily: FONT,
                fontSize: 12,
                color: "rgba(255,255,255,0.3)",
                textAlign: "center",
              }}
            >
              Sin datos aún
            </p>
          ) : (
            barras.map((b) => (
              <div key={b.label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: FONT,
                    fontSize: 10,
                    color: "rgba(255,255,255,0.45)",
                    marginBottom: 4,
                  }}
                >
                  <span>{b.label}</span>
                  <span style={{ color: "#fff", fontWeight: 700 }}>
                    {b.count}
                  </span>
                </div>
                <div
                  style={{
                    height: 5,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    style={{
                      height: 5,
                      borderRadius: 3,
                      background: b.bar,
                      width:
                        proyectos.length > 0
                          ? `${(b.count / proyectos.length) * 100}%`
                          : "0%",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              </div>
            ))
          )}

          <div
            style={{ height: "0.5px", background: "rgba(255,255,255,0.07)" }}
          />

          <p
            style={{
              fontFamily: FONT,
              fontSize: 10,
              fontWeight: 700,
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              margin: 0,
            }}
          >
            Accesos rápidos
          </p>

          {[
            {
              to: "/dashboard/mype/crear",
              icon: Plus,
              label: "Nuevo proyecto",
              color: "#1B6FE8",
            },
            {
              to: "/dashboard/mype/postulantes",
              icon: Users,
              label: "Revisar postulantes",
              color: "#06B6D4",
            },
          ].map((b) => {
            const Icon = b.icon;
            return (
              <Link key={b.to} to={b.to} style={{ textDecoration: "none" }}>
                <button
                  style={{
                    fontFamily: FONT,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.45)",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid transparent",
                    cursor: "pointer",
                    width: "100%",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                >
                  <Icon size={14} color={b.color} /> {b.label}
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </MypeLayout>
  );
}
