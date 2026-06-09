import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  CheckCircle,
  Award,
  MessageSquare,
  UserCircle,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Logo } from '../ui/Logo';
import { motion, AnimatePresence } from 'framer-motion';

const FONT = "'Angro Std', 'Outfit', sans-serif";

const NAV = [
  {
    label: 'Principal',
    items: [
      { to: '/dashboard/mype', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/dashboard/mype/proyectos', icon: Briefcase, label: 'Mis proyectos' },
      { to: '/dashboard/mype/postulantes', icon: Users, label: 'Postulantes', badge: true },
    ],
  },
  {
    label: 'Gestión',
    items: [
      { to: '/dashboard/mype/ejecucion', icon: CheckCircle, label: 'En ejecución' },
      { to: '/dashboard/mype/certificados', icon: Award, label: 'Certificados' },
      { to: '/dashboard/mype/mensajes', icon: MessageSquare, label: 'Mensajes' },
    ],
  },
  {
    label: 'Cuenta',
    items: [
      { to: '/dashboard/mype/perfil', icon: UserCircle, label: 'Mi perfil' },
      { to: '/dashboard/mype/configuracion', icon: Settings, label: 'Configuración' },
    ],
  },
];

function NavItem({ to, icon: Icon, label, badge }) {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      style={{ fontFamily: FONT }}
      className={clsx(
        'flex items-center gap-2 px-2.5 py-[7px] rounded-lg text-[12px] transition-all duration-150 mb-[2px] border no-underline',
        active
          ? 'bg-[rgba(27,111,232,0.18)] text-white border-[rgba(27,111,232,0.3)] font-semibold'
          : 'text-white/45 hover:bg-white/[0.06] hover:text-white/80 border-transparent',
      )}
    >
      <Icon size={15} className={clsx('shrink-0', active && 'text-[#06B6D4]')} />
      <span className="flex-1">{label}</span>
      {badge && (
        <span
          style={{
            background: 'rgba(249,115,22,0.2)',
            color: '#FB923C',
            border: '1px solid rgba(249,115,22,0.3)',
            fontSize: 9,
            fontWeight: 700,
            padding: '1px 6px',
            borderRadius: 10,
          }}
        >
          •
        </span>
      )}
    </Link>
  );
}

export function Sidebar({ onLogoutClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuthStore();

  const initials =
    user?.nombre
      ?.split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ?? '?';

  const sidebarContent = (
    <>
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '16px 14px 12px',
          borderBottom: '0.5px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Logo />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '10px 14px',
          borderBottom: '0.5px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            flexShrink: 0,
            background: 'linear-gradient(135deg,#1B6FE8,#06B6D4)',
            border: '1.5px solid rgba(6,182,212,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
            color: '#fff',
          }}
        >
          {initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.85)',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {user?.nombre}
          </p>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
            MYPE · Cuenta activa
          </p>
        </div>
      </div>

      <nav
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          padding: '10px 8px',
          overflowY: 'auto',
        }}
      >
        {NAV.map((section) => (
          <div key={section.label} style={{ marginBottom: 16 }}>
            <p
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                padding: '0 8px',
                marginBottom: 4,
              }}
            >
              {section.label}
            </p>
            {section.items.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </div>
        ))}
      </nav>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: 8,
          borderTop: '0.5px solid rgba(255,255,255,0.07)',
        }}
      >
        <button
          onClick={onLogoutClick}
          style={{
            fontFamily: FONT,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 10px',
            borderRadius: 8,
            fontSize: 12,
            color: 'rgba(255,255,255,0.3)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.3)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <LogOut size={15} /> Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        style={{
          width: 210,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(170deg,#081828 0%,#0F2A4A 60%,#0C3260 100%)',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: FONT,
        }}
        className="hidden lg:flex"
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 1px 1px,rgba(255,255,255,0.045) 1px,transparent 0)',
            backgroundSize: '28px 28px',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle,#06B6D4,transparent 70%)',
            opacity: 0.12,
            filter: 'blur(40px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        {sidebarContent}
      </aside>

      {/* Mobile header y sidebar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0F2A4A] flex items-center justify-between px-4 z-40">
        <Logo />
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
}