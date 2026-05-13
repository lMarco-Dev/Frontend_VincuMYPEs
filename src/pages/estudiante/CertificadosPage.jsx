import React from 'react';
import { useCertificados } from '@features/certificados/useCertificados';
import { Award, Calendar, ExternalLink, Loader2, Search } from 'lucide-react';
import { motion } from 'framer-motion';

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

  return (
    <div className="p-6 lg:p-12 lg:pt-0">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-black text-slate-900 tracking-tight mb-2"
            >
              Mis Certificados
            </motion.h1>
            <p className="text-slate-500">Aquí puedes ver y descargar tus logros.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar certificado..."
              className="pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent w-full md:w-64 shadow-sm text-sm"
            />
          </div>
        </header>

        {certificados?.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-6">
              <Award size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Aún no tienes certificados</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">Completa proyectos para obtener certificaciones verificables.</p>
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
              Explorar Proyectos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificados?.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
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
    </div>
  );
};

export default CertificadosPage;
