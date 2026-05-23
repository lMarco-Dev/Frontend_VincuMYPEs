import React, { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Briefcase,
  User,
  LogOut,
  Menu,
  X,
  Award,
  FolderOpen,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import { Logo } from "../ui/Logo";
import { useMisPostulaciones } from "../../features/postulaciones-list/useMisPostulaciones";
import { useCertificados } from "../../features/certificados/useCertificados";

const NavItem = ({ to, icon: Icon, label, pathname, onClick, badge }) => {
  const active = pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-sm transition-all duration-150 mb-0.5 w-full ${
        active
          ? "bg-white/10 text-white font-medium"
          : "text-white/55 hover:bg-white/5 hover:text-white/85"
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

const StudentLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const { data: postulaciones } = useMisPostulaciones();
  const { data: certificados } = useCertificados();

  const hasCertificados = certificados && certificados.length > 0;

  const proyectoAceptado = postulaciones?.find(
    (p) => p.estado === "CONFIRMADO" || p.estado === "ACEPTADO" || p.estado === "Aceptado",
  );
  const idProyectoParaWorkspace =
    proyectoAceptado?.proyectoId ||
    (postulaciones && postulaciones.length > 0
      ? postulaciones[0].proyectoId
      : "1");

  const navigationSections = [
    {
      label: "Principal",
      items: [
        {
          to: "/dashboard/estudiante",
          icon: LayoutDashboard,
          label: "Mi Panel",
        },
        { to: "/proyectos", icon: Search, label: "Explorar Proyectos" },
      ],
    },
    {
      label: "Gestión",
      items: [
        {
          to: "/mis-postulaciones",
          icon: Briefcase,
          label: "Mis Postulaciones",
        },
        { to: "/workspace", icon: FolderOpen, label: "Mi Workspace" },
        { to: "/certificados", icon: Award, label: "Mis Certificados" },
      ],
    },
    {
      label: "Cuenta",
      items: [{ to: "/perfil", icon: User, label: "Mi Perfil" }],
    },
  ];

  const initials =
    user?.nombre
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";

  return (
    <div className="portal-estudiante min-h-screen bg-[#F8FAFC] flex overflow-hidden">
      {/* SIDEBAR PARA DESKTOP */}
      <aside className="hidden lg:flex flex-col w-[220px] bg-[#1e3a5f] flex-shrink-0 z-30">
        <div className="px-4 py-4 border-b border-white/10">
          <div className="bg-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
            <Logo />
          </div>
        </div>

        <div className="px-4 py-3.5 border-b border-white/10 flex items-center gap-2.5">
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
                  pathname={location.pathname}
                  badge={
                    item.label === "Mis Certificados" && hasCertificados ? (
                      <span className="flex h-1.5 w-1.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                    ) : null
                  }
                />
              ))}
            </div>
          ))}
        </nav>

        <div className="p-2 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all w-full"
          >
            <LogOut size={17} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-40">
        <Logo />
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 left-0 w-[240px] bg-[#1e3a5f] z-10 flex flex-col shadow-2xl h-full"
            >
              <div className="px-4 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="bg-white/10 rounded-lg px-3 py-2 flex items-center gap-2 flex-1 mr-2">
                  <Logo />
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-4 py-3.5 border-b border-white/10 flex items-center gap-2.5">
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
                        pathname={location.pathname}
                        onClick={() => setIsSidebarOpen(false)}
                        badge={
                          item.label === "Mis Certificados" &&
                          hasCertificados ? (
                            <span className="flex h-1.5 w-1.5 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                          ) : null
                        }
                      />
                    ))}
                  </div>
                ))}
              </nav>

              <div className="p-2 border-t border-white/10">
                <button
                  onClick={logout}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all w-full"
                >
                  <LogOut size={17} />
                  Cerrar sesión
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto pt-16 lg:pt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;