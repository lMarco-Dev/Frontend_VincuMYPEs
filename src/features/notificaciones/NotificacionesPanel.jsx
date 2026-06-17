import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Trash2 } from 'lucide-react';
import { useNotificaciones, useLeerNotificacion, useEliminarNotificacion } from './useNotificaciones';

const FONT = "'Angro Std', 'Outfit', sans-serif";

// Colores suaves para el borde izquierdo según tipo (apenas perceptible)
const BORDE_TIPO = {
  POSTULACION: '#cbd5e1',
  PROYECTO: '#cbd5e1',
  MENSAJE: '#cbd5e1',
  ENTREGABLE: '#cbd5e1',
  CERTIFICADO: '#cbd5e1',
  ALERTA: '#fecaca',
  SISTEMA: '#cbd5e1',
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

  // Determina si una notificación está vinculada a un proyecto temporal
 const esDeProyecto = (notif) => {
  if (notif.proyectoId) return true;
  const tipo = (notif.tipo || '').toUpperCase();
  return (
    tipo === 'PROYECTO' ||
    tipo === 'PROYECTO_COMPLETADO' ||
    tipo === 'PROYECTO_CONFIRMADO' ||
    tipo === 'ENTREGABLE' ||
    tipo.includes('PROYECTO') ||
    tipo.includes('ENTREGABLE')
  );
};

const getRuta = (notif) => {
  // 1. Si ya detectamos que es de proyecto, no hay ruta
  if (esDeProyecto(notif)) return null;

  // 2. Construimos la ruta según la lógica actual
  let ruta = null;
  if (notif.urlReferencia && notif.urlReferencia.trim() !== '') {
    ruta = notif.urlReferencia.startsWith('/')
      ? notif.urlReferencia
      : `/${notif.urlReferencia}`;
  } else {
    const tipo = notif.tipo?.toUpperCase() || '';
    if (tipo.includes('MENSAJE')) ruta = '/workspace';
    else if (tipo.includes('CERTIFICADO')) ruta = '/certificados';
    else ruta = '/mis-postulaciones';
  }

  // 3. Bloqueamos explícitamente cualquier ruta que apunte a un workspace
  if (ruta && ruta.startsWith('/workspace')) return null;

  return ruta;
};

  const handleClick = (notif) => {
    if (!notif.leida) leerNotificacion(notif.id);
    onClose();
    // Solo navega si NO es de proyecto
    if (!esDeProyecto(notif)) {
      setTimeout(() => navigate(getRuta(notif)), 200);
    }
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
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 40,
              background: 'rgba(15, 23, 42, 0.3)',
              backdropFilter: 'blur(2px)',
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '400px',
              maxWidth: '100vw',
              zIndex: 50,
              background: '#ffffff',
              boxShadow: '-8px 0 30px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: FONT,
            }}
          >
            {/* Header sin ícono */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #f1f5f9',
                background: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f1f3d', margin: 0, fontFamily: FONT }}>
                    Notificaciones
                  </h3>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0', fontFamily: FONT }}>
                    {noLeidas} sin leer de {notificaciones.length}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: 'none',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Filtros (igual que antes) */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setFiltro('todas')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    border: 'none',
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: 'pointer',
                    background: filtro === 'todas' ? '#f1f5f9' : 'transparent',
                    color: filtro === 'todas' ? '#0f1f3d' : '#94a3b8',
                    fontFamily: FONT,
                    transition: 'all 0.2s',
                  }}
                >
                  Todas
                </button>
                <button
                  onClick={() => setFiltro('no-leidas')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    border: 'none',
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: 'pointer',
                    background: filtro === 'no-leidas' ? '#f0fdf4' : 'transparent',
                    color: filtro === 'no-leidas' ? '#059669' : '#94a3b8',
                    fontFamily: FONT,
                    transition: 'all 0.2s',
                  }}
                >
                  No leídas
                </button>
              </div>
            </div>

            {/* Lista */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px' }}>
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontSize: 13 }}>
                  Cargando...
                </div>
              ) : ordenadas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <Bell size={36} style={{ margin: '0 auto 12px', color: '#e2e8f0' }} />
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8', margin: 0 }}>
                    {filtro === 'no-leidas' ? 'Sin notificaciones nuevas' : 'No tienes notificaciones'}
                  </p>
                </div>
              ) : (
                ordenadas.map((notif, index) => {
                  const esProyecto = esDeProyecto(notif);
                  return (
                    <motion.div
                      key={notif.id || index}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02, duration: 0.25 }}
                      style={{
                        marginBottom: 8,
                        borderRadius: 12,
                        border: '1px solid #f1f5f9',
                        borderLeft: `3px solid ${BORDE_TIPO[notif.tipo] || '#e2e8f0'}`,
                        background: notif.leida ? '#ffffff' : '#f0fdf4',
                        cursor: esProyecto ? 'default' : 'pointer',
                        transition: 'background 0.3s ease',
                      }}
                      layout
                    >
                      <div style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 8,
                              background: '#f8fafc',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: 1,
                            }}
                          >
                            <Bell size={14} color="#94a3b8" />
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div onClick={() => handleClick(notif)}>
                              <p
                                style={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: '#0f1f3d',
                                  margin: '0 0 4px',
                                  lineHeight: 1.4,
                                }}
                              >
                                {notif.titulo}
                              </p>
                              <p
                                style={{
                                  fontSize: 12,
                                  color: '#64748b',
                                  margin: 0,
                                  lineHeight: 1.5,
                                  overflow: 'hidden',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                }}
                              >
                                {notif.mensaje}
                              </p>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: 8,
                              }}
                            >
                              <span style={{ fontSize: 10, color: '#94a3b8' }}>
                                {tiempoRelativo(notif.fechaCreacion)}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  eliminarNotificacion(notif.id);
                                }}
                                style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: 6,
                                  border: 'none',
                                  background: 'transparent',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#cbd5e1',
                                  transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = '#ef4444';
                                  e.currentTarget.style.background = '#fef2f2';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = '#cbd5e1';
                                  e.currentTarget.style.background = 'transparent';
                                }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default NotificacionesPanel;