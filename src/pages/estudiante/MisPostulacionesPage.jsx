import React, { useRef } from "react";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Building2,
  Calendar,
  Lightbulb,
  TrendingUp,
  ClipboardList,
  MessageSquare,
  Sparkles,
  Send,
  FileText,
  UserCheck,
  BarChart3,
  Target,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { OfertaAceptadaBanner } from "@/features/postulaciones-list/OfertaAceptadaBanner";
import { useMisPostulaciones } from "@features/postulaciones-list/useMisPostulaciones";

/* ─── Variantes de animación ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ═══════════════════════════════════════════════
   HERO BANNER: PIPELINE DE POSTULACIONES
   Animación de partículas tipo "conexión" + 
   visualización del flujo de aplicación
═══════════════════════════════════════════════ */
const PostulacionesHero = ({ total = 0, aceptadas = 0, enRevision = 0, rechazadas = 0 }) => {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const [counts, setCounts] = React.useState({ a: 0, b: 0, c: 0, d: 0 });

  /* Canvas particles - efecto "datos/conexiones" */
  React.useEffect(() => {
    const canvas = canvasRef.current, hero = heroRef.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext('2d');
    let W, H, animId;
    const mouse = { x: -999, y: -999 };
    const COLORS = ['rgba(27,111,232,', 'rgba(6,182,212,', 'rgba(139,92,246,', 'rgba(5,150,105,'];

    const resize = () => { W = canvas.width = hero.offsetWidth; H = canvas.height = hero.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(hero);
    const onMove = e => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const onLeave = () => { mouse.x = -999; mouse.y = -999; };
    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);

    class Particle {
      reset(init = false) {
        this.x = Math.random() * W; 
        this.y = init ? Math.random() * H : H + 10;
        this.size = Math.random() * 1.5 + 0.5; 
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = -(Math.random() * 0.4 + 0.1); 
        this.targetA = Math.random() * 0.4 + 0.1;
        this.alpha = this.targetA; 
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.life = 0; 
        this.maxLife = Math.random() * 200 + 100;
      }
      constructor() { this.reset(true); }
      update() {
        this.life++;
        const dx = this.x - mouse.x, dy = this.y - mouse.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) { this.speedX += (dx / d) * 0.01; this.speedY += (dy / d) * 0.01; }
        this.speedX *= 0.99; this.speedY *= 0.99;
        this.x += this.speedX; this.y += this.speedY;
        const t = this.life / this.maxLife;
        this.alpha = t < 0.1 ? t * 10 * this.targetA : t > 0.8 ? (1 - t) * 5 * this.targetA : this.targetA;
        if (this.life >= this.maxLife || this.y < -10) this.reset();
      }
      draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fillStyle = this.color + this.alpha + ')'; ctx.fill(); }
    }

    const particles = Array.from({ length: 50 }, () => new Particle());
    const drawConn = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 70) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(27,111,232,${0.04 * (1 - d / 70)})`; 
            ctx.lineWidth = 0.5; 
            ctx.stroke();
          }
        }
      }
    };
    const animate = () => { 
      ctx.clearRect(0, 0, W, H); 
      drawConn(); 
      particles.forEach(p => { p.update(); p.draw(); }); 
      animId = requestAnimationFrame(animate); 
    };
    animate();
    return () => { 
      cancelAnimationFrame(animId); 
      ro.disconnect(); 
      hero.removeEventListener('mousemove', onMove); 
      hero.removeEventListener('mouseleave', onLeave); 
    };
  }, []);

  /* Counting animation */
  React.useEffect(() => {
    const targets = { a: total || 0, b: enRevision || 0, c: aceptadas || 0, d: rechazadas || 0 };
    if (targets.a === 0 && targets.b === 0 && targets.c === 0 && targets.d === 0) {
      setCounts({ a: 0, b: 0, c: 0, d: 0 });
      return;
    }
    const dur = 1600, start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      setCounts({ 
        a: Math.round(e * targets.a), 
        b: Math.round(e * targets.b),
        c: Math.round(e * targets.c),
        d: Math.round(e * targets.d)
      });
      if (p < 1) requestAnimationFrame(step);
    };
    const tid = setTimeout(() => requestAnimationFrame(step), 400);
    return () => clearTimeout(tid);
  }, [total, enRevision, aceptadas, rechazadas]);

  /* Datos para el pipeline visual */
  const pipelineSteps = [
    { 
      label: 'Enviadas', 
      value: counts.a, 
      icon: Send, 
      color: '#1B6FE8', 
      bg: 'rgba(27,111,232,0.12)',
      description: 'Total de aplicaciones'
    },
    { 
      label: 'En Revisión', 
      value: counts.b, 
      icon: Clock, 
      color: '#d97706', 
      bg: 'rgba(217,119,6,0.12)',
      description: 'Pendientes de respuesta'
    },
    { 
      label: 'Aceptadas', 
      value: counts.c, 
      icon: UserCheck, 
      color: '#059669', 
      bg: 'rgba(5,150,105,0.12)',
      description: 'Confirmadas y activas'
    },
    { 
      label: 'No Seleccionado', 
      value: counts.d, 
      icon: XCircle, 
      color: '#dc2626', 
      bg: 'rgba(220,38,38,0.08)',
      description: 'Cerradas o rechazadas'
    },
  ];

  const acceptanceRate = total > 0 ? Math.round((aceptadas / total) * 100) : 0;

  return (
    <motion.div
      ref={heroRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: 20,
        background: 'linear-gradient(135deg, #0d1b35 0%, #1a1a2e 30%, #0f2a4a 70%, #0a2240 100%)',
        padding: '40px 40px 50px', color: '#fff',
        marginBottom: 24, minHeight: 240,
        display: 'flex', flexDirection: 'column',
      }}
    >
      <style>{`
        @keyframes pipelinePulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes lineFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>

      {/* Canvas particles */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.4, pointerEvents: 'none' }} />

      {/* Grid background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(27,111,232,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(27,111,232,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px', WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 40% 50%, black, transparent)', maskImage: 'radial-gradient(ellipse 70% 70% at 40% 50%, black, transparent)' }} />

      {/* Gradient orbs */}
      <div style={{ position: 'absolute', top: -40, right: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(27,111,232,0.15)', filter: 'blur(50px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -50, left: 180, width: 160, height: 160, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', filter: 'blur(50px)', pointerEvents: 'none' }} />

      {/* Header Section */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, marginBottom: 24 }}>
        <div>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -12 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: 8, 
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', 
              borderRadius: 20, padding: '5px 14px', fontSize: 10, fontWeight: 600, 
              letterSpacing: '0.1em', textTransform: 'uppercase', 
              color: 'rgba(255,255,255,0.55)', marginBottom: 14 
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pipelinePulse 2s ease-in-out infinite' }} />
            Pipeline de postulaciones
          </motion.div>

          {/* Title */}
          <div style={{ fontSize: 'clamp(20px, 2.4vw, 28px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.035em', marginBottom: 8 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.6 }}
            >
              Seguimiento de tus
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.6 }}
              style={{ 
                background: 'linear-gradient(90deg, #67d4f8, #a78bfa, #4ade80)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '200% 100%',
                animation: 'lineFlow 3s linear infinite'
              }}
            >
              aplicaciones en tiempo real
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, maxWidth: 400 }}
          >
            Monitorea cada etapa del proceso. Desde el envío hasta la confirmación final.
          </motion.p>
        </div>

        {/* Acceptance Rate Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 16,
            padding: '20px 24px',
            textAlign: 'center',
            minWidth: 140,
            animation: 'floatBadge 4s ease-in-out infinite',
          }}
        >
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Tasa de éxito
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#4ade80', letterSpacing: '-0.04em', lineHeight: 1 }}>
            {acceptanceRate}%
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
            de aceptación
          </div>
        </motion.div>
      </div>

      {/* Pipeline Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.7 }}
        style={{
          position: 'relative', zIndex: 10,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12, marginTop: 'auto',
        }}
      >
        {pipelineSteps.map((step, i) => (
          <div key={i} style={{ position: 'relative' }}>
            {/* Connector line */}
            {i < pipelineSteps.length - 1 && (
              <div style={{
                position: 'absolute', top: 24, right: -6, width: 12, height: 2,
                background: 'rgba(255,255,255,0.15)', zIndex: 0,
              }}>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1 + i * 0.2, duration: 0.8, ease: 'easeOut' }}
                  style={{ height: '100%', background: step.color }}
                />
              </div>
            )}
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid rgba(255,255,255,0.1)`,
                borderRadius: 14,
                padding: '16px 14px',
                textAlign: 'center',
                position: 'relative', zIndex: 1,
                transition: 'all 0.3s',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = step.color;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ 
                width: 40, height: 40, 
                borderRadius: 12, 
                background: step.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 10px',
              }}>
                <step.icon size={18} color={step.color} />
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4 }}>
                {step.value}
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
                {step.label}
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>
                {step.description}
              </div>
            </motion.div>
          </div>
        ))}
      </motion.div>

      {/* Bottom line */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1.5, background: 'linear-gradient(90deg, transparent, rgba(27,111,232,0.5) 30%, rgba(139,92,246,0.5) 60%, transparent)' }} />
    </motion.div>
  );
};

/* ─── Badge de estado ─── */
const getStatusStyle = (estado) => {
  switch (estado) {
    case "CONFIRMADO":
      return {
        bg: '#ecfdf5', color: '#059669', borderColor: '#a7f3d0',
        icon: <CheckCircle2 size={13} />,
        label: "Confirmado ✓✓",
      };
    case "VALIDADO_MYPE":
      return {
        bg: '#f0fdf4', color: '#059669', borderColor: '#86efac',
        icon: <CheckCircle2 size={13} />,
        label: "Aceptado — confirma ahora",
      };
    case "PRESELECCIONADO":
      return {
        bg: '#eff6ff', color: '#1B6FE8', borderColor: '#bfdbfe',
        icon: <Clock size={13} />,
        label: "Preseleccionado",
      };
    case "RECHAZADO":
      return {
        bg: '#fef2f2', color: '#dc2626', borderColor: '#fecaca',
        icon: <XCircle size={13} />,
        label: "No seleccionado",
      };
    case "RETIRADO":
      return {
        bg: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0',
        icon: <XCircle size={13} />,
        label: "Retirado",
      };
    case "EXPIRADO":
      return {
        bg: '#fff7ed', color: '#ea580c', borderColor: '#fed7aa',
        icon: <Clock size={13} />,
        label: "Expirado",
      };
    case "PENDIENTE":
    default:
      return {
        bg: '#fffbeb', color: '#d97706', borderColor: '#fde68a',
        icon: <Clock size={13} />,
        label: "En revisión",
      };
  }
};

/* ─── Estilos base ─── */
const styles = {
  page: {
    fontFamily: "Inter, Arial, 'Helvetica Neue', sans-serif",
    background: '#f8fafc',
    minHeight: '100vh',
    padding: '32px 36px',
    maxWidth: 1440,
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: '#0f1f3d',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionBar: {
    display: 'block',
    width: 3,
    height: 16,
    background: '#1B6FE8',
    borderRadius: 2,
    flexShrink: 0,
  },
  cardBase: {
    background: '#fff',
    border: '0.5px solid #e8e8e4',
    borderRadius: 16,
    padding: 22,
    transition: 'all 0.25s',
  },
  badgeBase: (bg, color, borderColor) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.04em',
    background: bg,
    color: color,
    border: `0.5px solid ${borderColor}`,
  }),
};

const MisPostulacionesPage = () => {
  const {
    data: postulaciones = [],
    isLoading,
    isError,
    error,
  } = useMisPostulaciones();

  /* ─── ESTADOS DE CARGA Y ERROR ─── */
  if (isLoading) {
    return (
      <div style={styles.page}>
        <div style={{ ...styles.cardBase, padding: 48, textAlign: 'center', color: '#6b6b7a', fontSize: 13, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <svg style={{ animation: 'spin 1s linear infinite', height: 24, width: 24, color: '#1B6FE8' }} viewBox="0 0 24 24">
            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span style={{ fontWeight: 600 }}>Cargando tus postulaciones...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: 24, borderRadius: 16, border: '0.5px solid #fecaca', maxWidth: 400, textAlign: 'center' }}>
          <p style={{ fontWeight: 700, marginBottom: 4 }}>Error al cargar las postulaciones</p>
          <p style={{ fontSize: 13, opacity: 0.9 }}>
            {error.response?.data?.message || error.message || "Error desconocido"}
          </p>
        </div>
      </div>
    );
  }

  // ── Estadísticas ─────────────────────
  const total = postulaciones.length;
  const enRevision = postulaciones.filter((p) =>
    ["PENDIENTE", "PRESELECCIONADO"].includes(p.estado),
  ).length;
  const aceptadas = postulaciones.filter((p) =>
    ["CONFIRMADO", "VALIDADO_MYPE"].includes(p.estado),
  ).length;
  const rechazadas = postulaciones.filter((p) =>
    ["RECHAZADO", "EXPIRADO", "RETIRADO"].includes(p.estado),
  ).length;

  const ofertasPendientes = postulaciones.filter(
    (p) => p.estado === "VALIDADO_MYPE",
  );

  const hasPostulaciones = total > 0;

  return (
    <div style={styles.page}>
      {/* ── HERO BANNER ANIMADO ── */}
      <PostulacionesHero
        total={total}
        aceptadas={aceptadas}
        enRevision={enRevision}
        rechazadas={rechazadas}
      />

      {/* ── Banners de ofertas pendientes ─────── */}
      {ofertasPendientes.length > 0 && (
        <motion.div {...fadeUp(0.12)} style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ofertasPendientes.map((p) => (
            <OfertaAceptadaBanner key={p.id} postulacion={p} />
          ))}
        </motion.div>
      )}

      {/* ── HISTORIAL DE APLICACIONES ── */}
      <motion.div {...fadeUp(0.16)} style={{ marginBottom: 24 }}>
        <div style={styles.sectionTitle}>
          <span style={styles.sectionBar} />
          Historial de aplicaciones
        </div>

        {!hasPostulaciones ? (
          /* ── EMPTY STATE ── */
          <div style={{ ...styles.cardBase, padding: '48px 32px', textAlign: 'center', color: '#6b6b7a', fontSize: 13, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #1e3a5f 0%, #4648d4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: 8 }}
            >
              <Briefcase size={28} />
            </motion.div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f1f3d', marginBottom: 4 }}>No has postulado a ningún proyecto</div>
              <p style={{ fontSize: 13, maxWidth: 360, margin: '0 auto 16px' }}>
                Tu lista de candidaturas está vacía. ¡Comienza tu camino profesional hoy postulando a proyectos reales de MYPEs!
              </p>
            </div>
            <Link to="/proyectos" style={{ textDecoration: 'none' }}>
              <button
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#0f1f3d', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: '0.5px solid #e8e8e4', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1B6FE8'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(27,111,232,0.3)'; e.currentTarget.style.borderColor = '#1B6FE8'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#0f1f3d'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e8e8e4'; }}
              >
                <ClipboardList size={16} />
                Explorar Proyectos Disponibles
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {postulaciones.map((postulacion, index) => {
              const status = getStatusStyle(postulacion.estado);
              const fecha = postulacion.fechaPostulacion
                ? new Date(postulacion.fechaPostulacion).toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" })
                : "Fecha no disponible";
              const firstLetter = postulacion.proyectoTitulo
                ? postulacion.proyectoTitulo.charAt(0).toUpperCase()
                : "P";

              return (
                <motion.div
                  key={postulacion.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  style={{
                    ...styles.cardBase,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    padding: '20px 24px',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.07)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flex: 1 }}>
                      {/* Avatar del proyecto */}
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eff6ff', border: '0.5px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16, fontWeight: 800, color: '#1B6FE8' }}>
                        {firstLetter}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={styles.badgeBase(status.bg, status.color, status.borderColor)}>
                            {status.icon}
                            {status.label}
                          </span>
                          <span style={{ fontSize: 11, color: '#6b6b7a', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Calendar size={12} /> {fecha}
                          </span>
                        </div>
                        <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0f1f3d', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                          {postulacion.proyectoTitulo || "Proyecto sin título"}
                        </h3>
                        <div style={{ fontSize: 11, color: '#6b6b7a', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Building2 size={12} /> MYPE Asociada
                        </div>
                        {postulacion.mensajePostulacion && (
                          <div style={{ marginTop: 10, padding: '12px 14px', background: '#f8fafc', borderRadius: 12, border: '0.5px solid #e8e8e4', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <MessageSquare size={14} style={{ color: '#6b6b7a', marginTop: 2, flexShrink: 0 }} />
                            <div>
                              <div style={{ fontSize: 9, fontWeight: 700, color: '#6b6b7a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>
                                Tu Mensaje de Presentación
                              </div>
                              <p style={{ fontSize: 12, color: '#334155', margin: 0, fontStyle: 'italic' }}>
                                "{postulacion.mensajePostulacion}"
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Acciones - Versión mejorada sin iconos */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    {/* Botón Ver Proyecto */}
                    <Link
                      to={`/proyectos/${postulacion.proyectoId}`}
                      style={{
                        padding: '8px 20px',
                        borderRadius: 8,
                        background: 'transparent',
                        color: '#475569',
                        border: '1px solid #E2E8F0',
                        fontSize: 12,
                        fontWeight: 500,
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        display: 'inline-block',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#F8FAFC';
                        e.currentTarget.style.borderColor = '#CBD5E1';
                        e.currentTarget.style.color = '#1E293B';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = '#E2E8F0';
                        e.currentTarget.style.color = '#475569';
                      }}
                    >
                      Ver proyecto
                    </Link>

                    {/* Botón Ir al Workspace (solo cuando está confirmado) */}
                    {postulacion.estado === "CONFIRMADO" && (
                      <Link
                        to={`/workspace/${postulacion.proyectoId}`}
                        style={{
                          padding: '8px 20px',
                          borderRadius: 8,
                          background: '#1B6FE8',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: 12,
                          fontWeight: 500,
                          textDecoration: 'none',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                          display: 'inline-block',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = '#1557B0';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)';
                        }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = '#1B6FE8';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                      }}
                    >
                      Ir al workspace
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

      {/* ── TARJETAS DE RECOMENDACIÓN ── */}
      {/* ── TARJETAS DE INSIGHTS MODERNAS ── */}
<motion.div {...fadeUp(0.24)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
  
  {/* Insight 1 - Sabías que */}
  <motion.div
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    style={{
      background: '#ffffff',
      borderRadius: 24,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)',
      overflow: 'hidden',
      position: 'relative',
      cursor: 'pointer',
    }}
  >
    <div style={{ padding: '24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      {/* Icono */}
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 18,
        background: '#F0F7FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Lightbulb size={24} color="#1B6FE8" strokeWidth={1.5} />
      </div>
      
      <div style={{ flex: 1 }}>
        <h4 style={{ 
          fontSize: 15, 
          fontWeight: 600, 
          color: '#1E293B', 
          margin: '0 0 8px 0',
        }}>
          ¿Sabías que?
        </h4>
        <p style={{ 
          fontSize: 14, 
          color: '#475569', 
          margin: 0, 
          lineHeight: 1.5,
        }}>
          Los estudiantes con <strong style={{ color: '#1B6FE8' }}>perfiles completos</strong> tienen{' '}
          <strong style={{ color: '#1B6FE8' }}>3 veces más probabilidades</strong> de ser aceptados por MYPEs.
        </p>
      </div>
    </div>
  </motion.div>

  {/* Insight 2 - Tendencia */}
  <motion.div
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    style={{
      background: '#ffffff',
      borderRadius: 24,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)',
      overflow: 'hidden',
      position: 'relative',
      cursor: 'pointer',
    }}
  >
    <div style={{ padding: '24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      {/* Icono */}
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 18,
        background: '#FFF7ED',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <TrendingUp size={24} color="#EA580C" strokeWidth={1.5} />
      </div>
      
      <div style={{ flex: 1 }}>
        <h4 style={{ 
          fontSize: 15, 
          fontWeight: 600, 
          color: '#1E293B', 
          margin: '0 0 8px 0',
        }}>
          Tendencia esta semana
        </h4>
        <p style={{ 
          fontSize: 14, 
          color: '#475569', 
          margin: 0, 
          lineHeight: 1.5,
        }}>
          <strong style={{ color: '#EA580C' }}>Desarrollo Web</strong> y{' '}
          <strong style={{ color: '#EA580C' }}>Base de Datos</strong> son los proyectos más buscados y con mayor respuesta.
        </p>
      </div>
    </div>
  </motion.div>
</motion.div>
    </div>
  );
};

export default MisPostulacionesPage;