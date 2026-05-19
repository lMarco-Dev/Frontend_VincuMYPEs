import React, { useState } from 'react';
import { useAdminProyectos } from '@features/admin/useAdminProyectos';
import { Loader2 } from 'lucide-react';
import { 
  Search, 
  Filter, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Users, 
  Building2, 
  ArrowRightLeft,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getEstadoBadge = (estado) => {
  const styles = {
    BORRADOR: "bg-slate-100 text-slate-600 border-slate-200",
    PENDIENTE: "bg-amber-50 text-amber-700 border-amber-200",
    EN_DESARROLLO: "bg-blue-50 text-blue-700 border-blue-200",
    COMPLETADO: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${styles[estado] || styles.BORRADOR}`}>
      {estado.replace('_', ' ')}
    </span>
  );
};

// =========================================================================
// COMPONENTE PRINCIPAL
// =========================================================================
export default function AdminProyectosPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const { proyectos, isLoading, cederGestion, auditarAbandono, isAuditando } = useAdminProyectos();
  
  // Estados para Modales
  const [modalPostulantes, setModalPostulantes] = useState({ isOpen: false, proyecto: null });
  const [modalAuditoria, setModalAuditoria] = useState({ isOpen: false, proyecto: null });

  // Filtrado
  const filteredProyectos = proyectos?.filter(p => 
    p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.mypeNombre && p.mypeNombre.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleCederGestion = (proyectoId) => {
    if(window.confirm("¿Estás seguro de ceder la gestión a la MYPE?")) {
      cederGestion(proyectoId);
    }
  };

  const handleConfirmarAuditoria = () => {
    auditarAbandono({ 
      proyectoId: modalAuditoria.proyecto.id, 
      postulacionId: 1 // TODO: Ajustar con el ID real del postulante cuando se expanda el MVP
    });
    setModalAuditoria({ isOpen: false, proyecto: null });
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
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">Control de Proyectos</h1>
          <p className="text-sm text-slate-500 font-medium">
            Audita las ofertas, clasifica estudiantes y gestiona reaperturas dinámicas.
          </p>
        </div>
      </div>

      {/* ── TOOLBAR (Búsqueda y Filtros) ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar por título u organización..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors">
          <Filter size={16} />
          Filtros
        </button>
      </div>

      {/* ── TABLA DE PROYECTOS ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Proyecto / MYPE</th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Cupos</th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProyectos.map((proyecto) => (
                <tr key={proyecto.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900 mb-0.5">{proyecto.titulo}</p>
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Building2 size={12} /> {proyecto.mypeNombre}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {getEstadoBadge(proyecto.estado)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-slate-400" />
                      <span className="text-sm font-bold text-slate-700">
                        {proyecto.cuposAceptados} <span className="text-slate-400 font-medium">/ {proyecto.cuposTotales}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      
                      {proyecto.estado === 'PENDIENTE' && (
  <>
    <button 
      onClick={() => setModalPostulantes({ isOpen: true, proyecto })}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-primary border border-indigo-100 rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-colors"
    >
      <Eye size={14} /> Revisar
    </button>

    {/* ✨ NUEVA LÓGICA: Si ya se cedió, mostramos un texto. Si no, mostramos el botón */}
    {proyecto.delegarGestionAdmin ? (
      <span 
        className="px-2 py-1.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-lg border border-slate-200 flex items-center"
        title="La MYPE se está encargando de aceptar postulantes"
      >
        Gestión Cedida
      </span>
    ) : (
      <button 
        onClick={() => handleCederGestion(proyecto.id)}
        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200"
        title="Ceder gestión de postulantes a la MYPE"
      >
        <ArrowRightLeft size={16} />
      </button>
    )}
  </>
)}
                      
                      {proyecto.estado === 'EN_DESARROLLO' && (
                        <button 
                          onClick={() => setModalAuditoria({ isOpen: true, proyecto })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-colors"
                        >
                          <AlertTriangle size={14} /> Auditar / Liberar
                        </button>
                      )}

                      {proyecto.estado === 'COMPLETADO' && (
                        <span className="text-xs font-bold text-slate-400 px-3 py-1.5">Sin acciones</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProyectos.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    No se encontraron proyectos en el sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: REVISIÓN DE POSTULANTES (Pendiente conectar con backend)
          ========================================================================= */}
      <AnimatePresence>
        {modalPostulantes.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setModalPostulantes({ isOpen: false, proyecto: null })}
            />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Postulantes en Espera</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Proyecto: {modalPostulantes.proyecto?.titulo}</p>
                </div>
                <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg flex items-center gap-2 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Vacantes libres:</span>
                  <span className="text-sm font-extrabold text-primary">
                    {modalPostulantes.proyecto?.cuposTotales - modalPostulantes.proyecto?.cuposAceptados}
                  </span>
                </div>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-center">
                  {/* Para conectar los postulantes, necesitaremos otro endpoint específico o traerlos en el DTO */}
                  <p className="text-slate-500 text-sm">Próximamente: Lista dinámica de postulantes desde el backend.</p>
              </div>
              
              <div className="p-4 border-t border-slate-100 flex justify-end">
                <button onClick={() => setModalPostulantes({ isOpen: false, proyecto: null })} className="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 2: REAPERTURA DINÁMICA (Auditoría y Liberación)
          ========================================================================= */}
      <AnimatePresence>
        {modalAuditoria.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setModalAuditoria({ isOpen: false, proyecto: null })}
            />
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Auditoría de Abandono</h3>
                <p className="text-sm text-slate-500 font-medium mb-6">
                  Estás a punto de expulsar a un estudiante del proyecto <strong className="text-slate-800">"{modalAuditoria.proyecto?.titulo}"</strong> reportado por la MYPE.
                </p>
                
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-3 mb-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Flujo de Reapertura Dinámica:</h4>
                  <ul className="text-sm text-slate-600 font-medium space-y-2">
                    <li className="flex items-start gap-2">
                      <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                      El estudiante actual será marcado como CANCELADO.
                    </li>
                    <li className="flex items-start gap-2">
                      <RefreshCw size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      El proyecto retrocederá al estado PENDIENTE en la bolsa pública.
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      Se notificará automáticamente a los postulantes previamente rechazados para que intenten de nuevo.
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setModalAuditoria({ isOpen: false, proyecto: null })}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleConfirmarAuditoria}
                    disabled={isAuditando}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 disabled:opacity-50"
                  >
                    {isAuditando ? 'Procesando...' : 'Confirmar Expulsión'}
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