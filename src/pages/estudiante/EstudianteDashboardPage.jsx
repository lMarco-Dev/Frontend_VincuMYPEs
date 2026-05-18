import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useMisPostulaciones } from '../../features/postulaciones-list/useMisPostulaciones';
import { useCertificados } from '../../features/certificados/useCertificados';
import { useNotificaciones, useLeerNotificacion } from '../../features/notificaciones/useNotificaciones';
import { useProyectos } from '../../features/proyectos-list/useProyectos';
import {
  Rocket,
  Search,
  User,
  Clock,
  CheckCircle,
  ArrowRight,
  Send,
  Handshake,
  Mail,
  ChevronRight,
  Square,
  FileText,
  Headphones,
  Award,
  Building2,
  Briefcase
} from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const EstudianteDashboardPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { mutate: leerNotificacion } = useLeerNotificacion();
  
  // Consulta de datos reales
  const { data: postulaciones, isLoading: loadingPostulaciones } = useMisPostulaciones();
  const { data: certificados, isLoading: loadingCertificados } = useCertificados();
  const { data: notificaciones, isLoading: loadingNotificaciones } = useNotificaciones();
  const { data: proyectosData, isLoading: loadingProyectos } = useProyectos();

  const totalPostulaciones = postulaciones?.length || 0;
  const aceptados = postulaciones?.filter(p => p.estado === 'ACEPTADO' || p.estado === 'Aceptado').length || 0;
  const totalCertificados = certificados?.length || 0;
  
  // Mostrar las últimas 3 notificaciones como actividad reciente
  const activityItems = notificaciones?.slice(0, 3) || [];

  // Obtener 3 proyectos recomendados
  const proyectosRecomendados = proyectosData?.content?.slice(0, 3) || [];

  // Calcular completitud de perfil
  let completitud = 20; // Base por registro
  if (user?.bio) completitud += 20;
  if (user?.skills && user.skills.length > 0) completitud += 20;
  if (user?.telefono) completitud += 20;
  if (user?.linkedinUrl || user?.portafolioUrl) completitud += 20;

  // Calcular porcentaje de éxito en postulaciones
  const porcentajeExito = totalPostulaciones > 0 ? Math.round((aceptados / totalPostulaciones) * 100) : 0;

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* 2-Column Responsive Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Welcome Hero Banner with Liquid Mesh Gradient style */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-tr from-[#1a2d42] via-[#1e3a5f] to-[#4648d4] p-8 lg:p-12 text-white shadow-xl min-h-[260px] flex flex-col justify-center"
          >
            {/* Blurry Organic Mesh Orbs */}
            <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-[#4648d4]/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-[#1e3a5f]/40 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 max-w-lg">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-white/90 border border-white/10 uppercase tracking-wider">
                Portal de Estudiantes
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold mt-4 mb-2 tracking-tight">
                ¡Hola, {user?.nombre?.split(' ')[0] || 'Estudiante'}!
              </h1>
              <p className="text-base lg:text-lg opacity-90 max-w-md font-medium">
                Tu camino hacia el crecimiento profesional continúa. Tienes {proyectosRecomendados.length > 0 ? 'nuevas' : ''} ofertas listas para ti.
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
            
            <div className="absolute right-12 bottom-0 hidden md:block z-10 scale-105">
              <img 
                alt="Students collaborating" 
                className="w-72 h-52 object-cover rounded-t-[2rem] border-x-4 border-t-4 border-white/20 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 origin-bottom" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgDGnqoJyGyctQiqb55CMi_jFc76Xz1O-q1voVfygz5JKdfcq3bhhYCAJyc87q5Py6r-kMPP_HBDWiAVb5hYCNneLMLbwpcE8t6d-9sAaKzi22CNcdZhKv4H2C0NpCIL5Ucz0pzsX26OlY403w0uoA1-3EM0gNIzejLssTnpyh4mLlS3emERcQi7_X8ftCA99_2WNDnTFg4JMm1qyouNp2EP3vazLywYnulM-5Un48J3QW3ob6Wi6cfFvjEwhHWUZXI8vfA6y636Y" 
              />
            </div>
          </motion.section>

          {/* Active Workspaces Panel */}
          {aceptados > 0 && (
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
                {postulaciones?.filter(p => p.estado === 'ACEPTADO' || p.estado === 'Aceptado').map((p, idx) => (
                  <div key={idx} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col justify-between h-32 hover:border-primary/20 hover:shadow-sm transition-all duration-300">
                    <div>
                      <span className="text-[9px] font-black text-primary bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">
                        En Ejecución
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 mt-2 line-clamp-1">{p.proyectoTitulo}</h4>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100/50">
                      <span className="text-[10px] text-slate-400 font-bold">MYPE Asociada</span>
                      <Link to={`/workspace/${p.proyectoId}`} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                        Ir al Workspace <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Metric Cards Bento Grid with Circular SVG Progress Rings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Completitud de Perfil */}
            <div className="bg-surface-container-lowest border border-outline-variant/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Mi Perfil</span>
                <p className="text-on-surface-variant text-sm font-bold">Completitud</p>
                <p className="text-3xl font-extrabold text-[#1e3a5f]">{completitud}%</p>
                {completitud < 100 && (
                  <Link to="/perfil" className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1">
                    Completar datos <ArrowRight size={12} />
                  </Link>
                )}
              </div>
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="26" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                  <circle 
                    cx="32" cy="32" r="26" stroke="#1e3a5f" strokeWidth="6" fill="transparent"
                    strokeDasharray={163.3} strokeDashoffset={163.3 - (163.3 * completitud) / 100}
                    strokeLinecap="round" className="transition-all duration-1000 ease-out" 
                  />
                </svg>
                <User size={18} className="absolute text-[#1e3a5f] group-hover:scale-110 transition-transform" />
              </div>
            </div>

            {/* Card 2: Postulaciones y Éxito */}
            <div className="bg-surface-container-lowest border border-outline-variant/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Mis Aplicaciones</span>
                <p className="text-on-surface-variant text-sm font-bold">Postulaciones</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-on-surface">{loadingPostulaciones ? '...' : totalPostulaciones}</span>
                  <span className="text-xs text-slate-400 font-bold">({aceptados} Aceptados)</span>
                </div>
                <Link to="/mis-postulaciones" className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1">
                  Gestionar <ArrowRight size={12} />
                </Link>
              </div>
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="26" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                  <circle 
                    cx="32" cy="32" r="26" stroke="#4f46e5" strokeWidth="6" fill="transparent"
                    strokeDasharray={163.3} strokeDashoffset={163.3 - (163.3 * porcentajeExito) / 100}
                    strokeLinecap="round" className="transition-all duration-1000 ease-out" 
                  />
                </svg>
                <Handshake size={18} className="absolute text-[#4f46e5] group-hover:scale-110 transition-transform" />
              </div>
            </div>

            {/* Card 3: Certificados Obtenidos */}
            <div className="bg-surface-container-lowest border border-outline-variant/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Reconocimientos</span>
                <p className="text-on-surface-variant text-sm font-bold">Certificados</p>
                <p className="text-3xl font-extrabold text-[#059669]">{loadingCertificados ? '...' : totalCertificados}</p>
                <Link to="/certificados" className="text-xs text-[#059669] font-bold hover:underline inline-flex items-center gap-1">
                  Ver logros <ArrowRight size={12} />
                </Link>
              </div>
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="26" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                  <circle 
                    cx="32" cy="32" r="26" stroke="#059669" strokeWidth="6" fill="transparent"
                    strokeDasharray={163.3} strokeDashoffset={163.3 - (163.3 * (totalCertificados > 0 ? 100 : 0)) / 100}
                    strokeLinecap="round" className="transition-all duration-1000 ease-out" 
                  />
                </svg>
                <Award size={18} className="absolute text-[#059669] group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>

          {/* Dynamic Recommended Projects Section */}
          <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-[2rem] p-6 lg:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                <Rocket className="text-primary" size={24} />
                Proyectos Recomendados para ti
              </h2>
              <Link to="/proyectos" className="text-primary font-bold hover:underline text-sm flex items-center gap-1">
                Explorar todos
                <ArrowRight size={16} />
              </Link>
            </div>
            
            {loadingProyectos ? (
              <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Buscando mejores oportunidades...</span>
              </div>
            ) : proyectosRecomendados.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant">
                No hay proyectos recomendados disponibles por el momento.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {proyectosRecomendados.map((proyecto) => (
                  <Link 
                    to={`/proyectos/${proyecto.id}`}
                    key={proyecto.id}
                    className="group bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 hover:border-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-56"
                  >
                    <div>
                      <span className="px-2 py-0.5 rounded bg-primary-container/10 text-primary font-bold text-[9px] uppercase tracking-wider">
                        {proyecto.areaSistemas?.replace('_', ' ') || 'SISTEMAS'}
                      </span>
                      <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors mt-2 line-clamp-2 leading-tight">
                        {proyecto.titulo}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1 font-medium">
                        <Building2 size={12} />
                        {proyecto.mypeNombre || 'MYPE'}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                      <div className="text-[10px] text-slate-400">
                        Límite: <span className="font-bold text-error">{proyecto.fechaLimite}</span>
                      </div>
                      <span className="text-primary font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                        Postular
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
        
        {/* Right Column (1/3 width - Actions & Activity) */}
        <div className="space-y-8">
          
          {/* Quick Actions Bento Grid */}
          <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-[2rem] p-6 shadow-sm">
            <h2 className="text-xl font-bold text-on-surface mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link 
                to="/perfil" 
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-container-low hover:bg-primary/5 border border-outline-variant/30 hover:border-primary/30 transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-[#1e3a5f] group-hover:scale-110 transition-transform mb-2">
                  <User size={20} />
                </div>
                <span className="text-xs font-bold text-on-surface">Mi Perfil</span>
              </Link>
              <Link 
                to="/proyectos" 
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-container-low hover:bg-primary/5 border border-outline-variant/30 hover:border-primary/30 transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform mb-2">
                  <Briefcase size={20} />
                </div>
                <span className="text-xs font-bold text-on-surface">Explorar</span>
              </Link>
              <Link 
                to="/mis-postulaciones" 
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-container-low hover:bg-primary/5 border border-outline-variant/30 hover:border-primary/30 transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform mb-2">
                  <Clock size={20} />
                </div>
                <span className="text-xs font-bold text-on-surface">Aplicaciones</span>
              </Link>
              <Link 
                to="/certificados" 
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-container-low hover:bg-primary/5 border border-outline-variant/30 hover:border-primary/30 transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform mb-2">
                  <Award size={20} />
                </div>
                <span className="text-xs font-bold text-on-surface">Certificados</span>
              </Link>
            </div>
          </section>

          {/* Recent Activity Vertical Timeline */}
          <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-on-surface">Actividad Reciente</h2>
              <Link to="/mis-postulaciones" className="text-xs text-primary font-bold hover:underline">Ver todo</Link>
            </div>
            <div className="flex flex-col gap-4">
              {loadingNotificaciones ? (
                <div className="p-4 text-center text-slate-500 text-xs">Cargando actividad...</div>
              ) : activityItems.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-outline-variant/40 rounded-2xl">
                  No hay actividad reciente.
                </div>
              ) : (
                activityItems.map((item, index) => (
                  <div 
                    key={item.id || index} 
                    className={`flex items-start gap-3 p-3 rounded-2xl hover:bg-surface-container-low transition-colors group cursor-pointer ${!item.leida ? 'bg-primary-container/5 font-semibold' : ''}`}
                    onClick={() => {
                      if (!item.leida) leerNotificacion(item.id);
                      if (item.urlReferencia) navigate(item.urlReferencia);
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-container/10 flex items-center justify-center text-[#1e3a5f] shrink-0 mt-0.5">
                      <Mail size={18} />
                    </div>
                    <div className="grow min-w-0">
                      <p className="text-on-surface text-xs leading-tight line-clamp-2">
                        <span className="font-bold">{item.titulo}</span> {item.mensaje}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">{new Date(item.fechaCreacion).toLocaleDateString()}</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-2" />
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
