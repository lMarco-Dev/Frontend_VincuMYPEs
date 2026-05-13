import React, { useState } from 'react';
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
  Loader2,
  Globe,
  ExternalLink,
  Save,
  X,
  Briefcase,
  Layers,
  ArrowRight,
  Send,
  Zap,
  PenLine
} from 'lucide-react';
import { usePerfil, useUpdatePerfil } from '@features/perfil/usePerfil';

const PerfilPage = () => {
  const { data: userProfile, isLoading, isError, error } = usePerfil();
  const { mutate: updatePerfil, isPending: isUpdating } = useUpdatePerfil();
  const { rol: storeRol } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    portafolioUrl: '',
    linkedinUrl: '',
    telefono: ''
  });

  // Cargar datos en el formulario cuando se activa la edición
  const handleStartEdit = () => {
    setFormData({
      bio: userProfile?.bio || '',
      skills: userProfile?.skills || '',
      portafolioUrl: userProfile?.portafolioUrl || '',
      linkedinUrl: userProfile?.linkedinUrl || '',
      telefono: userProfile?.telefono || ''
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePerfil(formData, {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
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

  const user = userProfile || {};
  const displayRol = user.rol || storeRol || 'Estudiante';

  // Datos simulados originales del proyecto
  const academicInfo = {
    universidad: "Universidad Privada del Norte",
    carrera: "Ingeniería de Sistemas Computacionales",
    codigo: "N00012345",
    ciclo: "8vo Ciclo"
  };

  const locationInfo = {
    ciudad: "Cajamarca",
    pais: "Perú",
    sector: "Cajamarca / Disponible para remoto"
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Hero Profile Section */}
      <div className="relative mb-8">
        <div className="h-48 md:h-64 rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-container opacity-90"></div>
          <img 
            alt="Banner de perfil" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYjYJkP4xAZ8n__tM-qKgUix2twTe1ZZt3I4g0N1gAsH5-CHnIYzqqwO5KltmZ39MAbvAobujp5Cs2dYtm02_7JrvZSkM_9gmyltfY_Yw94EOYmY8TUWAGi2FtyIZbMuLnorgO-PMehGQQqeW6BfGSlf8Rv-fWbbS5AShaAyb5_4BJERSZzkQ3nueWO51YRz-8jrzWdqIukdmHGWN8AMxu0kblFYNBA4p6EUqRZSVXJMoExg4xmA6itA4KbreNBPDIheJ31CLUhp4" 
          />
          <button className="absolute bottom-4 right-4 bg-surface/20 backdrop-blur-md text-white border border-white/30 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-surface/30 transition-all font-bold text-sm">
            <PenLine size={18} />
            Editar Portada
          </button>
        </div>
        
        <div className="px-4 md:px-8 -mt-16 md:-mt-20 relative flex flex-col md:flex-row items-end gap-4 md:gap-6">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-8 border-background overflow-hidden shadow-lg bg-white">
              {user.fotoPerfil ? (
                <img 
                  alt="Foto de perfil" 
                  className="w-full h-full object-cover" 
                  src={user.fotoPerfil} 
                />
              ) : (
                <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-5xl font-black">
                  {user.nombre?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <button className="absolute bottom-2 right-2 p-2 bg-primary text-white rounded-xl shadow-lg border-4 border-background hover:scale-105 transition-transform">
              <Camera size={20} />
            </button>
          </div>
          
          <div className="flex-1 pb-2 text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-on-background">{user.nombre || 'Usuario'}</h1>
            <p className="text-base text-primary font-bold flex items-center justify-center md:justify-start gap-2">
              {displayRol}
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
              {academicInfo.universidad}
            </p>
          </div>
          
          <div className="pb-2 flex gap-2">
            {!isEditing ? (
              <button 
                onClick={handleStartEdit}
                className="bg-primary text-white px-6 h-12 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95"
              >
                <Edit2 size={18} />
                Editar Perfil
              </button>
            ) : (
              <button 
                onClick={handleCancelEdit}
                className="bg-red-500 text-white px-6 h-12 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95"
              >
                <X size={18} />
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dashboard Layout (2 Columns for wide screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Personal & Professional Info) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Bio & Professional Summary */}
          <section className="bg-surface-container-lowest p-6 lg:p-8 rounded-3xl shadow-sm border border-outline-variant/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <User className="text-primary" size={24} />
                Perfil Profesional
              </h3>
            </div>
            
            {!isEditing ? (
              <>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                  {user.bio || 'Cuéntanos un poco sobre ti...'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-surface-container-low">
                    <GraduationCap className="text-primary mt-1" size={20} />
                    <div>
                      <span className="font-bold text-on-surface-variant block uppercase text-[10px]">Grado</span>
                      <span className="text-sm font-bold">{academicInfo.ciclo}, {academicInfo.carrera}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-surface-container-low">
                    <Briefcase className="text-primary mt-1" size={20} />
                    <div>
                      <span className="font-bold text-on-surface-variant block uppercase text-[10px]">Interés</span>
                      <span className="text-sm font-bold">Consultoría Estratégica</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">Biografía</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    rows="3"
                    placeholder="Cuéntanos un poco sobre ti..."
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">Habilidades (separadas por comas)</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    placeholder="React, Node, CSS..."
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Guardar Cambios
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Academic Journey (Timeline Style) */}
          <section className="bg-surface-container-lowest p-6 lg:p-8 rounded-3xl shadow-sm border border-outline-variant/30">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
              <GraduationCap className="text-primary" size={24} />
              Trayectoria Académica
            </h3>
            <div className="space-y-4 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-outline-variant">
              {/* Entry 1 */}
              <div className="relative pl-10">
                <div className="absolute left-1.5 top-1 w-5 h-5 rounded-full bg-primary-container border-4 border-background"></div>
                <div className="p-4 bg-surface-container border border-outline-variant/20 rounded-2xl hover:translate-y-[-2px] transition-all">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-lg font-bold text-primary">{academicInfo.carrera}</h4>
                    <span className="text-xs font-bold text-on-surface-variant bg-surface px-3 py-1 rounded-full border border-outline-variant">Presente</span>
                  </div>
                  <p className="text-sm font-bold mb-1">{academicInfo.universidad}</p>
                  <p className="text-xs text-on-surface-variant">Código: {academicInfo.codigo} | Ciclo: {academicInfo.ciclo}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Portfolio / Projects (Bento-style grid) */}
          <section className="bg-surface-container-lowest p-6 lg:p-8 rounded-3xl shadow-sm border border-outline-variant/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Layers className="text-primary" size={24} />
                Portafolio de Proyectos
              </h3>
              <button className="text-primary font-bold flex items-center gap-1 hover:underline text-sm">
                Ver todos
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer">
                <img 
                  alt="Dashboard Proyecto" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBD2ObASeZRMUAerk31NZWNG7CRaFS-zLiZ_AMUE9m3sqkqkJTo0eTaNxwrrCRfadKF4YBzXCrCFjX48AToH11Rv1-_AJWEQE04o5dmHqQYDXxBl-42g4ZrlkO58txiWXXFMsOP2RzoKw1sXxpesLOOb07lmHWJSlG8lufHW9OH4YtkqkGC_Xr0CnrBD7xUXHIN7Qv8e8VoAS3ztTX6WIoiRnQvkGJXLTf8pAYpIloBNpDGnUtCbZkqev-AsmuOrqIqZhOkBHvz6mI" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <h5 className="text-white font-bold">Proyecto Demo 1</h5>
                  <p className="text-white/80 text-xs">Descripción corta del proyecto</p>
                </div>
              </div>
              <div className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer">
                <img 
                  alt="Análisis de datos" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPxmaDcjTqKpp9iZbSAHyWsv22PKChCNh070a91g8nqDN76eBw4cK0vw8UOsWfMlWJzm5j52HjdtwjtWb6P_S4mE6gQ91r4ZsLflys0NTK_vKSFCJY41tlvAs3BDveazWvOsShoHdHKxcM5z-qGPGCLWztfYb5822xNVclX1RHjd0dtH5qQpZ2NNXtmmk5YxpoC5OPucQwJ5X8fGkFOJksbJ-iInk4Ycsay3rJbUJy6Yc-xEVWMDxwgPByZYP16ACffFRpL9pGbw4" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <h5 className="text-white font-bold">Proyecto Demo 2</h5>
                  <p className="text-white/80 text-xs">Visualización de KPIS</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (Sidebar Stats, Location, Skills) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Location Card */}
          <section className="bg-surface-container-lowest p-6 lg:p-8 rounded-3xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="text-primary" size={24} />
              Ubicación
            </h3>
            <div className="h-40 rounded-2xl bg-surface-container mb-4 overflow-hidden relative border border-outline-variant/20">
              <img 
                alt="Mapa Ubicación" 
                className="w-full h-full object-cover grayscale opacity-50" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTixQ44kSP9eqrHH2_U6zr5-gHl9PUMq0dTbxbACXx2BZYBPMCEP2jGGxeMIoPc-SH2N2wv3woJmVDcIaFqECnOj8YPzAQ_VpFxfF-B75EmsFBr3ggZSO8oRBkNd_pWJUyfeBRGuuyBCMXNGKm6_QZRuuvDXb-TzDZtC97hSJyNiOl9TDEtmZs4X6CajynC-83v5EGQIOZ8QnWE04hRIVDb-CDynX10kwY4k6ijgouH8hdnGC3o0C2Xn9JZxonnUmnH9UApGt42F0" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
                  <MapPin size={16} className="text-white" />
                </div>
              </div>
            </div>
            <p className="text-sm text-on-surface-variant flex items-center gap-1">
              <strong>{locationInfo.ciudad},</strong> {locationInfo.pais}
            </p>
            <p className="text-xs text-slate-400">{locationInfo.sector}</p>
          </section>

          {/* Professional Links */}
          <section className="bg-surface-container-lowest p-6 lg:p-8 rounded-3xl shadow-sm border border-outline-variant/30">
            <h3 className="text-xl font-bold mb-4">Conectividad</h3>
            <div className="space-y-2">
              <a 
                className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-primary/10 transition-colors group" 
                href={user.linkedinUrl || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <div className="flex items-center gap-2">
                  <Globe size={18} className="text-primary" />
                  <span className="text-sm font-medium">LinkedIn Profile</span>
                </div>
                <ExternalLink size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-primary/10 transition-colors group" 
                href={`mailto:${user.email || ''}`}
              >
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-primary" />
                  <span className="text-sm font-medium">{user.email || 'No disponible'}</span>
                </div>
                <Send size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </a>
              {user.telefono && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <Phone size={18} className="text-primary" />
                    <span className="text-sm font-medium">{user.telefono}</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Skills & Tags */}
          <section className="bg-surface-container-lowest p-6 lg:p-8 rounded-3xl shadow-sm border border-outline-variant/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Habilidades</h3>
              <Zap size={24} className="text-primary" />
            </div>
            <div className="flex flex-wrap gap-2">
              {user.skills ? (
                user.skills.split(',').map((skill, index) => (
                  <span key={index} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs">
                    {skill.trim()}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">No registradas</span>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;
