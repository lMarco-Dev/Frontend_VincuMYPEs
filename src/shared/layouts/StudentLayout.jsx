import React, { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { NotificacionesSocketInitializer } from '@/features/notificaciones/NotificacionesSocketInitializer';
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
  AlertTriangle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import { Logo } from "../ui/Logo";
import { useSidebarBadges } from "../hooks/useSidebarBadges";

const SIDEBAR_BG = 'linear-gradient(170deg, #081828 0%, #0F2A4A 60%, #0C3260 100%)';

const NavItem = ({ to, icon: Icon, label, pathname, onClick, showDot, dotColor }) => {
  const active = pathname === to || (to !== '/dashboard/estudiante' && pathname.startsWith(to));

  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '7px 8px',
        borderRadius: 8,
        fontSize: 12,
        marginBottom: 2,
        textDecoration: 'none',
        border: active ? '1px solid rgba(27,111,232,0.3)' : '1px solid transparent',
        background: active ? 'rgba(27,111,232,0.18)' : 'transparent',
        color: active ? '#fff' : 'rgba(255,255,255,0.45)',
        transition: 'all 0.15s',
        fontFamily: "'Inter', sans-serif",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <Icon size={15} style={{ flexShrink: 0, color: active ? '#06B6D4' : 'inherit' }} />
        {label}
      </div>
      {showDot && (
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: dotColor,
          boxShadow: `0 0 6px ${dotColor}99`,
          flexShrink: 0,
        }} />
      )}
    </Link>
  );
};

const StudentLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const badges = useSidebarBadges();

  const navigationSections = [
    {
      label: 'Principal',
      items: [
        { to: '/dashboard/estudiante', icon: LayoutDashboard, label: 'Mi Panel', showDot: false },
        { to: '/proyectos', icon: Search, label: 'Explorar Proyectos', showDot: badges.explorar, dotColor: '#F59E0B' },
      ],
    },
    {
      label: 'Gestión',
      items: [
        { to: '/mis-postulaciones', icon: Briefcase, label: 'Mis Postulaciones', showDot: badges.postulaciones, dotColor: '#3B82F6' },
        { to: '/workspace', icon: FolderOpen, label: 'Mi Workspace', showDot: badges.workspace, dotColor: '#8B5CF6' },
        { to: '/certificados', icon: Award, label: 'Mis Certificados', showDot: badges.certificados, dotColor: '#10B981' },
      ],
    },
    {
      label: 'Cuenta',
      items: [
        { to: '/perfil', icon: User, label: 'Mi Perfil', showDot: false },
      ],
    },
  ];

  const initials =
    user?.nombre?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() ?? '?';

  const handleConfirmLogout = () => {
    logout();
    navigate('/login');
    setShowLogoutModal(false);
  };

  const sidebarContent = (closeMenu) => (
    <>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.045) 1px, transparent 0)',
        backgroundSize: '28px 28px', pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', top: -80, right: -80, width: 200, height: 200,
        borderRadius: '50%', background: 'radial-gradient(circle, #06B6D4, transparent 70%)',
        opacity: 0.12, filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', bottom: -60, left: -60, width: 160, height: 160,
        borderRadius: '50%', background: 'radial-gradient(circle, #1B6FE8, transparent 70%)',
        opacity: 0.1, filter: 'blur(30px)', pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 1, padding: '14px 16px',
        borderBottom: '0.5px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Logo />
      </div>

      <div style={{
        position: 'relative', zIndex: 1, padding: '10px 14px',
        borderBottom: '0.5px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #1B6FE8, #06B6D4)',
          border: '1.5px solid rgba(6,182,212,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, color: '#fff',
        }}>
          {initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.88)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.nombre}
          </p>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', margin: 0 }}>Estudiante</p>
        </div>
      </div>

      <nav style={{ position: 'relative', zIndex: 1, flex: 1, padding: '8px', overflowY: 'auto' }}>
        {navigationSections.map((section) => (
          <div key={section.label} style={{ marginBottom: 16 }}>
            <p style={{
              fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.25)',
              textTransform: 'uppercase', letterSpacing: '1px', padding: '0 7px', marginBottom: 3,
            }}>
              {section.label}
            </p>
            {section.items.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                pathname={location.pathname}
                onClick={closeMenu}
                showDot={item.showDot}
                dotColor={item.dotColor}
              />
            ))}
          </div>
        ))}
      </nav>

      <div style={{ position: 'relative', zIndex: 1, padding: 8, borderTop: '0.5px solid rgba(255,255,255,0.07)' }}>
        <button
          onClick={() => setShowLogoutModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px',
            borderRadius: 8, fontSize: 12, color: 'rgba(255,255,255,0.3)',
            background: 'transparent', border: 'none', cursor: 'pointer',
            width: '100%', transition: 'all 0.15s', fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut size={15} /> Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="portal-estudiante" style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', overflow: 'hidden' }}>
      <NotificacionesSocketInitializer />
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex" style={{
        width: 220, flexShrink: 0, flexDirection: 'column',
        background: SIDEBAR_BG, position: 'relative', overflow: 'hidden', zIndex: 30,
      }}>
        {sidebarContent(null)}
      </aside>

      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-4 z-40" style={{
        height: 56, background: '#fff', borderBottom: '1px solid #e5e7eb',
      }}>
        <Logo theme="light" />
        <button
          onClick={() => setIsSidebarOpen(true)}
          style={{ padding: 8, color: '#475569', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 50 }}
            className="lg:hidden"
          >
            <div
              onClick={() => setIsSidebarOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(15,26,47,0.5)', backdropFilter: 'blur(4px)' }}
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'absolute', top: 0, left: 0, bottom: 0, width: 240,
                background: SIDEBAR_BG, display: 'flex', flexDirection: 'column',
                boxShadow: '4px 0 30px rgba(0,0,0,0.3)', overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 8, position: 'relative', zIndex: 1 }}>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  style={{ padding: 6, color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', borderRadius: 8 }}
                >
                  <X size={18} />
                </button>
              </div>
              {sidebarContent(() => setIsSidebarOpen(false))}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ÁREA DE CONTENIDO */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto' }} className="pt-14 lg:pt-0">
          <Outlet />
        </div>
      </main>

      {/* ✅ MODAL LOGOUT - DISEÑO PROFESIONAL CORPORATIVO */}
      <AnimatePresence>
        {showLogoutModal && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 60,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16, background: 'rgba(10,10,10,0.4)', backdropFilter: 'blur(1px)',
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'relative', maxWidth: 420, width: '100%',
                background: '#fff', borderRadius: 12,
                boxShadow: '0 24px 80px -8px rgba(0,0,0,0.18)',
                overflow: 'hidden',
              }}
            >
              {/* Línea de acento sutil */}
              <div style={{ height: 2, width: '100%', background: '#E2E8F0' }} />

              <div style={{ padding: 28 }}>
                {/* Encabezado */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: '#F1F5F9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <AlertTriangle size={18} style={{ color: '#64748B' }} strokeWidth={1.5} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontSize: 16, fontWeight: 600, color: '#1E293B',
                      margin: 0, letterSpacing: '-0.01em', lineHeight: 1.4,
                    }}>
                      Cerrar sesión
                    </h3>
                    <p style={{
                      fontSize: 13.5, color: '#64748B', margin: '4px 0 0',
                      lineHeight: 1.5,
                    }}>
                      Se cerrará tu sesión actual y deberás volver a iniciar sesión para acceder a tu cuenta.
                    </p>
                  </div>
                </div>

                {/* Separador */}
                <div style={{ height: 1, width: '100%', background: '#E2E8F0/60', marginTop: 24 }} />

                {/* Botones */}
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 8,
                      border: '1px solid #E2E8F0', background: 'transparent',
                      color: '#475569', fontSize: 13, fontWeight: 500,
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#F8FAFC';
                      e.currentTarget.style.borderColor = '#CBD5E1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = '#E2E8F0';
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmLogout}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 8,
                      border: 'none', background: '#1E293B',
                      color: '#fff', fontSize: 13, fontWeight: 500,
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#0F172A';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#1E293B';
                    }}
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentLayout;