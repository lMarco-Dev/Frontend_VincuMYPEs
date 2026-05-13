import React from 'react';
import {
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Building2,
  Calendar,
  Loader2
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

  return (
    <div className="p-6 lg:p-12 lg:pt-0">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-slate-900 tracking-tight mb-2"
          >
            Mis Postulaciones
          </motion.h1>
          <p className="text-slate-500">Sigue el estado de los proyectos a los que has aplicado.</p>
        </header>

        {/* LISTA DE POSTULACIONES */}
        <div className="space-y-6">
          {postulaciones.length > 0 ? (
            postulaciones.map((postulacion, index) => {
              const status = getStatusStyle(postulacion.estado);
              const key = postulacion.id || `postulacion-${index}`;
              const fecha = postulacion.fechaPostulacion ? new Date(postulacion.fechaPostulacion).toLocaleDateString() : "Fecha no disponible";

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-[2rem] p-6 lg:p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex-1 space-y-3">
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
                      <h2 className="text-xl font-bold text-slate-900 mb-1">{postulacion.proyectoTitulo || "Proyecto sin título"}</h2>
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
                      className="inline-flex items-center gap-2 px-5 py-3 bg-slate-50 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors group"
                    >
                      Ver Proyecto
                      <ArrowUpRight size={16} className="text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>

                    {postulacion.estado === 'ACEPTADO' && (
                      <button className="px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
                        Iniciar Trabajo
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-4">
                <Briefcase size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">No has postulado a ningún proyecto</h3>
              <p className="text-slate-500 mb-6">¡Explora las oportunidades disponibles y postula!</p>
              <Link
                to="/proyectos"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
              >
                Explorar Proyectos
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MisPostulacionesPage;
