import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase, ArrowRight, Building2, Calendar,
  Clock, CheckCircle2, FolderOpen, Users
} from 'lucide-react';
import { useMisPostulaciones } from '@/features/postulaciones-list/useMisPostulaciones';

/* ─── Animaciones ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

export function WorkspaceSelectorPage() {
  const navigate = useNavigate();
  const { data: postulaciones = [], isLoading } = useMisPostulaciones();

  // Filtrar solo proyectos CONFIRMADOS (tienen workspace activo)
  const proyectosConfirmados = postulaciones.filter(
    (p) => p.estado === 'CONFIRMADO' || p.estado === 'Confirmado' || p.estado === 'ACEPTADO'
  );

  if (isLoading) {
    return (
      <div style={{ fontFamily: "Inter, Arial, 'Helvetica Neue', sans-serif", background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#6b6b7a' }}>
          <div className="animate-spin" style={{ width: 22, height: 22, border: '3px solid #e2e8f0', borderTopColor: '#1B6FE8', borderRadius: '50%' }} />
          <span style={{ fontWeight: 600, fontSize: 13 }}>Cargando workspaces...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Inter, Arial, 'Helvetica Neue', sans-serif", background: '#f8fafc', minHeight: '100vh', padding: '32px 36px', maxWidth: 1440, margin: '0 auto' }}>
      {/* Header consistente con PerfilPage */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 4, height: 20, borderRadius: 2, background: '#1B6FE8' }} />
          <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: '#0f1f3d', margin: 0 }}>
            Mis Workspaces
          </h1>
        </div>
        <p style={{ fontSize: 13, fontWeight: 500, color: '#6b6b7a', margin: 0, marginLeft: 14 }}>
          Proyectos confirmados donde puedes subir entregables
        </p>
      </div>

      {proyectosConfirmados.length === 0 ? (
        <motion.div {...fadeUp(0.1)} style={{ textAlign: 'center', padding: '80px 40px', background: '#fff', borderRadius: 24, border: '0.5px solid #e8e8e4' }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <FolderOpen size={40} color="#94a3b8" strokeWidth={1.5} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f1f3d', marginBottom: 8 }}>
            No tienes workspaces activos
          </h3>
          <p style={{ fontSize: 13, color: '#6b6b7a', fontWeight: 500, marginBottom: 24 }}>
            Acepta una postulación para acceder al workspace
          </p>
          <Link
            to="/mis-postulaciones"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1B6FE8', color: '#fff', padding: '12px 24px', borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1557B0'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(27,111,232,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1B6FE8'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <Briefcase size={16} />
            Ver Mis Postulaciones
          </Link>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
          {proyectosConfirmados.map((postulacion, index) => {
            const colores = ['#1B6FE8', '#06B6D4', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
            const colorFondo = colores[index % colores.length];
            const iniciales = (postulacion.proyectoTitulo || 'P').slice(0, 2).toUpperCase();
            
            return (
              <motion.div
                key={postulacion.id}
                {...fadeUp(0.08 + index * 0.05)}
                onClick={() => navigate(`/workspace/${postulacion.proyectoId}`)}
                style={{
                  background: '#fff',
                  borderRadius: 20,
                  border: '0.5px solid #e8e8e4',
                  cursor: 'pointer',
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
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>ACTIVO</span>
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
                  {postulacion.proyectoTitulo || 'Proyecto sin título'}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Building2 size={11} color="#94a3b8" />
                    <span style={{ fontSize: 10, fontWeight: 500, color: '#6b6b7a' }}>MYPE Asociada</span>
                  </div>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#cbd5e1' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Users size={11} color="#94a3b8" />
                    <span style={{ fontSize: 10, fontWeight: 500, color: '#6b6b7a' }}>Workspace activo</span>
                  </div>
                </div>

                  {/* Estado visual */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 14,
                    borderTop: '0.5px solid #e8e8e4'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#10b981',
                        boxShadow: '0 0 0 3px rgba(16,185,129,0.2)'
                      }} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981' }}>CONFIRMADO</span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      color: colorFondo,
                      fontSize: 11,
                      fontWeight: 700,
                      transition: 'all 0.2s'
                    }}>
                      <span>Abrir Workspace</span>
                      <ArrowRight size={13} style={{ transition: 'transform 0.2s' }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default WorkspaceSelectorPage;