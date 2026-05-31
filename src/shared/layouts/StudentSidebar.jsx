import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Search,
  Briefcase,
  User,
  LogOut,
  X,
  Award,
  FolderOpen
} from 'lucide-react';
import { Logo } from '../ui/Logo';

const NavItem = ({ to, icon: Icon, label, pathname, onClick, badge }) => {
  const active = pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-sm transition-all duration-150 mb-0.5 w-full ${active
          ? "bg-white/12 text-white font-medium"
          : "text-white/55 hover:bg-white/7 hover:text-white/85"
        }`}
    >
      <div className="flex items-center gap-2.5">
        <Icon size={17} className="shrink-0" />
        {label}
      </div>
      {badge}
    </Link>
  );
};

const StudentSidebar = ({
  isMobile = false,
  onClose,
  user,
  initials,
  logout,
  pathname,
  hasCertificados,
  idProyecto // <-- Lo recibes aquí
}) => {

  const navigationSections = [
    {
      label: "Principal",
      items: [
        { to: "/dashboard/estudiante", icon: LayoutDashboard, label: "Mi Panel" },
        { to: "/proyectos", icon: Search, label: "Explorar Proyectos" },
      ],
    },
    {
      label: "Gestión",
      items: [
        { to: "/mis-postulaciones", icon: Briefcase, label: "Mis Postulaciones" },
        // ↓ Aquí usamos el ID dinámico para que apunte al proyecto correcto
        { to: `/workspace/${idProyecto}`, icon: FolderOpen, label: "Mi Workspace" },
        { to: "/certificados", icon: Award, label: "Mis Certificados" },
      ],
    },
    {
      label: "Cuenta",
      items: [
        { to: "/perfil", icon: User, label: "Mi Perfil" },
      ],
    },
  ];

  const renderBadge = (itemLabel) => {
    if (itemLabel === "Mis Certificados" && hasCertificados) {
      return (
        <span className="flex h-1.5 w-1.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
        </span>
      );
    }
    return null;
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/8 flex items-center justify-between">
        <div className="bg-white/12 rounded-lg px-3 py-2 flex items-center gap-2 flex-1 mr-2">
          <Logo />
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Usuario */}
      <div className="px-4 py-3.5 border-b border-white/8 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-medium shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-white/90 text-xs font-medium truncate">
            {user?.nombre}
          </p>
          <p className="text-white/40 text-[11px]">Estudiante</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        {navigationSections.map((section) => (
          <div key={section.label} className="mb-5">
            <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider px-2 mb-1">
              {section.label}
            </p>
            {section.items.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                pathname={pathname}
                onClick={isMobile ? onClose : undefined}
                badge={renderBadge(item.label)}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-white/8">
        <button
          onClick={logout}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all w-full"
        >
          <LogOut size={17} />
          Cerrar sesión
        </button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute inset-y-0 left-0 w-[240px] bg-[#1e3a5f] z-10 flex flex-col shadow-2xl h-full"
      >
        {sidebarContent}
      </motion.aside>
    );
  }

  return (
    <aside className="hidden lg:flex flex-col w-[220px] bg-[#1e3a5f] flex-shrink-0 z-30">
      {sidebarContent}
    </aside>
  );
};

export default StudentSidebar; import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Search,
  Briefcase,
  User,
  LogOut,
  X,
  Award,
  FolderOpen
} from 'lucide-react';
import { Logo } from '../ui/Logo';

const NavItem = ({ to, icon: Icon, label, pathname, onClick, badge }) => {
  const active = pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-sm transition-all duration-150 mb-0.5 w-full ${active
          ? "bg-white/12 text-white font-medium"
          : "text-white/55 hover:bg-white/7 hover:text-white/85"
        }`}
    >
      <div className="flex items-center gap-2.5">
        <Icon size={17} className="shrink-0" />
        {label}
      </div>
      {badge}
    </Link>
  );
};

const StudentSidebar = ({
  isMobile = false,
  onClose,
  user,
  initials,
  logout,
  pathname,
  hasCertificados,
  idProyecto // <-- Lo recibes aquí
}) => {

  const navigationSections = [
    {
      label: "Principal",
      items: [
        { to: "/dashboard/estudiante", icon: LayoutDashboard, label: "Mi Panel" },
        { to: "/proyectos", icon: Search, label: "Explorar Proyectos" },
      ],
    },
    {
      label: "Gestión",
      items: [
        { to: "/mis-postulaciones", icon: Briefcase, label: "Mis Postulaciones" },
        // ↓ Aquí usamos el ID dinámico para que apunte al proyecto correcto
        { to: `/workspace/${idProyecto}`, icon: FolderOpen, label: "Mi Workspace" },
        { to: "/certificados", icon: Award, label: "Mis Certificados" },
      ],
    },
    {
      label: "Cuenta",
      items: [
        { to: "/perfil", icon: User, label: "Mi Perfil" },
      ],
    },
  ];

  const renderBadge = (itemLabel) => {
    if (itemLabel === "Mis Certificados" && hasCertificados) {
      return (
        <span className="flex h-1.5 w-1.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
        </span>
      );
    }
    return null;
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/8 flex items-center justify-between">
        <div className="bg-white/12 rounded-lg px-3 py-2 flex items-center gap-2 flex-1 mr-2">
          <Logo />
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Usuario */}
      <div className="px-4 py-3.5 border-b border-white/8 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-medium shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-white/90 text-xs font-medium truncate">
            {user?.nombre}
          </p>
          <p className="text-white/40 text-[11px]">Estudiante</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        {navigationSections.map((section) => (
          <div key={section.label} className="mb-5">
            <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider px-2 mb-1">
              {section.label}
            </p>
            {section.items.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                pathname={pathname}
                onClick={isMobile ? onClose : undefined}
                badge={renderBadge(item.label)}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-white/8">
        <button
          onClick={logout}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all w-full"
        >
          <LogOut size={17} />
          Cerrar sesión
        </button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute inset-y-0 left-0 w-[240px] bg-[#1e3a5f] z-10 flex flex-col shadow-2xl h-full"
      >
        {sidebarContent}
      </motion.aside>
    );
  }

  return (
    <aside className="hidden lg:flex flex-col w-[220px] bg-[#1e3a5f] flex-shrink-0 z-30">
      {sidebarContent}
    </aside>
  );
};

export default StudentSidebar;