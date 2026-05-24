import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase, ArrowRight, Sparkles, Building2, Calendar,
  Clock, CheckCircle2, AlertCircle, FolderOpen
} from 'lucide-react';
import { useMisPostulaciones } from '@/features/postulaciones-list/useMisPostulaciones';

export function WorkspaceSelectorPage() {
  const navigate = useNavigate();
  const { data: postulaciones = [], isLoading } = useMisPostulaciones();

  // Filtrar solo proyectos CONFIRMADOS (tienen workspace activo)
  // Incluimos variaciones de mayúsculas/minúsculas por consistencia
  const proyectosConfirmados = postulaciones.filter(
    (p) => p.estado === 'CONFIRMADO' || p.estado === 'Confirmado'
  );

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="font-semibold text-slate-500">Cargando workspaces...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
          Mis Workspaces
        </h1>
        <p className="text-base text-slate-500 font-semibold">
          Proyectos confirmados donde puedes subir entregables
        </p>
      </div>

      {proyectosConfirmados.length === 0 ? (
        <div className="text-center py-16">
          <FolderOpen size={64} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-extrabold text-slate-800 mb-2">
            No tienes workspaces activos
          </h3>
          <p className="text-slate-500 mb-6">
            Acepta una postulación para acceder al workspace
          </p>
          <Link
            to="/mis-postulaciones"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:shadow-lg transition-all"
          >
            <Briefcase size={18} />
            Ver Mis Postulaciones
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectosConfirmados.map((postulacion, index) => (
            <motion.div
              key={postulacion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/workspace/${postulacion.proyectoId}`)}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg">
                  {postulacion.proyectoTitulo?.charAt(0)?.toUpperCase() || 'P'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-slate-900 truncate group-hover:text-primary transition-colors">
                    {postulacion.proyectoTitulo}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <Building2 size={12} />
                    MYPE Asociada
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black flex items-center gap-1">
                  <CheckCircle2 size={10} />
                  CONFIRMADO
                </span>
                <span className="text-primary font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Abrir Workspace
                  <ArrowRight size={14} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkspaceSelectorPage;