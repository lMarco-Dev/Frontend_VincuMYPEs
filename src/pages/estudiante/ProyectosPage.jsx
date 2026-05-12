import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  SlidersHorizontal,
  Calendar,
  ArrowRight,
  Filter,
  X
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

const AREAS = [
  { value: '', label: 'Todas las áreas' },
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
    <div className="p-6 lg:p-12 lg:pt-0">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-slate-900 tracking-tight mb-2"
          >
            Explorar Proyectos
          </motion.h1>
          <p className="text-slate-500">Encuentra el desafío perfecto para potenciar tu carrera.</p>
        </header>

        {/* BARRA DE BÚSQUEDA Y FILTROS */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 relative">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por título, tecnología o empresa..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all border h-full ${isFilterOpen ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 bg-white'}`}
            >
              <SlidersHorizontal size={20} className={isFilterOpen ? 'text-indigo-600' : 'text-slate-500'} />
              Filtros
              {selectedArea && (
                <span className="ml-1 px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full">
                  1
                </span>
              )}
            </button>

            {/* Dropdown de Filtros */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 p-4"
                >
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Área de Sistemas</h3>
                  <div className="space-y-2">
                    {AREAS.map(area => (
                      <button
                        key={area.value}
                        onClick={() => {
                          setSelectedArea(area.value);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                          selectedArea === area.value 
                            ? 'bg-indigo-50 text-indigo-600 font-bold' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {area.label}
                        {selectedArea === area.value && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Botón para limpiar todo */}
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedArea('');
            }}
            className="flex items-center gap-2 px-6 py-3.5 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all"
          >
            <X size={20} className="text-slate-500" />
            Limpiar
          </button>
        </div>

        {/* Chips de Filtros Activos */}
        {selectedArea && (
          <div className="flex gap-2 mb-6">
            <span className="px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-bold rounded-full flex items-center gap-2">
              Área: {AREAS.find(a => a.value === selectedArea)?.label}
              <button onClick={() => setSelectedArea('')} className="hover:text-indigo-800">
                <X size={16} />
              </button>
            </span>
          </div>
        )}

        {/* LISTADO DE PROYECTOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && <div className="col-span-3 text-center text-slate-500 py-12">Cargando proyectos...</div>}
          {isError && <div className="col-span-3 text-center text-red-500 py-12">Error al cargar proyectos.</div>}
          {!isLoading && !isError && filteredProyectos.length === 0 && (
            <div className="col-span-3 text-center text-slate-500 py-12">
              No se encontraron proyectos con los criterios de búsqueda.
            </div>
          )}
          {!isLoading && !isError && filteredProyectos.map((proyecto, index) => (
            <motion.div
              key={proyecto.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-widest ${getAreaStyle(proyecto.areaSistemas)}`}>
                    {proyecto.areaSistemas}
                  </span>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Calendar size={14} />
                    Lim: {proyecto.fechaLimite}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
                  {proyecto.titulo}
                </h2>

                <p className="text-slate-500 text-sm mb-6 line-clamp-3 font-medium">
                  {proyecto.descripcion}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Empresa</p>
                  <p className="text-sm font-bold text-slate-700 flex items-center gap-1">
                    <Briefcase size={14} className="text-slate-400" />
                    {proyecto.mypeNombre}
                  </p>
                </div>

                <Link
                  to={`/proyectos/${proyecto.id}`}
                  className="w-10 h-10 bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all group"
                >
                  <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProyectosPage;
