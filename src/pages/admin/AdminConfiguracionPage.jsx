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
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// =========================================================================
// MOCK DATA (Catálogos y Variables)
// =========================================================================
const MOCK_TIPOS_PROYECTO = [
  { id: 1, codigo: "LANDING_PAGE", nombre: "Página web de presentación", rama: "WEB", cicloMinimo: 7, activo: true },
  { id: 2, codigo: "CATALOGO_DIGITAL", nombre: "Catálogo de productos en línea", rama: "WEB", cicloMinimo: 7, activo: true },
  { id: 3, codigo: "DASHBOARD", nombre: "Tablero de visualización de datos", rama: "BD", cicloMinimo: 8, activo: true },
  { id: 4, codigo: "PROTOTIPO_FIGMA", nombre: "Diseño de aplicación o sistema", rama: "UX", cicloMinimo: 7, activo: false },
  { id: 5, codigo: "DIAGNOSTICO_RED", nombre: "Diagnóstico de red local", rama: "REDES", cicloMinimo: 9, activo: true }
];

export default function AdminConfiguracionPage() {
  const [tiposProyecto, setTiposProyecto] = useState(MOCK_TIPOS_PROYECTO);
  const [modalNuevoTipo, setModalNuevoTipo] = useState(false);

  // Variables de sistema (Mocks)
  const [limiteGlobal, setLimiteGlobal] = useState(1);
  const [mantenimiento, setMantenimiento] = useState(false);

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
                </label>
                <p className="text-xs text-slate-500 mb-4 font-medium">
                  Bloquea el acceso a estudiantes y MYPEs. Solo los Administradores podrán ingresar.
                </p>
                <button 
                  onClick={() => setMantenimiento(!mantenimiento)}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                    mantenimiento 
                      ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Power size={18} />
                  {mantenimiento ? 'Mantenimiento Activado' : 'Activar Mantenimiento'}
                </button>
              </div>

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
              onClick={() => setModalNuevoTipo(true)}
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
                {tiposProyecto.map((tipo) => (
                  <tr key={tipo.id} className={`hover:bg-slate-50/50 transition-colors ${!tipo.activo ? 'opacity-50 grayscale' : ''}`}>
                    <td className="px-6 py-4">
                      <p className="text-xs font-extrabold text-slate-500 mb-0.5">{tipo.codigo}</p>
                      <p className="text-sm font-bold text-slate-900">{tipo.nombre}</p>
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
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-primary hover:bg-indigo-50 rounded-lg transition-colors" title="Editar">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title={tipo.activo ? "Desactivar" : "Activar"}>
                          <Power size={16} className={tipo.activo ? "" : "text-red-400"} />
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

      {/* =========================================================================
          MODAL: NUEVO TIPO DE PROYECTO
          ========================================================================= */}
      <AnimatePresence>
        {modalNuevoTipo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setModalNuevoTipo(false)}
            />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10"
            >
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">Agregar Tipo de Proyecto</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Esta plantilla estará disponible para las MYPEs al crear ofertas.</p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Código Único (Sin espacios)</label>
                  <input type="text" placeholder="Ej: APP_MOVIL_ECO" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Nombre Descriptivo</label>
                  <input type="text" placeholder="Ej: Aplicación Móvil E-commerce" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Rama TI</label>
                    <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors">
                      <option>WEB</option>
                      <option>MOVIL</option>
                      <option>BD</option>
                      <option>REDES</option>
                      <option>UX</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Ciclo Mínimo</label>
                    <input type="number" min="1" max="10" placeholder="7" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors" />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button onClick={() => setModalNuevoTipo(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
                  Cancelar
                </button>
                <button className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">
                  Guardar Tipo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}