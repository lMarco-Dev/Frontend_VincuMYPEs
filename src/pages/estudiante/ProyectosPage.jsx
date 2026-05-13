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
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProyectos } from '@features/proyectos-list/useProyectos';

const getAreaStyle = (area) => {
  switch (area) {
    case 'DESARROLLO_WEB':
      return 'bg-blue-50 text-blue-600';
    case 'DESARROLLO_MOVIL':
      return 'bg-emerald-50 text-emerald-600';
    case 'DESARROLLO_SOFTWARE':
      return 'bg-violet-50 text-violet-600';
    case 'BASE_DE_DATOS':
      return 'bg-amber-50 text-amber-600';
    case 'ANALISIS_DATOS':
      return 'bg-pink-50 text-pink-600';
    case 'SOPORTE_TI':
      return 'bg-slate-100 text-slate-600';
    default:
      return 'bg-indigo-50 text-indigo-600';
  }
};

const getAreaIcon = (area) => {
  switch (area) {
    case 'DESARROLLO_WEB':
      return <Terminal size={20} className="text-primary" />;
    case 'DESARROLLO_MOVIL':
      return <ShoppingBag size={20} className="text-primary" />;
    case 'DESARROLLO_SOFTWARE':
      return <Terminal size={20} className="text-primary" />;
    case 'BASE_DE_DATOS':
      return <BarChart2 size={20} className="text-primary" />;
    case 'ANALISIS_DATOS':
      return <TrendingUp size={20} className="text-tertiary" />;
    case 'SOPORTE_TI':
      return <Terminal size={20} className="text-slate-600" />;
    default:
      return <Briefcase size={20} className="text-primary" />;
  }
};

const AREAS = [
  { value: '', label: 'Todos los Proyectos' },
  { value: 'DESARROLLO_WEB', label: 'Desarrollo Web' },
  { value: 'DESARROLLO_MOVIL', label: 'Desarrollo Móvil' },
  { value: 'DESARROLLO_SOFTWARE', label: 'Desarrollo de Software' },
  { value: 'BASE_DE_DATOS', label: 'Base de Datos' },
  { value: 'ANALISIS_DATOS', label: 'Análisis de Datos' },
  { value: 'SOPORTE_TI', label: 'Soporte TI' }
];

const ProyectosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { data, isLoading, isError, error } = useProyectos();

  const proyectos = data?.content || [];

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
      
      {/* Hero Search Section */}
      <section className="mb-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-container p-8 lg:p-12 text-white">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">Descubre tu próximo reto profesional</h1>
            <p className="text-lg opacity-90 mb-8">Conecta con MYPEs que necesitan tu talento académico para impulsar su transformación digital.</p>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={24} />
              <input 
                className="w-full h-14 pl-14 pr-4 rounded-xl bg-white text-on-surface border-none focus:ring-4 focus:ring-primary/20 shadow-lg transition-all text-base" 
                placeholder="Buscar por tecnología, empresa o rol..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {/* Abstract Background Elements */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {AREAS.map(area => (
              <button
                key={area.value}
                onClick={() => setSelectedArea(area.value)}
                className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                  selectedArea === area.value
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
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

      {/* Projects Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && (
          <div className="col-span-full text-center text-slate-500 py-12 flex flex-col items-center gap-2">
            <Loader2 className="animate-spin" size={24} />
            Cargando proyectos...
          </div>
        )}
        
        {isError && (
          <div className="col-span-full text-center text-red-500 py-12">
            Error al cargar proyectos.
          </div>
        )}
        
        {!isLoading && !isError && filteredProyectos.length === 0 && (
          <div className="col-span-full text-center text-slate-500 py-12 bg-white rounded-2xl border border-outline-variant/30">
            <Search size={48} className="mx-auto mb-4 text-slate-400" />
            <p className="text-lg font-bold text-slate-900 mb-1">No se encontraron proyectos</p>
            <p className="text-sm text-slate-500">Intenta con otros términos de búsqueda o filtros.</p>
          </div>
        )}
        
        {!isLoading && !isError && filteredProyectos.map((proyecto, index) => (
          <motion.div
            key={proyecto.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 group cursor-pointer flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getAreaStyle(proyecto.areaSistemas)}`}>
                {getAreaIcon(proyecto.areaSistemas)}
              </div>
              <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-bold text-[10px] uppercase tracking-wider">
                Nuevo
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors mb-2 leading-tight">
              {proyecto.titulo}
            </h3>
            
            <p className="text-on-surface-variant text-sm mb-4 flex items-center gap-1.5">
              <Building2 size={16} className="text-slate-400" />
              {proyecto.mypeNombre || 'MYPE'}
            </p>
            
            <p className="text-slate-500 text-sm mb-6 line-clamp-3 font-medium">
              {proyecto.descripcion}
            </p>
            
            <div className="mt-auto space-y-4">
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-bold text-[11px]">
                  {proyecto.areaSistemas?.replace('_', ' ')}
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
                <div className="flex flex-col">
                  <span className="text-on-surface-variant font-bold text-[10px] uppercase">Límite</span>
                  <span className="text-error text-sm font-bold flex items-center gap-1">
                    <Calendar size={14} />
                    {proyecto.fechaLimite}
                  </span>
                </div>
                
                <Link
                  to={`/proyectos/${proyecto.id}`}
                  className="w-10 h-10 bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all group-hover:translate-x-1"
                >
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Load More / Pagination */}
      {!isLoading && !isError && filteredProyectos.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button className="flex items-center gap-2 px-6 h-12 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-all active:scale-95">
            Ver más proyectos
            <ChevronDown size={18} />
          </button>
        </div>
      )}

      {/* Contextual Info Banner */}
      <div className="mt-12">
        <div className="bg-surface-container-high rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 shrink-0 bg-primary-container rounded-full flex items-center justify-center">
            <Lightbulb className="text-primary text-[32px]" size={32} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-on-surface mb-1">¿No encuentras lo que buscas?</h4>
            <p className="text-sm text-on-surface-variant">
              Puedes configurar alertas personalizadas para que te avisemos cuando se publique un proyecto que coincida con tus habilidades e intereses académicos.
            </p>
          </div>
          <button className="md:ml-auto whitespace-nowrap bg-on-background text-white px-6 h-12 rounded-xl font-bold hover:opacity-90 transition-opacity">
            Configurar Alertas
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProyectosPage;
