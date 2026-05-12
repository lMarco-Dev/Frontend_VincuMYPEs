import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { httpClient } from '@shared/api/httpClient';
import PostularButton from '../../features/proyecto-postular/PostularButton';
import { ChevronLeft, Calendar, MapPin, Building2, BookOpen, Clock, Target, CheckCircle2, Cpu, ClipboardList, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const getAreaStyle = (area) => {
  switch (area) {
    case 'DESARROLLO_WEB':
      return 'bg-blue-50 text-blue-600';
    case 'DESARROLLO_MOVIL':
      return 'bg-emerald-50 text-emerald-600';
    case 'DESARROLLO_SOFTWARE':
      return 'bg-violet-50 text-violet-600';
    case 'BASE_DE_DATOS':
      return 'bg-amber-50 text-amber-600';
    case 'ANALISIS_DATOS':
      return 'bg-pink-50 text-pink-600';
    case 'SOPORTE_TI':
      return 'bg-slate-100 text-slate-600';
    default:
      return 'bg-indigo-50 text-indigo-600';
  }
};

const DetalleProyectoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [yaPostulado, setYaPostulado] = React.useState(false);
  const [mensaje, setMensaje] = React.useState('');
  const [linkCv, setLinkCv] = React.useState('');
  const [showForm, setShowForm] = React.useState(false);

  const { data: proyecto, isLoading, isError } = useQuery({
    queryKey: ['proyecto', id],
    queryFn: async () => {
      const response = await httpClient.get(`/proyectos/${id}`);
      return response.data;
    }
  });

  if (isLoading) return <div className="p-12 text-center text-slate-500">Cargando detalle del proyecto...</div>;
  if (isError) return <div className="p-12 text-center text-red-500">Error al cargar el proyecto.</div>;
  if (!proyecto) return <div className="p-12 text-center text-slate-500">Proyecto no encontrado.</div>;

  const manejarPostulacion = async (e) => {
    e.preventDefault();
    try {
      await httpClient.post(`/proyectos/${id}/postular`, { 
        mensajePostulacion: mensaje,
        archivoAdjunto: linkCv
      });
      setYaPostulado(true);
      setShowForm(false);
    } catch (error) {
      alert("Error al postular: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="">
      <div className="max-w-5xl mx-auto p-6 lg:p-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold mb-8 transition-colors group"
        >
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
          Volver a la lista
        </button>

        <div className="bg-white rounded-[3rem] p-8 lg:p-16 border border-slate-100 shadow-xl shadow-slate-100/50">
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-black uppercase tracking-widest">
                {proyecto.mypeNombre}
              </span>
              {proyecto.areaSistemas && (
                <span className={`px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest flex items-center gap-1 ${getAreaStyle(proyecto.areaSistemas)}`}>
                  <Cpu size={14} />
                  {proyecto.areaSistemas}
                </span>
              )}
              <span className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                <Calendar size={16} />
                Publicado recientemente
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-8">
              {proyecto.titulo}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DetailInfo icon={<MapPin className="text-indigo-500" />} label="Ubicación" value="Remoto" />
              <DetailInfo icon={<Clock className="text-orange-500" />} label="Cupos" value={`${proyecto.cupos} disponibles`} />
              <DetailInfo icon={<Building2 className="text-emerald-500" />} label="Empresa" value={proyecto.mypeNombre} />
              <DetailInfo icon={<Calendar className="text-blue-500" />} label="Fecha Inicio" value={proyecto.fechaInicio || 'Por definir'} />
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                    <BookOpen size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Descripción del Proyecto</h2>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
                  {proyecto.descripcion}
                </p>
              </section>

              {proyecto.objetivo && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-sky-50 rounded-xl text-sky-600">
                      <Target size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Objetivo</h2>
                  </div>
                  <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
                    {proyecto.objetivo}
                  </p>
                </section>
              )}
 
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                    <ClipboardList size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Requisitos</h2>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
                  {proyecto.requisitos}
                </p>
              </section>

              {proyecto.entregablesSugeridos && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                      <Package size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Entregables Sugeridos</h2>
                  </div>
                  <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
                    {proyecto.entregablesSugeridos}
                  </p>
                </section>
              )}
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky top-8 bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6">¿Te interesa?</h3>
                <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                  Asegúrate de cumplir con los requisitos antes de enviar tu postulación. Tienes hasta el <strong>{proyecto.fechaLimite}</strong>.
                </p>
                
                {/* BOTÓN DE POSTULAR SIMULADO */}
                {!yaPostulado ? (
                  !showForm ? (
                    <button
                      onClick={() => setShowForm(true)}
                      className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                    >
                      Postular ahora
                    </button>
                  ) : (
                    <form onSubmit={manejarPostulacion} className="space-y-4">
                      <textarea
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        placeholder="Escribe un mensaje breve..."
                        className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        rows="4"
                        required
                      />
                      <input
                        type="url"
                        value={linkCv}
                        onChange={(e) => setLinkCv(e.target.value)}
                        placeholder="Enlace de tu CV o Portafolio (ej: Google Drive)"
                        className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowForm(false)}
                          className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700"
                        >
                          Enviar
                        </button>
                      </div>
                    </form>
                  )
                ) : (
                  <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-center font-bold text-sm flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} />
                    ¡Ya postulaste con éxito!
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailInfo = ({ icon, label, value }) => (
  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
    <div className="flex items-center gap-2 mb-1">
      {icon}
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-slate-700 font-bold">{value}</span>
  </div>
);

export default DetalleProyectoPage;
