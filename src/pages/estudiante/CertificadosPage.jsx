import { useState } from "react";
import { useCalificacionesPendientes } from "@/features/calificaciones/useCalificacionesPendientes";
import RateUserModal from "@/features/calificaciones/RateUserModal";
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
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/* ─── Animaciones ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

const CertificadosPage = () => {
  const { data: certificados = [], isLoading, isError, error } = useCertificados();
  const { pendientes: pendientesCalificacion } = useCalificacionesPendientes();
  const [modalCalificacion, setModalCalificacion] = useState({ open: false, data: null });

  if (isLoading) {
    return (
      <div style={{ fontFamily: "Inter, Arial, 'Helvetica Neue', sans-serif", background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#6b6b7a' }}>
          <div className="animate-spin" style={{ width: 22, height: 22, border: '3px solid #e2e8f0', borderTopColor: '#1B6FE8', borderRadius: '50%' }} />
          <span style={{ fontWeight: 600, fontSize: 13 }}>Cargando certificados...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ fontFamily: "Inter, Arial, 'Helvetica Neue', sans-serif", background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: 24, borderRadius: 16, border: '0.5px solid #fecaca', maxWidth: 400, textAlign: 'center' }}>
          <p style={{ fontWeight: 700, marginBottom: 4 }}>Error al cargar certificados</p>
          <p style={{ fontSize: 13, opacity: 0.9 }}>{error?.message || "Error desconocido"}</p>
        </div>
      </div>
    );
  }

  const totalCertificados = certificados?.length || 0;
  const hasCertificados = totalCertificados > 0;

  return (
    <div style={{ fontFamily: "Inter, Arial, 'Helvetica Neue', sans-serif", background: '#f8fafc', minHeight: '100vh', padding: '32px 36px', maxWidth: 1440, margin: '0 auto' }}>
      
      {/* Header consistente con PerfilPage y WorkspaceSelectorPage */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 4, height: 20, borderRadius: 2, background: '#1B6FE8' }} />
          <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: '#0f1f3d', margin: 0 }}>
            Mis Certificados
          </h1>
        </div>
        <p style={{ fontSize: 13, fontWeight: 500, color: '#6b6b7a', margin: 0, marginLeft: 14 }}>
          Reconocimientos oficiales con firma digital por tu participación en proyectos MYPE
        </p>
      </div>

      {/* Estadísticas en formato Bento */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <motion.div {...fadeUp(0.05)} style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', border: '0.5px solid #e8e8e4', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={22} color="#d97706" />
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Credenciales Obtenidas</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: '#0f1f3d', margin: 0 }}>{totalCertificados}</p>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.1)} style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', border: '0.5px solid #e8e8e4', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={22} color="#059669" />
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Firma Digital</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#059669', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle2 size={12} /> 100% Verificada</p>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.15)} style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', border: '0.5px solid #e8e8e4', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu size={22} color="#1B6FE8" />
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Competencias Validadas</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#1B6FE8', margin: 0 }}>Habilidades TI Reales</p>
          </div>
        </motion.div>
      </div>

      {/* Contenido principal */}
      <div style={{ marginTop: 8 }}>
        {!hasCertificados ? (
          /* Empty State consistente */
          <motion.div {...fadeUp(0.2)} style={{ textAlign: 'center', padding: '80px 40px', background: '#fff', borderRadius: 24, border: '0.5px solid #e8e8e4' }}>
            <div style={{ width: 80, height: 80, borderRadius: 40, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Award size={40} color="#94a3b8" strokeWidth={1.5} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f1f3d', marginBottom: 8 }}>
              Aún no tienes certificados
            </h3>
            <p style={{ fontSize: 13, color: '#6b6b7a', fontWeight: 500, marginBottom: 24, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
              Los certificados oficiales se generan automáticamente al finalizar exitosamente tu vinculación con una MYPE.
            </p>
            <Link to="/proyectos" style={{ textDecoration: 'none' }}>
              <button
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1B6FE8', color: '#fff', padding: '12px 24px', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1557B0'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(27,111,232,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#1B6FE8'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <Rocket size={16} />
                Explorar Proyectos Disponibles
              </button>
            </Link>
          </motion.div>
        ) : (
          /* Grid de certificados estilo tarjetas modernas */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
            {certificados.map((cert, index) => {
              const colores = ['#1B6FE8', '#06B6D4', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
              const colorFondo = colores[index % colores.length];
              const iniciales = (cert.tituloCertificado || 'C').slice(0, 2).toUpperCase();
              return (
                <motion.div
                  key={cert.id || index}
                  {...fadeUp(0.08 + index * 0.05)}
                  style={{
                    background: '#fff',
                    borderRadius: 20,
                    border: '0.5px solid #e8e8e4',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)';
                    e.currentTarget.style.borderColor = `${colorFondo}40`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#e8e8e4';
                  }}
                >
                  {/* Cabecera con gradiente */}
                  <div style={{
                    height: 100,
                    background: `linear-gradient(135deg, ${colorFondo}, ${colorFondo}CC)`,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                    }}>
                      <span style={{
                        fontSize: 22,
                        fontWeight: 800,
                        background: `linear-gradient(135deg, ${colorFondo}, ${colorFondo}CC)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        {iniciales}
                      </span>
                    </div>
                    
                    {/* Badge flotante */}
                    <div style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: 20,
                      padding: '4px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <CheckCircle2 size={10} color="#fff" />
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>VERIFICADO</span>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div style={{ padding: 20 }}>
                    <h3 style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#0f1f3d',
                      margin: '0 0 6px',
                      lineHeight: 1.3,
                      letterSpacing: '-0.01em'
                    }}>
                      {cert.tituloCertificado || 'Certificado Académico'}
                    </h3>
                    
                    <p style={{ fontSize: 10, fontWeight: 600, color: '#6b6b7a', margin: '0 0 12px' }}>
                      Proyecto: {cert.proyectoTitulo || 'MYPE vinculada'}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                      <Calendar size={11} color="#94a3b8" />
                      <span style={{ fontSize: 10, fontWeight: 500, color: '#94a3b8' }}>
                        Emitido el {cert.fechaEmision || 'Reciente'}
                      </span>
                    </div>

                    {/* Hash criptográfico */}
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: 12,
                      padding: '10px 12px',
                      border: '0.5px solid #e8e8e4',
                      marginBottom: 16
                    }}>
                      <span style={{ fontSize: 8, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                        Firma Cripto:
                      </span>
                      <span style={{ fontSize: 9, fontWeight: 600, color: '#475569', fontFamily: 'monospace' }}>
                        {cert.codigo || 'VAL-8291A-DF'}
                      </span>
                    </div>

                    {/* Botón Ver Credencial */}
                    <button
                      onClick={() => {
                        const pendiente = pendientesCalificacion.some(
                          (p) => p.proyectoId === cert.proyectoId && p.calificadoId === cert.mypeUsuarioId
                        );

                        if (pendiente) {
                          setModalCalificacion({
                            open: true,
                            data: {
                              proyectoId: cert.proyectoId,
                              calificadoId: cert.mypeUsuarioId,
                              calificadoNombre: cert.nombreMype,
                              proyectoTitulo: cert.proyectoTitulo,
                              urlCertificado: cert.urlCertificado,
                            },
                          });
                        } else {
                          window.open(cert.urlCertificado, '_blank');
                        }
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        width: '100%',
                        padding: '10px 16px',
                        borderRadius: 10,
                        background: '#f1f5f9',
                        color: '#1B6FE8',
                        fontSize: 11,
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#1B6FE8';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = '#f1f5f9';
                        e.currentTarget.style.color = '#1B6FE8';
                      }}
                    >
                      Ver Credencial
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Step-by-Step Flow Cards - Estilo consistente */}
        <motion.div {...fadeUp(0.3)} style={{
          marginTop: 32,
          background: 'linear-gradient(135deg, #f8fafc, #fff)',
          borderRadius: 24,
          border: '0.5px solid #e8e8e4',
          padding: '28px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0f1f3d', marginBottom: 8 }}>¿Cómo obtener tu certificado oficial?</h4>
          <p style={{ fontSize: 12, fontWeight: 500, color: '#6b6b7a', marginBottom: 24, maxWidth: 500 }}>
            Postula a un proyecto MYPE, completa los entregables y una vez que la empresa valide tu desempeño, tu certificado se emitirá con firma criptográfica.
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32 }}>
            {/* Paso 1 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                <Search size={22} color="#1B6FE8" />
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#0f1f3d', margin: 0 }}>1. Postula</p>
              <p style={{ fontSize: 9, fontWeight: 500, color: '#94a3b8' }}>Elige proyecto</p>
            </div>
            
            {/* Paso 2 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                <Hammer size={22} color="#d97706" />
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#0f1f3d', margin: 0 }}>2. Ejecuta</p>
              <p style={{ fontSize: 9, fontWeight: 500, color: '#94a3b8' }}>Trabaja hitos</p>
            </div>
            
            {/* Paso 3 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                <PartyPopper size={22} color="#059669" />
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#0f1f3d', margin: 0 }}>3. Recibe</p>
              <p style={{ fontSize: 9, fontWeight: 500, color: '#94a3b8' }}>Logro oficial</p>
            </div>
          </div>
        </motion.div>
      </div>
      {modalCalificacion.open && (
      <RateUserModal
        open={modalCalificacion.open}
        pendiente={modalCalificacion.data}
        onClose={() => setModalCalificacion({ open: false, data: null })}
        onSuccess={() => {
          // Después de calificar, abrir el certificado
          if (modalCalificacion.data?.urlCertificado) {
            window.open(modalCalificacion.data.urlCertificado, '_blank');
          }
          setModalCalificacion({ open: false, data: null });
        }}
      />
    )}
    </div>
  );
};

export default CertificadosPage;