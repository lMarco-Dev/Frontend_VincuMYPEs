import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Bell, Briefcase, Award, MessageSquare, 
  FileText, Trash2, CheckCheck, AlertTriangle
} from 'lucide-react';
import { useNotificaciones, useLeerNotificacion, useEliminarNotificacion } from './useNotificaciones';

const ICONOS = {
  POSTULACION: <Briefcase size={14} className="text-blue-500" />,
  PROYECTO: <FileText size={14} className="text-amber-500" />,
  MENSAJE: <MessageSquare size={14} className="text-emerald-500" />,
  ENTREGABLE: <FileText size={14} className="text-purple-500" />,
  CERTIFICADO: <Award size={14} className="text-orange-500" />,
  ALERTA: <AlertTriangle size={14} className="text-red-500" />,
  SISTEMA: <Bell size={14} className="text-slate-400" />,
};

const COLORES_BORDE = {
  POSTULACION: '#3B82F6',
  PROYECTO: '#F59E0B',
  MENSAJE: '#10B981',
  ENTREGABLE: '#8B5CF6',
  CERTIFICADO: '#F97316',
  ALERTA: '#EF4444',
  SISTEMA: '#94a3b8',
};

export function NotificacionesPanel({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { data: notificaciones = [], isLoading } = useNotificaciones();
  const { mutate: leerNotificacion } = useLeerNotificacion();
  const { mutate: eliminarNotificacion } = useEliminarNotificacion();
  const [filtro, setFiltro] = useState('todas');

  const notificacionesFiltradas = filtro === 'no-leidas' 
    ? notificaciones.filter(n => !n.leida)
    : notificaciones;

  const ordenadas = [...notificacionesFiltradas].sort((a, b) => {
    if (a.leida !== b.leida) return a.leida ? 1 : -1;
    return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
  });

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  const getRuta = (notif) => {
    if (notif.urlReferencia && notif.urlReferencia.trim() !== '') {
      return notif.urlReferencia.startsWith('/') 
        ? notif.urlReferencia 
        : `/${notif.urlReferencia}`;
    }
    const tipo = notif.tipo?.toUpperCase() || '';
    if (tipo.includes('MENSAJE')) return '/workspace';
    if (tipo.includes('CERTIFICADO')) return '/certificados';
    return '/mis-postulaciones';
  };

  const handleClick = (notif) => {
    if (!notif.leida) leerNotificacion(notif.id);
    onClose();
    setTimeout(() => navigate(getRuta(notif)), 200);
  };

  const tiempoRelativo = (fecha) => {
    const ahora = new Date();
    const diff = Math.floor((ahora - new Date(fecha)) / 1000);
    if (diff < 60) return 'Ahora mismo';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
    if (diff < 604800) return `Hace ${Math.floor(diff / 86400)} d`;
    return new Date(fecha).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.3)' }}
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: '400px', maxWidth: '100vw', zIndex: 50,
              background: '#fff', boxShadow: '-8px 0 30px rgba(0,0,0,0.15)',
              display: 'flex', flexDirection: 'column',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e8e8e4', background: '#fafafa' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: noLeidas > 0 ? '#eff6ff' : '#f1f5f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}>
                    <Bell size={18} color={noLeidas > 0 ? '#1B6FE8' : '#94a3b8'} />
                    {noLeidas > 0 && (
                      <span style={{
                        position: 'absolute', top: -4, right: -4,
                        width: 18, height: 18, borderRadius: '50%',
                        background: '#EF4444', color: '#fff',
                        fontSize: 10, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>{noLeidas}</span>
                    )}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f1f3d', margin: 0 }}>Notificaciones</h3>
                    <p style={{ fontSize: 11, color: '#6b6b7a', margin: 0 }}>{noLeidas} sin leer de {notificaciones.length}</p>
                  </div>
                </div>
                <button onClick={onClose} style={{
                  width: 32, height: 32, borderRadius: 8, border: 'none',
                  background: '#f1f5f9', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <X size={16} color="#64748b" />
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setFiltro('todas')} style={{
                  padding: '6px 12px', borderRadius: 6, border: 'none',
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  background: filtro === 'todas' ? '#1B6FE8' : '#f1f5f9',
                  color: filtro === 'todas' ? '#fff' : '#64748b',
                }}>Todas</button>
                <button onClick={() => setFiltro('no-leidas')} style={{
                  padding: '6px 12px', borderRadius: 6, border: 'none',
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  background: filtro === 'no-leidas' ? '#1B6FE8' : '#f1f5f9',
                  color: filtro === 'no-leidas' ? '#fff' : '#64748b',
                }}>No leídas</button>
              </div>
            </div>

            {/* Lista */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontSize: 13 }}>Cargando...</div>
              ) : ordenadas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <Bell size={40} style={{ margin: '0 auto 12px', opacity: 0.15, color: '#94a3b8' }} />
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', margin: 0 }}>
                    {filtro === 'no-leidas' ? 'No hay notificaciones sin leer' : 'No tienes notificaciones'}
                  </p>
                </div>
              ) : (
                ordenadas.map((notif, index) => (
                  <motion.div
                    key={notif.id || index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    style={{
                      padding: '12px 14px', marginBottom: 6, borderRadius: 10,
                      border: '1px solid #e8e8e4',
                      borderLeft: `3px solid ${COLORES_BORDE[notif.tipo] || '#94a3b8'}`,
                      background: notif.leida ? '#fff' : '#f8fafc',
                      cursor: 'pointer', opacity: notif.leida ? 0.7 : 1,
                    }}
                  >
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: '#f1f5f9', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginTop: 2,
                      }}>
                        {ICONOS[notif.tipo] || <Bell size={14} className="text-slate-400" />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div onClick={() => handleClick(notif)}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: '#0f1f3d', margin: '0 0 3px' }}>
                            {notif.titulo}
                          </p>
                          <p style={{
                            fontSize: 11, color: '#64748b', margin: 0,
                            overflow: 'hidden', display: '-webkit-box',
                            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                          }}>
                            {notif.mensaje}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                          <span style={{ fontSize: 10, color: '#94a3b8' }}>{tiempoRelativo(notif.fechaCreacion)}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); eliminarNotificacion(notif.id); }}
                            style={{
                              width: 24, height: 24, borderRadius: 6, border: 'none',
                              background: 'transparent', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              opacity: 0.3,
                            }}
                            onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = '#fee2e2'; }}
                            onMouseLeave={e => { e.currentTarget.style.opacity = '0.3'; e.currentTarget.style.background = 'transparent'; }}
                          >
                            <Trash2 size={12} color="#EF4444" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default NotificacionesPanel;