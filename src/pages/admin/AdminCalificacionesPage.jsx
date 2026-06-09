// src/pages/admin/AdminCalificacionesPage.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Search,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  X,
  Save,
  Eye,
  Users,
  Building2,
  GraduationCap,
  Calendar,
  Filter,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useAdminCalificaciones } from "@/features/admin/useAdminCalificaciones";
import { httpClient } from "@/shared/api/httpClient";

const FONT = "'Angro Std', 'Outfit', sans-serif";

// ─── Animaciones ───
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] },
});

// ─── Helper para formatear fecha ─────────────────────────────────────────
const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ─── Componente de Estrellas ────────────────────────────────────────────
const StarRating = ({ rating, size = 16, showValue = true }) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={
              star <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "text-slate-200 fill-slate-200"
            }
          />
        ))}
      </div>
      {showValue && (
        <span className="text-xs font-bold text-slate-600 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

// ─── Badge de Rol ───────────────────────────────────────────────────────
const RolBadge = ({ rol }) => {
  const config = {
    ESTUDIANTE: {
      bg: "#EFF6FF",
      color: "#1B6FE8",
      border: "#BFDBFE",
      label: "Estudiante",
      icon: GraduationCap,
    },
    MYPE: {
      bg: "#ECFDF5",
      color: "#059669",
      border: "#A7F3D0",
      label: "Empresa",
      icon: Building2,
    },
    ADMIN: {
      bg: "#F5F3FF",
      color: "#7C3AED",
      border: "#DDD6FE",
      label: "Admin",
      icon: Users,
    },
  };
  const c = config[rol] || config.ESTUDIANTE;
  const Icon = c.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold`}
      style={{
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
      }}
    >
      <Icon size={10} />
      {c.label}
    </span>
  );
};

// ─── Modal Editar Calificación ──────────────────────────────────────────
function ModalEditarCalificacion({
  isOpen,
  onClose,
  calificacion,
  onSave,
  isSaving,
}) {
  const [nuevaPuntuacion, setNuevaPuntuacion] = useState(
    calificacion?.puntuacion || 5,
  );
  const [motivoEdicion, setMotivoEdicion] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (calificacion) {
      setNuevaPuntuacion(calificacion.puntuacion);
      setMotivoEdicion("");
      setError("");
    }
  }, [calificacion]);

  const handleSubmit = async () => {
    if (!motivoEdicion.trim()) {
      setError("Debes especificar un motivo para la edición");
      return;
    }
    await onSave({ nuevaPuntuacion, motivoEdicion });
    if (!isSaving) onClose();
  };

  if (!isOpen || !calificacion) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Edit2 size={20} className="text-primary" />
            <h3 className="text-lg font-bold text-slate-900">
              Editar calificación
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Proyecto</p>
            <p className="text-sm font-semibold text-slate-800">
              {calificacion.proyectoTitulo}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <div>
                <p className="text-[10px] text-slate-400">Calificador</p>
                <p className="text-xs font-medium text-slate-700">
                  {calificacion.calificadorNombre}
                </p>
                <RolBadge rol={calificacion.calificadorRol} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Calificado</p>
                <p className="text-xs font-medium text-slate-700">
                  {calificacion.calificadoNombre}
                </p>
                <RolBadge rol={calificacion.calificadoRol} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">
              Calificación actual
            </label>
            <StarRating rating={calificacion.puntuacion} size={20} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">
              Nueva calificación <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setNuevaPuntuacion(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={
                      star <= nuevaPuntuacion
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200 fill-slate-200"
                    }
                  />
                </button>
              ))}
              <span className="text-lg font-bold text-slate-700 ml-2">
                {nuevaPuntuacion}/5
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">
              Motivo de la edición <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={motivoEdicion}
              onChange={(e) => setMotivoEdicion(e.target.value)}
              placeholder="Ej: El estudiante presentó evidencia de que el trabajo fue completado satisfactoriamente..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
            <p className="text-xs text-amber-700 flex items-center gap-2">
              <AlertTriangle size={14} />
              Esta acción quedará registrada en el sistema para auditoría.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Confirmar Eliminación ─────────────────────────────────────────
function ModalEliminarCalificacion({
  isOpen,
  onClose,
  calificacion,
  onConfirm,
  isDeleting,
}) {
  if (!isOpen || !calificacion) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10">
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={32} />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 mb-2">
            Eliminar calificación
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            ¿Estás seguro de que deseas eliminar esta calificación?
          </p>
          <div className="bg-slate-50 rounded-xl p-3 mb-6 text-left">
            <p className="text-xs text-slate-500">Proyecto</p>
            <p className="text-sm font-semibold text-slate-800">
              {calificacion.proyectoTitulo}
            </p>
            <div className="flex justify-between mt-2">
              <div>
                <p className="text-[10px] text-slate-400">Calificador</p>
                <p className="text-xs font-medium">
                  {calificacion.calificadorNombre}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Calificación</p>
                <StarRating
                  rating={calificacion.puntuacion}
                  size={14}
                  showValue={false}
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl mb-6">
            ⚠️ Esta acción eliminará permanentemente la calificación del
            sistema.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Trash2 size={16} />
              )}
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tarjeta de Calificación (para vista móvil) ──────────────────────────
function CalificacionCard({ calificacion, onEditar, onEliminar }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-slate-200 p-4 transition-all"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-slate-400 font-mono">{calificacion.id}</p>
          <p className="text-sm font-bold text-slate-800 mt-1">
            {calificacion.proyectoTitulo}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-slate-500">
              {calificacion.calificadorNombre}
            </span>
            <span className="text-slate-300">→</span>
            <span className="text-xs text-slate-500">
              {calificacion.calificadoNombre}
            </span>
          </div>
          <div className="mt-2">
            <StarRating rating={calificacion.puntuacion} size={14} />
          </div>
          <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
            <Calendar size={10} /> {formatDate(calificacion.createdAt)}
          </p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEditar(calificacion)}
            className="p-2 text-slate-400 hover:text-primary hover:bg-indigo-50 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onEliminar(calificacion)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════
export default function AdminCalificacionesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("TODOS");
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    sortField: "createdAt",
    sortDirection: "desc",
  });

  const [modalEditar, setModalEditar] = useState({
    isOpen: false,
    calificacion: null,
  });
  const [modalEliminar, setModalEliminar] = useState({
    isOpen: false,
    calificacion: null,
  });

  const {
    calificaciones,
    totalPages,
    isLoading,
    editarCalificacion,
    isEditando,
    eliminarCalificacion,
    isEliminando,
  } = useAdminCalificaciones(pagination);

  // Filtrado local
  const filteredCalificaciones = calificaciones.filter((c) => {
    const matchesSearch =
      c.proyectoTitulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.calificadorNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.calificadoNombre?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filtroTipo === "TODOS" || c.tipo === filtroTipo;
    return matchesSearch && matchesTipo;
  });

  // Estadísticas
  const totalCalificaciones = calificaciones.length;
  const promedioGeneral =
    calificaciones.reduce((acc, c) => acc + c.puntuacion, 0) /
    (totalCalificaciones || 1);
  const distribucion = {
    1: calificaciones.filter((c) => c.puntuacion === 1).length,
    2: calificaciones.filter((c) => c.puntuacion === 2).length,
    3: calificaciones.filter((c) => c.puntuacion === 3).length,
    4: calificaciones.filter((c) => c.puntuacion === 4).length,
    5: calificaciones.filter((c) => c.puntuacion === 5).length,
  };

  const handleEditar = async (data) => {
    await editarCalificacion({ id: modalEditar.calificacion.id, data });
  };

  const handleEliminar = async () => {
    await eliminarCalificacion(modalEliminar.calificacion.id);
    setModalEliminar({ isOpen: false, calificacion: null });
  };

  const filterOptions = [
    { value: "TODOS", label: "Todas", icon: Star },
    { value: "MYPE_ESTUDIANTE", label: "MYPE → Estudiante", icon: Building2 },
    {
      value: "ESTUDIANTE_MYPE",
      label: "Estudiante → MYPE",
      icon: GraduationCap,
    },
  ];

  return (
    <div
      className="space-y-6 pb-12"
      style={{ fontFamily: FONT, maxWidth: 1400, margin: "0 auto" }}
    >
      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Moderación de Calificaciones
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestiona y modera las calificaciones entre estudiantes y empresas
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl">
          <Star className="fill-primary text-primary" size={16} />
          <span className="text-sm font-bold text-primary">
            Promedio global: {promedioGeneral.toFixed(1)}
          </span>
        </div>
      </motion.div>

      {/* Estadísticas rápidas */}
      <motion.div {...fadeUp(0.05)} className="grid grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className="bg-white rounded-xl border border-slate-200 p-3 text-center shadow-sm"
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-slate-700">{star}</span>
            </div>
            <p className="text-xl font-black text-slate-800">
              {distribucion[star]}
            </p>
            <p className="text-[10px] text-slate-400">calificaciones</p>
          </div>
        ))}
      </motion.div>

      {/* Filtros y búsqueda */}
      <motion.div
        {...fadeUp(0.1)}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFiltroTipo(opt.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filtroTipo === opt.value
                  ? "bg-gradient-to-r from-primary to-cyan-600 text-white shadow-md shadow-primary/25"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <opt.icon size={14} />
              {opt.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por proyecto, calificador o calificado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-80 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </motion.div>

      {/* Tabla de calificaciones */}
      <motion.div
        {...fadeUp(0.15)}
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  ID / Fecha
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Proyecto
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Calificador → Calificado
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Calificación
                </th>
                <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2
                      className="animate-spin text-primary mx-auto"
                      size={32}
                    />
                    <p className="text-slate-500 text-sm mt-3">
                      Cargando calificaciones...
                    </p>
                  </td>
                </tr>
              ) : filteredCalificaciones.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Star size={40} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500 font-medium">
                      No se encontraron calificaciones
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Prueba con otros términos de búsqueda
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCalificaciones.map((calificacion, idx) => (
                  <tr
                    key={calificacion.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <p className="text-xs font-mono font-bold text-slate-500">
                        #{calificacion.id}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {formatDate(calificacion.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {calificacion.proyectoTitulo}
                      </p>
                      <a
                        href={calificacion.enlaceProyecto}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-primary hover:underline"
                      >
                        Ver proyecto →
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            {calificacion.calificadorNombre}
                          </p>
                          <RolBadge rol={calificacion.calificadorRol} />
                        </div>
                        <span className="text-slate-300">→</span>
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            {calificacion.calificadoNombre}
                          </p>
                          <RolBadge rol={calificacion.calificadoRol} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StarRating rating={calificacion.puntuacion} size={18} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            setModalEditar({ isOpen: true, calificacion })
                          }
                          className="p-2 text-slate-400 hover:text-primary hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Editar calificación"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            setModalEliminar({ isOpen: true, calificacion })
                          }
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar calificación"
                        >
                          <Trash2 size={16} />
                        </button>
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
          <div className="px-6 py-3 border-t border-slate-200 flex justify-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
              <button
                key={i}
                onClick={() => setPagination((prev) => ({ ...prev, page: i }))}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  pagination.page === i
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Modales */}
      <ModalEditarCalificacion
        isOpen={modalEditar.isOpen}
        onClose={() => setModalEditar({ isOpen: false, calificacion: null })}
        calificacion={modalEditar.calificacion}
        onSave={handleEditar}
        isSaving={isEditando}
      />

      <ModalEliminarCalificacion
        isOpen={modalEliminar.isOpen}
        onClose={() => setModalEliminar({ isOpen: false, calificacion: null })}
        calificacion={modalEliminar.calificacion}
        onConfirm={handleEliminar}
        isDeleting={isEliminando}
      />
    </div>
  );
}
