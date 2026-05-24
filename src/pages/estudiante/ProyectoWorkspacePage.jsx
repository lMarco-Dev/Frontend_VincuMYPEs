import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Send, Paperclip, CheckCircle2, Clock,
  AlertCircle, FileText, MessageSquare, Calendar,
  Building2, Upload, Download, Eye, ChevronRight,
  Sparkles, ListChecks, Loader2, X, RefreshCw,
  TrendingUp, Award, Zap, Star, Flag, AlertTriangle,
  User, ExternalLink, Info
} from 'lucide-react';
import { useWorkspaceRealTime } from '@/features/workspace/useWorkspaceRealTime';
import { useWorkspaceActions } from '@/features/workspace/useWorkspaceActions';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// ─── Componente de Barra de Progreso ───────────────────────
const ProgressBar = ({ value, max = 100, size = 'md' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const heights = { sm: 'h-2', md: 'h-3', lg: 'h-4' };
  
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-xs font-bold text-slate-500">Progreso General</span>
        <span className="text-xs font-extrabold text-primary">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className={`w-full ${heights[size]} bg-slate-100 rounded-full overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary via-indigo-500 to-indigo-600 rounded-full relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
};

// ─── Badge de estado del entregable ───────────────────────
const EstadoBadge = ({ estado }) => {
  const configs = {
    APROBADO: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <CheckCircle2 size={12} className="text-emerald-500" />,
      label: 'Aprobado'
    },
    EN_REVISION: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: <Clock size={12} className="text-amber-500 animate-pulse" />,
      label: 'En Revisión'
    },
    PENDIENTE_REVISION: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: <Clock size={12} className="text-blue-500 animate-pulse" />,
      label: 'Pendiente Revisión'
    },
    PENDIENTE: {
      bg: 'bg-slate-50 text-slate-600 border-slate-200',
      icon: <AlertCircle size={12} className="text-slate-400" />,
      label: 'Pendiente'
    },
    RECHAZADO: {
      bg: 'bg-red-50 text-red-700 border-red-200',
      icon: <X size={12} className="text-red-500" />,
      label: 'Requiere Cambios'
    }
  };

  const config = configs[estado] || configs.PENDIENTE;

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1.5 border ${config.bg}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────
export function ProyectoWorkspacePage() {
  const { proyectoId } = useParams();
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // Estados locales
  const [activeTab, setActiveTab] = useState('entregables');
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedEntregable, setSelectedEntregable] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadDescripcion, setUploadDescripcion] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Hooks de datos y acciones
  const {
    proyecto,
    entregables,
    mensajes,
    conversacionId,
    mype,
    stats,
    isLoading,
    errorProyecto,
    proyectoError,
    recargarWorkspace,
    refetchEntregables,
    refetchProyecto,
    ultimaActualizacion,
  } = useWorkspaceRealTime(proyectoId);

  const {
    subirEntregable,
    isSubiendo,
    uploadProgress,
    enviarMensaje,
    isEnviandoMensaje,
    descargarArchivo,
    resetUpload,
  } = useWorkspaceActions(proyectoId);

  // Scroll automático al final del chat
  useEffect(() => {
    if (activeTab === 'chat' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensajes, activeTab]);

  // ✅ CORREGIDO: Manejar envío con o sin conversación
const handleEnviarMensaje = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;

    try {
        await enviarMensaje({
            conversacionId: conversacionId, // Puede ser null
            mensaje: nuevoMensaje.trim(),
        });
        
        setNuevoMensaje('');
        // Recargar mensajes
        setTimeout(() => refetchMensajes(), 1000);
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        // Mostrar error al usuario
        alert('No se pudo enviar el mensaje. Intenta de nuevo.');
    }
};

  // Manejar Drag & Drop
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
      if (file.size > 15 * 1024 * 1024) {
        setUploadError("El archivo no debe superar 15MB");
        return;
      }
      setUploadFile(file);
      setUploadError('');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 15 * 1024 * 1024) {
        setUploadError("El archivo no debe superar 15MB");
        return;
      }
      setUploadFile(file);
      setUploadError('');
    }
  };

  // Subir entregable
  const handleSubirEntregable = async (e) => {
    e.preventDefault();
    if (!uploadFile || !selectedEntregable) {
      setUploadError('Selecciona un archivo y un entregable');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('titulo', selectedEntregable);
      formData.append('descripcion', uploadDescripcion || `Entrega: ${selectedEntregable}`);
      formData.append('archivo', uploadFile);

      await subirEntregable({ formData });
      
      setUploadSuccess(true);
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadSuccess(false);
        setUploadFile(null);
        setUploadDescripcion('');
        setSelectedEntregable(null);
        resetUpload();
        recargarWorkspace();
      }, 2000);
    } catch (error) {
      setUploadError(
        error.response?.data?.message || 
        error.message || 
        'Error al subir el archivo'
      );
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 mx-auto flex items-center justify-center shadow-lg"
          >
            <Loader2 size={36} className="text-white" />
          </motion.div>
          <p className="text-lg font-extrabold text-slate-800">
            Cargando Workspace
          </p>
          <p className="text-sm text-slate-500">
            Obteniendo datos del proyecto...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (errorProyecto || !proyecto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 rounded-3xl bg-red-50 mx-auto flex items-center justify-center mb-6">
            <AlertCircle size={48} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
            Error al cargar el proyecto
          </h1>
          <p className="text-slate-500 font-semibold mb-4">
            {proyectoError?.response?.data?.message || 
             proyectoError?.message || 
             'No se pudo cargar la información del proyecto'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={recargarWorkspace}
              className="px-6 py-3 bg-gradient-to-r from-primary to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              <RefreshCw size={16} className="inline mr-2" />
              Reintentar
            </button>
            <Link
              to="/mis-postulaciones"
              className="px-6 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:border-primary/30 transition-all"
            >
              Volver a Postulaciones
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-[1440px] mx-auto p-6 lg:p-8">
        
        {/* ─── Header con Breadcrumb ─── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-sm mb-4">
            <button
              onClick={() => navigate('/mis-postulaciones')}
              className="text-slate-500 hover:text-primary font-semibold transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={14} />
              Mis Postulaciones
            </button>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-900 font-bold truncate max-w-md">
              {proyecto.titulo}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900">
                  {proyecto.titulo}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${
                  proyecto.estado === 'COMPLETADO'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : proyecto.estado === 'EN_REVISION'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {proyecto.estado?.replace(/_/g, ' ') || 'En Desarrollo'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500 font-semibold flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Building2 size={15} className="text-slate-400" />
                  {mype?.nombre || proyecto.mypeNombre || 'MYPE'}
                </span>
                {proyecto.fechaLimite && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={15} className="text-slate-400" />
                    Límite: {new Date(proyecto.fechaLimite).toLocaleDateString('es-PE', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
                  Actualizado {formatDistanceToNow(ultimaActualizacion, { 
                    addSuffix: true, 
                    locale: es 
                  })}
                </span>
              </div>
            </div>

            <button
              onClick={recargarWorkspace}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 font-bold text-sm rounded-xl border border-slate-200 hover:border-primary/30 hover:bg-slate-50 transition-all"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              Actualizar
            </button>
          </div>
        </motion.div>

        {/* ─── Grid de Estadísticas ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center">
                <TrendingUp size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Progreso</p>
                <p className="text-lg font-extrabold text-slate-900">
                  {stats.completados}/{stats.total}
                </p>
              </div>
            </div>
            <ProgressBar value={stats.completados} max={stats.total} size="sm" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock size={20} className="text-amber-600 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">En Revisión</p>
                <p className="text-lg font-extrabold text-slate-900">{stats.enRevision}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 size={20} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Aprobados</p>
                <p className="text-lg font-extrabold text-slate-900">{stats.completados}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200/60 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-200/30 rounded-bl-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                  <Award size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-700 uppercase">Certificado</p>
                  <p className="text-sm font-extrabold text-amber-900">
                    {stats.porcentaje === 100 ? '¡Disponible!' : `${stats.porcentaje}%`}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── Tabs: Entregables | Chat ─── */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => setActiveTab('entregables')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold transition-all ${
                activeTab === 'entregables'
                  ? 'text-primary border-b-2 border-primary bg-indigo-50/30'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ListChecks size={18} />
              Entregables ({stats.completados}/{stats.total})
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold transition-all ${
                activeTab === 'chat'
                  ? 'text-primary border-b-2 border-primary bg-indigo-50/30'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <MessageSquare size={18} />
              Chat con MYPE
              {mensajes?.length > 0 && (
                <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {mensajes.length}
                </span>
              )}
            </button>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'entregables' ? (
                <motion.div
                  key="entregables"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {entregables.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText size={48} className="text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-extrabold text-slate-800 mb-2">
                        No hay entregables aún
                      </h3>
                      <p className="text-sm text-slate-500 mb-6">
                        Comienza subiendo tu primer entregable para este proyecto
                      </p>
                    </div>
                  ) : (
                    entregables.map((entregable, index) => (
                      <motion.div
                        key={entregable.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-5 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <EstadoBadge estado={entregable.estado} />
                              {entregable.fechaSubida && (
                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                  <Calendar size={11} />
                                  {new Date(entregable.fechaSubida).toLocaleDateString('es-PE')}
                                </span>
                              )}
                            </div>
                            
                            <h3 className="text-base font-extrabold text-slate-900 mb-1">
                              {entregable.titulo}
                            </h3>
                            
                            {entregable.descripcion && (
                              <p className="text-sm text-slate-600 mb-3">
                                {entregable.descripcion}
                              </p>
                            )}

                            {entregable.observaciones && (
                              <div className="mt-3 p-3 bg-amber-50/80 rounded-xl border border-amber-100">
                                <p className="text-xs font-bold text-amber-700 mb-1">
                                  💬 Feedback de la MYPE:
                                </p>
                                <p className="text-sm text-slate-700">
                                  {entregable.observaciones}
                                </p>
                              </div>
                            )}

                            {entregable.archivo && (
                              <div className="mt-3 flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-2">
                                  <FileText size={14} className="text-primary" />
                                  <span className="text-xs font-semibold text-slate-700">
                                    {entregable.archivoNombre || 'Archivo subido'}
                                  </span>
                                </div>
                                <button
                                  onClick={() => descargarArchivo(
                                    entregable.archivoUrl || entregable.archivo,
                                    entregable.archivoNombre
                                  )}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors"
                                >
                                  <Download size={12} />
                                  Descargar
                                </button>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              setSelectedEntregable(entregable.titulo);
                              setShowUploadModal(true);
                            }}
                            className="ml-4 px-4 py-2.5 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-xl font-bold text-xs hover:shadow-lg transition-all flex items-center gap-2 shrink-0"
                          >
                            <Upload size={14} />
                            Actualizar
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col h-[600px]"
                >
                 {/* Mensajes */}
<div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
    {mensajes.length === 0 ? (
        <div className="text-center py-12">
            <MessageSquare size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-extrabold text-slate-800 mb-2">
                Inicia la conversación
            </h3>
            <p className="text-sm text-slate-500">
                Envía un mensaje a la MYPE para coordinar el proyecto
            </p>
        </div>
    ) : (
        mensajes.map((msg, idx) => {
            // ✅ DETERMINAR SI EL MENSAJE ES DEL ESTUDIANTE ACTUAL
            const isEstudiante = msg.remitenteId === 'estudiante' || 
                                msg.rol === 'ESTUDIANTE' ||
                                msg.esMio === true ||
                                (msg.remitente && msg.remitente.toLowerCase() === 'tú');
            
            // ✅ Si el backend devuelve el nombre real, comparar con el usuario logueado
            // Asumimos que si no es MYPE, es el estudiante
            
            return (
                <div
                    key={msg.id || idx}
                    className={`flex ${isEstudiante ? 'justify-end' : 'justify-start'}`}
                >
                    <div className={`flex items-start gap-3 max-w-[70%] ${
                        isEstudiante ? 'flex-row-reverse' : ''
                    }`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isEstudiante 
                                ? 'bg-gradient-to-br from-primary to-indigo-600' 
                                : 'bg-gradient-to-br from-amber-400 to-orange-500'
                        }`}>
                            {isEstudiante ? (
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            )}
                        </div>

                        {/* Burbuja de mensaje */}
                        <div className={`p-4 rounded-2xl ${
                            isEstudiante
                                ? 'bg-gradient-to-br from-primary to-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-800'
                        }`}>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-black">
                                    {/* ✅ MOSTRAR "Tú" SI ES EL ESTUDIANTE */}
                                    {isEstudiante ? 'Tú' : (msg.remitente || 'MYPE')}
                                </span>
                                <span className="text-[10px] opacity-70">
                                    {msg.fechaEnvio || msg.fecha
                                        ? new Date(msg.fechaEnvio || msg.fecha).toLocaleTimeString('es-PE', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })
                                        : ''}
                                </span>
                            </div>
                            <p className="text-sm">{msg.mensaje || msg.contenido}</p>
                        </div>
                    </div>
                </div>
            );
        })
    )}
    <div ref={chatEndRef} />
</div>

                  {/* Input de mensaje */}
                  <form onSubmit={handleEnviarMensaje} className="flex gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      className="p-3 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <Paperclip size={20} className="text-slate-400" />
                    </button>
                    <input
                      type="text"
                      value={nuevoMensaje}
                      onChange={(e) => setNuevoMensaje(e.target.value)}
                      placeholder="Escribe un mensaje a la MYPE..."
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      disabled={isEnviandoMensaje}
                    />
                    <button
                      type="submit"
                      disabled={!nuevoMensaje.trim() || isEnviandoMensaje}
                      className="p-3 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {isEnviandoMensaje ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <Send size={20} />
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ─── Modal de Subida de Entregable ─── */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              onClick={() => {
                setShowUploadModal(false);
                setUploadError('');
                setUploadFile(null);
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">
                      {uploadSuccess ? '¡Subida Exitosa!' : 'Subir Entregable'}
                    </h3>
                    <p className="text-sm text-slate-500 font-semibold mt-1">
                      {selectedEntregable}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      setUploadError('');
                      setUploadFile(null);
                    }}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <X size={20} className="text-slate-500" />
                  </button>
                </div>
              </div>

              {uploadSuccess ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-emerald-600" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-lg mb-2">
                    Archivo subido correctamente
                  </h4>
                  <p className="text-sm text-slate-500">
                    Se notificará a la MYPE para su revisión
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubirEntregable} className="p-6 space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={uploadDescripcion}
                      onChange={(e) => setUploadDescripcion(e.target.value)}
                      placeholder="Describe brevemente esta entrega..."
                      rows={3}
                      className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                  </div>

                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed p-8 rounded-2xl text-center transition-all cursor-pointer ${
                      dragActive
                        ? 'border-primary bg-indigo-50/30'
                        : uploadFile
                        ? 'border-emerald-300 bg-emerald-50/30'
                        : 'border-slate-200 hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="file"
                      id="file-input"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    
                    {uploadFile ? (
                      <div className="space-y-2">
                        <FileText size={32} className="text-primary mx-auto" />
                        <p className="text-sm font-bold text-slate-700">
                          {uploadFile.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <button
                          type="button"
                          onClick={() => setUploadFile(null)}
                          className="text-xs text-red-500 font-bold hover:underline"
                        >
                          Cambiar archivo
                        </button>
                      </div>
                    ) : (
                      <label htmlFor="file-input" className="cursor-pointer space-y-2">
                        <Upload size={32} className="text-slate-300 mx-auto" />
                        <p className="text-sm font-bold text-slate-500">
                          Arrastra tu archivo o haz clic aquí
                        </p>
                        <p className="text-xs text-slate-400">
                          PDF, ZIP, DOCX (Máx. 15MB)
                        </p>
                      </label>
                    )}
                  </div>

                  {isSubiendo && (
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        className="h-full bg-gradient-to-r from-primary to-indigo-600 rounded-full"
                      />
                    </div>
                  )}

                  {uploadError && (
                    <p className="text-sm text-red-500 font-bold text-center">
                      {uploadError}
                    </p>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={!uploadFile || isSubiendo}
                      className="flex-1 px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-primary to-indigo-600 hover:shadow-lg rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubiendo ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Subiendo {uploadProgress}%
                        </>
                      ) : (
                        <>
                          <Send size={16} />
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