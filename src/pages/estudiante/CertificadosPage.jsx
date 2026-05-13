import React from 'react';
import { useCertificados } from '@features/certificados/useCertificados';
import { 
  Award, 
  Calendar, 
  ExternalLink, 
  Loader2, 
  Search, 
  Rocket, 
  Gavel, 
  ShieldCheck, 
  Share2, 
  FileText,
  PartyPopper,
  Hammer,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CertificadosPage = () => {
  const { data: certificados, isLoading, isError, error } = useCertificados();

  if (isLoading) {
    return (
      <div className="p-6 lg:p-12 lg:pt-0 flex items-center justify-center min-h-[400px]">
        <div className="text-slate-500 flex items-center gap-2">
          <Loader2 className="animate-spin" size={24} />
          Cargando certificados...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 lg:p-12 lg:pt-0 flex items-center justify-center min-h-[400px]">
        <div className="text-red-500 bg-red-50 p-4 rounded-xl border border-red-100 max-w-md text-center">
          <p className="font-bold mb-1">Error al cargar certificados</p>
          <p className="text-sm">{error.message || "Error desconocido"}</p>
        </div>
      </div>
    );
  }

  const hasCertificados = certificados?.length > 0;

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Hero Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-on-background mb-2">Mis Certificados</h1>
        <p className="text-lg text-on-surface-variant max-w-2xl">
          Aquí encontrarás los reconocimientos oficiales por tu participación en proyectos MYPE. Valida tus competencias y destaca en el mercado laboral.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Main Content Area (8 Columns) */}
        <div className="col-span-12 lg:col-span-8">
          {!hasCertificados ? (
            /* Empty State */
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm h-full min-h-[400px]">
              <div className="w-24 h-24 bg-primary-fixed rounded-full flex items-center justify-center mb-6">
                <Award size={48} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-on-background mb-2">Aún no tienes certificados</h2>
              <p className="text-sm text-on-surface-variant max-w-md mb-8">
                Los certificados se generan automáticamente al finalizar exitosamente una vinculación con una MYPE. ¡Comienza tu primera experiencia hoy mismo!
              </p>
              <Link to="/proyectos">
                <button className="h-12 px-6 bg-primary text-white rounded-full font-bold flex items-center gap-2 hover:bg-primary/90 transition-all active:scale-95 shadow-md">
                  <Rocket size={18} />
                  Explorar Proyectos Disponibles
                </button>
              </Link>
            </div>
          ) : (
            /* Filled State - List of Certificates */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificados.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div className="flex gap-4 relative z-10">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                      <Award size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-slate-900 truncate mb-1">{cert.tituloCertificado}</h3>
                      <p className="text-sm text-slate-500 mb-3 truncate">Proyecto: {cert.proyectoTitulo}</p>

                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{cert.fechaEmision}</span>
                        </div>
                        <span className="font-mono bg-slate-50 px-2 py-0.5 rounded">Cód: {cert.codigo}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <a
                      href={cert.urlCertificado}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      Ver certificado
                      <ExternalLink size={14} />
                    </a>
                  </div>

                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50/50 to-transparent rounded-bl-full group-hover:scale-110 transition-transform origin-top-right" />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Info Panels (Asymmetric Sidebar - 4 Columns) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          
          {/* Validez Oficial */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <Gavel size={20} />
              <h3 className="font-bold">Validez Oficial</h3>
            </div>
            <p className="text-sm text-on-surface-variant">
              Todos nuestros certificados cuentan con el respaldo institucional y son válidos como horas de experiencia profesional bajo el marco de vinculación académica.
            </p>
          </div>

          {/* Firma Digital */}
          <div className="bg-primary-container text-white rounded-2xl p-6 shadow-sm overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={20} />
                <h3 className="font-bold">Firma Digital</h3>
              </div>
              <p className="text-sm opacity-90">
                Cada documento posee un código QR único y una firma electrónica avanzada que garantiza su autenticidad e integridad ante reclutadores.
              </p>
            </div>
            <ShieldCheck size={100} className="absolute -bottom-4 -right-4 opacity-10 pointer-events-none" />
          </div>

          {/* Compartir Logros */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-secondary">
              <Share2 size={20} />
              <h3 className="font-bold">Compartir Logros</h3>
            </div>
            <p className="text-sm text-on-surface-variant mb-4">
              Integra tus certificados directamente en tu perfil de LinkedIn o descarga una versión en PDF de alta calidad para tu CV.
            </p>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center">
                <Globe size={16} className="text-slate-400" />
              </div>
              <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center">
                <FileText size={16} className="text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Insight Card */}
        <div className="col-span-12 bg-secondary-container text-on-secondary-container rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h4 className="text-xl font-bold mb-2">¿Cómo obtener tu primer certificado?</h4>
            <p className="text-sm opacity-80">
              Postula a un proyecto, completa los hitos establecidos y una vez que la MYPE valide tu trabajo, tu certificado se generará automáticamente en esta sección.
            </p>
          </div>
          <div className="flex shrink-0 gap-4 items-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-on-secondary-container/10 flex items-center justify-center mb-1">
                <Search size={20} />
              </div>
              <span className="text-[10px] font-bold">1. Postula</span>
            </div>
            <div className="h-[2px] w-8 bg-on-secondary-container/20"></div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-on-secondary-container/10 flex items-center justify-center mb-1">
                <Hammer size={20} />
              </div>
              <span className="text-[10px] font-bold">2. Ejecuta</span>
            </div>
            <div className="h-[2px] w-8 bg-on-secondary-container/20"></div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-on-secondary-container/10 flex items-center justify-center mb-1">
                <PartyPopper size={20} />
              </div>
              <span className="text-[10px] font-bold">3. Recibe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificadosPage;
