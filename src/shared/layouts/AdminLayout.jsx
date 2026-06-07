import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { queryClient } from '@/shared/api/queryClient';
import AdminSidebar from './AdminSidebar';
import { ConfirmModal } from '../components/ConfirmModal';

const AdminLayout = () => {
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
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar onLogoutClick={() => setShowLogoutModal(true)} />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto min-h-screen">
        <Outlet />
      </main>
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
};

export default AdminLayout;