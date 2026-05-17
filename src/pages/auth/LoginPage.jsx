import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
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
          <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B6FE8" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <radialGradient id="rg1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1B6FE8" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#0F2A4A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="rg2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#0F2A4A" stopOpacity="0" />
          </radialGradient>
          <path id="mainPath" d="M 100 120 C 100 220 260 200 260 300" />
        </defs>

        {/* ── Main connection lines ── */}
        <motion.path
          d="M 100 120 C 100 220 260 200 260 300"
          stroke="url(#lg1)" strokeWidth="1.5" strokeDasharray="7 5"
          strokeLinecap="round" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.65 }}
          transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
        />
        <motion.path
          d="M 100 120 C 180 120 180 300 260 300"
          stroke="rgba(6,182,212,0.2)" strokeWidth="1" strokeDasharray="4 8"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, delay: 0.6, ease: "easeInOut" }}
        />

        {/* ── MYPE node — (100, 120) ── */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.1, ease }}
          style={{ transformOrigin: "100px 120px" }}
        >
          <circle cx="100" cy="120" r="52" fill="url(#rg1)" />
          <motion.circle cx="100" cy="120" r="40"
            stroke="#1B6FE8" strokeWidth="1" fill="none" opacity="0.3"
            animate={{ r: [40, 48, 40] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle cx="100" cy="120" r="32" fill="#0F2A4A" stroke="#1B6FE8" strokeWidth="1.5" />
          <rect x="88" y="109" width="24" height="20" rx="1" fill="none" stroke="#1B6FE8" strokeWidth="1.5" />
          <rect x="93" y="114" width="5" height="5" rx="0.5" fill="#1B6FE8" opacity="0.7" />
          <rect x="102" y="114" width="5" height="5" rx="0.5" fill="#1B6FE8" opacity="0.7" />
          <rect x="97" y="119" width="6" height="10" rx="0.5" fill="#1B6FE8" opacity="0.9" />
          <text x="100" y="162" textAnchor="middle" fontSize="11" fontWeight="600"
            fill="rgba(255,255,255,0.55)" fontFamily="'Angro Std', 'Outfit', sans-serif" letterSpacing="0.5">
            MYPE
          </text>
        </motion.g>

        {/* ── ESTUDIANTE node — (260, 300) ── */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.3, ease }}
          style={{ transformOrigin: "260px 300px" }}
        >
          <circle cx="260" cy="300" r="52" fill="url(#rg2)" />
          <motion.circle cx="260" cy="300" r="40"
            stroke="#06B6D4" strokeWidth="1" fill="none" opacity="0.3"
            animate={{ r: [40, 48, 40] }}
            transition={{ duration: 3.2, delay: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle cx="260" cy="300" r="32" fill="#0F2A4A" stroke="#06B6D4" strokeWidth="1.5" />
          <ellipse cx="260" cy="292" rx="11" ry="3.5" fill="none" stroke="#06B6D4" strokeWidth="1.5" />
          <path d="M249 292 L249 304 C249 308.5 254 312 260 312 C266 312 271 308.5 271 304 L271 292"
            fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeLinejoin="round" />
          <line x1="271" y1="292" x2="275" y2="301" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" />
          <text x="260" y="342" textAnchor="middle" fontSize="11" fontWeight="600"
            fill="rgba(255,255,255,0.55)" fontFamily="'Angro Std', 'Outfit', sans-serif" letterSpacing="0.5">
            ESTUDIANTE
          </text>
        </motion.g>

        {/* ── Traveling dot ── */}
        <motion.circle r="4.5" fill="#06B6D4" opacity="0.95"
          filter="drop-shadow(0 0 5px rgba(6,182,212,0.9))"
          animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
          style={{ offsetPath: "path('M 100 120 C 100 220 260 200 260 300')" }}
          transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
        />     
      </svg>

      {/* ── Bottom stat strip ── */}
      
    </div>
  );
}

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, icon: Icon, error, rightEl, children }) {
  return (
    <div>
      <label style={{
        display: "block", fontSize: 11, fontWeight: 700,
        color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.07em",
        marginBottom: 8, fontFamily: "'Angro Std', 'Outfit', sans-serif",
      }}>
        {label}
      </label>
      <div style={{ position: "relative", width: "100%" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: 52, display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none", zIndex: 2
        }}>
          <Icon size={17} color={error ? "#F87171" : "#9CA3AF"} />
        </div>
        
        {children}
        
        {rightEl && (
          <div style={{
            position: "absolute", right: 0, top: 0, bottom: 0,
            width: 48, display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 2
          }}>
            {rightEl}
          </div>
        )}
      </div>
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="err"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, color: "#EF4444", marginTop: 6,
              fontWeight: 500, fontFamily: "'Angro Std', 'Outfit', sans-serif",
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
  const { login, isLoading, error: backendError } = useLogin();
  const { register, handleSubmit, formState: { errors }, setError } = useForm({ mode: "onChange" });

  const onSubmit = (data) => {
    const email = stripXSS(data.email).trim();
    const password = stripXSS(data.password);
    if (!EMAIL_RE.test(email)) { setError("email", { message: "Formato de correo inválido" }); return; }
    login({ email, password });
  };

  const inputStyle = (hasErr, hasRight) => ({
    width: "100%", height: 48,
    background: hasErr ? "#FFF5F5" : "#F9FAFB",
    border: `1.5px solid ${hasErr ? "#FCA5A5" : "#E5E7EB"}`,
    borderRadius: 10, outline: "none", 
    paddingLeft: 56, /* <--- Aumentado a 56px para despegar el texto del icono */
    paddingRight: hasRight ? 48 : 16,
    fontSize: 14, color: "#111827",
    fontFamily: "'Angro Std', 'Outfit', sans-serif", fontWeight: 400,
    transition: "border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
    boxSizing: "border-box",
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
          box-shadow: 0 0 0 3px rgba(27,111,232,0.12) !important;
          background: white !important;
        }
        .lp-input.err:focus {
          border-color: #F87171 !important;
          box-shadow: 0 0 0 3px rgba(248,113,113,0.1) !important;
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
          background: none; border: none; cursor: pointer; padding: 4px;
          color: #9CA3AF; display: flex; align-items: center;
          transition: color 0.15s ease;
        }
        .eye-btn:hover { color: #1B6FE8; }

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
            width: "46%", flexShrink: 0,
            position: "relative", overflow: "hidden",
            display: "flex", flexDirection: "column",
            background: "linear-gradient(150deg,#081828 0%,#0F2A4A 55%,#0C3260 100%)",
          }}
        >
          <div className="dot-bg" />
          {/* Glow orbs */}
          <div style={{ position: "absolute", top: -160, right: -160, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,#06B6D4,transparent 70%)", opacity: 0.18, filter: "blur(80px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -100, left: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,#1B6FE8,transparent)", opacity: 0.1, filter: "blur(60px)", pointerEvents: "none" }} />

          {/* Logo */}
          <div style={{ position: "relative", zIndex: 10, padding: "40px 48px 0" }}>
            <Logo />
          </div>

          {/* Diagram */}
          <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column", padding: "20px 32px 40px" }}>
            <ConnectionDiagram />
          </div>
        </div>

        {/* ── RIGHT panel — form ──────────────────────────────────────────── */}
        <div
          className="login-right"
          style={{
            flex: 1, display: "flex", flexDirection: "column",
            justifyContent: "center", alignItems: "center",
            background: "#F8FAFC", padding: "48px 32px",
            position: "relative", overflow: "hidden",
          }}
        >
          {/* Subtle bg orb */}
          <div style={{ position: "absolute", top: 0, right: 0, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,#1B6FE8,transparent)", opacity: 0.04, filter: "blur(80px)", pointerEvents: "none" }} />

          {/* Mobile logo */}
          <div className="mobile-logo" style={{ position: "absolute", top: 24, left: 24, alignItems: "center" }}>
            <Logo />
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
    </>
  );
}