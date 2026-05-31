import React from 'react';
import { 
  Building2, 
  Users, 
  Rocket, 
  Star, 
  History, 
  ArrowRight, 
  TrendingUp, 
  Terminal, 
  BarChart2, 
  Laptop,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminReportes } from "@features/admin/useAdminReportes";

const getStatusStyle = (estado) => {
  switch (estado) {
    case 'COMPLETADO': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'EN_DESARROLLO': return 'bg-blue-50 text-blue-700 border-blue-100';
    case 'PENDIENTE': return 'bg-amber-50 text-amber-700 border-amber-100';
    default: return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

const AdminDashboardPage = () => {
  const { totalMypes, estudiantesActivos, proyectosEnDesarrollo, satisfaccionPromedio, totalEvaluaciones, distribucionAreas, isLoading } = useAdminReportes();
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Encabezado Principal */}
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Panel de Administración</h1>
        <p className="text-base text-slate-500 font-semibold max-w-2xl">
          Monitoreo operativo del ecosistema MYPElink. Control de vinculaciones, flujo de estados y auditoría de la plataforma en Cajamarca.
        </p>
      </div>

      {/* Bento Grid Superior: KPIs Operativos e Indicador de Satisfacción */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: MYPES Registradas */}
        <div className="bg-white border border-outline-variant/60 p-6 rounded-3xl shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Vinculación</span>
            <p className="text-slate-700 text-sm font-bold">MYPEs Registradas</p>
            <p className="text-3xl font-extrabold text-slate-900">{totalMypes}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Building2 size={22} />
          </div>
        </div>

        {/* KPI 2: Estudiantes Activos */}
        <div className="bg-white border border-outline-variant/60 p-6 rounded-3xl shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Inserción</span>
            <p className="text-slate-700 text-sm font-bold">Estudiantes Activos</p>
            <p className="text-3xl font-extrabold text-slate-900">{estudiantesActivos}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Users size={22} />
          </div>
        </div>

        {/* KPI 3: Proyectos en Ejecución */}
        <div className="bg-white border border-outline-variant/60 p-6 rounded-3xl shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Matching</span>
            <p className="text-slate-700 text-sm font-bold">En Desarrollo</p>
            <p className="text-3xl font-extrabold text-slate-900">{proyectosEnDesarrollo}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Rocket size={22} />
          </div>
        </div>

        {/* KPI 4: Satisfacción Global (Inferencia Operativa de la Experiencia) */}
        <div className="bg-white border border-outline-variant/60 p-6 rounded-3xl shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Rendimiento</span>
            <p className="text-slate-700 text-sm font-bold">Satisfacción Global</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-extrabold text-slate-900">{satisfaccionPromedio}</p>
              <span className="text-xs text-slate-400 font-bold">/ 5.0</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full w-fit">
              {totalEvaluaciones} cierres evaluados
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
            <Star size={22} fill="currentColor" />
          </div>
        </div>

      </div>

      {/* Bento Grid Inferior: Distribución por Áreas e Historial de Auditoría */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda (1/3): Distribución por Demandas Tecnológicas */}
        <div className="bg-white border border-outline-variant/60 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Laptop size={20} className="text-primary" />
              Demandas por Área TI
            </h3>
            <p className="text-xs text-slate-400 font-semibold mb-6">Proyectos solicitados según competencias del plan de estudios.</p>
            
            <div className="space-y-4">
              {distribucionAreas.map((item) => (
                <div key={item.area} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{item.label}</span>
                    <span className="text-slate-400">{item.cantidad} ofertas ({item.porcentaje}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${item.porcentaje}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50/50 p-4 rounded-2xl flex items-start gap-3 border border-slate-100">
            <TrendingUp size={18} className="text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              El área de <span className="font-bold text-slate-800">Desarrollo Web</span> concentra el mayor índice de matching temprano esta semana en la región Cajamarca.
            </p>
          </div>
        </div>

        {/* Columna Derecha (2/3): Auditoría en Tiempo Real del Workflow Historial */}
        <div className="lg:col-span-2 bg-white border border-outline-variant/60 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <History size={20} className="text-primary" />
                Auditoría del Workflow Historial
              </h3>
              <span className="text-[10px] font-extrabold text-primary bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Base de Datos Activa
              </span>
            </div>
            <p className="text-xs text-slate-400 font-semibold mb-6">Trazabilidad en tiempo real sobre los cambios de estado de los proyectos y convocatorias.</p>

            <div className="divide-y divide-slate-100 max-h-[320px] overflow-y-auto pr-2 space-y-4">
              <p className="text-sm text-slate-400 text-center py-8">El historial de auditoría se cargará próximamente.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboardPage;