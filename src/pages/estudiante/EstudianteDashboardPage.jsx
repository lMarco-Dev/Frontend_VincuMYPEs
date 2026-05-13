import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useMisPostulaciones } from '../../features/postulaciones-list/useMisPostulaciones';
import { useCertificados } from '../../features/certificados/useCertificados';
import { useNotificaciones } from '../../features/notificaciones/useNotificaciones';
import {
  Rocket,
  Search,
  User,
  Clock,
  CheckCircle,
  ArrowRight,
  Send,
  Handshake,
  Mail,
  ChevronRight,
  Square,
  FileText,
  Headphones,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const EstudianteDashboardPage = () => {
  const { user } = useAuthStore();
  
  // Consulta de datos reales
  const { data: postulaciones, isLoading: loadingPostulaciones } = useMisPostulaciones();
  const { data: certificados, isLoading: loadingCertificados } = useCertificados();
  const { data: notificaciones, isLoading: loadingNotificaciones } = useNotificaciones();

  const totalPostulaciones = postulaciones?.length || 0;
  const aceptados = postulaciones?.filter(p => p.estado === 'ACEPTADO' || p.estado === 'Aceptado').length || 0;
  const totalCertificados = certificados?.length || 0;
  
  // Mostrar las últimas 3 notificaciones como actividad reciente
  const activityItems = notificaciones?.slice(0, 3) || [];

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Layout de una sola columna */}
      <div className="flex flex-col gap-6">
        
        {/* Welcome Hero Banner */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-primary-container p-8 lg:p-12 text-white shadow-lg min-h-[240px] flex flex-col justify-center"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold mb-2">¡Hola, {user?.nombre?.split(' ')[0] || 'Estudiante'}!</h1>
            <p className="text-lg opacity-90 max-w-md">Tu camino hacia el crecimiento profesional continúa. Tienes {totalPostulaciones === 0 ? 'nuevas' : totalPostulaciones} ofertas que coinciden con tu perfil.</p>
            <div className="mt-6">
              <Link to="/proyectos" className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full font-bold hover:shadow-xl transition-all active:scale-95">
                Ver Proyectos Recomendados
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          
          <div className="absolute right-8 bottom-0 hidden md:block">
            <img 
              alt="Students collaborating" 
              className="w-64 h-48 object-cover rounded-t-3xl border-x-4 border-t-4 border-white/20" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgDGnqoJyGyctQiqb55CMi_jFc76Xz1O-q1voVfygz5JKdfcq3bhhYCAJyc87q5Py6r-kMPP_HBDWiAVb5hYCNneLMLbwpcE8t6d-9sAaKzi22CNcdZhKv4H2C0NpCIL5Ucz0pzsX26OlY403w0uoA1-3EM0gNIzejLssTnpyh4mLlS3emERcQi7_X8ftCA99_2WNDnTFg4JMm1qyouNp2EP3vazLywYnulM-5Un48J3QW3ob6Wi6cfFvjEwhHWUZXI8vfA6y636Y" 
            />
          </div>
        </motion.section>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Postulaciones */}
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-secondary-container rounded-xl text-on-secondary-container">
                <Send size={24} />
              </div>
              <span className="text-xs font-bold text-primary bg-primary-fixed-dim px-2 py-1 rounded-md">Realizadas</span>
            </div>
            <p className="text-on-surface-variant text-sm font-bold">Postulaciones</p>
            <p className="text-3xl font-extrabold text-on-surface">{loadingPostulaciones ? '...' : totalPostulaciones}</p>
          </div>

          {/* Aceptados */}
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-tertiary-fixed rounded-xl text-tertiary">
                <Handshake size={24} />
              </div>
              <span className="text-xs font-bold text-tertiary bg-tertiary-fixed px-2 py-1 rounded-md">Éxito</span>
            </div>
            <p className="text-on-surface-variant text-sm font-bold">Aceptados</p>
            <p className="text-3xl font-extrabold text-on-surface">{loadingPostulaciones ? '...' : aceptados}</p>
          </div>

          {/* Certificados */}
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-fixed rounded-xl text-primary">
                <Award size={24} />
              </div>
              <span className="text-xs font-bold text-on-secondary-container bg-secondary-container px-2 py-1 rounded-md">Validados</span>
            </div>
            <p className="text-on-surface-variant text-sm font-bold">Certificados</p>
            <p className="text-3xl font-extrabold text-on-surface">{loadingCertificados ? '...' : totalCertificados}</p>
          </div>
        </div>

        {/* Recent Activity Section */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-6 lg:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-on-surface">Actividad Reciente</h2>
            <button className="text-primary font-bold hover:underline">Ver todo</button>
          </div>
          <div className="flex flex-col gap-4">
            {loadingNotificaciones ? (
              <div className="p-4 text-center text-slate-500">Cargando actividad...</div>
            ) : activityItems.length === 0 ? (
              <div className="p-4 text-center text-slate-500">No hay actividad reciente</div>
            ) : (
              activityItems.map((item, index) => (
                <div key={item.id || index} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-surface-container transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary shrink-0">
                    <Mail size={24} />
                  </div>
                  <div className="grow">
                    <p className="text-on-surface text-sm"><span className="font-bold">{item.titulo}</span> {item.mensaje}</p>
                    <p className="text-xs text-on-surface-variant">{new Date(item.fechaCreacion).toLocaleDateString()}</p>
                  </div>
                  <ChevronRight size={20} className="text-outline opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default EstudianteDashboardPage;
