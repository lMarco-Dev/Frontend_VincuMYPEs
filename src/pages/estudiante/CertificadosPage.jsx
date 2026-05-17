import React from 'react';
import { useCertificados } from '@features/certificados/useCertificados';
import { 
  Award, 
  Calendar, 
  ExternalLink, 
  Loader2, 
  Search, 
  Rocket, 
  PartyPopper,
  Hammer,
  CheckCircle2,
  Lock,
  Cpu
} from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CertificadosPage = () => {
  const { data: certificados = [], isLoading, isError, error } = useCertificados();

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
        <svg className="animate-spin h-6 w-6 text-primary" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="font-semibold text-sm">Cargando tus certificados...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 lg:p-12 lg:pt-0 flex items-center justify-center min-h-[400px]">
        <div className="text-red-500 bg-red-50 p-5 rounded-2xl border border-red-100 max-w-md text-center">
          <p className="font-bold mb-1">Error al cargar certificados</p>
          <p className="text-sm">{error.message || "Error desconocido"}</p>
        </div>
      </div>
    );
  }

  const totalCertificados = certificados?.length || 0;
  const hasCertificados = totalCertificados > 0;

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      
      {/* Hero Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Mis Certificados</h1>
        <p className="text-base text-slate-500 font-semibold max-w-2xl">
          Aquí encontrarás tus reconocimientos oficiales con firma digital por tu participación en proyectos MYPE. Valida tus competencias laborales.
        </p>
      </div>

      {/* Academic Statistics Bento Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/50 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Award size={22} className="animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Credenciales Obtenidas</p>
            <p className="text-2xl font-extrabold text-slate-800">{totalCertificados}</p>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/50 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Lock size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Firma Digital Activa</p>
            <p className="text-sm font-extrabold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={14} /> 100% Verificada
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/50 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-primary flex items-center justify-center shrink-0">
            <Cpu size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Competencias Validadas</p>
            <p className="text-sm font-extrabold text-indigo-700">Habilidades TI Reales</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">
        
        {!hasCertificados ? (
          /* Premium "Gold & Violet" Levitating Sello Empty State */
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-[2.5rem] p-10 lg:p-16 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden min-h-[400px]">
            {/* Ambient blur lights */}
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-amber-50/40 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-indigo-50/30 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col items-center">
              {/* Floating Animated Badge */}
              <div 
                className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#b48a31] to-[#eac05d] text-white flex items-center justify-center shadow-lg shadow-amber-100 mb-8 animate-bounce shrink-0" 
                style={{ animationDuration: '3s' }}
              >
                <Award size={38} className="text-white" />
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Aún no tienes certificados</h3>
              <p className="text-sm text-slate-500 font-semibold max-w-sm mb-8 leading-relaxed">
                Los certificados oficiales se generan automáticamente al finalizar exitosamente tu vinculación con una MYPE.
              </p>
              <Link to="/proyectos">
                <button className="bg-gradient-to-r from-primary to-[#4648d4] text-white font-bold px-8 py-3.5 rounded-2xl shadow-xl shadow-primary/20 hover:opacity-95 hover:shadow-2xl transition-all active:scale-95 flex items-center gap-2 text-sm">
                  <Rocket size={18} />
                  Explorar Proyectos Disponibles
                </button>
              </Link>
            </div>
          </div>
        ) : (
          /* Filled State - Grid of high-fidelity mini digital credential cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificados.map((cert, index) => (
              <motion.div
                key={cert.id || index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/40 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
              >
                <div className="relative z-10 space-y-4">
                  <div className="flex gap-4 items-start justify-between">
                    {/* Sello de laurel holográfico */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1e3a5f] to-[#4648d4] text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-50">
                      <Award size={22} />
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold flex items-center gap-1 border bg-emerald-50 text-emerald-700 border-emerald-100 shrink-0">
                      <CheckCircle2 size={12} className="text-emerald-600 animate-pulse" />
                      VERIFICADO
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug group-hover:text-primary transition-colors mb-1">{cert.tituloCertificado || "Certificado Académico"}</h3>
                    <p className="text-xs text-slate-500 font-bold mb-3">Proyecto: {cert.proyectoTitulo || "MYPE vinculada"}</p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold">
                      <Calendar size={13} className="text-slate-400" />
                      <span>Emitido el {cert.fechaEmision || "Reciente"}</span>
                    </div>

                    {/* Hash criptográfico de verificación */}
                    <div className="mt-3.5 flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[10px] text-slate-500 font-bold">
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase">Firma Cripto:</span>
                      <span className="font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200/30 truncate flex-1 text-center">
                        {cert.codigo || "VAL-8291A-DF"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100/80 flex justify-end relative z-10">
                  <a
                    href={cert.urlCertificado}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-100 border border-slate-200/50 transition-all shadow-sm active:scale-95 whitespace-nowrap"
                  >
                    Ver Credencial
                    <ExternalLink size={13} className="text-slate-400" />
                  </a>
                </div>

                {/* Decorative background visual badge seal */}
                <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-gradient-to-br from-indigo-50/30 to-transparent rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 origin-top-right pointer-events-none" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Step-by-Step Flow Cards */}
        <div className="bg-gradient-to-tr from-indigo-50/50 via-slate-50/50 to-blue-50/50 border border-slate-100 rounded-[2.5rem] p-8 lg:p-10 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="flex-1 space-y-2">
            <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">¿Cómo obtener tu certificado oficial?</h4>
            <p className="text-sm text-slate-500 font-semibold leading-relaxed max-w-xl">
              Postula a un proyecto MYPE, completa los entregables recomendados y una vez que la empresa valide tu desempeño, tu certificado verificado se emitirá con firma criptográfica.
            </p>
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap shrink-0 gap-4 items-center justify-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center w-24 text-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100/50 text-indigo-600 flex items-center justify-center mb-2 shadow-sm transition-all hover:scale-105">
                <Search size={22} className="animate-pulse" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">1. Postula</span>
              <span className="text-[9px] font-bold text-slate-400">Elige proyecto</span>
            </div>
            
            <div className="hidden md:block h-[2px] w-6 bg-slate-200"></div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center w-24 text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100/50 text-amber-600 flex items-center justify-center mb-2 shadow-sm transition-all hover:scale-105">
                <Hammer size={22} />
              </div>
              <span className="text-[11px] font-bold text-slate-700">2. Ejecuta</span>
              <span className="text-[9px] font-bold text-slate-400">Trabaja hitos</span>
            </div>
            
            <div className="hidden md:block h-[2px] w-6 bg-slate-200"></div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center w-24 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100/50 text-emerald-600 flex items-center justify-center mb-2 shadow-sm transition-all hover:scale-105">
                <PartyPopper size={22} />
              </div>
              <span className="text-[11px] font-bold text-slate-700">3. Recibe</span>
              <span className="text-[9px] font-bold text-slate-400">Logro oficial</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CertificadosPage;
