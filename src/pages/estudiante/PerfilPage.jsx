import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  MapPin, 
  Camera,
  Edit2,
  Calendar,
  BadgeCheck,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePerfil } from '@features/perfil/usePerfil';

const PerfilPage = () => {
  const { data: userProfile, isLoading, isError, error } = usePerfil();
  const { rol: storeRol } = useAuthStore(); // Mantenemos el rol del store como fallback

  // Datos simulados para los campos que el backend aún no envía
  // Pero que el diseño ya contempla para cuando estén listos
  const academicInfo = {
    universidad: "Universidad Privada del Norte",
    carrera: "Ingeniería de Sistemas Computacionales",
    codigo: "N00012345",
    ciclo: "8vo Ciclo"
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-12 lg:pt-0 flex items-center justify-center min-h-[400px]">
        <div className="text-slate-500 flex items-center gap-2">
          <Loader2 className="animate-spin" size={24} />
          Cargando perfil...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 lg:p-12 lg:pt-0 flex items-center justify-center min-h-[400px]">
        <div className="text-red-500 bg-red-50 p-4 rounded-xl border border-red-100 max-w-md text-center">
          <p className="font-bold mb-1">Error al cargar el perfil</p>
          <p className="text-sm">{error.response?.data?.message || error.message || "Error desconocido"}</p>
        </div>
      </div>
    );
  }

  // Usamos los datos del perfil si están disponibles, de lo contrario fallback
  const user = userProfile || {};
  const displayRol = user.rol || storeRol || 'Estudiante';

  return (
    <div className="p-6 lg:p-12 lg:pt-0">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-slate-900 tracking-tight mb-2"
          >
            Mi Perfil 👤
          </motion.h1>
          <p className="text-slate-500">Gestiona tu información personal y académica.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLUMNA IZQUIERDA: AVATAR Y ESTADO */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center relative overflow-hidden group">
              <div className="relative z-10">
                <div className="relative inline-block mb-6">
                  {user.fotoPerfil ? (
                    <img 
                      src={user.fotoPerfil} 
                      alt={user.nombre} 
                      className="w-32 h-32 rounded-[2rem] object-cover shadow-inner"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 text-5xl font-black shadow-inner">
                      {user.nombre?.charAt(0) || 'U'}
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg border-4 border-white hover:scale-110 transition-transform">
                    <Camera size={18} />
                  </button>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{user.nombre}</h2>
                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-widest">
                  {displayRol}
                </span>

                <div className="mt-8 pt-8 border-t border-slate-50 flex justify-center gap-4">
                  <div className="text-center">
                    <p className="text-xl font-black text-slate-900">0</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Postulaciones</p>
                  </div>
                  <div className="w-px h-10 bg-slate-100" />
                  <div className="text-center">
                    <p className="text-xl font-black text-slate-900">0</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aceptados</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -mr-16 -mt-16" />
            </div>


          </motion.div>

          {/* COLUMNA DERECHA: FORMULARIO/INFO */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* INFORMACIÓN PERSONAL */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <User className="text-indigo-600" size={24} />
                  Información Personal
                </h3>
                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                  <Edit2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoItem icon={<Mail size={18} />} label="Email" value={user.email || 'No disponible'} />
                <InfoItem icon={<Phone size={18} />} label="Teléfono" value={user.telefono || 'No registrado'} />
                <InfoItem icon={<Calendar size={18} />} label="Miembro desde" value="Mayo 2026" />
                <InfoItem icon={<MapPin size={18} />} label="Ciudad" value="Cajamarca, Perú" />
              </div>
            </div>

            {/* INFORMACIÓN ACADÉMICA */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <GraduationCap className="text-indigo-600" size={24} />
                  Trayectoria Académica
                </h3>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">{academicInfo.universidad}</p>
                    <p className="text-slate-500 font-medium">{academicInfo.carrera}</p>
                    <div className="mt-3 flex gap-3">
                      <span className="px-3 py-1 bg-white rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                        Cód: {academicInfo.codigo}
                      </span>
                      <span className="px-3 py-1 bg-white rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                        {academicInfo.ciclo}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-2 text-slate-400">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-slate-900 font-bold ml-6">{value}</p>
  </div>
);

export default PerfilPage;
