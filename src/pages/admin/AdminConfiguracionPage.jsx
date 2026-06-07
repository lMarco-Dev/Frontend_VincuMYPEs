import React, { useState } from 'react';
import {
  Settings,
  Database,
  Plus,
  Edit2,
  Trash2,
  SlidersHorizontal,
  Power,
  ShieldAlert,
  Save,
  Loader2,
  FileText,
  Layers,
  X,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTiposProyecto } from '@/features/admin/useTiposProyecto';
import { useEntregablesTipo } from '@/features/admin/useEntregablesTipo';
import { useInsumosTipo } from '@/features/admin/useInsumosTipo';
import { useMantenimientoEstado } from '@/features/mantenimiento/useMantenimientoEstado';
import { useToggleMantenimiento } from '@/features/mantenimiento/useToggleMantenimiento';

// ── Constantes del dominio ─────────────────────────────────────
// Enum AreaSistemas del backend (com.mypelink.backend.proyectos.domain.enums.AreaSistemas)
const AREAS_SISTEMAS = [
  { value: 'DESARROLLO_WEB', label: 'Desarrollo Web' },
  { value: 'DESARROLLO_MOVIL', label: 'Desarrollo Móvil' },
  { value: 'DESARROLLO_SOFTWARE', label: 'Desarrollo de Software' },
  { value: 'BASE_DE_DATOS', label: 'Base de Datos' },
  { value: 'ANALISIS_DATOS', label: 'Análisis de Datos' },
  { value: 'SOPORTE_TI', label: 'Soporte TI' },
  { value: 'OTRO', label: 'Otro' },
];

// Ramas del seed (TipoProyectoSeed)
const RAMAS = [
  'Presencia digital y captación',
  'Datos e inteligencia de negocio',
  'Experiencia de usuario',
  'Infraestructura y redes',
  'Seguridad y continuidad',
];

const COMPLEJIDADES = [
  'Ligero',
  'Medio-ligero',
  'Medio',
  'Medio-alto',
  'Alto',
];

export default function AdminConfiguracionPage() {
  const { tiposProyecto, crearTipo, actualizarTipo, toggleActivo } = useTiposProyecto();

  const [modalNuevoTipo, setModalNuevoTipo] = useState(false);
  const [tipoEditando, setTipoEditando] = useState(null);
  const [modalEntregables, setModalEntregables] = useState(null);
  const [modalInsumos, setModalInsumos] = useState(null);

  const [limiteGlobal, setLimiteGlobal] = useState(1);
  const [confirmandoMantenimiento, setConfirmandoMantenimiento] = useState(false);

  const { estaEnMantenimiento } = useMantenimientoEstado();
  const { toggleMantenimiento, isLoading: isTogglingMant } = useToggleMantenimiento();

  const handleGuardarTipo = (e) => {
    e.preventDefault();
    const form = e.target;

    // Validaciones blandas previas a construir el payload
    const cuposMin = parseInt(form.cuposMin.value, 10);
    const cuposMax = parseInt(form.cuposMax.value, 10);
    const diasMin = parseInt(form.diasMin.value, 10);
    const diasSugerido = parseInt(form.diasSugerido.value, 10);

    if (Number.isNaN(cuposMin) || Number.isNaN(cuposMax) || cuposMin < 1 || cuposMax < 1) {
      alert('Los cupos deben ser números mayores o iguales a 1.');
      return;
    }
    if (cuposMin > cuposMax) {
      alert('Cupos mínimos no puede ser mayor que cupos máximos.');
      return;
    }
    if (Number.isNaN(diasMin) || Number.isNaN(diasSugerido) || diasMin < 1 || diasSugerido < 1) {
      alert('Los días deben ser números mayores o iguales a 1.');
      return;
    }
    if (diasMin > diasSugerido) {
      alert('Días mínimos no puede ser mayor que días sugeridos.');
      return;
    }

    const esfuerzoStr = form.esfuerzoHPers.value.trim();

    const data = {
      codigo: form.codigo.value.trim(),
      nombre: form.nombre.value.trim(),
      rama: form.rama.value,
      areaSistemas: form.areaSistemas.value,
      cicloMinimo: parseInt(form.cicloMinimo.value, 10),
      complejidad: form.complejidad.value || null,
      esfuerzoHPers: esfuerzoStr ? parseInt(esfuerzoStr, 10) : null,
      cuposMin,
      cuposMax,
      diasMin,
      diasSugerido,
      descripcionMype: form.descripcionMype.value.trim() || null,
      alcanceIncluye: form.alcanceIncluye.value.trim() || null,
      alcanceNoIncluye: form.alcanceNoIncluye.value.trim() || null,
      activo: tipoEditando?.activo ?? true,
    };

    // Signatures de useTiposProyecto:
    //   crearTipo(data)
    //   actualizarTipo({ id, data })
    if (tipoEditando) {
      actualizarTipo({ id: tipoEditando.id, data });
    } else {
      crearTipo(data);
    }

    setModalNuevoTipo(false);
    setTipoEditando(null);
  };

  const handleEditar = (tipo) => {
    setTipoEditando(tipo);
    setModalNuevoTipo(true);
  };

  const handleToggleActivo = (tipo) => {
    if (window.confirm(`¿${tipo.activo ? 'Desactivar' : 'Activar'} "${tipo.nombre}"?`)) {
      toggleActivo(tipo.id);
    }
  };

  const tipos = tiposProyecto || [];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1 flex items-center gap-3">
            <Settings className="text-primary" size={32} />
            Configuración y Catálogos
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Gestión de reglas de negocio, parámetros globales y catálogo semilla del sistema.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">
          <Save size={18} />
          Guardar Cambios
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* =========================================================================
            COLUMNA IZQUIERDA: Variables de Sistema
            ========================================================================= */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <SlidersHorizontal className="text-slate-500" size={20} />
              <h3 className="font-bold text-slate-800">Parámetros Globales</h3>
            </div>
            <div className="p-6 space-y-6">

              {/* Límite de Proyectos */}
              <div>
                <label className="flex items-center justify-between text-sm font-bold text-slate-700 mb-2">
                  Límite de proyectos por estudiante
                  <span className="px-2 py-0.5 bg-indigo-50 text-primary rounded text-[10px] uppercase tracking-wider">Activo</span>
                </label>
                <p className="text-xs text-slate-500 mb-3 font-medium">
                  Define cuántos proyectos puede tener un estudiante en estado "EN_DESARROLLO" simultáneamente.
                </p>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={limiteGlobal}
                  onChange={(e) => setLimiteGlobal(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-800"
                />
              </div>

              <hr className="border-slate-100" />

              {/* Modo Mantenimiento */}
              <div>
                <label className="flex items-center justify-between text-sm font-bold text-slate-700 mb-2">
                  Modo Mantenimiento
                  {estaEnMantenimiento && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] uppercase tracking-wider animate-pulse">
                      Activo
                    </span>
                  )}
                </label>
                <p className="text-xs text-slate-500 mb-4 font-medium">
                  Bloquea el acceso a estudiantes y MYPEs. Solo los Administradores podrán ingresar.
                </p>
                <button
                  onClick={() => setConfirmandoMantenimiento(true)}
                  disabled={isTogglingMant}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                    estaEnMantenimiento
                      ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isTogglingMant ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Power size={18} />
                  )}
                  {estaEnMantenimiento ? 'Desactivar Mantenimiento' : 'Activar Mantenimiento'}
                </button>
              </div>

              {/* Modal de confirmación inline */}
              {confirmandoMantenimiento && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    onClick={() => setConfirmandoMantenimiento(false)}
                  />
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        estaEnMantenimiento ? 'bg-emerald-100' : 'bg-red-100'
                      }`}>
                        <ShieldAlert size={20} className={estaEnMantenimiento ? 'text-emerald-600' : 'text-red-600'} />
                      </div>
                      <h3 className="text-base font-bold text-slate-900">
                        {estaEnMantenimiento ? 'Desactivar mantenimiento' : 'Activar mantenimiento'}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                      {estaEnMantenimiento
                        ? 'Al desactivar, MYPEs y estudiantes podrán volver a usar la plataforma normalmente.'
                        : 'Al activar, todos los MYPEs y estudiantes quedarán bloqueados. Solo los administradores podrán ingresar. Sus sesiones activas no se cerrarán, pero todas sus requests serán rechazadas hasta que desactives el mantenimiento.'}
                    </p>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setConfirmandoMantenimiento(false)}
                        className="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => {
                          toggleMantenimiento(!estaEnMantenimiento, {
                            onSuccess: () => setConfirmandoMantenimiento(false),
                          });
                        }}
                        disabled={isTogglingMant}
                        className={`px-5 py-2 text-white text-sm font-bold rounded-xl disabled:opacity-50 ${
                          estaEnMantenimiento
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        {isTogglingMant ? 'Aplicando...' : (estaEnMantenimiento ? 'Sí, desactivar' : 'Sí, activar')}
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}

            </div>
          </div>

          {/* Tarjeta de Información de Seguridad */}
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex gap-4">
            <ShieldAlert className="text-amber-500 shrink-0" size={24} />
            <div>
              <h4 className="text-sm font-bold text-amber-800 mb-1">Zona Crítica</h4>
              <p className="text-xs text-amber-700/80 font-medium leading-relaxed">
                Los cambios realizados en esta sección afectan la lógica de negocio de toda la plataforma en tiempo real. Actúa con precaución.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            COLUMNA DERECHA: Catálogo de Tipos de Proyecto (2/3 de ancho)
            ========================================================================= */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Database className="text-slate-500" size={20} />
              <div>
                <h3 className="font-bold text-slate-800">Catálogo de Ofertas</h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Plantillas base para la creación de proyectos.</p>
              </div>
            </div>
            <button
              onClick={() => { setTipoEditando(null); setModalNuevoTipo(true); }}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors shadow-sm"
            >
              <Plus size={16} /> Nuevo Tipo
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Código / Nombre</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Rama TI</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-center">Ciclo Mín.</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tipos.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm">
                      No hay tipos de proyecto cargados.
                    </td>
                  </tr>
                ) : tipos.map((tipo) => (
                  <tr key={tipo.id} className={`hover:bg-slate-50/50 transition-colors ${!tipo.activo ? 'opacity-50 grayscale' : ''}`}>
                    <td className="px-6 py-4">
                      <p className="text-xs font-extrabold text-slate-500 mb-0.5">{tipo.codigo}</p>
                      <p className="text-sm font-bold text-slate-900 mb-1">{tipo.nombre}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {tipo.cuposMin != null && tipo.cuposMax != null && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-bold">
                            {tipo.cuposMin}–{tipo.cuposMax} cupos
                          </span>
                        )}
                        {tipo.diasMin != null && tipo.diasSugerido != null && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-bold">
                            {tipo.diasMin}–{tipo.diasSugerido} días
                          </span>
                        )}
                        {tipo.complejidad && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-primary rounded font-bold">
                            {tipo.complejidad}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-md text-[10px] font-bold tracking-wider">
                        {tipo.rama}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-black text-slate-700">{tipo.cicloMinimo}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEditar(tipo)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Editar tipo"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setModalEntregables(tipo)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Gestionar entregables"
                        >
                          <Layers size={16} />
                        </button>
                        <button
                          onClick={() => setModalInsumos(tipo)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Gestionar insumos requeridos"
                        >
                          <FileText size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleActivo(tipo)}
                          className={`p-2 rounded-lg transition-colors ${
                            tipo.activo
                              ? 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                              : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={tipo.activo ? 'Desactivar' : 'Activar'}
                        >
                          <Power size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ============================================================================
          MODAL: NUEVO / EDITAR TIPO DE PROYECTO
          ============================================================================ */}
      <AnimatePresence>
        {modalNuevoTipo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => { setModalNuevoTipo(false); setTipoEditando(null); }}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col"
            >
              <form onSubmit={handleGuardarTipo} className="flex flex-col flex-1 overflow-hidden">

                {/* Header (fijo) */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
                  <h3 className="text-lg font-bold text-slate-900">
                    {tipoEditando ? 'Editar Tipo de Proyecto' : 'Agregar Tipo de Proyecto'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Esta plantilla estará disponible para las MYPEs al crear ofertas.
                  </p>
                </div>

                {/* Body (scrolleable) */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">

                  {/* ── IDENTIDAD ─────────────────────────── */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Identidad</h4>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Código único <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="codigo"
                        defaultValue={tipoEditando?.codigo || ''}
                        required
                        placeholder="Ej: 1.1"
                        disabled={!!tipoEditando}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                      {tipoEditando && (
                        <p className="text-[10px] text-slate-400 mt-1">El código no se puede editar después de creado.</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Nombre descriptivo <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="nombre"
                        defaultValue={tipoEditando?.nombre || ''}
                        required
                        placeholder="Ej: Sitio web de una página (landing) con captación de clientes"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* ── CLASIFICACIÓN ─────────────────────── */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Clasificación</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Rama TI</label>
                        <select
                          name="rama"
                          defaultValue={tipoEditando?.rama || RAMAS[0]}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                        >
                          {RAMAS.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Área de sistemas</label>
                        <select
                          name="areaSistemas"
                          defaultValue={tipoEditando?.areaSistemas || 'DESARROLLO_WEB'}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                        >
                          {AREAS_SISTEMAS.map((a) => (
                            <option key={a.value} value={a.value}>{a.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Complejidad</label>
                        <select
                          name="complejidad"
                          defaultValue={tipoEditando?.complejidad || 'Medio'}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                        >
                          {COMPLEJIDADES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Ciclo mínimo</label>
                        <input
                          name="cicloMinimo"
                          type="number"
                          min="1"
                          max="10"
                          defaultValue={tipoEditando?.cicloMinimo ?? 7}
                          required
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── CAPACIDAD Y DURACIÓN ──────────────── */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Capacidad y duración</h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Cupos mín.</label>
                        <input
                          name="cuposMin"
                          type="number"
                          min="1"
                          defaultValue={tipoEditando?.cuposMin ?? 2}
                          required
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors text-center font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Cupos máx.</label>
                        <input
                          name="cuposMax"
                          type="number"
                          min="1"
                          defaultValue={tipoEditando?.cuposMax ?? 3}
                          required
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors text-center font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Días mín.</label>
                        <input
                          name="diasMin"
                          type="number"
                          min="1"
                          defaultValue={tipoEditando?.diasMin ?? 14}
                          required
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors text-center font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Días sug.</label>
                        <input
                          name="diasSugerido"
                          type="number"
                          min="1"
                          defaultValue={tipoEditando?.diasSugerido ?? 21}
                          required
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors text-center font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Esfuerzo estimado (horas-persona)
                      </label>
                      <input
                        name="esfuerzoHPers"
                        type="number"
                        min="0"
                        defaultValue={tipoEditando?.esfuerzoHPers ?? ''}
                        placeholder="Opcional. Ej: 45"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* ── INFO PARA LA MYPE ─────────────────── */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Información para la MYPE</h4>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Descripción visible para la MYPE
                      </label>
                      <textarea
                        name="descripcionMype"
                        defaultValue={tipoEditando?.descripcionMype || ''}
                        rows={2}
                        placeholder="Cómo verá la MYPE este tipo de proyecto, en lenguaje claro y sin jerga técnica."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Alcance — qué INCLUYE
                      </label>
                      <textarea
                        name="alcanceIncluye"
                        defaultValue={tipoEditando?.alcanceIncluye || ''}
                        rows={3}
                        placeholder="Qué entrega este tipo de proyecto. Opcional."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Alcance — qué NO INCLUYE
                      </label>
                      <textarea
                        name="alcanceNoIncluye"
                        defaultValue={tipoEditando?.alcanceNoIncluye || ''}
                        rows={3}
                        placeholder="Qué queda fuera del alcance. Opcional."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer (fijo) */}
                <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0">
                  <button
                    type="button"
                    onClick={() => { setModalNuevoTipo(false); setTipoEditando(null); }}
                    className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                  >
                    {tipoEditando ? 'Guardar cambios' : 'Crear tipo'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: GESTIÓN DE ENTREGABLES POR TIPO */}
      <AnimatePresence>
        {modalEntregables && (
          <ModalEntregables
            tipo={modalEntregables}
            onClose={() => setModalEntregables(null)}
          />
        )}
      </AnimatePresence>

      {/* MODAL: GESTIÓN DE INSUMOS POR TIPO */}
      <AnimatePresence>
        {modalInsumos && (
          <ModalInsumos
            tipo={modalInsumos}
            onClose={() => setModalInsumos(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

// ── Modal de Gestión de Entregables ──────────────────────────
function ModalEntregables({ tipo, onClose }) {
  const { entregables, isLoading, crearEntregable, actualizarEntregable, eliminarEntregable } = useEntregablesTipo(tipo.id);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ titulo: '', descripcion: '', orden: 0 });
  const [errors, setErrors] = useState({});

  // Límites alineados con el backend (EntregableTipo.titulo length=200, descripcion TEXT)
  const LIMITES = {
    tituloMin: 3,
    tituloMax: 200,
    descripcionMax: 500,
    ordenMin: 0,
    ordenMax: 999,
  };

  const validar = () => {
    const errs = {};
    const titulo = (form.titulo || '').trim();

    if (titulo.length < LIMITES.tituloMin) {
      errs.titulo = `El título debe tener al menos ${LIMITES.tituloMin} caracteres.`;
    } else if (titulo.length > LIMITES.tituloMax) {
      errs.titulo = `Máximo ${LIMITES.tituloMax} caracteres.`;
    }

    if (form.descripcion && form.descripcion.length > LIMITES.descripcionMax) {
      errs.descripcion = `Máximo ${LIMITES.descripcionMax} caracteres.`;
    }

    const orden = Number(form.orden);
    if (!Number.isInteger(orden) || orden < LIMITES.ordenMin) {
      errs.orden = `Debe ser un entero ≥ ${LIMITES.ordenMin}.`;
    } else if (orden > LIMITES.ordenMax) {
      errs.orden = `Máximo ${LIMITES.ordenMax}.`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const payload = {
      titulo: form.titulo.trim(),
      descripcion: form.descripcion?.trim() || null,
      orden: Number(form.orden),
    };

    if (editando) {
      actualizarEntregable({ entregableId: editando.id, data: payload });
    } else {
      crearEntregable(payload);
    }
    setForm({ titulo: '', descripcion: '', orden: 0 });
    setEditando(null);
    setErrors({});
  };

  const handleEditar = (entregable) => {
    setEditando(entregable);
    setForm({ titulo: entregable.titulo, descripcion: entregable.descripcion || '', orden: entregable.orden });
    setErrors({});
  };

  const handleEliminar = (entregable) => {
    if (window.confirm(`¿Eliminar "${entregable.titulo}"?`)) {
      eliminarEntregable(entregable.id);
    }
  };

  // Helper para clase del input según error
  const inputCls = (campo, base) =>
    `${base} ${errors[campo] ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden relative z-10 flex flex-col">

        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Entregables: {tipo.nombre}</h3>
            <p className="text-xs text-slate-500 mt-1">Define los entregables que la MYPE puede seleccionar al crear un proyecto de este tipo.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl"><X size={20} /></button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-4 border-b border-slate-100 flex gap-3 items-start">
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              value={form.titulo}
              onChange={e => { setForm({ ...form, titulo: e.target.value }); if (errors.titulo) setErrors({ ...errors, titulo: undefined }); }}
              required
              minLength={LIMITES.tituloMin}
              maxLength={LIMITES.tituloMax}
              placeholder="Ej: Informe de análisis"
              className={inputCls('titulo', 'w-full px-3 py-2 border rounded-lg text-sm')}
            />
            {errors.titulo && <p className="text-[10px] text-red-500 mt-1">{errors.titulo}</p>}
          </div>

          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Descripción (opcional)</label>
            <input
              value={form.descripcion}
              onChange={e => { setForm({ ...form, descripcion: e.target.value }); if (errors.descripcion) setErrors({ ...errors, descripcion: undefined }); }}
              maxLength={LIMITES.descripcionMax}
              placeholder="Detalle del entregable"
              className={inputCls('descripcion', 'w-full px-3 py-2 border rounded-lg text-sm')}
            />
            {errors.descripcion && <p className="text-[10px] text-red-500 mt-1">{errors.descripcion}</p>}
          </div>

          <div className="w-20">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Orden</label>
            <input
              type="number"
              min={LIMITES.ordenMin}
              max={LIMITES.ordenMax}
              value={form.orden}
              onChange={e => {
                const raw = e.target.value;
                const n = raw === '' ? 0 : parseInt(raw, 10);
                setForm({ ...form, orden: Number.isNaN(n) ? 0 : n });
                if (errors.orden) setErrors({ ...errors, orden: undefined });
              }}
              className={inputCls('orden', 'w-full px-2 py-2 border rounded-lg text-sm text-center')}
            />
            {errors.orden && <p className="text-[10px] text-red-500 mt-1">{errors.orden}</p>}
          </div>

          <div className="pt-5 flex gap-2">
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90">
              {editando ? <Check size={16} /> : <Plus size={16} />}
            </button>
            {editando && (
              <button type="button"
                onClick={() => { setEditando(null); setForm({ titulo: '', descripcion: '', orden: 0 }); setErrors({}); }}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold">Cancelar</button>
            )}
          </div>
        </form>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="text-center py-8"><Loader2 className="animate-spin mx-auto" size={24} /></div>
          ) : (entregables || []).length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Layers size={32} className="mx-auto mb-2" />
              <p className="text-sm">No hay entregables definidos</p>
            </div>
          ) : (
            <div className="space-y-2">
              {(entregables || []).map((e) => (
                <div key={e.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{e.titulo}</p>
                    {e.descripcion && <p className="text-xs text-slate-500">{e.descripcion}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEditar(e)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-indigo-50 rounded-lg">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleEliminar(e)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ── Modal de Gestión de Insumos ──────────────────────────────
function ModalInsumos({ tipo, onClose }) {
  const { insumos, isLoading, crearInsumo, actualizarInsumo, eliminarInsumo } = useInsumosTipo(tipo.id);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', formato: '', obligatorio: false, orden: 0 });
  const [errors, setErrors] = useState({});

  // Límites alineados con el backend (InsumoTipo.nombre length=200, descripcion TEXT, formato length=50)
  const LIMITES = {
    nombreMin: 3,
    nombreMax: 200,
    descripcionMax: 500,
    ordenMin: 0,
    ordenMax: 999,
  };
  const FORMATOS_VALIDOS = ['', 'PDF', 'IMAGEN', 'EXCEL', 'TEXTO', 'LINK'];

  const validar = () => {
    const errs = {};
    const nombre = (form.nombre || '').trim();

    if (nombre.length < LIMITES.nombreMin) {
      errs.nombre = `El nombre debe tener al menos ${LIMITES.nombreMin} caracteres.`;
    } else if (nombre.length > LIMITES.nombreMax) {
      errs.nombre = `Máximo ${LIMITES.nombreMax} caracteres.`;
    }

    if (form.descripcion && form.descripcion.length > LIMITES.descripcionMax) {
      errs.descripcion = `Máximo ${LIMITES.descripcionMax} caracteres.`;
    }

    if (!FORMATOS_VALIDOS.includes(form.formato || '')) {
      errs.formato = 'Formato no válido.';
    }

    const orden = Number(form.orden);
    if (!Number.isInteger(orden) || orden < LIMITES.ordenMin) {
      errs.orden = `Debe ser un entero ≥ ${LIMITES.ordenMin}.`;
    } else if (orden > LIMITES.ordenMax) {
      errs.orden = `Máximo ${LIMITES.ordenMax}.`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion?.trim() || null,
      formato: form.formato || null,
      obligatorio: !!form.obligatorio,
      orden: Number(form.orden),
    };

    if (editando) {
      actualizarInsumo({ insumoId: editando.id, data: payload });
    } else {
      crearInsumo(payload);
    }
    setForm({ nombre: '', descripcion: '', formato: '', obligatorio: false, orden: 0 });
    setEditando(null);
    setErrors({});
  };

  const handleEditar = (insumo) => {
    setEditando(insumo);
    setForm({
      nombre: insumo.nombre,
      descripcion: insumo.descripcion || '',
      formato: insumo.formato || '',
      obligatorio: !!insumo.obligatorio,
      orden: insumo.orden,
    });
    setErrors({});
  };

  const handleEliminar = (insumo) => {
    if (window.confirm(`¿Eliminar "${insumo.nombre}"?`)) {
      eliminarInsumo(insumo.id);
    }
  };

  const inputCls = (campo, base) =>
    `${base} ${errors[campo] ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden relative z-10 flex flex-col">

        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Insumos requeridos: {tipo.nombre}</h3>
            <p className="text-xs text-slate-500 mt-1">Define qué archivos o información debe enviar la MYPE antes de publicar un proyecto de este tipo.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-b border-slate-100 flex gap-3 items-start flex-wrap">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              value={form.nombre}
              onChange={e => { setForm({ ...form, nombre: e.target.value }); if (errors.nombre) setErrors({ ...errors, nombre: undefined }); }}
              required
              minLength={LIMITES.nombreMin}
              maxLength={LIMITES.nombreMax}
              placeholder="Ej: Logotipo en PNG"
              className={inputCls('nombre', 'w-full px-3 py-2 border rounded-lg text-sm')}
            />
            {errors.nombre && <p className="text-[10px] text-red-500 mt-1">{errors.nombre}</p>}
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Descripción</label>
            <input
              value={form.descripcion}
              onChange={e => { setForm({ ...form, descripcion: e.target.value }); if (errors.descripcion) setErrors({ ...errors, descripcion: undefined }); }}
              maxLength={LIMITES.descripcionMax}
              placeholder="Detalle del requisito"
              className={inputCls('descripcion', 'w-full px-3 py-2 border rounded-lg text-sm')}
            />
            {errors.descripcion && <p className="text-[10px] text-red-500 mt-1">{errors.descripcion}</p>}
          </div>

          <div className="w-24">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Formato</label>
            <select
              value={form.formato}
              onChange={e => { setForm({ ...form, formato: e.target.value }); if (errors.formato) setErrors({ ...errors, formato: undefined }); }}
              className={inputCls('formato', 'w-full px-2 py-2 border rounded-lg text-sm')}
            >
              <option value="">Cualquiera</option>
              <option value="PDF">PDF</option>
              <option value="IMAGEN">Imagen</option>
              <option value="EXCEL">Excel</option>
              <option value="TEXTO">Texto</option>
              <option value="LINK">Link</option>
            </select>
            {errors.formato && <p className="text-[10px] text-red-500 mt-1">{errors.formato}</p>}
          </div>

          <div className="flex items-center gap-2 pt-5">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Oblig.</label>
            <input
              type="checkbox"
              checked={form.obligatorio}
              onChange={e => setForm({ ...form, obligatorio: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20"
            />
          </div>

          <div className="w-16">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Orden</label>
            <input
              type="number"
              min={LIMITES.ordenMin}
              max={LIMITES.ordenMax}
              value={form.orden}
              onChange={e => {
                const raw = e.target.value;
                const n = raw === '' ? 0 : parseInt(raw, 10);
                setForm({ ...form, orden: Number.isNaN(n) ? 0 : n });
                if (errors.orden) setErrors({ ...errors, orden: undefined });
              }}
              className={inputCls('orden', 'w-full px-2 py-2 border rounded-lg text-sm text-center')}
            />
            {errors.orden && <p className="text-[10px] text-red-500 mt-1">{errors.orden}</p>}
          </div>

          <div className="pt-5 flex gap-2">
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90">
              {editando ? <Check size={16} /> : <Plus size={16} />}
            </button>
            {editando && (
              <button type="button"
                onClick={() => { setEditando(null); setForm({ nombre: '', descripcion: '', formato: '', obligatorio: false, orden: 0 }); setErrors({}); }}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold">Cancelar</button>
            )}
          </div>
        </form>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="text-center py-8"><Loader2 className="animate-spin mx-auto" size={24} /></div>
          ) : (insumos || []).length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <FileText size={32} className="mx-auto mb-2" />
              <p className="text-sm">No hay insumos definidos</p>
            </div>
          ) : (
            <div className="space-y-2">
              {(insumos || []).map((ins) => (
                <div key={ins.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{ins.nombre}</p>
                      {ins.descripcion && <p className="text-xs text-slate-500">{ins.descripcion}</p>}
                      <div className="flex gap-2 mt-1">
                        {ins.formato && <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded">{ins.formato}</span>}
                        {ins.obligatorio && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">Obligatorio</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEditar(ins)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-indigo-50 rounded-lg">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleEliminar(ins)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}