import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  History, 
  ArrowRight, 
  Download,
  CalendarDays,
  FileText,
  Loader2,
  AlertTriangle,
  ChevronDown,
  Check,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminAuditoria } from '@/features/admin/useAdminAuditoria';

const getEstadoBadge = (estado) => {
  const styles = {
    BORRADOR: "bg-slate-100 text-slate-600 border-slate-200",
    PENDIENTE: "bg-amber-50 text-amber-700 border-amber-200",
    EN_DESARROLLO: "bg-blue-50 text-blue-700 border-blue-200",
    EN_REVISION: "bg-purple-50 text-purple-700 border-purple-200",
    PENDIENTE_REVISION: "bg-purple-50 text-purple-700 border-purple-200",
    COMPLETADO: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider whitespace-nowrap ${styles[estado] || styles.BORRADOR}`}>
      {estado.replace('_', ' ')}
    </span>
  );
};

const formatFecha = (fechaString) => {
  if (!fechaString) return "";
  try {
    const fecha = new Date(fechaString);
    return fecha.toLocaleString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return fechaString;
  }
};

const filtrarPorFecha = (fechaString, rango) => {
  if (rango === 'all') return true;
  if (!fechaString) return false;
  
  const fechaLog = new Date(fechaString);
  const ahora = new Date();
  const diferenciaMs = ahora.getTime() - fechaLog.getTime();
  const unDiaMs = 24 * 60 * 60 * 1000;
  
  if (rango === 'today') {
    return fechaLog.toDateString() === ahora.toDateString();
  }
  if (rango === 'week') {
    return diferenciaMs <= unDiaMs * 7;
  }
  if (rango === 'month') {
    return diferenciaMs <= unDiaMs * 30;
  }
  return true;
};

const ESTADO_LABELS = {
  BORRADOR: "Borrador",
  PENDIENTE: "Pendiente",
  EN_DESARROLLO: "En Desarrollo",
  EN_REVISION: "En Revisión",
  PENDIENTE_REVISION: "Pendiente Revisión",
  COMPLETADO: "Completado",
  NUEVO: "Nuevo"
};

const getEstadoLabel = (estado) => {
  return ESTADO_LABELS[estado] || estado?.replace('_', ' ') || "";
};

export default function AdminAuditoriaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { logs, isLoading, isError, error } = useAdminAuditoria();

  // Filtrado avanzado
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.proyecto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesRole = roleFilter === 'all' || log.rolActor === roleFilter;
    const matchesStatus = statusFilter === 'all' || log.estadoNuevo === statusFilter;
    const matchesDate = filtrarPorFecha(log.fecha, dateRange);
    
    return matchesSearch && matchesRole && matchesStatus && matchesDate;
  });

  const resetFiltros = () => {
    setSearchTerm('');
    setDateRange('all');
    setRoleFilter('all');
    setStatusFilter('all');
  };

  const tieneFiltrosActivos = searchTerm !== '' || dateRange !== 'all' || roleFilter !== 'all' || statusFilter !== 'all';

  const exportarExcelHTML = () => {
    const logsAExportar = filteredLogs;
    if (logsAExportar.length === 0) return;

    const tableHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:Name>Auditoría de Workflow</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; font-family: 'Segoe UI', Arial, sans-serif; font-size: 10pt; }
        th { background-color: #4f46e5; color: #ffffff; font-weight: bold; border: 1px solid #d1d5db; padding: 10px; text-align: center; }
        td { border: 1px solid #e5e7eb; padding: 8px; vertical-align: middle; }
        .text-center { text-align: center; }
        .id-col { font-family: monospace; font-weight: bold; background-color: #f3f4f6; text-align: center; }
      </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              <th>ID de Log</th>
              <th>Fecha y Hora</th>
              <th>Proyecto</th>
              <th>Actor</th>
              <th>Rol</th>
              <th>Estado Anterior</th>
              <th>Estado Nuevo</th>
              <th>Comentario / Detalle</th>
            </tr>
          </thead>
          <tbody>
            ${logsAExportar.map(log => `
              <tr>
                <td class="id-col">${log.id}</td>
                <td class="text-center">${formatFecha(log.fecha)}</td>
                <td>${log.proyecto}</td>
                <td>${log.actor}</td>
                <td class="text-center">${log.rolActor}</td>
                <td class="text-center">${getEstadoLabel(log.estadoAnterior)}</td>
                <td class="text-center">${getEstadoLabel(log.estadoNuevo)}</td>
                <td>${log.comentario || ""}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `reporte_auditoria_workflow_${new Date().toISOString().slice(0,10)}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-slate-500 font-medium">Cargando registros de auditoría...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 max-w-md mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-2">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Error al cargar la auditoría</h3>
        <p className="text-sm text-slate-500">
          {error?.message || "No se pudo establecer conexión con el servidor."}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

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
        <button 
          onClick={exportarExcelHTML}
          disabled={filteredLogs.length === 0}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} />
          Exportar Logs (Excel)
        </button>
      </div>

      {/* ── TOOLBAR (Búsqueda y Filtros) ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 z-20 relative">
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
        
        <div className="flex gap-2 relative">
          {/* BOTÓN FECHAS */}
          <div className="relative">
            <button 
              onClick={() => { setIsDateOpen(!isDateOpen); setIsFilterOpen(false); }}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-bold transition-all shadow-sm ${
                dateRange !== 'all' 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100' 
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <CalendarDays size={16} />
              <span>
                {dateRange === 'all' && "Fechas"}
                {dateRange === 'today' && "Hoy"}
                {dateRange === 'week' && "Últimos 7 días"}
                {dateRange === 'month' && "Últimos 30 días"}
              </span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isDateOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDateOpen && (
              <div key="date-container">
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsDateOpen(false)} 
                />
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 p-2 space-y-1"
                >
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 py-1.5">Rango de tiempo</p>
                  {[
                    { id: 'all', label: 'Cualquier fecha' },
                    { id: 'today', label: 'Hoy' },
                    { id: 'week', label: 'Últimos 7 días' },
                    { id: 'month', label: 'Últimos 30 días' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => { setDateRange(option.id); setIsDateOpen(false); }}
                      className={`flex items-center justify-between w-full px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors ${
                        dateRange === option.id 
                          ? 'bg-indigo-50 text-indigo-700' 
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{option.label}</span>
                      {dateRange === option.id && <Check size={14} className="text-indigo-600" />}
                    </button>
                  ))}
                </motion.div>
              </div>
            )}
          </div>

          {/* BOTÓN FILTROS */}
          <div className="relative">
            <button 
              onClick={() => { setIsFilterOpen(!isFilterOpen); setIsDateOpen(false); }}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-bold transition-all shadow-sm ${
                roleFilter !== 'all' || statusFilter !== 'all'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100' 
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Filter size={16} />
              <span>Filtros</span>
              {(roleFilter !== 'all' || statusFilter !== 'all') && (
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              )}
              <ChevronDown size={14} className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* DROPDOWN FILTROS */}
            {isFilterOpen && (
              <div key="filter-container">
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsFilterOpen(false)} 
                />
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 p-4 space-y-4"
                >
                  {/* Filtro de Rol */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Rol del Actor</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'all', label: 'Todos' },
                        { id: 'ADMIN', label: 'Admin' },
                        { id: 'MYPE', label: 'MYPE' },
                        { id: 'ESTUDIANTE', label: 'Estudiante' }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setRoleFilter(opt.id)}
                          className={`px-2 py-1.5 text-center text-xs font-semibold rounded-lg border transition-all ${
                            roleFilter === opt.id
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                              : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100/80'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filtro de Estado Nuevo */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Nuevo Estado</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'all', label: 'Todos' },
                        { id: 'BORRADOR', label: 'Borrador' },
                        { id: 'PENDIENTE', label: 'Pendiente' },
                        { id: 'EN_DESARROLLO', label: 'En Desarrollo' },
                        { id: 'EN_REVISION', label: 'En Revisión' },
                        { id: 'COMPLETADO', label: 'Completado' }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setStatusFilter(opt.id)}
                          className={`px-2 py-1.5 text-center text-xs font-semibold rounded-lg border transition-all ${
                            statusFilter === opt.id
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                              : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100/80'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                    <button 
                      onClick={() => { setRoleFilter('all'); setStatusFilter('all'); }}
                      className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Restablecer
                    </button>
                    <button 
                      onClick={() => setIsFilterOpen(false)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </div>

          {/* BOTÓN LIMPIAR FILTROS (Solo si hay filtros activos) */}
          {tieneFiltrosActivos && (
            <button
              onClick={resetFiltros}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-slate-400 hover:text-red-500 rounded-xl text-sm font-semibold transition-all hover:bg-red-50"
              title="Limpiar todos los filtros"
            >
              <X size={16} />
              <span className="hidden md:inline">Limpiar</span>
            </button>
          )}
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
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">{formatFecha(log.fecha)}</p>
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