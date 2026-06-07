// src/pages/admin/AdminUsuariosPage.jsx
import React, { useState } from 'react';
import {
  Search,
  Users,
  Building2,
  GraduationCap,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Zap,
  ArrowRight,
  Loader2,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminUsuarios } from '@/features/admin/useAdminUsuarios';
import { ConfirmModal } from '@/shared/components/ConfirmModal';

const getRolConfig = (rol) => {
  switch (rol) {
    case 'ESTUDIANTE': return { icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' };
    case 'MYPE': return { icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' };
    case 'ADMIN': return { icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' };
    default: return { icon: Users, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' };
  }
};

const SortableHeader = ({ field, currentSort, onSort, children }) => {
  const isActive = currentSort.field === field;
  const direction = isActive ? currentSort.direction : null;
  return (
    <th
      className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-600 group"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {direction === 'asc' && <ArrowUp size={12} />}
        {direction === 'desc' && <ArrowDown size={12} />}
        {!isActive && <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-50" />}
      </div>
    </th>
  );
};

export default function AdminUsuariosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroRol, setFiltroRol] = useState('TODOS');
  const [currentPage, setCurrentPage] = useState(0);
  const [sort, setSort] = useState({ field: 'id', direction: 'asc' });

  // Estado para modales
  const [estadoModal, setEstadoModal] = useState({ isOpen: false, usuario: null, action: null });
  const [modalBypass, setModalBypass] = useState({ isOpen: false, usuario: null });
  const [nuevoLimite, setNuevoLimite] = useState(3);

  const pageSize = 10;
  const sortParam = `${sort.field},${sort.direction}`;
  const rolParam = filtroRol === "TODOS" ? null : filtroRol;

  const {
    usuariosPage,
    isLoading,
    cambiarEstado,
    isCambiandoEstado,
    cambiarBypassLimite,
    isCambiandoBypass,
    errorBypass,
  } = useAdminUsuarios(currentPage, pageSize, sort.field, sort.direction, rolParam);

  const handleSort = (field) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(0);
  };

  const openBypassModal = (usuario) => {
    setNuevoLimite((usuario.limiteProyectos || 1) + 1);
    setModalBypass({ isOpen: true, usuario });
  };

  const handleApplyBypass = () => {
    if (!modalBypass.usuario) return;
    cambiarBypassLimite({
      estudianteId: modalBypass.usuario.id,
      nuevoLimite: nuevoLimite
    }, {
      onSuccess: () => setModalBypass({ isOpen: false, usuario: null })
    });
  };

  const handleToggleEstado = (usuario) => {
    setEstadoModal({
      isOpen: true,
      usuario,
      action: usuario.estado === 'ACTIVO' ? 'suspender' : 'reactivar'
    });
  };

  const handleConfirmToggleEstado = () => {
    if (estadoModal.usuario) cambiarEstado(estadoModal.usuario.id);
    setEstadoModal({ isOpen: false, usuario: null, action: null });
  };

  // Filtrado local sobre la página actual (búsqueda y rol)
  const filteredUsuarios = usuariosPage?.content?.filter(u => {
    const matchesSearch = u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRol = filtroRol === 'TODOS' || u.rol === filtroRol;
    return matchesSearch && matchesRol;
  }) || [];

  const totalPages = usuariosPage?.totalPages || 0;
  const totalElements = usuariosPage?.totalElements || 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-slate-500 font-medium">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">Directorio de Usuarios</h1>
          <p className="text-sm text-slate-500 font-medium">
            Gestiona accesos, audita cuentas y otorga permisos especiales (Bypass).
          </p>
        </div>
      </div>

      {/* TOOLBAR (Búsqueda y Filtros) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200 self-stretch sm:self-auto overflow-x-auto">
          {['TODOS', 'ESTUDIANTE', 'MYPE', 'ADMIN'].map(rol => (
            <button
              key={rol}
              onClick={() => setFiltroRol(rol)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filtroRol === rol
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {rol}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <SortableHeader field="nombre" currentSort={sort} onSort={handleSort}>Usuario</SortableHeader>
                <SortableHeader field="email" currentSort={sort} onSort={handleSort}>Email</SortableHeader>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Teléfono</th>
                <SortableHeader field="rol" currentSort={sort} onSort={handleSort}>Rol</SortableHeader>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsuarios.map((usuario) => {
                const config = getRolConfig(usuario.rol);
                const Icono = config.icon;
                return (
                  <tr key={usuario.id} className={`hover:bg-slate-50/50 transition-colors group ${usuario.estado === 'SUSPENDIDO' ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${config.bg} ${config.color} ${config.border}`}>
                          <Icono size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{usuario.nombre}</p>
                          {usuario.rol === 'ESTUDIANTE' && usuario.promedioEstrellas != null && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star size={12} className="text-amber-400 fill-amber-400" />
                              <span className="text-[10px] font-bold text-slate-500">{usuario.promedioEstrellas}</span>
                              <span className="text-[10px] text-slate-400">· {usuario.proyectosCompletados || 0} completados</span>
                            </div>
                          )}
                          {usuario.carrera && <p className="text-[10px] font-bold text-slate-400 mt-0.5">{usuario.carrera}</p>}
                          {usuario.sector && <p className="text-[10px] font-bold text-slate-400 mt-0.5">{usuario.sector}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{usuario.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{usuario.telefono || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${config.bg} ${config.color} ${config.border}`}>
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {usuario.estado === 'ACTIVO' ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                          <CheckCircle2 size={14} /> Activo
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-red-500">
                          <Ban size={14} /> Suspendido
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {usuario.rol === 'ESTUDIANTE' && usuario.estado === 'ACTIVO' && (
                          <button
                            onClick={() => openBypassModal(usuario)}
                            className="p-2 text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                            title="Aumentar límite de proyectos (Bypass)"
                          >
                            <Zap size={16} />
                          </button>
                        )}
                        {usuario.rol !== 'ADMIN' && (
                          <button
                            onClick={() => handleToggleEstado(usuario)}
                            disabled={isCambiandoEstado}
                            className={`p-2 rounded-lg transition-colors ${usuario.estado === 'ACTIVO'
                                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                                : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                              }`}
                            title={usuario.estado === 'ACTIVO' ? 'Suspender cuenta' : 'Reactivar cuenta'}
                          >
                            {usuario.estado === 'ACTIVO' ? <Ban size={16} /> : <CheckCircle2 size={16} />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredUsuarios.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <Users size={32} className="mx-auto mb-3 text-slate-300" />
                    <p className="text-sm font-bold text-slate-700">No se encontraron usuarios</p>
                    <p className="text-xs">Prueba con otros términos de búsqueda.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500">
            Mostrando {filteredUsuarios.length} de {totalElements} usuarios
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-slate-600">
              Página {currentPage + 1} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* MODALES */}
      <ConfirmModal
        isOpen={estadoModal.isOpen}
        title={estadoModal.action === 'suspender' ? "Suspender usuario" : "Reactivar usuario"}
        message={`¿Estás seguro de que deseas ${estadoModal.action === 'suspender' ? 'suspender' : 'reactivar'} la cuenta de ${estadoModal.usuario?.nombre}?`}
        confirmText={estadoModal.action === 'suspender' ? "Suspender" : "Reactivar"}
        variant="warning"
        onConfirm={handleConfirmToggleEstado}
        onCancel={() => setEstadoModal({ isOpen: false, usuario: null, action: null })}
        isLoading={isCambiandoEstado}
      />

      <AnimatePresence>
        {modalBypass.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setModalBypass({ isOpen: false, usuario: null })}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10"
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Permiso Especial (Bypass)</h3>
                <p className="text-sm text-slate-500 font-medium mb-6">
                  Estás a punto de modificar el límite de proyectos activos para el estudiante <strong className="text-slate-800">{modalBypass.usuario?.nombre}</strong>.
                </p>
                {errorBypass && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
                    {errorBypass}
                  </div>
                )}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Límite actual</p>
                    <p className="text-2xl font-black text-slate-800">{modalBypass.usuario?.limiteProyectos || 1}</p>
                  </div>
                  <ArrowRight size={20} className="text-slate-300" />
                  <div className="text-right flex flex-col items-end">
                    <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Nuevo límite</p>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={nuevoLimite}
                      onChange={(e) => setNuevoLimite(Number(e.target.value))}
                      className="w-20 text-center font-black text-2xl text-amber-600 bg-white border border-slate-200 rounded-xl py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setModalBypass({ isOpen: false, usuario: null })}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleApplyBypass}
                    disabled={isCambiandoBypass}
                    className="flex-1 py-3 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 disabled:opacity-50"
                  >
                    {isCambiandoBypass ? 'Aplicando...' : 'Aplicar Excepción'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}