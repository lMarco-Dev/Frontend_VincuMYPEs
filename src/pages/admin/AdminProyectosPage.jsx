import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminProyectos } from "@features/admin/useAdminProyectos";
import { Loader2 } from "lucide-react";
import {
  Search,
  Eye,
  AlertTriangle,
  XCircle,
  Users,
  Building2,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import { usePostulacionesAdmin } from "@features/admin/useAdminProyectos";

const ESTADO_LABELS = {
  TODOS: "Todos",
  BORRADOR: "Borrador",
  PENDIENTE: "Pendiente",
  EN_DESARROLLO: "En Desarrollo",
  EN_REVISION: "En Revisión",
  COMPLETADO: "Completado",
  CANCELADO: "Cancelado",
};

const getEstadoBadge = (estado) => {
  const styles = {
    BORRADOR: "bg-slate-100 text-slate-600 border-slate-200",
    PENDIENTE: "bg-amber-50 text-amber-700 border-amber-200",
    EN_DESARROLLO: "bg-blue-50 text-blue-700 border-blue-200",
    EN_REVISION: "bg-purple-50 text-purple-700 border-purple-200",
    COMPLETADO: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELADO: "bg-red-50 text-red-600 border-red-200",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${styles[estado] || styles.BORRADOR}`}
    >
      {ESTADO_LABELS[estado] || estado.replace("_", " ")}
    </span>
  );
};

// Modal de abrir vacantes (sin cambios)
function ModalAbrirVacantesBody({ proyecto, onClose, onConfirm, isAbriendo }) {
  const { postulaciones, isLoading } = usePostulacionesAdmin(proyecto?.id);
  const [selectedIds, setSelectedIds] = useState([]);
  const estudiantesConfirmados = postulaciones.filter(p => p.estado === "CONFIRMADO");
  const toggleSeleccion = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  const handleConfirm = () => {
    if (selectedIds.length === 0) {
      alert("Debes seleccionar al menos un estudiante para expulsar.");
      return;
    }
    onConfirm(selectedIds);
  };
  return (
    <div className="p-6">
      <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle size={32} />
      </div>
      <h3 className="text-xl font-extrabold text-slate-900 text-center mb-2">Abrir vacantes</h3>
      <p className="text-sm text-slate-500 text-center mb-4">Selecciona los estudiantes que serán expulsados del proyecto <strong>"{proyecto?.titulo}"</strong>.</p>
      {isLoading ? (
        <div className="flex justify-center py-6"><Loader2 className="animate-spin text-primary" /></div>
      ) : estudiantesConfirmados.length === 0 ? (
        <div className="my-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center">
          <p className="text-sm font-semibold text-amber-800">No hay estudiantes CONFIRMADOS para expulsar.</p>
          <p className="text-xs text-amber-700 mt-1">Abre vacantes solo es posible si hay confirmados.</p>
        </div>
      ) : (
        <div className="my-4 max-h-64 overflow-y-auto">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Estudiantes activos:</label>
          <div className="space-y-2">
            {estudiantesConfirmados.map(p => (
              <label key={p.id} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${selectedIds.includes(p.id) ? "bg-red-50/50 border-red-200 ring-2 ring-red-500/15" : "bg-slate-50 border-slate-200"}`}>
                <input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleSeleccion(p.id)} className="text-red-600 focus:ring-red-500" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{p.estudianteNombre}</p>
                  <p className="text-[10px] text-slate-500">Confirmado</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-left space-y-2 mb-6">
        <h4 className="text-xs font-bold text-blue-700 uppercase tracking-widest">Efecto de la acción</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Los estudiantes expulsados pasarán a estado RECHAZADO.</li>
          <li>• Si quedan 0 estudiantes, el proyecto vuelve a PENDIENTE.</li>
          <li>• Los cupos liberados permitirán nuevas postulaciones (incluyendo a quienes fueron rechazados antes).</li>
        </ul>
      </div>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200">Cancelar</button>
        <button onClick={handleConfirm} disabled={isAbriendo || estudiantesConfirmados.length === 0} className="flex-1 py-3 bg-amber-600 text-white rounded-xl text-sm font-bold hover:bg-amber-700 disabled:opacity-50">
          {isAbriendo ? "Abriendo vacantes..." : "Confirmar expulsión"}
        </button>
      </div>
    </div>
  );
}

// Componente principal
export default function AdminProyectosPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  const {
    proyectosPage,
    isLoading,
    cancelarProyecto,
    isCancelando,
    abrirVacantes,
    isAbriendoVacantes,
  } = useAdminProyectos(currentPage, pageSize, sortField, sortDirection);

  const [modalCancelar, setModalCancelar] = useState({ isOpen: false, proyecto: null });
  const [modalAbrirVacantes, setModalAbrirVacantes] = useState({ isOpen: false, proyecto: null });

  // Los filtros de búsqueda y estado se aplican localmente sobre la página actual (no ideal, pero simple)
  const filteredProyectos = (proyectosPage?.content || [])
    .filter(p => {
      const matchesSearch = p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.mypeNombre && p.mypeNombre.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesEstado = filtroEstado === "TODOS" || p.estado === filtroEstado;
      return matchesSearch && matchesEstado;
    });

  const totalPages = proyectosPage?.totalPages || 0;
  const totalElements = proyectosPage?.totalElements || 0;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(0);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-50" />;
    return sortDirection === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />;
  };

  const handleConfirmarCancelar = () => {
    if (modalCancelar.proyecto) cancelarProyecto(modalCancelar.proyecto.id);
    setModalCancelar({ isOpen: false, proyecto: null });
  };

  const handleConfirmarAbrirVacantes = (estudianteIds) => {
    if (modalAbrirVacantes.proyecto) {
      abrirVacantes({
        proyectoId: modalAbrirVacantes.proyecto.id,
        estudianteIds,
      });
    }
    setModalAbrirVacantes({ isOpen: false, proyecto: null });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-slate-500 font-medium">Cargando proyectos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">Control de Proyectos</h1>
          <p className="text-sm text-slate-500 font-medium">Audita ofertas, gestiona cancelaciones y abre vacantes para expulsar estudiantes.</p>
        </div>
      </div>

      {/* TOOLBAR (filtros) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200 self-stretch sm:self-auto overflow-x-auto">
          {["TODOS", "BORRADOR", "PENDIENTE", "EN_DESARROLLO", "EN_REVISION", "COMPLETADO", "CANCELADO"].map(estado => (
            <button
              key={estado}
              onClick={() => setFiltroEstado(estado)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filtroEstado === estado ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {ESTADO_LABELS[estado] || estado}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por título u organización..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort("titulo")}>
                  <div className="flex items-center gap-1">Proyecto / MYPE <SortIcon field="titulo" /></div>
                </th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort("estado")}>
                  <div className="flex items-center gap-1">Estado <SortIcon field="estado" /></div>
                </th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest cursor-pointer group" onClick={() => handleSort("cupos")}>
                  <div className="flex items-center gap-1">Cupos <SortIcon field="cupos" /></div>
                </th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProyectos.map((proyecto) => (
                <tr key={proyecto.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900 mb-0.5 flex items-center flex-wrap gap-2">
                      {proyecto.titulo}
                      {proyecto.postulantesPendientes > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-200 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                          {proyecto.postulantesPendientes} en espera
                        </span>
                      )}
                    </p>
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Building2 size={12} /> {proyecto.mypeNombre}
                    </p>
                  </td>
                  <td className="px-6 py-4">{getEstadoBadge(proyecto.estado)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-slate-400" />
                      <span className="text-sm font-bold text-slate-700">{proyecto.cuposAceptados} <span className="text-slate-400 font-medium">/ {proyecto.cuposTotales}</span></span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {proyecto.estado !== "CANCELADO" && proyecto.estado !== "COMPLETADO" && (
                        <button
                          onClick={() => navigate(`/admin/postulaciones?proyectoId=${proyecto.id}`)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${proyecto.postulantesPendientes > 0 ? "bg-orange-500 text-white border-orange-600 hover:bg-orange-600" : "bg-indigo-50 text-primary border-indigo-100 hover:bg-primary hover:text-white"}`}
                        >
                          <Eye size={14} />
                          {proyecto.postulantesPendientes > 0 ? `Revisar (${proyecto.postulantesPendientes})` : "Revisar"}
                        </button>
                      )}
                      {(proyecto.estado === "EN_DESARROLLO" || (proyecto.estado === "PENDIENTE" && proyecto.cuposAceptados > 0)) && (
                        <button
                          onClick={() => setModalAbrirVacantes({ isOpen: true, proyecto })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg text-xs font-bold hover:bg-amber-600 hover:text-white transition-colors"
                        >
                          <AlertTriangle size={14} /> Abrir vacantes
                        </button>
                      )}
                      {proyecto.estado !== "COMPLETADO" && proyecto.estado !== "CANCELADO" && (
                        <button
                          onClick={() => setModalCancelar({ isOpen: true, proyecto })}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Cancelar proyecto"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProyectos.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">No se encontraron proyectos en el sistema.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500">Mostrando {filteredProyectos.length} de {totalElements} proyectos</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-slate-600">Página {currentPage + 1} de {totalPages}</span>
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

      {/* Modales */}
      <AnimatePresence>
        {modalCancelar.isOpen && (
          <ConfirmModal
            isOpen={true}
            title="Cancelar proyecto"
            message={`¿Estás seguro de que deseas cancelar el proyecto "${modalCancelar.proyecto?.titulo}"? Todas las postulaciones serán rechazadas y el proyecto pasará a estado CANCELADO.`}
            confirmText="Cancelar proyecto"
            variant="danger"
            onConfirm={handleConfirmarCancelar}
            onCancel={() => setModalCancelar({ isOpen: false, proyecto: null })}
            isLoading={isCancelando}
          />
        )}
        {modalAbrirVacantes.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setModalAbrirVacantes({ isOpen: false, proyecto: null })}
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10"
            >
              <ModalAbrirVacantesBody
                proyecto={modalAbrirVacantes.proyecto}
                onClose={() => setModalAbrirVacantes({ isOpen: false, proyecto: null })}
                onConfirm={handleConfirmarAbrirVacantes}
                isAbriendo={isAbriendoVacantes}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}