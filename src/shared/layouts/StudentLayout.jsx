import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  Briefcase, 
  User, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { Logo } from '../ui/Logo';
import { useNotificaciones, useLeerNotificacion } from '../../features/notificaciones/useNotificaciones';

const StudentLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  const { data: notificaciones } = useNotificaciones();
  const { mutate: leerNotificacion } = useLeerNotificacion();
  
  const unreadCount = notificaciones?.filter(n => !n.leida).length || 0;

  const menuItems = [
    { 
      path: '/dashboard/estudiante', 
      icon: <LayoutDashboard size={22} />, 
      label: 'Mi Panel' 
    },
    { 
      path: '/proyectos', 
      icon: <Search size={22} />, 
      label: 'Explorar Proyectos' 
    },
    { 
      path: '/mis-postulaciones', 
      icon: <Briefcase size={22} />, 
      label: 'Mis Postulaciones' 
    },
    { 
      path: '/certificados', 
      icon: <Award size={22} />, 
      label: 'Mis Certificados' 
    },
    { 
      path: '/perfil', 
      icon: <User size={22} />, 
      label: 'Mi Perfil' 
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex overflow-hidden">
      {/* SIDEBAR PARA DESKTOP */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 shadow-sm z-30">
        <div className="p-8">
          <Logo />
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                isActive(item.path)
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-50">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 font-bold hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
          >
            <LogOut size={22} />
            Cerrar Sesión
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

      {/* MOBILE SIDEBAR OVERLAY */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-[60] flex flex-col shadow-2xl"
            >
              <div className="p-8 flex items-center justify-between">
                <Logo />
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-4 rounded-2xl font-bold transition-all ${
                      isActive(item.path)
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="p-6 border-t border-slate-50">
                <button
                  onClick={logout}
                  className="flex items-center gap-3 w-full px-4 py-4 text-slate-400 font-bold hover:text-red-500 rounded-2xl transition-all"
                >
                  <LogOut size={22} />
                  Cerrar Sesión
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* TOPBAR (Desktop) */}
        <header className="hidden lg:flex items-center justify-between px-12 py-6 bg-transparent">
          <div className="flex items-center gap-4">
            {/* Aquí podrías poner una miga de pan o título dinámico */}
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2.5 text-slate-400 bg-white border border-slate-100 rounded-2xl hover:text-indigo-600 hover:shadow-md transition-all"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                )}
              </button>
              
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                      <h3 className="font-bold text-slate-900">Notificaciones</h3>
                      <span className="text-xs text-slate-400">{unreadCount} nuevas</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notificaciones?.length === 0 ? (
                        <div className="p-4 text-center text-slate-400 text-sm">
                          No tienes notificaciones
                        </div>
                      ) : (
                        notificaciones?.map(notif => (
                          <div 
                            key={notif.id} 
                            className={`p-4 border-b border-slate-50 last:border-b-0 hover:bg-slate-50 transition-colors cursor-pointer ${!notif.leida ? 'bg-indigo-50/30' : ''}`}
                            onClick={() => {
                              if (!notif.leida) leerNotificacion(notif.id);
                              if (notif.urlReferencia) navigate(notif.urlReferencia);
                              setIsNotificationsOpen(false);
                            }}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="text-sm font-bold text-slate-900">{notif.titulo}</h4>
                              <span className="text-[10px] text-slate-400">{new Date(notif.fechaCreacion).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-slate-500">{notif.mensaje}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex items-center gap-3 px-3 py-1.5 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black">
                {user?.nombre?.charAt(0) || 'E'}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-sm font-black text-slate-900 leading-none mb-1">
                  {user?.nombre || 'Estudiante'}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Estudiante
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT BOX */}
        <div className="flex-1 overflow-y-auto pt-16 lg:pt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
