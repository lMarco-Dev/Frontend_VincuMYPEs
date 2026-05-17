import { Link } from "react-router-dom";
import { Logo } from "@shared/ui/Logo";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  ArrowRight, Building2, GraduationCap, CheckCircle2,
  Zap, FileText, Globe, BarChart2, Shield, Wifi,
  Pen, ChevronRight, Star, Clock, Users, Sparkles, Briefcase
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

const FadeUp = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease }} className={className}>
      {children}
    </motion.div>
  );
};

const FadeIn = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.65, delay, ease }} className={className}>
      {children}
    </motion.div>
  );
};

const TIPOS = [
  { label: "Landing page", rama: "WEB", icon: Globe },
  { label: "Catálogo digital", rama: "WEB", icon: Globe },
  { label: "Sistema de registro", rama: "WEB", icon: FileText },
  { label: "Dashboard de datos", rama: "WEB", icon: BarChart2 },
  { label: "Diseño de BD", rama: "BD", icon: FileText },
  { label: "Limpieza de datos", rama: "BD", icon: FileText },
  { label: "Análisis exploratorio", rama: "BD", icon: BarChart2 },
  { label: "Prototipo UI", rama: "UX", icon: Pen },
  { label: "Rediseño UX", rama: "UX", icon: Pen },
  { label: "Mapa del cliente", rama: "UX", icon: Users },
  { label: "Diagnóstico de red", rama: "REDES", icon: Wifi },
  { label: "Diseño de red", rama: "REDES", icon: Wifi },
  { label: "Auditoría de seguridad", rama: "SEG", icon: Shield },
  { label: "Plan de respaldo", rama: "SEG", icon: Shield },
];

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      {/* ── Tipografía + keyframes ─────────────────────────────────────── */}
      <style>{`
        /* Importamos 'Outfit' como fuente secundaria/fallback por su parecido geométrico con Angro */
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

        /* Configuración para tu fuente local Angro Std */
        @font-face {
          font-family: 'Angro Std';
          src: local('Angro Std Light'), local('AngroStd-Light');
          font-weight: 300;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Angro Std';
          src: local('Angro Std Regular'), local('AngroStd-Regular');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Angro Std';
          src: local('Angro Std Bold'), local('AngroStd-Bold');
          font-weight: 700;
          font-style: normal;
          font-display: swap;
        }

        *, *::before, *::after { box-sizing: border-box; }

        /* Aplicamos Angro Std como principal, cayendo a Outfit si no está disponible */
        body, .lp-root { 
          font-family: 'Angro Std', 'Outfit', system-ui, sans-serif; 
          font-weight: 400;
        }
        
        .font-display { 
          font-family: 'Angro Std', 'Outfit', system-ui, sans-serif; 
        }

        @keyframes gradShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes ringPulse {
          0%   { box-shadow: 0 0 0 0 rgba(6,182,212,0.4); }
          70%  { box-shadow: 0 0 0 12px rgba(6,182,212,0); }
          100% { box-shadow: 0 0 0 0 rgba(6,182,212,0); }
        }

        .grad-text {
          background-clip: text; -webkit-background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
          background-size: 200% 200%;
          animation: gradShift 5s ease infinite;
        }
        .grad-cyan  { background-image: linear-gradient(135deg,#06B6D4,#38BDF8,#06B6D4); }
        .grad-orange{ background-image: linear-gradient(135deg,#F97316,#FBBF24,#F97316); }
        .grad-blue  { background-image: linear-gradient(135deg,#1B6FE8,#06B6D4,#1B6FE8); }

        /* Botones con border-radius 10px */
        .btn-pri {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 0 24px; height: 48px; font-weight: 600; font-size: 15px;
          border-radius: 10px; border: none; cursor: pointer; color: white;
          background: linear-gradient(135deg, #1B6FE8 0%, #0E54C4 100%);
          background-size: 200% 200%;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background-position 0.4s ease;
          font-family: inherit;
        }
        .btn-pri:hover {
          background-position: 100% 0%;
          background-image: linear-gradient(135deg, #06B6D4 0%, #1B6FE8 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(27,111,232,0.35);
        }
        .btn-pri-lg { height: 54px; padding: 0 32px; font-size: 16px; }

        .btn-acc {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 0 24px; height: 48px; font-weight: 600; font-size: 15px;
          border-radius: 10px; border: none; cursor: pointer; color: white;
          background: linear-gradient(135deg, #F97316, #DC4A00);
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.4s ease;
          font-family: inherit;
        }
        .btn-acc:hover {
          background: linear-gradient(135deg, #FB923C, #F97316);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(249,115,22,0.35);
        }
        .btn-acc-lg { height: 54px; padding: 0 32px; font-size: 16px; }

        .btn-ghost {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 0 24px; height: 48px; font-weight: 600; font-size: 15px;
          border-radius: 10px; border: 1.5px solid #d1d5db; cursor: pointer;
          color: #374151; background: transparent;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .btn-ghost:hover { border-color: #9ca3af; background: #f9fafb; transform: translateY(-1px); }
        .btn-ghost-lg { height: 54px; padding: 0 28px; font-size: 16px; }

        .btn-white {
          display: inline-flex; align-items: center; justify-content: space-between; gap: 8px;
          padding: 0 24px; height: 54px; font-weight: 600; font-size: 15px;
          border-radius: 10px; border: none; cursor: pointer;
          color: #0F2A4A; background: white;
          transition: all 0.25s ease;
          font-family: inherit;
        }
        .btn-white:hover { background: #EFF6FF; transform: translateY(-2px); box-shadow: 0 12px 28px rgba(0,0,0,0.15); }

        /* Project Pill Compact Grid */
        .project-card {
          background: white; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px;
          display: flex; flex-direction: column; gap: 8px; transition: all 0.2s; cursor: pointer;
        }
        .project-card:hover { border-color: #1B6FE8; background: #EFF6FF; transform: translateY(-2px); box-shadow: 0 8px 16px rgba(27,111,232,0.08); }
        .project-card:hover .pc-icon { color: #1B6FE8; }

        /* Step card unificado */
        .feature-step-card {
          background: white; border: 1px solid #E5E7EB; border-radius: 16px; padding: 32px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .feature-step-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.04); border-color: rgba(27,111,232,0.2); }

        /* Tarjetas de Beneficios */
        .benefit-card-light {
          background: white; border: 1px solid #E5E7EB; border-left: 4px solid #F97316; border-radius: 0 12px 12px 0;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .benefit-card-light:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(249,115,22,0.1); }

        .benefit-card-dark {
          background: linear-gradient(150deg,#0A1E35,#0F3060);
          border-left: 4px solid #06B6D4; border-radius: 0 12px 12px 0;
          transition: transform 0.3s ease;
        }
        .benefit-card-dark:hover { transform: translateY(-4px); }

        /* Stat circle */
        .stat-circle {
          width: 130px; height: 130px; border-radius: 50%;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          border: 2px solid #E5E7EB; background: white; transition: all 0.35s ease; cursor: default;
        }
        .stat-circle:hover {
          background: linear-gradient(145deg, #0F2A4A, #1B4A8A); border-color: transparent;
          transform: scale(1.06); box-shadow: 0 16px 40px rgba(15,42,74,0.25);
        }
        .stat-circle:hover .sc-num { color: white !important; }
        .stat-circle:hover .sc-label { color: #67E8F9 !important; }
        .stat-circle:hover .sc-icon { color: #38BDF8 !important; }

        .nav-pulse { animation: ringPulse 2.5s ease infinite; }
        .float-anim { animation: floatY 5s ease-in-out infinite; }

        @media (min-width: 1024px) {
          .hero-mype-clip { clip-path: polygon(0 0, 95% 0, 100% 100%, 0 100%); }
          .hero-est-clip { clip-path: polygon(5% 0, 100% 0, 100% 100%, 0 100%); margin-left: -5%; }
        }

        .label-ticket {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 14px 5px 10px;
          background: #EFF6FF; border: 1px solid #BFDBFE;
          color: #1D4ED8; font-size: 11px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%);
        }
      `}</style>

      <div className="lp-root min-h-screen bg-white overflow-x-hidden">

        {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
        <motion.nav
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease }}
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100" : "bg-transparent"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo />
              <span className="hidden sm:block label-ticket" style={{ background: "#0F2A4A", borderColor: "#1B6FE8", color: "#67E8F9", fontFamily: "Outfit, sans-serif" }}>
                Beta · Cajamarca
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="hidden sm:block text-[15px] font-medium text-gray-600 hover:text-[#1B6FE8] transition-colors">
                Iniciar sesión
              </Link>
              <Link to="/register/mype">
                <button className="btn-pri nav-pulse" style={{ height: "40px", padding: "0 16px", fontSize: "14px" }}>
                  Publicar proyecto <ArrowRight size={15} />
                </button>
              </Link>
            </div>
          </div>
        </motion.nav>

        {/* ── HERO SPLIT (MYPE / ESTUDIANTE) ─────────────────────────────── */}
        <section className="pt-16 flex flex-col lg:flex-row min-h-screen">

          {/* MYPE (Izquierda - Oscuro) */}
          <div className="hero-mype-clip relative flex flex-col justify-center px-8 lg:px-16 xl:px-20 py-24 flex-1 overflow-hidden"
            style={{ background: "linear-gradient(150deg, #081828 0%, #0F2A4A 55%, #0C3260 100%)" }}>
            <div className="absolute inset-0 opacity-[0.05]"
              style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
            <div className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full blur-[80px] opacity-15"
              style={{ background: "radial-gradient(circle, #06B6D4, transparent 70%)" }} />

            <div className="relative z-10 max-w-lg">
              <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease }}>

                <div className="label-ticket mb-8" style={{ background: "rgba(6,182,212,0.12)", borderColor: "rgba(6,182,212,0.3)", color: "#67E8F9", fontFamily: "Outfit, sans-serif" }}>
                  <Building2 size={11} /> Para microempresas · MYPEs
                </div>

                <h1 className="font-display text-5xl xl:text-[3.5rem] text-white leading-[1.08] mb-6 tracking-tight" style={{ fontWeight: 300 }}>
                  Tu problema<br />tecnológico,{" "}
                  <span className="grad-text grad-cyan" style={{ fontWeight: 600 }}>resuelto en 5 días</span>
                </h1>

                <p className="text-white/60 text-[1.1rem] leading-[1.7] mb-8 font-light">
                  Conecta con talento universitario listo para ayudarte. Obtén soluciones reales para tu negocio sin costo mientras ellos construyen su experiencia.
                </p>

                {/* Botón directo (Sin buscador) */}
                <div className="flex flex-wrap gap-4 mb-10">
                  <Link to="/register/mype">
                    <button className="btn-pri btn-pri-lg w-full sm:w-auto shadow-lg">
                      Registrar mi MYPE <ArrowRight size={18} />
                    </button>
                  </Link>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {["100% Gratis", "5 días máximo", "Talento de la UPN"].map(t => (
                    <span key={t} className="flex items-center gap-2 text-sm text-white/40 font-light">
                      <CheckCircle2 size={13} style={{ color: "#67E8F9" }} /> {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* ESTUDIANTE (Derecha - Claro) */}
          <div className="hero-est-clip relative flex flex-col justify-center px-8 lg:px-16 xl:px-20 py-24 flex-1 bg-white overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[80px] opacity-[0.06]"
              style={{ background: "radial-gradient(circle, #F97316, transparent)" }} />

            {/* Floating card decorativa */}
            <div className="absolute top-24 right-8 hidden xl:block float-anim z-10">
              <div className="bg-white shadow-2xl border border-gray-100 p-4 w-56 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Star size={14} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Postulación aceptada</p>
                    <p className="text-[10px] text-gray-400 font-light">hace 2 minutos</p>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 rounded-full" style={{ background: "linear-gradient(90deg, #1B6FE8, #06B6D4)" }} />
                </div>
                <p className="text-[10px] text-gray-400 mt-2 font-medium">Landing page · En progreso</p>
              </div>
            </div>

            <div className="relative z-10 max-w-lg ml-auto">
              <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease }}>

                <div className="label-ticket mb-8" style={{ background: "#FFF7ED", borderColor: "#FED7AA", color: "#EA580C", fontFamily: "Outfit, sans-serif" }}>
                  <GraduationCap size={11} /> Estudiantes de ingeniería · Ciclo 7+
                </div>

                <h1 className="font-display text-5xl xl:text-[3.5rem] text-gray-900 leading-[1.08] mb-6 tracking-tight" style={{ fontWeight: 300 }}>
                  Experiencia real{" "}
                  <span className="grad-text grad-orange" style={{ fontWeight: 600 }}>para tu CV</span>
                  <br />sin esperar a titularte
                </h1>

                <p className="text-gray-500 text-[1.1rem] leading-[1.7] mb-8 font-light">
                  Trabaja en proyectos reales de empresas locales. Sé de los primeros en unirte, construye tu portafolio y obtén constancias verificables.
                </p>

                {/* Botones directos (Sin buscador) */}
                <div className="flex flex-wrap gap-4 mb-10">
                  <Link to="/register/estudiante">
                    <button className="btn-acc btn-acc-lg w-full sm:w-auto shadow-lg">
                      Unirme como Estudiante <ArrowRight size={18} />
                    </button>
                  </Link>
                  <Link to="/login">
                    <button className="btn-ghost btn-ghost-lg w-full sm:w-auto">
                      Ya tengo cuenta
                    </button>
                  </Link>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-400 text-sm font-light">
                  {["Portafolio verificable", "Badge con QR", "Oportunidades futuras"].map(t => (
                    <span key={t} className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-orange-400" /> {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── SOCIAL PROOF BAR (Blanco puro) ─────────────────────────────── */}
        <div className="bg-white border-b border-gray-200 py-10 relative z-10">
          <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-x-20 gap-y-6 text-center">
            <div>
              <p className="font-display text-4xl font-bold text-gray-900">100%</p>
              <p className="text-sm text-gray-500 mt-1 font-light">Conexión Local</p>
            </div>
            <div className="hidden sm:block w-px bg-gray-200"></div>
            <div>
              <p className="font-display text-4xl font-bold text-gray-900">0 S/.</p>
              <p className="text-sm text-gray-500 mt-1 font-light">Costo para MYPEs</p>
            </div>
            <div className="hidden sm:block w-px bg-gray-200"></div>
            <div>
              <p className="font-display text-4xl font-bold text-gray-900">UPN</p>
              <p className="text-sm text-gray-500 mt-1 font-light">Talento Verificado</p>
            </div>
          </div>
        </div>

        {/* ── CÓMO FUNCIONA (Fondo Slate Claro) ──────────────────────────── */}
        <section className="py-24 bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto px-6">
            <FadeUp className="text-center mb-16">
              <div className="label-ticket mx-auto mb-5" style={{ fontFamily: "Outfit, sans-serif" }}>El Proceso</div>
              <h2 className="font-display text-3xl md:text-4xl text-gray-900 mb-4 tracking-tight" style={{ fontWeight: 300 }}>
                Un flujo simple y <span style={{ fontWeight: 600 }}>directo</span>
              </h2>
              <p className="text-gray-500 text-lg font-light">Diseñado para obtener resultados sin burocracia.</p>
            </FadeUp>

            <div className="grid md:grid-cols-3 gap-8">
              <FadeUp delay={0.1} className="feature-step-card">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-[12px] flex items-center justify-center mb-6">
                  <Users size={24} />
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-3">1. Haz Match</h3>
                <p className="text-gray-500 leading-relaxed text-sm font-light">
                  La MYPE publica su necesidad técnica. Los estudiantes exploran la plataforma y postulan al proyecto que mejor se adapte a su perfil.
                </p>
              </FadeUp>

              <FadeUp delay={0.2} className="feature-step-card">
                <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-[12px] flex items-center justify-center mb-6">
                  <Briefcase size={24} />
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-3">2. Desarrolla</h3>
                <p className="text-gray-500 leading-relaxed text-sm font-light">
                  Trabajo colaborativo 1 a 1 en la plataforma. Entregas pautadas, comunicación directa y un plazo ágil de máximo 5 días.
                </p>
              </FadeUp>

              <FadeUp delay={0.3} className="feature-step-card">
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-[12px] flex items-center justify-center mb-6">
                  <Star size={24} />
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-3">3. Valida y Certifica</h3>
                <p className="text-gray-500 leading-relaxed text-sm font-light">
                  La empresa aprueba y recibe su solución funcional. El estudiante obtiene su constancia firmada y un badge verificable para su currículum.
                </p>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ── TIPOS DE PROYECTOS (Fondo Sky Blue Suave) ──────────────────── */}
        <section className="py-24 bg-[#F0F9FF] border-y border-blue-100">
          <div className="max-w-6xl mx-auto px-6">
            <FadeUp className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <div className="label-ticket mx-auto mb-4 bg-blue-100 border-blue-200 text-blue-800" style={{ fontFamily: "Outfit, sans-serif" }}>
                  <Sparkles size={11} /> Áreas de Especialidad
                </div>
                <h2 className="font-display text-3xl text-gray-900 mb-3 tracking-tight" style={{ fontWeight: 300 }}>
                  Más de <span className="grad-text grad-blue" style={{ fontWeight: 600 }}>14 tipos</span> de proyectos
                </h2>
                <p className="text-slate-600 font-light">Conoce todo lo que se puede resolver en nuestra plataforma.</p>
              </div>
            </FadeUp>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {TIPOS.slice(0, 10).map((t, i) => (
                <FadeUp key={t.label} delay={i * 0.04}>
                  <div className="project-card border-blue-100">
                    <t.icon size={22} className="pc-icon text-blue-300 mb-1 transition-colors" />
                    <div>
                      <p className="font-semibold text-[14px] text-gray-900 leading-tight">{t.label}</p>
                      <p className="text-[12px] text-blue-500 mt-1 font-light">{t.rama}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUÉ GANA CADA UNO (Fondo Blanco) ───────────────────────────── */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <FadeUp className="text-center mb-14">
              <h2 className="font-display text-3xl lg:text-[2.75rem] font-bold text-gray-900 tracking-tight">
                ¿Qué gana cada uno?
              </h2>
            </FadeUp>
            <div className="grid md:grid-cols-2 gap-8">

              {/* MYPE card */}
              <FadeUp delay={0.1}>
                <div className="benefit-card-dark p-8 h-full">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg"
                      style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.25)" }}>
                      <Building2 size={18} style={{ color: "#67E8F9" }} />
                    </div>
                    <h3 className="font-display text-xl font-bold text-white tracking-tight">Tu empresa recibe</h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Solución tecnológica funcional en máximo 5 días",
                      "Servicio completamente gratuito, sin letra chica",
                      "Nosotros categorizamos los perfiles adecuados",
                      "Ciclos de revisión para asegurar que cumpla lo acordado"
                    ].map((item, i) => (
                      <motion.li key={item} initial={{ opacity: 0, x: -14 }}
                        whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        transition={{ delay: 0.08 + i * 0.07, ease }}
                        className="flex items-start gap-3 text-sm text-white/70 leading-[1.6] font-light">
                        <CheckCircle2 size={15} style={{ color: "#67E8F9", marginTop: 2, flexShrink: 0 }} />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </FadeUp>

              {/* Estudiante card */}
              <FadeUp delay={0.2}>
                <div className="benefit-card-light p-8 h-full">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 flex items-center justify-center bg-orange-50 rounded-lg"
                      style={{ border: "1px solid #FED7AA" }}>
                      <GraduationCap size={18} className="text-orange-500" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-gray-900 tracking-tight">El estudiante obtiene</h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Experiencia laboral real con empresas de Cajamarca",
                      "Constancia firmada por el representante de la MYPE",
                      "Badge digital con QR verificable para LinkedIn y CV",
                      "Proyecto validado para construir su portafolio profesional"
                    ].map((item, i) => (
                      <motion.li key={item} initial={{ opacity: 0, x: -14 }}
                        whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        transition={{ delay: 0.08 + i * 0.07, ease }}
                        className="flex items-start gap-3 text-sm text-gray-600 leading-[1.6] font-light">
                        <CheckCircle2 size={15} className="text-orange-400 mt-0.5 shrink-0" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ── STATS (Fondo Pale Orange) ──────────────────────────────────── */}
        <section className="py-20 bg-[#FFF7ED] border-y border-orange-100">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-8">
              {[
                { n: "14", label: "Tipos de proyectos", icon: Zap, color: "#1B6FE8" },
                { n: "5d", label: "Entrega máxima", icon: Clock, color: "#06B6D4" },
                { n: "7+", label: "Ciclo mínimo", icon: GraduationCap, color: "#8B5CF6" },
                { n: "0 S/.", label: "Costo MYPE", icon: Star, color: "#F97316" },
              ].map((s, i) => (
                <FadeUp key={s.label} delay={i * 0.1}>
                  <div className="stat-circle border-orange-100">
                    <s.icon size={20} className="sc-icon mb-1" style={{ color: s.color }} />
                    <p className="sc-num font-display text-2xl font-bold text-gray-900">{s.n}</p>
                    <span className="sc-label text-[11px] text-gray-500 font-medium text-center px-3 leading-tight mt-0.5">{s.label}</span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL (Fondo Slate Oscuro) ─────────────────────────────── */}
        <section className="py-24 bg-[#F8FAFC]">
          <div className="max-w-5xl mx-auto px-6">
            <FadeUp>
              <div className="relative overflow-hidden rounded-[20px]"
                style={{
                  background: "linear-gradient(150deg,#081524 0%,#0F2A4A 50%,#0B3060 100%)",
                }}>
                <div className="absolute inset-0 opacity-[0.04]"
                  style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[80px] opacity-12 -mr-40 -mt-40"
                  style={{ background: "radial-gradient(circle,#06B6D4,transparent 70%)" }} />
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[60px] opacity-10 -ml-20 -mb-20"
                  style={{ background: "radial-gradient(circle,#F97316,transparent)" }} />

                <div className="relative z-10 p-10 lg:p-16">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                      <div className="label-ticket mb-6" style={{ background: "rgba(6,182,212,0.1)", borderColor: "rgba(6,182,212,0.25)", color: "#67E8F9", fontFamily: "Outfit, sans-serif" }}>
                        <Sparkles size={11} /> Únete a la plataforma
                      </div>
                      <h2 className="font-display text-3xl lg:text-4xl text-white mb-5 leading-tight tracking-tight" style={{ fontWeight: 300 }}>
                        Cajamarca necesita más conexión entre{" "}
                        <span className="grad-text grad-cyan" style={{ fontWeight: 600 }}>empresas y talento</span>
                      </h2>
                      <p className="text-[1rem] leading-[1.7] text-white/50 font-light">
                        Sé de los primeros en registrarte. MYPElink hace posible esta conexión de manera gratuita y eficiente.
                      </p>
                    </div>
                    <div className="flex flex-col gap-4">
                      <Link to="/register/mype" className="block">
                        <button className="btn-white w-full">
                          <span className="flex items-center gap-2 font-semibold">
                            <Building2 size={16} /> Registrar mi empresa
                          </span>
                          <ChevronRight size={16} className="text-gray-400" />
                        </button>
                      </Link>
                      <Link to="/register/estudiante" className="block">
                        <button className="btn-acc w-full justify-between" style={{ height: "54px" }}>
                          <span className="flex items-center gap-2 font-semibold">
                            <GraduationCap size={16} /> Unirme como estudiante
                          </span>
                          <ChevronRight size={16} style={{ opacity: 0.7 }} />
                        </button>
                      </Link>
                      <p className="text-center text-xs mt-2 text-white/30 font-light">
                        Sin tarjeta · Sin compromisos · Solo creá tu cuenta
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────────────────── */}
        <footer className="border-t border-gray-200 bg-white py-10">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo />
            <p className="text-sm text-gray-500 font-medium">
              © 2026 MYPElink · Proyecto Capstone UPN Cajamarca
            </p>
            <div className="flex gap-6 text-sm font-medium text-gray-600">
              <Link to="/login" className="hover:text-[#1B6FE8] transition-colors">Iniciar sesión</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}