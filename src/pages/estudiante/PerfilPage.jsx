import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { User, Mail, Phone, GraduationCap, MapPin, Edit2, Loader2, Globe, ExternalLink, Save, X, Briefcase, Layers, ArrowRight, Send, Zap, PenLine, CheckCircle2 } from 'lucide-react';
import { usePerfil, useUpdatePerfil } from '@features/perfil/usePerfil';
import { useMisPostulaciones } from '@features/postulaciones-list/useMisPostulaciones';
import { Link } from 'react-router-dom';

const getSkillColor = (skill) => {
  const s = skill.toLowerCase();
  if (['react','vue','angular','html','css','javascript','typescript'].some(k => s.includes(k))) return 'bg-blue-50 text-blue-700 border-blue-100';
  if (['java','spring','kotlin'].some(k => s.includes(k))) return 'bg-orange-50 text-orange-700 border-orange-100';
  if (['python','django','flask','fastapi'].some(k => s.includes(k))) return 'bg-yellow-50 text-yellow-700 border-yellow-100';
  if (['mysql','postgres','mongodb','sql'].some(k => s.includes(k))) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  if (['docker','git','linux','aws'].some(k => s.includes(k))) return 'bg-slate-100 text-slate-700 border-slate-200';
  return 'bg-indigo-50 text-indigo-700 border-indigo-100';
};

const ProfileRing = ({ pct }) => {
  const r = 44, cx = 52, cy = 52, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#6366f1';
  return (
    <svg width="104" height="104" className="rotate-[-90deg]">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="8" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="8" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
    </svg>
  );
};

const PerfilPage = () => {
  const { data: userProfile, isLoading, isError, error } = usePerfil();
  const { mutate: updatePerfil, isPending: isUpdating } = useUpdatePerfil();
  const { rol: storeRol } = useAuthStore();
  const isEstudiante = storeRol === 'ESTUDIANTE';
  const { data: postulaciones = [] } = useMisPostulaciones({ enabled: isEstudiante });
  const proyectosAceptados = postulaciones.filter(p => p.estado === 'ACEPTADO');

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ bio: '', skills: '', portafolioUrl: '', linkedinUrl: '', telefono: '' });

  const handleStartEdit = () => {
    setFormData({ bio: userProfile?.bio || '', skills: userProfile?.skills || '', portafolioUrl: userProfile?.portafolioUrl || '', linkedinUrl: userProfile?.linkedinUrl || '', telefono: userProfile?.telefono || '' });
    setIsEditing(true);
  };
  const handleCancelEdit = () => setIsEditing(false);
  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = (e) => { e.preventDefault(); updatePerfil(formData, { onSuccess: () => setIsEditing(false) }); };

  if (isLoading) return (
    <div className="p-12 flex items-center justify-center min-h-[400px]">
      <div className="text-slate-500 flex items-center gap-2"><Loader2 className="animate-spin" size={22} /><span className="font-semibold text-sm">Cargando perfil...</span></div>
    </div>
  );

  if (isError) return (
    <div className="p-12 flex items-center justify-center min-h-[400px]">
      <div className="text-red-500 bg-red-50 p-5 rounded-2xl border border-red-100 max-w-md text-center">
        <p className="font-bold mb-1">Error al cargar el perfil</p>
        <p className="text-sm">{error.response?.data?.message || error.message || 'Error desconocido'}</p>
      </div>
    </div>
  );

  const user = userProfile || {};
  const displayRol = user.rol || storeRol || 'Estudiante';
  const academicInfo = { universidad: user.universidad || 'No especificada', carrera: user.carrera || 'No especificada', codigo: user.codigo || 'No especificado', ciclo: user.ciclo || 'No especificado' };
  const locationInfo = { ciudad: user.ciudad || 'No especificada', pais: user.pais || 'No especificado', sector: user.sector || 'No especificado' };

  let completitud = 20;
  if (user.bio) completitud += 20;
  if (user.skills && user.skills.length > 0) completitud += 20;
  if (user.telefono) completitud += 20;
  if (user.linkedinUrl || user.portafolioUrl) completitud += 20;

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">

      {/* Hero Mesh Banner */}
      <div className="relative mb-8">
        <div className="h-48 md:h-56 rounded-[2.5rem] overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#1a2d42] via-[#1e3a5f] to-[#4648d4]" />
          <div className="absolute top-[-20%] right-[-5%] w-72 h-72 bg-[#4648d4]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-5%] w-56 h-56 bg-blue-400/10 rounded-full blur-2xl" />
          {isEstudiante && (
            <button className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-white/20 transition-all font-bold text-xs">
              <PenLine size={14} />Editar Portada
            </button>
          )}
        </div>

        <div className="px-4 md:px-8 -mt-14 relative flex flex-col md:flex-row items-end gap-4 md:gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl border-4 border-white shadow-xl bg-white overflow-hidden">
              {user.fotoPerfil ? (
                <img alt="Foto de perfil" className="w-full h-full object-cover" src={user.fotoPerfil} />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[#1e3a5f] to-[#4648d4] flex items-center justify-center text-white text-4xl font-black">
                  {user.nombre?.charAt(0) || 'U'}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 pb-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{user.nombre || 'Usuario'}</h1>
            <p className="text-sm font-bold text-primary flex items-center gap-2 mt-0.5">
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-extrabold uppercase">{displayRol}</span>
              {isEstudiante && <span className="text-slate-500 font-semibold">{academicInfo.universidad}</span>}
            </p>
          </div>

          <div className="pb-2">
            {isEstudiante && (
              <button onClick={isEditing ? handleCancelEdit : handleStartEdit}
                className={`${isEditing ? 'bg-red-500' : 'bg-primary'} text-white px-5 h-11 rounded-2xl font-bold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95 text-sm`}>
                {isEditing ? <X size={16} /> : <Edit2 size={16} />}
                <span>{isEditing ? 'Cancelar' : 'Editar Perfil'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">

          {/* Bio & Professional */}
          {isEstudiante && (
            <section className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-primary"><User size={18} /></div>
                <h3 className="text-lg font-extrabold text-slate-900">Perfil Profesional</h3>
              </div>

              {!isEditing ? (
                <div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-5 font-semibold">
                    {user.bio || <span className="italic text-slate-400">Cuéntanos un poco sobre ti... (haz clic en "Editar Perfil")</span>}
                  </p>
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <GraduationCap className="text-primary mt-0.5 shrink-0" size={18} />
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-0.5">Grado Académico</span>
                      <span className="text-sm font-bold text-slate-800">{academicInfo.ciclo} · {academicInfo.carrera}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1.5">Biografía</label>
                    <textarea name="bio" value={formData.bio} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm resize-none" rows="3" placeholder="Cuéntanos un poco sobre ti..." />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1.5">Habilidades (separadas por comas)</label>
                    <input type="text" name="skills" value={formData.skills} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm" placeholder="React, Node.js, Java..." />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1.5">Teléfono</label>
                      <input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm" placeholder="+51 987654321" />
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1.5">LinkedIn URL</label>
                      <input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm" placeholder="https://linkedin.com/in/..." />
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1.5">Portafolio URL</label>
                      <input type="url" name="portafolioUrl" value={formData.portafolioUrl} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm" placeholder="https://github.com/..." />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" disabled={isUpdating} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 text-sm">
                      {isUpdating ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              )}
            </section>
          )}

          {/* Academic Timeline */}
          {isEstudiante && (
            <section className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-primary"><GraduationCap size={18} /></div>
                <h3 className="text-lg font-extrabold text-slate-900">Trayectoria Académica</h3>
              </div>
              <div className="relative space-y-4 before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-100">
                <div className="relative pl-12">
                  <div className="absolute left-3.5 top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-white shadow" />
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:-translate-y-0.5 transition-transform">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-base font-extrabold text-primary">{academicInfo.carrera}</h4>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={10} />Presente
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 mb-1">{academicInfo.universidad}</p>
                    <p className="text-xs text-slate-400 font-semibold">Código: {academicInfo.codigo} · Ciclo: {academicInfo.ciclo}</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Portfolio */}
          {isEstudiante && (
            <section className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-primary"><Layers size={18} /></div>
                  <h3 className="text-lg font-extrabold text-slate-900">Portafolio de Proyectos</h3>
                </div>
                <Link to="/mis-postulaciones" className="text-primary font-bold flex items-center gap-1 hover:underline text-xs">Ver todos <ArrowRight size={14} /></Link>
              </div>
              {proyectosAceptados.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {proyectosAceptados.slice(0, 4).map((proyecto, index) => (
                    <Link to={`/proyectos/${proyecto.proyectoId}`} key={index} className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer bg-slate-900 border border-slate-100">
                      <div className={`absolute inset-0 bg-gradient-to-br ${index % 2 === 0 ? 'from-[#1e3a5f] to-[#4648d4]' : 'from-slate-700 to-slate-900'} group-hover:opacity-90 transition-opacity`} />
                      <div className="absolute inset-0 flex flex-col justify-end p-4 z-10 bg-gradient-to-t from-black/80 to-transparent">
                        <h5 className="text-white font-bold text-sm truncate">{proyecto.proyectoTitulo || 'Proyecto'}</h5>
                        <span className="text-[10px] font-bold text-emerald-300 flex items-center gap-1 mt-0.5"><CheckCircle2 size={10} />Aceptado</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center">
                  <p className="text-slate-400 font-semibold text-sm mb-4 max-w-sm">Aún no tienes proyectos completados. ¡Postula a proyectos MYPE para armar tu portafolio!</p>
                  <Link to="/proyectos" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:shadow-md transition-all active:scale-95">
                    Explorar Proyectos <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">

          {/* Profile Completeness Ring */}
          {isEstudiante && (
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="relative mb-3">
                <ProfileRing pct={completitud} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-extrabold text-slate-900">{completitud}%</span>
                </div>
              </div>
              <p className="text-sm font-extrabold text-slate-800 mb-0.5">Completitud del Perfil</p>
              <p className="text-xs text-slate-400 font-semibold">
                {completitud < 60 ? 'Completa tu perfil para destacar' : completitud < 100 ? '¡Casi completo! Agrega más datos' : '¡Perfil completo! Las MYPEs te notarán'}
              </p>
              {completitud < 100 && (
                <button onClick={handleStartEdit} className="mt-4 text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  <Edit2 size={12} /> Completar ahora
                </button>
              )}
            </section>
          )}

          {/* Location */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-primary"><MapPin size={16} /></div>
              <h3 className="text-base font-extrabold text-slate-900">Ubicación</h3>
            </div>
            <p className="text-sm font-bold text-slate-700">{locationInfo.ciudad}, {locationInfo.pais}</p>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">{locationInfo.sector}</p>
          </section>

          {/* Social Badges / Connectivity */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900 mb-4">Conectividad</h3>
            <div className="space-y-2">
              {user.linkedinUrl ? (
                <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#0077B5]/5 border border-[#0077B5]/10 hover:bg-[#0077B5]/10 transition-colors group">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#0077B5] flex items-center justify-center"><Globe size={14} className="text-white" /></div>
                    <span className="text-sm font-bold text-[#0077B5]">LinkedIn</span>
                  </div>
                  <ExternalLink size={14} className="text-[#0077B5]/40 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ) : isEstudiante && (
                <button onClick={handleStartEdit} className="flex items-center justify-between w-full p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors group text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center"><Globe size={14} className="text-slate-400" /></div>
                    <span className="text-sm font-semibold text-slate-400 italic">Vincular LinkedIn</span>
                  </div>
                  <Edit2 size={14} className="text-slate-300" />
                </button>
              )}

              {user.portafolioUrl ? (
                <a href={user.portafolioUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/5 border border-slate-200 hover:bg-slate-900/10 transition-colors group">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center"><Briefcase size={14} className="text-white" /></div>
                    <span className="text-sm font-bold text-slate-800">Portafolio</span>
                  </div>
                  <ExternalLink size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ) : isEstudiante && (
                <button onClick={handleStartEdit} className="flex items-center justify-between w-full p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors group text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center"><Briefcase size={14} className="text-slate-400" /></div>
                    <span className="text-sm font-semibold text-slate-400 italic">Vincular Portafolio</span>
                  </div>
                  <Edit2 size={14} className="text-slate-300" />
                </button>
              )}

              <a href={`mailto:${user.email || ''}`} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-primary/5 transition-colors group">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center"><Mail size={14} className="text-white" /></div>
                  <span className="text-sm font-bold text-slate-700 truncate max-w-[140px]">{user.email || 'No disponible'}</span>
                </div>
                <Send size={14} className="text-slate-300 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {user.telefono ? (
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center"><Phone size={14} className="text-white" /></div>
                  <span className="text-sm font-bold text-slate-700">{user.telefono}</span>
                </div>
              ) : isEstudiante && (
                <button onClick={handleStartEdit} className="flex items-center justify-between w-full p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors group text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center"><Phone size={14} className="text-slate-400" /></div>
                    <span className="text-sm font-semibold text-slate-400 italic">Agregar Teléfono</span>
                  </div>
                  <Edit2 size={14} className="text-slate-300" />
                </button>
              )}
            </div>
          </section>

          {/* Skills with colored chips */}
          {isEstudiante && (
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-primary"><Zap size={16} /></div>
                  <h3 className="text-base font-extrabold text-slate-900">Habilidades</h3>
                </div>
                <button onClick={handleStartEdit} className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5">
                  <Edit2 size={11} />Editar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.skills ? (
                  user.skills.split(',').map((skill, index) => (
                    <span key={index} className={`px-3 py-1.5 rounded-full text-xs font-extrabold border ${getSkillColor(skill)}`}>
                      {skill.trim()}
                    </span>
                  ))
                ) : (
                  <button onClick={handleStartEdit} className="text-xs text-slate-400 italic hover:text-primary transition-colors font-semibold">
                    + Agregar habilidades tecnológicas...
                  </button>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;
