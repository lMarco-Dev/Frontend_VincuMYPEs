// src/pages/admin/AdminDashboardPage.jsx
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  Rocket,
  Star,
  History,
  TrendingUp,
  Laptop,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Activity,
  Award,
  BarChart4,
  Zap,
  ChevronRight,
  Calendar,
  UserCheck,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { useAdminReportes } from "@features/admin/useAdminReportes";

const FONT = "'Angro Std', 'Outfit', sans-serif";

// ─── Animaciones ───
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

const fadeScale = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] },
});

// ─── Hero Banner con Canvas de Partículas ─────────────────────────────────
const AdminDashboardHero = () => {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext("2d");
    let W, H, animId;
    const mouse = { x: -999, y: -999 };
    const COLORS = ["rgba(27,111,232,", "rgba(6,182,212,", "rgba(124,58,237,"];

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
        this.size = Math.random() * 2 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = Math.random() * 0.5 + 0.2;
      }
      update() {
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
        ctx.fillStyle = this.color + this.alpha + ")";
        ctx.fill();
      }
    }

    const particles = Array.from({ length: 55 }, () => new Particle());

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
            ctx.strokeStyle = `rgba(124,58,237,${0.12 * (1 - dist / 80)})`;
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
      {...fadeUp(0)}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "2rem",
        background:
          "linear-gradient(135deg, #0A1628 0%, #0F2A4A 60%, #1E3A5F 100%)",
        padding: "40px 48px",
        color: "#fff",
        marginBottom: 28,
        minHeight: 200,
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
          background: "radial-gradient(circle, #A855F7, transparent 70%)",
          opacity: 0.12,
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
        <div style={{ maxWidth: 550 }}>
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
            <ShieldCheck size={12} style={{ color: "#A855F7" }} /> Panel de
            Control
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
            Bienvenido,{" "}
            <span style={{ color: "#A855F7" }}>Super Administrador</span>
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
            Monitoreo operativo del ecosistema Linkuy. Control de vinculaciones,
            métricas de rendimiento y auditoría de la plataforma.
          </p>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
              padding: "12px 20px",
              textAlign: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            <Activity size={24} style={{ color: "#06B6D4", marginBottom: 4 }} />
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Plataforma Activa
            </div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
              padding: "12px 20px",
              textAlign: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            <Calendar size={24} style={{ color: "#F59E0B", marginBottom: 4 }} />
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {new Date().toLocaleDateString("es-PE", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Tarjeta de Métrica Premium ─────────────────────────────────────────
const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
  delay,
}) => {
  const colors = {
    blue: {
      bg: "#EFF6FF",
      icon: "#1B6FE8",
      border: "#BFDBFE",
      glow: "rgba(27,111,232,0.15)",
    },
    green: {
      bg: "#ECFDF5",
      icon: "#059669",
      border: "#A7F3D0",
      glow: "rgba(5,150,105,0.15)",
    },
    purple: {
      bg: "#F5F3FF",
      icon: "#7C3AED",
      border: "#DDD6FE",
      glow: "rgba(124,58,237,0.15)",
    },
    orange: {
      bg: "#FFFBEB",
      icon: "#D97706",
      border: "#FDE68A",
      glow: "rgba(217,119,6,0.15)",
    },
    cyan: {
      bg: "#EFF6FF",
      icon: "#0891B2",
      border: "#A5F3FC",
      glow: "rgba(8,145,178,0.15)",
    },
  };
  const c = colors[color] || colors.blue;

  return (
    <motion.div
      {...fadeScale(delay)}
      style={{
        background: "#fff",
        border: `1px solid ${c.border}`,
        borderRadius: "1.5rem",
        padding: "20px",
        transition: "all 0.3s ease",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
      whileHover={{
        y: -4,
        boxShadow: `0 20px 25px -12px ${c.glow}`,
        borderColor: c.icon,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${c.icon}15, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "1rem",
            background: c.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={24} style={{ color: c.icon }} />
        </div>
        {trend && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              fontWeight: 600,
              color: trend.up ? "#059669" : "#DC2626",
              background: trend.up ? "#ECFDF5" : "#FEF2F2",
              padding: "4px 8px",
              borderRadius: 20,
            }}
          >
            <TrendingUp size={12} />
            {trend.value}%
          </div>
        )}
      </div>
      <div>
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#9CA3AF",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: 4,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: "#0F1F3D",
            lineHeight: 1,
          }}
        >
          {value}
        </p>
        {subtitle && (
          <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 6 }}>
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
};

// ─── Tarjeta de Área con barra de progreso ──────────────────────────────
const AreaProgressCard = ({ area, cantidad, porcentaje, color }) => {
  const colors = {
    DesarrolloWeb: { bg: "#EFF6FF", bar: "#1B6FE8", text: "#1B6FE8" },
    DesarrolloMóvil: { bg: "#ECFDF5", bar: "#059669", text: "#059669" },
    BaseDeDatos: { bg: "#FFFBEB", bar: "#D97706", text: "#D97706" },
    AnálisisDatos: { bg: "#F5F3FF", bar: "#7C3AED", text: "#7C3AED" },
    SoporteTI: { bg: "#FEF2F2", bar: "#DC2626", text: "#DC2626" },
  };
  const c = colors[area.replace(/\s/g, "")] || colors.DesarrolloWeb;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: c.bar,
            }}
          />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
            {area}
          </span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: c.text }}>
          {cantidad} ({porcentaje}%)
        </span>
      </div>
      <div
        style={{
          height: 6,
          background: "#F1F5F9",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${porcentaje}%` }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            height: "100%",
            background: c.bar,
            borderRadius: 3,
          }}
        />
      </div>
    </div>
  );
};

// ─── Componente de Rating con estrellas ─────────────────────────────────
const RatingStars = ({ rating, size = 14 }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "text-slate-200 fill-slate-200"
          }
        />
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════
export default function AdminDashboardPage() {
  const {
    totalMypes,
    estudiantesActivos,
    proyectosEnDesarrollo,
    satisfaccionPromedio,
    totalEvaluaciones,
    distribucionAreas,
    isLoading,
  } = useAdminReportes();

  // Datos de ejemplo para KPIs adicionales (puedes ajustarlos desde tu API)
  const kpis = [
    {
      title: "Empresas Registradas",
      value: totalMypes,
      subtitle: "MYPEs activas en la plataforma",
      icon: Building2,
      color: "blue",
      trend: { up: true, value: 12 },
      delay: 0.05,
    },
    {
      title: "Estudiantes Activos",
      value: estudiantesActivos,
      subtitle: "Participando en proyectos",
      icon: GraduationCap,
      color: "green",
      trend: { up: true, value: 8 },
      delay: 0.1,
    },
    {
      title: "Proyectos en Curso",
      value: proyectosEnDesarrollo,
      subtitle: "En desarrollo actualmente",
      icon: Rocket,
      color: "purple",
      trend: { up: false, value: 3 },
      delay: 0.15,
    },
    {
      title: "Satisfacción Global",
      value: satisfaccionPromedio,
      subtitle: `${totalEvaluaciones} evaluaciones recibidas`,
      icon: Award,
      color: "orange",
      delay: 0.2,
    },
  ];

  // Datos de acciones rápidas
  const quickActions = [
    {
      label: "Gestionar Usuarios",
      icon: Users,
      path: "/admin/usuarios",
      color: "#1B6FE8",
    },
    {
      label: "Revisar Proyectos",
      icon: Briefcase,
      path: "/admin/proyectos",
      color: "#059669",
    },
    {
      label: "Ver Postulaciones",
      icon: UserCheck,
      path: "/admin/postulaciones",
      color: "#D97706",
    },
    {
      label: "Auditoría",
      icon: History,
      path: "/admin/auditoria",
      color: "#7C3AED",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        <p className="text-slate-500 font-medium">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div
      className="space-y-6 pb-12"
      style={{ fontFamily: FONT, maxWidth: 1400, margin: "0 auto" }}
    >
      {/* Hero Banner */}
      <AdminDashboardHero />

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi) => (
          <MetricCard key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* Sección de contenido principal: 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Áreas de Demanda */}
        <motion.div
          {...fadeUp(0.25)}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Laptop size={16} className="text-purple-600" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Demanda por Área
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Tecnológica
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-5">
            Distribución de proyectos según área de especialización
          </p>
          <div className="space-y-4">
            {distribucionAreas?.map((item, idx) => (
              <AreaProgressCard
                key={item.area}
                area={item.label}
                cantidad={item.cantidad}
                porcentaje={item.porcentaje}
                delay={idx * 0.05}
              />
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
              <Zap size={18} className="text-purple-600" />
              <p className="text-xs text-slate-600 font-medium">
                El área de{" "}
                <strong className="text-purple-700">Desarrollo Web</strong>{" "}
                concentra la mayor demanda, seguida por{" "}
                <strong className="text-blue-700">Desarrollo Móvil</strong>.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Columna Derecha: Actividad Reciente y Acciones Rápidas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Acciones Rápidas */}
          <motion.div
            {...fadeUp(0.3)}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap size={18} className="text-amber-500" />
              <h3 className="text-base font-bold text-slate-800">
                Acciones Rápidas
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickActions.map((action, idx) => (
                <motion.a
                  key={action.label}
                  href={action.path}
                  whileHover={{ y: -2, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-100 hover:shadow-md transition-all cursor-pointer"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${action.color}15` }}
                  >
                    <action.icon size={20} style={{ color: action.color }} />
                  </div>
                  <span className="text-xs font-medium text-slate-700 text-center">
                    {action.label}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Auditoría Reciente (Resumen) */}
          <motion.div
            {...fadeUp(0.35)}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <History size={16} className="text-indigo-600" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  Actividad Reciente
                </h3>
              </div>
              <a
                href="/admin/auditoria"
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                Ver todos <ChevronRight size={12} />
              </a>
            </div>
            <div className="space-y-3">
              {[
                {
                  action: "Nuevo proyecto creado",
                  user: "TechSolutions S.A.C.",
                  time: "Hace 5 minutos",
                  icon: Briefcase,
                },
                {
                  action: "Usuario registrado",
                  user: "Carlos Alarcón",
                  time: "Hace 23 minutos",
                  icon: UserCheck,
                },
                {
                  action: "Certificado emitido",
                  user: "Proyecto E-commerce",
                  time: "Hace 1 hora",
                  icon: Award,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <item.icon size={14} className="text-slate-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      {item.action}
                    </p>
                    <p className="text-xs text-slate-400">{item.user}</p>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Resumen de Calificaciones */}
          <motion.div
            {...fadeUp(0.4)}
            className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star size={18} className="fill-amber-400 text-amber-400" />
                  <h3 className="text-base font-bold text-slate-800">
                    Reputación General
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <RatingStars rating={satisfaccionPromedio} size={18} />
                  <span className="text-2xl font-black text-slate-800">
                    {satisfaccionPromedio}
                  </span>
                  <span className="text-sm text-slate-500">/ 5.0</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Basado en {totalEvaluaciones} evaluaciones de proyectos
                  completados
                </p>
              </div>
              <a
                href="/admin/reportes"
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm font-semibold text-primary border border-indigo-200 hover:shadow-md transition-all"
              >
                <BarChart4 size={14} /> Ver reportes detallados
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
