import React, { useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useMisPostulaciones } from '../../features/postulaciones-list/useMisPostulaciones';
import { useCertificados } from '../../features/certificados/useCertificados';
import { useNotificaciones, useLeerNotificacion } from '../../features/notificaciones/useNotificaciones';
import { useProyectos } from '../../features/proyectos-list/useProyectos';
import {
  ArrowRight,
  Award,
  Building2,
  Send,
  Bell,
  Search,
  ScanFace,
  Compass,
  ClipboardList,
  BadgeCheck,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { NotificacionesPanel } from '../../features/notificaciones/NotificacionesPanel';

/* ─── Variantes de animación ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

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

/* ═══════════════════════════════════════════════
   SUB: Ring SVG
═══════════════════════════════════════════════ */
const Ring = ({ pct = 0, color = '#1B6FE8', icon: Icon }) => {
  const R = 22;
  const circ = 2 * Math.PI * R;
  const offset = circ - (circ * Math.min(pct, 100)) / 100;
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
   SUB: Metric Card
═══════════════════════════════════════════════ */
const MetricCard = ({ label, value, sub, linkTo, linkLabel, color, accentColor, icon: Icon, pct }) => (
  <Link to={linkTo} style={{ textDecoration: 'none' }}>
    <div
      style={{
        background: '#fff', border: '0.5px solid #e8e8e4', borderRadius: 16,
        padding: '20px 22px', display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', transition: 'all 0.25s',
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.07)';
        e.currentTarget.querySelector('.accent-bar').style.transform = 'scaleX(1)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.querySelector('.accent-bar').style.transform = 'scaleX(0)';
      }}
    >
      <div className="accent-bar" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
        background: accentColor, transform: 'scaleX(0)', transformOrigin: 'left',
        transition: 'transform 0.35s', borderRadius: '0 0 16px 16px',
      }} />
      <div>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b6b7a', marginBottom: 6 }}>
          {label}
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, color: '#0f1f3d' }}>
          {value}
        </div>
        {sub && <div style={{ fontSize: 11, color: '#6b6b7a', marginTop: 4 }}>{sub}</div>}
        {linkLabel && (
          <div style={{ fontSize: 11, fontWeight: 600, color, marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            {linkLabel} <ArrowRight size={12} />
          </div>
        )}
      </div>
      <Ring pct={pct} color={color} icon={Icon} />
    </div>
  </Link>
);

/* ─── SUB: Project Card (MODIFICADO PARA NAVEGAR CON ESTADO) ─── */
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
    // Navegar a proyectos con el ID del proyecto seleccionado
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
   SUB: Hero Banner Animado (Efecto Moderno - Fade + Slide + Scale)
═══════════════════════════════════════════════ */
const HeroBanner = ({ proyectosTotal = 0, aceptados = 0 }) => {
  const canvasRef = useRef(null);
  const heroRef   = useRef(null);
  const [currentWordIndex, setCurrentWordIndex] = React.useState(0);
  const [displayWord, setDisplayWord] = React.useState('real');
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [counts, setCounts] = React.useState({ a: 0, b: 0 });

  const words = [
    { text: 'real', color: '#67d4f8' },
    { text: 'profesional', color: '#f59e0b' },
    { text: 'ahora', color: '#4ade80' },
    { text: 'exitoso', color: '#c084fc' }
  ];

  /* Cambio de palabra con animación moderna */
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

  /* Inicializar primera palabra */
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
    const targets = { a: proyectosTotal || 0, b: aceptados || 0 };
    if (targets.a === 0 && targets.b === 0) {
      setCounts({ a: 0, b: 0 });
      return;
    }
    const dur = 1400, start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      setCounts({ a: Math.round(e * targets.a), b: Math.round(e * targets.b) });
      if (p < 1) requestAnimationFrame(step);
    };
    const tid = setTimeout(() => requestAnimationFrame(step), 600);
    return () => clearTimeout(tid);
  }, [proyectosTotal, aceptados]);

  /* Avatares */
  const teamAvatars = [
    { bg: '#1B6FE8', l: 'C' },
    { bg: '#059669', l: 'A' },
    { bg: '#8B5CF6', l: 'M' },
    { bg: '#d4580a', l: 'J' },
  ];

  return (
    <motion.div
      ref={heroRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: 20,
        background: 'linear-gradient(135deg,#0d1b35 0%,#0f2a4a 60%,#0a2240 100%)',
        padding: '36px 40px 68px', color: '#fff',
        marginBottom: 20, minHeight: 200,
        display: 'flex', alignItems: 'center',
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

        {/* Tag pulsante */}
        <motion.div
          initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
          transition={{ delay:0.1, duration:0.5 }}
          style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:20, padding:'5px 14px', fontSize:10, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)', marginBottom:18 }}
        >
          <span style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', display:'inline-block', animation:'heroPulse 2s ease-in-out infinite' }} />
          Portal de estudiantes · 
        </motion.div>

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
          style={{ fontSize:13, fontWeight:400, color:'rgba(255,255,255,0.45)', lineHeight:1.65, marginBottom:24 }}
        >
          Proyectos reales con empresas de Cajamarca.<br />
          Construye tu portafolio mientras estudias.
        </motion.p>

        {/* Botón CTA */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.56, duration:0.6 }}>
          <Link to="/proyectos" style={{ textDecoration:'none' }}>
            <button
              style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#fff', color:'#0f1f3d', padding:'10px 20px', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer', border:'none', transition:'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.background='#1B6FE8'; e.currentTarget.style.color='#fff'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(27,111,232,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.color='#0f1f3d'; e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}
            >
              Ver proyectos recomendados <ArrowRight size={14} />
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
        transition={{ delay:0.7, duration:0.7 }}
        style={{ position:'absolute', right:40, top:'50%', transform:'translateY(-60%)', zIndex:10, display:'flex', flexDirection:'column', gap:12 }}
      >
        {[
          { val: counts.a, label:'Proyectos abiertos', bar:'linear-gradient(90deg,#1B6FE8,#06B6D4)', w:'80%' },
          { val: counts.b, label:'Aceptados',          bar:'linear-gradient(90deg,#d4580a,#f59e0b)', w:'60%' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign:'center', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:'12px 20px', minWidth:130 }}>
            <div style={{ fontSize:26, fontWeight:800, color:'#67d4f8', letterSpacing:'-0.04em', lineHeight:1 }}>{s.val}</div>
            <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:4 }}>{s.label}</div>
            <div style={{ height:2, background:'rgba(255,255,255,0.08)', borderRadius:1, marginTop:6, overflow:'hidden' }}>
              <motion.div
                initial={{ scaleX:0 }} animate={{ scaleX:1 }}
                transition={{ delay: 0.9 + i * 0.2, duration:1.2, ease:[0.22,1,0.36,1] }}
                style={{ height:'100%', width:s.w, background:s.bar, borderRadius:1, transformOrigin:'left' }}
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Badge avatares */}
      <motion.div
        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.88, duration:0.5 }}
        style={{ position:'absolute', left:40, bottom:16, zIndex:10, display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:20, padding:'5px 14px' }}
      >
        <div style={{ display:'flex' }}>
          {teamAvatars.map((av, i) => (
            <div key={i} style={{ width:18, height:18, borderRadius:'50%', border:'1.5px solid rgba(255,255,255,0.15)', marginLeft: i === 0 ? 0 : -5, background:av.bg, fontSize:8, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {av.l}
            </div>
          ))}
        </div>
        <span style={{ fontSize:11, color:'rgba(255,255,255,0.45)' }}>
          <strong style={{ color:'rgba(255,255,255,0.75)', fontWeight:600 }}>+24 estudiantes</strong> registrados
        </span>
      </motion.div>

      {/* Línea inferior */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:1.5, background:'linear-gradient(90deg,transparent,rgba(27,111,232,0.5) 30%,rgba(6,182,212,0.5) 60%,transparent)' }} />
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════ */
const EstudianteDashboardPage = () => {
  const { user }  = useAuthStore();
  const navigate  = useNavigate();
  const { mutate: leerNotificacion } = useLeerNotificacion();
  const [isNotifPanelOpen, setIsNotifPanelOpen] = React.useState(false);
  const [lastUpdate, setLastUpdate] = React.useState(new Date());

  const { data: postulaciones,  isLoading: loadingPostulaciones  } = useMisPostulaciones();
  const { data: certificados,   isLoading: loadingCertificados   } = useCertificados();
  const { data: notificaciones, isLoading: loadingNotificaciones } = useNotificaciones();
  const { data: proyectosData,  isLoading: loadingProyectos      } = useProyectos();

  const totalPostulaciones    = postulaciones?.length || 0;
  const aceptados             = postulaciones?.filter(p => p.estado === 'CONFIRMADO' || p.estado === 'ACEPTADO' || p.estado === 'Aceptado').length || 0;
  const totalCertificados     = certificados?.length || 0;
  const activityItems         = notificaciones?.slice(0, 3) || [];
  const proyectosRecomendados = proyectosData?.content?.slice(0, 3) || [];
  const proyectosActivos      = postulaciones?.filter(p => p.estado === 'CONFIRMADO' || p.estado === 'ACEPTADO' || p.estado === 'Aceptado') || [];

  let completitud = 20;
  if (user?.bio)                               completitud += 20;
  if (user?.skills?.length > 0)               completitud += 20;
  if (user?.telefono)                         completitud += 20;
  if (user?.linkedinUrl || user?.portafolioUrl) completitud += 20;

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

      {/* ── TOPBAR ── */}
      <motion.div {...fadeUp(0)} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, letterSpacing:'-0.03em', color:'#0f1f3d' }}>
            ¡Hola, {firstName}!
          </h1>
         <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2, flexWrap: 'wrap' }}>
    <p style={{ fontSize: 13, color: '#6b6b7a', margin: 0 }}>
        {proyectosRecomendados.length > 0
            ? `${proyectosRecomendados.length} proyectos nuevos esperándote`
            : 'Tu panel de control profesional'}
            </p>
            <div style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    background: '#ecfdf5',
    border: '1px solid #a7f3d0',
    borderRadius: 12,
    padding: '3px 10px',
    fontSize: 10,
    color: '#059669',
    fontWeight: 600,
}}>
    <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        style={{ display: 'inline-flex' }}
    >
        <RefreshCw size={11} />
    </motion.span>
    Actualización automática
</div>
        </div>
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
    position: 'relative',
    width: 36,
    height: 36,
    borderRadius: 8,
    border: '0.5px solid #e8e8e4',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  }}
>
  <Bell size={16} color="#6b6b7a" />
  {activityItems.some(n => !n.leida) && (
    <div style={{
      position: 'absolute',
      top: 7,
      right: 7,
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: '#d4580a',
      border: '1.5px solid #fff',
    }} />
  )}
</button>
        </div>
      </motion.div>

      

      {/* ── HERO BANNER ANIMADO ── */}
      <HeroBanner
        proyectosTotal={proyectosData?.totalElements}
        aceptados={aceptados}
      />

      {/* ── MÉTRICAS ── */}
      <motion.div {...fadeUp(0.16)} style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
        <MetricCard
          label="Mi perfil"
          value={loadingPostulaciones ? '...' : `${completitud}%`}
          sub="Completitud"
          linkTo="/perfil"
          linkLabel="Completar datos"
          color="#1B6FE8"
          accentColor="linear-gradient(90deg,#1B6FE8,#06B6D4)"
          icon={ScanFace}
          pct={completitud}
        />
        <MetricCard
          label="Aplicaciones"
          value={loadingPostulaciones ? '...' : totalPostulaciones}
          sub={`${aceptados} aceptadas · ${totalPostulaciones - aceptados} pendientes`}
          linkTo="/mis-postulaciones"
          linkLabel="Ver historial"
          color="#d4580a"
          accentColor="linear-gradient(90deg,#d4580a,#f59e0b)"
          icon={ClipboardList}
          pct={porcentajeExito}
        />
        <MetricCard
          label="Reconocimientos"
          value={loadingCertificados ? '...' : totalCertificados}
          sub="Certificados obtenidos"
          linkTo="/certificados"
          linkLabel="Ver logros"
          color="#059669"
          accentColor="linear-gradient(90deg,#059669,#06B6D4)"
          icon={BadgeCheck}
          pct={totalCertificados > 0 ? 100 : 0}
        />
      </motion.div>

      {/* ── PROYECTOS RECOMENDADOS ── */}
      <motion.section {...fadeUp(0.20)} style={{ marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div style={S.sectionTitle}><span style={S.sectionBar} />Proyectos recomendados para ti</div>
          <Link to="/proyectos" style={S.seeAll}>Explorar todos <ArrowRight size={12} /></Link>
        </div>

        {loadingProyectos ? (
          <div style={{ background:'#fff', borderRadius:14, border:'0.5px solid #e8e8e4', padding:36, textAlign:'center', color:'#6b6b7a', fontSize:13 }}>
            <svg style={{ animation:'spin 1s linear infinite', height:20, width:20, color:'#1B6FE8', display:'block', margin:'0 auto 8px' }} viewBox="0 0 24 24">
              <circle style={{ opacity:0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path style={{ opacity:0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Buscando las mejores oportunidades…
          </div>
        ) : proyectosRecomendados.length === 0 ? (
          <div style={{ background:'#fff', borderRadius:14, border:'0.5px dashed #e8e8e4', padding:36, textAlign:'center', color:'#6b6b7a', fontSize:13 }}>
            No hay proyectos disponibles por el momento.
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
            {proyectosRecomendados.map(p => <ProjectCard key={p.id} proyecto={p} />)}
          </div>
        )}
      </motion.section>

      {/* ── FILA INFERIOR: ACTIVIDAD + ACCIONES RÁPIDAS ── */}
      <motion.div {...fadeUp(0.24)} style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:16 }}>

        {/* Actividad reciente */}
        <div style={{ background:'#fff', border:'0.5px solid #e8e8e4', borderRadius:16, padding:22 }}>
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
            activityItems.map((item, index) => {
    const dotColors = ['#1B6FE8', '#d4580a', '#059669'];
    
    const getRutaNotificacion = (notif) => {
    // Si tiene urlReferencia válida
    if (notif.urlReferencia && notif.urlReferencia.trim() !== '') {
        return notif.urlReferencia.startsWith('/') 
            ? notif.urlReferencia 
            : `/${notif.urlReferencia}`;
    }
    
    // Si no tiene, ir a mis-postulaciones
    return '/mis-postulaciones';
      };
          
          return (
              <div
                  key={item.id || index}
                  onClick={() => {
                      if (!item.leida) {
                          leerNotificacion(item.id);
                      }
                      const ruta = getRutaNotificacion(item);
                      navigate(ruta);
                  }}
                  style={{ 
                      display:'flex', 
                      alignItems:'flex-start', 
                      gap:12, 
                      padding:'12px 8px', 
                      borderBottom: index < activityItems.length - 1 ? '0.5px solid #e8e8e4' : 'none', 
                      cursor:'pointer', 
                      borderRadius: 8,
                      transition:'all 0.2s' 
                  }}
                  onMouseEnter={e => { 
                      e.currentTarget.style.paddingLeft = '12px'; 
                      e.currentTarget.style.background = '#f8fafc'; 
                  }}
                  onMouseLeave={e => { 
                      e.currentTarget.style.paddingLeft = '8px'; 
                      e.currentTarget.style.background = 'transparent'; 
                  }}
              >
                  <div style={{ 
                      width:8, 
                      height:8, 
                      borderRadius:'50%', 
                      background: dotColors[index % dotColors.length], 
                      flexShrink:0, 
                      marginTop:5 
                  }} />
                  <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, color:'#0f1f3d', lineHeight:1.45 }}>
                          <strong style={{ fontWeight:600 }}>{item.titulo}</strong>
                          {item.mensaje && (
                              <span style={{ fontWeight:400, color:'#6b6b7a', marginLeft: 4 }}>
                                  {item.mensaje}
                              </span>
                          )}
                      </div>
                      <div style={{ fontSize:11, color:'#6b6b7a', marginTop:4 }}>
                          {item.fechaCreacion 
                              ? new Date(item.fechaCreacion).toLocaleDateString('es-PE', { 
                                  day:'numeric', 
                                  month:'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'Fecha no disponible'}
                      </div>
                  </div>
                  {!item.leida && (
                      <div style={{ 
                          width:8, 
                          height:8, 
                          borderRadius:'50%', 
                          background:'#1B6FE8', 
                          marginTop:5, 
                          flexShrink:0,
                          boxShadow: '0 0 0 3px rgba(27,111,232,0.15)'
                      }} />
                  )}
              </div>
          );
      })
          )}
        </div>

        {/* Acciones rápidas */}
        <div style={{ background:'#fff', border:'0.5px solid #e8e8e4', borderRadius:16, padding:22 }}>
          <div style={{ ...S.sectionTitle, marginBottom:14 }}><span style={S.sectionBar} />Acciones rápidas</div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
            {[
              { to:'/perfil',            icon:ScanFace,      label:'Mi perfil',    bg:'#eff6ff', color:'#1B6FE8' },
              { to:'/proyectos',         icon:Compass,       label:'Explorar',     bg:'#f0fdf4', color:'#059669' },
              { to:'/mis-postulaciones', icon:ClipboardList, label:'Aplicaciones', bg:'#f5f3ff', color:'#8B5CF6' },
              { to:'/certificados',      icon:BadgeCheck,    label:'Certificados', bg:'#fff7ed', color:'#d4580a' },
            ].map(({ to, icon: Icon, label, bg, color }) => (
              <Link key={to} to={to} style={{ textDecoration:'none' }}>
                <div
                  style={{ borderRadius:12, border:'0.5px solid #e8e8e4', background:'#fafaf8', padding:'14px 10px', display:'flex', flexDirection:'column', alignItems:'center', gap:8, cursor:'pointer', transition:'all 0.25s', textAlign:'center' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor='rgba(27,111,232,0.25)'; e.currentTarget.style.background='#f0f6ff'; e.currentTarget.style.boxShadow='0 6px 20px rgba(27,111,232,0.07)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='#e8e8e4'; e.currentTarget.style.background='#fafaf8'; e.currentTarget.style.boxShadow='none'; }}
                >
                  <div style={{ width:36, height:36, borderRadius:10, background:bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon size={17} color={color} />
                  </div>
                  <span style={{ fontSize:11, fontWeight:600, color:'#0f1f3d' }}>{label}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Portafolio profesional */}
          <Link to="/perfil" style={{ textDecoration:'none' }}>
            <div
              style={{ background:'#f8f6f2', border:'0.5px solid #e8e4dc', borderRadius:12, padding:16, position:'relative', overflow:'hidden', cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background='#f2efe8'; e.currentTarget.style.borderColor='#d4c9b8'; e.currentTarget.style.transform='translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='#f8f6f2'; e.currentTarget.style.borderColor='#e8e4dc'; e.currentTarget.style.transform='none'; }}
            >
              <div style={{ position:'absolute', top:0, left:0, width:3, height:'100%', background:'linear-gradient(to bottom,#d4580a,#f59e0b)', borderRadius:0 }} />
              <div style={{ paddingLeft:12 }}>
                <div style={{ fontSize:10, fontWeight:600, color:'#b07040', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:5 }}>
                  Portafolio profesional
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:'#3d2b1f', lineHeight:1.35, marginBottom:10 }}>
                  Completa tu perfil y destaca entre los demás
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, fontWeight:700, color:'#d4580a' }}>
                  Completar ahora <ArrowRight size={11} />
                </div>
              </div>
            </div>
          </Link>
        </div>
          
      </motion.div>
      {/* Panel de Notificaciones */}
      <NotificacionesPanel 
        isOpen={isNotifPanelOpen} 
        onClose={() => setIsNotifPanelOpen(false)} 
      />
    </div>
  );
};

export default EstudianteDashboardPage;