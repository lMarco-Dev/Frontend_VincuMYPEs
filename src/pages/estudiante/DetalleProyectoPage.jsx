import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { httpClient } from '@shared/api/httpClient';
import { useMisPostulaciones } from '../../features/postulaciones-list/useMisPostulaciones';
import { useAuthStore } from '../../store/authStore';
import { usePerfil } from '../../features/perfil/usePerfil';
import PostularButton from '../../features/proyecto-postular/PostularButton';
import {
  ChevronLeft,
  Calendar,
  MapPin,
  Building2,
  BookOpen,
  Clock,
  Target,
  CheckCircle2,
  Cpu,
  ClipboardList,
  Package,
  Sparkles,
  Users,
  CheckCircle,
  Lightbulb
} from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const getAreaStyle = (area) => {
  switch (area) {
    case 'DESARROLLO_WEB':
      return 'bg-blue-50 text-blue-700 border border-blue-100';
    case 'DESARROLLO_MOVIL':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    case 'DESARROLLO_SOFTWARE':
      return 'bg-violet-50 text-violet-700 border border-violet-100';
    case 'BASE_DE_DATOS':
      return 'bg-amber-50 text-amber-700 border border-amber-100';
    case 'ANALISIS_DATOS':
      return 'bg-pink-50 text-pink-700 border border-pink-100';
    case 'SOPORTE_TI':
      return 'bg-slate-50 text-slate-700 border border-slate-200';
    default:
      return 'bg-indigo-50 text-indigo-700 border border-indigo-100';
  }
};

const DetalleProyectoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const { data: postulaciones } = useMisPostulaciones();
  const { data: perfil } = usePerfil();

  // Consulta del detalle del proyecto
  const { data: proyecto, isLoading, isError } = useQuery({
    queryKey: ['proyecto', id],
    queryFn: async () => {
      const response = await httpClient.get(`/proyectos/${id}`);
      return response.data;
    }
  });

  // Validar si el estudiante ya postuló a este proyecto en específico
  const yaPostulo = React.useMemo(() => {
    if (!postulaciones || !id) return false;
    return postulaciones.some(p => p.proyectoId === parseInt(id) || p.proyectoId === id);
  }, [postulaciones, id]);

  // Validar límite de proyectos activos
  const proyectosActivos = React.useMemo(() => {
    return postulaciones?.filter(p => p.estado === 'ACEPTADO' || p.estado === 'Aceptado') || [];
  }, [postulaciones]);

  const limiteProyectos = perfil?.limiteProyectos ?? 1;
  const haSuperadoLimite = proyectosActivos.length >= limiteProyectos;

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
        <svg className="animate-spin h-6 w-6 text-primary" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="font-semibold text-sm">Cargando detalles del proyecto...</span>
      </div>
    );
  }

  if (isError) return <div className="p-12 text-center text-red-500 font-bold">Error al cargar el proyecto.</div>;
  if (!proyecto) return <div className="p-12 text-center text-slate-500">Proyecto no encontrado.</div>;

  // Analizar requisitos y compatibilidad de habilidades
  const reqList = proyecto.requisitos?.split(',').map(r => r.trim()).filter(Boolean) || [];
  const userSkills = user?.skills?.split(',').map(s => s.trim().toLowerCase()) || [];

  // Analizar entregables sugeridos para el checklist
  const entregablesList = proyecto.entregablesSugeridos?.split(',').map(e => e.trim()).filter(Boolean) || [];

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">

      {/* Sleek Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex text-xs text-slate-400 mb-6 items-center gap-2 font-medium">
        <button
          onClick={() => navigate('/proyectos')}
          className="hover:text-primary transition-colors flex items-center gap-1 font-bold"
        >
          <ChevronLeft size={14} />
          Explorar Proyectos
        </button>
        <span className="text-slate-300">/</span>
        <span aria-current="page" className="text-slate-600 font-semibold">{proyecto.titulo}</span>
      </nav>

      {/* Header Mesh Banner */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-tr from-[#1a2d42] via-[#1e3a5f] to-[#4648d4] p-8 lg:p-10 text-white shadow-lg mb-8 flex flex-col justify-center min-h-[200px]"
      >
        {/* Blurry Organic Orbs */}
        <div className="absolute top-[-30%] right-[-10%] w-80 h-80 bg-[#4648d4]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-60 h-60 bg-[#1e3a5f]/40 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {proyecto.areaSistemas && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${getAreaStyle(proyecto.areaSistemas)}`}>
                <Cpu size={12} />
                {proyecto.areaSistemas.replace('_', ' ')}
              </span>
            )}
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white border border-white/10 text-xs font-bold rounded-full uppercase tracking-wider">
              Convocatoria Abierta
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-2 leading-tight">{proyecto.titulo}</h1>
          <div className="flex items-center text-white/95 text-sm font-semibold">
            <Building2 size={18} className="mr-2 text-white/70" />
            <span>{proyecto.mypeNombre || 'MYPE'}</span>
          </div>

          {/* Integrated Unified Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-5 border-t border-white/10 text-xs text-white/90 font-medium">
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/5">
              <MapPin size={13} className="text-white/60" />
              Remoto
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/5">
              <Users size={13} className="text-white/60" />
              {proyecto.cupos} Vacantes Disponibles
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/5">
              <Calendar size={13} className="text-white/60" />
              Inicio: {proyecto.fechaInicio || 'Por definir'}
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/5">
              <Clock size={13} className="text-white/60" />
              Límite: {proyecto.fechaLimite}
            </span>
          </div>
        </div>
      </motion.section>

      {/* 2-Column Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: Main Project Details Bento Card */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-surface-container-lowest p-8 lg:p-10 rounded-[2.5rem] border border-outline-variant/60 shadow-sm space-y-8">

            {/* Descripción */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-indigo-50/80 flex items-center justify-center text-primary">
                  <BookOpen size={18} />
                </div>
                <h2 className="text-xl font-bold text-on-surface">Descripción del Proyecto</h2>
              </div>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm font-medium">
                {proyecto.descripcion}
              </p>
            </div>

            {/* Objetivo */}
            {proyecto.objetivo && (
              <div className="pt-6 border-t border-outline-variant/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50/80 flex items-center justify-center text-blue-600">
                    <Target size={16} />
                  </div>
                  <h3 className="font-bold text-on-surface text-base">Objetivo del Proyecto</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed font-medium whitespace-pre-line">
                  {proyecto.objetivo}
                </p>
              </div>
            )}

            {/* Requisitos Bento matching section */}
            {reqList.length > 0 && (
              <div className="pt-6 border-t border-outline-variant/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-green-50/80 flex items-center justify-center text-green-600">
                    <ClipboardList size={16} />
                  </div>
                  <h3 className="font-bold text-on-surface text-base">Requisitos y Habilidades</h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {reqList.map((req, idx) => {
                    const matches = userSkills.includes(req.toLowerCase());
                    return (
                      <span
                        key={idx}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${matches
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-primary/20'
                          }`}
                      >
                        {matches ? <CheckCircle size={13} className="text-emerald-600" /> : <Lightbulb size={13} className="text-slate-400" />}
                        {req}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Entregables Checklist */}
            {entregablesList.length > 0 && (
              <div className="pt-6 border-t border-outline-variant/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-orange-50/80 flex items-center justify-center text-orange-600">
                    <Package size={16} />
                  </div>
                  <h3 className="font-bold text-on-surface text-base">Entregables Sugeridos</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {entregablesList.map((entregable, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 hover:border-primary/20 transition-all group cursor-default"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={14} className="group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-sm text-slate-700 font-semibold">{entregable}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN: Sticky Bento CTA Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">

            {/* Unified Postular Card */}
            <section className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/60 shadow-md">
              <h3 className="text-xl font-bold text-on-surface mb-2">¿Te interesa?</h3>
              <p className="text-sm text-slate-500 font-medium mb-6 leading-normal">
                Postula hoy mismo agregando tu mensaje de presentación. La empresa recibirá tu perfil de forma inmediata.
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100">
                <div className="flex items-start gap-3">
                  <Calendar className="text-[#1e3a5f] mt-0.5" size={18} />
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Fecha Límite de Aplicación</p>
                    <p className="text-sm font-extrabold text-[#1e3a5f] mt-0.5">{proyecto.fechaLimite}</p>
                  </div>
                </div>
              </div>

              {/* Dynamic PostularButton with full context matching */}
              <div className="flex justify-center w-full">
                <PostularButton
                  proyectoId={proyecto.id}
                  yaPostulo={yaPostulo}
                  disabled={haSuperadoLimite && !yaPostulo}
                />
              </div>

              {haSuperadoLimite && !yaPostulo && (
                <div className="mt-4 p-3.5 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-2.5">
                  <span className="text-amber-600 mt-0.5 text-xs">⚠️</span>
                  <div>
                    <p className="text-xs font-bold text-amber-900 leading-snug">Límite de proyectos activos alcanzado</p>
                    <p className="text-[10px] text-amber-700 font-semibold leading-relaxed mt-0.5">
                      Tienes {proyectosActivos.length} de {limiteProyectos} proyecto(s) activo(s). Solicita un incremento al administrador o finaliza tu trabajo actual para volver a postular.
                    </p>
                  </div>
                </div>
              )}

              <p className="text-[10px] text-center text-slate-400 mt-4 uppercase tracking-widest font-bold">
                Convocatoria Gratuita para Estudiantes
              </p>
            </section>

            {/* Premium Sobre la Empresa card */}
            <section className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/60 shadow-sm">
              <h4 className="font-bold text-on-surface mb-4">Sobre la empresa</h4>
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-200">
                  <Building2 size={22} className="text-[#1e3a5f]" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-on-surface">{proyecto.mypeNombre || 'MYPE'}</p>
                  <p className="text-xs text-slate-400 font-bold">Cajamarca, Perú</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/proyectos')}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 transition-colors"
              >
                Explorar otros proyectos de la empresa
                <ChevronLeft size={14} className="rotate-180" />
              </button>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetalleProyectoPage;
