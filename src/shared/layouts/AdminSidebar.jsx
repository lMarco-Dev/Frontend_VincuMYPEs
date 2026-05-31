import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Users, LogOut, ShieldCheck, History, BarChart, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Logo } from '../ui/Logo';

const AdminSidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const navItems = [
    { name: 'Panel de Control', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Gestión de Proyectos', path: '/admin/proyectos', icon: <FolderKanban size={20} /> },
    { name: 'Directorio de Usuarios', path: '/admin/usuarios', icon: <Users size={20} /> },
    { name: 'Auditoría', path: '/admin/auditoria', icon: <History size={20} /> },
    { name: 'Reportes y Extracción', path: '/admin/reportes', icon: <BarChart size={20} /> },
    { name: 'Configuración', path: '/admin/configuracion', icon: <Settings size={20} /> },
    { name: 'Gestión de Postulaciones', path: '/admin/postulaciones', icon: <Users size={20} /> }

  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-[#1e3a5f] min-h-screen text-white flex flex-col fixed left-0 top-0 shadow-2xl z-50">
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <ShieldCheck size={28} className="text-emerald-400" />
        <span className="font-extrabold text-xl tracking-tight">SuperAdmin</span>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.includes(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-red-300 hover:bg-red-500/10 hover:text-red-200 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;