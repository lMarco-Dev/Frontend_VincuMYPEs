// src/pages/auth/RegisterPage.jsx
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { RegisterForm } from "@features/auth-register/RegisterForm";
import { Logo } from "@shared/ui/Logo";
import { GraduationCap, Building2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TerminosCondicionesModal } from "./TerminosCondicionesModal";

const ease = [0.22, 1, 0.36, 1];

// ── Diagrama de Registro (SVG Animado en Bucle) ──────────────────────────
function RegisterDiagram() {
  return (
    <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <svg
        viewBox="0 0 360 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", maxWidth: 320, overflow: "visible" }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="lg_reg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B6FE8" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <radialGradient id="rg_user" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1B6FE8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0F2A4A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="rg_work" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0F2A4A" stopOpacity="0" />
          </radialGradient>
        </defs>

        <motion.path
          d="M 100 210 C 150 210, 210 210, 260 210"
          stroke="url(#lg_reg)" strokeWidth="1.5" strokeDasharray="6 6"
          strokeLinecap="round" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
        />

        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          style={{ transformOrigin: "100px 210px" }}
        >
          <circle cx="100" cy="210" r="50" fill="url(#rg_user)" />
          <motion.circle cx="100" cy="210" r="38"
            stroke="#1B6FE8" strokeWidth="1" fill="none" opacity="0.3"
            animate={{ r: [38, 45, 38] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle cx="100" cy="210" r="30" fill="#0F2A4A" stroke="#1B6FE8" strokeWidth="1.5" />
          <circle cx="100" cy="205" r="7" stroke="#1B6FE8" strokeWidth="1.5" fill="none"/>
          <path d="M 88 223 C 88 215, 112 215, 112 223" stroke="#1B6FE8" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </motion.g>

        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
          style={{ transformOrigin: "260px 210px" }}
        >
          <circle cx="260" cy="210" r="50" fill="url(#rg_work)" />
          <motion.circle cx="260" cy="210" r="38"
            stroke="#06B6D4" strokeWidth="1" fill="none" opacity="0.3"
            animate={{ r: [38, 45, 38] }}
            transition={{ duration: 3, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle cx="260" cy="210" r="30" fill="#0F2A4A" stroke="#06B6D4" strokeWidth="1.5" />
          <rect x="248" y="202" width="24" height="17" rx="2" stroke="#06B6D4" strokeWidth="1.5" fill="none"/>
          <path d="M 255 202 V 197 C 255 195, 265 195, 265 197 V 202" stroke="#06B6D4" strokeWidth="1.5" fill="none"/>
        </motion.g>

        <motion.circle r="4.5" fill="#67E8F9" opacity="0.9"
          filter="drop-shadow(0 0 5px #06B6D4)"
          animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
          style={{ offsetPath: "path('M 100 210 C 150 210, 210 210, 260 210')" }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" }}
        />     
      </svg>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1, duration: 0.8 }}
        style={{ color: "white", fontSize: 13, fontWeight: 300, textAlign: "center", marginTop: -20, maxWidth: 220, lineHeight: 1.5, fontFamily: "'Outfit', sans-serif" }}
      >
        Regístrate y conéctate con las mejores oportunidades de Cajamarca.
      </motion.p>
    </div>
  );
}

// ── Main Register Page ────────────────────────────────────────────────────────
export function RegisterPage() {
  const { tipo } = useParams();
  const navigate = useNavigate();
  const currentTipo = tipo === "mype" ? "mype" : "estudiante";
  const esEstudiante = currentTipo === "estudiante";

  // Estados para controlar los cambios y el Modal
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [targetTipo, setTargetTipo] = useState(null);

  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

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
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

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

        .tab-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
          height: 40px; font-size: 13px; font-weight: 600;
          font-family: 'Angro Std', 'Outfit', sans-serif; border: none; cursor: pointer;
          border-radius: 8px; transition: all 0.3s ease; color: #6B7280;
          background: transparent;
        }
        .tab-active {
          background: #EFF6FF !important;
          color: #1B6FE8 !important;
          border: 1px solid #BFDBFE !important;
        }

        /* Botón fantasma para el Modal */
        .modal-ghost-btn {
          height: 44px; border: 1px solid #E5E7EB; background: white;
          color: #4B5563; font-size: 14px; font-weight: 600;
          font-family: 'Angro Std', 'Outfit', sans-serif; cursor: pointer;
          border-radius: 10px; width: 100%; transition: all 0.2s ease;
        }
        .modal-ghost-btn:hover { background: #F3F4F6; }

        @media (max-width: 1023px) {
          .login-left { display: none !important; }
          .mobile-logo { display: flex !important; }
        }
        @media (min-width: 1024px) {
          .mobile-logo { display: none !important; }
        }
        @media (max-width: 480px) {
          .login-right { padding: 72px 20px 40px !important; }
        }
      `}</style>

      {/* ── Modal de Confirmación ── */}
      <AnimatePresence>
        {targetTipo && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15, 42, 74, 0.5)", backdropFilter: "blur(4px)" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              style={{ background: "white", padding: 32, borderRadius: 16, width: "90%", maxWidth: 400, boxShadow: "0 20px 40px rgba(0,0,0,0.15)", fontFamily: "'Angro Std', 'Outfit', sans-serif" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444" }}>
                  <AlertCircle size={22} />
                </div>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>
                  ¿Cambiar de registro?
                </h3>
              </div>
              <p style={{ margin: "0 0 24px", color: "#6B7280", fontSize: 14, lineHeight: 1.6, fontWeight: 300 }}>
                Si cambias a <strong>{targetTipo === "mype" ? "MYPE" : "Estudiante"}</strong> ahora, perderás los datos que ya has ingresado en este formulario. ¿Estás seguro de continuar?
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setTargetTipo(null)} className="modal-ghost-btn" style={{ flex: 1 }}>
                  Cancelar
                </button>
                <button onClick={confirmToggle} style={{ flex: 1, height: 44, borderRadius: 10, border: "none", color: "white", background: "#EF4444", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                  Sí, cambiar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div style={{ minHeight: "100svh", display: "flex", fontFamily: "'Angro Std', 'Outfit', sans-serif", overflow: "hidden" }}>

        {/* ── LEFT panel (Diagrama de Registro Animado) ───────────────────────── */}
        <div
          className="login-left"
          style={{
            width: "46%", flexShrink: 0,
            position: "relative", overflow: "hidden",
            display: "flex", flexDirection: "column",
            background: "linear-gradient(150deg, #081828 0%, #0F2A4A 55%, #0C3260 100%)",
          }}
        >
          <div className="dot-bg" />
          <div style={{ position: "absolute", top: -160, right: -160, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,#06B6D4,transparent 70%)", opacity: 0.15, filter: "blur(80px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -100, left: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,#1B6FE8,transparent)", opacity: 0.08, filter: "blur(60px)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 10, padding: "40px 48px 0" }}>
            <Logo />
          </div>

          <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column", padding: "20px 32px 40px" }}>
            <RegisterDiagram />
          </div>
        </div>

        {/* ── RIGHT panel (Formulario) ────────────────────────────────────────── */}
        <div
          className="login-right"
          style={{
            flex: 1, display: "flex", flexDirection: "column",
            background: "#F8FAFC", padding: "48px 32px",
            position: "relative", overflow: "hidden",
            overflowY: "auto"
          }}
        >
          <div style={{ position: "absolute", top: 0, right: 0, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,#1B6FE8,transparent)", opacity: 0.03, filter: "blur(80px)", pointerEvents: "none" }} />

          <div className="mobile-logo" style={{ position: "absolute", top: 24, left: 24, alignItems: "center" }}>
            <Logo />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
            style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 10, margin: "auto" }}
          >
            <div style={{ marginBottom: 30 }}>
              <h1 style={{
                fontSize: 32, fontWeight: 700, fontFamily: "inherit",
                color: "#111827", letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.2,
              }}>
                Crea tu cuenta
              </h1>
            </div>

            <div style={{
              display: "flex", padding: 4, marginBottom: 24, gap: 4,
              background: "#F3F4F6", border: "1px solid #E5E7EB", borderRadius: "10px"
            }}>
              <button type="button" onClick={() => handleToggle("estudiante")} className={`tab-btn ${esEstudiante ? "tab-active" : ""}`}>
                <GraduationCap size={16} /> Soy Estudiante
              </button>
              <button type="button" onClick={() => handleToggle("mype")} className={`tab-btn ${!esEstudiante ? "tab-active" : ""}`}>
                <Building2 size={16} /> Soy Empresa
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={currentTipo}
                initial={{ opacity: 0, x: esEstudiante ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: esEstudiante ? 10 : -10 }}
                transition={{ duration: 0.3, ease }}
              >
                <RegisterForm 
                  tipo={currentTipo} 
                  onDirtyChange={setIsFormDirty}
                  // ✨ NUEVAS PROPS:
                  hasAcceptedTerms={hasAcceptedTerms}
                  onOpenTerms={() => setIsTermsModalOpen(true)}
                />
              </motion.div>
            </AnimatePresence>

            <p style={{ marginTop: 30, textAlign: "center", fontSize: 14, color: "#9CA3AF", fontWeight: 400 }}>
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
      <TerminosCondicionesModal 
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={() => setHasAcceptedTerms(true)}
      />
    </>
  );
}