// src/pages/estudiante/EstudianteDashboardPage.jsx
import React, { useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useMisPostulaciones } from '../../features/postulaciones-list/useMisPostulaciones';
import { useCertificados } from '../../features/certificados/useCertificados';
import { useNotificaciones, useLeerNotificacion } from '../../features/notificaciones/useNotificaciones';
import { useProyectos } from '../../features/proyectos-list/useProyectos';
import { usePerfil } from '../../features/perfil/usePerfil';
import CalificacionesPendientesCard from "@/features/calificaciones/CalificacionesPendientesCard";

import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Bell,
  Search,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { NotificacionesPanel } from '../../features/notificaciones/NotificacionesPanel';

/* ─── Paleta corporativa (MYPE dashboard) ─── */
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

/* ─── Variantes de animación ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ─── Hook: Contador animado ─── */
const useCountUp = (target, duration = 1100) => {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
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

/* ─── Colores de área ─── */
const AREA_STYLES = {
  WEB:             { bg: '#eff6ff', color: '#1B6FE8' },
  DATA:            { bg: '#f0fdf4', color: '#059669' },
  UX:              { bg: '#f5f3ff', color: '#8B5CF6' },
  INFRAESTRUCTURA: { bg: '#f0fdf4', color: '#059669' },
  DEFAULT:         { bg: '#eff6ff', color: '#1B6FE8' },
};
const getAreaStyle = (area = '') => {
  const key = area.toUpperCase().replace(/[\s_]/g, '');
  return AREA_STYLES[key] || AREA_STYLES.DEFAULT;
};

/* ─── Duración estimada de un proyecto ─── */
const renderDuracion = (proyecto) => {
  if (proyecto.diasEstimados) return { label: 'Duración', value: `${proyecto.diasEstimados} días` };
  if (proyecto.fechaLimiteCalculada) return { label: 'Fecha límite', value: new Date(proyecto.fechaLimiteCalculada).toLocaleDateString('es-PE') };
  if (proyecto.fechaLimite) {
    const dias = Math.ceil((new Date(proyecto.fechaLimite) - Date.now()) / 86400000);
    if (dias > 0) return { label: 'Duración aprox.', value: `${dias} días` };
  }
  return { label: 'Duración', value: 'Por definir' };
};

/* ─── Tiempo relativo para notificaciones ─── */
const tiempoRelativo = (fecha) => {
  if (!fecha) return 'Fecha no disponible';
  const diff = Date.now() - new Date(fecha).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (h < 1) return 'hace un momento';
  if (h < 24) return `hace ${h}h`;
  if (d === 1) return 'ayer';
  return `hace ${d} días`;
};

/* ─── Color del borde izquierdo por estado de notificación ─── */
const colorNotif = (item) => {
  if (!item.leida) return '#1B6FE8';
  return '#d1d5db';
};

/* ═══════════════════════════════════════════════
   SUB: Ring SVG
═══════════════════════════════════════════════ */
const Ring = ({ pct = 0, color = '#1B6FE8', icon: Icon }) => {
  const R = 22;
  const circ = 2 * Math.PI * R;
  const safePct = pct || 0;
  const offset = circ - (circ * Math.min(safePct, 100)) / 100;
  return (
    <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}>
      <svg width="56" height="56" viewBox="0 0 56 56" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="28" cy="28" r={R} stroke="#f1f5f9" strokeWidth="5" fill="none" />
        <circle
          cx="28" cy="28" r={R}
          stroke={color} strokeWidth="5" fill="none"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      {Icon && (
        <Icon size={16} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color }} />
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   SUB: Panel reutilizable
═══════════════════════════════════════════════ */
const Panel = ({ children, delay = 0, dark = false, style = {} }) => (
  <motion.section
    {...fadeUp(delay)}
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


/* ═══════════════════════════════════════════════
   SUB: Project Card (estilo MYPE)
═══════════════════════════════════════════════ */
const ProjectCard = ({ proyecto }) => {
  const area = proyecto.areaSistemas?.replace('_', ' ') || 'SISTEMAS';
  const { bg, color } = getAreaStyle(area);
  const gradients = {
    WEB:  'linear-gradient(90deg,#1B6FE8,#06B6D4)',
    DATA: 'linear-gradient(90deg,#059669,#06B6D4)',
    UX:   'linear-gradient(90deg,#8B5CF6,#1B6FE8)',
  };
  const gradient = gradients[area.toUpperCase().replace(/[\s_]/g, '')] || gradients.WEB;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/proyectos?selected=${proyecto.id}`);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        background: '#fff', border: '0.5px solid #e8e8e4', borderRadius: 14,
        padding: 18, display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', minHeight: 160,
        cursor: 'pointer', transition: 'all 0.25s',
        position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)';
        e.currentTarget.style.borderColor = 'rgba(27,111,232,0.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#e8e8e4';
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: gradient }} />
      <div>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4, background: bg, color, display: 'inline-flex', alignItems: 'center', marginBottom: 10 }}>
          {area}
        </span>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em', color: '#0f1f3d', lineHeight: 1.35, marginBottom: 6 }}>
          {proyecto.titulo}
        </div>
        <div style={{ fontSize: 11, color: '#6b6b7a', fontWeight: 400, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Building2 size={11} />
          {proyecto.mypeNombre || proyecto.nombre || 'MYPE'}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '0.5px solid #e8e8e4', marginTop: 'auto' }}>
        <div style={{ fontSize: 10, color: '#6b6b7a' }}>
          Límite: <span style={{ color: '#e24b4a', fontWeight: 600 }}>{proyecto.fechaLimite}</span>
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#1B6FE8', display: 'flex', alignItems: 'center', gap: 3 }}>
          Postular <ArrowRight size={11} />
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   SUB: Hero Banner (diseño MYPE)
═══════════════════════════════════════════════ */
const HeroBanner = ({ totalPostulaciones = 0, aceptados = 0, certificados = 0 }) => {
  const canvasRef = useRef(null);
  const heroRef   = useRef(null);
  const [currentWordIndex, setCurrentWordIndex] = React.useState(0);
  const [displayWord, setDisplayWord] = React.useState('real');
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [counts, setCounts] = React.useState({ a: 0, b: 0, c: 0 });

  const words = [
    { text: 'real', color: '#67d4f8' },
    { text: 'profesional', color: '#f59e0b' },
    { text: 'ahora', color: '#4ade80' },
    { text: 'exitoso', color: '#c084fc' }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setDisplayWord(words[(currentWordIndex + 1) % words.length].text);
        setTimeout(() => setIsAnimating(false), 150);
      }, 200);
    }, 2800);
    return () => clearInterval(interval);
  }, [currentWordIndex, words.length]);

  React.useEffect(() => {
    setDisplayWord(words[0].text);
  }, []);

  /* Canvas particles */
  React.useEffect(() => {
    const canvas = canvasRef.current, hero = heroRef.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext('2d');
    let W, H, animId;
    const mouse = { x: -999, y: -999 };
    const COLORS = ['rgba(27,111,232,', 'rgba(6,182,212,', 'rgba(212,88,10,', 'rgba(255,255,255,'];

    const resize = () => { W = canvas.width = hero.offsetWidth; H = canvas.height = hero.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(hero);
    const onMove  = e => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const onLeave = () => { mouse.x = -999; mouse.y = -999; };
    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);

    class Particle {
      reset(init = false) {
        this.x = Math.random() * W; this.y = init ? Math.random() * H : H + 10;
        this.size = Math.random() * 2 + 0.5; this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = -(Math.random() * 0.6 + 0.2); this.targetA = Math.random() * 0.5 + 0.1;
        this.alpha = this.targetA; this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.life = 0; this.maxLife = Math.random() * 300 + 150;
      }
      constructor() { this.reset(true); }
      update() {
        this.life++;
        const dx = this.x - mouse.x, dy = this.y - mouse.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 80) { this.speedX += (dx / d) * 0.012; this.speedY += (dy / d) * 0.012; }
        this.speedX *= 0.99; this.speedY *= 0.99;
        this.x += this.speedX; this.y += this.speedY;
        const t = this.life / this.maxLife;
        this.alpha = t < 0.1 ? t * 10 * this.targetA : t > 0.8 ? (1 - t) * 5 * this.targetA : this.targetA;
        if (this.life >= this.maxLife || this.y < -10) this.reset();
      }
      draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fillStyle = this.color + this.alpha + ')'; ctx.fill(); }
    }

    const particles = Array.from({ length: 70 }, () => new Particle());
    const drawConn = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 80) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(27,111,232,${0.06 * (1 - d / 80)})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
    };
    const animate = () => { ctx.clearRect(0, 0, W, H); drawConn(); particles.forEach(p => { p.update(); p.draw(); }); animId = requestAnimationFrame(animate); };
    animate();
    return () => { cancelAnimationFrame(animId); ro.disconnect(); hero.removeEventListener('mousemove', onMove); hero.removeEventListener('mouseleave', onLeave); };
  }, []);

  /* Counting */
  React.useEffect(() => {
    const targets = { a: totalPostulaciones || 0, b: aceptados || 0, c: certificados || 0 };
    if (targets.a === 0 && targets.b === 0 && targets.c === 0) {
      setCounts({ a: 0, b: 0, c: 0 });
      return;
    }
    const dur = 1400, start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      setCounts({ a: Math.round(e * targets.a), b: Math.round(e * targets.b), c: Math.round(e * targets.c) });
      if (p < 1) requestAnimationFrame(step);
    };
    const tid = setTimeout(() => requestAnimationFrame(step), 600);
    return () => clearTimeout(tid);
  }, [totalPostulaciones, aceptados, certificados]);

  return (
    <motion.div
      ref={heroRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: 24,
        background: `linear-gradient(135deg, ${C.navyDeep} 0%, ${C.navyMid} 55%, ${C.navySoft} 100%)`,
        padding: '28px 40px', color: '#fff',
        marginBottom: 20, minHeight: 160,
        display: 'flex', alignItems: 'center',
        boxShadow: '0 24px 48px -28px rgba(10,22,40,0.7)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <style>{`
        @keyframes heroPulse{0%{box-shadow:0 0 0 0 rgba(74,222,128,0.45)}70%{box-shadow:0 0 0 9px rgba(74,222,128,0)}100%{box-shadow:0 0 0 0 rgba(74,222,128,0)}}
        @keyframes orbF1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-18px,14px) scale(1.08)}66%{transform:translate(9px,-9px) scale(0.95)}}
        @keyframes orbF2{0%,100%{transform:translate(0,0)}40%{transform:translate(14px,-18px)}70%{transform:translate(-9px,11px)}}
        @keyframes orbF3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-13px,18px) scale(1.1)}}
        @keyframes wordGlow{
          0%{text-shadow:0 0 0px rgba(103,212,248,0)}
          50%{text-shadow:0 0 20px rgba(103,212,248,0.5)}
          100%{text-shadow:0 0 0px rgba(103,212,248,0)}
        }
      `}</style>

      {/* Canvas */}
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.5, pointerEvents:'none' }} />

      {/* Grid líneas */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(27,111,232,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(27,111,232,0.06) 1px,transparent 1px)', backgroundSize:'48px 48px', WebkitMaskImage:'radial-gradient(ellipse 80% 80% at 55% 50%,black,transparent)', maskImage:'radial-gradient(ellipse 80% 80% at 55% 50%,black,transparent)' }} />

      {/* Orbs */}
      <div style={{ position:'absolute', top:-70, right:-40, width:250, height:250, borderRadius:'50%', background:'rgba(27,111,232,0.16)', filter:'blur(40px)', pointerEvents:'none', animation:'orbF1 8s ease-in-out infinite' }} />
      <div style={{ position:'absolute', bottom:-65, right:140, width:190, height:190, borderRadius:'50%', background:'rgba(212,88,10,0.09)', filter:'blur(40px)', pointerEvents:'none', animation:'orbF2 10s ease-in-out infinite' }} />
      <div style={{ position:'absolute', top:10, right:210, width:150, height:150, borderRadius:'50%', background:'rgba(6,182,212,0.07)', filter:'blur(40px)', pointerEvents:'none', animation:'orbF3 13s ease-in-out infinite' }} />

      {/* Contenido izquierdo */}
      <div style={{ position:'relative', zIndex:10, maxWidth:440 }}>
        {/* Heading con animación moderna */}
        <div style={{ fontSize:'clamp(22px,2.6vw,30px)', fontWeight:800, lineHeight:1.08, letterSpacing:'-0.035em', marginBottom:10 }}>
          <div style={{ overflow:'hidden' }}>
            <motion.div 
              initial={{ y:'110%', opacity:0 }} 
              animate={{ y:0, opacity:1 }} 
              transition={{ delay:0.15, duration:0.6, ease:[0.22,1,0.36,1] }}
            >
              Tu camino hacia
            </motion.div>
          </div>
          <div style={{ overflow:'hidden', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
            <motion.div 
              initial={{ y:'110%', opacity:0 }} 
              animate={{ y:0, opacity:1 }} 
              transition={{ delay:0.27, duration:0.6, ease:[0.22,1,0.36,1] }}
            >
              el mundo
            </motion.div>
            <motion.div
              key={currentWordIndex}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ duration: 0.35, ease: [0.34, 1.2, 0.64, 1] }}
              style={{
                color: words[currentWordIndex].color,
                fontWeight: 800,
                display: 'inline-block',
                animation: 'wordGlow 0.6s ease-out',
              }}
            >
              &nbsp;{displayWord}
            </motion.div>
          </div>
        </div>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.44, duration:0.6 }}
          style={{ fontSize:13, fontWeight:400, color:'rgba(255,255,255,0.45)', lineHeight:1.65, marginBottom:0 }}
        >
          Proyectos reales con empresas de Cajamarca.<br />
          Construye tu portafolio mientras estudias.
        </motion.p>
      </div>

      {/* Stats (estilo MYPE) */}
      <motion.div
        initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
        transition={{ delay:0.7, duration:0.7 }}
        style={{ position:'absolute', right:40, top:'50%', transform:'translateY(-50%)', zIndex:10, display:'flex', alignItems:'center', gap:0 }}
      >
        {[
          { num: counts.a, label: 'postulaciones' },
          { num: counts.b, label: 'aceptadas'     },
          { num: counts.c, label: 'certificados'  },
        ].map((stat, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <div style={{ width: 1, height: 50, background: 'rgba(255,255,255,0.12)', margin: '0 24px' }} />
            )}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 34, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {stat.num}
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>
                {stat.label}
              </div>
            </div>
          </React.Fragment>
        ))}
      </motion.div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════ */
const EstudianteDashboardPage = () => {
  const { user: authUser } = useAuthStore();
  const { data: userProfile, isLoading: loadingPerfil } = usePerfil();
  const navigate = useNavigate();
  const { mutate: leerNotificacion } = useLeerNotificacion();
  const [isNotifPanelOpen, setIsNotifPanelOpen] = React.useState(false);

  const { data: postulaciones, isLoading: loadingPostulaciones } = useMisPostulaciones();
  const { data: certificados, isLoading: loadingCertificados } = useCertificados();
  const { data: notificaciones, isLoading: loadingNotificaciones } = useNotificaciones();
  const { data: proyectosData, isLoading: loadingProyectos } = useProyectos();

  const user = userProfile || authUser;

  const totalPostulaciones    = postulaciones?.length || 0;
  const aceptados             = postulaciones?.filter(p => p.estado === 'CONFIRMADO' || p.estado === 'ACEPTADO' || p.estado === 'Aceptado').length || 0;
  const totalCertificados     = certificados?.length || 0;
  const activityItems         = notificaciones?.slice(0, 3) || [];
  const proyectosRecomendados = proyectosData?.content?.slice(0, 3) || [];
  const proyectosActivos      = postulaciones?.filter(p => p.estado === 'CONFIRMADO' || p.estado === 'ACEPTADO' || p.estado === 'Aceptado') || [];

  let completitud = 10;
  if (user?.bio) completitud += 15;
  if (user?.skills?.length > 0) completitud += 15;
  if (user?.telefono) completitud += 10;
  if (user?.linkedinUrl) completitud += 10;
  if (user?.portafolioUrl) completitud += 10;
  if (user?.ciudad) completitud += 10;
  if (user?.pais) completitud += 10;
  if (user?.cvUrl) completitud += 10;
  if (completitud > 100) completitud = 100;

  const porcentajeExito = totalPostulaciones > 0
    ? Math.round((aceptados / totalPostulaciones) * 100) : 0;

  const firstName = user?.nombre?.split(' ')[0] || 'Estudiante';

  const S = {
    sectionTitle: { fontSize:15, fontWeight:700, letterSpacing:'-0.02em', color:'#0f1f3d', display:'flex', alignItems:'center', gap:8 },
    sectionBar:   { display:'block', width:3, height:16, background:'#1B6FE8', borderRadius:2, flexShrink:0 },
    seeAll:       { fontSize:12, fontWeight:600, color:'#1B6FE8', cursor:'pointer', display:'flex', alignItems:'center', gap:4, textDecoration:'none' },
  };

  return (
    <div style={{ fontFamily:"Inter, Arial, 'Helvetica Neue', sans-serif", background:'#f8fafc', minHeight:'100vh', padding:'32px 36px', maxWidth:1440, margin:'0 auto' }}>
      <style>{`
        @keyframes vping { 75%, 100% { transform: scale(2.4); opacity: 0; } }
        @keyframes vpulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        @keyframes vshimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      `}</style>

      {/* ── TOPBAR ── */}
      <motion.div {...fadeUp(0)} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, letterSpacing:'-0.03em', color:'#0f1f3d' }}>
            ¡Hola, {firstName}!
          </h1>
          <p style={{ fontSize: 13, color: '#6b6b7a', margin: '2px 0 0 0' }}>
            Tu panel de control profesional
          </p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Link to="/proyectos" style={{ textDecoration:'none' }}>
            <div
              style={{ display:'flex', alignItems:'center', gap:8, background:'#fff', border:'0.5px solid #e8e8e4', borderRadius:8, padding:'8px 14px', fontSize:13, color:'#6b6b7a', cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#1B6FE8'; e.currentTarget.style.color='#1B6FE8'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='#e8e8e4'; e.currentTarget.style.color='#6b6b7a'; }}
            >
              <Search size={14} /> Buscar proyectos
            </div>
          </Link>
          <button
            onClick={() => setIsNotifPanelOpen(true)}
            style={{
              position: 'relative', width: 36, height: 36, borderRadius: 8,
              border: '0.5px solid #e8e8e4', background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <Bell size={16} color="#6b6b7a" />
            {activityItems.some(n => !n.leida) && (
              <div style={{
                position: 'absolute', top: 7, right: 7, width: 7, height: 7,
                borderRadius: '50%', background: '#d4580a', border: '1.5px solid #fff',
              }} />
            )}
          </button>
        </div>
      </motion.div>

      {/* ── HERO BANNER ── */}
      <HeroBanner
        totalPostulaciones={totalPostulaciones}
        aceptados={aceptados}
        certificados={totalCertificados}
      />


      {/* ── FILA INFERIOR: PROYECTOS + SIDEBAR ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
        {/* Proyectos recomendados */}
        <Panel delay={0.20}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <div style={S.sectionTitle}><span style={S.sectionBar} />Proyectos recomendados</div>
            <Link to="/proyectos" style={S.seeAll}>Explorar todos <ArrowRight size={12} /></Link>
          </div>
          {loadingProyectos ? (
            <div style={{ padding:36, textAlign:'center', color:'#6b6b7a', fontSize:13 }}>
              <svg style={{ animation:'spin 1s linear infinite', height:20, width:20, color:'#1B6FE8', display:'block', margin:'0 auto 8px' }} viewBox="0 0 24 24">
                <circle style={{ opacity:0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path style={{ opacity:0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Buscando las mejores oportunidades…
            </div>
          ) : proyectosRecomendados.length === 0 ? (
            <div style={{ padding:36, textAlign:'center', color:'#6b6b7a', fontSize:13, border:'0.5px dashed #e8e8e4', borderRadius:10 }}>
              No hay proyectos disponibles por el momento.
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:14 }}>
              {proyectosRecomendados.map(p => <ProjectCard key={p.id} proyecto={p} />)}
            </div>
          )}
        </Panel>

        {/* ── SIDEBAR ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

          {/* Actividad reciente — timeline estilo MYPE */}
          <Panel delay={0.24}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={S.sectionTitle}><span style={S.sectionBar} />Actividad reciente</div>
              <Link to="/mis-postulaciones" style={S.seeAll}>Ver todo <ArrowRight size={12} /></Link>
            </div>
            {loadingNotificaciones ? (
              <div style={{ padding:16, textAlign:'center', color:'#6b6b7a', fontSize:13 }}>Cargando actividad…</div>
            ) : activityItems.length === 0 ? (
              <div style={{ padding:20, textAlign:'center', color:'#6b6b7a', fontSize:13, border:'0.5px dashed #e8e8e4', borderRadius:10 }}>
                No hay actividad reciente.
              </div>
            ) : (
              <div style={{ position:'relative', paddingLeft:8 }}>
                <div style={{ position:'absolute', left:19, top:8, bottom:8, width:1.5, background:'#E5E7EB' }} />
                <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                  {activityItems.map((item, index) => {
                    const getRutaNotificacion = (notif) => {
                      if (notif.urlReferencia && notif.urlReferencia.trim() !== '') {
                        return notif.urlReferencia.startsWith('/')
                          ? notif.urlReferencia
                          : `/${notif.urlReferencia}`;
                      }
                      return '/mis-postulaciones';
                    };
                    return (
                      <div
                        key={item.id || index}
                        onClick={() => {
                          if (!item.leida) leerNotificacion(item.id);
                          navigate(getRutaNotificacion(item));
                        }}
                        style={{
                          position:'relative', display:'flex', alignItems:'flex-start',
                          gap:14, padding:'10px 14px', borderRadius:12,
                          cursor:'pointer', transition:'background 0.15s ease', background:'transparent',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FA'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <div style={{
                          width:10, height:10, borderRadius:'50%',
                          background: !item.leida ? '#1B6FE8' : '#9CA3AF',
                          flexShrink:0, marginTop:4, zIndex:1,
                          boxShadow: !item.leida ? '0 0 0 3px rgba(27,111,232,0.15)' : '0 0 0 3px rgba(156,163,175,0.1)',
                        }} />
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:13, color:'#0f1f3d', fontWeight:600, lineHeight:1.35 }}>
                            {item.titulo}
                          </div>
                          {item.mensaje && (
                            <div style={{ fontSize:11.5, color:'#6b6b7a', marginTop:2, fontWeight:400 }}>
                              {item.mensaje}
                            </div>
                          )}
                          <div style={{ fontSize:11, color:'#9CA3AF', marginTop:4 }}>
                            {item.fechaCreacion
                              ? new Date(item.fechaCreacion).toLocaleDateString('es-PE', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })
                              : 'Fecha no disponible'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Panel>

          {/* Calificaciones pendientes */}
          <CalificacionesPendientesCard />


        </div>{/* fin sidebar */}
      </div>

      <NotificacionesPanel
        isOpen={isNotifPanelOpen}
        onClose={() => setIsNotifPanelOpen(false)}
      />
    </div>
  );
};

export default EstudianteDashboardPage;