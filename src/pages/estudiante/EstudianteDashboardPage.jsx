import React from "react";
import { useAuthStore } from "../../store/authStore";
import { useMisPostulaciones } from "../../features/postulaciones-list/useMisPostulaciones";
import { useCertificados } from "../../features/certificados/useCertificados";
import {
  useNotificaciones,
  useLeerNotificacion,
} from "../../features/notificaciones/useNotificaciones";
import { useProyectos } from "../../features/proyectos-list/useProyectos";
import {
  ArrowRight,
  Handshake,
  Mail,
  ChevronRight,
  Award,
  Building2,
  Briefcase,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const getAreaStyle = (area) => {
  switch (area) {
    case "DESARROLLO_WEB":
      return "bg-blue-50 text-blue-700 border border-blue-100";
    case "DESARROLLO_MOVIL":
      return "bg-emerald-50 text-emerald-700 border border-emerald-100";
    case "DESARROLLO_SOFTWARE":
      return "bg-violet-50 text-violet-700 border border-violet-100";
    case "BASE_DE_DATOS":
      return "bg-amber-50 text-amber-700 border border-amber-100";
    case "ANALISIS_DATOS":
      return "bg-pink-50 text-pink-700 border border-pink-100";
    case "SOPORTE_TI":
      return "bg-slate-50 text-slate-700 border border-slate-200";
    default:
      return "bg-indigo-50 text-indigo-700 border border-indigo-100";
  }
};

const EstudianteDashboardPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { mutate: leerNotificacion } = useLeerNotificacion();

  const { data: postulaciones, isLoading: loadingPostulaciones } =
    useMisPostulaciones();
  const { data: certificados, isLoading: loadingCertificados } =
    useCertificados();
  const { data: notificaciones, isLoading: loadingNotificaciones } =
    useNotificaciones();
  const { data: proyectosData, isLoading: loadingProyectos } = useProyectos();

  const totalPostulaciones = postulaciones?.length || 0;

  // ✨ CORRECCIÓN: El estado real en el backend al confirmarse un proyecto es 'CONFIRMADO' o 'VALIDADO_MYPE'
  const activos =
    postulaciones?.filter(
      (p) => p.estado === "CONFIRMADO" || p.estado === "VALIDADO_MYPE",
    ) || [];
  const aceptadosYConfirmados =
    postulaciones?.filter((p) => p.estado === "CONFIRMADO").length || 0;
  const totalCertificados = certificados?.length || 0;

  const activityItems = notificaciones?.slice(0, 3) || [];
  const proyectosRecomendados = proyectosData?.content?.slice(0, 3) || [];

  let completitud = 20;
  if (user?.bio) completitud += 20;
  if (user?.skills && user.skills.length > 0) completitud += 20;
  if (user?.telefono) completitud += 20;
  if (user?.linkedinUrl || user?.portafolioUrl) completitud += 20;

  const porcentajeExito =
    totalPostulaciones > 0
      ? Math.round((aceptadosYConfirmados / totalPostulaciones) * 100)
      : 0;

/* ═══════════════════════════════════════════════
   SUB: Ring SVG
═══════════════════════════════════════════════ */
const Ring = ({ pct = 0, color = '#1B6FE8', icon: Icon }) => {
  const R = 22;
  const circ = 2 * Math.PI * R;
  const offset = circ - (circ * Math.min(pct, 100)) / 100;
  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Welcome Hero Banner */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-tr from-[#1a2d42] via-[#1e3a5f] to-[#4648d4] p-8 lg:p-12 text-white shadow-xl min-h-[260px] flex flex-col justify-center"
          >
            <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-[#4648d4]/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-[#1e3a5f]/40 rounded-full blur-2xl"></div>

            <div className="relative z-10 max-w-lg">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-white/90 border border-white/10 uppercase tracking-wider">
                Portal de Estudiantes
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold mt-4 mb-2 tracking-tight">
                ¡Hola, {user?.nombre?.split(" ")[0] || "Estudiante"}!
              </h1>
              <p className="text-base lg:text-lg opacity-90 max-w-md font-medium">
                Tu camino hacia el crecimiento profesional continúa. Tienes{" "}
                {proyectosRecomendados.length > 0 ? "nuevas" : ""} ofertas
                listas para ti.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/proyectos"
                  className="inline-flex items-center gap-2 bg-white text-[#1e3a5f] px-6 py-3.5 rounded-full font-bold hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Ver Proyectos Recomendados
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </motion.section>

          {/* Active Workspaces Panel */}
          {activos.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4"
            >
              <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <Rocket className="text-primary" size={20} />
                Mis Proyectos Activos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activos.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col justify-between h-32 hover:border-primary/20 hover:shadow-sm transition-all duration-300"
                  >
                    <div>
                      <span
                        className={`text-[9px] font-black bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider ${p.estado === "CONFIRMADO" ? "text-emerald-600 bg-emerald-50" : "text-primary"}`}
                      >
                        {p.estado === "CONFIRMADO"
                          ? "En Ejecución"
                          : "Oferta Pendiente"}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 mt-2 line-clamp-1">
                        {p.proyectoTitulo}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100/50">
                      <span className="text-[10px] text-slate-400 font-bold">
                        VincuMYPEs Platform
                      </span>
                      {p.estado === "CONFIRMADO" ? (
                        <Link
                          to={`/workspace/${p.proyectoId}`}
                          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          Ir al Workspace <ArrowRight size={12} />
                        </Link>
                      ) : (
                        <Link
                          to="/mis-postulaciones"
                          className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
                        >
                          Revisar Oferta <ArrowRight size={12} />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Metric Cards Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Mi Perfil
                </span>
                <p className="text-sm font-bold">Completitud</p>
                <p className="text-3xl font-extrabold text-[#1e3a5f]">
                  {completitud}%
                </p>
                {completitud < 100 && (
                  <Link
                    to="/perfil"
                    className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1"
                  >
                    Completar datos <ArrowRight size={12} />
                  </Link>
                )}
              </div>
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="#f1f5f9"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="#1e3a5f"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={163.3}
                    strokeDashoffset={163.3 - (163.3 * completitud) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <User
                  size={18}
                  className="absolute text-[#1e3a5f] group-hover:scale-110 transition-transform"
                />
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Mis Aplicaciones
                </span>
                <p className="text-sm font-bold">Postulaciones</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-on-surface">
                    {loadingPostulaciones ? "..." : totalPostulaciones}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">
                    ({aceptadosYConfirmados} OK)
                  </span>
                </div>
                <Link
                  to="/mis-postulaciones"
                  className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1"
                >
                  Gestionar <ArrowRight size={12} />
                </Link>
              </div>
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="#f1f5f9"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="#4f46e5"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={163.3}
                    strokeDashoffset={163.3 - (163.3 * porcentajeExito) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <Handshake
                  size={18}
                  className="absolute text-[#4f46e5] group-hover:scale-110 transition-transform"
                />
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Reconocimientos
                </span>
                <p className="text-sm font-bold">Certificados</p>
                <p className="text-3xl font-extrabold text-[#059669]">
                  {loadingCertificados ? "..." : totalCertificados}
                </p>
                <Link
                  to="/certificados"
                  className="text-xs text-[#059669] font-bold hover:underline inline-flex items-center gap-1"
                >
                  Ver logros <ArrowRight size={12} />
                </Link>
              </div>
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="#f1f5f9"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="#059669"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={163.3}
                    strokeDashoffset={
                      163.3 - (163.3 * (totalCertificados > 0 ? 100 : 0)) / 100
                    }
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <Award
                  size={18}
                  className="absolute text-[#059669] group-hover:scale-110 transition-transform"
                />
              </div>
            </div>
          </div>

          {/* Recommended Projects */}
          <section className="bg-white border border-gray-200 rounded-[2rem] p-6 lg:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                <Rocket className="text-primary" size={24} />
                Proyectos Recomendados para ti
              </h2>
              <Link
                to="/proyectos"
                className="text-primary font-bold hover:underline text-sm flex items-center gap-1"
              >
                Explorar todos <ArrowRight size={16} />
              </Link>
            </div>

            {loadingProyectos ? (
              <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                <Loader2 className="animate-spin text-primary" size={20} />
                <span>Buscando mejores oportunidades...</span>
              </div>
            ) : proyectosRecomendados.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-gray-300">
                No hay proyectos recomendados disponibles por el momento.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {proyectosRecomendados.map((proyecto) => (
                  <Link
                    to={`/proyectos/${proyecto.id}`}
                    key={proyecto.id}
                    className="group bg-slate-50 p-5 rounded-2xl border border-gray-200/50 hover:border-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-56"
                  >
                    <div>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-primary font-bold text-[9px] uppercase tracking-wider">
                        {proyecto.areaSistemas?.replace("_", " ") || "SISTEMAS"}
                      </span>
                      <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors mt-2 line-clamp-2 leading-tight">
                        {proyecto.titulo}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1 font-medium">
                        <Building2 size={12} /> {proyecto.mypeNombre || "MYPE"}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-200/40 flex items-center justify-between text-xs">
                      <div className="text-[10px] text-slate-400">
                        Límite:{" "}
                        <span className="font-bold text-red-500">
                          {proyecto.fechaLimite}
                        </span>
                      </div>
                      <span className="text-primary font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                        Postular <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <section className="bg-white border border-gray-200 rounded-[2rem] p-6 shadow-sm">
            <h2 className="text-xl font-bold text-on-surface mb-4">
              Acciones Rápidas
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/perfil"
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-primary/5 border border-gray-100 hover:border-primary/30 transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-[#1e3a5f] group-hover:scale-110 transition-transform mb-2">
                  <User size={20} />
                </div>
                <span className="text-xs font-bold">Mi Perfil</span>
              </Link>
              <Link
                to="/proyectos"
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-primary/5 border border-gray-100 hover:border-primary/30 transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform mb-2">
                  <Briefcase size={20} />
                </div>
                <span className="text-xs font-bold">Explorar</span>
              </Link>
              <Link
                to="/mis-postulaciones"
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-primary/5 border border-gray-100 hover:border-primary/30 transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform mb-2">
                  <Clock size={20} />
                </div>
                <span className="text-xs font-bold">Aplicaciones</span>
              </Link>
              <Link
                to="/certificados"
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-primary/5 border border-gray-100 hover:border-primary/30 transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform mb-2">
                  <Award size={20} />
                </div>
                <span className="text-xs font-bold">Certificados</span>
              </Link>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-on-surface">
                Actividad Reciente
              </h2>
              <Link
                to="/mis-postulaciones"
                className="text-xs text-primary font-bold hover:underline"
              >
                Ver todo
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {loadingNotificaciones ? (
                <div className="p-4 text-center text-slate-500 text-xs">
                  Cargando actividad...
                </div>
              ) : activityItems.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-gray-200 rounded-2xl">
                  No hay actividad reciente.
                </div>
              ) : (
                activityItems.map((item, index) => (
                  <div
                    key={item.id || index}
                    className={`flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer ${!item.leida ? "bg-blue-50/20 font-semibold" : ""}`}
                    onClick={() => {
                      if (!item.leida) leerNotificacion(item.id);
                      if (item.urlReferencia) navigate(item.urlReferencia);
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-[#1e3a5f] shrink-0 mt-0.5">
                      <Mail size={18} />
                    </div>
                    <div className="grow min-w-0">
                      <p className="text-xs leading-tight line-clamp-2">
                        <span className="font-bold">{item.titulo}</span>{" "}
                        {item.mensaje}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(item.fechaCreacion).toLocaleDateString()}
                      </p>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-2"
                    />
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
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

/* ═══════════════════════════════════════════════
   SUB: Project Card
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

  return (
    <Link to={`/proyectos/${proyecto.id}`} style={{ textDecoration: 'none' }}>
      <div
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
            {proyecto.mypeNombre || 'MYPE'}
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
    </Link>
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
          Portal de estudiantes · Beta 2026
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

  const { data: postulaciones,  isLoading: loadingPostulaciones  } = useMisPostulaciones();
  const { data: certificados,   isLoading: loadingCertificados   } = useCertificados();
  const { data: notificaciones, isLoading: loadingNotificaciones } = useNotificaciones();
  const { data: proyectosData,  isLoading: loadingProyectos      } = useProyectos();

  const totalPostulaciones    = postulaciones?.length || 0;
  const aceptados             = postulaciones?.filter(p => p.estado === 'ACEPTADO' || p.estado === 'Aceptado').length || 0;
  const totalCertificados     = certificados?.length || 0;
  const activityItems         = notificaciones?.slice(0, 3) || [];
  const proyectosRecomendados = proyectosData?.content?.slice(0, 3) || [];
  const proyectosActivos      = postulaciones?.filter(p => p.estado === 'ACEPTADO' || p.estado === 'Aceptado') || [];

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
    <div style={{ fontFamily:"Inter, Arial, 'Helvetica Neue', sans-serif", background:'#f5f4f0', minHeight:'100vh', padding:'32px 36px', maxWidth:1440, margin:'0 auto' }}>

      {/* ── TOPBAR ── */}
      <motion.div {...fadeUp(0)} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, letterSpacing:'-0.03em', color:'#0f1f3d' }}>
            ¡Hola, {firstName}!
          </h1>
          <p style={{ fontSize:13, color:'#6b6b7a', marginTop:2 }}>
            {proyectosRecomendados.length > 0
              ? `${proyectosRecomendados.length} proyectos nuevos esperándote`
              : 'Tu panel de control profesional'}
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
          <Link to="/notificaciones" style={{ textDecoration:'none' }}>
            <div style={{ position:'relative', width:36, height:36, borderRadius:8, border:'0.5px solid #e8e8e4', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
              <Bell size={16} color="#6b6b7a" />
              {activityItems.some(n => !n.leida) && (
                <div style={{ position:'absolute', top:7, right:7, width:7, height:7, borderRadius:'50%', background:'#d4580a', border:'1.5px solid #fff' }} />
              )}
            </div>
          </Link>
        </div>
      </motion.div>

      {/* ── BARRA DE COMPLETITUD ── */}
      <motion.div {...fadeUp(0.04)} style={{ background:'#fff', border:'0.5px solid #e8e8e4', borderRadius:12, padding:'12px 18px', display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
        <span style={{ fontSize:12, fontWeight:600, color:'#0f1f3d', whiteSpace:'nowrap' }}>Perfil {completitud}%</span>
        <div style={{ flex:1, height:5, background:'#f1f5f9', borderRadius:3, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${completitud}%`, background:'linear-gradient(90deg,#1B6FE8,#06B6D4)', borderRadius:3, transition:'width 1s ease' }} />
        </div>
        <Link to="/perfil" style={{ fontSize:11, fontWeight:700, color:'#d4580a', whiteSpace:'nowrap', textDecoration:'none' }}>
          Completar →
        </Link>
      </motion.div>

      {/* ── HERO BANNER ANIMADO ── */}
      <HeroBanner
        proyectosTotal={proyectosData?.totalElements}
        aceptados={aceptados}
      />

      {/* ── PROYECTOS ACTIVOS (si existen) ── */}
      {proyectosActivos.length > 0 && (
        <motion.div {...fadeUp(0.12)} style={{ marginBottom:20 }}>
          {proyectosActivos.map((p, idx) => (
            <Link key={idx} to={`/workspace/${p.proyectoId}`} style={{ textDecoration:'none' }}>
              <div
                style={{ background:'linear-gradient(135deg,#0d1b35,#0f2a4a)', borderRadius:14, padding:'16px 22px', marginBottom:10, display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative', overflow:'hidden', cursor:'pointer', transition:'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(13,27,53,0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}
              >
                <div style={{ position:'absolute', top:-40, right:-40, width:120, height:120, borderRadius:'50%', background:'rgba(27,111,232,0.1)', pointerEvents:'none' }} />
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:10, height:10, borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 0 3px rgba(74,222,128,0.15)', flexShrink:0 }} />
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:'#fff', letterSpacing:'-0.01em' }}>{p.proyectoTitulo}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:2 }}>Proyecto activo · Ir al workspace</div>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10, position:'relative', zIndex:2 }}>
                  <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', background:'rgba(27,111,232,0.2)', border:'1px solid rgba(27,111,232,0.3)', color:'#67d4f8', padding:'3px 10px', borderRadius:4 }}>
                    En ejecución
                  </span>
                  <ArrowRight size={16} color="rgba(255,255,255,0.3)" />
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      )}

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
              return (
                <div
                  key={item.id || index}
                  onClick={() => { if (!item.leida) leerNotificacion(item.id); if (item.urlReferencia) navigate(item.urlReferencia); }}
                  style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'10px 0', borderBottom: index < activityItems.length - 1 ? '0.5px solid #e8e8e4' : 'none', cursor:'pointer', transition:'padding-left 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.paddingLeft = '4px'; }}
                  onMouseLeave={e => { e.currentTarget.style.paddingLeft = '0'; }}
                >
                  <div style={{ width:8, height:8, borderRadius:'50%', background:dotColors[index % dotColors.length], flexShrink:0, marginTop:5 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, color:'#0f1f3d', lineHeight:1.45 }}>
                      <strong style={{ fontWeight:600 }}>{item.titulo}</strong>{' '}
                      <span style={{ fontWeight:400, color:'#6b6b7a' }}>{item.mensaje}</span>
                    </div>
                    <div style={{ fontSize:11, color:'#6b6b7a', marginTop:2 }}>
                      {new Date(item.fechaCreacion).toLocaleDateString('es-PE', { day:'numeric', month:'short' })}
                    </div>
                  </div>
                  {!item.leida && <div style={{ width:6, height:6, borderRadius:'50%', background:'#1B6FE8', marginTop:5, flexShrink:0 }} />}
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
    </div>
  );
};

export default EstudianteDashboardPage;