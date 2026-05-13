import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { httpClient } from '@shared/api/httpClient';
import { 
  ChevronLeft, 
  Calendar, 
  MapPin, 
  Building2, 
  BookOpen, 
  Clock, 
  Target, 
  CheckCircle2, 
  Cpu, 
  ClipboardList, 
  Package,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

const getAreaStyle = (area) => {
  switch (area) {
    case 'DESARROLLO_WEB':
      return 'bg-blue-100 text-blue-700';
    case 'DESARROLLO_MOVIL':
      return 'bg-emerald-100 text-emerald-700';
    case 'DESARROLLO_SOFTWARE':
      return 'bg-violet-100 text-violet-700';
    case 'BASE_DE_DATOS':
      return 'bg-amber-100 text-amber-700';
    case 'ANALISIS_DATOS':
      return 'bg-pink-100 text-pink-700';
    case 'SOPORTE_TI':
      return 'bg-slate-100 text-slate-700';
    default:
      return 'bg-indigo-100 text-indigo-700';
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
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      
      {/* Breadcrumb & Navigation */}
      <nav aria-label="Breadcrumb" className="flex text-sm text-on-surface-variant mb-6 items-center gap-2">
        <button 
          onClick={() => navigate('/proyectos')}
          className="hover:text-primary transition-colors flex items-center gap-1 font-bold"
        >
          <ChevronLeft size={16} />
          Explorar Proyectos
        </button>
        <span className="text-outline">/</span>
        <span aria-current="page" className="text-on-surface font-semibold">Detalle de Proyecto</span>
      </nav>

      {/* Page Header / Hero */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {proyecto.areaSistemas && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${getAreaStyle(proyecto.areaSistemas)}`}>
                  <Cpu size={12} />
                  {proyecto.areaSistemas.replace('_', ' ')}
                </span>
              )}
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">Nuevo</span>
            </div>
            <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">{proyecto.titulo}</h1>
            <div className="flex items-center text-on-surface-variant">
              <Building2 size={20} className="mr-2 text-primary" />
              <span className="font-bold">{proyecto.mypeNombre || 'MYPE'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Main Project Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant shadow-sm">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-3">
                <MapPin size={20} />
              </div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Ubicación</p>
              <p className="text-sm font-bold text-on-surface">Remoto</p>
            </div>
            
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant shadow-sm">
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-3">
                <Clock size={20} />
              </div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Cupos</p>
              <p className="text-sm font-bold text-on-surface">{proyecto.cupos} disponibles</p>
            </div>
            
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant shadow-sm">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-3">
                <Calendar size={20} />
              </div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Fecha Inicio</p>
              <p className="text-sm font-bold text-on-surface">{proyecto.fechaInicio || 'Por definir'}</p>
            </div>
            
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant shadow-sm">
              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center mb-3">
                <Calendar size={20} />
              </div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Límite</p>
              <p className="text-sm font-bold text-on-surface">{proyecto.fechaLimite}</p>
            </div>
          </div>

          {/* Content Sections */}
          <section className="bg-surface-container-lowest p-6 lg:p-8 rounded-3xl border border-outline-variant shadow-sm space-y-8">
            
            {/* Descripción */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-primary">
                  <BookOpen size={18} />
                </div>
                <h2 className="text-xl font-bold text-on-surface">Descripción del Proyecto</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed whitespace-pre-line text-sm">
                {proyecto.descripcion}
              </p>
            </div>

            {/* Objetivo */}
            {proyecto.objetivo && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Target size={14} />
                  </div>
                  <h3 className="font-bold text-on-surface text-base">Objetivo</h3>
                </div>
                <p className="text-on-surface-variant text-sm whitespace-pre-line">{proyecto.objetivo}</p>
              </div>
            )}

            {/* Requisitos */}
            {proyecto.requisitos && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <ClipboardList size={14} />
                  </div>
                  <h3 className="font-bold text-on-surface text-base">Requisitos</h3>
                </div>
                <p className="text-on-surface-variant text-sm whitespace-pre-line">{proyecto.requisitos}</p>
              </div>
            )}

            {/* Entregables */}
            {proyecto.entregablesSugeridos && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                    <Package size={14} />
                  </div>
                  <h3 className="font-bold text-on-surface text-base">Entregables Sugeridos</h3>
                </div>
                <p className="text-on-surface-variant text-sm whitespace-pre-line">{proyecto.entregablesSugeridos}</p>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN: Sticky CTA & Timeline */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            
            {/* CTA Card */}
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-md">
              <h3 className="text-xl font-bold text-on-surface mb-2">¿Te interesa?</h3>
              <p className="text-sm text-on-surface-variant mb-6">Asegúrate de cumplir con los requisitos antes de enviar tu postulación. El proceso de selección iniciará pronto.</p>
              
              <div className="bg-surface-container p-4 rounded-2xl mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="text-primary mt-0.5" size={18} />
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase">Fecha Límite</p>
                    <p className="text-sm font-bold text-primary">{proyecto.fechaLimite}</p>
                  </div>
                </div>
              </div>

              {/* Formulario / Botón de Postulación */}
              {!yaPostulado ? (
                !showForm ? (
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Postular ahora
                  </button>
                ) : (
                  <form onSubmit={manejarPostulacion} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-on-surface-variant mb-1 block">Mensaje para la empresa</label>
                      <textarea
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        placeholder="Escribe un mensaje breve de por qué te interesa el proyecto..."
                        className="w-full p-3 border border-outline-variant rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
                        rows="4"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-on-surface-variant mb-1 block">Enlace de CV o Portafolio</label>
                      <input
                        type="url"
                        value={linkCv}
                        onChange={(e) => setLinkCv(e.target.value)}
                        placeholder="Ej: Google Drive, LinkedIn o Portafolio"
                        className="w-full p-3 border border-outline-variant rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex-1 px-4 py-2.5 bg-surface-container-high border border-outline-variant rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container-highest transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/10"
                      >
                        Enviar
                      </button>
                    </div>
                  </form>
                )
              ) : (
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl text-center font-bold text-sm flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} />
                  ¡Ya postulaste con éxito!
                </div>
              )}
              
              <p className="text-[10px] text-center text-on-surface-variant mt-4 uppercase tracking-widest font-bold">Postulación gratuita para alumnos</p>
            </div>

            {/* Extra Info Card */}
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm">
              <h4 className="font-bold text-on-surface mb-4">Sobre la empresa</h4>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center border border-outline-variant">
                  <Building2 size={24} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{proyecto.mypeNombre || 'MYPE'}</p>
                  <p className="text-xs text-on-surface-variant font-medium">Cajamarca, Perú</p>
                </div>
              </div>
              <button className="text-sm font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                Ver perfil de empresa
                <ChevronLeft size={16} className="rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleProyectoPage;
