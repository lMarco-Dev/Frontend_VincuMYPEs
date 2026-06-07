import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2, ShieldAlert } from "lucide-react";
import { Logo } from "@shared/ui/Logo";
import { useLogin } from "@features/auth-login/useLogin";

// ── Security ──────────────────────────────────────────────────────────────────
const stripXSS = (v) =>
  v.replace(/<[^>]*>/g, "").replace(/javascript:/gi, "")
   .replace(/on\w+\s*=/gi, "").replace(/[<>"'`]/g, "");
const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const MAX = 40;
const ease = [0.22, 1, 0.36, 1];

// ── Connection Diagram ────────────────────────────────────────────────────────
function ConnectionDiagram() {
  // Posiciones de los nodos
  const MYPE = { cx: 80, cy: 130, r: 42 };
  const LINKUY = { cx: 200, cy: 300, r: 48 };
  const ESTUDIANTE = { cx: 320, cy: 130, r: 42 };

  return (
    <div style={{ 
      position: "relative", 
      flex: 1, 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "40px 20px"
    }}>
      <svg
        viewBox="0 0 400 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ 
          width: "100%", 
          maxWidth: 400, 
          overflow: "visible" 
        }}
        aria-hidden="true"
      >
        <defs>
          {/* Gradientes */}
          <linearGradient id="gradMype" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B6FE8" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="gradEst" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#1B6FE8" />
          </linearGradient>
          <linearGradient id="gradLinkuy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D4580A" />
          </linearGradient>
          
          {/* Halos radiales */}
          <radialGradient id="haloMype" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1B6FE8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0F2A4A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="haloEst" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0F2A4A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="haloLinkuy" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0F2A4A" stopOpacity="0" />
          </radialGradient>
          
          {/* Filtros */}
          <filter id="glowBlue">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowOrange">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Líneas de conexión fijas ── */}
        {/* MYPE → LINKUY */}
        <motion.path
          d={`M ${MYPE.cx + 30} ${MYPE.cy + 20} C ${MYPE.cx + 50} ${MYPE.cy + 80}, ${LINKUY.cx - 40} ${LINKUY.cy - 60}, ${LINKUY.cx} ${LINKUY.cy - LINKUY.r}`}
          stroke="url(#gradLinkuy)" 
          strokeWidth="2" 
          strokeDasharray="8 6"
          strokeLinecap="round" 
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
        />
        
        {/* LINKUY → ESTUDIANTE */}
        <motion.path
          d={`M ${LINKUY.cx + LINKUY.r} ${LINKUY.cy} C ${LINKUY.cx + 40} ${LINKUY.cy - 60}, ${ESTUDIANTE.cx - 50} ${ESTUDIANTE.cy + 80}, ${ESTUDIANTE.cx - 30} ${ESTUDIANTE.cy + 20}`}
          stroke="url(#gradLinkuy)" 
          strokeWidth="2" 
          strokeDasharray="8 6"
          strokeLinecap="round" 
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
        />
        
        {/* ESTUDIANTE → LINKUY (azul) */}
        <motion.path
          d={`M ${ESTUDIANTE.cx - 30} ${ESTUDIANTE.cy - 20} C ${ESTUDIANTE.cx - 50} ${ESTUDIANTE.cy - 80}, ${LINKUY.cx + 40} ${LINKUY.cy + 60}, ${LINKUY.cx} ${LINKUY.cy + LINKUY.r}`}
          stroke="url(#gradEst)" 
          strokeWidth="2" 
          strokeDasharray="8 6"
          strokeLinecap="round" 
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
        />
        
        {/* LINKUY → MYPE (azul) */}
        <motion.path
          d={`M ${LINKUY.cx - LINKUY.r} ${LINKUY.cy} C ${LINKUY.cx - 40} ${LINKUY.cy + 60}, ${MYPE.cx + 50} ${MYPE.cy - 80}, ${MYPE.cx + 30} ${MYPE.cy - 20}`}
          stroke="url(#gradMype)" 
          strokeWidth="2" 
          strokeDasharray="8 6"
          strokeLinecap="round" 
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
        />

        {/* ═══════════════════════════════════════
            NODO MYPE
            ═══════════════════════════════════════ */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${MYPE.cx}px ${MYPE.cy}px` }}
        >
          {/* Halo pulsante */}
          <motion.circle 
            cx={MYPE.cx} cy={MYPE.cy} r={75} 
            fill="url(#haloMype)"
            animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.4, 0.6] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Pulso de recepción (cuando recibe de LINKUY) */}
          <motion.circle 
            cx={MYPE.cx} cy={MYPE.cy} r={MYPE.r}
            stroke="#1B6FE8" strokeWidth="2" fill="none" opacity="0"
            animate={{ 
              r: [MYPE.r, MYPE.r + 20, MYPE.r + 40],
              opacity: [0, 0.6, 0],
              strokeWidth: [2, 1.5, 1]
            }}
            transition={{ 
              duration: 3.2, 
              repeat: Infinity, 
              delay: 5.6,
              ease: "easeOut"
            }}
          />
          
          {/* Anillos */}
          <motion.circle cx={MYPE.cx} cy={MYPE.cy} r={55} stroke="#1B6FE8" strokeWidth="1.5" fill="none" opacity="0.3"
            animate={{ r: [55, 62, 55], opacity: [0.3, 0.2, 0.3] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle cx={MYPE.cx} cy={MYPE.cy} r={48} stroke="#1B6FE8" strokeWidth="1" fill="none" opacity="0.35"
            animate={{ r: [48, 53, 48], opacity: [0.35, 0.25, 0.35] }}
            transition={{ duration: 3.5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Círculo principal */}
          <circle cx={MYPE.cx} cy={MYPE.cy} r={MYPE.r} fill="#0F2A4A" stroke="#1B6FE8" strokeWidth="2.5" />
          
          {/* Icono edificio */}
          <rect x={MYPE.cx-14} y={MYPE.cy-12} width="10" height="18" rx="1.5" fill="none" stroke="#1B6FE8" strokeWidth="2" />
          <rect x={MYPE.cx} y={MYPE.cy-18} width="14" height="24" rx="1.5" fill="none" stroke="#1B6FE8" strokeWidth="2" />
          <line x1={MYPE.cx-18} y1={MYPE.cy+8} x2={MYPE.cx+18} y2={MYPE.cy+8} stroke="#1B6FE8" strokeWidth="2" strokeLinecap="round" />
          
          <text x={MYPE.cx} y={MYPE.cy+MYPE.r+22} textAnchor="middle" fontSize="14" fontWeight="700"
            fill="rgba(255,255,255,0.7)" fontFamily="Arial, 'Helvetica Neue', Helvetica, sans-serif" letterSpacing="1.5">
            MYPE
          </text>
        </motion.g>

        {/* ═══════════════════════════════════════
            NODO ESTUDIANTE
            ═══════════════════════════════════════ */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${ESTUDIANTE.cx}px ${ESTUDIANTE.cy}px` }}
        >
          {/* Halo pulsante */}
          <motion.circle 
            cx={ESTUDIANTE.cx} cy={ESTUDIANTE.cy} r={75} 
            fill="url(#haloEst)"
            animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.4, 0.6] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Pulso de recepción (cuando recibe de LINKUY) */}
          <motion.circle 
            cx={ESTUDIANTE.cx} cy={ESTUDIANTE.cy} r={ESTUDIANTE.r}
            stroke="#06B6D4" strokeWidth="2" fill="none" opacity="0"
            animate={{ 
              r: [ESTUDIANTE.r, ESTUDIANTE.r + 20, ESTUDIANTE.r + 40],
              opacity: [0, 0.6, 0],
              strokeWidth: [2, 1.5, 1]
            }}
            transition={{ 
              duration: 3.2, 
              repeat: Infinity, 
              delay: 3.4,
              ease: "easeOut"
            }}
          />
          
          {/* Anillos */}
          <motion.circle cx={ESTUDIANTE.cx} cy={ESTUDIANTE.cy} r={55} stroke="#06B6D4" strokeWidth="1.5" fill="none" opacity="0.3"
            animate={{ r: [55, 62, 55], opacity: [0.3, 0.2, 0.3] }}
            transition={{ duration: 3.5, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle cx={ESTUDIANTE.cx} cy={ESTUDIANTE.cy} r={48} stroke="#06B6D4" strokeWidth="1" fill="none" opacity="0.35"
            animate={{ r: [48, 53, 48], opacity: [0.35, 0.25, 0.35] }}
            transition={{ duration: 3.5, delay: 1.3, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Círculo principal */}
          <circle cx={ESTUDIANTE.cx} cy={ESTUDIANTE.cy} r={ESTUDIANTE.r} fill="#0F2A4A" stroke="#06B6D4" strokeWidth="2.5" />
          
          {/* Icono persona */}
          <circle cx={ESTUDIANTE.cx} cy={ESTUDIANTE.cy-10} r="12" fill="none" stroke="#06B6D4" strokeWidth="2" />
          <path d={`M ${ESTUDIANTE.cx-18} ${ESTUDIANTE.cy+16} C ${ESTUDIANTE.cx-18} ${ESTUDIANTE.cy+4} ${ESTUDIANTE.cx+18} ${ESTUDIANTE.cy+4} ${ESTUDIANTE.cx+18} ${ESTUDIANTE.cy+16}`}
            fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" />
          
          <text x={ESTUDIANTE.cx} y={ESTUDIANTE.cy+ESTUDIANTE.r+22} textAnchor="middle" fontSize="14" fontWeight="700"
            fill="rgba(255,255,255,0.7)" fontFamily="Arial, 'Helvetica Neue', Helvetica, sans-serif" letterSpacing="1.5">
            ESTUDIANTE
          </text>
        </motion.g>

        {/* ═══════════════════════════════════════
            NODO LINKUY (PLATAFORMA)
            ═══════════════════════════════════════ */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${LINKUY.cx}px ${LINKUY.cy}px` }}
        >
          {/* Halo pulsante */}
          <motion.circle 
            cx={LINKUY.cx} cy={LINKUY.cy} r={90} 
            fill="url(#haloLinkuy)"
            animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.4, 0.6] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Pulso de procesamiento (se activa al recibir) */}
          <motion.circle 
            cx={LINKUY.cx} cy={LINKUY.cy} r={LINKUY.r}
            stroke="#F59E0B" strokeWidth="2.5" fill="none" opacity="0"
            animate={{ 
              r: [LINKUY.r, LINKUY.r + 25, LINKUY.r + 45],
              opacity: [0, 0.8, 0],
              strokeWidth: [2.5, 2, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              delay: 0.8,
              ease: "easeOut"
            }}
          />
          
          {/* Segundo pulso (para cuando recibe de estudiante) */}
          <motion.circle 
            cx={LINKUY.cx} cy={LINKUY.cy} r={LINKUY.r}
            stroke="#F59E0B" strokeWidth="2.5" fill="none" opacity="0"
            animate={{ 
              r: [LINKUY.r, LINKUY.r + 25, LINKUY.r + 45],
              opacity: [0, 0.8, 0],
              strokeWidth: [2.5, 2, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              delay: 4,
              ease: "easeOut"
            }}
          />
          
          {/* Anillos */}
          <motion.circle cx={LINKUY.cx} cy={LINKUY.cy} r={62} stroke="#F59E0B" strokeWidth="1.5" fill="none" opacity="0.3"
            animate={{ r: [62, 70, 62], opacity: [0.3, 0.2, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle cx={LINKUY.cx} cy={LINKUY.cy} r={54} stroke="#F59E0B" strokeWidth="1" fill="none" opacity="0.35"
            animate={{ r: [54, 60, 54], opacity: [0.35, 0.25, 0.35] }}
            transition={{ duration: 3, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Círculo principal */}
          <circle cx={LINKUY.cx} cy={LINKUY.cy} r={LINKUY.r} fill="#0F2A4A" stroke="#F59E0B" strokeWidth="2.5" />
          
          {/* Letra M estilizada */}
          <text x={LINKUY.cx} y={LINKUY.cy+8} textAnchor="middle" fontSize="28" fontWeight="900"
            fill="url(#gradLinkuy)" fontFamily="Arial, 'Helvetica Neue', Helvetica, sans-serif">
            M
          </text>
          
          <text x={LINKUY.cx} y={LINKUY.cy+LINKUY.r+24} textAnchor="middle" fontSize="14" fontWeight="700"
            fill="rgba(255,255,255,0.8)" fontFamily="Arial, 'Helvetica Neue', Helvetica, sans-serif" letterSpacing="2">
            LINKUY
          </text>
        </motion.g>

        {/* ═══════════════════════════════════════
            PARTÍCULAS VIAJERAS
            ═══════════════════════════════════════ */}
        
        {/* Partícula naranja: MYPE → LINKUY */}
        <motion.circle 
          r="5.5" 
          fill="#F59E0B" 
          filter="url(#glowOrange)"
          animate={{ 
            offsetDistance: ["0%", "100%"], 
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1.3, 0.8]
          }}
          style={{ 
            offsetPath: `path('M ${MYPE.cx + 30} ${MYPE.cy + 20} C ${MYPE.cx + 50} ${MYPE.cy + 80}, ${LINKUY.cx - 40} ${LINKUY.cy - 60}, ${LINKUY.cx} ${LINKUY.cy - LINKUY.r}')` 
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            repeatDelay: 6.5,
            delay: 0.3,
            ease: "easeInOut" 
          }}
        />

        {/* Partícula azul: LINKUY → ESTUDIANTE (después del pulso) */}
        <motion.circle 
          r="5.5" 
          fill="#06B6D4" 
          filter="url(#glowBlue)"
          animate={{ 
            offsetDistance: ["0%", "100%"], 
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1.3, 0.8]
          }}
          style={{ 
            offsetPath: `path('M ${LINKUY.cx + LINKUY.r} ${LINKUY.cy} C ${LINKUY.cx + 40} ${LINKUY.cy - 60}, ${ESTUDIANTE.cx - 50} ${ESTUDIANTE.cy + 80}, ${ESTUDIANTE.cx - 30} ${ESTUDIANTE.cy + 20}')` 
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            repeatDelay: 6.5,
            delay: 3.2,
            ease: "easeInOut" 
          }}
        />

        {/* Partícula azul: ESTUDIANTE → LINKUY */}
        <motion.circle 
          r="5.5" 
          fill="#1B6FE8" 
          filter="url(#glowBlue)"
          animate={{ 
            offsetDistance: ["0%", "100%"], 
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1.3, 0.8]
          }}
          style={{ 
            offsetPath: `path('M ${ESTUDIANTE.cx - 30} ${ESTUDIANTE.cy - 20} C ${ESTUDIANTE.cx - 50} ${ESTUDIANTE.cy - 80}, ${LINKUY.cx + 40} ${LINKUY.cy + 60}, ${LINKUY.cx} ${LINKUY.cy + LINKUY.r}')` 
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            repeatDelay: 6.5,
            delay: 5.8,
            ease: "easeInOut" 
          }}
        />

        {/* Partícula naranja: LINKUY → MYPE */}
        <motion.circle 
          r="5.5" 
          fill="#F59E0B" 
          filter="url(#glowOrange)"
          animate={{ 
            offsetDistance: ["0%", "100%"], 
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1.3, 0.8]
          }}
          style={{ 
            offsetPath: `path('M ${LINKUY.cx - LINKUY.r} ${LINKUY.cy} C ${LINKUY.cx - 40} ${LINKUY.cy + 60}, ${MYPE.cx + 50} ${MYPE.cy - 80}, ${MYPE.cx + 30} ${MYPE.cy - 20}')` 
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            repeatDelay: 6.5,
            delay: 8.5,
            ease: "easeInOut" 
          }}
        />

        {/* ── Puntos ambientales ── */}
        {[[30,50], [370,60], [40,450], [360,440], [200,80], [200,440]].map(([x,y], i) => (
          <motion.circle
            key={i}
            cx={x} cy={y} r="2"
            fill="rgba(255,255,255,0.12)"
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 2.5 + i * 0.2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
          />
        ))}
      </svg>
    </div>
  );
}

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, icon: Icon, error, rightEl, children }) {
  return (
    <div>
      <label style={{
        display: "block", 
        fontSize: 12, 
        fontWeight: 500,
        color: "#4a4a5a", 
        textTransform: "none", 
        letterSpacing: "-0.01em",
        marginBottom: 8, 
        fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
      }}>
        {label}
      </label>
      <div style={{ position: "relative", width: "100%" }}>
        <div style={{
          position: "absolute", 
          left: 16, 
          top: 0, 
          bottom: 0,
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          pointerEvents: "none", 
          zIndex: 2
        }}>
          <Icon size={16} color={error && error.message ? "#EF4444" : "#9CA3AF"} />
        </div>
        
        {children}
        
        {rightEl && (
          <div style={{
            position: "absolute", 
            right: 8, 
            top: 0, 
            bottom: 0,
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            zIndex: 2
          }}>
            {rightEl}
          </div>
        )}
      </div>
      <AnimatePresence mode="wait">
        {error && error.message && error.message.trim() && (
          <motion.p
            key="err"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease }}
            style={{
              display: "flex", 
              alignItems: "center", 
              gap: 6,
              fontSize: 12, 
              color: "#EF4444", 
              marginTop: 6,
              fontWeight: 400, 
              fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
            }}
          >
            <AlertCircle size={12} /> {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [modalMantenimientoAbierto, setModalMantenimientoAbierto] = useState(false);
  const { login, isLoading, error: backendError, isMaintenance } = useLogin();
  const { register, handleSubmit, formState: { errors }, setError } = useForm({ mode: "onChange" });
  const [rememberMe, setRememberMe] = useState(false);

  // Cada vez que detectamos mantenimiento, abrimos (o reabrimos) el modal
  useEffect(() => {
    if (isMaintenance) setModalMantenimientoAbierto(true);
  }, [isMaintenance]);

  const onSubmit = (data) => {
  const email = stripXSS(data.email).trim();
  const password = stripXSS(data.password);
  
  if (!EMAIL_RE.test(email)) { setError("email", { message: "Formato de correo inválido" }); return; }
  login({ email, password, rememberMe });
};

  const inputStyle = (hasErr, hasRight = false) => ({
  width: "100%",
  height: 52, // aumentado de 48 a 52
  background: hasErr ? "#FFF5F5" : "#F9FAFB",
  border: `1.5px solid ${hasErr ? "#FCA5A5" : "#E5E7EB"}`,
  borderRadius: 12,
  outline: "none",
  paddingLeft: 56,
  paddingRight: hasRight ? 48 : 16,
  fontSize: 15,
  color: "#111827",
  fontFamily: "inherit",
  fontWeight: 500,
  transition: "border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
  boxSizing: "border-box",
  appearance: "none",
});

  return (
    <>
      <style>{`
        /* Importamos Outfit como fallback limpio */
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

        /* Definición de la fuente principal Angro Std */
        @font-face {
          font-family: 'Angro Std';
          src: local('Angro Std Light'), local('AngroStd-Light');
          font-weight: 300; font-style: normal; font-display: swap;
        }
        @font-face {
          font-family: 'Angro Std';
          src: local('Angro Std Regular'), local('AngroStd-Regular');
          font-weight: 400; font-style: normal; font-display: swap;
        }
        @font-face {
          font-family: 'Angro Std';
          src: local('Angro Std Bold'), local('AngroStd-Bold');
          font-weight: 700; font-style: normal; font-display: swap;
        }

        @keyframes gridScroll {
          from { transform: translateY(0); }
          to   { transform: translateY(48px); }
        }

        .lp-input:focus {
          border-color: #1B6FE8 !important;
          box-shadow: 0 0 0 3px rgba(27,111,232,0.08) !important;
          background: white !important;
        }
        .lp-input.err:focus {
            border-color: #F87171 !important;
            box-shadow: 0 0 0 3px rgba(248,113,113,0.08) !important;
          }
        .dot-bg {
          position: absolute; inset: -48px;
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0);
          background-size: 32px 32px;
          animation: gridScroll 10s linear infinite;
          pointer-events: none;
        }

        .btn-submit {
          width: 100%; height: 50px; border: none; cursor: pointer;
          font-family: 'Angro Std', 'Outfit', sans-serif; font-weight: 600;
          font-size: 15px; color: white;
          border-radius: 10px; display: flex; align-items: center;
          justify-content: center; gap: 8px;
          background: linear-gradient(135deg, #1B6FE8 0%, #0E54C4 100%);
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.4s ease;
        }
        .btn-submit:not(:disabled):hover {
          background: linear-gradient(135deg, #06B6D4 0%, #1B6FE8 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(27,111,232,0.35);
        }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

        .ghost-btn {
          height: 48px; border: 1.5px solid #E5E7EB; background: transparent;
          color: #4B5563; font-size: 14px; font-weight: 600;
          font-family: 'Angro Std', 'Outfit', sans-serif; cursor: pointer;
          border-radius: 10px; width: 100%;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease;
        }
        .ghost-btn:hover { border-color: #9CA3AF; color: #1B6FE8; background: #F9FAFB; transform: translateY(-1px); }

        .eye-btn {
          background: none; 
          border: none; 
          cursor: pointer; 
          padding: 6px;
          color: #9CA3AF; 
          display: flex; 
          align-items: center;
          transition: all 0.15s ease;
          border-radius: 4px;
        }
        .eye-btn:hover { 
            color: #1B6FE8; 
            background: rgba(27,111,232,0.05);
          }

        @media (max-width: 1023px) {
          .login-left { display: none !important; }
          .login-right { padding: 80px 24px 48px !important; }
          .mobile-logo { display: flex !important; }
        }
        @media (min-width: 1024px) {
          .mobile-logo { display: none !important; }
        }
        @media (max-width: 480px) {
          .login-right { padding: 72px 20px 40px !important; }
          .reg-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ minHeight: "100svh", display: "flex", fontFamily: "'Angro Std', 'Outfit', sans-serif", overflow: "hidden" }}>

        {/* ── LEFT panel ─────────────────────────────────────────────────── */}
        <div
          className="login-left"
          style={{
            width: "55%", // Cambiado de 46% a 60%
            flexShrink: 0,
            position: "relative", 
            overflow: "hidden",
            display: "flex", 
            flexDirection: "column",
            background: "linear-gradient(150deg, #081828 0%, #0F2A4A 55%, #0C3260 100%)",
          }}
        >
          {/* Mantén los glow orbs pero hazlos más grandes */}
          <div style={{ 
            position: "absolute", 
            top: -200, 
            right: -200, 
            width: 600, 
            height: 600, 
            borderRadius: "50%", 
            background: "radial-gradient(circle, #06B6D4, transparent 70%)", 
            opacity: 0.15, 
            filter: "blur(100px)", 
            pointerEvents: "none" 
          }} />
          <div style={{ 
            position: "absolute", 
            bottom: -150, 
            left: -100, 
            width: 400, 
            height: 400, 
            borderRadius: "50%", 
            background: "radial-gradient(circle, #1B6FE8, transparent)", 
            opacity: 0.12, 
            filter: "blur(80px)", 
            pointerEvents: "none" 
          }} />

          {/* Logo */}
          <div style={{ position: "relative", zIndex: 10, padding: "48px 56px 0" }}>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Logo imgClassName="h-12 w-auto transition-all hover:scale-105 duration-300" />
            </motion.div>
          </div>

          {/* Diagram */}
          <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column", padding: "30px 40px 50px" }}>
            <ConnectionDiagram />
          </div>
        </div>

        {/* ── RIGHT panel — form ──────────────────────────────────────────── */}
        <div
          className="login-right"
          style={{
            flex: 1, // Ocupa el 40% restante
            display: "flex", 
            flexDirection: "column",
            justifyContent: "center", 
            alignItems: "center",
            background: "#F8FAFC", 
            padding: "48px 40px",
            position: "relative", 
            overflow: "hidden",
          }}
        >
          {/* Subtle bg orb */}
          <div style={{ position: "absolute", top: 0, right: 0, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,#1B6FE8,transparent)", opacity: 0.04, filter: "blur(80px)", pointerEvents: "none" }} />

          {/* Mobile logo */}
          <div className="mobile-logo" style={{ position: "absolute", top: 24, left: 24, alignItems: "center", zIndex: 20 }}>
            <Logo theme="light" imgClassName="h-10 w-auto" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
            style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 10 }}
          >
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
              <h1 className="font-display" style={{
                fontSize: 32, fontWeight: 700,
                color: "#111827", letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.2,
              }}>
                Bienvenido de nuevo
              </h1>
              <p style={{ fontSize: 15, color: "#6B7280", fontWeight: 300, lineHeight: 1.6, margin: 0 }}>
                Ingresa tus credenciales para continuar
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Email */}
              <Field label="Correo electrónico" icon={Mail} error={errors.email}>
                <input
                  type="text" inputMode="email" autoComplete="email"
                  maxLength={MAX}
                  className={`lp-input${errors.email ? " err" : ""}`}
                  style={inputStyle(!!errors.email, false)}
                  {...register("email", {
                    required: "El correo es obligatorio",
                    maxLength: { value: MAX, message: `Máximo ${MAX} caracteres` },
                    validate: {
                      format: (v) => EMAIL_RE.test(stripXSS(v).trim()) || "Formato de correo inválido",
                      noScript: (v) => !/<|>|javascript:|on\w+=/.test(v) || "Caracteres no permitidos",
                    },
                    onChange: (e) => {
                      e.target.value = e.target.value
                        .replace(/<[^>]*>/g, "").replace(/javascript:/gi, "")
                        .replace(/on\w+\s*=/gi, "").replace(/[<>"'`]/g, "");
                    },
                  })}
                />
              </Field>

              {/* Password */}
              <Field
                label="Contraseña"
                icon={Lock}
                error={errors.password}
                rightEl={
                  <button type="button" className="eye-btn"
                    onClick={() => setShowPass(p => !p)}
                    tabIndex={-1}
                    aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              >
                <input
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  maxLength={MAX}
                  className={`lp-input${errors.password ? " err" : ""}`}
                  style={inputStyle(!!errors.password, true)}
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: { value: 6, message: "Mínimo 6 caracteres" },
                    maxLength: { value: MAX, message: `Máximo ${MAX} caracteres` },
                    validate: {
                      noScript: (v) => !/<script|javascript:|on\w+=/.test(v) || "Caracteres no permitidos",
                    },
                  })}
                />
              </Field>

              {/* Link de recuperación */}
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="mr-2" />
                  <span className="text-sm text-gray-600">Recordarme</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">¿Olvidaste tu contraseña?</Link>
              </div>

              {/* Backend error */}
              <AnimatePresence>
                {backendError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "12px 16px",
                      background: "#FFF5F5",
                      borderLeft: "4px solid #F87171",
                      borderRadius: "0 8px 8px 0",
                      fontSize: 14, color: "#EF4444", fontWeight: 500,
                    }}
                  >
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    {backendError}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button type="submit" disabled={isLoading} className="btn-submit" style={{ marginTop: 8 }}>
                {isLoading
                  ? <><Loader2 size={18} className="animate-spin" /> Verificando...</>
                  : <>Ingresar a mi cuenta <ArrowRight size={18} /></>
                }
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0" }}>
                <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
                <span style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 500 }}>¿Eres nuevo?</span>
                <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
              </div>

              {/* Register buttons */}
              <div className="reg-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Link to="/register/estudiante" style={{ display: "block", textDecoration: "none" }}>
                  <button type="button" className="ghost-btn">Soy estudiante</button>
                </Link>
                <Link to="/register/mype" style={{ display: "block", textDecoration: "none" }}>
                  <button type="button" className="ghost-btn">Soy empresa</button>
                </Link>
              </div>
            </form>

            {/* Back link */}
            <p style={{ marginTop: 32, textAlign: "center", fontSize: 14, color: "#9CA3AF", fontWeight: 400 }}>
              <Link to="/" style={{ color: "#6B7280", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#1B6FE8"}
                onMouseLeave={e => e.target.style.color = "#6B7280"}>
                ← Volver al inicio
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* ─── MODAL DE MANTENIMIENTO ─── */}
      <AnimatePresence>
        {modalMantenimientoAbierto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
              background: "rgba(13, 27, 53, 0.6)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setModalMantenimientoAbierto(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "36px 32px",
                maxWidth: 440,
                width: "100%",
                textAlign: "center",
                boxShadow: "0 25px 60px rgba(13, 27, 53, 0.3)",
                fontFamily: "'Angro Std', 'Outfit', sans-serif",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <ShieldAlert size={28} color="#d97706" />
              </div>

              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#0f1f3d",
                  margin: 0,
                  marginBottom: 8,
                }}
              >
                Plataforma en mantenimiento
              </h3>

              <p
                style={{
                  fontSize: 14,
                  color: "#64748b",
                  lineHeight: 1.6,
                  margin: 0,
                  marginBottom: 24,
                }}
              >
                Estamos trabajando para mejorar tu experiencia. Por el momento, el acceso está temporalmente deshabilitado.
                Te notificaremos cuando esté disponible nuevamente.
              </p>

              <button
                onClick={() => setModalMantenimientoAbierto(false)}
                style={{
                  background: "linear-gradient(135deg, #1B6FE8, #0E54C4)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 28px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Entendido
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}