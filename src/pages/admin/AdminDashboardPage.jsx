import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useDashboardStats } from '@features/admin/useDashboardStats';
import { AREA_SISTEMAS_LABELS } from '@entities/proyecto/proyecto.constants';
import {
  Users,
  Building2,
  FolderKanban,
  ClipboardList,
  UserPlus,
  CheckCircle2,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  Award,
  Download,
  PlusCircle,
  ShieldPlus,
} from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// ─── Framer Motion variants ───────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

// ─── CountUp ─────────────────────────────────────────────────────────────────
const CountUp = ({ end, duration = 1400 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    animated.current = false;
    setCount(0);
  }, [end]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const step = (ts, start = null) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            setCount(Math.floor(p * end));
            if (p < 1) requestAnimationFrame((t) => step(t, start));
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

// ─── ProgressBar ─────────────────────────────────────────────────────────────
function ProgressBar({ value, max, colorClass = 'bg-blue-600' }) {
  const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
  return (
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ─── Skeleton block ───────────────────────────────────────────────────────────
const Skel = ({ className }) => (
  <div className={`bg-slate-100 rounded animate-pulse ${className}`} />
);

// ─── Main component ───────────────────────────────────────────────────────────
const AdminDashboardPage = () => {
  const { data, isLoading, isError } = useDashboardStats();

  // Derived values
  const totalUsers =
    (data?.totalEstudiantes ?? 0) + (data?.totalMypes ?? 0) + (data?.totalAdmins ?? 0);
  const totalProjects = (data?.proyectosActivos ?? 0) + (data?.proyectosCompletados ?? 0);
  const completionPct =
    totalProjects > 0
      ? Math.round(((data?.proyectosCompletados ?? 0) / totalProjects) * 100)
      : 0;
  const activePct =
    totalProjects > 0
      ? Math.round(((data?.proyectosActivos ?? 0) / totalProjects) * 100)
      : 0;

  // proyectosPorArea: handles both array [{area,cantidad}] and object {AREA: n}
  const areaArray = (() => {
    if (!data?.proyectosPorArea) return [];
    if (Array.isArray(data.proyectosPorArea)) return data.proyectosPorArea;
    return Object.entries(data.proyectosPorArea).map(([area, cantidad]) => ({ area, cantidad }));
  })();

  const maxArea =
    areaArray.length > 0
      ? areaArray.reduce((a, b) => (b.cantidad > a.cantidad ? b : a))
      : null;
  const minArea =
    areaArray.length > 0
      ? areaArray.reduce((a, b) => (b.cantidad < a.cantidad ? b : a))
      : null;

  // Bar chart config
  const barData = {
    labels: areaArray.map((i) => AREA_SISTEMAS_LABELS[i.area] ?? i.area),
    datasets: [
      {
        label: 'Proyectos',
        data: areaArray.map((i) => i.cantidad),
        backgroundColor: '#1B6FE8',
        borderRadius: 8,
        barPercentage: 0.65,
        categoryPercentage: 0.75,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#94a3b8',
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, precision: 0, color: '#94a3b8', font: { size: 11 } },
        grid: { color: '#f1f5f9' },
      },
      x: {
        ticks: { color: '#94a3b8', font: { size: 11 }, maxRotation: 35, minRotation: 20 },
        grid: { display: false },
      },
    },
  };

  // KPI cards
  const KPIS = [
    {
      label: 'Total usuarios',
      value: totalUsers,
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'MYPEs activas',
      value: data?.totalMypes ?? 0,
      icon: Building2,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
    {
      label: 'Proyectos totales',
      value: totalProjects,
      icon: FolderKanban,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Postulaciones pendientes',
      value: data?.postulacionesPendientes ?? 0,
      icon: ClipboardList,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
  ];

  // Insights
  const INSIGHTS = [
    {
      label: 'Área más activa',
      value: maxArea ? (AREA_SISTEMAS_LABELS[maxArea.area] ?? maxArea.area) : '—',
      sub: maxArea ? `${maxArea.cantidad} proyectos` : 'Sin datos',
      icon: TrendingUp,
      bg: 'bg-blue-50',
      color: 'text-blue-600',
    },
    {
      label: 'Área menos activa',
      value: minArea ? (AREA_SISTEMAS_LABELS[minArea.area] ?? minArea.area) : '—',
      sub: minArea ? `${minArea.cantidad} proyectos` : 'Sin datos',
      icon: TrendingDown,
      bg: 'bg-orange-50',
      color: 'text-orange-500',
    },
    {
      label: 'Postulaciones críticas',
      value: data?.postulacionesPendientes ?? 0,
      sub: 'pendientes de revisión',
      icon: ClipboardList,
      bg: 'bg-amber-50',
      color: 'text-amber-600',
    },
    {
      label: 'Certificados emitidos',
      value: data?.certificadosEmitidos ?? 0,
      sub: 'en la plataforma',
      icon: Award,
      bg: 'bg-emerald-50',
      color: 'text-emerald-600',
    },
  ];

  // Static timeline (no endpoint needed)
  const TIMELINE = [
    {
      dot: 'bg-blue-500',
      icon: UserPlus,
      title: 'Nuevo estudiante registrado',
      desc: 'Carlos Eduardo se unió al programa',
      time: 'hace 2m',
    },
    {
      dot: 'bg-emerald-500',
      icon: CheckCircle2,
      title: 'Proyecto MYPE aprobado',
      desc: '"EcoRetail Solutions" — fase 1 validada',
      time: 'hace 15m',
    },
    {
      dot: 'bg-red-500',
      icon: ShieldAlert,
      title: 'Alerta del sistema',
      desc: 'Intento de acceso no autorizado bloqueado',
      time: 'hace 1h',
    },
  ];

  // Quick actions
  const ACTIONS = [
    { label: 'Crear proyecto', icon: PlusCircle, to: '/admin/proyectos' },
    { label: 'Registrar MYPE', icon: Building2, to: '/admin/usuarios' },
    { label: 'Exportar reporte', icon: Download, to: '/admin/reportes' },
    { label: 'Crear administrador', icon: ShieldPlus, to: '/admin/usuarios' },
  ];

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-slate-400">
          Error al cargar las estadísticas. Intenta recargar la página.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">

      {/* ── Title bar ──────────────────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-50 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
            </span>
            <p className="text-sm text-slate-400">Actualización automática cada minuto</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
          <Download size={15} />
          Exportar reporte
        </button>
      </motion.div>

      {/* ── Row 1: KPI cards ───────────────────────────────────────────────── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {KPIS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              variants={fadeUp}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-2">
                    {kpi.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {isLoading ? (
                      <Skel className="h-8 w-16" />
                    ) : (
                      <CountUp end={kpi.value} />
                    )}
                  </p>
                </div>
                <div className={`p-2.5 rounded-lg shrink-0 ${kpi.iconBg}`}>
                  <Icon size={17} className={kpi.iconColor} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Row 2: Bar chart + Estado proyectos ────────────────────────────── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-12 gap-5"
      >
        {/* Bar chart: col-span-8 */}
        <motion.div
          variants={fadeUp}
          className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Proyectos por área</h2>
          {isLoading ? (
            <Skel className="h-[200px]" />
          ) : (
            <div className="h-[200px]">
              <Bar data={barData} options={barOptions} />
            </div>
          )}
        </motion.div>

        {/* Estado proyectos: col-span-4 */}
        <motion.div
          variants={fadeUp}
          className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col"
        >
          <h2 className="text-sm font-semibold text-slate-700 mb-5">Estado de proyectos</h2>

          {isLoading ? (
            <div className="space-y-4 flex-1">
              <Skel className="h-4" />
              <Skel className="h-4 w-4/5" />
            </div>
          ) : (
            <div className="space-y-5 flex-1">
              {/* Activos */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
                  <span>Activos</span>
                  <span className="text-slate-900 font-bold">{data?.proyectosActivos ?? 0}</span>
                </div>
                <ProgressBar
                  value={data?.proyectosActivos ?? 0}
                  max={totalProjects}
                  colorClass="bg-blue-600"
                />
                <p className="text-[11px] text-slate-400 mt-1">{activePct}% del total</p>
              </div>

              {/* Completados */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
                  <span>Completados</span>
                  <span className="text-slate-900 font-bold">{data?.proyectosCompletados ?? 0}</span>
                </div>
                <ProgressBar
                  value={data?.proyectosCompletados ?? 0}
                  max={totalProjects}
                  colorClass="bg-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">{completionPct}% del total</p>
              </div>
            </div>
          )}

          {/* Badge resumen */}
          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Total registrados</span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">
              {totalProjects} proyectos
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Row 3: Insights ────────────────────────────────────────────────── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {INSIGHTS.map((ins) => {
          const Icon = ins.icon;
          return (
            <motion.div
              key={ins.label}
              variants={fadeUp}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`p-2 rounded-lg ${ins.bg}`}>
                  <Icon size={14} className={ins.color} />
                </div>
                <p className="text-xs text-slate-400 font-medium leading-tight">{ins.label}</p>
              </div>
              <p className="text-lg font-bold text-slate-900 truncate">
                {isLoading ? <Skel className="h-5 w-20" /> : ins.value}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">{ins.sub}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Row 4: Timeline + Acciones rápidas ─────────────────────────────── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-12 gap-5"
      >
        {/* Timeline: col-span-7 */}
        <motion.div
          variants={fadeUp}
          className="col-span-12 lg:col-span-7 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-700">Actividad reciente</h2>
            <button className="text-xs text-blue-600 font-medium hover:underline">
              Ver todo
            </button>
          </div>
          <div className="p-5">
            <div className="relative">
              {/* Vertical connector line */}
              <div className="absolute left-[8px] top-3 bottom-3 w-px bg-slate-100" />

              <div className="space-y-5">
                {TIMELINE.map((item, i) => (
                  <div key={i} className="flex gap-4 relative">
                    {/* Dot */}
                    <div
                      className={`w-[17px] h-[17px] rounded-full shrink-0 mt-0.5 z-10 ring-4 ring-white ${item.dot}`}
                    />
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-slate-800">{item.title}</p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Acciones rápidas: col-span-5 */}
        <motion.div
          variants={fadeUp}
          className="col-span-12 lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Acciones rápidas</h2>
          <div className="space-y-2.5">
            {ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors text-left"
                >
                  <Icon size={15} className="shrink-0" />
                  {action.label}
                </button>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

    </div>
  );
};

export default AdminDashboardPage;
