import { useMisProyectos } from "@/features/proyecto-list-mype/useMisProyectos";
import { PROYECTO_ESTADO } from "@/entities/proyecto/proyecto.constants";
import { Link, useNavigate } from "react-router-dom";
import { CalificacionesPendientesCard } from "@/features/calificaciones/CalificacionesPendientesCard";
import { motion } from "framer-motion";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Users,
  Play,
  CheckCircle,
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  Building2,
  Sparkles,
  Search,
  Activity,
  Clock,
  Layers,
  Zap,
  AlertTriangle,
  Inbox,
  ShieldCheck,
  Radio,
  ChevronRight,
} from "lucide-react";

const FONT = "'Angro Std', 'Outfit', sans-serif";

/* ─── Paleta corporativa (SIN CAMBIOS) ─── */
const C = {
  ink: "#0F1F3D",
  navyDeep: "#0A1628",
  navyMid: "#0F2A4A",
  navySoft: "#1E3A5F",
  blue: "#1B6FE8",
  cyan: "#06B6D4",
  amber: "#F59E0B",
  amberText: "#D97706",
  green: "#059669",
  violet: "#7C3AED",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  border: "#E5E7EB",
  surface: "#FFFFFF",
  canvas: "#F7F8FA",
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ═══════════════════════════════════════════════
   HOOK: Contador animado (sensación "viva")
═══════════════════════════════════════════════ */
const useCountUp = (target, duration = 1100) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
};

/* ═══════════════════════════════════════════════
   ESTADO BADGE (lógica intacta)
═══════════════════════════════════════════════ */
export const EstadoBadge = ({ estado }) => {
  const getEstadoConfig = () => {
    switch (estado) {
      case PROYECTO_ESTADO.PENDIENTE:
        return { label: "Pendiente", color: C.amberText, bg: "#FFFBEB", border: "#FDE68A", dot: C.amber };
      case PROYECTO_ESTADO.EN_DESARROLLO:
        return { label: "En Desarrollo", color: C.green, bg: "#ECFDF5", border: "#BBF7D0", dot: "#10B981" };
      case PROYECTO_ESTADO.COMPLETADO:
        return { label: "Completado", color: C.violet, bg: "#F5F3FF", border: "#DDD6FE", dot: "#8B5CF6" };
      case PROYECTO_ESTADO.BORRADOR:
        return { label: "Borrador", color: C.gray500, bg: "#F3F4F6", border: C.border, dot: "#9CA3AF" };
      default:
        return {
          label: estado?.replace("_", " ") || "Desconocido",
          color: C.gray500,
          bg: "#F3F4F6",
          border: C.border,
          dot: "#9CA3AF",
        };
    }
  };
  const cfg = getEstadoConfig();
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
       padding: "3px 9px 3px 7px", 
        borderRadius: 999,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        whiteSpace: "nowrap",
      }}
    >
      
      {cfg.label}
    </span>
  );
};

/* ═══════════════════════════════════════════════
   COMMAND HEADER (canvas + Health Score, sin botones duplicados)
═══════════════════════════════════════════════ */
const CommandHeader = ({ healthScore, totalProyectos, activos, completados }) => {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const animatedScore = useCountUp(healthScore, 1400);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext("2d");
    let W, H, animId;
    const mouse = { x: -999, y: -999 };
    const COLORS = ["rgba(245,158,11,", "rgba(6,182,212,", "rgba(27,111,232,"];

    const resize = () => {
      W = canvas.width = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(hero);

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -999;
      mouse.y = -999;
    };
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);

    class Particle {
      constructor() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.45;
        this.speedY = (Math.random() - 0.5) * 0.45;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
      update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          this.x += dx * 0.025;
          this.y += dy * 0.025;
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

    const particles = Array.from({ length: 70 }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 95) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6,182,212,${0.14 * (1 - dist / 95)})`;
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
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const MiniContext = ({ value, label }) => {
    const v = useCountUp(value);
    return (
      <div style={{ textAlign: "center", minWidth: 72 }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{v}</div>
        <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 6, fontWeight: 600 }}>
          {label}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      ref={heroRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 24,
        background: `linear-gradient(135deg, ${C.navyDeep} 0%, ${C.navyMid} 55%, ${C.navySoft} 100%)`,
        padding: "38px 48px",
        color: "#fff",
        boxShadow: "0 24px 48px -28px rgba(10,22,40,0.7)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
      
      <div
        style={{
          position: "absolute",
          top: -60,
          right: 180,
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.cyan}, transparent 70%)`,
          opacity: 0.13,
          filter: "blur(45px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 32,
        }}
      >
        {/* LADO IZQUIERDO: Título y descripción */}
        <div style={{ maxWidth: 560 }}>
          <div style={{ height: 8 }} />

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ 
              fontSize: "clamp(26px, 3.2vw, 38px)", 
              fontWeight: 800, 
              lineHeight: 1.15, 
              letterSpacing: "-0.025em", 
              margin: "0 0 14px",
            }}
          >
            <span style={{ color: "#fff" }}>Impulsa </span>
            <motion.span
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ 
                background: "linear-gradient(135deg, #10B981 0%, #34D399 40%, #6EE7B7 70%, #10B981 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
              }}
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
              }}
            >
              tu negocio
            </motion.span>
            <span style={{ color: "#fff" }}> con </span>
            <motion.span
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ 
                background: "linear-gradient(135deg, #06B6D4 0%, #22D3EE 40%, #67E8F9 70%, #06B6D4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
              }}
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
              }}
            >
              talento joven
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ 
              fontSize: 15, 
              color: "rgba(255,255,255,0.55)", 
              lineHeight: 1.5, 
              margin: 0, 
              fontWeight: 400,
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
            }}
          >
            Gestiona tus proyectos, entregables y postulaciones desde un solo lugar.
          </motion.p>
        </div>

        {/* LADO DERECHO: Total, Activos, Completados */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 36,
          flexShrink: 0,
        }}>
          <MiniContext value={totalProyectos} label="Total" />
          <MiniContext value={activos} label="Activos" />
          <MiniContext value={completados} label="Completados" />
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   PANEL BASE reutilizable (microinteracción hover)
═══════════════════════════════════════════════ */
const Panel = ({ children, delay = 0, dark = false, style = {} }) => (
  <motion.section
    {...fadeUp(delay)}
    transition={{ duration: 0.25 }}
    style={{
      background: dark ? `linear-gradient(145deg, ${C.navyDeep}, ${C.navySoft})` : C.surface,
      border: dark ? "1px solid rgba(255,255,255,0.06)" : `1px solid ${C.border}`,
      borderRadius: 22,
      padding: 24,
      color: dark ? "#fff" : C.ink,
      boxShadow: dark ? "0 16px 32px -22px rgba(10,22,40,0.7)" : "0 8px 24px -18px rgba(15,31,61,0.14)",
      position: "relative",
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </motion.section>
);

const PanelTitle = ({ children, action }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
    <h2 style={{ fontSize: 15.5, fontWeight: 800, margin: 0, color: "inherit", letterSpacing: "-0.01em" }}>{children}</h2>
    {action}
  </div>
);

/* ═══════════════════════════════════════════════
   DONUT (Salud de proyectos — única fuente de distribución)
═══════════════════════════════════════════════ */
const DonutChart = ({ segments, total, size = 150, stroke = 17 }) => {
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const circ = 2 * Math.PI * r;
  const animatedTotal = useCountUp(total);
  let offset = 0;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="#EEF1F5" strokeWidth={stroke} />
        {total > 0 &&
          segments.map((s, i) => {
            const len = (s.value / total) * circ;
            const seg = (
              <motion.circle
                key={i}
                cx={cx}
                cy={cx}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${len} ${circ - len}`}
                initial={{ strokeDashoffset: -circ }}
                animate={{ strokeDashoffset: -offset }}
                transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              />
            );
            offset += len;
            return seg;
          })}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 32, fontWeight: 800, color: C.ink, lineHeight: 1, letterSpacing: "-0.03em" }}>{animatedTotal}</span>
        <span style={{ fontSize: 9.5, fontWeight: 700, color: C.gray400, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 3 }}>Proyectos</span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   PROGRESS RING
═══════════════════════════════════════════════ */
const ProgressRing = ({ percent, color, label, value, size = 92, stroke = 8 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 9 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Fondo suave (sutil, sin degradado) */}
          <circle 
            cx={size / 2} 
            cy={size / 2} 
            r={r} 
            fill="none" 
            stroke="rgba(255,255,255,0.08)" 
            strokeWidth={stroke} 
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ - dash}`}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{value}</span>
        </div>
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", textAlign: "center" }}>{label}</span>
    </div>
  );
};

/* ─── Acceso rápido ─── */
const QuickAction = ({ to, icon: Icon, label, bg, border, color }) => (
  <Link to={to} style={{ textDecoration: "none" }}>
    <motion.div
      whileHover={{ x: 3 }}
      style={{
        padding: 12,
        borderRadius: 13,
        background: bg,
        border: `1px solid ${border}`,
        color,
        display: "flex",
        alignItems: "center",
        gap: 11,
        fontWeight: 700,
        fontSize: 13,
      }}
    >
      <div style={{ width: 30, height: 30, borderRadius: 9, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={15} />
      </div>
      {label}
      <ArrowUpRight size={15} style={{ marginLeft: "auto", opacity: 0.55 }} />
    </motion.div>
  </Link>
);

/* ─── Fila de postulaciones (flujo, no duplica estados) ─── */
const FlowRow = ({ label, value, color, max }) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.gray600 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: C.ink }}>{value}</span>
      </div>
      <div style={{ height: 6, background: "#EEF1F5", borderRadius: 999, overflow: "hidden" }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }} style={{ height: "100%", background: color, borderRadius: 999 }} />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   COMPONENTE PRINCIPAL (lógica de datos intacta)
═══════════════════════════════════════════════ */
export function MypeDashboardPage() {
  const { proyectos, isLoading } = useMisProyectos();
  const navigate = useNavigate();

  const pendientes = proyectos.filter((p) => p.estado === PROYECTO_ESTADO.PENDIENTE).length;
  const enDesarrollo = proyectos.filter((p) => p.estado === PROYECTO_ESTADO.EN_DESARROLLO).length;
  const completados = proyectos.filter((p) => p.estado === PROYECTO_ESTADO.COMPLETADO).length;
  const borradores = proyectos.filter((p) => p.estado === PROYECTO_ESTADO.BORRADOR).length;

  const recientes = [...proyectos]
    .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
    .slice(0, 5);

  const totalProyectos = proyectos.length;

  /* Derivados de visualización (no alteran lógica de negocio) */
  const segments = [
    { label: "Publicados", value: pendientes, color: C.amber },
    { label: "En Desarrollo", value: enDesarrollo, color: "#10B981" },
    { label: "Completados", value: completados, color: "#8B5CF6" },
    { label: "Borradores", value: borradores, color: "#9CA3AF" },
  ];
  const completadosPct = totalProyectos > 0 ? Math.round((completados / totalProyectos) * 100) : 0;
  const healthScore =
    totalProyectos === 0
      ? 0
      : Math.min(100, Math.round(((completados * 1 + enDesarrollo * 0.8 + pendientes * 0.6) / totalProyectos) * 100));
    

  /* Alertas y riesgos derivados */
  const hoy = new Date();
  const porVencer = proyectos.filter((p) => {
    if (!p.fechaLimite || p.estado === PROYECTO_ESTADO.COMPLETADO) return false;
    const dias = (new Date(p.fechaLimite) - hoy) / (1000 * 60 * 60 * 24);
    return dias >= 0 && dias <= 7;
  });

  const alertas = [
    porVencer.length > 0 && {
      titulo: `${porVencer.length} proyecto${porVencer.length > 1 ? "s" : ""} por vencer`,
      sub: "Vencen en los próximos 7 días",
      color: "#DC2626",
      bg: "#FEF2F2",
      to: "/dashboard/mype/proyectos",
    },
    borradores > 0 && {
      titulo: `${borradores} borrador${borradores > 1 ? "es" : ""} sin publicar`,
      sub: "Termina de configurarlos y publícalos",
      color: C.amberText,
      bg: "#FFFBEB",
      to: "/dashboard/mype/proyectos",
    },
    pendientes > 0 && {
      titulo: `${pendientes} esperando postulantes`,
      sub: "Revisa y promociona estos proyectos",
      color: C.blue,
      bg: "#EFF6FF",
      to: "/dashboard/mype/postulantes",
    },
  ].filter(Boolean);

  const maxFlow = Math.max(pendientes, enDesarrollo, completados, 1);

  return (
    <MypeLayout titulo="Dashboard Empresarial">
      <style>{`
        @keyframes vping { 75%, 100% { transform: scale(2.4); opacity: 0; } }
        @keyframes vpulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        @keyframes vshimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      `}</style>

      <div style={{ fontFamily: FONT, maxWidth: 1320, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* ─── COMMAND HEADER ─── */}
        <CommandHeader healthScore={healthScore} totalProyectos={totalProyectos} activos={enDesarrollo + pendientes} completados={completados} />

        {/* ─── FILA ESTRATÉGICA: Salud · Rendimiento · Alertas ─── */}
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.9fr 1fr", gap: 20, alignItems: "stretch" }}>
          {/* Salud de proyectos */}
          <Panel delay={0.1}>
            <PanelTitle>Salud de Proyectos</PanelTitle>
            <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
              <DonutChart segments={segments} total={totalProyectos} />
              <div style={{ flex: 1, minWidth: 150, display: "flex", flexDirection: "column", gap: 11 }}>
                {segments.map((s, i) => {
                  const pct = totalProyectos > 0 ? Math.round((s.value / totalProyectos) * 100) : 0;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <span style={{ width: 9, height: 9, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: C.gray600, flex: 1 }}>{s.label}</span>
                      <span style={{ fontSize: 12.5, fontWeight: 800, color: C.ink }}>{s.value}</span>
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: C.gray400, minWidth: 30, textAlign: "right" }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Panel>

          {/* Rendimiento (dark) */}
          <Panel delay={0.15} dark>
            <div style={{ position: "absolute", top: -30, right: -30, width: 110, height: 110, background: "rgba(6,182,212,0.2)", borderRadius: "50%", filter: "blur(24px)" }} />
            <PanelTitle>
              <span style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontSize: 13 }}>Rendimiento</span>
            </PanelTitle>
            <div style={{ display: "flex", justifyContent: "space-around", position: "relative", zIndex: 2, marginTop: 6 }}>
              <ProgressRing 
                percent={totalProyectos > 0 ? Math.round(((pendientes + enDesarrollo + completados) / totalProyectos) * 100) : 0} 
                color="#4ade80" 
                label="Tasa de respuesta" 
                value={`${totalProyectos > 0 ? Math.round(((pendientes + enDesarrollo + completados) / totalProyectos) * 100) : 0}%`} 
              />
              <ProgressRing percent={completadosPct} color="#60a5fa" label="Tasa de entrega" value={`${completadosPct}%`} />
            </div>
          </Panel>

          {/* Alertas y riesgos */}
          <Panel delay={0.2}>
            <PanelTitle>Alertas y Riesgos</PanelTitle>
            {alertas.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 10px", gap: 10, height: "calc(100% - 36px)" }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ShieldCheck size={22} color={C.green} />
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.gray600, margin: 0, textAlign: "center" }}>Todo en orden</p>
                <p style={{ fontSize: 11.5, color: C.gray400, margin: 0, textAlign: "center" }}>No hay riesgos pendientes por ahora.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {alertas.map((a, i) => (
                  <Link key={i} to={a.to} style={{ textDecoration: "none" }}>
                    <motion.div
                      whileHover={{ x: 3 }}
                      style={{
                        padding: "12px 14px",
                        borderRadius: 12,
                        background: a.bg,
                        border: `1px solid ${a.color}18`,
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, lineHeight: 1.3 }}>{a.titulo}</div>
                      <div style={{ fontSize: 11.5, color: C.gray500, marginTop: 3 }}>{a.sub}</div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </Panel>
        </div>

        {/* ─── FILA INFERIOR: Timeline + Gestión ─── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, alignItems: "start" }}>
          {/* Actividad reciente (timeline) */}
          <Panel delay={0.25} style={{ padding: 26 }}>
            <PanelTitle
              action={
                <Link to="/dashboard/mype/proyectos" style={{ fontSize: 13, fontWeight: 700, color: C.blue, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                  Ver todos <ArrowRight size={14} />
                </Link>
              }
            >
              Actividad Reciente
            </PanelTitle>

           {isLoading ? (
  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    {[1, 2, 3].map((i) => (
      <div key={i} style={{ height: 62, background: "#F3F4F6", borderRadius: 14, animation: "vpulse 1.5s infinite" }} />
    ))}
  </div>
      ) : recientes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 32px", border: "1px dashed #CBD5E1", borderRadius: "16px", background: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Search size={40} color="#CBD5E1" strokeWidth={1} style={{ marginBottom: 16 }} />
          <h3 style={{ margin: "0 0 6px 0", fontFamily: FONT, fontSize: 16, fontWeight: 500, color: "#0F1F3D" }}>
            Sin proyectos creados
          </h3>
          <p style={{ margin: "0 0 20px 0", fontFamily: FONT, fontSize: 13, color: "#64748B", maxWidth: 380, lineHeight: 1.5 }}>
            Publica tu primer proyecto para comenzar a recibir postulantes.
          </p>
          <Link to="/dashboard/mype/crear">
            <button
              style={{
                fontFamily: FONT,
                background: "#1B6FE8",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                padding: "10px 22px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#0F172A";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#1B6FE8";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Publicar mi primer proyecto
              <ArrowRight size={12} />
            </button>
          </Link>
        </div>
      ) : (
              <div style={{ position: "relative", paddingLeft: 0 }}>  {/* ← paddingLeft cambiado a 0 */}
                {/* ELIMINADO: <div style={{ position: "absolute", left: 19, top: 8, bottom: 8, width: 1.5, background: "#E5E7EB" }} /> */}
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {recientes.map((p, idx) => (
                    <motion.div
                      key={p.id}
                      {...fadeUp(0.3 + idx * 0.06)}
                      onClick={() => navigate("/dashboard/mype/proyectos")}
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        padding: "10px 14px",
                        borderRadius: 12,
                        cursor: "pointer",
                        transition: "background 0.15s ease",
                        background: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#F7F8FA";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                     

                      {/* Contenido */}
                      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: C.gray500, flexShrink: 0 }}>
                            <Building2 size={17} />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <h4 style={{ fontSize: 13, fontWeight: 600, color: C.ink, margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {p.titulo}
                            </h4>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 500, color: C.gray400 }}>
                              <Clock size={11} />
                              {p.fechaLimite ? `Vence: ${new Date(p.fechaLimite).toLocaleDateString("es-PE")}` : "Sin límite"}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                          <EstadoBadge estado={p.estado} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </Panel>

          {/* Columna de gestión */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Estado de postulaciones (flujo, info nueva) */}
            <Panel delay={0.3}>
              <PanelTitle>Estado de Postulaciones</PanelTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <FlowRow label="Esperando postulantes" value={pendientes} color={C.amber} max={maxFlow} />
                <FlowRow label="En desarrollo activo" value={enDesarrollo} color={C.green} max={maxFlow} />
                <FlowRow label="Soluciones entregadas" value={completados} color={C.violet} max={maxFlow} />
              </div>
            </Panel>

           {/* Accesos rápidos (única ubicación de acciones) */}
            <Panel delay={0.35}>
              <PanelTitle>Accesos Rápidos</PanelTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                
                {/* Botón Blanco - hover se oscurece a gris plomo */}
                <Link to="/dashboard/mype/crear" style={{ textDecoration: "none" }}>
                  <motion.div
                    whileHover={{ x: 3 }}
                    style={{
                      padding: 12,
                      borderRadius: 13,
                      background: "#FFFFFF",
                      border: "1px solid #D1D5DB",
                      color: "#0F1F3D",
                      display: "flex",
                      alignItems: "center",
                      gap: 11,
                      fontWeight: 700,
                      fontSize: 13,
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#F3F4F6";
                      e.currentTarget.style.borderColor = "#9CA3AF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#FFFFFF";
                      e.currentTarget.style.borderColor = "#D1D5DB";
                    }}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Play size={15} color="#0F1F3D" />
                    </div>
                    Publicar Nuevo Proyecto
                    <ArrowUpRight size={15} style={{ marginLeft: "auto", opacity: 0.55 }} />
                  </motion.div>
                </Link>

                {/* Botón Gris Plomo más intenso */}
                <Link to="/dashboard/mype/postulantes" style={{ textDecoration: "none" }}>
                  <motion.div
                    whileHover={{ x: 3 }}
                    style={{
                      padding: 12,
                      borderRadius: 13,
                      background: "#F3F4F6",
                      border: "1px solid #D1D5DB",
                      color: "#374151",
                      display: "flex",
                      alignItems: "center",
                      gap: 11,
                      fontWeight: 700,
                      fontSize: 13,
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#E5E7EB";
                      e.currentTarget.style.borderColor = "#9CA3AF";
                      e.currentTarget.style.color = "#0F1F3D";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#F3F4F6";
                      e.currentTarget.style.borderColor = "#D1D5DB";
                      e.currentTarget.style.color = "#374151";
                    }}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Users size={15} color="#374151" />
                    </div>
                    Evaluar Postulantes
                    <ArrowUpRight size={15} style={{ marginLeft: "auto", opacity: 0.55 }} />
                  </motion.div>
                </Link>

              </div>
            </Panel>

            {/* Calificaciones pendientes (original preservado) */}
            <CalificacionesPendientesCard />
          </div>
        </div>
      </div>
    </MypeLayout>
  );
}