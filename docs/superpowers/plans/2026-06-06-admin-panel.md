# Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing admin dashboard and postulaciones pages with a clean, light-themed admin panel driven by new backend endpoints, and update the sidebar to match.

**Architecture:** New feature hooks (`useDashboardStats`, `usePostulacionesAdmin`, `useCambiarEstadoPostulacion`) call the new `/admin/dashboard/stats` and `/admin/postulaciones` endpoints via `httpClient`. The admin sidebar becomes a light-themed component (white bg, dark text, left-border active state). Both admin pages are rewritten from scratch; the old postulaciones page is preserved as `AdminPostulacionesPageOld.jsx`.

**Tech Stack:** React 18, TanStack Query v5, Tailwind CSS v4, recharts v3, lucide-react, date-fns, react-router-dom v7

---

## File Map

| Action   | Path                                                                 | Responsibility                                    |
|----------|----------------------------------------------------------------------|---------------------------------------------------|
| Rename   | `src/pages/admin/AdminPostulacionesPageOld.jsx`                      | Preserve old page (copy of current)               |
| Modify   | `src/shared/layouts/AdminSidebar.jsx`                                | Light-theme sidebar with Logo + grouped nav       |
| Modify   | `src/shared/layouts/AdminLayout.jsx`                                 | Adjust ml to match new sidebar width              |
| Create   | `src/features/admin/adminDashboard.api.js`                           | `GET /admin/dashboard/stats`                      |
| Create   | `src/features/admin/useDashboardStats.js`                            | Query hook with 60s refetch                       |
| Create   | `src/features/admin/adminPostulaciones.api.js`                       | `GET /admin/postulaciones`, `PATCH` estado        |
| Create   | `src/features/admin/usePostulacionesAdmin.js`                        | Paginated query with filter params                |
| Create   | `src/features/admin/useCambiarEstadoPostulacion.js`                  | Mutation + invalidate postulaciones query         |
| Modify   | `src/pages/admin/AdminDashboardPage.jsx`                             | 9 metric cards + BarChart + PieChart              |
| Modify   | `src/pages/admin/AdminPostulacionesPage.jsx`                         | Table + filters + pagination + confirm modal      |
| No-op    | `src/app/router/AppRouter.jsx`                                       | Routes already exist — no changes needed          |

---

## Task 1: Preserve old postulaciones page

**Files:**
- Create: `src/pages/admin/AdminPostulacionesPageOld.jsx` (copy of current `AdminPostulacionesPage.jsx`)

- [ ] **Step 1: Copy the file**

```bash
cp "src/pages/admin/AdminPostulacionesPage.jsx" "src/pages/admin/AdminPostulacionesPageOld.jsx"
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/AdminPostulacionesPageOld.jsx
git commit -m "chore: preserve old admin postulaciones page as PageOld"
```

---

## Task 2: Rewrite AdminSidebar.jsx (light theme)

**Files:**
- Modify: `src/shared/layouts/AdminSidebar.jsx`

The new sidebar uses a white background (`bg-white`), a right border (`border-r border-gray-200`), the existing `<Logo />` component (default props give the regular colored SVG — correct for a light background), grouped nav sections, and a bottom logout button.

Note: `<Logo />` with no props uses `theme="dark"` which loads `/linkuy_logo.svg` — the colored logo visible on white backgrounds. Do NOT pass `theme="light"` (that loads the white/Blanco SVG which would be invisible on white).

- [ ] **Step 1: Rewrite AdminSidebar.jsx**

```jsx
// src/shared/layouts/AdminSidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  FolderKanban,
  Users,
  Award,
  History,
  BarChart,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { queryClient } from '@/shared/api/queryClient';
import { Logo } from '@/shared/ui/Logo';

const NAV_SECTIONS = [
  {
    label: 'Principal',
    items: [
      { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/admin/postulaciones', icon: ClipboardList, label: 'Postulaciones' },
    ],
  },
  {
    label: 'Gestión',
    items: [
      { to: '/admin/proyectos', icon: FolderKanban, label: 'Proyectos' },
      { to: '/admin/usuarios', icon: Users, label: 'Usuarios' },
      { to: '/admin/certificados', icon: Award, label: 'Certificados' },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { to: '/admin/auditoria', icon: History, label: 'Auditoría' },
      { to: '/admin/reportes', icon: BarChart, label: 'Reportes' },
      { to: '/admin/configuracion', icon: Settings, label: 'Configuración' },
    ],
  },
];

function NavItem({ to, icon: Icon, label }) {
  const { pathname } = useLocation();
  const active = pathname === to || pathname.startsWith(to + '/');
  return (
    <Link
      to={to}
      className={`flex items-center gap-2.5 py-2 rounded-lg text-sm transition-all duration-150 mb-0.5 border-l-4 ${
        active
          ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium pl-2 pr-3'
          : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 pl-3 pr-3'
      }`}
    >
      <Icon size={16} className="shrink-0" />
      {label}
    </Link>
  );
}

const AdminSidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const initials =
    user?.nombre
      ?.split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ?? 'A';

  const handleLogout = () => {
    queryClient.clear();
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-[220px] bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 h-screen z-50">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-gray-100">
        <Logo />
      </div>

      {/* Usuario */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-gray-800 text-xs font-medium truncate">{user?.nombre}</p>
          <p className="text-gray-400 text-[11px]">Administrador</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-5">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">
              {section.label}
            </p>
            {section.items.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all w-full"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
```

- [ ] **Step 2: Commit**

```bash
git add src/shared/layouts/AdminSidebar.jsx
git commit -m "feat(admin): light-theme sidebar with grouped nav and Logo"
```

---

## Task 3: Update AdminLayout.jsx

**Files:**
- Modify: `src/shared/layouts/AdminLayout.jsx`

The layout main area needs `ml-[220px]` (matching the new sidebar width) and a light gray background.

- [ ] **Step 1: Rewrite AdminLayout.jsx**

```jsx
// src/shared/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 ml-[220px] p-6 lg:p-8 overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
```

- [ ] **Step 2: Commit**

```bash
git add src/shared/layouts/AdminLayout.jsx
git commit -m "feat(admin): update layout bg and ml to match new sidebar"
```

---

## Task 4: Create dashboard API and hook

**Files:**
- Create: `src/features/admin/adminDashboard.api.js`
- Create: `src/features/admin/useDashboardStats.js`

- [ ] **Step 1: Create adminDashboard.api.js**

```js
// src/features/admin/adminDashboard.api.js
import { httpClient } from '@/shared/api/httpClient';

export const getDashboardStats = () =>
  httpClient.get('/admin/dashboard/stats').then((r) => r.data);
```

- [ ] **Step 2: Create useDashboardStats.js**

Uses TanStack Query v5. `refetchInterval: 60_000` auto-refreshes every minute.

```js
// src/features/admin/useDashboardStats.js
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from './adminDashboard.api';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin', 'dashboardStats'],
    queryFn: getDashboardStats,
    refetchInterval: 60_000,
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/features/admin/adminDashboard.api.js src/features/admin/useDashboardStats.js
git commit -m "feat(admin): add dashboard stats API and query hook"
```

---

## Task 5: Rewrite AdminDashboardPage.jsx

**Files:**
- Modify: `src/pages/admin/AdminDashboardPage.jsx`

Expected shape from `GET /admin/dashboard/stats`:
```ts
{
  totalEstudiantes: number,
  totalMypes: number,
  totalAdmins: number,
  proyectosActivos: number,
  proyectosCompletados: number,
  postulacionesPendientes: number,
  certificadosEmitidos: number,
  promedioCalificacionMypes: number,   // float, shown with ★
  promedioCalificacionEstudiantes: number, // float, shown with ★
  proyectosPorArea: { area: string, cantidad: number }[]
}
```

`AREA_SISTEMAS_LABELS` is already defined in `src/entities/proyecto/proyecto.constants.js` and maps enum keys to Spanish labels.

- [ ] **Step 1: Rewrite AdminDashboardPage.jsx**

```jsx
// src/pages/admin/AdminDashboardPage.jsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/AdminDashboardPage.jsx
git commit -m "feat(admin): new dashboard with stats endpoint, metric cards, and charts"
```

---

## Task 6: Create postulaciones API and hooks

**Files:**
- Create: `src/features/admin/adminPostulaciones.api.js`
- Create: `src/features/admin/usePostulacionesAdmin.js`
- Create: `src/features/admin/useCambiarEstadoPostulacion.js`

- [ ] **Step 1: Create adminPostulaciones.api.js**

```js
// src/features/admin/adminPostulaciones.api.js
import { httpClient } from '@/shared/api/httpClient';

export const getPostulacionesAdmin = (params) =>
  httpClient.get('/admin/postulaciones', { params }).then((r) => r.data);

export const cambiarEstadoPostulacionAdmin = ({ proyectoId, postulacionId, estado }) =>
  httpClient.patch(
    `/proyectos/${proyectoId}/postulaciones/${postulacionId}/estado`,
    { estado },
  );
```

- [ ] **Step 2: Create usePostulacionesAdmin.js**

TanStack Query v5: `keepPreviousData` is imported from the package and used as `placeholderData` to prevent table flicker on page change.

```js
// src/features/admin/usePostulacionesAdmin.js
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getPostulacionesAdmin } from './adminPostulaciones.api';

export function usePostulacionesAdmin(params) {
  return useQuery({
    queryKey: ['admin', 'postulaciones', params],
    queryFn: () => getPostulacionesAdmin(params),
    placeholderData: keepPreviousData,
  });
}
```

- [ ] **Step 3: Create useCambiarEstadoPostulacion.js**

After a successful mutation, invalidate the `['admin', 'postulaciones']` query family so the table refreshes and the action buttons disappear for that row.

```js
// src/features/admin/useCambiarEstadoPostulacion.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cambiarEstadoPostulacionAdmin } from './adminPostulaciones.api';

export function useCambiarEstadoPostulacion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cambiarEstadoPostulacionAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'postulaciones'] });
    },
  });
}
```

- [ ] **Step 4: Commit**

```bash
git add src/features/admin/adminPostulaciones.api.js src/features/admin/usePostulacionesAdmin.js src/features/admin/useCambiarEstadoPostulacion.js
git commit -m "feat(admin): postulaciones API, paginated query, and state-change mutation"
```

---

## Task 7: Rewrite AdminPostulacionesPage.jsx

**Files:**
- Modify: `src/pages/admin/AdminPostulacionesPage.jsx`

Backend returns `Page<PostulacionAdminResponse>` with fields:
```ts
{
  content: {
    id: number,
    proyectoId: number,
    proyectoTitulo: string,
    proyectoArea: string,         // enum key e.g. "DESARROLLO_WEB"
    mypeNombre: string,
    estudianteNombre: string,
    estudianteEmail: string,
    fechaPostulacion: string,     // ISO date string
    estado: string,               // "PENDIENTE" | "PRESELECCIONADO" | ...
  }[],
  totalPages: number,
  totalElements: number,
  number: number,                 // current page (0-indexed)
}
```

Filter state resets `page` to 0 on every change. The `estados` array is sent as repeated query params (`estados=PENDIENTE&estados=RECHAZADO`). `axios` serializes arrays correctly by default when passed via `params`.

- [ ] **Step 1: Rewrite AdminPostulacionesPage.jsx**

```jsx
// src/pages/admin/AdminPostulacionesPage.jsx
import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { usePostulacionesAdmin } from '@features/admin/usePostulacionesAdmin';
import { useCambiarEstadoPostulacion } from '@features/admin/useCambiarEstadoPostulacion';
import { AREA_SISTEMAS_LABELS } from '@entities/proyecto/proyecto.constants';

const ESTADOS = [
  'PENDIENTE',
  'PRESELECCIONADO',
  'VALIDADO_MYPE',
  'CONFIRMADO',
  'RECHAZADO',
  'EXPIRADO',
  'RETIRADO',
];

const ESTADO_BADGE = {
  PENDIENTE: 'bg-amber-50 text-amber-700 border-amber-200',
  PRESELECCIONADO: 'bg-blue-50 text-blue-700 border-blue-200',
  VALIDADO_MYPE: 'bg-purple-50 text-purple-700 border-purple-200',
  CONFIRMADO: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  RECHAZADO: 'bg-red-50 text-red-600 border-red-200',
  RETIRADO: 'bg-gray-100 text-gray-500 border-gray-200',
  EXPIRADO: 'bg-orange-50 text-orange-600 border-orange-200',
};

const DEFAULT_FILTERS = {
  estados: [],
  fechaDesde: '',
  fechaHasta: '',
  estudiante: '',
  mype: '',
  area: '',
};

function ConfirmModal({ estado, onConfirm, onCancel, isLoading }) {
  const isPreselect = estado === 'PRESELECCIONADO';
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
        <h3 className="text-base font-semibold text-gray-900 mb-2">
          {isPreselect ? 'Preseleccionar postulación' : 'Rechazar postulación'}
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          {isPreselect
            ? '¿Estás seguro de que quieres preseleccionar esta postulación?'
            : '¿Estás seguro de que quieres rechazar esta postulación? Esta acción notificará al estudiante.'}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${
              isPreselect ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isLoading ? 'Procesando...' : isPreselect ? 'Confirmar' : 'Rechazar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPostulacionesPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState('fechaPostulacion,desc');
  const [confirm, setConfirm] = useState(null); // { postulacionId, proyectoId, estado }

  const queryParams = {
    ...(filters.estados.length > 0 && { estados: filters.estados }),
    ...(filters.fechaDesde && { fechaDesde: filters.fechaDesde }),
    ...(filters.fechaHasta && { fechaHasta: filters.fechaHasta }),
    ...(filters.estudiante && { estudiante: filters.estudiante }),
    ...(filters.mype && { mype: filters.mype }),
    ...(filters.area && { area: filters.area }),
    page,
    size: 10,
    sort,
  };

  const { data, isLoading, isFetching } = usePostulacionesAdmin(queryParams);
  const { mutate: cambiarEstado, isPending } = useCambiarEstadoPostulacion();

  const postulaciones = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSort('fechaPostulacion,desc');
    setPage(0);
  }, []);

  const handleAction = (postulacionId, proyectoId, estado) => {
    setConfirm({ postulacionId, proyectoId, estado });
  };

  const handleConfirm = () => {
    if (!confirm) return;
    cambiarEstado(
      {
        proyectoId: confirm.proyectoId,
        postulacionId: confirm.postulacionId,
        estado: confirm.estado,
      },
      {
        onSuccess: () => setConfirm(null),
        onError: () => setConfirm(null),
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Postulaciones</h1>
        <p className="text-sm text-gray-500 mt-1">
          {isLoading
            ? 'Cargando...'
            : `${totalElements} postulación${totalElements !== 1 ? 'es' : ''} encontrada${totalElements !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Panel de filtros */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Estudiante</label>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={filters.estudiante}
              onChange={(e) => updateFilter('estudiante', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">MYPE</label>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={filters.mype}
              onChange={(e) => updateFilter('mype', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Área</label>
            <select
              value={filters.area}
              onChange={(e) => updateFilter('area', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
            >
              <option value="">Todas las áreas</option>
              {Object.entries(AREA_SISTEMAS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Fecha desde</label>
            <input
              type="date"
              value={filters.fechaDesde}
              onChange={(e) => updateFilter('fechaDesde', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Fecha hasta</label>
            <input
              type="date"
              value={filters.fechaHasta}
              onChange={(e) => updateFilter('fechaHasta', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Ordenar por</label>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(0);
              }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
            >
              <option value="fechaPostulacion,desc">Fecha postulación (reciente primero)</option>
              <option value="sinPreseleccionados">Proyectos sin preseleccionados primero</option>
            </select>
          </div>
        </div>

        {/* Filtro de estados */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">Estados</label>
          <div className="flex flex-wrap gap-2">
            {ESTADOS.map((estado) => {
              const active = filters.estados.includes(estado);
              return (
                <button
                  key={estado}
                  onClick={() => {
                    const next = active
                      ? filters.estados.filter((e) => e !== estado)
                      : [...filters.estados, estado];
                    updateFilter('estados', next);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    active
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {estado.replace('_', ' ')}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={clearFilters}
            className="text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Estudiante
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Proyecto
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  MYPE
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Fecha
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Estado
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : postulaciones.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-400 text-sm"
                  >
                    No se encontraron postulaciones con los filtros actuales.
                  </td>
                </tr>
              ) : (
                postulaciones.map((p) => (
                  <tr
                    key={p.id}
                    className={`hover:bg-gray-50 transition-colors ${isFetching ? 'opacity-60' : ''}`}
                  >
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">{p.estudianteNombre}</p>
                      <p className="text-xs text-gray-400">{p.estudianteEmail}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900 max-w-[180px] truncate">
                        {p.proyectoTitulo}
                      </p>
                      <p className="text-xs text-gray-400">
                        {AREA_SISTEMAS_LABELS[p.proyectoArea] ?? p.proyectoArea}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{p.mypeNombre}</td>
                    <td className="px-4 py-4 text-gray-500 text-xs whitespace-nowrap">
                      {p.fechaPostulacion
                        ? format(new Date(p.fechaPostulacion), 'dd/MM/yyyy')
                        : '—'}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${
                          ESTADO_BADGE[p.estado] ?? 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}
                      >
                        {p.estado.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {p.estado === 'PENDIENTE' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleAction(p.id, p.proyectoId, 'PRESELECCIONADO')
                            }
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Check size={12} />
                            Preseleccionar
                          </button>
                          <button
                            onClick={() =>
                              handleAction(p.id, p.proyectoId, 'RECHAZADO')
                            }
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-white text-red-600 border border-red-200 text-xs font-medium rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                          >
                            <X size={12} />
                            Rechazar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Página {page + 1} de {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = i;
                } else if (page < 4) {
                  pageNum = i;
                } else if (page > totalPages - 5) {
                  pageNum = totalPages - 7 + i;
                } else {
                  pageNum = page - 3 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 text-xs rounded-lg transition-colors ${
                      pageNum === page
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      {confirm && (
        <ConfirmModal
          estado={confirm.estado}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
          isLoading={isPending}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/AdminPostulacionesPage.jsx
git commit -m "feat(admin): new postulaciones page with global table, filters, and pagination"
```

---

## Self-Review

**Spec coverage:**
- ✅ AdminSidebar: light theme, Logo, grouped nav (Principal/Gestión/Sistema), logout with LogOut icon
- ✅ AdminLayout: bg-gray-50, ml matches sidebar width
- ✅ Dashboard: 9 metric cards, ★ only on rating cards, BarChart + PieChart, responsive, refetchInterval 60s
- ✅ Postulaciones: table, 10/page, all 7 filters (estados chips, fechas, estudiante, mype, area, sort), modal confirm, actions only when PENDIENTE, invalidate on success
- ✅ useDashboardStats: GET /admin/dashboard/stats, refetchInterval
- ✅ usePostulacionesAdmin: paginated, keepPreviousData (placeholderData v5 API)
- ✅ useCambiarEstadoPostulacion: PATCH + invalidate
- ✅ Old page preserved as AdminPostulacionesPageOld.jsx
- ✅ No router changes needed (routes already exist)

**Placeholder scan:** None found.

**Type consistency:** `postulacionId` and `proyectoId` used consistently across API function, mutation call, and confirm state object.
