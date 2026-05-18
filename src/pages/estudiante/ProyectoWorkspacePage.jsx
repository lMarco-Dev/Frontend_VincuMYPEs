import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { httpClient } from '@shared/api/httpClient';
import { useEntregables } from '../../features/proyecto-entregables/useEntregables';
import { 
  ChevronLeft, 
  FileText, 
  UploadCloud, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Download, 
  ExternalLink,
  MessageSquare,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ProyectoWorkspacePage() {
  const { proyectoId } = useParams();
  const navigate = useNavigate();
  
  // Modal de subida
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedSugerido, setSelectedSugerido] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // 1. Obtener detalles del proyecto real
  const { data: proyecto, isLoading: loadingProyecto, isError: errorProyecto, refetch: refetchProyecto } = useQuery({
    queryKey: ['proyecto', proyectoId],
    queryFn: async () => {
      const response = await httpClient.get(`/proyectos/${proyectoId}`);
      return response.data;
    },
    enabled: !!proyectoId
  });

  // 2. Obtener entregables reales
  const { 
    entregables, 
    isLoading: loadingEntregables, 
    subirEntregable: realSubirEntregable, 
    isSubiendo,
    refetch: refetchEntregables
  } = useEntregables(proyectoId, true);

  // Verificar si el proyecto está congelado (estado EN_REVISION / PENDIENTE_REVISION)
  const isProjectLocked = proyecto?.estado === 'EN_REVISION' || proyecto?.estado === 'PENDIENTE_REVISION';

  // Analizar entregables sugeridos
  const entregablesSugeridos = proyecto?.entregablesSugeridos
    ? proyecto.entregablesSugeridos.split(',').map(e => e.trim()).filter(Boolean)
    : ["Diseño UI/UX (PDF)", "Base de Datos (SQL)", "Código Fuente (ZIP)"];

  // Vincular entregables sugeridos con los ya subidos (coincidencia de título)
  const mappedDeliverables = entregablesSugeridos.map(sugerido => {
    const subido = entregables?.find(e => e.titulo?.toLowerCase() === sugerido.toLowerCase());
    return {
      nombre: sugerido,
      subido: !!subido,
      detalles: subido || null
    };
  });

  // Manejador del Drag & Drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Validar tipos de archivo comunes
      if (file.size > 15 * 1024 * 1024) {
        setUploadError("El tamaño máximo permitido es de 15MB.");
        return;
      }
      setSelectedFile(file);
      setUploadError("");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 15 * 1024 * 1024) {
        setUploadError("El tamaño máximo permitido es de 15MB.");
        return;
      }
      setSelectedFile(file);
      setUploadError("");
    }
  };

  // Enviar archivo al backend (AWS S3)
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError("Por favor, selecciona un archivo válido.");
      return;
    }

    try {
      setUploadError("");
      const formData = new FormData();
      formData.append("titulo", selectedSugerido);
      formData.append("descripcion", uploadDescription || `Entregable de ${selectedSugerido}`);
      formData.append("archivo", selectedFile);

      await realSubirEntregable(formData);
      
      setUploadSuccess(true);
      setTimeout(() => {
        setIsUploadOpen(false);
        setUploadSuccess(false);
        setSelectedFile(null);
        setUploadDescription("");
        refetchEntregables();
        refetchProyecto(); // Recargar el estado del proyecto para ver si pasa a EN_REVISION
      }, 1500);

    } catch (err) {
      console.error("Error al subir entregable:", err);
      setUploadError(err.response?.data?.message || "Error al subir el archivo a AWS S3. Inténtalo de nuevo.");
    }
  };

  if (loadingProyecto || loadingEntregables) {
    return (
      <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
        <svg className="animate-spin h-6 w-6 text-primary" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="font-semibold text-sm">Cargando tu espacio de trabajo...</span>
      </div>
    );
  }

  if (errorProyecto || !proyecto) {
    return (
      <div className="p-12 text-center text-red-500">
        <AlertTriangle size={32} className="mx-auto mb-2" />
        <h3 className="font-bold text-lg">Proyecto no encontrado</h3>
        <p className="text-sm text-slate-500 mt-1">No tienes acceso o el proyecto no existe.</p>
        <Link to="/proyectos" className="mt-4 inline-flex bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold">
          Volver a Proyectos
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto space-y-8">
      
      {/* Sleek Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-medium">
        <nav aria-label="Breadcrumb" className="flex text-xs text-slate-400 items-center gap-2">
          <button
            onClick={() => navigate('/mis-postulaciones')}
            className="hover:text-primary transition-colors flex items-center gap-1 font-bold"
          >
            <ChevronLeft size={14} />
            Mis Postulaciones
          </button>
          <span className="text-slate-300">/</span>
          <span aria-current="page" className="text-slate-600 font-semibold">Workspace de Proyecto</span>
        </nav>
      </div>

      {/* Header Banner - Liquid style */}
      <motion.section 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-tr from-[#1a2d42] via-[#1e3a5f] to-[#4648d4] p-8 text-white shadow-md flex flex-col justify-center min-h-[160px]"
      >
        <div className="absolute top-[-30%] right-[-10%] w-80 h-80 bg-[#4648d4]/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-white/10 backdrop-blur-md text-[10px] font-bold text-white/90 uppercase tracking-widest border border-white/5">
              Espacio de Trabajo Grupal
            </span>
            {isProjectLocked && (
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 backdrop-blur-md text-[10px] font-bold text-amber-300 uppercase tracking-widest border border-amber-500/30 flex items-center gap-1">
                <Clock size={10} /> En Revisión
              </span>
            )}
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">{proyecto.titulo}</h1>
          <p className="text-xs text-white/80 font-medium flex items-center gap-1">
            MYPE Socia: <span className="font-extrabold text-white">{proyecto.mypeNombre || 'MYPE'}</span>
          </p>
        </div>
      </motion.section>

      {/* Lock Banner if Project is Under Review */}
      {isProjectLocked && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3"
        >
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-sm font-extrabold text-amber-800">Entregables Bloqueados por Revisión</h4>
            <p className="text-xs text-amber-600 mt-0.5 font-medium leading-normal">
              Has subido un entregable y el estado del proyecto ha cambiado a **PENDIENTE DE REVISIÓN**. Mientras la MYPE o el Administrador evalúan tus archivos, las subidas y modificaciones se encuentran temporalmente congeladas para garantizar la integridad de la evaluación.
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle Column (Deliverable Boxes) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
              <FolderOpen className="text-primary" size={20} />
              Casilleros de Entregables
            </h2>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              {mappedDeliverables.filter(d => d.subido).length} de {mappedDeliverables.length} Subidos
            </span>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mappedDeliverables.map((item, index) => {
              const details = item.detalles;
              const isApproved = details?.estado === 'APROBADO';
              const isReviewing = details?.estado === 'EN_REVISION' || details?.estado === 'PENDIENTE_REVISION';
              
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className={`bg-white p-6 rounded-[2rem] border transition-all duration-300 flex flex-col justify-between min-h-[290px] relative overflow-hidden shadow-sm hover:shadow-xl group ${
                    isApproved 
                      ? 'border-emerald-100 bg-gradient-to-b from-white to-emerald-50/10 hover:shadow-emerald-500/5' 
                      : isReviewing
                      ? 'border-amber-100 bg-gradient-to-b from-white to-amber-50/10 hover:shadow-amber-500/5'
                      : 'border-slate-100/80 border-dashed hover:border-primary/30 hover:bg-slate-50/30 hover:shadow-indigo-500/5'
                  }`}
                >
                  {/* Decorative faint background icon */}
                  <div className="absolute right-[-10%] bottom-[-5%] text-slate-100 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    <FileText size={180} />
                  </div>
 
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-0.5 rounded border border-slate-100/50">
                        Entregable {index + 1}
                      </span>
                      {/* State Badges */}
                      {isApproved && (
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-black rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm shadow-emerald-500/5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                          Aprobado
                        </span>
                      )}
                      {isReviewing && (
                        <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 text-[9px] font-black rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm shadow-amber-500/5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                          En Revisión
                        </span>
                      )}
                      {!item.subido && (
                        <span className="px-2.5 py-0.5 bg-slate-50 text-slate-400 border border-slate-200 text-[9px] font-bold rounded-full uppercase tracking-wider">
                          Pendiente
                        </span>
                      )}
                    </div>
 
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{item.nombre}</h3>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-3 mt-1.5">
                        {details?.descripcion || `Casillero dedicado a subir la versión del entregable correspondiente a "${item.nombre}".`}
                      </p>
                    </div>
 
                    {/* Speech bubble for feedback inside the card itself */}
                    {details?.observaciones && (
                      <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] text-slate-600 font-semibold leading-relaxed relative mt-3 shadow-inner max-h-[85px] overflow-y-auto">
                        <div className="flex items-center gap-1 mb-1 text-[9px] font-black text-slate-400 uppercase tracking-wide">
                          <span>💬</span>
                          <span>Comentario de la MYPE:</span>
                        </div>
                        "{details.observaciones}"
                      </div>
                    )}
                  </div>
 
                  <div className="mt-6 pt-4 border-t border-slate-100/80 relative z-10 flex items-center justify-between">
                    {item.subido ? (
                      <>
                        <a 
                          href={details.archivoUrl || details.archivo} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:shadow-sm"
                        >
                          <Download size={13} />
                          Descargar
                        </a>
                        
                        {/* Subir de nuevo si no está aprobado ni bloqueado */}
                        {!isApproved && !isProjectLocked && (
                          <button
                            onClick={() => {
                              setSelectedSugerido(item.nombre);
                              setIsUploadOpen(true);
                            }}
                            className="text-xs font-bold text-primary hover:text-indigo-700 transition-colors flex items-center gap-1 hover:underline"
                          >
                            Sobrescribir archivo
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        disabled={isProjectLocked}
                        onClick={() => {
                          setSelectedSugerido(item.nombre);
                          setIsUploadOpen(true);
                        }}
                        className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          isProjectLocked 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                            : 'bg-gradient-to-r from-primary to-indigo-600 text-white hover:opacity-95 hover:shadow-lg hover:shadow-indigo-500/10'
                        }`}
                      >
                        <UploadCloud size={14} />
                        Subir Entregable
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
 
        {/* Right Column (Instructions & Feedback Timeline) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* MYPE Partner Card (Premium design) */}
          <section className="bg-gradient-to-b from-white to-slate-50/50 p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-5 relative overflow-hidden group">
            {/* Ambient decorative glow */}
            <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-primary/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1e3a5f] to-[#4648d4] text-white flex items-center justify-center font-black text-lg shadow-md shadow-indigo-50 border border-white/10 shrink-0">
                {proyecto.mypeNombre ? proyecto.mypeNombre.charAt(0).toUpperCase() : 'M'}
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">MYPE Asignada</p>
                <h4 className="text-sm font-extrabold text-slate-800 truncate">{proyecto.mypeNombre || 'MYPE Socia'}</h4>
              </div>
            </div>
 
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100/80">
              <div className="p-3 bg-white rounded-2xl border border-slate-100 text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Horas Estimadas</span>
                <span className="text-base font-extrabold text-indigo-700">{proyecto.horasEstimadas || '120'} hrs</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-slate-100 text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Duración</span>
                <span className="text-base font-extrabold text-indigo-700">{proyecto.duracionSemanas || '8'} sem</span>
              </div>
            </div>
 
            {/* Contact details */}
            <div className="space-y-2 pt-2 text-[11px] font-bold text-slate-500">
              {proyecto.mypeEmail && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">📧</span>
                  <span className="truncate hover:text-slate-700 transition-colors">{proyecto.mypeEmail}</span>
                </div>
              )}
              {proyecto.mypeTelefono && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">📞</span>
                  <span>{proyecto.mypeTelefono}</span>
                </div>
              )}
            </div>
          </section>
 
          {/* Instructions Box */}
          <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <HelpCircle className="text-primary" size={16} />
              Reglas de Entrega S3
            </h3>
            <ul className="space-y-3 text-xs text-slate-500 font-medium">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>**Sobrescritura Directa:** Al subir un nuevo archivo en un casillero, reemplazará automáticamente la versión anterior en AWS S3.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>**Bloqueo de Modificación:** Una vez enviado, el proyecto se congela para revisión y no podrás realizar cambios hasta que la MYPE responda.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>**Formato Recomendado:** Sube tus diseños y documentación preferiblemente en formato **PDF** y el código en formato **ZIP** o **RAR** (Max 15MB).</span>
              </li>
            </ul>
          </section>
 
          {/* Feedback & Observations Section */}
          <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-5">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <MessageSquare className="text-primary" size={16} />
              Historial de Observaciones
            </h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {entregables?.filter(e => e.observaciones).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No hay observaciones ni correcciones registradas.</p>
              ) : (
                entregables?.filter(e => e.observaciones).map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-extrabold">
                      <span className="text-slate-955 truncate max-w-[130px]">{item.titulo}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        item.estado === 'APROBADO' 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                          : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {item.estado}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                      "{item.observaciones}"
                    </p>
                    <p className="text-[9px] text-slate-400 text-right font-medium">
                      {item.fechaSubida ? new Date(item.fechaSubida).toLocaleDateString() : item.fechaEntrega ? new Date(item.fechaEntrega).toLocaleDateString() : 'Fecha no disponible'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Dynamic Upload Modal (Slide-in Glassmorphism Effect) */}
      <AnimatePresence>
        {isUploadOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div 
              onClick={() => setIsUploadOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white w-full max-w-lg p-8 rounded-[2rem] border border-slate-100 shadow-2xl z-10 space-y-6"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">Subir Entregable</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                    {selectedSugerido}
                  </p>
                </div>
                <button 
                  onClick={() => setIsUploadOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                >
                  X
                </button>
              </div>

              {uploadSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                    ✓
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base">¡Entregable Subido con Éxito!</h4>
                  <p className="text-xs text-slate-500 font-medium">El archivo se guardó correctamente en AWS S3 y se notificó a la MYPE.</p>
                </div>
              ) : (
                <form onSubmit={handleUploadSubmit} className="space-y-5">
                  
                  {/* Descripcion */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-900 block">
                      Descripción de la entrega
                    </label>
                    <textarea
                      required
                      placeholder="Ej. Adjuntamos la primera versión con los Mockups detallados..."
                      rows={3}
                      value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                      className="w-full p-4 border border-slate-100 rounded-2xl text-xs font-semibold focus:outline-none focus:border-primary placeholder-slate-300"
                    />
                  </div>

                  {/* Drag and Drop Zone */}
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed p-8 rounded-3xl text-center transition-all duration-300 relative ${
                      dragActive 
                        ? 'border-primary bg-primary/5' 
                        : selectedFile 
                        ? 'border-emerald-300 bg-emerald-50/10'
                        : 'border-slate-200 hover:border-primary/50'
                    }`}
                  >
                    <input 
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    {selectedFile ? (
                      <div className="space-y-2">
                        <FileText className="text-emerald-600 mx-auto" size={32} />
                        <div>
                          <p className="text-xs font-extrabold text-slate-900 truncate max-w-[280px] mx-auto">
                            {selectedFile.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                            {Math.round(selectedFile.size / 1024)} KB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="text-[10px] text-red-500 font-black hover:underline"
                        >
                          Quitar archivo
                        </button>
                      </div>
                    ) : (
                      <label htmlFor="file-upload" className="cursor-pointer space-y-2 block">
                        <UploadCloud className="text-slate-400 mx-auto" size={36} />
                        <div>
                          <p className="text-xs font-extrabold text-slate-800">
                            Arrastra tu archivo aquí o <span className="text-primary hover:underline">busca localmente</span>
                          </p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">
                            PDF, ZIP, RAR, SQL (Máx 15MB)
                          </p>
                        </div>
                      </label>
                    )}
                  </div>

                  {/* Overwrite S3 Warning Alert */}
                  <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 text-[10px] text-indigo-700 font-semibold flex items-start gap-1.5 leading-normal">
                    <span className="shrink-0 font-black">ℹ</span>
                    <span>Aviso de AWS S3: Al subir este archivo, se sobrescribirá cualquier versión previa cargada anteriormente para este entregable.</span>
                  </div>

                  {uploadError && (
                    <p className="text-xs text-red-500 font-bold text-center">{uploadError}</p>
                  )}

                  <div className="pt-4 border-t border-slate-50 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setIsUploadOpen(false)}
                      className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl text-xs font-extrabold transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubiendo || !selectedFile}
                      className="flex-1 py-3 bg-primary text-white rounded-2xl text-xs font-extrabold hover:bg-indigo-600 hover:shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubiendo ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Subiendo...
                        </>
                      ) : (
                        <>
                          Subir Entregable
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default ProyectoWorkspacePage;
