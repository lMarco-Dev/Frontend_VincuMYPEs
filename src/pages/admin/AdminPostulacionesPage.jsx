import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
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

const DEFAULT_FILTERS = {
  estados: [],
  fechaDesde: '',
  fechaHasta: '',
  estudiante: '',
  mype: '',
  area: '',
};

function ConfirmModal({ estado, onConfirm, onCancel, isLoading }) {
  const isPreselect = estado === 'PRESELECCIONADO';
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
        <h3 className="text-base font-semibold text-gray-900 mb-2">
          {isPreselect ? 'Preseleccionar postulación' : 'Rechazar postulación'}
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          {isPreselect
            ? '¿Estás seguro de que quieres preseleccionar esta postulación?'
            : '¿Estás seguro de que quieres rechazar esta postulación? Esta acción notificará al estudiante.'}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
      </div>
    </div>
  );
}

export default function AdminPostulacionesPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState('fechaPostulacion,desc');
  const [confirm, setConfirm] = useState(null); // { postulacionId, proyectoId, estado }

  const queryParams = {
    ...(filters.estados.length > 0 && { estados: filters.estados }),
    ...(filters.fechaDesde && { fechaDesde: filters.fechaDesde }),
    ...(filters.fechaHasta && { fechaHasta: filters.fechaHasta }),
    ...(filters.estudiante && { estudiante: filters.estudiante }),
    ...(filters.mype && { mype: filters.mype }),
    ...(filters.area && { area: filters.area }),
    page,
    size: 10,
    sort,
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
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Postulaciones</h1>
        <p className="text-sm text-gray-500 mt-1">
          {isLoading
            ? 'Cargando...'
            : `${totalElements} postulación${totalElements !== 1 ? 'es' : ''} encontrada${totalElements !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Panel de filtros */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Estudiante</label>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={filters.estudiante}
              onChange={(e) => updateFilter('estudiante', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">MYPE</label>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={filters.mype}
              onChange={(e) => updateFilter('mype', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Área</label>
            <select
              value={filters.area}
              onChange={(e) => updateFilter('area', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
            >
              <option value="">Todas las áreas</option>
              {Object.entries(AREA_SISTEMAS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Fecha desde</label>
            <input
              type="date"
              value={filters.fechaDesde}
              onChange={(e) => updateFilter('fechaDesde', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Fecha hasta</label>
            <input
              type="date"
              value={filters.fechaHasta}
              onChange={(e) => updateFilter('fechaHasta', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Ordenar por</label>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(0);
              }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
            >
              <option value="fechaPostulacion,desc">Fecha postulación (reciente primero)</option>
              <option value="sinPreseleccionados">Proyectos sin preseleccionados primero</option>
            </select>
          </div>
        </div>

        {/* Filtro de estados */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">Estados</label>
          <div className="flex flex-wrap gap-2">
            {ESTADOS.map((estado) => {
              const active = filters.estados.includes(estado);
              return (
                <button
                  key={estado}
                  onClick={() => {
                    const next = active
                      ? filters.estados.filter((e) => e !== estado)
                      : [...filters.estados, estado];
                    updateFilter('estados', next);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    active
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {estado.replace('_', ' ')}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={clearFilters}
            className="text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Estudiante
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Proyecto
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  MYPE
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Fecha
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Estado
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : postulaciones.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No se encontraron postulaciones con los filtros actuales.
                  </td>
                </tr>
              ) : (
                postulaciones.map((p) => (
                  <tr
                    key={p.id}
                    className={`hover:bg-gray-50 transition-colors ${isFetching ? 'opacity-60' : ''}`}
                  >
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">{p.estudianteNombre}</p>
                      <p className="text-xs text-gray-400">{p.estudianteEmail}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900 max-w-[180px] truncate">
                        {p.proyectoTitulo}
                      </p>
                      <p className="text-xs text-gray-400">
                        {AREA_SISTEMAS_LABELS[p.proyectoArea] ?? p.proyectoArea}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{p.mypeNombre}</td>
                    <td className="px-4 py-4 text-gray-500 text-xs whitespace-nowrap">
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
                      {p.estado === 'PENDIENTE' && (
                        <div className="flex items-center gap-2">
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
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Página {page + 1} de {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      {confirm && (
        <ConfirmModal
          estado={confirm.estado}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
          isLoading={isPending}
        />
      )}
    </div>
  );
}
