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
        <Logo theme="light" />
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
