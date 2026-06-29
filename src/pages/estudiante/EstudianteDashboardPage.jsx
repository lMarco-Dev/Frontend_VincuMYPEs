// src/pages/estudiante/EstudianteDashboardPage.jsx
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useMisPostulaciones } from '../../features/postulaciones-list/useMisPostulaciones';
import { useCertificados } from '../../features/certificados/useCertificados';
import { useNotificaciones, useLeerNotificacion } from '../../features/notificaciones/useNotificaciones';
import { useProyectos } from '../../features/proyectos-list/useProyectos';
import { usePerfil } from '../../features/perfil/usePerfil';
import CalificacionesPendientesCard from "@/features/calificaciones/CalificacionesPendientesCard";

import {
  ArrowRight,
  Building2,
  Bell,
  Search,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { NotificacionesPanel } from '../../features/notificaciones/NotificacionesPanel';

/* ─── Tipografía consistente con ProyectosPage / MisPostulaciones ─── */
const FONT = "'Angro Std', 'Outfit', sans-serif";

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

/* ─── Timestamp de carga (para badge "Nuevo") ─── */
const AHORA = Date.now();

/* ─── Avatar de empresa ─── */
const AVATAR_PALETTE = [
  "#1B6FE8", "#059669", "#8B5CF6", "#D97706",
  "#0284C7", "#DB2777", "#65A30D", "#DC2626",
];
const getAvatarColor = (seed = "") => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
};
const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

/* ─── Hook: proyectos visitados (localStorage) ─── */
const useViewedProjects = () => {
  const [viewed, setViewed] = React.useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('vmp_viewed_projects') || '[]')); }
    catch { return new Set(); }
  });
  const markViewed = (id) => {
    setViewed(prev => {
      const next = new Set(prev);
      next.add(String(id));
      localStorage.setItem('vmp_viewed_projects', JSON.stringify([...next]));
      return next;
    });
  };
  return { viewed, markViewed };
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


/* ─── Chip contador de sección ─── */
const CountChip = ({ count }) => count > 0 ? (
  <span style={{ background: '#EFF6FF', color: '#1B6FE8', fontSize: 10, fontWeight: 600, borderRadius: 20, padding: '2px 8px', marginLeft: 6 }}>
    {count}
  </span>
) : null;

/* ═══════════════════════════════════════════════
   SUB: Card de empresa + carrusel con flechas
═══════════════════════════════════════════════ */
const CARD_W = 220;
const CARD_H = 120;
const CARD_GAP = 12;

const EmpresaCard = ({ empresa }) => {
  const navigate = useNavigate();
  const inicial = (empresa.nombre || 'E').trim().charAt(0).toUpperCase();
  const color = getAvatarColor(empresa.nombre || '');
  
  return (
    <div
      onClick={() => navigate(`/mypes/${empresa.id}`)}
      title={empresa.nombre}
      style={{
        width: CARD_W, minWidth: CARD_W, height: CARD_H,
        background: empresa.fotoPerfil ? `url(${empresa.fotoPerfil}) center/cover` : color,
        borderRadius: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0,
        transition: 'all 0.18s ease',
        boxShadow: '0 2px 8px rgba(15,23,42,0.10)',
        position: 'relative',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 24px rgba(15,23,42,0.18)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(15,23,42,0.10)';
      }}
    >
      {!empresa.fotoPerfil && (
        <span style={{ fontSize: 38, fontWeight: 700, color: '#fff', fontFamily: FONT, lineHeight: 1 }}>
          {inicial}
        </span>
      )}
      {empresa.fotoPerfil && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
          padding: '24px 10px 8px',
          borderBottomLeftRadius: 16, borderBottomRightRadius: 16,
        }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: '#fff', fontFamily: FONT }}>
            {empresa.nombre}
          </span>
        </div>
      )}
    </div>
  );
};

const ArrowBtn = ({ direction, onClick, visible }) => (
  <button
    onClick={onClick}
    style={{
      position: 'absolute', top: '50%', transform: 'translateY(-50%)',
      [direction === 'left' ? 'left' : 'right']: -20,
      zIndex: 10,
      width: 40, height: 40, borderRadius: '50%',
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      boxShadow: '0 2px 8px rgba(15,23,42,0.12)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? 'auto' : 'none',
      transition: 'opacity 0.2s, box-shadow 0.15s',
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(15,23,42,0.18)'; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(15,23,42,0.12)'; }}
    aria-label={direction === 'left' ? 'Anterior' : 'Siguiente'}
  >
    {direction === 'left'
      ? <ChevronLeft size={20} color="#0F1F3D" strokeWidth={2} />
      : <ChevronRight size={20} color="#0F1F3D" strokeWidth={2} />
    }
  </button>
);

const EmpresasCarousel = ({ empresas }) => {
  const trackRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', checkScroll); ro.disconnect(); };
  }, [checkScroll, empresas]);

  const scroll = (dir) => {
    const step = (CARD_W + CARD_GAP) * 3;
    trackRef.current?.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative', padding: '0 24px' }}>
      <ArrowBtn direction="left"  onClick={() => scroll('left')}  visible={canLeft} />
      <div
        ref={trackRef}
        style={{
          display: 'flex', gap: CARD_GAP,
          overflowX: 'auto', paddingBottom: 8,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {empresas.map(emp => <EmpresaCard key={emp.id} empresa={emp} />)}
      </div>
      <ArrowBtn direction="right" onClick={() => scroll('right')} visible={canRight} />
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
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
      fontFamily: FONT,
      boxShadow: dark ? "0 16px 32px -22px rgba(10,22,40,0.7)" : "0 4px 12px rgba(15,23,42,0.04)",
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
const ProjectCard = ({ proyecto, isViewed = false, onView }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    onView?.(proyecto.id);
    navigate(`/proyectos?selected=${proyecto.id}`);
  };

  return (
    <>
      <style>
        {`
          .saas-project-card:hover .project-card-cta {
            background-color: #1B6FE8;
            color: #FFFFFF;
            transform: translateX(4px);
            box-shadow: 0 4px 12px rgba(27,111,232,0.25);
          }
          .saas-project-card:hover .project-card-cta svg {
            color: #FFFFFF;
          }
        `}
      </style>
      <motion.div
        className="saas-project-card"
        onClick={handleClick}
        style={{
          background: isViewed ? '#F8FAFC' : '#FFFFFF',
          border: `1px solid ${isViewed ? '#F1F5F9' : '#E2E8F0'}`,
          borderRadius: 14,
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          cursor: 'pointer',
          boxShadow: isViewed 
            ? '0 1px 3px rgba(15,23,42,0.01)' 
            : '0 2px 4px rgba(15,23,42,0.02)',
          position: 'relative',
        }}
        whileHover={{ 
          y: -2, 
          boxShadow: '0 8px 24px -8px rgba(15,23,42,0.08)',
          borderColor: '#BFDBFE',
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div style={{ marginBottom: 10 }}>
          {/* MYPE nombre */}
          <div style={{ 
            fontSize: 11, 
            fontFamily: FONT, 
            color: '#94A3B8', 
            fontWeight: 500, 
            marginBottom: 4,
            letterSpacing: '0.02em',
          }}>
            {proyecto.mypeNombre || proyecto.nombre || 'MYPE'}
          </div>
          
          {/* Título */}
          <div style={{ 
            fontSize: 13, 
            fontFamily: FONT, 
            fontWeight: 600, 
            color: '#0F1F3D', 
            lineHeight: 1.35,
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden'
          }}>
            {proyecto.titulo}
          </div>
        </div>

        {/* Footer con botón CTA */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          paddingTop: 8, 
          borderTop: '1px solid #F1F5F9',
        }}>
          <span style={{ 
            fontSize: 10, 
            fontFamily: FONT, 
            fontWeight: 500, 
            color: isViewed ? '#94A3B8' : '#059669' 
          }}>
            {isViewed ? 'Visto' : 'Nueva oportunidad'}
          </span>

          <span 
            className="project-card-cta"
            style={{ 
              fontSize: 11, 
              fontFamily: FONT, 
              fontWeight: 600, 
              color: '#1B6FE8', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4,
              padding: '4px 12px',
              borderRadius: 20,
              background: '#EFF6FF',
              transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
              cursor: 'pointer',
            }}
          >
            Postular 
            <ArrowRight size={11} style={{ color: '#1B6FE8', transition: 'color 0.3s' }} />
          </span>
        </div>
      </motion.div>
    </>
  );
};

/* ═══════════════════════════════════════════════
   SUB: PerfilWidget (sidebar)
═══════════════════════════════════════════════ */
const PerfilWidget = ({ completitud = 0, sugerencias = [], style = {} }) => {
  const R    = 34;
  const circ = 2 * Math.PI * R;
  const offset = circ - (circ * Math.min(completitud, 100)) / 100;

  return (
    <Panel delay={0.20} style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', ...style }}>
      <div style={{ margin:'-24px -24px 18px -24px', padding:'14px 24px', borderBottom:'1px solid #F1F5F9', borderRadius:'22px 22px 0 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontSize:14, fontFamily:FONT, fontWeight:600, letterSpacing:'-0.01em', color:'#0F1F3D', display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ display:'block', width:3, height:14, background:'#1B6FE8', borderRadius:2, flexShrink:0 }} />
          Mi perfil
        </div>
        <Link to="/perfil" style={{ fontSize:11, fontFamily:FONT, fontWeight:600, color:'#1B6FE8', cursor:'pointer', display:'flex', alignItems:'center', gap:4, textDecoration:'none' }}>Ver perfil <ArrowRight size={12} /></Link>
      </div>

      {/* contenido centrado */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Anillo */}
        <div style={{ position: 'relative', width: 96, height: 96, marginBottom: 14 }}>
          <svg width="96" height="96" viewBox="0 0 96 96" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="48" cy="48" r="40" stroke="#f1f5f9" strokeWidth="7" fill="none" />
            <circle
              cx="48" cy="48" r="40"
              stroke="#1B6FE8" strokeWidth="7" fill="none"
              strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 - (2 * Math.PI * 40 * Math.min(completitud, 100)) / 100}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 18, fontFamily: FONT, fontWeight: 700, color: '#1B6FE8' }}>
            {completitud}%
          </div>
        </div>

        {completitud === 100 ? (
          <div style={{ fontSize: 12, fontFamily: FONT, color: '#059669', fontWeight: 600, marginBottom: 16 }}>Perfil completado</div>
        ) : (
          <div style={{ fontSize: 11, fontFamily: FONT, color: '#64748B', marginBottom: 16 }}>{completitud}% completado</div>
        )}

        {/* Sugerencias */}
        {completitud < 100 && sugerencias.length > 0 && (
          <div style={{ width: '100%', marginBottom: 16 }}>
            {sugerencias.map((s, i) => (
              <div key={i} style={{ fontSize: 12, fontFamily: FONT, color: '#64748B', padding: '6px 12px', background: '#F8FAFC', borderRadius: 8, marginBottom: 6, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#CBD5E1', flexShrink: 0 }} />
                {s}
              </div>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
};

/* ═══════════════════════════════════════════════
   SUB: ActiveProjectCard
═══════════════════════════════════════════════ */
const ActiveProjectCard = ({ postulacion }) => {
  const nav = useNavigate();
  const isEnRevision = postulacion.proyectoEstado === 'EN_REVISION';
  const badgeColor   = isEnRevision ? '#d97706' : '#059669';
  const badgeBg      = isEnRevision ? '#fffbeb' : '#ecfdf5';
  const badgeText    = isEnRevision ? 'En revisión' : 'En desarrollo';

  return (
    <div
      style={{
        background:   '#FCFDFD',
        border:       '1px solid #F1F5F9',
        borderLeft:   '3px solid #1B6FE8',
        borderRadius: 14,
        padding:      16,
        position:     'relative',
        overflow:     'hidden',
        flex:         1,
        minWidth:     220,
        boxShadow:    '0 2px 4px rgba(15,23,42,0.01)',
      }}
    >
      <div style={{ fontSize: 14, fontFamily: FONT, fontWeight: 600, color: '#0F1F3D', marginBottom: 5, lineHeight: 1.3 }}>
        {postulacion.proyectoTitulo || 'Proyecto activo'}
      </div>
      <div style={{ fontSize: 12, fontFamily: FONT, color: '#64748B', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
        <Building2 size={11} /> {postulacion.mypeNombre || 'MYPE'}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: 9, fontFamily: FONT, fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase', padding: '2px 8px',
          borderRadius: 4, background: badgeBg, color: badgeColor,
        }}>
          {badgeText}
        </span>
        <button
          onClick={() => nav(`/workspace/${postulacion.proyectoId}`)}
          style={{
            fontSize: 11, fontFamily: FONT, fontWeight: 600, color: '#1B6FE8',
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 3,
          }}
        >
          Ir al workspace <ArrowRight size={11} />
        </button>
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
        padding: '68px 40px', color: '#fff',
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
              <div style={{ fontSize: 34, fontWeight: 500, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1, fontFamily: FONT }}>
                {stat.num}
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4, fontFamily: FONT }}>
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
  const { data: userProfile } = usePerfil();
  const navigate = useNavigate();
  const { mutate: leerNotificacion } = useLeerNotificacion();
  const [isNotifPanelOpen, setIsNotifPanelOpen] = React.useState(false);
  const [expandido, setExpandido] = React.useState(null);

  const { data: postulaciones } = useMisPostulaciones();
  const { data: certificados } = useCertificados();
  const { data: notificaciones, isLoading: loadingNotificaciones } = useNotificaciones();
  const { data: proyectosData, isLoading: loadingProyectos } = useProyectos();

  const user = userProfile || authUser;

  const totalPostulaciones    = postulaciones?.length || 0;
  const aceptados             = postulaciones?.filter(p => p.estado === 'CONFIRMADO' || p.estado === 'ACEPTADO' || p.estado === 'Aceptado').length || 0;
  const totalCertificados     = certificados?.length || 0;
  const activityItems         = notificaciones?.slice(0, 5) || [];
  const proyectosRecomendados = proyectosData?.content?.slice(0, 3) || [];
  const proyectosActivos      = postulaciones?.filter(
    p => p.estado === 'CONFIRMADO' && ['EN_DESARROLLO', 'EN_REVISION'].includes(p.proyectoEstado)
  ) || [];

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

  const sugerencias = [
    !user?.cvUrl        && 'Agrega tu CV',
    !user?.linkedinUrl  && 'Conecta tu LinkedIn',
    !user?.bio          && 'Completa tu biografía',
    !user?.telefono     && 'Agrega tu teléfono',
  ].filter(Boolean).slice(0, 3);

  const firstName = user?.nombre?.split(' ')[0] || 'Estudiante';
  const { viewed, markViewed } = useViewedProjects();

 const empresas = React.useMemo(() => {
  if (!proyectosData?.content) return [];
  const seen = new Set();
  return proyectosData.content.reduce((acc, p) => {
    if (p.mypeId && !seen.has(p.mypeId)) {
      seen.add(p.mypeId);
      acc.push({ 
        id: p.mypeId, 
        nombre: p.mypeNombre || 'Empresa',
        fotoPerfil: p.mypeFotoPerfil || null, // ← NUEVO
      });
    }
    return acc;
  }, []);
}, [proyectosData]);

  const S = {
    sectionTitle: { fontSize:14, fontFamily:FONT, fontWeight:600, letterSpacing:'-0.01em', color:'#0F1F3D', display:'flex', alignItems:'center', gap:8 },
    sectionBar:   { display:'block', width:3, height:14, background:'#1B6FE8', borderRadius:2, flexShrink:0 },
    seeAll:       { fontSize:11, fontFamily:FONT, fontWeight:600, color:'#1B6FE8', cursor:'pointer', display:'flex', alignItems:'center', gap:4, textDecoration:'none' },
  };

  return (
    <div style={{ fontFamily: FONT, background:'#f8fafc', minHeight:'100vh', padding:'32px 32px', maxWidth:1400, margin:'0 auto' }}>
      <style>{`
        @keyframes vping { 75%, 100% { transform: scale(2.4); opacity: 0; } }
        @keyframes vpulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        @keyframes vshimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes gradientFlow {
          0%   { background-position: 0%   50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0%   50%; }
        }
        @keyframes floatOrb {
          0%,100% { transform: translate(0,0) scale(1); }
          40%     { transform: translate(-8px,12px) scale(1.06); }
          70%     { transform: translate(10px,-6px) scale(0.96); }
        }
      `}</style>

      {/* ── TOPBAR ── */}
      <motion.div {...fadeUp(0)} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:600, letterSpacing:'-0.03em', color:'#0F1F3D', fontFamily: FONT }}>
            ¡Hola, {firstName}!
          </h1>
          <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0 0', fontFamily: FONT }}>
            Tu panel de control profesional
          </p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Link to="/proyectos" style={{ textDecoration:'none' }}>
            <div
              style={{ display:'flex', alignItems:'center', gap:8, background:'#fff', border:'1px solid #F1F5F9', borderRadius:8, padding:'8px 14px', fontSize:12, fontFamily:FONT, color:'#64748B', cursor:'pointer', transition:'all 0.15s', boxShadow:'0 1px 3px rgba(15,23,42,0.04)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#BFDBFE'; e.currentTarget.style.color='#1B6FE8'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='#F1F5F9'; e.currentTarget.style.color='#64748B'; }}
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
            <Bell size={16} color="#64748B" />
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

      {/* ── EMPRESAS ── */}
      {empresas.length > 0 && (
        <motion.div {...fadeUp(0.16)} style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
            <div style={S.sectionTitle}>
              <span style={S.sectionBar} />Las empresas
              <CountChip count={empresas.length} />
            </div>
          </div>
          <EmpresasCarousel empresas={empresas} />
        </motion.div>
      )}

      {/* ── PROYECTOS ACTIVOS (ancho completo, solo si hay) ── */}
      {proyectosActivos.length > 0 && (
        <Panel delay={0.18} style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={S.sectionTitle}><span style={S.sectionBar} />Tus proyectos activos<CountChip count={proyectosActivos.length} /></div>
            <Link to="/mis-postulaciones" style={S.seeAll}>Ver todo <ArrowRight size={12} /></Link>
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {proyectosActivos.map(p => (
              <ActiveProjectCard key={p.id || p.proyectoId} postulacion={p} />
            ))}
          </div>
        </Panel>
      )}

      {/* ── FILA 1: Proyectos recomendados 60% | Actividad reciente 40% ── */}
<div style={{ display: 'grid', gridTemplateColumns: '60fr 40fr', gap: 20, alignItems: 'stretch', marginBottom: 20 }}>

  <Panel delay={0.20} style={{
    height: '100%', boxSizing: 'border-box',
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    boxShadow: '0 2px 8px rgba(15,23,42,0.06)',
  }}>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
      <div style={S.sectionTitle}><span style={{ ...S.sectionBar, background:'#F59E0B' }} />Proyectos recomendados</div>
      <Link to="/proyectos" style={{ ...S.seeAll, color:'#D97706' }}>Explorar todos <ArrowRight size={12} /></Link>
    </div>
    {loadingProyectos ? (
      <div style={{ padding:36, textAlign:'center', color:'#94A3B8', fontSize:12, fontFamily:FONT }}>
        <svg style={{ animation:'spin 1s linear infinite', height:20, width:20, color:'#1B6FE8', display:'block', margin:'0 auto 8px' }} viewBox="0 0 24 24">
          <circle style={{ opacity:0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path style={{ opacity:0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Buscando las mejores oportunidades…
      </div>
    ) : proyectosRecomendados.length === 0 ? (
      <div style={{ padding:36, textAlign:'center', color:'#94A3B8', fontSize:12, fontFamily:FONT, border:'1px dashed #E2E8F0', borderRadius:10 }}>
        No hay proyectos disponibles por el momento.
      </div>
    ) : (
      <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:14 }}>
        {proyectosRecomendados.map(p => (
          <ProjectCard
            key={p.id}
            proyecto={p}
            isViewed={viewed.has(String(p.id))}
            onView={markViewed}
          />
        ))}
      </div>
    )}
  </Panel>

  {/* ════════════════════════════════════════════════
      PANEL DE ACTIVIDAD RECIENTE - NUEVO DISEÑO WHATSAPP
      ════════════════════════════════════════════════ */}
  <Panel delay={0.22} style={{
    height: '100%', boxSizing: 'border-box',
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    boxShadow: '0 2px 8px rgba(15,23,42,0.06)',
  }}>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
      <div style={S.sectionTitle}>
        <span style={{ ...S.sectionBar, background:'#06B6D4' }} />
        Actividad reciente
        {activityItems.filter(n => !n.leida).length > 0 && (
          <span style={{
            background: '#1B6FE8',
            color: '#FFFFFF',
            fontSize: 9,
            fontWeight: 700,
            borderRadius: 10,
            padding: '1px 8px',
            marginLeft: 4,
            fontFamily: FONT,
          }}>
            {activityItems.filter(n => !n.leida).length}
          </span>
        )}
      </div>
      <button
        onClick={() => setIsNotifPanelOpen(true)}
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#0891B2',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontFamily: FONT,
        }}
      >
        Ver todo <ArrowRight size={12} />
      </button>
    </div>

    {loadingNotificaciones ? (
      <div style={{ padding:16, textAlign:'center', color:'#94A3B8', fontSize:12, fontFamily:FONT }}>Cargando actividad…</div>
    ) : activityItems.length === 0 ? (
      <div style={{ padding:20, textAlign:'center', color:'#94A3B8', fontSize:12, fontFamily:FONT, border:'1px dashed #E2E8F0', borderRadius:10 }}>
        No hay actividad reciente.
      </div>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {activityItems.map((item, index) => {
          const key = item.id || index;
          const isOpen = expandido === key;
          const isLeida = item.leida;
          const url = item.urlReferencia
            ? (item.urlReferencia.startsWith('/') ? item.urlReferencia : `/${item.urlReferencia}`)
            : null;
          const clickable = url && (url.startsWith('/mis-postulaciones') || url.startsWith('/proyectos'));

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => {
                if (!isLeida) leerNotificacion(item.id);
                setExpandido(isOpen ? null : key);
              }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 12,
                background: isLeida ? 'transparent' : '#EFF6FF',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isLeida ? '#F8FAFC' : '#DBEAFE';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isLeida ? 'transparent' : '#EFF6FF';
              }}
            >
              {/* Indicador de no leído (punto azul estilo WhatsApp) */}
              {!isLeida && (
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#1B6FE8',
                  flexShrink: 0,
                  marginTop: 5,
                }} />
              )}

              {/* Contenido */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13,
                  fontWeight: isLeida ? 500 : 600,
                  color: isLeida ? '#64748B' : '#0F1F3D',
                  lineHeight: 1.4,
                  fontFamily: FONT,
                }}>
                  {item.titulo}
                </div>

                <div style={{
                  fontSize: 11,
                  color: '#94A3B8',
                  marginTop: 2,
                  fontFamily: FONT,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}>
                  {tiempoRelativo(item.fechaCreacion)}
                  {isLeida && (
                    <span style={{
                      fontSize: 9,
                      color: '#94A3B8',
                      background: '#F1F5F9',
                      padding: '0px 6px',
                      borderRadius: 4,
                    }}>
                      Leído
                    </span>
                  )}
                </div>

                {/* Mensaje expandido */}
                {isOpen && item.mensaje && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{
                      fontSize: 12,
                      color: '#475569',
                      marginTop: 8,
                      paddingTop: 8,
                      borderTop: '1px solid #F1F5F9',
                      lineHeight: 1.5,
                      fontFamily: FONT,
                    }}>
                      {item.mensaje}
                    </div>
                    {clickable && (
                      <button
                        onClick={e => { e.stopPropagation(); navigate(url); }}
                        style={{
                          marginTop: 8,
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#1B6FE8',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                          padding: 0,
                          fontFamily: FONT,
                        }}
                      >
                        Ver detalle <ArrowRight size={11} />
                      </button>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Flecha expandir */}
              {item.mensaje && (
                <motion.div
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    flexShrink: 0,
                    marginTop: 2,
                    color: '#94A3B8',
                  }}
                >
                  <ChevronRight size={16} />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    )}
  </Panel>
</div>

      {/* ── FILA 2: Mi perfil 40% | Calificaciones pendientes 60% ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '40fr 60fr', gap: 20, alignItems: 'stretch' }}>

        <PerfilWidget completitud={completitud} sugerencias={sugerencias} style={{
          height: '100%', boxSizing: 'border-box',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          boxShadow: '0 2px 8px rgba(15,23,42,0.06)',
        }} />

        <CalificacionesPendientesCard />

      </div>

      <NotificacionesPanel
        isOpen={isNotifPanelOpen}
        onClose={() => setIsNotifPanelOpen(false)}
      />
    </div>
  );
};

export default EstudianteDashboardPage;