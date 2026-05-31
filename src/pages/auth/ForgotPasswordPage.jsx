import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Mail, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Logo } from "@shared/ui/Logo";
import { authRecoveryApi } from "@features/auth-recovery/authRecovery.api";

const ease = [0.22, 1, 0.36, 1];

const inputStyle = (hasErr) => ({
  width: "100%", height: 48,
  background: hasErr ? "#FFF5F5" : "#FFFFFF",
  border: `1.5px solid ${hasErr ? "#FCA5A5" : "#E5E7EB"}`,
  borderRadius: 8, outline: "none",
  paddingLeft: 48, paddingRight: 16,
  fontSize: 14, color: "#0F1F3D",
  fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif", fontWeight: 400,
  transition: "all 0.2s ease",
  boxSizing: "border-box",
});

export function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setError, watch } = useForm();
  const emailValue = watch("email", "");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authRecoveryApi.forgotPassword(data.email);
      navigate("/verify-otp", { state: { email: data.email } });
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Error al enviar el código.";
      setError("email", { message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .lp-input:focus {
          border-color: #1B6FE8 !important;
          box-shadow: 0 0 0 3px rgba(27,111,232,0.08) !important;
        }
        .lp-input.err:focus {
          border-color: #F87171 !important;
          box-shadow: 0 0 0 3px rgba(248,113,113,0.08) !important;
        }

        @keyframes gridScroll {
          from { transform: translateY(0); }
          to { transform: translateY(48px); }
        }

        .dot-bg {
          position: absolute; inset: -48px;
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0);
          background-size: 32px 32px;
          animation: gridScroll 10s linear infinite;
          pointer-events: none;
        }

        @media (max-width: 1023px) {
          .login-left { display: none !important; }
          .login-right { padding: 80px 24px 48px !important; }
          .mobile-logo { display: flex !important; }
        }
        @media (min-width: 1024px) {
          .mobile-logo { display: none !important; }
        }
      `}</style>

      <div style={{ minHeight: "100svh", display: "flex", fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif", overflow: "hidden" }}>

        {/* ── LEFT panel ─────────────────────────────────────────────────── */}
        <div className="login-left" style={{
          width: "55%", flexShrink: 0,
          position: "relative", overflow: "hidden",
          display: "flex", flexDirection: "column",
          background: "linear-gradient(150deg, #081828 0%, #0F2A4A 55%, #0C3260 100%)",
        }}>
          <div className="dot-bg" />
          <div style={{ position: "absolute", top: -160, right: -160, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,#06B6D4,transparent 70%)", opacity: 0.15, filter: "blur(80px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -100, left: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,#1B6FE8,transparent)", opacity: 0.08, filter: "blur(60px)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 10, padding: "48px 56px 0" }}>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Logo imgClassName="h-12 w-auto transition-all hover:scale-105 duration-300" />
            </motion.div>
          </div>

          <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "30px 40px 50px" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
            >
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(27,111,232,0.1)", border: "2px solid rgba(27,111,232,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24" }}>
                <Mail size={36} color="#67d4f8" />
              </div>
              <h2 style={{ color: "white", fontSize: 24, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.02em" }}>
                Recupera tu acceso
              </h2>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 400, lineHeight: 1.6, maxWidth: 280, margin: "0 auto", textAlign: "center" }}>
                Te enviaremos un código de verificación a tu correo electrónico
              </p>
            </motion.div>
          </div>
        </div>

        {/* ── RIGHT panel ────────────────────────────────────────────────── */}
        <div className="login-right" style={{
          flex: 1, display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center",
          background: "#F8FAFC", padding: "48px 40px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,#1B6FE8,transparent)", opacity: 0.04, filter: "blur(80px)", pointerEvents: "none" }} />

          <div className="mobile-logo" style={{ position: "absolute", top: 24, left: 24, alignItems: "center", zIndex: 20 }}>
            <Logo theme="light" imgClassName="h-10 w-auto" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
            style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 10 }}
          >
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 32, fontWeight: 700, color: "#0F1F3D", letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.2 }}>
                Olvidé mi contraseña
              </h1>
              <p style={{ fontSize: 14, color: "#6B7280", fontWeight: 400, lineHeight: 1.5, margin: 0 }}>
                Ingresa tu correo y te enviaremos un código
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#4a4a5a", marginBottom: 8, fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" }}>
                  Correo electrónico
                </label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: 16, top: 0, bottom: 0, display: "flex", alignItems: "center", pointerEvents: "none", zIndex: 2 }}>
                    <Mail size={16} color={errors.email ? "#F87171" : "#9CA3AF"} />
                  </div>
                  <input
                    type="text" inputMode="email" autoComplete="email"
                    className={`lp-input${errors.email ? " err" : ""}`}
                    style={inputStyle(!!errors.email)}
                    placeholder="tu@correo.com"
                    {...register("email", {
                      required: "El correo es obligatorio",
                      pattern: { value: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/, message: "Formato inválido" }
                    })}
                  />
                </div>
                {errors.email && (
                  <p style={{ fontSize: 12, color: "#EF4444", marginTop: 6, fontWeight: 400 }}>{errors.email.message}</p>
                )}
              </div>

              <button type="submit" disabled={isLoading || !emailValue} style={{
                width: "100%", height: 50, border: "none", cursor: isLoading ? "not-allowed" : "pointer",
                fontFamily: "Arial, sans-serif", fontWeight: 600, fontSize: 15, color: "white",
                borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: isLoading ? "#D1D5DB" : "linear-gradient(135deg, #1B6FE8 0%, #0E54C4 100%)",
                transition: "all 0.2s ease", marginTop: 8, opacity: isLoading ? 0.7 : 1
              }}>
                {isLoading ? <><Loader2 size={18} className="animate-spin" /> Enviando...</> : <>Enviar código <ArrowRight size={18} /></>}
              </button>
            </form>

            <p style={{ marginTop: 32, textAlign: "center", fontSize: 14, color: "#9CA3AF", fontWeight: 400 }}>
              <Link to="/login" style={{ color: "#1B6FE8", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                <ArrowLeft size={14} /> Volver al inicio de sesión
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}