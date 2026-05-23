import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMisPostulaciones } from '../../features/postulaciones-list/useMisPostulaciones';
import { 
  FolderOpen, 
  ArrowRight, 
  Building2, 
  ClipboardList 
} from 'lucide-react';
import { motion } from 'framer-motion';

export function WorkspaceSelectorPage() {
  const navigate = useNavigate();
  const { data: postulaciones = [], isLoading } = useMisPostulaciones();

  // Filtrar postulaciones reales en estado ACEPTADO o CONFIRMADO
  const proyectosAceptados = postulaciones.filter(
    (p) => p.estado === 'CONFIRMADO' || p.estado === 'ACEPTADO' || p.estado === 'Aceptado'
  );

  // Redirección inteligente automática si el estudiante tiene exactamente 1 proyecto activo
  useEffect(() => {
    if (!isLoading && proyectosAceptados.length === 1) {
      navigate(`/workspace/${proyectosAceptados[0].proyectoId}`, { replace: true });
    }
  }, [isLoading, proyectosAceptados, navigate]);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3 min-h-[400px]">
        <svg className="animate-spin h-7 w-7 text-primary" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="font-extrabold text-xs text-slate-400 uppercase tracking-widest">Cargando tus espacios de trabajo...</span>
      </div>
    );
  }

  // Si tiene exactamente 1 proyecto, mostramos un spinner breve mientras se completa el auto-routing
  if (proyectosAceptados.length === 1) {
    return (
      <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2 min-h-[400px]">
        <svg className="animate-spin h-6 w-6 text-primary" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-sm font-semibold text-slate-500">Redirigiendo a tu espacio de trabajo activo...</span>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Mis Espacios de Trabajo</h1>
        <p className="text-base text-slate-500 font-semibold">Selecciona el proyecto activo en el que deseas trabajar y subir entregables hoy.</p>
      </div>

      {proyectosAceptados.length === 0 ? (
        /* Empty State */
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-100 rounded-[2.5rem] p-10 lg:p-16 flex flex-col items-center text-center shadow-sm relative overflow-hidden"
        >
          {/* Decorative faint background glowing elements */}
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#1e3a5f] to-[#4648d4] text-white flex items-center justify-center shadow-lg shadow-indigo-100 mb-8 animate-bounce shrink-0" style={{ animationDuration: '3s' }}>
              <FolderOpen size={36} />
            </div>
            
            <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">No tienes workspaces activos</h3>
            <p className="text-sm text-slate-500 font-semibold max-w-md mb-8 leading-relaxed">
              Para poder subir entregables y ver tus casilleros de avance técnico, primero debes postular a proyectos y ser aceptado por una MYPE socia.
            </p>
            
            <Link to="/proyectos">
              <button className="bg-gradient-to-r from-primary to-[#4648d4] text-white font-bold px-8 py-3.5 rounded-2xl shadow-xl shadow-primary/20 hover:opacity-95 hover:shadow-2xl transition-all active:scale-95 flex items-center gap-2 text-sm">
                <ClipboardList size={18} />
                Explorar Proyectos Disponibles
              </button>
            </Link>
          </div>
        </motion.div>
      ) : (
        /* Workspaces Grid for multiple active projects */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectosAceptados.map((item, index) => {
            const firstLetter = item.proyectoTitulo ? item.proyectoTitulo.charAt(0).toUpperCase() : 'P';
            return (
              <motion.div
                key={item.proyectoId || index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[220px] relative overflow-hidden group"
              >
                {/* Decorative water-marked icon */}
                <div className="absolute right-[-10%] bottom-[-5%] text-slate-50 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                  <FolderOpen size={160} />
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-primary bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      En Ejecución
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-400">
                      ID #{item.proyectoId}
                    </span>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#1e3a5f] to-[#4648d4] text-white flex items-center justify-center font-black text-base shrink-0 shadow-sm border border-white/10">
                      {firstLetter}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {item.proyectoTitulo || 'Proyecto Activo'}
                      </h3>
                      <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-500 font-semibold">
                        <Building2 size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">Proyecto VincuMYPEs</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 relative z-10 flex justify-end">
                  <Link 
                    to={`/workspace/${item.proyectoId}`}
                    className="w-full py-3 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-xl font-bold text-xs hover:opacity-95 hover:shadow-md transition-all flex items-center justify-center gap-1.5 group"
                  >
                    Ingresar al Workspace
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default WorkspaceSelectorPage;
