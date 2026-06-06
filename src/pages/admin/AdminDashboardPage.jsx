import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useDashboardStats } from '@features/admin/useDashboardStats';
import { AREA_SISTEMAS_LABELS } from '@entities/proyecto/proyecto.constants';

const METRIC_CARDS = [
  { key: 'totalEstudiantes', label: 'Total estudiantes' },
  { key: 'totalMypes', label: 'Total MYPEs' },
  { key: 'totalAdmins', label: 'Administradores' },
  { key: 'proyectosActivos', label: 'Proyectos activos' },
  { key: 'proyectosCompletados', label: 'Proyectos completados' },
  { key: 'postulacionesPendientes', label: 'Postulaciones pendientes' },
  { key: 'certificadosEmitidos', label: 'Certificados emitidos' },
  { key: 'promedioCalificacionMypes', label: 'Prom. calificación MYPEs', isStar: true },
  { key: 'promedioCalificacionEstudiantes', label: 'Prom. calificación estudiantes', isStar: true },
];

const PIE_COLORS = ['#1B6FE8', '#10b981'];

function MetricCard({ label, value, isStar, isLoading }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">{label}</p>
      {isLoading ? (
        <div className="h-8 bg-gray-100 rounded animate-pulse w-20" />
      ) : (
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold text-gray-900">
            {isStar ? Number(value ?? 0).toFixed(1) : (value ?? 0)}
          </span>
          {isStar && (
            <>
              <span className="text-yellow-400 text-lg leading-none">★</span>
              <span className="text-xs text-gray-400">/ 5.0</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const AdminDashboardPage = () => {
  const { data, isLoading, isError } = useDashboardStats();

  const barData = (data?.proyectosPorArea ?? []).map((item) => ({
    area: AREA_SISTEMAS_LABELS[item.area] ?? item.area,
    cantidad: item.cantidad,
  }));

  const pieData = [
    { name: 'Activos', value: data?.proyectosActivos ?? 0 },
    { name: 'Completados', value: data?.proyectosCompletados ?? 0 },
  ];

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-gray-400">
          Error al cargar las estadísticas. Intenta recargar la página.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Estadísticas generales de la plataforma</p>
      </div>

      {/* Tarjetas métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {METRIC_CARDS.map((card) => (
          <MetricCard
            key={card.key}
            label={card.label}
            value={data?.[card.key]}
            isStar={card.isStar}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Barras: proyectos por área */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Proyectos por área</h2>
          {isLoading ? (
            <div className="h-52 bg-gray-100 rounded animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={barData}
                margin={{ top: 4, right: 8, left: -20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="area"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  angle={-40}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="cantidad" fill="#1B6FE8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Dona: activos vs completados */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Estado de proyectos</h2>
          {isLoading ? (
            <div className="h-52 bg-gray-100 rounded animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
