import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  History, 
  ArrowRight, 
  Download,
  CalendarDays,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

// =========================================================================
// MOCK DATA (Historial de transiciones de estado)
// =========================================================================
const MOCK_LOGS = [
  {
    id: "LOG-001",
    proyecto: "SaaS de Transporte Interprovincial",
    actor: "MYPElink Admin (Enzo)",
    rolActor: "ADMIN",
    estadoAnterior: "PENDIENTE",
    estadoNuevo: "EN_DESARROLLO",
    fecha: "2026-05-18 10:30 AM",
    comentario: "Convocatoria cerrada automáticamente. Cupos llenos al aceptar postulación."
  },
  {
    id: "LOG-002",
    proyecto: "Dashboard de Ventas PVC",
    actor: "Distribuidora del Norte",
    rolActor: "MYPE",
    estadoAnterior: "BORRADOR",
    estadoNuevo: "PENDIENTE",
    fecha: "2026-05-17 04:15 PM",
    comentario: "Proyecto publicado en la bolsa pública de ofertas."
  },
  {
    id: "LOG-003",
    proyecto: "Prototipo Interactivo de Delivery",
    actor: "MYPElink Admin (Jhon)",
    rolActor: "ADMIN",
    estadoAnterior: "EN_DESARROLLO",
    estadoNuevo: "PENDIENTE",
    fecha: "2026-05-16 09:00 AM",
    comentario: "Abandono reportado. Estudiante expulsado y cupo liberado."
  },
  {
    id: "LOG-004",
    proyecto: "Sistema de Gestión Microservicios",
    actor: "Agroveterinaria El Norteño",
    rolActor: "MYPE",
    estadoAnterior: "PENDIENTE_REVISION",
    estadoNuevo: "COMPLETADO",
    fecha: "2026-05-15 02:45 PM",
    comentario: "Entregables aprobados por la MYPE. Fin del proyecto."
  }
];

const getEstadoBadge = (estado) => {
  const styles = {
    BORRADOR: "bg-slate-100 text-slate-600 border-slate-200",
    PENDIENTE: "bg-amber-50 text-amber-700 border-amber-200",
    EN_DESARROLLO: "bg-blue-50 text-blue-700 border-blue-200",
    PENDIENTE_REVISION: "bg-purple-50 text-purple-700 border-purple-200",
    COMPLETADO: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider whitespace-nowrap ${styles[estado] || styles.BORRADOR}`}>
      {estado.replace('_', ' ')}
    </span>
  );
};

export default function AdminAuditoriaPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrado básico
  const filteredLogs = MOCK_LOGS.filter(log => 
    log.proyecto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.actor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1 flex items-center gap-3">
            <History className="text-primary" size={32} />
            Auditoría de Workflow
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Registro inmutable de transiciones de estado, acciones de usuarios y resoluciones del sistema.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-colors shadow-sm">
          <Download size={16} />
          Exportar Logs (CSV)
        </button>
      </div>

      {/* ── TOOLBAR (Búsqueda y Filtros) ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar por proyecto, usuario o ID de log..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors">
            <CalendarDays size={16} />
            Fechas
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors">
            <Filter size={16} />
            Filtros
          </button>
        </div>
      </div>

      {/* ── TABLA DE LOGS ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">ID / Fecha</th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Actor</th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Transición de Estado</th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Detalle / Comentario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-xs font-extrabold text-slate-900 font-mono">{log.id}</p>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">{log.fecha}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{log.actor}</p>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Rol: {log.rolActor}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getEstadoBadge(log.estadoAnterior)}
                      <ArrowRight size={14} className="text-slate-300 shrink-0" />
                      {getEstadoBadge(log.estadoNuevo)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-slate-800 mb-1">{log.proyecto}</p>
                    <div className="flex items-start gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <FileText size={12} className="text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-slate-600 font-medium italic leading-relaxed">"{log.comentario}"</p>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    <History size={32} className="mx-auto mb-3 text-slate-300" />
                    <p className="text-sm font-bold text-slate-700">No se encontraron registros</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}