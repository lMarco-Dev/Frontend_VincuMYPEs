import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  SlidersHorizontal,
  Calendar,
  ArrowRight,
  Filter,
  X,
  Terminal,
  Building2,
  TrendingUp,
  Palette,
  BarChart2,
  ShoppingBag,
  Megaphone,
  ChevronDown,
  Lightbulb,
  Loader2,
  CheckCircle,
  Clock,
  Sparkles,
  MapPin,
  Users,
  Target,
  Package,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProyectos } from '@features/proyectos-list/useProyectos';
import { useMisPostulaciones } from '@features/postulaciones-list/useMisPostulaciones';
import { usePerfil } from '@features/perfil/usePerfil';
import PostularButton from '../../features/proyecto-postular/PostularButton';

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

const getAreaIcon = (area) => {
  switch (area) {
    case 'DESARROLLO_WEB':
      return <Terminal size={20} className="text-blue-600" />;
    case 'DESARROLLO_MOVIL':
      return <ShoppingBag size={20} className="text-emerald-600" />;
    case 'DESARROLLO_SOFTWARE':
      return <Terminal size={20} className="text-violet-600" />;
    case 'BASE_DE_DATOS':
      return <BarChart2 size={20} className="text-amber-600" />;
    case 'ANALISIS_DATOS':
      return <TrendingUp size={20} className="text-pink-600" />;
    case 'SOPORTE_TI':
      return <Terminal size={20} className="text-slate-600" />;
    default:
      return <Briefcase size={20} className="text-indigo-600" />;
  }
};

const AREAS = [
  { value: '', label: 'Todos los Proyectos' },
  { value: 'DESARROLLO_WEB', label: 'Desarrollo Web' },
  { value: 'DESARROLLO_MOVIL', label: 'Desarrollo Móvil' },
  { value: 'DESARROLLO_SOFTWARE', label: 'Software' },
  { value: 'BASE_DE_DATOS', label: 'Base de Datos' },
  { value: 'ANALISIS_DATOS', label: 'Datos' },
  { value: 'SOPORTE_TI', label: 'Soporte TI' }
];

const ProyectosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState(null);

  const { data: userProfile } = usePerfil();
  const { data, isLoading, isError } = useProyectos();
  const { data: postulaciones } = useMisPostulaciones();

  const proyectos = data?.content || [];

  // Mapear postulaciones previas para evitar postular de nuevo
  const yaPostuloMap = React.useMemo(() => {
    const map = {};
    postulaciones?.forEach(p => {
      map[p.proyectoId] = true;
    });
    return map;
  }, [postulaciones]);

  // Filtrado combinado: Búsqueda + Área
  const filteredProyectos = proyectos.filter(proyecto => {
    const matchesSearch =
      proyecto.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proyecto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proyecto.mypeNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proyecto.areaSistemas?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesArea = selectedArea ? proyecto.areaSistemas === selectedArea : true;

    return matchesSearch && matchesArea;
  });

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">

      {/* Dynamic Mesh Search Banner */}
      <section className="mb-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-tr from-[#1a2d42] via-[#1e3a5f] to-[#4648d4] p-8 lg:p-12 text-white shadow-xl min-h-[220px] flex flex-col justify-center">
          {/* Abstract Fluid Mesh Orbs */}
          <div className="absolute top-[-40%] right-[-10%] w-96 h-96 bg-[#4648d4]/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-72 h-72 bg-[#1e3a5f]/40 rounded-full blur-2xl"></div>

          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight leading-tight">
              Descubre tu próximo reto profesional
            </h1>
            <p className="text-base lg:text-lg opacity-90 mb-8 font-medium">
              Conecta con MYPEs que necesitan tu talento académico para impulsar su transformación digital.
            </p>
            <div className="relative group max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={22} />
              <input
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-4 focus:ring-primary/20 shadow-md focus:shadow-xl transition-all text-base text-slate-800 font-medium"
                placeholder="Buscar por tecnología, empresa o rol..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Row */}
      <section className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {AREAS.map(area => (
              <button
                key={area.value}
                onClick={() => setSelectedArea(area.value)}
                className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${selectedArea === area.value
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest border border-outline-variant/20'
                  }`}
              >
                {area.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors font-bold text-sm"
          >
            <SlidersHorizontal size={18} />
            Filtros Avanzados
          </button>
        </div>
      </section>

      {/* Projects Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && (
          <div className="col-span-full text-center text-slate-500 py-12 flex flex-col items-center gap-2">
            <Loader2 className="animate-spin text-primary" size={28} />
            <span className="font-semibold text-sm">Cargando proyectos disponibles...</span>
          </div>
        )}

        {isError && (
          <div className="col-span-full text-center text-red-500 py-12">
            Error al cargar proyectos. Inténtalo de nuevo más tarde.
          </div>
        )}

        {!isLoading && !isError && filteredProyectos.length === 0 && (
          <div className="col-span-full text-center text-slate-500 py-16 bg-white rounded-3xl border border-dashed border-outline-variant/60">
            <Search size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-bold text-slate-800 mb-1">No se encontraron proyectos</p>
            <p className="text-sm text-slate-400">Intenta con otros términos de búsqueda o filtros.</p>
          </div>
        )}

        {!isLoading && !isError && filteredProyectos.map((proyecto, index) => (
          <motion.div
            key={proyecto.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedProyecto(proyecto)}
            className="bg-surface-container-lowest rounded-3xl border border-outline-variant/50 p-6 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 group cursor-pointer flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getAreaStyle(proyecto.areaSistemas)}`}>
                {getAreaIcon(proyecto.areaSistemas)}
              </div>
              {yaPostuloMap[proyecto.id] ? (
                <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-600 font-bold text-[9px] uppercase tracking-wider border border-emerald-100 flex items-center gap-1">
                  <CheckCircle size={10} /> Postulado
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-bold text-[9px] uppercase tracking-wider border border-blue-100">
                  Activo
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors mb-2 leading-tight">
              {proyecto.titulo}
            </h3>

            <p className="text-slate-400 text-xs mb-4 flex items-center gap-1.5 font-semibold">
              <Building2 size={14} className="text-slate-400" />
              {proyecto.mypeNombre || 'MYPE'}
            </p>

            <p className="text-slate-500 text-sm mb-6 line-clamp-3 font-medium">
              {proyecto.descripcion}
            </p>

            <div className="mt-auto space-y-4">
              <div className="flex flex-wrap gap-1.5">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getAreaStyle(proyecto.areaSistemas)}`}>
                  {proyecto.areaSistemas?.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
                <div className="flex flex-col">
                  <span className="text-slate-400 font-bold text-[9px] uppercase">Límite</span>
                  <span className="text-error text-sm font-bold flex items-center gap-1">
                    <Calendar size={14} />
                    {proyecto.fechaLimite}
                  </span>
                </div>

                <span className="w-10 h-10 bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all group-hover:translate-x-1">
                  <ArrowRight size={18} />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Vercel-style Interactive "All-in-One" Slide-over Drawer Panel */}
      <AnimatePresence>
        {selectedProyecto && (
          <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
              onClick={() => setSelectedProyecto(null)}
            />

            {/* Drawer Panel Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl bg-white shadow-2xl h-full flex flex-col z-10"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getAreaStyle(selectedProyecto.areaSistemas)}`}>
                  {selectedProyecto.areaSistemas?.replace('_', ' ')}
                </span>
                <button
                  onClick={() => setSelectedProyecto(null)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Body - 100% of the Details integrated */}
              <div className="p-6 overflow-y-auto grow space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">{selectedProyecto.titulo}</h2>
                  <p className="text-sm text-slate-500 mt-2 flex items-center gap-1.5 font-semibold">
                    <Building2 size={16} />
                    {selectedProyecto.mypeNombre || 'MYPE'}
                  </p>
                </div>

                {/* Unified Horizontal Metadata Bar - Usando flex-wrap para evitar que las fechas traducidas se amontonen */}
                <div className="flex flex-wrap gap-x-6 gap-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-500 font-semibold shrink-0">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Ubicación</span>
                    <span className="text-[#1e3a5f] flex items-center gap-1 text-[11px] whitespace-nowrap">
                      <MapPin size={12} className="text-slate-400" />
                      Remoto
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Vacantes</span>
                    <span className="text-[#1e3a5f] flex items-center gap-1 text-[11px] whitespace-nowrap">
                      <Users size={12} className="text-slate-400" />
                      {selectedProyecto.cupos} Libres
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Inicio</span>
                    <span className="text-[#1e3a5f] flex items-center gap-1 text-[11px] whitespace-nowrap">
                      <Calendar size={12} className="text-slate-400" />
                      {selectedProyecto.fechaInicio || 'Por definir'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Límite</span>
                    <span className="text-error flex items-center gap-1 text-[11px] whitespace-nowrap">
                      <Calendar size={12} className="text-error" />
                      {selectedProyecto.fechaLimite}
                    </span>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Descripción del Proyecto</h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                    {selectedProyecto.descripcion}
                  </p>
                </div>

                {/* Objetivo */}
                {selectedProyecto.objetivo && (
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                      <Target size={14} className="text-blue-600 animate-pulse" />
                      Objetivo del Proyecto
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                      {selectedProyecto.objetivo}
                    </p>
                  </div>
                )}

                {/* Dynamically checking student's profile compatibility */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="text-primary" size={14} />
                    Compatibilidad con tu Perfil
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Validando las habilidades del proyecto con tu perfil académico:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProyecto.requisitos ? (
                      selectedProyecto.requisitos.split(',').map((req, idx) => {
                        const reqClean = req.trim().toLowerCase();
                        // Obtener habilidades frescas del perfil y buscar coincidencias inteligentes
                        const studentSkillsList = userProfile?.skills?.toLowerCase().split(',').map(s => s.trim()).filter(Boolean) || [];
                        const matches = studentSkillsList.some(uSkill => uSkill.includes(reqClean) || reqClean.includes(uSkill));
                        return (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${matches
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-primary/20'
                              }`}
                          >
                            {matches ? <CheckCircle size={12} className="text-emerald-600" /> : <Lightbulb size={12} className="text-slate-400" />}
                            {req.trim()}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-xs text-slate-400 italic">No se especifican requisitos para este proyecto.</span>
                    )}
                  </div>
                </div>

                {/* Checklist of Suggested Deliverables */}
                {selectedProyecto.entregablesSugeridos && (
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                      <Package size={14} className="text-orange-500" />
                      Entregables Sugeridos
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedProyecto.entregablesSugeridos.split(',').map((entregable, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 group cursor-default hover:border-primary/20 transition-all"
                        >
                          <div className="w-5 h-5 rounded bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={12} />
                          </div>
                          <span className="text-xs text-slate-700 font-bold truncate">{entregable.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer Actions - Unified Single prominent PostularButton */}
              <div className="p-6 border-t border-slate-100 flex flex-col gap-3 bg-slate-50 shrink-0">
                <div className="w-full flex justify-center">
                  <PostularButton
                    proyectoId={selectedProyecto.id}
                    yaPostulo={yaPostuloMap[selectedProyecto.id]}
                  />
                </div>
                <button
                  onClick={() => setSelectedProyecto(null)}
                  className="text-xs text-slate-400 font-bold hover:text-slate-600 hover:underline transition-colors text-center w-full mt-1"
                >
                  Seguir explorando otros proyectos
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom banner Contextual Info */}
      <div className="mt-12">
        <div className="bg-surface-container-high rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row items-center gap-6 border border-outline-variant/30">
          <div className="w-16 h-16 shrink-0 bg-primary-container/20 rounded-full flex items-center justify-center">
            <Lightbulb className="text-primary text-[32px]" size={32} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-on-surface mb-1">¿No encuentras lo que buscas?</h4>
            <p className="text-sm text-on-surface-variant font-medium">
              Puedes configurar alertas personalizadas para que te avisemos cuando se publique un proyecto que coincida con tus habilidades e intereses académicos.
            </p>
          </div>
          <button className="md:ml-auto whitespace-nowrap bg-on-background text-white px-6 h-12 rounded-xl font-bold hover:opacity-90 transition-opacity text-sm">
            Configurar Alertas
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProyectosPage;
