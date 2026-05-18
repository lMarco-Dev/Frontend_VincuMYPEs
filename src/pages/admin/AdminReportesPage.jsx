import React, { useState } from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  Star, 
  TrendingUp, 
  BarChart, 
  Search,
  CalendarDays,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';

// =========================================================================
// MOCK DATA (Datos de evaluaciones para investigación)
// =========================================================================
const MOCK_REPORTES = [
  {
    id: "REP-001",
    proyecto: "Dashboard de Ventas PVC",
    mype: "Distribuidora del Norte",
    estudiante: "Ana López",
    fechaCierre: "15/05/2026",
    duracionDias: 21,
    calificacionMype: 5,
    comentarioMype: "Excelente trabajo, el dashboard superó nuestras expectativas.",
    estado: "COMPLETADO"
  },
  {
    id: "REP-002",
    proyecto: "Prototipo Interactivo de Delivery",
    mype: "Bodega San Juan",
    estudiante: "Luis Pérez",
    fechaCierre: "10/05/2026",
    duracionDias: 14,
    calificacionMype: 4,
    comentarioMype: "Buen prototipo, cumplió con los tiempos.",
    estado: "COMPLETADO"
  },
  {
    id: "REP-003",
    proyecto: "Catálogo Digital de Productos",
    mype: "Artesanías Cajamarca",
    estudiante: "Carlos Ruiz",
    fechaCierre: "05/05/2026",
    duracionDias: 30,
    calificacionMype: 5,
    comentarioMype: "Muy proactivo y con excelentes habilidades técnicas.",
    estado: "COMPLETADO"
  }
];

export default function AdminReportesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReportes = MOCK_REPORTES.filter(rep => 
    rep.proyecto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rep.mype.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20">
            <FileSpreadsheet size={18} />
            Exportar a Excel
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
            <p className="text-2xl font-black text-slate-800">4.6 <span className="text-sm text-slate-400 font-bold">/ 5.0</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">Tiempo Promedio</p>
            <p className="text-2xl font-black text-slate-800">21 <span className="text-sm text-slate-400 font-bold">días / proyecto</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Target size={24} />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">Tasa de Éxito</p>
            <p className="text-2xl font-black text-slate-800">92% <span className="text-sm text-slate-400 font-bold">completados</span></p>
          </div>
        </div>
      </div>

      {/* ── TOOLBAR ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar por proyecto o MYPE..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors">
          <CalendarDays size={16} />
          Filtrar Periodo
        </button>
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
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">{rep.fechaCierre}</p>
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
                        <Star key={i} size={14} className={i < rep.calificacionMype ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 italic truncate max-w-[200px]" title={rep.comentarioMype}>
                      "{rep.comentarioMype}"
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-primary bg-indigo-50 hover:bg-primary hover:text-white rounded-lg transition-colors" title="Descargar detalle CSV">
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}