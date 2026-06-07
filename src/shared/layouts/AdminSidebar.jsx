import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Logo } from '@/shared/ui/Logo';
import { motion, AnimatePresence } from 'framer-motion';

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

const AdminSidebar = ({ onLogoutClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuthStore();

  const initials =
    user?.nombre
      ?.split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ?? 'A';

  const sidebarContent = (
    <>
      <div className="px-4 py-5 border-b border-blue-800/40">
        <Logo theme="dark" />
      </div>
      <div className="px-4 py-3 border-b border-blue-800/40 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 text-xs font-semibold shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-white text-xs font-medium truncate">{user?.nombre}</p>
          <p className="text-blue-300/70 text-[11px]">Administrador</p>
        </div>
      </div>
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
      <div className="p-2 border-t border-blue-800/40">
        <button
          onClick={onLogoutClick}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-blue-800/20 transition-all w-full"
        >
          <LogOut size={16} strokeWidth={1.8} />
          Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[220px] bg-[#0F2A4A] flex-shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile header y sidebar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0F2A4A] flex items-center justify-between px-4 z-40">
        <Logo theme="dark" />
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
        >
          <Menu size={24} />
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 w-[240px] h-full bg-[#0F2A4A] shadow-2xl flex flex-col"
            >
              <div className="flex justify-end p-2">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;