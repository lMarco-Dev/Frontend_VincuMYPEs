import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, X, User, Search, Briefcase } from 'lucide-react';
import { format } from 'date-fns';
import { usePostulacionesAdmin } from '@features/admin/usePostulacionesAdmin';
import { useCambiarEstadoPostulacion } from '@features/admin/useCambiarEstadoPostulacion';
import { AREA_SISTEMAS_LABELS } from '@entities/proyecto/proyecto.constants';

const ESTADOS = [
  'PENDIENTE',
  'PRESELECCIONADO',
  'VALIDADO_MYPE',
  'CONFIRMADO',
  'RECHAZADO',
  'EXPIRADO',
  'RETIRADO',
];

const ESTADO_BADGE = {
  PENDIENTE: 'bg-amber-50 text-amber-700 border-amber-200',
  PRESELECCIONADO: 'bg-blue-50 text-blue-700 border-blue-200',
  VALIDADO_MYPE: 'bg-purple-50 text-purple-700 border-purple-200',
  CONFIRMADO: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  RECHAZADO: 'bg-red-50 text-red-600 border-red-200',
  RETIRADO: 'bg-gray-100 text-gray-500 border-gray-200',
  EXPIRADO: 'bg-orange-50 text-orange-600 border-orange-200',
};

// 1. Filtros reducidos solo a lo esencial
const DEFAULT_FILTERS = {
  estado: '',
  estudiante: '',
  mype: '',
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const Skel = ({ className }) => <div className={`bg-slate-100 rounded animate-pulse ${className}`} />;

function ConfirmModal({ estado, onConfirm, onCancel, isLoading }) {
  const isPreselect = estado === 'PRESELECCIONADO';
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl p-5 max-w-sm w-full"
      >
        <h3 className="text-base font-semibold text-slate-900 mb-2">
          {isPreselect ? 'Preseleccionar postulación' : 'Rechazar postulación'}
        </h3>
        <p className="text-sm text-slate-500 mb-5">
          {isPreselect
            ? '¿Estás seguro de que quieres preseleccionar esta postulación?'
            : '¿Estás seguro de que quieres rechazar esta postulación? Esta acción notificará al estudiante.'}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${
              isPreselect ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isLoading ? 'Procesando...' : isPreselect ? 'Confirmar' : 'Rechazar'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminPostulacionesPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState('fechaPostulacion,desc');
  const [confirm, setConfirm] = useState(null);

  // Asegura que al cambiar filtros o sort se reinicie la paginación
  useEffect(() => {
    setPage(0);
  }, [filters, sort]);

  const queryParams = {
    ...(filters.estado && { estados: [filters.estado] }),
    ...(filters.estudiante && { estudiante: filters.estudiante }),
    ...(filters.mype && { mype: filters.mype }),
    page,
    size: 10,
    sort, // Ahora sí está incluido
  };

  const { data, isLoading, isFetching } = usePostulacionesAdmin(queryParams);
  const { mutate: cambiarEstado, isPending } = useCambiarEstadoPostulacion();

  const postulaciones = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSort('fechaPostulacion,desc');
    setPage(0);
  }, []);

  const handleAction = (postulacionId, proyectoId, estado) => {
    setConfirm({ postulacionId, proyectoId, estado });
  };

  const handleConfirm = () => {
    if (!confirm) return;
    cambiarEstado(
      {
        proyectoId: confirm.proyectoId,
        postulacionId: confirm.postulacionId,
        estado: confirm.estado,
      },
      {
        onSuccess: () => setConfirm(null),
        onError: () => setConfirm(null),
      },
    );
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-[1440px] mx-auto"
    >
      {/* Encabezado */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-slate-900">Postulaciones</h1>
        <p className="text-sm text-slate-500 mt-1">
          {isLoading
            ? 'Cargando...'
            : `${totalElements} postulación${totalElements !== 1 ? 'es' : ''} encontrada${totalElements !== 1 ? 's' : ''}`}
        </p>
      </motion.div>

      {/* Panel de filtros simplificado */}
      <motion.div
        variants={fadeUp}
        className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Buscar Estudiante */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Buscar Estudiante</label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Nombre del estudiante..."
                value={filters.estudiante}
                onChange={(e) => updateFilter('estudiante', e.target.value)}
                className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
          </div>

          {/* Buscar MYPE */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Buscar MYPE</label>
            <div className="relative">
              <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Nombre de la empresa..."
                value={filters.mype}
                onChange={(e) => updateFilter('mype', e.target.value)}
                className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
          </div>

          {/* Estado (Select Único) */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Filtrar por Estado</label>
            <select
              value={filters.estado}
              onChange={(e) => updateFilter('estado', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
            >
              <option value="">Todos los estados</option>
              {ESTADOS.map((estado) => (
                <option key={estado} value={estado}>
                  {estado.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenar */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Ordenar por</label>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(0);
              }}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
            >
              <option value="fechaPostulacion,desc">Fecha (más reciente)</option>
              <option value="fechaPostulacion,asc">Fecha (más antigua)</option>
              <option value="sinPreseleccionados">Sin preseleccionados primero</option>
            </select>
          </div>

        </div>

        {/* Botón de limpiar filtros (solo aparece si hay algo filtrado) */}
        {(filters.estado || filters.estudiante || filters.mype) && (
          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              onClick={clearFilters}
              className="text-xs text-slate-500 hover:text-red-600 font-semibold transition-colors flex items-center gap-1"
            >
              <X size={12} /> Limpiar filtros
            </button>
          </div>
        )}
      </motion.div>

      {/* Tabla */}
      <motion.div
        variants={fadeUp}
        className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Estudiante
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Proyecto
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  MYPE
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Fecha
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Estado
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <Skel className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : postulaciones.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400 text-sm">
                    No se encontraron postulaciones con los filtros actuales.
                  </td>
                </tr>
              ) : (
                postulaciones.map((p) => (
                  <tr
                    key={p.id}
                    className={`hover:bg-slate-50 transition-colors ${isFetching ? 'opacity-60' : ''}`}
                  >
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-900">{p.estudianteNombre}</p>
                      <p className="text-xs text-slate-400">{p.estudianteEmail}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-900 max-w-[180px] truncate">
                        {p.proyectoTitulo}
                      </p>
                      <p className="text-xs text-slate-400">
                        {AREA_SISTEMAS_LABELS[p.proyectoArea] ?? p.proyectoArea}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{p.mypeNombre}</td>
                    <td className="px-4 py-4 text-slate-500 text-xs whitespace-nowrap">
                      {p.fechaPostulacion
                        ? format(new Date(p.fechaPostulacion), 'dd/MM/yyyy')
                        : '—'}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${
                          ESTADO_BADGE[p.estado] ?? 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}
                      >
                        {p.estado.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {p.estado === 'PENDIENTE' && (
                          <>
                            <button
                              onClick={() => handleAction(p.id, p.proyectoId, 'PRESELECCIONADO')}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Check size={12} />
                              Preseleccionar
                            </button>
                            <button
                              onClick={() => handleAction(p.id, p.proyectoId, 'RECHAZADO')}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-white text-red-600 border border-red-200 text-xs font-medium rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                            >
                              <X size={12} />
                              Rechazar
                            </button>
                          </>
                        )}
                        <a
                          href={`/estudiante/${p.estudianteId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                          title="Ver perfil"
                        >
                          <User size={14} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Página {page + 1} de {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = i;
                } else if (page < 4) {
                  pageNum = i;
                } else if (page > totalPages - 5) {
                  pageNum = totalPages - 7 + i;
                } else {
                  pageNum = page - 3 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 text-xs rounded-lg transition-colors ${
                      pageNum === page
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Modal de confirmación */}
      {confirm && (
        <ConfirmModal
          estado={confirm.estado}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
          isLoading={isPending}
        />
      )}
    </motion.div>
  );
}