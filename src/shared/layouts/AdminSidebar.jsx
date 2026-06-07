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
      className={`flex items-center gap-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 mb-0.5 ${
        active
          ? 'bg-blue-800/30 text-white border-l-4 border-blue-400 pl-2 pr-3'
          : 'text-gray-300 hover:bg-blue-800/20 hover:text-white pl-3 pr-3'
      }`}
    >
      <Icon size={16} className="shrink-0" strokeWidth={1.8} />
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
    <aside className="w-[220px] bg-[#0F2A4A] flex flex-col fixed left-0 top-0 h-screen z-50 shadow-lg">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-blue-800/40">
        <Logo theme="dark" />
      </div>

      {/* Usuario */}
      <div className="px-4 py-3 border-b border-blue-800/40 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 text-xs font-semibold shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-white text-xs font-medium truncate">{user?.nombre}</p>
          <p className="text-blue-300/70 text-[11px]">Administrador</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-5">
            <p className="text-[10px] font-semibold text-blue-300/60 uppercase tracking-wider px-3 mb-2">
              {section.label}
            </p>
            {section.items.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-blue-800/40">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-blue-800/20 transition-all w-full"
        >
          <LogOut size={16} strokeWidth={1.8} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;