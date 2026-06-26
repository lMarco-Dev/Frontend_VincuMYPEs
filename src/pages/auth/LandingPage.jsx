import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  ArrowRight, Building2, GraduationCap, CheckCircle2,
  Globe, BarChart2, Shield, Wifi, Pen,
  ChevronRight, Database, PenTool,
  ShieldCheck, UserCheck, Layers,
  Mail, MapPin, Menu, X
} from "lucide-react";
import { Logo } from "@shared/ui/Logo";
import { TermsModal } from "./components/TermsModal";

/* ════════════════════════════════════════════
   ANIMACIÓN SVG DEL HERO — red viva MYPE↔Plataforma↔Estudiante
   ════════════════════════════════════════════ */
function HeroAnimation() {
  /* Nodos principales */
  const PL  = { cx:280, cy:390, r:44 };   // Plataforma (centro-bajo)
  const MY  = { cx:110, cy:155, r:38 };   // Empresa (arriba-izq)
  const EST = { cx:450, cy:165, r:38 };   // Estudiante (arriba-der)
  /* Satélites */
  const SAT = [
    { cx:155, cy:318, r:22, label:"WEB",  color:"#1B6FE8", delay:1.8 },
    { cx:340, cy:138, r:22, label:"DATA", color:"#0891B2", delay:2.2 },
    { cx:438, cy:365, r:22, label:"UX",   color:"#8B5CF6", delay:2.6 },
    { cx:128, cy:455, r:22, label:"TI",   color:"#059669", delay:3.0 },
  ];

  /* Punto exacto en la SUPERFICIE de un nodo en dirección de otro */
  const surf = (from, to, sign) => {
    const dx = to.cx - from.cx, dy = to.cy - from.cy;
    const d  = Math.hypot(dx, dy);
    return { x: from.cx + sign*(dx/d)*from.r, y: from.cy + sign*(dy/d)*from.r };
  };

  /* Paths de conexión — parten y llegan exactamente al borde */
  const A1  = surf(MY, PL, 1),  B1 = surf(PL, MY, -1);
  const A2  = surf(PL, EST, 1), B2 = surf(EST, PL, -1);
  const A3  = surf(EST, MY, 1), B3 = surf(MY, EST, -1);
  const pMP  = `M ${A1.x.toFixed(1)} ${A1.y.toFixed(1)} Q 165 300 ${B1.x.toFixed(1)} ${B1.y.toFixed(1)}`;
  const pPE  = `M ${A2.x.toFixed(1)} ${A2.y.toFixed(1)} Q 420 260 ${B2.x.toFixed(1)} ${B2.y.toFixed(1)}`;
  const pEM  = `M ${A3.x.toFixed(1)} ${A3.y.toFixed(1)} C 370 70 160 65 ${B3.x.toFixed(1)} ${B3.y.toFixed(1)}`;

  return (
    <div style={{
      position:"absolute", top:0, right:0,
      width:"56%", height:"100%",
      pointerEvents:"none", zIndex:1,
      WebkitMaskImage:"linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 12%, black 28%, black 100%)",
      maskImage:"linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 12%, black 28%, black 100%)",
    }}>
      <svg viewBox="0 0 560 600" xmlns="http://www.w3.org/2000/svg"
        style={{ width:"100%", height:"100%" }} aria-hidden="true">
        <defs>
          <linearGradient id="lg-b" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B6FE8"/><stop offset="100%" stopColor="#06B6D4"/>
          </linearGradient>
          <linearGradient id="lg-o" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#d4580a"/>
          </linearGradient>
          <radialGradient id="rg-pl" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d4580a" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="#d4580a" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="rg-my" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1B6FE8" stopOpacity="0.28"/>
            <stop offset="100%" stopColor="#1B6FE8" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="rg-es" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.24"/>
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0"/>
          </radialGradient>
          <filter id="gf">
            <feGaussianBlur stdDeviation="3.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* ── Puntos de fondo ambientales ── */}
        {[
          [45,45],[155,22],[310,35],[468,55],[530,115],
          [42,230],[195,208],[425,225],[525,295],
          [65,500],[215,530],[390,510],[510,480],
        ].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="1.4" fill="rgba(255,255,255,0.08)"/>
        ))}
        <path d="M45,45 L155,22 L310,35 L468,55 L530,115"
          stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none"/>
        <path d="M42,230 L195,208 L425,225 L525,295"
          stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none"/>
        <path d="M45,45 L42,230 M530,115 L525,295 M525,295 L510,480 M65,500 L42,230"
          stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none"/>

        {/* ══ CONEXIONES (renderizadas ANTES de nodos) ══ */}

        {/* Empresa → Plataforma */}
        <motion.path d={pMP}
          stroke="url(#lg-b)" strokeWidth="1.8" strokeDasharray="9 6"
          fill="none" strokeLinecap="round"
          initial={{pathLength:0,opacity:0}}
          animate={{pathLength:1,opacity:0.65}}
          transition={{duration:1.8,delay:0.4,ease:"easeInOut"}}
        />
        {/* Plataforma → Estudiante */}
        <motion.path d={pPE}
          stroke="url(#lg-b)" strokeWidth="1.8" strokeDasharray="9 6"
          fill="none" strokeLinecap="round"
          initial={{pathLength:0,opacity:0}}
          animate={{pathLength:1,opacity:0.65}}
          transition={{duration:1.8,delay:0.9,ease:"easeInOut"}}
        />
        {/* Estudiante → Empresa (arco superior: entregables) */}
        <motion.path d={pEM}
          stroke="rgba(212,88,10,0.5)" strokeWidth="1.5" strokeDasharray="6 9"
          fill="none" strokeLinecap="round"
          initial={{pathLength:0,opacity:0}}
          animate={{pathLength:1,opacity:1}}
          transition={{duration:2.2,delay:1.5,ease:"easeInOut"}}
        />

        {/* Satélites → Plataforma (líneas tenues) */}
        {SAT.map(s=>{
          const sp = surf(s, PL, 1), ep = surf(PL, s, -1);
          return <motion.line key={s.label}
            x1={sp.x.toFixed(1)} y1={sp.y.toFixed(1)}
            x2={ep.x.toFixed(1)} y2={ep.y.toFixed(1)}
            stroke={s.color} strokeWidth="0.9" strokeDasharray="4 7"
            initial={{opacity:0}} animate={{opacity:0.25}}
            transition={{duration:0.8,delay:s.delay+0.4}}
          />;
        })}

        {/* ══ PARTÍCULAS ══ */}
        {/* Empresa → Plataforma */}
        {[0,1].map((d,i)=>(
          <motion.circle key={`pa${i}`} r={i===0?5.5:3.5}
            fill={i===0?"#1B6FE8":"#67d4f8"} filter="url(#gf)"
            animate={{offsetDistance:["0%","100%"],opacity:[0,1,1,0]}}
            style={{offsetPath:`path('${pMP}')`}}
            transition={{duration:2.2,delay:2+d*1.1,repeat:Infinity,repeatDelay:2.6,ease:"easeInOut"}}
          />
        ))}
        {/* Plataforma → Estudiante */}
        {[0,1].map((d,i)=>(
          <motion.circle key={`pb${i}`} r={i===0?5.5:3.5}
            fill={i===0?"#06B6D4":"#38bdf8"} filter="url(#gf)"
            animate={{offsetDistance:["0%","100%"],opacity:[0,1,1,0]}}
            style={{offsetPath:`path('${pPE}')`}}
            transition={{duration:2.0,delay:3+d*0.9,repeat:Infinity,repeatDelay:3,ease:"easeInOut"}}
          />
        ))}
        {/* Estudiante → Empresa: naranja (entregables) */}
        {[0,1].map((d,i)=>(
          <motion.circle key={`pc${i}`} r={i===0?5.5:3.5}
            fill={i===0?"#d4580a":"#f59e0b"} filter="url(#gf)"
            animate={{offsetDistance:["0%","100%"],opacity:[0,1,1,0]}}
            style={{offsetPath:`path('${pEM}')`}}
            transition={{duration:2.8,delay:4.2+d*1.1,repeat:Infinity,repeatDelay:2.5,ease:"easeInOut"}}
          />
        ))}

        {/* ══ NODO PLATAFORMA ══ */}
        <circle cx={PL.cx} cy={PL.cy} r={95} fill="url(#rg-pl)"/>
        <motion.circle cx={PL.cx} cy={PL.cy} r={PL.r+20}
          stroke="rgba(212,88,10,0.2)" strokeWidth="1.2" fill="none"
          animate={{r:[PL.r+20,PL.r+38,PL.r+20]}}
          transition={{duration:4,repeat:Infinity,ease:"easeInOut"}}
        />
        <motion.circle cx={PL.cx} cy={PL.cy} r={PL.r+7}
          stroke="rgba(212,88,10,0.32)" strokeWidth="1.8" fill="none"
          animate={{r:[PL.r+7,PL.r+16,PL.r+7]}}
          transition={{duration:4,delay:0.5,repeat:Infinity,ease:"easeInOut"}}
        />
        <circle cx={PL.cx} cy={PL.cy} r={PL.r}
          fill="#0a1a30" stroke="url(#lg-o)" strokeWidth="2.5"/>
        <text x={PL.cx} y={PL.cy+8} textAnchor="middle" fontSize="24"
          fontFamily="Arial,sans-serif" fontWeight="900" fill="url(#lg-o)">M</text>
        <motion.text x={PL.cx} y={PL.cy+PL.r+19} textAnchor="middle"
          fontSize="9" fontFamily="Arial,sans-serif" fontWeight="700"
          letterSpacing="2.8" fill="rgba(245,158,11,0.6)"
          animate={{opacity:[0.3,0.9,0.3]}}
          transition={{duration:3,repeat:Infinity,ease:"easeInOut"}}>
          MYPELINK
        </motion.text>

        {/* ══ NODO EMPRESA ══ */}
        <circle cx={MY.cx} cy={MY.cy} r={80} fill="url(#rg-my)"/>
        <motion.circle cx={MY.cx} cy={MY.cy} r={MY.r+18}
          stroke="rgba(27,111,232,0.22)" strokeWidth="1.2" fill="none"
          animate={{r:[MY.r+18,MY.r+32,MY.r+18]}}
          transition={{duration:4.5,delay:1,repeat:Infinity,ease:"easeInOut"}}
        />
        <motion.circle cx={MY.cx} cy={MY.cy} r={MY.r+6}
          stroke="rgba(27,111,232,0.38)" strokeWidth="1.8" fill="none"
          animate={{r:[MY.r+6,MY.r+13,MY.r+6]}}
          transition={{duration:4.5,delay:1.4,repeat:Infinity,ease:"easeInOut"}}
        />
        <circle cx={MY.cx} cy={MY.cy} r={MY.r}
          fill="#0a1a30" stroke="url(#lg-b)" strokeWidth="2.5"/>
        <rect x={MY.cx-12} y={MY.cy-8} width="9" height="13" rx="1.2"
          fill="none" stroke="#1B6FE8" strokeWidth="1.8"/>
        <rect x={MY.cx+1}  y={MY.cy-14} width="13" height="19" rx="1.2"
          fill="none" stroke="#1B6FE8" strokeWidth="1.8"/>
        <line x1={MY.cx-15} y1={MY.cy+5} x2={MY.cx+17} y2={MY.cy+5}
          stroke="#1B6FE8" strokeWidth="1.8"/>
        <motion.text x={MY.cx} y={MY.cy+MY.r+18} textAnchor="middle"
          fontSize="9" fontFamily="Arial,sans-serif" fontWeight="700"
          letterSpacing="2.8" fill="rgba(103,212,248,0.6)"
          animate={{opacity:[0.28,0.82,0.28]}}
          transition={{duration:3,delay:0.8,repeat:Infinity,ease:"easeInOut"}}>
          EMPRESA
        </motion.text>

        {/* ══ NODO ESTUDIANTE ══ */}
        <circle cx={EST.cx} cy={EST.cy} r={80} fill="url(#rg-es)"/>
        <motion.circle cx={EST.cx} cy={EST.cy} r={EST.r+18}
          stroke="rgba(6,182,212,0.22)" strokeWidth="1.2" fill="none"
          animate={{r:[EST.r+18,EST.r+32,EST.r+18]}}
          transition={{duration:4.5,delay:2,repeat:Infinity,ease:"easeInOut"}}
        />
        <motion.circle cx={EST.cx} cy={EST.cy} r={EST.r+6}
          stroke="rgba(6,182,212,0.38)" strokeWidth="1.8" fill="none"
          animate={{r:[EST.r+6,EST.r+13,EST.r+6]}}
          transition={{duration:4.5,delay:2.4,repeat:Infinity,ease:"easeInOut"}}
        />
        <circle cx={EST.cx} cy={EST.cy} r={EST.r}
          fill="#0a1a30" stroke="url(#lg-b)" strokeWidth="2.5"/>
        <circle cx={EST.cx} cy={EST.cy-9} r="9"
          fill="none" stroke="#06B6D4" strokeWidth="1.8"/>
        <path d={`M ${EST.cx-14} ${EST.cy+14} C ${EST.cx-14} ${EST.cy+3} ${EST.cx+14} ${EST.cy+3} ${EST.cx+14} ${EST.cy+14}`}
          fill="none" stroke="#06B6D4" strokeWidth="1.8" strokeLinecap="round"/>
        <motion.text x={EST.cx} y={EST.cy+EST.r+18} textAnchor="middle"
          fontSize="9" fontFamily="Arial,sans-serif" fontWeight="700"
          letterSpacing="2.8" fill="rgba(6,182,212,0.6)"
          animate={{opacity:[0.28,0.82,0.28]}}
          transition={{duration:3,delay:1.4,repeat:Infinity,ease:"easeInOut"}}>
          ESTUDIANTE
        </motion.text>

        {/* ══ SATÉLITES ══ */}
        {SAT.map(s=>(
          <motion.g key={s.label}
            initial={{opacity:0,scale:0}}
            animate={{opacity:1,scale:1}}
            transition={{duration:0.5,delay:s.delay,ease:[0.22,1,0.36,1]}}>
            <motion.circle cx={s.cx} cy={s.cy} r={s.r+11}
              fill="none" stroke={s.color} strokeWidth="1.2" opacity="0.22"
              animate={{r:[s.r+11,s.r+22,s.r+11]}}
              transition={{duration:4.5,delay:s.delay,repeat:Infinity,ease:"easeInOut"}}
            />
            <circle cx={s.cx} cy={s.cy} r={s.r}
              fill="#0c1e35" stroke={s.color} strokeWidth="1.8"/>
            <text x={s.cx} y={s.cy+4} textAnchor="middle" fontSize="8.5"
              fontFamily="Arial,sans-serif" fontWeight="700" letterSpacing="0.5" fill={s.color}>
              {s.label}
            </text>
          </motion.g>
        ))}


        {/* ══ Pulso de éxito ══ */}
        <motion.circle cx={PL.cx} cy={PL.cy} r={PL.r}
          fill="none" stroke="#4ade80" strokeWidth="2.5"
          animate={{r:[PL.r,PL.r+100,PL.r],opacity:[0,0.5,0],strokeWidth:[2.5,0.3,2.5]}}
          transition={{duration:3,delay:6.5,repeat:Infinity,repeatDelay:12,ease:"easeOut"}}
        />

        {/* ══ Estrellas ambientales ══ */}
        {[[38,175,0.45],[508,85,0.5],[515,408,0.4],[58,388,0.38],[308,548,0.42],[488,530,0.36]].map(([x,y,o],i)=>(
          <motion.circle key={`st${i}`} cx={x} cy={y} r="1.7"
            fill="rgba(255,255,255,0.75)"
            animate={{opacity:[o,0.05,o],scale:[1,1.8,1]}}
            transition={{duration:2.5+i*0.45,repeat:Infinity,delay:i*0.4,ease:"easeInOut"}}
          />
        ))}
      </svg>
    </div>
  );
}

/* ─── Animadores de scroll ─── */
const EASE = [0.22, 1, 0.36, 1];
const FadeUp = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: EASE }}
      className={className}>{children}</motion.div>
  );
};
const FadeIn = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}>{children}</motion.div>
  );
};

/* ─── Datos ─── */
const CATEGORIAS = [
  { label: "Landing Pages",       grupo: "Presencia Digital",    icon: Globe,      color: "#1B6FE8" },
  { label: "Catálogos Interactivos", grupo: "Presencia Digital", icon: Layers,     color: "#1B6FE8" },
  { label: "Bases de Datos",      grupo: "Gestión de Info",      icon: Database,   color: "#0891B2" },
  { label: "Dashboards PowerBI",  grupo: "Gestión de Info",      icon: BarChart2,  color: "#0891B2" },
  { label: "Registro de Clientes",grupo: "Gestión de Info",      icon: UserCheck,  color: "#0891B2" },
  { label: "Prototipos Figma",    grupo: "Diseño e Innovación",  icon: PenTool,    color: "#8B5CF6" },
  { label: "Auditoría UX",        grupo: "Diseño e Innovación",  icon: Pen,        color: "#8B5CF6" },
  { label: "Infraestructura TI",  grupo: "Soporte TI y Redes",   icon: Wifi,       color: "#059669" },
  { label: "Ciberseguridad",      grupo: "Soporte TI y Redes",   icon: Shield,     color: "#059669" },
  { label: "Plan de Backups",     grupo: "Soporte TI y Redes",   icon: ShieldCheck,color: "#059669" },
];

/* ════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ════════════════════════════════════════════ */
export function LandingPage() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileMenuOpen, setMobile]   = useState(false);
  const [modalOpen, setModalOpen] = useState(false);  
  const [modalType, setModalType] = useState("terminos");

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ── estilos inline compartidos ── */
  const F = "Arial, 'Helvetica Neue', Helvetica, sans-serif";

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; }

        .lp { font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; color: #1a1a2e; background: #fafaf8; overflow-x: hidden; }

        /* ── Botones ── */
        .btn-p {
          display:inline-flex; align-items:center; gap:8px;
          padding:12px 24px; font-family:Arial,sans-serif; font-size:14px;
          font-weight:700; letter-spacing:.02em; border-radius:5px;
          border:none; cursor:pointer; color:#fff; background:#0f1f3d;
          transition:background .3s,transform .2s,box-shadow .3s;
        }
        .btn-p:hover { background:#1B6FE8; transform:translateY(-2px); box-shadow:0 8px 24px rgba(27,111,232,.3); }

        .btn-ghost-light {
          display:inline-flex; align-items:center; gap:8px;
          padding:12px 24px; font-family:Arial,sans-serif; font-size:14px;
          font-weight:700; border-radius:5px;
          border:1.5px solid rgba(255,255,255,.2); cursor:pointer;
          color:rgba(255,255,255,.7); background:rgba(255,255,255,.06);
          transition:all .2s;
        }
        .btn-ghost-light:hover { border-color:rgba(255,255,255,.5); color:#fff; background:rgba(255,255,255,.1); transform:translateY(-1px); }

        .btn-ghost-dark {
          display:inline-flex; align-items:center; gap:8px;
          padding:12px 22px; font-family:Arial,sans-serif; font-size:14px;
          font-weight:700; border-radius:5px;
          border:1.5px solid #d4d4d4; cursor:pointer;
          color:#1a1a2e; background:transparent; transition:all .2s;
        }
        .btn-ghost-dark:hover { border-color:#1a1a2e; transform:translateY(-1px); }

        .btn-acc {
          display:inline-flex; align-items:center; gap:8px;
          padding:12px 24px; font-family:Arial,sans-serif; font-size:14px;
          font-weight:700; border-radius:5px; border:none; cursor:pointer;
          color:#fff; background:#d4580a; transition:all .25s;
        }
        .btn-acc:hover { background:#b84608; transform:translateY(-2px); box-shadow:0 8px 24px rgba(212,88,10,.28); }

        /* ── Cards ── */
        .card-base {
          background:#fff; border:1px solid #e8e8e4; border-radius:8px;
          transition:border-color .3s,box-shadow .3s,transform .3s,background .3s;
        }
        .card-base:hover { border-color:transparent; box-shadow:0 14px 36px rgba(0,0,0,.08); transform:translateY(-3px); }
        .card-blue:hover  { background:#f0f6ff; }
        .card-cyan:hover  { background:#f0fbff; }
        .card-violet:hover{ background:#f5f0ff; }
        .card-green:hover { background:#f0fff8; }

        .step-card {
          background:#fff; border:1px solid #e8e8e4; border-radius:8px;
          padding:28px; transition:all .3s;
          position:relative; overflow:hidden;
        }
        .step-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:3px;
          background:linear-gradient(90deg,#1B6FE8,#06B6D4);
          transform:scaleX(0); transform-origin:left; transition:transform .4s;
        }
        .step-card:hover::before { transform:scaleX(1); }
        .step-card:hover { border-color:transparent; box-shadow:0 16px 40px rgba(0,0,0,.07); transform:translateY(-4px); }

        .trust-badge {
          background:#fff; border:1px solid #e8e8e4; border-radius:8px;
          padding:18px 22px; display:flex; align-items:flex-start; gap:14px;
          transition:all .3s; flex:1; min-width:220px;
        }
        .trust-badge:hover { border-color:#c7d9f8; background:#f4f8ff; box-shadow:0 8px 24px rgba(27,111,232,.08); }

        .rule-item {
          display:flex; align-items:flex-start; gap:14px;
          padding:16px 0; border-bottom:1px solid #f0f0ec; transition:padding-left .2s;
        }
        .rule-item:last-child { border-bottom:none; }
        .rule-item:hover { padding-left:4px; }

        .benefit-card {
          border-radius:8px; padding:32px; border:1px solid #e8e8e4; background:#fff;
          transition:border-color .35s,box-shadow .35s,transform .35s;
        }
        .benefit-card:hover { border-color:transparent; box-shadow:0 20px 48px rgba(0,0,0,.07); transform:translateY(-4px); }

        /* ── Sección rule ── */
        .s-rule { width:36px; height:2px; background:#1B6FE8; margin-bottom:18px; }

        /* ── Tag ── */
        .tag { display:inline-flex; align-items:center; gap:5px; padding:4px 11px;
          font-family:Arial,sans-serif; font-size:10px; font-weight:700;
          letter-spacing:.07em; text-transform:uppercase; border-radius:3px; }

        /* ── Nav link ── */
        .nl { font-family:Arial,sans-serif; font-size:13px; font-weight:400;
          text-decoration:none; transition:color .2s; }

        /* ── Footer link ── */
        .fl { font-family:Arial,sans-serif; font-size:13px;
          color:rgba(255,255,255,.3); text-decoration:none; transition:color .2s; }
        .fl:hover { color:rgba(255,255,255,.75); }

        /* ── Hero gradient ── */
        .hero-bg { background:linear-gradient(160deg,#0d1b35 0%,#0f2a4a 55%,#0b2a4f 100%); }

        /* ── Línea decorativa sutil debajo del Hero ── */
        .hero-divider {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(27,111,232,0.4) 20%, rgba(6,182,212,0.4) 50%, rgba(139,92,246,0.4) 80%, transparent 100%);
          pointer-events: none;
          z-index: 2;
        }

        /* ── Responsive ── */
        @media(max-width:860px){
          .grid-hero { grid-template-columns:1fr !important; }
          .grid-stats{ grid-template-columns:1fr 1fr !important; }
          .grid-steps{ grid-template-columns:1fr !important; }
          .grid-cats { grid-template-columns:repeat(2,1fr) !important; }
          .grid-ben  { grid-template-columns:1fr !important; }
          .grid-cta  { grid-template-columns:1fr !important; }
          .grid-foot { grid-template-columns:1fr 1fr !important; gap:32px !important; }
          .nav-desk  { display:none !important; }
          .hamburger { display:flex !important; }
          .hero-text-block { margin-left: 0 !important; }
        }
        @media(max-width:480px){
          .grid-cats { grid-template-columns:1fr !important; }
          .grid-stats{ grid-template-columns:1fr !important; }
          .grid-foot { grid-template-columns:1fr !important; }
        }
      `}</style>

      <div className="lp">

        {/* ══════ HEADER ══════ */}
        <motion.header
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 60,
            background: scrolled ? "rgba(250,250,248,0.97)" : "transparent",
            backdropFilter: scrolled ? "blur(14px)" : "none",
            borderBottom: scrolled ? "1px solid #e8e8e4" : "1px solid transparent",
            transition: "all .35s ease",
          }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

            <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
              <Logo theme={scrolled ? "light" : "dark"} imgClassName="h-9 w-auto" />
            </Link>

            <nav className="nav-desk" style={{ display: "flex", alignItems: "center", gap: 28 }}>
              {[["#como-funciona","Cómo funciona"],["#proyectos","Proyectos"],["#empresas","Para empresas"],["#estudiantes","Para estudiantes"]].map(([href, label]) => (
                <a key={label} href={href} className="nl"
                  style={{ color: scrolled ? "#4a4a5a" : "rgba(255,255,255,.6)" }}
                  onMouseEnter={e => e.currentTarget.style.color = scrolled ? "#1B6FE8" : "#fff"}
                  onMouseLeave={e => e.currentTarget.style.color = scrolled ? "#4a4a5a" : "rgba(255,255,255,.6)"}>
                  {label}
                </a>
              ))}
            </nav>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <span style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: scrolled ? "#4a4a5a" : "rgba(255,255,255,.6)", cursor: "pointer", transition: "color .2s" }}>Ingresar</span>
              </Link>
              <button className="hamburger" onClick={() => setMobile(v => !v)}
                style={{ background: "none", border: "none", cursor: "pointer", display: "none", padding: 4, color: scrolled ? "#0f1f3d" : "#fff" }}>
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div style={{ background: "#fafaf8", borderTop: "1px solid #e8e8e4", padding: "20px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
              {[["#como-funciona","Cómo funciona"],["#proyectos","Proyectos"],["#empresas","Para empresas"],["#estudiantes","Para estudiantes"]].map(([href,label]) => (
                <a key={label} href={href} onClick={() => setMobile(false)} style={{ fontFamily: F, fontSize: 15, color: "#1a1a2e", textDecoration: "none", fontWeight: 400 }}>{label}</a>
              ))}
              <div style={{ display: "flex", gap: 10, paddingTop: 8, borderTop: "1px solid #e8e8e4" }}>
                <Link to="/login"             style={{ textDecoration: "none" }}><button className="btn-ghost-dark" style={{ padding: "9px 16px", fontSize: 13 }}>Ingresar</button></Link>
              </div>
            </div>
          )}
        </motion.header>

        {/* ══════ HERO ══════ */}
          <section className="hero-bg" style={{ 
            paddingTop: 60, 
            minHeight: "100vh", 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center", 
            position: "relative", 
            overflow: "hidden"
          }}>

            <HeroAnimation />

            {/* Degradado para legibilidad del texto */}
            <div style={{ 
              position: "absolute", 
              inset: 0, 
              background: "linear-gradient(to right, rgba(13,27,53,0.92) 0%, rgba(13,27,53,0.88) 32%, rgba(13,27,53,0.3) 60%, rgba(13,27,53,0.08) 100%)", 
              pointerEvents: "none", 
              zIndex: 1 
            }} />

            <div style={{ 
              maxWidth: 1200, 
              margin: "0 auto", 
              padding: "90px 28px 110px", 
              position: "relative", 
              zIndex: 2,
              width: "100%"
            }}>

              {/* Badge de estado */}
              <motion.div 
                initial={{ opacity: 0, y: 16 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: .5, delay: .1, ease: EASE }} 
                style={{ 
                  marginBottom: 36,
                  marginLeft: "clamp(0px, 5%, 80px)" 
                }}
              >

              </motion.div>

              <div className="grid-hero" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 0, alignItems: "center" }}>

                {/* Copy */}
                <motion.div 
                  initial={{ opacity: 0, x: -24 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: .7, delay: .15, ease: EASE }}
                 style={{
                    marginLeft: "clamp(0px, 5%, 80px)"
                  }}
                >
                  <h1 style={{ 
                    fontFamily: F, 
                    fontSize: "clamp(38px,5vw,62px)", 
                    fontWeight: 400, 
                    color: "#fff", 
                    lineHeight: 1.08, 
                    letterSpacing: "-.025em", 
                    marginBottom: 24 
                  }}>
                    Soluciones <br />
                    digitales con{" "}
                    certeza
                  </h1>
                  <p style={{ 
                    fontFamily: F, 
                    fontSize: 17, 
                    fontWeight: 400, 
                    color: "rgba(255,255,255,.5)", 
                    lineHeight: 1.7, 
                    maxWidth: 580, 
                    marginBottom: 40 
                  }}>
                    Conectamos empresas con talento universitario. Tu empresa sabrá exactamente qué va a recibir. Sin tecnicismos, sin ambigüedades.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 48 }}>
                    <Link to="/register/mype" style={{ textDecoration: "none" }}>
                      <button className="btn-p" style={{ padding: "14px 28px", fontSize: 15 }}>
                        Publicar mi proyecto <ArrowRight size={16} />
                      </button>
                    </Link>
                    <Link to="/register/estudiante" style={{ textDecoration: "none" }}>
                      <button className="btn-ghost-light" style={{ padding: "14px 28px", fontSize: 15 }}>
                        Soy estudiante
                      </button>
                    </Link>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
                    {["Gratuito para empresas", "Talento verificado", "Entregables garantizados"].map(t => (
                      <span key={t} style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 7, 
                        fontFamily: F, 
                        fontSize: 12, 
                        fontWeight: 400, 
                        color: "rgba(255,255,255,.3)" 
                      }}>
                        <CheckCircle2 size={12} style={{ color: "#67d4f8", flexShrink: 0 }} /> {t}
                      </span>
                    ))}
                  </div>
                </motion.div>

              </div>
            </div>

            {/* Línea divisoria sutil en lugar del degradado blanco */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: "linear-gradient(90deg, transparent 0%, rgba(27,111,232,0.4) 20%, rgba(6,182,212,0.4) 50%, rgba(139,92,246,0.4) 80%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 2
            }} />

          </section>

        {/* ══════ CÓMO FUNCIONA ══════ */}
        <section id="como-funciona" style={{ padding: "120px 28px", background: "#fafaf8" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <FadeUp>
              <div style={{ textAlign: "center", marginBottom: 64 }}>
                <div className="s-rule" style={{ margin: "0 auto 18px" }} />
                <p style={{ fontFamily: F, fontSize: 11, fontWeight: 400, letterSpacing: ".12em", textTransform: "uppercase", color: "#8888a0", marginBottom: 14 }}>El proceso</p>
                <h2 style={{ fontFamily: F, fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 400, color: "#0f1f3d", letterSpacing: "-.02em", marginBottom: 14 }}>
                  Tres pasos. Sin burocracia.
                </h2>
                <p style={{ fontFamily: F, fontSize: 16, fontWeight: 400, color: "#6b6b7a", maxWidth: 520, lineHeight: 1.7, margin: "0 auto" }}>
                  Diseñado para que la tecnología llegue a cualquier empresa, sin importar su conocimiento digital.
                </p>
              </div>
            </FadeUp>

            <div className="grid-steps" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
              {[
                { num: "01", color: "#1B6FE8", title: "La empresa describe su problema",       desc: "Nuestro Asistente Inteligente guía a la empresa con preguntas simples y convierte su necesidad en un proyecto técnico completo de forma automática. No necesitas saber de tecnología.", tag: "Sin conocimiento técnico" },
                { num: "02", color: "#8B5CF6", title: "Nosotros gestionamos todo el proceso",  desc: "Actuamos como tu equipo de RRHH dedicado. Evaluamos perfiles técnicos, revisamos postulantes y te presentamos al candidato ideal para tu proyecto.", tag: "RRHH especializado" },
                { num: "03", color: "#059669", title: "Trabajo enfocado en entregables",        desc: "Se trabaja sobre entregables predefinidos con fechas acordadas según la complejidad. Claridad total: tu empresa sabe exactamente qué recibirá.", tag: "Resultados garantizados" },
              ].map((s, i) => (
                <FadeUp key={s.num} delay={i * .1}>
                  <div className="step-card">
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                      <div style={{ width: 3, height: 44, background: `linear-gradient(to bottom,${s.color},transparent)`, borderRadius: 2, flexShrink: 0 }} />
                      <span style={{ fontFamily: F, fontSize: 60, fontWeight: 400, color: "#ededed", lineHeight: 1 }}>{s.num}</span>
                    </div>
                    <h3 style={{ fontFamily: F, fontSize: 16, fontWeight: 400, color: "#0f1f3d", marginBottom: 10, lineHeight: 1.35, letterSpacing: "-.01em" }}>{s.title}</h3>
                    <p  style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: "#6b6b7a", lineHeight: 1.7, marginBottom: 20 }}>{s.desc}</p>
                    <span className="tag" style={{ background: s.color + "14", color: s.color, border: `1px solid ${s.color}28` }}>{s.tag}</span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ DIFERENCIADORES — sin iconos genéricos ══════ */}
        <div style={{ background: "#0f1f3d", borderTop: "none", borderBottom: "none", padding: "64px 28px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px,rgba(255,255,255,.03) 1px,transparent 0)", backgroundSize: "28px 28px", pointerEvents: "none" }} />

          <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
              <div style={{ width: 32, height: 2, background: "#1B6FE8" }} />
              <p style={{ fontFamily: F, fontSize: 10, fontWeight: 400, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.3)" }}>
                Lo que nos diferencia
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0 }}>

              <FadeIn delay={0}>
                <div style={{ padding: "32px 36px 32px 0", borderRight: "1px solid rgba(255,255,255,.07)", position: "relative" }}>
                  <span style={{ position: "absolute", top: 20, right: 32, fontFamily: F, fontSize: 80, fontWeight: 400, color: "rgba(27,111,232,.08)", lineHeight: 1, userSelect: "none" }}>R</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                    <div style={{ width: 3, height: 36, background: "linear-gradient(to bottom,#1B6FE8,#06B6D4)", borderRadius: 2, flexShrink: 0 }} />
                    <p style={{ fontFamily: F, fontSize: 18, fontWeight: 400, color: "#fff", letterSpacing: "-.01em", lineHeight: 1.2 }}>
                      Tu RRHH<br />dedicado
                    </p>
                  </div>
                  <p style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,.4)", lineHeight: 1.7 }}>
                    Conocemos la carrera. Evaluamos perfiles técnicos, filtramos postulantes y te presentamos solo a quienes realmente encajan con tu proyecto.
                  </p>
                  <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 20, height: 1, background: "#1B6FE8" }} />
                    <span style={{ fontFamily: F, fontSize: 10, fontWeight: 400, letterSpacing: ".1em", textTransform: "uppercase", color: "#1B6FE8" }}>Selección a tu medida</span>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={.1}>
                <div style={{ padding: "32px 36px", borderRight: "1px solid rgba(255,255,255,.07)", position: "relative" }}>
                  <span style={{ position: "absolute", top: 20, right: 32, fontFamily: F, fontSize: 80, fontWeight: 400, color: "rgba(139,92,246,.08)", lineHeight: 1, userSelect: "none" }}>E</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                    <div style={{ width: 3, height: 36, background: "linear-gradient(to bottom,#8B5CF6,#1B6FE8)", borderRadius: 2, flexShrink: 0 }} />
                    <p style={{ fontFamily: F, fontSize: 18, fontWeight: 400, color: "#fff", letterSpacing: "-.01em", lineHeight: 1.2 }}>
                      Entregables<br />definidos
                    </p>
                  </div>
                  <p style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,.4)", lineHeight: 1.7 }}>
                    Tu empresa sabrá desde el primer día qué va a recibir: código fuente, manuales, prototipos. Fechas acordadas según la complejidad real.
                  </p>
                  <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 20, height: 1, background: "#8B5CF6" }} />
                    <span style={{ fontFamily: F, fontSize: 10, fontWeight: 400, letterSpacing: ".1em", textTransform: "uppercase", color: "#8B5CF6" }}>Claridad total</span>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={.2}>
                <div style={{ padding: "32px 0 32px 36px", position: "relative" }}>
                  <span style={{ position: "absolute", top: 20, right: 8, fontFamily: F, fontSize: 80, fontWeight: 400, color: "rgba(5,150,105,.08)", lineHeight: 1, userSelect: "none" }}>M</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                    <div style={{ width: 3, height: 36, background: "linear-gradient(to bottom,#059669,#06B6D4)", borderRadius: 2, flexShrink: 0 }} />
                    <p style={{ fontFamily: F, fontSize: 18, fontWeight: 400, color: "#fff", letterSpacing: "-.01em", lineHeight: 1.2 }}>
                      Proyectos<br />monitoreados
                    </p>
                  </div>
                  <p style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,.4)", lineHeight: 1.7 }}>
                    No te dejamos solo. Hacemos seguimiento activo del avance, revisamos los entregables y garantizamos que el resultado cumpla con lo acordado.
                  </p>
                  <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 20, height: 1, background: "#059669" }} />
                    <span style={{ fontFamily: F, fontSize: 10, fontWeight: 400, letterSpacing: ".1em", textTransform: "uppercase", color: "#059669" }}>Auditoría continua</span>
                  </div>
                </div>
              </FadeIn>

            </div>
          </div>
        </div>

        {/* ══════ CATEGORÍAS ══════ */}
        <section id="proyectos" style={{ padding: "120px 0", background: "#fff" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px", marginBottom: 56 }}>
            <FadeUp>
              <div className="s-rule" />
              <p style={{ fontFamily: F, fontSize: 11, fontWeight: 400, letterSpacing: ".12em", textTransform: "uppercase", color: "#8888a0", marginBottom: 14 }}>Qué hacemos</p>
              <h2 style={{ fontFamily: F, fontSize: "clamp(26px,3vw,40px)", fontWeight: 400, color: "#0f1f3d", letterSpacing: "-.02em", marginBottom: 12 }}>
                Áreas de especialidad
              </h2>
              <p style={{ fontFamily: F, fontSize: 15, fontWeight: 400, color: "#6b6b7a", maxWidth: 500, lineHeight: 1.7 }}>
                Cobertura completa de las necesidades tecnológicas más comunes para impulsar tu empresa.
              </p>
            </FadeUp>
          </div>

          <div className="grid-cats" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px", display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14 }}>
            {CATEGORIAS.map((cat, i) => {
              const cls = cat.color === "#1B6FE8" ? "card-blue" : cat.color === "#0891B2" ? "card-cyan" : cat.color === "#8B5CF6" ? "card-violet" : "card-green";
              return (
                <FadeUp key={cat.label} delay={i * .04}>
                  <div className={`card-base ${cls}`} style={{ padding: 20 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 7, background: cat.color + "14", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                      <cat.icon size={18} color={cat.color} />
                    </div>
                    <p style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: "#0f1f3d", lineHeight: 1.35, marginBottom: 4 }}>{cat.label}</p>
                    <p style={{ fontFamily: F, fontSize: 11, fontWeight: 400, color: "#8888a0" }}>{cat.grupo}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </section>

        {/* ══════ PARA EMPRESAS ══════ */}
        <section id="empresas" style={{ padding: "120px 28px", background: "#fafaf8" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div className="grid-ben" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>

              <FadeUp>
                <div>
                  <div className="s-rule" />
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#0f1f3d14", padding: "4px 12px", borderRadius: 3, marginBottom: 20 }}>
                    <Building2 size={12} color="#0f1f3d" />
                    <span style={{ fontFamily: F, fontSize: 10, fontWeight: 400, letterSpacing: ".1em", textTransform: "uppercase", color: "#0f1f3d" }}>Para empresas</span>
                  </div>
                  <h2 style={{ fontFamily: F, fontSize: "clamp(26px,3vw,38px)", fontWeight: 400, color: "#0f1f3d", lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: 16 }}>
                    Sin barreras técnicas.<br />
                    Sin costos ocultos.
                  </h2>
                  <p style={{ fontFamily: F, fontSize: 15, fontWeight: 400, color: "#6b6b7a", lineHeight: 1.7, marginBottom: 32 }}>
                    No necesitas saber de tecnología para publicar una oferta. Nuestro equipo lo gestiona por ti de principio a fin.
                  </p>
                  <Link to="/register/mype" style={{ textDecoration: "none" }}>
                    <button className="btn-p">Registrar mi empresa <ArrowRight size={15} /></button>
                  </Link>
                </div>
              </FadeUp>

              <FadeUp delay={.15}>
                <div className="benefit-card">
                  {[
                    { num: "01", color: "#1B6FE8", title: "Cero barreras técnicas",              desc: "Nuestro Asistente Inteligente redacta el proyecto técnico por ti a partir de preguntas simples. Solo cuéntanos el problema de tu negocio." },
                    { num: "02", color: "#8B5CF6", title: "Tu equipo de RRHH dedicado",     desc: "Conocemos la carrera y sabemos qué perfiles técnicos necesita cada proyecto. Gestionamos la selección completa y te presentamos al candidato ideal." },
                    { num: "03", color: "#059669", title: "Claridad total desde el día uno",     desc: "Tu empresa sabrá exactamente qué va a recibir: código fuente, manuales, prototipos. Las fechas se acuerdan según la complejidad real del proyecto." },
                  ].map(r => (
                    <div key={r.title} className="rule-item">
                      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 2 }}>
                        <span style={{ fontFamily: F, fontSize: 11, fontWeight: 400, color: r.color, letterSpacing: ".04em" }}>{r.num}</span>
                        <div style={{ width: 1, flex: 1, background: `linear-gradient(to bottom,${r.color}50,transparent)`, marginTop: 4, minHeight: 20 }} />
                      </div>
                      <div>
                        <p style={{ fontFamily: F, fontSize: 14, fontWeight: 400, color: "#0f1f3d", marginBottom: 4 }}>{r.title}</p>
                        <p style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: "#8888a0", lineHeight: 1.6 }}>{r.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeUp>

            </div>
          </div>
        </section>

        {/* ══════ PARA ESTUDIANTES ══════ */}
        <section id="estudiantes" style={{ padding: "120px 28px", background: "#fff" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div className="grid-ben" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>

              <FadeUp delay={.1}>
                <div className="benefit-card" style={{ borderLeft: "3px solid #d4580a", borderRadius: "0 8px 8px 0" }}>
                  {[
                    { num: "01", color: "#d4580a", title: "Portafolio con negocios reales",  desc: "Trabaja con empresas locales resolviendo problemas reales que podrás exhibir en tu CV o GitHub. No son simulaciones académicas." },
                    { num: "02", color: "#d4580a", title: "Networking que abre puertas",     desc: "Conocerás directamente a los gerentes de las empresas. Si demuestras tus habilidades, puedes conseguir tu siguiente proyecto profesional a gran escala mucho antes de titularte." },
                    { num: "03", color: "#d4580a", title: "Constancia verificable",          desc: "Al completar el proyecto recibes una constancia firmada directamente por el representante de la empresa, válida para LinkedIn, tu CV y tu portafolio." },
                  ].map(r => (
                    <div key={r.title} className="rule-item">
                      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 2 }}>
                        <span style={{ fontFamily: F, fontSize: 11, fontWeight: 400, color: r.color, letterSpacing: ".04em" }}>{r.num}</span>
                        <div style={{ width: 1, flex: 1, background: `linear-gradient(to bottom,${r.color}50,transparent)`, marginTop: 4, minHeight: 20 }} />
                      </div>
                      <div>
                        <p style={{ fontFamily: F, fontSize: 14, fontWeight: 400, color: "#0f1f3d", marginBottom: 4 }}>{r.title}</p>
                        <p style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: "#8888a0", lineHeight: 1.6 }}>{r.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeUp>

              <FadeUp>
                <div>
                  <div className="s-rule" style={{ background: "#d4580a" }} />
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#d4580a14", padding: "4px 12px", borderRadius: 3, marginBottom: 20 }}>
                    <GraduationCap size={12} color="#d4580a" />
                    <span style={{ fontFamily: F, fontSize: 10, fontWeight: 400, letterSpacing: ".1em", textTransform: "uppercase", color: "#d4580a" }}>Para estudiantes</span>
                  </div>
                  <h2 style={{ fontFamily: F, fontSize: "clamp(26px,3vw,38px)", fontWeight: 400, color: "#0f1f3d", lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: 16 }}>
                    Experiencia real.<br />
                    No simulaciones.
                  </h2>
                  <p style={{ fontFamily: F, fontSize: 15, fontWeight: 400, color: "#6b6b7a", lineHeight: 1.7, marginBottom: 32 }}>
                    Construye un portafolio verificable resolviendo problemas reales. El primer paso hacia una carrera profesional sólida, con contactos directos en el mundo empresarial.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    <Link to="/register/estudiante" style={{ textDecoration: "none" }}>
                      <button className="btn-acc">Unirme como estudiante <ArrowRight size={15} /></button>
                    </Link>
                    <Link to="/login" style={{ textDecoration: "none" }}>
                      <button className="btn-ghost-dark">Ya tengo cuenta</button>
                    </Link>
                  </div>
                </div>
              </FadeUp>

            </div>
          </div>
        </section>

        {/* ══════ CTA FINAL ══════ */}
<section style={{ padding: "100px 28px", background: "#fafaf8" }}>
  <div style={{ maxWidth: 1100, margin: "0 auto" }}>
    <FadeUp>
      <div style={{ 
        background: "#ffffff", 
        borderRadius: 16, 
        padding: "64px 56px", 
        position: "relative", 
        overflow: "hidden",
        border: "1px solid #e8e8e4",
        boxShadow: "0 4px 24px rgba(0,0,0,0.04)"
      }}>
        
        {/* Degradado azul en forma diagonal/triangular */}
        <div style={{ 
          position: "absolute", 
          top: 0, 
          right: 0, 
          width: "55%", 
          height: "100%", 
          background: "linear-gradient(135deg, transparent 0%, transparent 40%, rgba(27,111,232,0.06) 60%, rgba(6,182,212,0.08) 85%, rgba(139,92,246,0.04) 100%)", 
          pointerEvents: "none",
          clipPath: "polygon(25% 0, 100% 0, 100% 100%, 0% 100%)"
        }} />

        {/* Segundo degradado en la esquina inferior izquierda */}
        <div style={{ 
          position: "absolute", 
          bottom: 0, 
          left: 0, 
          width: "35%", 
          height: "50%", 
          background: "linear-gradient(45deg, rgba(212,88,10,0.06) 0%, rgba(212,88,10,0.02) 40%, transparent 70%)", 
          pointerEvents: "none",
          clipPath: "polygon(0 20%, 0 100%, 100% 100%, 30% 20%)"
        }} />

        {/* Círculo decorativo azul */}
        <div style={{ 
          position: "absolute", 
          top: -60, 
          right: -60, 
          width: 220, 
          height: 220, 
          borderRadius: "50%", 
          background: "radial-gradient(circle, rgba(27,111,232,0.08) 0%, rgba(27,111,232,0.03) 40%, transparent 70%)", 
          pointerEvents: "none" 
        }} />

        <div className="grid-cta" style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr", 
          gap: 60, 
          alignItems: "center", 
          position: "relative", 
          zIndex: 1 
        }}>
          <div>
           
            <h2 style={{ 
              fontFamily: F, 
              fontSize: "clamp(26px,3vw,40px)", 
              fontWeight: 400, 
              color: "#0f1f3d", 
              lineHeight: 1.15, 
              letterSpacing: "-.02em", 
              marginBottom: 20 
            }}>
              La conexión que tu<br />
              empresa estaba buscando
            </h2>
            <p style={{ 
              fontFamily: F, 
              fontSize: 15, 
              fontWeight: 400, 
              color: "#6b6b7a", 
              lineHeight: 1.7 
            }}>
              Linkuy es completamente gratuito para empresas y una oportunidad real de portafolio para estudiantes.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link to="/register/mype" style={{ textDecoration: "none" }}>
              <button style={{ 
                width: "100%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between", 
                padding: "16px 20px", 
                background: "#0f1f3d", 
                borderRadius: 8, 
                border: "none", 
                cursor: "pointer", 
                fontFamily: F, 
                fontSize: 14, 
                fontWeight: 400, 
                color: "#fff", 
                transition: "all .2s" 
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#1B6FE8"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(27,111,232,.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#0f1f3d"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Building2 size={16} /> Registrar mi empresa</span>
                <ChevronRight size={16} style={{ opacity: .6 }} />
              </button>
            </Link>
            <Link to="/register/estudiante" style={{ textDecoration: "none" }}>
              <button style={{ 
                width: "100%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between", 
                padding: "16px 20px", 
                background: "#fff", 
                borderRadius: 8, 
                border: "1.5px solid #e0e0dc", 
                cursor: "pointer", 
                fontFamily: F, 
                fontSize: 14, 
                fontWeight: 400, 
                color: "#0f1f3d", 
                transition: "all .2s" 
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#d4580a"; e.currentTarget.style.color = "#d4580a"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(212,88,10,.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0e0dc"; e.currentTarget.style.color = "#0f1f3d"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}><GraduationCap size={16} /> Unirme como estudiante</span>
                <ChevronRight size={16} style={{ opacity: .4 }} />
              </button>
            </Link>
           
          </div>
        </div>
      </div>
    </FadeUp>
  </div>
</section>

        {/* ══════ FOOTER ══════ */}
        <footer style={{ background: "#0a1628", borderTop: "1px solid rgba(255,255,255,.06)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 28px 36px" }}>
            <div className="grid-foot" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>

              <div>
                <div style={{ marginBottom: 16 }}>
                  <Logo theme="dark" imgClassName="h-9 w-auto" />
                </div>
                <p style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,.28)", lineHeight: 1.7, maxWidth: 260, marginBottom: 24 }}>
                  Puente académico-empresarial que conecta empresas con talento universitario de ingeniería para resolver necesidades tecnológicas reales.
                </p>
              </div>

              <div>
                <p style={{ fontFamily: F, fontSize: 10, fontWeight: 400, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.18)", marginBottom: 20 }}>Plataforma</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[{ to: "/register/mype", l: "Para empresas" }, { to: "/register/estudiante", l: "Para estudiantes" }, { to: "/login", l: "Iniciar sesión" }].map(item => (
                    <Link key={item.l} to={item.to} className="fl">{item.l}</Link>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ fontFamily: F, fontSize: 10, fontWeight: 400, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.18)", marginBottom: 20 }}>Proyectos</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {["Presencia Digital", "Gestión de Info", "Diseño e Innovación", "Soporte TI"].map(l => (
                    <span key={l} style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,.22)" }}>{l}</span>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ fontFamily: F, fontSize: 10, fontWeight: 400, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.18)", marginBottom: 20 }}>Especialidad</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <span style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,.32)", lineHeight: 1.6 }}>
                    Ingeniería de Sistemas<br />
                  </span>

                </div>
              </div>

            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
              <p style={{ fontFamily: F, fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,.16)" }}>© 2026 Linkuy · Proyecto Capstone</p>
              <div style={{ display: "flex", gap: 20 }}>
                <span 
                  onClick={() => openModal("terminos")}
                  style={{ 
                    fontFamily: F, 
                    fontSize: 12, 
                    fontWeight: 400, 
                    color: "rgba(255,255,255,.16)", 
                    cursor: "pointer",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,.6)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,.16)"}
                >
                  Términos de uso
                </span>
                <span 
                  onClick={() => openModal("privacidad")}
                  style={{ 
                    fontFamily: F, 
                    fontSize: 12, 
                    fontWeight: 400, 
                    color: "rgba(255,255,255,.16)", 
                    cursor: "pointer",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,.6)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,.16)"}
                >
                  Privacidad
                </span>
              </div>
            </div>
          </div>
        </footer>
        <TermsModal 
          isOpen={modalOpen} 
          onClose={closeModal} 
          type={modalType} 
        />
      </div>
    </>
  );
}