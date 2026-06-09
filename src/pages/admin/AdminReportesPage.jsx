import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Star, 
  BarChart, 
  Search,
  CalendarDays,
  Loader2,
  ChevronDown,
  Check,
  X,
  ArrowRightLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminReportes } from '@/features/admin/useAdminReportes';

const formatFecha = (fechaString) => {
  if (!fechaString) return "";
  try {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' });
  } catch (e) {
    return fechaString;
  }
};

const filtrarPorPeriodo = (fechaString, periodo) => {
  if (periodo === 'all') return true;
  if (!fechaString) return false;
  const fechaEval = new Date(fechaString);
  const ahora = new Date();
  const diff = ahora - fechaEval;
  const dias = diff / (1000 * 60 * 60 * 24);
  if (periodo === 'month') return dias <= 30;
  if (periodo === '3months') return dias <= 90;
  if (periodo === '6months') return dias <= 180;
  return true;
};

export default function AdminReportesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [tipoFilter, setTipoFilter] = useState('all'); // 'all', 'MYPE a Estudiante', 'Estudiante a MYPE'
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [isTipoOpen, setIsTipoOpen] = useState(false);

  const { 
    reportes, 
    promedioGeneral, 
    promedioMypeAEstudiante, 
    promedioEstudianteAMype, 
    totalCalificaciones, 
    isLoading 
  } = useAdminReportes();

  const filteredReportes = reportes.filter(rep => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      rep.proyecto.toLowerCase().includes(term) ||
      rep.calificador.toLowerCase().includes(term) ||
      rep.calificado.toLowerCase().includes(term);
    const matchesPeriod = filtrarPorPeriodo(rep.fecha, periodFilter);
    const matchesTipo = tipoFilter === 'all' || rep.tipo === tipoFilter;
    return matchesSearch && matchesPeriod && matchesTipo;
  });

  const resetFiltros = () => {
    setSearchTerm('');
    setPeriodFilter('all');
    setTipoFilter('all');
  };

  const tieneFiltrosActivos = searchTerm !== '' || periodFilter !== 'all' || tipoFilter !== 'all';

  const exportarExcelHTML = () => {
    if (filteredReportes.length === 0) return;
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8"/><style>
        table { border-collapse: collapse; font-family: 'Segoe UI', Arial, sans-serif; font-size: 10pt; }
        th { background-color: #4f46e5; color: #ffffff; font-weight: bold; border: 1px solid #d1d5db; padding: 10px; text-align: center; }
        td { border: 1px solid #e5e7eb; padding: 8px; }
        .id-col { font-family: monospace; font-weight: bold; background-color: #f3f4f6; text-align: center; }
        .rating { color: #d97706; font-weight: bold; text-align: center; }
      </style></head>
      <body><table>
        <thead><tr><th>ID</th><th>Fecha</th><th>Proyecto</th><th>Calificador</th><th>Calificado</th><th>Tipo</th><th>Puntuación</th></tr></thead>
        <tbody>
          ${filteredReportes.map(rep => `
            <tr>
              <td class="id-col">${rep.id}</td>
              <td>${formatFecha(rep.fecha)}</td>
              <td>${rep.proyecto}</td>
              <td>${rep.calificador}</td>
              <td>${rep.calificado}</td>
              <td>${rep.tipo}</td>
              <td class="rating">${rep.puntuacion} / 5</td>
            </tr>
          `).join('')}
        </tbody>
      </table></body></html>
    `;
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reporte_calificaciones_${new Date().toISOString().slice(0,10)}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="animate-spin text-primary" size={40} />
      <p className="text-slate-500 font-medium">Cargando evaluaciones...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1 flex items-center gap-3">
            <BarChart className="text-primary" size={32} />
            Evaluaciones y Calificaciones
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Calificaciones entre MYPEs y estudiantes en proyectos completados.
          </p>
        </div>
        <button onClick={exportarExcelHTML} disabled={filteredReportes.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-md disabled:opacity-50">
          <FileSpreadsheet size={18} />
          Exportar a Excel
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard icon={<Star size={24} fill="currentColor" />} color="amber" label="Promedio General" value={promedioGeneral.toFixed(1)} suffix="/ 5.0" />
        <KpiCard icon={<ArrowRightLeft size={24} />} color="blue" label="Promedio MYPE → Estudiante" value={promedioMypeAEstudiante.toFixed(1)} suffix="/ 5.0" />
        <KpiCard icon={<ArrowRightLeft size={24} />} color="purple" label="Promedio Estudiante → MYPE" value={promedioEstudianteAMype.toFixed(1)} suffix="/ 5.0" />
        <KpiCard icon={<BarChart size={24} />} color="emerald" label="Total Evaluaciones" value={totalCalificaciones} suffix="" />
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 z-20 relative">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Buscar proyecto, calificador o calificado..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <div className="flex gap-2">
          {/* Filtro por tipo */}
          <div className="relative">
            <button onClick={() => setIsTipoOpen(!isTipoOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-bold transition ${
                tipoFilter !== 'all' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
              <ArrowRightLeft size={16} />
              {tipoFilter === 'all' ? 'Todos' : tipoFilter}
              <ChevronDown size={14} className={`transition ${isTipoOpen ? 'rotate-180' : ''}`} />
            </button>
            {isTipoOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border rounded-2xl shadow-xl z-20 p-2" onClick={() => setIsTipoOpen(false)}>
                {['all', 'MYPE a Estudiante', 'Estudiante a MYPE'].map(t => (
                  <button key={t} onClick={() => { setTipoFilter(t); setIsTipoOpen(false); }}
                    className={`flex items-center justify-between w-full px-3 py-2 text-xs font-semibold rounded-lg ${
                      tipoFilter === t ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                    }`}>
                    {t === 'all' ? 'Todos' : t} {tipoFilter === t && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filtro por período (igual que antes) */}
          <div className="relative">
            <button onClick={() => setIsPeriodOpen(!isPeriodOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-bold transition ${
                periodFilter !== 'all' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
              <CalendarDays size={16} />
              {periodFilter === 'all' ? 'Periodo' : periodFilter === 'month' ? 'Este mes' : periodFilter === '3months' ? '3 meses' : '6 meses'}
              <ChevronDown size={14} className={`transition ${isPeriodOpen ? 'rotate-180' : ''}`} />
            </button>
            {isPeriodOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-2xl shadow-xl z-20 p-2" onClick={() => setIsPeriodOpen(false)}>
                {[{id:'all',label:'Cualquier fecha'},{id:'month',label:'Este mes'},{id:'3months',label:'Últimos 3 meses'},{id:'6months',label:'Últimos 6 meses'}].map(o => (
                  <button key={o.id} onClick={() => { setPeriodFilter(o.id); setIsPeriodOpen(false); }}
                    className={`flex items-center justify-between w-full px-3 py-2 text-xs font-semibold rounded-lg ${
                      periodFilter === o.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                    }`}>
                    {o.label} {periodFilter === o.id && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {tieneFiltrosActivos && (
            <button onClick={resetFiltros} className="p-2.5 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">ID / Fecha</th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Proyecto</th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Calificador → Calificado</th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Puntuación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReportes.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-xs font-extrabold text-slate-900 font-mono">{rep.id}</p>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">{formatFecha(rep.fecha)}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{rep.proyecto}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        rep.tipo.startsWith('MYPE') ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {rep.tipo}
                      </span>
                      <span className="font-semibold text-slate-800">{rep.calificador}</span>
                      <span className="text-slate-400">→</span>
                      <span className="font-semibold text-slate-800">{rep.calificado}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < rep.puntuacion ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                      ))}
                      <span className="text-xs font-extrabold text-slate-500 ml-1">{rep.puntuacion}/5</span>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReportes.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    <BarChart size={32} className="mx-auto mb-3 text-slate-300" />
                    <p className="text-sm font-bold text-slate-700">No se encontraron evaluaciones</p>
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

// Componente auxiliar para KPI
function KpiCard({ icon, color, label, value, suffix }) {
  const colorClasses = {
    amber: 'bg-amber-50 text-amber-500',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-800">{value} <span className="text-sm text-slate-400 font-bold">{suffix}</span></p>
      </div>
    </div>
  );
}