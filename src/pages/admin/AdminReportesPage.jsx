import React, { useState } from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  Star, 
  TrendingUp, 
  BarChart, 
  Search,
  CalendarDays,
  Target,
  Loader2,
  ChevronDown,
  Check,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminReportes } from '@/features/admin/useAdminReportes';

const formatFecha = (fechaString) => {
  if (!fechaString) return "";
  try {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (e) {
    return fechaString;
}
};

const filtrarPorPeriodo = (fechaString, periodo) => {
  if (periodo === 'all') return true;
  if (!fechaString) return false;
  
  const fechaEval = new Date(fechaString);
  const ahora = new Date();
  const diferenciaMs = ahora.getTime() - fechaEval.getTime();
  const unDiaMs = 24 * 60 * 60 * 1000;
  
  if (periodo === 'month') {
    return diferenciaMs <= unDiaMs * 30;
  }
  if (periodo === '3months') {
    return diferenciaMs <= unDiaMs * 90;
  }
  if (periodo === '6months') {
    return diferenciaMs <= unDiaMs * 180;
  }
  return true;
};

export default function AdminReportesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);

  const { 
    reportes, 
    satisfaccionPromedio, 
    tiempoPromedio, 
    tasaExito, 
    isLoading 
  } = useAdminReportes();

  const filteredReportes = reportes.filter(rep => {
    const matchesSearch = 
      rep.proyecto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.mype.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.estudiante.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesPeriod = filtrarPorPeriodo(rep.fechaCierre, periodFilter);
    
    return matchesSearch && matchesPeriod;
  });

  const resetFiltros = () => {
    setSearchTerm('');
    setPeriodFilter('all');
  };

  const tieneFiltrosActivos = searchTerm !== '' || periodFilter !== 'all';

  const exportarExcelHTML = () => {
    const reportesAExportar = filteredReportes;
    if (reportesAExportar.length === 0) return;

    const tableHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:Name>Evaluaciones MYPEs</x:Name>
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
        .rating { color: #d97706; font-weight: bold; text-align: center; }
      </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              <th>ID de Reporte</th>
              <th>Fecha Cierre</th>
              <th>Proyecto</th>
              <th>MYPE</th>
              <th>Estudiante</th>
              <th>Duración (días)</th>
              <th>Calificación</th>
              <th>Comentarios de la MYPE</th>
            </tr>
          </thead>
          <tbody>
            ${reportesAExportar.map(rep => `
              <tr>
                <td class="id-col">${rep.id}</td>
                <td class="text-center">${formatFecha(rep.fechaCierre)}</td>
                <td>${rep.proyecto}</td>
                <td>${rep.mype}</td>
                <td>${rep.estudiante}</td>
                <td class="text-center">${rep.duracionDias}</td>
                <td class="rating">${rep.calificacionMype} / 5.0</td>
                <td>${rep.comentarioMype || "Sin observaciones"}</td>
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
    link.setAttribute("download", `reporte_evaluaciones_mypes_${new Date().toISOString().slice(0,10)}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-slate-500 font-medium">Cargando evaluaciones y KPIs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1 flex items-center gap-3">
            <BarChart className="text-primary" size={32} />
            Evaluaciones y Reportes
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Extracción de datos (Data Export) para medición de impacto y análisis estadístico.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportarExcelHTML}
            disabled={filteredReportes.length === 0}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet size={18} />
            Exportar a Excel (CSV)
          </button>
        </div>
      </div>

      {/* ── KPIs DE INVESTIGACIÓN (Bento Grid) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <Star size={24} fill="currentColor" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">Satisfacción Promedio</p>
            <p className="text-2xl font-black text-slate-800">{satisfaccionPromedio} <span className="text-sm text-slate-400 font-bold">/ 5.0</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">Tiempo Promedio</p>
            <p className="text-2xl font-black text-slate-800">{tiempoPromedio} <span className="text-sm text-slate-400 font-bold">días / proyecto</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Target size={24} />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">Tasa de Éxito</p>
            <p className="text-2xl font-black text-slate-800">{tasaExito}% <span className="text-sm text-slate-400 font-bold">completados</span></p>
          </div>
        </div>
      </div>

      {/* ── TOOLBAR ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 z-20 relative">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar por proyecto, MYPE o estudiante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        
        <div className="flex gap-2 relative">
          {/* BOTÓN FILTRAR PERIODO */}
          <div className="relative">
            <button 
              onClick={() => setIsPeriodOpen(!isPeriodOpen)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-bold transition-all shadow-sm ${
                periodFilter !== 'all' 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100' 
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <CalendarDays size={16} />
              <span>
                {periodFilter === 'all' && "Filtrar Periodo"}
                {periodFilter === 'month' && "Este mes"}
                {periodFilter === '3months' && "Últimos 3 meses"}
                {periodFilter === '6months' && "Últimos 6 meses"}
              </span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isPeriodOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* DROPDOWN PERIODO */}
            {isPeriodOpen && (
              <div key="period-container">
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsPeriodOpen(false)} 
                />
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 p-2 space-y-1"
                >
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 py-1.5">Periodo de cierre</p>
                  {[
                    { id: 'all', label: 'Cualquier fecha' },
                    { id: 'month', label: 'Este mes' },
                    { id: '3months', label: 'Últimos 3 meses' },
                    { id: '6months', label: 'Últimos 6 meses' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => { setPeriodFilter(option.id); setIsPeriodOpen(false); }}
                      className={`flex items-center justify-between w-full px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors ${
                        periodFilter === option.id 
                          ? 'bg-indigo-50 text-indigo-700' 
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{option.label}</span>
                      {periodFilter === option.id && <Check size={14} className="text-indigo-600" />}
                    </button>
                  ))}
                </motion.div>
              </div>
            )}
          </div>

          {/* BOTÓN LIMPIAR FILTROS */}
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

      {/* ── TABLA DE DATOS CRUDOS ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">ID / Fecha</th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Proyecto y Actores</th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Duración</th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Calificación MYPE</th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReportes.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-xs font-extrabold text-slate-900 font-mono">{rep.id}</p>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">{formatFecha(rep.fechaCierre)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900 mb-1">{rep.proyecto}</p>
                    <div className="text-[11px] font-medium text-slate-500 space-y-0.5">
                      <p>🏭 <span className="font-bold text-slate-700">{rep.mype}</span></p>
                      <p>🎓 <span className="font-bold text-slate-700">{rep.estudiante}</span></p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg">
                      {rep.duracionDias} días
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < Math.round(rep.calificacionMype) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                      ))}
                      <span className="text-xs font-extrabold text-slate-500 ml-1">({rep.calificacionMype})</span>
                    </div>
                    <p className="text-[10px] text-slate-500 italic truncate max-w-[200px]" title={rep.comentarioMype}>
                      "{rep.comentarioMype || 'Sin observaciones'}"
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => {
                        // Descargar detalle de evaluación individual como ficha estilizada en Excel
                        const tableHtml = `
                          <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                          <head>
                            <meta charset="utf-8" />
                            <!--[if gte mso 9]>
                            <xml>
                              <x:ExcelWorkbook>
                                <x:ExcelWorksheets>
                                  <x:Name>Detalle Evaluación</x:Name>
                                  <x:WorksheetOptions>
                                    <x:DisplayGridlines/>
                                  </x:WorksheetOptions>
                                </x:ExcelWorksheet>
                              </x:ExcelWorksheets>
                            </x:ExcelWorkbook>
                          </xml>
                          <![endif]-->
                          <style>
                            table { border-collapse: collapse; font-family: 'Segoe UI', Arial, sans-serif; font-size: 10pt; width: 450px; }
                            th { background-color: #4f46e5; color: #ffffff; font-weight: bold; border: 1px solid #d1d5db; padding: 10px; text-align: left; }
                            td { border: 1px solid #e5e7eb; padding: 8px; }
                            .field-col { font-weight: bold; background-color: #f3f4f6; width: 150px; }
                          </style>
                          </head>
                          <body>
                            <table>
                              <thead>
                                <tr>
                                  <th colspan="2">Ficha de Evaluación - ${rep.id}</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td class="field-col">ID de Reporte</td>
                                  <td>${rep.id}</td>
                                </tr>
                                <tr>
                                  <td class="field-col">Fecha Cierre</td>
                                  <td>${formatFecha(rep.fechaCierre)}</td>
                                </tr>
                                <tr>
                                  <td class="field-col">Proyecto</td>
                                  <td>${rep.proyecto}</td>
                                </tr>
                                <tr>
                                  <td class="field-col">MYPE</td>
                                  <td>${rep.mype}</td>
                                </tr>
                                <tr>
                                  <td class="field-col">Estudiante</td>
                                  <td>${rep.estudiante}</td>
                                </tr>
                                <tr>
                                  <td class="field-col">Duración (días)</td>
                                  <td>${rep.duracionDias} días</td>
                                </tr>
                                <tr>
                                  <td class="field-col">Calificación MYPE</td>
                                  <td>${rep.calificacionMype} / 5.0</td>
                                </tr>
                                <tr>
                                  <td class="field-col">Observaciones</td>
                                  <td>${rep.comentarioMype || "Sin observaciones"}</td>
                                </tr>
                              </tbody>
                            </table>
                          </body>
                          </html>
                        `;

                        const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.setAttribute("href", url);
                        link.setAttribute("download", `evaluacion_${rep.id}.xls`);
                        link.style.visibility = 'hidden';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="p-2 text-primary bg-indigo-50 hover:bg-primary hover:text-white rounded-lg transition-colors" 
                      title="Descargar detalle Excel"
                    >
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredReportes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <BarChart size={32} className="mx-auto mb-3 text-slate-300" />
                    <p className="text-sm font-bold text-slate-700">No se encontraron evaluaciones registradas</p>
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