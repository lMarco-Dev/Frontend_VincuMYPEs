import { useRef, useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import { useMisProyectos } from "@/features/proyecto-list-mype/useMisProyectos";
import { usePostulacionesAceptadas } from "@/features/proyecto-postulaciones/usePostulaciones";
import { useEntregables } from "@/features/proyecto-entregables/useEntregables";
import { getEntregablesPorProyecto } from "@/features/proyecto-entregables/entregables.api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Play,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  ExternalLink,
  Calendar,
} from "lucide-react";

const FONT = "'Angro Std', 'Outfit', sans-serif";
const fd = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: d, ease: [0.22, 1, 0.36, 1] },
});

const BADGE_ENTREGABLE = {
  PENDIENTE: {
    label: "Pendiente",
    bg: "#FEF3C7",
    c: "#D97706",
    b: "#FDE68A",
    dot: "#D97706",
  },
  EN_REVISION: {
    label: "En revisión",
    bg: "#EFF6FF",
    c: "#1D4ED8",
    b: "#BFDBFE",
    dot: "#1D4ED8",
  },
  APROBADO: {
    label: "Aprobado",
    bg: "#F0FDF4",
    c: "#15803D",
    b: "#BBF7D0",
    dot: "#15803D",
  },
};

const PROYECTO_COLORS = [
  {
    from: "#1B6FE8",
    to: "#06B6D4",
    accent: "#1B6FE8",
    avatarBg: "#EFF6FF",
    avatarBorder: "#BFDBFE",
    avatarC: "#1D4ED8",
  },
  {
    from: "#7C3AED",
    to: "#A855F7",
    accent: "#7C3AED",
    avatarBg: "#F5F3FF",
    avatarBorder: "#DDD6FE",
    avatarC: "#6D28D9",
  },
  {
    from: "#059669",
    to: "#34D399",
    accent: "#059669",
    avatarBg: "#ECFDF5",
    avatarBorder: "#A7F3D0",
    avatarC: "#065F46",
  },
  {
    from: "#F97316",
    to: "#FB923C",
    accent: "#F97316",
    avatarBg: "#FFF7ED",
    avatarBorder: "#FED7AA",
    avatarC: "#C2410C",
  },
];

// ── Hero banner con canvas de partículas ─────────────────────
function EjecucionHero({ totalActivos, totalEstudiantes, porRevisar }) {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext("2d");
    let W, H, animId;
    const mouse = { x: -999, y: -999 };
    const COLORS = ["rgba(27,111,232,", "rgba(6,182,212,", "rgba(249,115,22,"];

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
        this.size = Math.random() * 1.8 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = Math.random() * 0.5 + 0.2;
      }
      update() {
        const dx = this.x - mouse.x,
          dy = this.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 90) {
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
        ctx.fillStyle = this.color + this.alpha + ")";
        ctx.fill();
      }
    }

    const particles = Array.from({ length: 55 }, () => new Particle());
    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p, i) => {
        p.update();
        p.draw();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x,
            dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 75) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6,182,212,${0.12 * (1 - dist / 75)})`;
            ctx.stroke();
          }
        }
      });
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
      {...fd(0)}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "1.5rem",
        background:
          "linear-gradient(135deg,#0A1628 0%,#0F2A4A 55%,#1E3A5F 100%)",
        padding: "32px 40px",
        marginBottom: 20,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      />
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "radial-gradient(circle,#06B6D4,transparent 70%)",
          opacity: 0.1,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -40,
          left: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "radial-gradient(circle,#F97316,transparent 70%)",
          opacity: 0.08,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(27,111,232,0.3)",
                border: "1px solid rgba(27,111,232,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Play size={16} color="#60A5FA" />
            </div>
            <h1
              style={{
                fontFamily: FONT,
                fontSize: 20,
                fontWeight: 800,
                color: "#fff",
                margin: 0,
                letterSpacing: -0.3,
              }}
            >
              En ejecución
            </h1>
          </div>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 12,
              color: "rgba(255,255,255,0.45)",
              margin: 0,
            }}
          >
            Proyectos activos · Sigue el progreso de tu equipo en tiempo real
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          {[
            { n: totalActivos, lbl: "Proyectos activos", c: "#06B6D4" },
            { n: totalEstudiantes, lbl: "Estudiantes", c: "#F59E0B" },
            { n: porRevisar, lbl: "Por revisar", c: "#F97316" },
          ].map((s) => (
            <div
              key={s.lbl}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 14,
                padding: "12px 18px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 22,
                  fontWeight: 800,
                  color: s.c,
                  lineHeight: 1,
                }}
              >
                {s.n}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginTop: 4,
                }}
              >
                {s.lbl}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Card de proyecto en ejecución ────────────────────────────
function ProyectoCard({ proyecto, colorScheme, delay }) {
  const { postulaciones: estudiantes } = usePostulacionesAceptadas(proyecto.id);
  const { entregables, isLoading } = useEntregables(proyecto.id);

  const pendientes = entregables.filter((e) => e.estado === "PENDIENTE").length;
  const aprobados = entregables.filter((e) => e.estado === "APROBADO").length;
  const progreso =
    entregables.length > 0
      ? Math.round((aprobados / entregables.length) * 100)
      : 0;

  const fechaLimite = proyecto.fechaLimite
    ? new Date(proyecto.fechaLimite).toLocaleDateString("es-PE", {
        day: "numeric",
        month: "short",
      })
    : null;

  return (
    <motion.div
      {...fd(delay)}
      style={{
        background: "#fff",
        border: "0.5px solid #E5E7EB",
        borderRadius: "1rem",
        overflow: "hidden",
        marginBottom: 14,
      }}
    >
      {/* Header del proyecto */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "18px 22px",
          borderBottom: "0.5px solid #F3F4F6",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            flexShrink: 0,
            background: `linear-gradient(135deg,${colorScheme.from},${colorScheme.to})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Play size={18} color="#fff" />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <h2
              style={{
                fontFamily: FONT,
                fontSize: 14,
                fontWeight: 800,
                color: "#0F1F3D",
                margin: 0,
              }}
            >
              {proyecto.titulo}
            </h2>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                background: "#ECFDF5",
                color: "#15803D",
                border: "1px solid #BBF7D0",
                padding: "2px 8px",
                borderRadius: 20,
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              <Play size={8} /> En desarrollo
            </span>
            {pendientes > 0 && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: "#FEF3C7",
                  color: "#D97706",
                  border: "1px solid #FDE68A",
                  padding: "2px 8px",
                  borderRadius: 20,
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                <Clock size={8} /> {pendientes} por revisar
              </span>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: 5,
              flexWrap: "wrap",
            }}
          >
            {[
              {
                icon: Users,
                text: `${estudiantes.length} estudiante${estudiantes.length !== 1 ? "s" : ""}`,
              },
              {
                icon: FileText,
                text: `${entregables.length} entregable${entregables.length !== 1 ? "s" : ""}`,
              },
              ...(fechaLimite
                ? [{ icon: Calendar, text: `Vence ${fechaLimite}` }]
                : []),
            ].map(({ icon: Icon, text }, i, arr) => (
              <span
                key={text}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontFamily: FONT,
                  fontSize: 11,
                  color: "#6B7280",
                }}
              >
                <Icon size={11} />
                {text}
                {i < arr.length - 1 && (
                  <span style={{ marginLeft: 6, color: "#D1D5DB" }}>·</span>
                )}
              </span>
            ))}
          </div>

          {entregables.length > 0 && (
            <div style={{ marginTop: 8, maxWidth: 340 }}>
              <div
                style={{
                  height: 4,
                  borderRadius: 2,
                  background: "#E5E7EB",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    borderRadius: 2,
                    width: `${progreso}%`,
                    background: `linear-gradient(90deg,${colorScheme.from},${colorScheme.to})`,
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 3,
                }}
              >
                <span
                  style={{ fontFamily: FONT, fontSize: 9, color: "#9CA3AF" }}
                >
                  Progreso estimado
                </span>
                <span
                  style={{
                    fontFamily: FONT,
                    fontSize: 9,
                    fontWeight: 700,
                    color: colorScheme.accent,
                  }}
                >
                  {progreso}%
                </span>
              </div>
            </div>
          )}
        </div>

        <Link
          to={`/dashboard/mype/proyectos/${proyecto.id}/entregables`}
          style={{
            fontFamily: FONT,
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 11,
            fontWeight: 700,
            color: colorScheme.accent,
            textDecoration: "none",
            padding: "6px 14px",
            borderRadius: 9,
            flexShrink: 0,
            background: `rgba(${colorScheme.accent === "#1B6FE8" ? "27,111,232" : colorScheme.accent === "#7C3AED" ? "124,58,237" : colorScheme.accent === "#059669" ? "5,150,105" : "249,115,22"},0.07)`,
            border: `1px solid ${colorScheme.from}30`,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          <ExternalLink size={12} /> Ver entregables
        </Link>
      </div>

      {/* Cuerpo: 2 columnas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap: 20,
          padding: "18px 22px",
        }}
      >
        {/* Columna: Equipo */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 12,
            }}
          >
            <Users size={13} color={colorScheme.accent} />
            <span
              style={{
                fontFamily: FONT,
                fontSize: 10,
                fontWeight: 700,
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Equipo confirmado
            </span>
          </div>

          {estudiantes.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "16px",
                background: "#F9FAFB",
                borderRadius: 8,
                border: "1px dashed #E5E7EB",
              }}
            >
              <Users size={18} color="#D1D5DB" style={{ marginBottom: 4 }} />
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: 11,
                  color: "#9CA3AF",
                  margin: 0,
                }}
              >
                Sin estudiantes confirmados
              </p>
            </div>
          ) : (
            estudiantes.map((e) => {
              const iniciales =
                e.estudianteNombre
                  ?.split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase() ?? "E";
              const esDelegado = e.esDelegado === true;
              return (
                <div
                  key={e.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 0",
                    borderBottom: "0.5px solid #F9FAFB",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: esDelegado
                        ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
                        : colorScheme.avatarBg,
                      border: esDelegado
                        ? "2px solid #f59e0b"
                        : `1.5px solid ${colorScheme.avatarBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: FONT,
                      fontSize: 10,
                      fontWeight: 700,
                      color: esDelegado ? "#fff" : colorScheme.avatarC,
                      position: "relative",
                    }}
                  >
                    {iniciales}
                    {esDelegado && (
                      <span
                        style={{
                          position: "absolute",
                          top: -8,
                          right: -4,
                          fontSize: 12,
                        }}
                        title="Delegado del equipo"
                      >
                        👑
                      </span>
                    )}
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: FONT,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#111827",
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {e.estudianteNombre}
                      {esDelegado && (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            background:
                              "linear-gradient(135deg, #fef3c7, #fde68a)",
                            color: "#92400e",
                            padding: "1px 6px",
                            borderRadius: 8,
                            border: "1px solid #fbbf24",
                          }}
                        >
                          Delegado
                        </span>
                      )}
                    </p>
                    <p
                      style={{
                        fontFamily: FONT,
                        fontSize: 10,
                        color: "#9CA3AF",
                        margin: "2px 0 0",
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <CheckCircle2 size={10} color="#15803D" /> Confirmado
                      {esDelegado && (
                        <span style={{ color: "#f59e0b", fontWeight: 600 }}>
                          · Sube entregables
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Columna: Últimos entregables */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FileText size={13} color={colorScheme.accent} />
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Últimos entregables
              </span>
            </div>
            {entregables.length > 3 && (
              <Link
                to={`/dashboard/mype/proyectos/${proyecto.id}/entregables`}
                style={{
                  fontFamily: FONT,
                  fontSize: 10,
                  color: colorScheme.accent,
                  textDecoration: "none",
                }}
              >
                Ver todos ({entregables.length})
              </Link>
            )}
          </div>

          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    height: 36,
                    borderRadius: 8,
                    background: "#F3F4F6",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
              ))}
            </div>
          ) : entregables.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "20px 16px",
                background: "#F9FAFB",
                borderRadius: 8,
                border: "1px dashed #E5E7EB",
              }}
            >
              <Clock size={18} color="#D1D5DB" style={{ marginBottom: 4 }} />
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: 11,
                  color: "#9CA3AF",
                  margin: 0,
                }}
              >
                Sin entregables aún
              </p>
            </div>
          ) : (
            entregables.slice(0, 4).map((ent, i, arr) => {
              const badge =
                BADGE_ENTREGABLE[ent.estado] ?? BADGE_ENTREGABLE.PENDIENTE;
              return (
                <div
                  key={ent.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 0",
                    borderBottom:
                      i < arr.length - 1 ? "0.5px solid #F9FAFB" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: badge.dot,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: FONT,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#111827",
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ent.titulo}
                    </p>
                    <p
                      style={{
                        fontFamily: FONT,
                        fontSize: 10,
                        color: "#9CA3AF",
                        margin: "2px 0 0",
                      }}
                    >
                      {ent.estudianteNombre} ·{" "}
                      {new Date(ent.fechaEntrega).toLocaleDateString("es-PE", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONT,
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 10,
                        background: badge.bg,
                        color: badge.c,
                        border: `1px solid ${badge.b}`,
                      }}
                    >
                      {badge.label}
                    </span>
                    {ent.archivo && (
                      <a
                        href={ent.archivo}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: colorScheme.accent, display: "flex" }}
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Página principal ─────────────────────────────────────────
export function EjecucionPage() {
  const { proyectos, isLoading } = useMisProyectos();
  const enDesarrollo = proyectos.filter((p) => p.estado === "EN_DESARROLLO");
  const totalActivos = enDesarrollo.length;

  // ── Stats reales del hero con useQueries ──────────────────
  // Lanza N fetches en paralelo. Comparte queryKey con ProyectoCard
  // así React Query reutiliza el caché — sin doble petición al backend.
  const entregablesQueries = useQueries({
    queries: enDesarrollo.map((p) => ({
      queryKey: ["entregables", p.id],
      queryFn: () => getEntregablesPorProyecto(p.id),
      enabled: !isLoading && enDesarrollo.length > 0,
      staleTime: 1000 * 30,
    })),
  });

  const todosEntregables = entregablesQueries.flatMap((q) => q.data ?? []);
  const porRevisar = todosEntregables.filter(
    (e) => e.estado === "PENDIENTE",
  ).length;

  // Suma de cupos como aproximación de estudiantes totales
  const totalEstudiantes = enDesarrollo.reduce(
    (acc, p) => acc + (p.cupos ?? 0),
    0,
  );
  // ─────────────────────────────────────────────────────────

  return (
    <MypeLayout titulo="En ejecución">
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
      `}</style>

      <EjecucionHero
        totalActivos={totalActivos}
        totalEstudiantes={totalEstudiantes}
        porRevisar={porRevisar}
      />

      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1, 2].map((i) => (
            <div
              key={i}
              style={{
                height: 200,
                borderRadius: "1rem",
                background: "#E5E7EB",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
      ) : enDesarrollo.length === 0 ? (
        <motion.div
          {...fd(0.1)}
          style={{
            textAlign: "center",
            padding: "60px 24px",
            border: "1px dashed #E5E7EB",
            borderRadius: "1rem",
            background: "#fff",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#F3F4F6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Play size={24} color="#D1D5DB" />
          </div>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 16,
              fontWeight: 800,
              color: "#374151",
              marginBottom: 8,
            }}
          >
            No hay proyectos en ejecución
          </p>
          <p style={{ fontFamily: FONT, fontSize: 13, color: "#9CA3AF" }}>
            Cuando un proyecto complete sus cupos aparecerá aquí automáticamente
          </p>
        </motion.div>
      ) : (
        <>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 12,
              color: "#6B7280",
              marginBottom: 16,
            }}
          >
            {totalActivos} proyecto{totalActivos !== 1 ? "s" : ""} actualmente
            en desarrollo
          </p>
          {enDesarrollo.map((p, i) => (
            <ProyectoCard
              key={p.id}
              proyecto={p}
              colorScheme={PROYECTO_COLORS[i % PROYECTO_COLORS.length]}
              delay={i * 0.06}
            />
          ))}
        </>
      )}
    </MypeLayout>
  );
}
