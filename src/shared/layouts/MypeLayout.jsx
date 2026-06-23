import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { queryClient } from '@/shared/api/queryClient';
import { Sidebar } from './MypeSidebar';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ConfirmModal } from '../components/ConfirmModal';
import { NotificacionesSocketInitializer } from '@/features/notificaciones/NotificacionesSocketInitializer';

const FONT = "'Angro Std', 'Outfit', sans-serif";

function BtnPrimary({ to, label }) {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <button
        style={{
          fontFamily: FONT,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "0 16px",
          height: 36,
          fontSize: 13,
          fontWeight: 600,
          borderRadius: 9,
          border: "none",
          cursor: "pointer",
          color: "#fff",
          background: "linear-gradient(135deg,#1B6FE8 0%,#0E54C4 100%)",
          transition: "all 0.25s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "linear-gradient(135deg,#06B6D4 0%,#1B6FE8 100%)";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(27,111,232,0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "linear-gradient(135deg,#1B6FE8 0%,#0E54C4 100%)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <Plus size={14} /> {label}
      </button>
    </Link>
  );
}

export function MypeLayout({ children, titulo, accion }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleConfirmLogout = () => {
    queryClient.clear();
    logout();
    navigate('/login');
    setShowLogoutModal(false);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#F8FAFC",
        fontFamily: FONT,
      }}
      
    >
      <Sidebar onLogoutClick={() => setShowLogoutModal(true)} />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <NotificacionesSocketInitializer />
        <header
          style={{
            background: "#fff",
            borderBottom: "0.5px solid #E5E7EB",
            height: 52,
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <h1
            style={{
              fontFamily: FONT,
              fontSize: 15,
              fontWeight: 600,
              color: "#111827",
              margin: 0,
            }}
          >
            {titulo}
          </h1>
          {accion && <BtnPrimary to={accion.to} label={accion.label} />}
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {children}
        </main>
      </div>
      <ConfirmModal
        isOpen={showLogoutModal}
        title="Cerrar sesión"
        message="¿Estás seguro de que deseas cerrar sesión? Se cerrará tu sesión actual."
        confirmText="Cerrar sesión"
        variant="warning"
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
}