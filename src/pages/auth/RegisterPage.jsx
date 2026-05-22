// src/pages/auth/RegisterPage.jsx
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { RegisterForm } from "@features/auth-register/RegisterForm";
import { TerminosCondicionesModal } from "../auth/TerminosCondicionesModal";
import { Logo } from "@shared/ui/Logo";
import { GraduationCap, Building2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

// ── Diagrama de Registro (Animación mejorada) ──────────────────────────
function RegisterDiagram() {
  // Posiciones - triángulo visual
  const USER = { cx: 120, cy: 160, r: 44 };
  const PLATFORM = { cx: 200, cy: 300, r: 52 };
  const BRIEFCASE = { cx: 280, cy: 160, r: 44 };

  return (
    <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <svg
        viewBox="0 0 400 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", maxWidth: 380, overflow: "visible" }}
        aria-hidden="true"
      >
        <defs>
          {/* Gradientes */}
          <linearGradient id="gradRegBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B6FE8" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="gradRegOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D4580A" />
          </linearGradient>
          <linearGradient id="gradRegGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Halos */}
          <radialGradient id="haloUser" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1B6FE8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0F2A4A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="haloPlatform" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0F2A4A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="haloBrief" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0F2A4A" stopOpacity="0" />
          </radialGradient>

          {/* Filtros */}
          <filter id="glowRegBlue">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowRegOrange">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ═══════════════════════════════════════
            LÍNEAS DE CONEXIÓN
            ═══════════════════════════════════════ */}
        
        {/* Usuario → Plataforma (línea azul ondeada) */}
        <motion.path
          d={`M ${USER.cx} ${USER.cy + USER.r} C ${USER.cx - 40} ${USER.cy + 100}, ${PLATFORM.cx - 60} ${PLATFORM.cy - 40}, ${PLATFORM.cx - PLATFORM.r} ${PLATFORM.cy}`}
          stroke="url(#gradRegBlue)" 
          strokeWidth="2.2" 
          strokeDasharray="10 7"
          strokeLinecap="round" 
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.55 }}
          transition={{ duration: 2.2, delay: 0.4, ease: "easeInOut" }}
        />

        {/* Plataforma → Empresa (línea naranja ondeada) */}
        <motion.path
          d={`M ${PLATFORM.cx + PLATFORM.r} ${PLATFORM.cy} C ${PLATFORM.cx + 60} ${PLATFORM.cy - 40}, ${BRIEFCASE.cx + 40} ${BRIEFCASE.cy + 100}, ${BRIEFCASE.cx} ${BRIEFCASE.cy + BRIEFCASE.r}`}
          stroke="url(#gradRegOrange)" 
          strokeWidth="2.2" 
          strokeDasharray="10 7"
          strokeLinecap="round" 
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.55 }}
          transition={{ duration: 2.2, delay: 0.4, ease: "easeInOut" }}
        />

        {/* ═══════════════════════════════════════
            NODO USUARIO (arriba-izquierda)
            ═══════════════════════════════════════ */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${USER.cx}px ${USER.cy}px` }}
        >
          {/* Halo */}
          <motion.circle cx={USER.cx} cy={USER.cy} r={75} fill="url(#haloUser)"
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.4, 0.6] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Anillos decorativos */}
          <motion.circle cx={USER.cx} cy={USER.cy} r={56} stroke="#1B6FE8" strokeWidth="1.5" fill="none" opacity="0.25"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: `${USER.cx}px ${USER.cy}px` }}
          />
          <circle cx={USER.cx} cy={USER.cy} r={50} stroke="#1B6FE8" strokeWidth="1" fill="none" opacity="0.3" />
          
          {/* Círculo principal */}
          <circle cx={USER.cx} cy={USER.cy} r={USER.r} fill="#0F2A4A" stroke="#1B6FE8" strokeWidth="2.5" />
          
          {/* Ícono persona */}
          <circle cx={USER.cx} cy={USER.cy - 8} r="11" fill="none" stroke="#1B6FE8" strokeWidth="2" />
          <path d={`M ${USER.cx - 15} ${USER.cy + 14} C ${USER.cx - 15} ${USER.cy + 4} ${USER.cx + 15} ${USER.cy + 4} ${USER.cx + 15} ${USER.cy + 14}`}
            fill="none" stroke="#1B6FE8" strokeWidth="2" strokeLinecap="round" />
          
          {/* Pulso de registro exitoso */}
          <motion.circle cx={USER.cx} cy={USER.cy} r={USER.r}
            stroke="#10B981" strokeWidth="2.5" fill="none" opacity="0"
            animate={{ 
              r: [USER.r, USER.r + 22, USER.r + 38],
              opacity: [0, 0.7, 0],
              strokeWidth: [2.5, 1.5, 0.5]
            }}
            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 7.2, delay: 4.5, ease: "easeOut" }}
          />
          
          <text x={USER.cx} y={USER.cy + USER.r + 24} textAnchor="middle" fontSize="13" fontWeight="700"
            fill="rgba(255,255,255,0.7)" fontFamily="Arial, 'Helvetica Neue', Helvetica, sans-serif" letterSpacing="1.2">
            TÚ
          </text>
        </motion.g>

        {/* ═══════════════════════════════════════
            NODO EMPRESA (arriba-derecha)
            ═══════════════════════════════════════ */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${BRIEFCASE.cx}px ${BRIEFCASE.cy}px` }}
        >
          {/* Halo */}
          <motion.circle cx={BRIEFCASE.cx} cy={BRIEFCASE.cy} r={75} fill="url(#haloBrief)"
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.4, 0.6] }}
            transition={{ duration: 4, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Anillos decorativos */}
          <motion.circle cx={BRIEFCASE.cx} cy={BRIEFCASE.cy} r={56} stroke="#06B6D4" strokeWidth="1.5" fill="none" opacity="0.25"
            animate={{ rotate: -360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: `${BRIEFCASE.cx}px ${BRIEFCASE.cy}px` }}
          />
          <circle cx={BRIEFCASE.cx} cy={BRIEFCASE.cy} r={50} stroke="#06B6D4" strokeWidth="1" fill="none" opacity="0.3" />
          
          {/* Círculo principal */}
          <circle cx={BRIEFCASE.cx} cy={BRIEFCASE.cy} r={BRIEFCASE.r} fill="#0F2A4A" stroke="#06B6D4" strokeWidth="2.5" />
          
          {/* Ícono edificio/empresa */}
          <rect x={BRIEFCASE.cx - 12} y={BRIEFCASE.cy - 10} width="9" height="16" rx="1.5" fill="none" stroke="#06B6D4" strokeWidth="2" />
          <rect x={BRIEFCASE.cx + 2} y={BRIEFCASE.cy - 16} width="13" height="22" rx="1.5" fill="none" stroke="#06B6D4" strokeWidth="2" />
          <line x1={BRIEFCASE.cx - 16} y1={BRIEFCASE.cy + 8} x2={BRIEFCASE.cx + 18} y2={BRIEFCASE.cy + 8} stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" />
          
          {/* Pulso de confirmación */}
          <motion.circle cx={BRIEFCASE.cx} cy={BRIEFCASE.cy} r={BRIEFCASE.r}
            stroke="#10B981" strokeWidth="2.5" fill="none" opacity="0"
            animate={{ 
              r: [BRIEFCASE.r, BRIEFCASE.r + 22, BRIEFCASE.r + 38],
              opacity: [0, 0.7, 0],
              strokeWidth: [2.5, 1.5, 0.5]
            }}
            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 7.2, delay: 6.3, ease: "easeOut" }}
          />
          
          <text x={BRIEFCASE.cx} y={BRIEFCASE.cy + BRIEFCASE.r + 24} textAnchor="middle" fontSize="13" fontWeight="700"
            fill="rgba(255,255,255,0.7)" fontFamily="Arial, 'Helvetica Neue', Helvetica, sans-serif" letterSpacing="1.2">
            EMPRESA
          </text>
        </motion.g>

        {/* ═══════════════════════════════════════
            NODO PLATAFORMA (centro-abajo) - LINKUY
            ═══════════════════════════════════════ */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${PLATFORM.cx}px ${PLATFORM.cy}px` }}
        >
          {/* Halo grande */}
          <motion.circle cx={PLATFORM.cx} cy={PLATFORM.cy} r={95} fill="url(#haloPlatform)"
            animate={{ scale: [1, 1.1, 1], opacity: [0.55, 0.35, 0.55] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Anillos concéntricos */}
          <motion.circle cx={PLATFORM.cx} cy={PLATFORM.cy} r={66} stroke="#F59E0B" strokeWidth="1.5" fill="none" opacity="0.3"
            animate={{ r: [66, 72, 66], opacity: [0.3, 0.2, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle cx={PLATFORM.cx} cy={PLATFORM.cy} r={58} stroke="#F59E0B" strokeWidth="1" fill="none" opacity="0.35"
            animate={{ r: [58, 62, 58], opacity: [0.35, 0.25, 0.35] }}
            transition={{ duration: 3, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Círculo principal */}
          <circle cx={PLATFORM.cx} cy={PLATFORM.cy} r={PLATFORM.r} fill="#0F2A4A" stroke="#F59E0B" strokeWidth="2.5" />
          
          {/* Letra M grande */}
          <text x={PLATFORM.cx} y={PLATFORM.cy + 9} textAnchor="middle" fontSize="30" fontWeight="900"
            fill="url(#gradRegOrange)" fontFamily="Arial, 'Helvetica Neue', Helvetica, sans-serif">
            M
          </text>
          
          {/* Pulso de procesamiento (cuando recibe) */}
          <motion.circle cx={PLATFORM.cx} cy={PLATFORM.cy} r={PLATFORM.r}
            stroke="#10B981" strokeWidth="3" fill="none" opacity="0"
            animate={{ 
              r: [PLATFORM.r, PLATFORM.r + 28, PLATFORM.r + 50],
              opacity: [0, 0.8, 0],
              strokeWidth: [3, 2, 0.5]
            }}
            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 7.2, delay: 2.2, ease: "easeOut" }}
          />
          
          <text x={PLATFORM.cx} y={PLATFORM.cy + PLATFORM.r + 26} textAnchor="middle" fontSize="14" fontWeight="700"
            fill="rgba(255,255,255,0.8)" fontFamily="Arial, 'Helvetica Neue', Helvetica, sans-serif" letterSpacing="2">
            LINKUY
          </text>
        </motion.g>

        {/* ═══════════════════════════════════════
            PARTÍCULAS VIAJERAS
            ═══════════════════════════════════════ */}

        {/* Partícula azul: TÚ → LINKUY (registro de usuario) */}
        <motion.circle 
          r="5.5" 
          fill="#1B6FE8" 
          filter="url(#glowRegBlue)"
          animate={{ 
            offsetDistance: ["0%", "100%"], 
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1.3, 0.8]
          }}
          style={{ 
            offsetPath: `path('M ${USER.cx} ${USER.cy + USER.r} C ${USER.cx - 40} ${USER.cy + 100}, ${PLATFORM.cx - 60} ${PLATFORM.cy - 40}, ${PLATFORM.cx - PLATFORM.r} ${PLATFORM.cy}')` 
          }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 6.5, delay: 0.5, ease: "easeInOut" }}
        />

        {/* Partícula naranja: LINKUY → EMPRESA (conexión) */}
        <motion.circle 
          r="5.5" 
          fill="#F59E0B" 
          filter="url(#glowRegOrange)"
          animate={{ 
            offsetDistance: ["0%", "100%"], 
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1.3, 0.8]
          }}
          style={{ 
            offsetPath: `path('M ${PLATFORM.cx + PLATFORM.r} ${PLATFORM.cy} C ${PLATFORM.cx + 60} ${PLATFORM.cy - 40}, ${BRIEFCASE.cx + 40} ${BRIEFCASE.cy + 100}, ${BRIEFCASE.cx} ${BRIEFCASE.cy + BRIEFCASE.r}')` 
          }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 6.5, delay: 3.2, ease: "easeInOut" }}
        />

        {/* ═══════════════════════════════════════
            ETIQUETAS ANIMADAS
            ═══════════════════════════════════════ */}
        
        {/* Etiqueta "REGISTRO" */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0.8, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.3, ease: "easeInOut" }}
        >
          <rect x="38" y="82" width="84" height="22" rx="6" fill="rgba(27,111,232,0.12)" stroke="rgba(27,111,232,0.3)" strokeWidth="1" />
          <text x="80" y="97" textAnchor="middle" fontSize="9" fontWeight="700"
            fontFamily="Arial, 'Helvetica Neue', Helvetica, sans-serif" letterSpacing="1.5"
            fill="#67d4f8">REGISTRO</text>
        </motion.g>

        {/* Etiqueta "CONEXIÓN" */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0.8, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 2.8, ease: "easeInOut" }}
        >
          <rect x="276" y="82" width="84" height="22" rx="6" fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
          <text x="318" y="97" textAnchor="middle" fontSize="9" fontWeight="700"
            fontFamily="Arial, 'Helvetica Neue', Helvetica, sans-serif" letterSpacing="1.5"
            fill="#F59E0B">CONEXIÓN</text>
        </motion.g>

        {/* Check verde en nodo central */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1.8, ease: "easeInOut" }}
        >
          <circle cx={PLATFORM.cx + 30} cy={PLATFORM.cy - 25} r="14" fill="rgba(16,185,129,0.15)" stroke="#10B981" strokeWidth="1.5" />
          <path d={`M ${PLATFORM.cx + 24} ${PLATFORM.cy - 25} L ${PLATFORM.cx + 30} ${PLATFORM.cy - 20} L ${PLATFORM.cx + 37} ${PLATFORM.cy - 31}`}
            stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </motion.g>

        {/* ── Puntos ambientales ── */}
        {[[30,50], [370,60], [40,450], [360,440], [200,80], [200,440]].map(([x,y], i) => (
          <motion.circle
            key={i}
            cx={x} cy={y} r="2.2"
            fill="rgba(255,255,255,0.12)"
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 2.5 + i * 0.2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
          />
        ))}
      </svg>
      
    </div>
  );
}

// ── Main Register Page ────────────────────────────────────────────────────────
export function RegisterPage() {
  const { tipo } = useParams();
  const navigate = useNavigate();
  const currentTipo = tipo === "mype" ? "mype" : "estudiante";
  const esEstudiante = currentTipo === "estudiante";

  const [isFormDirty, setIsFormDirty] = useState(false);
  const [terminosModalOpen, setTerminosModalOpen] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms]   = useState(false);
  const [targetTipo, setTargetTipo] = useState(null);

  const handleToggle = (nuevoTipo) => {
    if (nuevoTipo === currentTipo) return;
    
    if (isFormDirty) {
      setTargetTipo(nuevoTipo); 
    } else {
      setHasAcceptedTerms(false);
      navigate(`/register/${nuevoTipo}`, { replace: true });
    }
  };

  const confirmToggle = () => {
    setIsFormDirty(false);
    setHasAcceptedTerms(false); 
    navigate(`/register/${targetTipo}`, { replace: true });
    setTargetTipo(null);
  };

  return (
    <>
      <style>{`
        @keyframes gridScroll_reg {
          from { transform: translateY(0); }
          to   { transform: translateY(48px); }
        }

        .dot-bg {
          position: absolute; inset: -48px;
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0);
          background-size: 32px 32px;
          animation: gridScroll_reg 12s linear infinite;
          pointer-events: none;
        }

        /* Tabs compactos */
        .tab-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
          height: 36px; font-size: 12px; font-weight: 500;
          font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; 
          border: none; cursor: pointer;
          border-radius: 6px; transition: all 0.25s ease; 
          color: #6B7280;
          background: transparent;
          letter-spacing: -0.01em;
        }
        .tab-active {
          background: #FFFFFF !important;
          color: #0F1F3D !important;
          border: 1.5px solid #E5E7EB !important;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          font-weight: 600;
        }

        /* Modal */
        .modal-ghost-btn {
          height: 40px; border: 1.5px solid #E5E7EB; background: white;
          color: #4B5563; font-size: 13px; font-weight: 500;
          font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; 
          cursor: pointer;
          border-radius: 7px; width: 100%; transition: all 0.2s ease;
        }
        .modal-ghost-btn:hover { 
          background: #F9FAFB; 
          border-color: #D1D5DB;
        }

        @media (max-width: 1023px) {
          .login-left { display: none !important; }
          .login-right { padding: 60px 24px 40px !important; }
          .mobile-logo { display: flex !important; }
        }
        @media (min-width: 1024px) {
          .mobile-logo { display: none !important; }
        }
        @media (max-width: 480px) {
          .login-right { padding: 56px 20px 32px !important; }
        }
      `}</style>

      {/* ── Modal de Confirmación ── */}
<AnimatePresence>
  {targetTipo && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ 
        position: "fixed", 
        inset: 0, 
        zIndex: 9999, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        background: "rgba(15, 42, 74, 0.6)", 
        backdropFilter: "blur(6px)",
        padding: 20
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ 
          background: "white", 
          padding: 0, 
          borderRadius: 12, 
          width: "100%", 
          maxWidth: 420, 
          boxShadow: "0 25px 50px rgba(0,0,0,0.15)", 
          fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
          overflow: "hidden"
        }}
      >
        {/* Header con icono */}
        <div style={{ 
          padding: "28px 28px 20px",
          borderBottom: "1px solid #F3F4F6"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{ 
              width: 44, 
              height: 44, 
              borderRadius: 10, 
              background: "#FEF3C7", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              flexShrink: 0
            }}>
              <AlertCircle size={22} color="#F59E0B" />
            </div>
            <div>
              <h3 style={{ 
                margin: "0 0 4px", 
                fontSize: 17, 
                fontWeight: 600, 
                color: "#0F1F3D", 
                letterSpacing: "-0.02em",
                lineHeight: 1.3
              }}>
                ¿Cambiar tipo de registro?
              </h3>
              <p style={{ 
                margin: 0, 
                color: "#6B7280", 
                fontSize: 13, 
                lineHeight: 1.5, 
                fontWeight: 400 
              }}>
                Perderás los datos ingresados en el formulario actual
              </p>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div style={{ padding: "20px 28px 24px" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 14px",
            background: "#F9FAFB",
            borderRadius: 8,
            border: "1px solid #E5E7EB",
            marginBottom: 20
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: targetTipo === "mype" ? "#FEF3C7" : "#DBEAFE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              {targetTipo === "mype" ? 
                <Building2 size={16} color="#F59E0B" /> : 
                <GraduationCap size={16} color="#1B6FE8" />
              }
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#0F1F3D" }}>
                Cambiando a {targetTipo === "mype" ? "Empresa (MYPE)" : "Estudiante"}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9CA3AF" }}>
                Se reiniciará todo el formulario
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button 
              onClick={() => setTargetTipo(null)} 
              style={{ 
                flex: 1, 
                height: 42, 
                borderRadius: 8, 
                border: "1.5px solid #E5E7EB", 
                background: "white",
                color: "#4B5563", 
                fontSize: 14, 
                fontWeight: 500,
                fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => { 
                e.currentTarget.style.background = "#F9FAFB"; 
                e.currentTarget.style.borderColor = "#D1D5DB"; 
              }}
              onMouseLeave={e => { 
                e.currentTarget.style.background = "white"; 
                e.currentTarget.style.borderColor = "#E5E7EB"; 
              }}
            >
              Cancelar
            </button>
            <button 
              onClick={confirmToggle} 
              style={{ 
                flex: 1, 
                height: 42, 
                borderRadius: 8, 
                border: "none", 
                color: "white", 
                background: "#EF4444", 
                fontWeight: 600, 
                fontSize: 14, 
                cursor: "pointer", 
                fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif", 
                transition: "all 0.2s" 
              }}
              onMouseEnter={e => { 
                e.currentTarget.style.background = "#DC2626"; 
              }}
              onMouseLeave={e => { 
                e.currentTarget.style.background = "#EF4444"; 
              }}
            >
              Sí, cambiar
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      <div style={{ minHeight: "100svh", display: "flex", fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif", overflow: "hidden" }}>

        {/* ── LEFT panel ─────────────────────────────────────────────────── */}
        <div
          className="login-left"
          style={{
            width: "55%", flexShrink: 0,
            position: "relative", overflow: "hidden",
            display: "flex", flexDirection: "column",
            background: "linear-gradient(150deg, #081828 0%, #0F2A4A 55%, #0C3260 100%)",
          }}
        >
          <div className="dot-bg" />
          <div style={{ position: "absolute", top: -160, right: -160, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,#06B6D4,transparent 70%)", opacity: 0.15, filter: "blur(80px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -100, left: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,#1B6FE8,transparent)", opacity: 0.08, filter: "blur(60px)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 10, padding: "48px 56px 0" }}>
            <Logo />
          </div>

          <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column", padding: "30px 40px 50px" }}>
            <RegisterDiagram />
          </div>
        </div>

        {/* ── RIGHT panel ────────────────────────────────────────────────── */}
        <div
          className="login-right"
          style={{
            flex: 1, display: "flex", flexDirection: "column",
            background: "#F8FAFC", padding: "40px 36px",
            position: "relative", overflow: "hidden",
            overflowY: "auto"
          }}
        >
          <div style={{ position: "absolute", top: 0, right: 0, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,#1B6FE8,transparent)", opacity: 0.03, filter: "blur(80px)", pointerEvents: "none" }} />

          <div className="mobile-logo" style={{ position: "absolute", top: 20, left: 20, alignItems: "center" }}>
            <Logo />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 10, margin: "auto" }}
          >
            {/* Header más compacto */}
            <div style={{ marginBottom: 24 }}>
              <h1 style={{
                fontSize: 26, fontWeight: 700, 
                fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
                color: "#0F1F3D", letterSpacing: "-0.02em", marginBottom: 6, lineHeight: 1.2,
              }}>
                Crea tu cuenta
              </h1>
              <p style={{ fontSize: 13, color: "#6B7280", fontWeight: 400, lineHeight: 1.5, margin: 0, fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" }}>
                {esEstudiante ? "Únete como estudiante y construye tu portafolio" : "Registra tu empresa y publica proyectos"}
              </p>
            </div>

            {/* Tabs más compactos */}
            <div style={{
              display: "flex", padding: 3, marginBottom: 22, gap: 3,
              background: "#F3F4F6", border: "1.5px solid #E5E7EB", borderRadius: "7px"
            }}>
              <button type="button" onClick={() => handleToggle("estudiante")} className={`tab-btn ${esEstudiante ? "tab-active" : ""}`}>
                <GraduationCap size={14} /> Soy Estudiante
              </button>
              <button type="button" onClick={() => handleToggle("mype")} className={`tab-btn ${!esEstudiante ? "tab-active" : ""}`}>
                <Building2 size={14} /> Soy Empresa
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={currentTipo}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease }}
              >
                <RegisterForm 
                  tipo={currentTipo} 
                  onDirtyChange={setIsFormDirty}
                  hasAcceptedTerms={hasAcceptedTerms}
                  onOpenTerms={() => setTerminosModalOpen(true)}
                />
              </motion.div>
            </AnimatePresence>

            <p style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "#9CA3AF", fontWeight: 400, fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" }}>
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" style={{ color: "#1B6FE8", textDecoration: "none", fontWeight: 600, transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#0E54C4"}
                onMouseLeave={e => e.target.style.color = "#1B6FE8"}>
                Inicia sesión aquí
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
      {/* Modal de Términos y Condiciones */}
      <TerminosCondicionesModal
        isOpen={terminosModalOpen}
        onClose={() => setTerminosModalOpen(false)}
        onAccept={() => {
          setHasAcceptedTerms(true);
          setTerminosModalOpen(false);
        }}
      />
    </>
  );
}