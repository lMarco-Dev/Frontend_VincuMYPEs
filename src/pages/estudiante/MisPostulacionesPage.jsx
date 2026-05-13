import React from 'react';
import {
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Building2,
  Calendar,
  Loader2,
  Lightbulb,
  TrendingUp,
  Star,
  FileEdit,
  History,
  ClipboardList,
  Headphones,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMisPostulaciones } from '@features/postulaciones-list/useMisPostulaciones';

const MisPostulacionesPage = () => {
  const { data: postulaciones = [], isLoading, isError, error } = useMisPostulaciones();

  const getStatusStyle = (estado) => {
    switch (estado) {
      case 'ACEPTADO':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-600',
          icon: <CheckCircle2 size={16} />,
          label: 'Aceptado'
        };
      case 'RECHAZADO':
        return {
          bg: 'bg-red-50',
          text: 'text-red-600',
          icon: <XCircle size={16} />,
          label: 'No seleccionado'
        };
      default:
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-600',
          icon: <Clock size={16} />,
          label: 'En revisión'
        };
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-12 lg:pt-0 flex items-center justify-center min-h-[400px]">
        <div className="text-slate-500 flex items-center gap-2">
          <Loader2 className="animate-spin" size={24} />
          Cargando postulaciones...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 lg:p-12 lg:pt-0 flex items-center justify-center min-h-[400px]">
        <div className="text-red-500 bg-red-50 p-4 rounded-xl border border-red-100 max-w-md text-center">
          <p className="font-bold mb-1">Error al cargar las postulaciones</p>
          <p className="text-sm">{error.response?.data?.message || error.message || "Error desconocido"}</p>
        </div>
      </div>
    );
  }

  const hasPostulaciones = postulaciones.length > 0;

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-on-surface mb-2">Mis Postulaciones</h1>
        <p className="text-lg text-on-surface-variant">Gestiona y revisa el estado de tus aplicaciones a proyectos MYPE.</p>
      </div>

      {/* Dashboard Grid Layout */}
      <div className="flex flex-col gap-6">
        
        {!hasPostulaciones ? (
          /* Empty State Card */
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 lg:p-12 flex flex-col items-center text-center shadow-sm">
            <div className="w-64 h-64 mb-6 relative">
              <img 
                className="w-full h-full object-contain rounded-2xl opacity-90" 
                alt="Ilustración de maletín"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDl3IGGqyHJzG14MqWo_K91LoQpk8F__FKCRB9Xqo1EXlqy_vXHveONxKMWzYJm--mqUw5kTCmlRLiOcATlibGzpWp8QFjZcoa1a7dnh5wqw97noT_sQu-9xJM3rytdW3mIPQjZbX65VJl7gl8Cfao_SWjLuAHPll69yKZueQ_zIZ797ugGBbyTjw565ptiATYD9cQkdxTiSHzBOtkwtNVnYqC6teC_IrRuAJvYaHdi9k74e0-4wjwBJtPlZl7OSLadU99v-KX7uCk" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent pointer-events-none"></div>
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-2">No has postulado a ningún proyecto</h3>
            <p className="text-sm text-on-surface-variant max-w-md mb-8">
              Tu lista está vacía. Comienza tu camino profesional postulando a proyectos reales que necesitan tu talento académico.
            </p>
            <Link to="/proyectos">
              <button className="bg-primary text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2">
                <ClipboardList size={18} />
                Explorar Proyectos
              </button>
            </Link>
          </div>
        ) : (
          /* List of Postulations */
          <div className="space-y-4">
            {postulaciones.map((postulacion, index) => {
              const status = getStatusStyle(postulacion.estado);
              const fecha = postulacion.fechaPostulacion ? new Date(postulacion.fechaPostulacion).toLocaleDateString() : "Fecha no disponible";

              return (
                <motion.div
                  key={postulacion.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-6 border border-outline-variant/30 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${status.bg} ${status.text}`}>
                        {status.icon}
                        {status.label}
                      </span>
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <Calendar size={14} />
                        {fecha}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-900 mb-1">{postulacion.proyectoTitulo || "Proyecto sin título"}</h2>
                      <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Building2 size={16} className="text-slate-400" />
                          MYPE (ID: {postulacion.proyectoId})
                        </span>
                      </div>
                      {postulacion.mensajePostulacion && (
                        <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <span className="font-semibold text-slate-700">Tu mensaje:</span> "{postulacion.mensajePostulacion}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to={`/proyectos/${postulacion.proyectoId}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors group"
                    >
                      Ver Proyecto
                      <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </Link>

                    {postulacion.estado === 'ACEPTADO' && (
                      <button className="px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-indigo-100">
                        Iniciar Trabajo
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Recommended Quick Look */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-secondary-container p-6 rounded-2xl flex flex-col justify-between h-40">
            <Lightbulb className="text-on-secondary-container" size={32} />
            <div>
              <p className="font-bold text-on-secondary-container text-sm">¿Sabías que...?</p>
              <p className="text-xs text-on-secondary-container opacity-80">Los estudiantes con perfiles completos tienen 3x más probabilidades de ser aceptados.</p>
            </div>
          </div>
          <div className="bg-tertiary-container p-6 rounded-2xl flex flex-col justify-between h-40">
            <TrendingUp className="text-on-tertiary-container" size={32} />
            <div>
              <p className="font-bold text-on-tertiary-container text-sm">Tendencia</p>
              <p className="text-xs text-on-tertiary-container opacity-80">Proyectos de Marketing Digital son los más buscados esta semana.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisPostulacionesPage;
