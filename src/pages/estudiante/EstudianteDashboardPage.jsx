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
  Rocket,
  Search,
  User,
  Clock,
  CheckCircle,
  ArrowRight,
  Handshake,
  Mail,
  ChevronRight,
  Award,
  Building2,
  Briefcase,
  Loader2, // ✨ CORRECCIÓN: Agrega esta línea aquí
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

export default EstudianteDashboardPage;
