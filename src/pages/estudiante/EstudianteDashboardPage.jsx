import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { 
  Rocket, 
  Search, 
  User, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight,
  Sparkles,
  Trophy,
  History,
  MousePointer2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const EstudianteDashboardPage = () => {
  const { user } = useAuthStore();

  const stats = [
    { 
      label: 'Postulaciones', 
      value: '0', 
      icon: <Rocket className="text-orange-500" />, 
      color: 'bg-orange-50',
      trend: 'En espera'
    },
    { 
      label: 'Aceptados', 
      value: '0/2', 
      icon: <CheckCircle2 className="text-emerald-500" />, 
      color: 'bg-emerald-50',
      trend: 'Meta semestral'
    },
    { 
      label: 'Horas Realizadas', 
      value: '0h', 
      icon: <Clock className="text-indigo-500" />, 
      color: 'bg-indigo-50',
      trend: 'Meta: 160h'
    },
  ];

  const recentActivity = [
    { id: 1, type: 'status', message: 'Tu cuenta ha sido verificada exitosamente', time: 'Hace 2 días', icon: <Sparkles size={16} /> },
    { id: 2, type: 'welcome', message: '¡Bienvenido a VincuMYPEs! Explora proyectos para empezar.', time: 'Hace 3 días', icon: <MousePointer2 size={16} /> },
  ];

  return (
    <div className="p-6 lg:p-12 lg:pt-0">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* WELCOME HERO - BENTO STYLE */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-indigo-600 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200"
          >
            <div className="relative z-10">
              <span className="px-4 py-1.5 bg-indigo-500/30 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block border border-indigo-400/30">
                Panel de Estudiante
              </span>
              <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                ¡Hola, {user?.nombre?.split(' ')[0] || 'Estudiante'}! 👋
              </h1>
              <p className="text-indigo-100 text-lg max-w-xl mb-10 leading-relaxed font-medium">
                Tienes nuevas oportunidades esperándote. Impulsa tu carrera trabajando en proyectos reales con MYPEs locales.
              </p>
              
              <Link 
                to="/proyectos"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black hover:bg-indigo-50 transition-all group"
              >
                <Search size={20} className="group-hover:scale-110 transition-transform" />
                Explorar Proyectos
                <ArrowUpRight size={18} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </Link>
            </div>

            {/* Decoración Abstracta */}
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[140%] bg-indigo-500/20 rounded-full blur-3xl rotate-12" />
            <div className="absolute bottom-[-10%] left-[20%] w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center relative group"
          >
            <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform duration-500">
              <Trophy size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Próxima Meta</h3>
            <p className="text-slate-500 text-sm font-medium mb-6">Completa tu primera postulación para obtener tu badge de "Iniciador".</p>
            <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '15%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="bg-amber-400 h-full rounded-full"
              />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">15% Completado</p>
          </motion.div>
        </section>

        {/* STATS & ACTIVITY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* STATS CARDS */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 ${stat.color} rounded-2xl`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-50">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-400" />
                    {stat.trend}
                  </span>
                </div>
              </motion.div>
            ))}

            {/* QUICK ACTIONS CARD */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="md:col-span-3 bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-wrap items-center justify-between gap-6"
            >
              <div>
                <h3 className="text-xl font-bold mb-1">Accesos Rápidos</h3>
                <p className="text-slate-400 text-sm">Gestiona tus documentos y perfil al instante.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <QuickButton label="Mi CV" icon={<User size={16} />} />
                <QuickButton label="Horas" icon={<Clock size={16} />} />
                <Link to="/perfil">
                  <QuickButton label="Ajustes" icon={<MousePointer2 size={16} />} isPrimary />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* RECENT ACTIVITY SIDEBAR */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1 bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm flex flex-col"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                <History size={20} />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Actividad</h3>
            </div>

            <div className="space-y-8 flex-1">
              {recentActivity.map((activity, i) => (
                <div key={activity.id} className="relative flex gap-4">
                  {i !== recentActivity.length - 1 && (
                    <div className="absolute left-4 top-10 w-px h-10 bg-slate-100" />
                  )}
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0 z-10 border-2 border-white">
                    {activity.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 leading-tight mb-1">{activity.message}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-8 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              Ver todo el historial
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const QuickButton = ({ label, icon, isPrimary }) => (
  <button className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all ${
    isPrimary 
      ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
      : 'bg-white/10 text-white hover:bg-white/20'
  }`}>
    {icon}
    {label}
  </button>
);

export default EstudianteDashboardPage;
