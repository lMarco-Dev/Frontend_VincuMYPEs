import React, { useRef, useEffect, useState } from "react";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import { useMisProyectos } from "@/features/proyecto-list-mype/useMisProyectos";
import { PROYECTO_ESTADO } from "@/entities/proyecto/proyecto.constants";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CalificacionesPendientesCard from "@/features/calificaciones/CalificacionesPendientesCard";
import {
  FileText,
  Users,
  Play,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Building2,
  Sparkles,
  Search,
} from "lucide-react";

const FONT = "'Angro Std', 'Outfit', sans-serif";

/* ─── Animadores de scroll ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ═══════════════════════════════════════════════
   ESTADO BADGE COMPONENTE (AGREGADO)
═══════════════════════════════════════════════ */
export const EstadoBadge = ({ estado }) => {
  const getEstadoConfig = () => {
    switch (estado) {
      case PROYECTO_ESTADO.PENDIENTE:
        return {
          label: "Pendiente",
          color: "#D97706",
          bg: "#FFFBEB",
          border: "#FDE68A",
        };
      case PROYECTO_ESTADO.EN_DESARROLLO:
        return {
          label: "En Desarrollo",
          color: "#059669",
          bg: "#ECFDF5",
          border: "#BBF7D0",
        };
      case PROYECTO_ESTADO.COMPLETADO:
        return {
          label: "Completado",
          color: "#7C3AED",
          bg: "#F5F3FF",
          border: "#DDD6FE",
        };
      case PROYECTO_ESTADO.BORRADOR:
        return {
          label: "Borrador",
          color: "#6B7280",
          bg: "#F3F4F6",
          border: "#E5E7EB",
        };
      default:
        return {
          label: estado?.replace("_", " ") || "Desconocido",
          color: "#6B7280",
          bg: "#F3F4F6",
          border: "#E5E7EB",
        };
    }
  };

  const config = getEstadoConfig();

  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: config.color,
        background: config.bg,
        border: `1px solid ${config.border}`,
        padding: "2px 8px",
        borderRadius: 6,
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {config.label}
    </span>
  );
};

/* ═══════════════════════════════════════════════
   HERO BANNER ANIMADO PARA MYPE (Canvas + Framer)
═══════════════════════════════════════════════ */
const MypeHeroBanner = ({ proyectosActivos, totalProyectos }) => {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext("2d");
    let W, H, animId;
    const mouse = { x: -999, y: -999 };
    // Colores corporativos MYPE: Naranja, Cian, Azul profundo
    const COLORS = ["rgba(245,158,11,", "rgba(6,182,212,", "rgba(27,111,232,"];

    const resize = () => {
      W = canvas.width = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(hero);

    hero.addEventListener("mousemove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    hero.addEventListener("mouseleave", () => {
      mouse.x = -999;
      mouse.y = -999;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
      update() {
        // Interacción con el mouse
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          this.x += dx * 0.02;
          this.y += dy * 0.02;
        }
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > W) this.speedX *= -1;
        if (this.y < 0 || this.y > H) this.speedY *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + "0.6)";
        ctx.fill();
      }
    }

    const particles = Array.from({ length: 60 }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(245,158,11,${0.15 * (1 - dist / 80)})`;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <motion.div
      ref={heroRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "2rem",
        background:
          "linear-gradient(135deg, #0A1628 0%, #0F2A4A 60%, #1E3A5F 100%)",
        padding: "40px 48px",
        color: "#fff",
        marginBottom: 24,
        minHeight: 220,
        display: "flex",
        alignItems: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      {/* Luces Ambientales */}
      <div
        style={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "radial-gradient(circle, #F59E0B, transparent 70%)",
          opacity: 0.15,
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -50,
          left: 100,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, #06B6D4, transparent 70%)",
          opacity: 0.1,
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div style={{ maxWidth: 500 }}>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 20,
              padding: "6px 14px",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#fff",
              marginBottom: 16,
              backdropFilter: "blur(8px)",
            }}
          >
            <Sparkles size={12} className="text-amber-400" /> Modo Empresa
          </motion.div>
          <h1
            style={{
              fontSize: "clamp(26px, 3vw, 36px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 12,
            }}
          >
            Impulsa tu negocio con{" "}
            <span style={{ color: "#06B6D4" }}>talento joven</span>
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.6,
              margin: 0,
              fontWeight: 400,
            }}
          >
            Publica requerimientos, recibe soluciones tecnológicas y gestiona a
            tus postulantes desde un solo lugar.
          </p>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
              padding: "16px 24px",
              textAlign: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#F59E0B",
                lineHeight: 1,
              }}
            >
              {proyectosActivos}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginTop: 4,
                fontWeight: 600,
              }}
            >
              Proyectos Activos
            </div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
              padding: "16px 24px",
              textAlign: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#06B6D4",
                lineHeight: 1,
              }}
            >
              {totalProyectos}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginTop: 4,
                fontWeight: 600,
              }}
            >
              Total Creados
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   TARJETAS DE MÉTRICAS BENTO
═══════════════════════════════════════════════ */
const MypeMetricCard = ({
  label,
  value,
  sub,
  color,
  bg,
  border,
  icon: Icon,
  delay,
}) => (
  <motion.div
    {...fadeUp(delay)}
    style={{
      background: "#fff",
      border: "1px solid #E5E7EB",
      borderRadius: "1.5rem",
      padding: 24,
      display: "flex",
      alignItems: "center",
      gap: 16,
      transition: "all 0.3s ease",
      cursor: "default",
      position: "relative",
      overflow: "hidden",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.06)";
      e.currentTarget.style.borderColor = border;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.borderColor = "#E5E7EB";
    }}
  >
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: "1.2rem",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon size={26} color={color} />
    </div>
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "#9CA3AF",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: "#0F1F3D",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#6B7280",
            marginTop: 4,
          }}
        >
          {sub}
        </div>
      )}
    </div>
    <div
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 80,
        height: 80,
        background: bg,
        borderRadius: "50%",
        filter: "blur(30px)",
        opacity: 0.5,
        pointerEvents: "none",
      }}
    />
  </motion.div>
);

/* ═══════════════════════════════════════════════
   COMPONENTE PRINCIPAL MYPE DASHBOARD
═══════════════════════════════════════════════ */
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

  return (
    <MypeLayout titulo="Dashboard Empresarial">
      <div style={{ fontFamily: FONT, maxWidth: 1200, margin: "0 auto" }}>
        <MypeHeroBanner
          proyectosActivos={enDesarrollo + pendientes}
          totalProyectos={proyectos.length}
        />

        {/* Bento Grid: Métricas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            marginBottom: 32,
          }}
        >
          <MypeMetricCard
            delay={0.1}
            label="Total Proyectos"
            value={proyectos.length}
            sub={`${borradores} en borrador`}
            icon={FileText}
            bg="#EFF6FF"
            color="#1B6FE8"
            border="#BFDBFE"
          />
          <MypeMetricCard
            delay={0.15}
            label="Publicados"
            value={pendientes}
            sub="Esperando postulantes"
            icon={Users}
            bg="#F0FDF4"
            color="#059669"
            border="#BBF7D0"
          />
          <MypeMetricCard
            delay={0.2}
            label="En Desarrollo"
            value={enDesarrollo}
            sub="Trabajando actualmente"
            icon={Play}
            bg="#FFFBEB"
            color="#D97706"
            border="#FDE68A"
          />
          <MypeMetricCard
            delay={0.25}
            label="Completados"
            value={completados}
            sub="Soluciones entregadas"
            icon={CheckCircle}
            bg="#F5F3FF"
            color="#7C3AED"
            border="#DDD6FE"
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* Proyectos Recientes */}
          <motion.div
            {...fadeUp(0.3)}
            style={{
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: "2rem",
              padding: 28,
              boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 4,
                    height: 20,
                    background: "#F59E0B",
                    borderRadius: 4,
                  }}
                />
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#0F1F3D",
                    margin: 0,
                  }}
                >
                  Proyectos Recientes
                </h2>
              </div>
              <Link
                to="/dashboard/mype/proyectos"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1B6FE8",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                Ver todos <ArrowRight size={14} />
              </Link>
            </div>

            {isLoading ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      height: 64,
                      background: "#F3F4F6",
                      borderRadius: 16,
                      animation: "pulse 1.5s infinite",
                    }}
                  />
                ))}
              </div>
            ) : recientes.length === 0 ? (
              <div
                style={{
                  padding: "40px 20px",
                  textAlign: "center",
                  border: "1px dashed #D1D5DB",
                  borderRadius: 20,
                  background: "#F9FAFB",
                }}
              >
                <Search
                  size={32}
                  color="#9CA3AF"
                  style={{ margin: "0 auto 12px" }}
                />
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#4B5563",
                    marginBottom: 16,
                  }}
                >
                  Aún no tienes proyectos creados
                </p>
                <Link to="/dashboard/mype/crear">
                  <button
                    style={{
                      padding: "10px 24px",
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #1B6FE8, #06B6D4)",
                      color: "#fff",
                      border: "none",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Publicar mi primer proyecto
                  </button>
                </Link>
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {recientes.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigate("/dashboard/mype/proyectos")}
                    style={{
                      padding: 16,
                      borderRadius: 16,
                      border: "1px solid #F3F4F6",
                      background: "#FAFAFA",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#BFDBFE";
                      e.currentTarget.style.background = "#EFF6FF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#F3F4F6";
                      e.currentTarget.style.background = "#FAFAFA";
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 14 }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 12,
                          background: "#fff",
                          border: "1px solid #E5E7EB",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#1B6FE8",
                        }}
                      >
                        <Building2 size={20} />
                      </div>
                      <div>
                        <h4
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#0F1F3D",
                            margin: "0 0 4px",
                          }}
                        >
                          {p.titulo}
                        </h4>
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "#6B7280",
                            }}
                          >
                            {p.fechaLimite
                              ? `Vence: ${new Date(p.fechaLimite).toLocaleDateString("es-PE")}`
                              : "Sin límite"}
                          </span>
                          <span
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: "50%",
                              background: "#D1D5DB",
                            }}
                          />
                          <EstadoBadge estado={p.estado} />
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={18} color="#9CA3AF" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Panel Lateral: Accesos y Resumen */}
          <motion.div
            {...fadeUp(0.4)}
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            {/* Acciones Rápidas */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: "2rem",
                padding: 24,
                boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
              }}
            >
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#0F1F3D",
                  marginBottom: 16,
                }}
              >
                Accesos Rápidos
              </h3>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <Link
                  to="/dashboard/mype/crear"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      padding: 14,
                      borderRadius: 16,
                      background: "#EFF6FF",
                      border: "1px solid #BFDBFE",
                      color: "#1B6FE8",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      fontWeight: 700,
                      fontSize: 13,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-2px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Play size={16} />
                    </div>{" "}
                    Publicar Nuevo Proyecto
                  </div>
                </Link>
                <Link
                  to="/dashboard/mype/postulantes"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      padding: 14,
                      borderRadius: 16,
                      background: "#FFFBEB",
                      border: "1px solid #FDE68A",
                      color: "#D97706",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      fontWeight: 700,
                      fontSize: 13,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-2px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Users size={16} />
                    </div>{" "}
                    Evaluar Postulantes
                  </div>
                </Link>
              </div>
            </div>

            {/* Resumen Gráfico */}
            <div
              style={{
                background: "linear-gradient(145deg, #0A1628, #1E3A5F)",
                borderRadius: "2rem",
                padding: 28,
                color: "#fff",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -30,
                  right: -30,
                  width: 100,
                  height: 100,
                  background: "rgba(6,182,212,0.2)",
                  borderRadius: "50%",
                  filter: "blur(20px)",
                }}
              />
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.7)",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: 20,
                }}
              >
                Rendimiento
              </h3>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {[
                  {
                    label: "Tasa de respuesta",
                    value: "85%",
                    color: "#4ade80",
                  },
                  {
                    label: "Proyectos llenos",
                    value: "3 de 5",
                    color: "#60a5fa",
                  },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.9)",
                        marginBottom: 6,
                      }}
                    >
                      <span>{item.label}</span>
                      <span style={{ color: item.color }}>{item.value}</span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: 6,
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: item.value.includes("%") ? item.value : "60%",
                          height: "100%",
                          background: item.color,
                          borderRadius: 4,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MypeLayout>
  );
}
