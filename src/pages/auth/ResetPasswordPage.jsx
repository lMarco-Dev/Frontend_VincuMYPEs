import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { Logo } from "@shared/ui/Logo";
import { authRecoveryApi } from "@features/auth-recovery/authRecovery.api";

const ease = [0.22, 1, 0.36, 1];
const PASS_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_#])[A-Za-z\d@$!%*?&\-_#]{8,}$/;

const inputStyle = (hasErr, hasRight = false) => ({
  width: "100%", height: 48,
  background: hasErr ? "#FFF5F5" : "#FFFFFF",
  border: `1.5px solid ${hasErr ? "#FCA5A5" : "#E5E7EB"}`,
  borderRadius: 8, outline: "none",
  paddingLeft: 48,
  paddingRight: hasRight ? 48 : 16,
  fontSize: 14, color: "#0F1F3D",
  fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif", fontWeight: 400,
  transition: "all 0.2s ease",
  boxSizing: "border-box",
});

function PasswordStrength({ value = "" }) {
  const checks = [
    { label: "8 caracteres", ok: value.length >= 8 },
    { label: "Mayúscula", ok: /[A-Z]/.test(value) },
    { label: "Minúscula", ok: /[a-z]/.test(value) },
    { label: "Número", ok: /\d/.test(value) },
    { label: "Símbolo (@$!...)", ok: /[@$!%*?&\-_#]/.test(value) },
  ];

  if (!value) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease }}
      style={{ marginTop: 10 }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px" }}>
        {checks.map(c => (
          <span key={c.label} style={{
            fontSize: 11, display: "flex", alignItems: "center", gap: 4,
            color: c.ok ? "#22C55E" : "#9CA3AF",
            fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
            fontWeight: c.ok ? 500 : 400,
            transition: "color 0.3s ease",
          }}>
            <CheckCircle2 size={11} style={{ opacity: c.ok ? 1 : 0.4, transition: "opacity 0.3s ease" }} />
            {c.label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function ResetPasswordPage() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state?.token || "";

  const { register, handleSubmit, watch, formState: { errors }, setError } = useForm({
    mode: "onChange",
    defaultValues: { password: "", confirmPassword: "" }
  });

  const passValue = watch("password", "");

  const onSubmit = async (data) => {
    if (!token) {
      setError("password", { message: "Token inválido. Solicita un nuevo código." });
      return;
    }

    setIsLoading(true);
    try {
      await authRecoveryApi.resetPassword(token, data.password);
      setSuccess(true);
      
      // Auto-login: redirige al dashboard correspondiente
      setTimeout(() => {
        navigate("/login", { 
          replace: true, 
          state: { message: "Contraseña actualizada. Inicia sesión con tu nueva contraseña." }
        });
      }, 2500);
    } catch (err) {
      setError("password", { message: err.response?.data?.error || "Error al cambiar la contraseña" });
    } finally {
      setIsLoading(false);
    }
  };

  const eye = (show, setShow) => (
    <button type="button"
      onClick={() => setShow(p => !p)}
      tabIndex={-1}
      aria-label={show ? "Ocultar" : "Mostrar"}
      style={{
        background: "none", border: "none", cursor: "pointer", padding: 6,
        color: "#9CA3AF", display: "flex", alignItems: "center",
        transition: "all 0.15s ease", borderRadius: 4
      }}
      onMouseEnter={e => { e.currentTarget.style.color = "#1B6FE8"; e.currentTarget.style.background = "rgba(27,111,232,0.05)"; }}
      onMouseLeave={e => { e.currentTarget.style.color = "#9CA3AF"; e.currentTarget.style.background = "none"; }}
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );

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
                <ShieldCheck size={36} color="#67d4f8" />
              </div>
              <h2 style={{ color: "white", fontSize: 24, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.02em" }}>
                Nueva contraseña
              </h2>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 400, lineHeight: 1.6, maxWidth: 280, margin: "0 auto", textAlign: "center" }}>
                Crea una contraseña segura para proteger tu cuenta
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
            {!success ? (
              <>
                <div style={{ marginBottom: 32 }}>
                  <h1 style={{ fontSize: 32, fontWeight: 700, color: "#0F1F3D", letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.2 }}>
                    Nueva contraseña
                  </h1>
                  <p style={{ fontSize: 14, color: "#6B7280", fontWeight: 400, lineHeight: 1.5, margin: 0 }}>
                    Debe tener al menos 8 caracteres con mayúsculas, números y símbolos
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Password */}
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#4a4a5a", marginBottom: 8, fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" }}>
                      Contraseña
                    </label>
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: 16, top: 0, bottom: 0, display: "flex", alignItems: "center", pointerEvents: "none", zIndex: 2 }}>
                        <Lock size={16} color={errors.password ? "#F87171" : "#9CA3AF"} />
                      </div>
                      <input
                        type={showPass ? "text" : "password"}
                        autoComplete="new-password"
                        className={`lp-input${errors.password ? " err" : ""}`}
                        style={inputStyle(!!errors.password, true)}
                        placeholder="Nueva contraseña"
                        {...register("password", {
                          required: "La contraseña es obligatoria",
                          minLength: { value: 8, message: "" },
                          validate: {
                            strong: (v) => PASS_RE.test(v) || "",
                          },
                        })}
                      />
                      <div style={{ position: "absolute", right: 8, top: 0, bottom: 0, display: "flex", alignItems: "center", zIndex: 2 }}>
                        {eye(showPass, setShowPass)}
                      </div>
                    </div>
                    <PasswordStrength value={passValue} />
                    {errors.password && errors.password.message && (
                      <p style={{ fontSize: 12, color: "#EF4444", marginTop: 6 }}>{errors.password.message}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#4a4a5a", marginBottom: 8, fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" }}>
                      Confirmar contraseña
                    </label>
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: 16, top: 0, bottom: 0, display: "flex", alignItems: "center", pointerEvents: "none", zIndex: 2 }}>
                        <Lock size={16} color={errors.confirmPassword ? "#F87171" : "#9CA3AF"} />
                      </div>
                      <input
                        type={showConfirm ? "text" : "password"}
                        autoComplete="new-password"
                        className={`lp-input${errors.confirmPassword ? " err" : ""}`}
                        style={inputStyle(!!errors.confirmPassword, true)}
                        placeholder="Confirma tu contraseña"
                        {...register("confirmPassword", {
                          required: "Confirma tu contraseña",
                          validate: (v) => v === passValue || "Las contraseñas no coinciden",
                        })}
                      />
                      <div style={{ position: "absolute", right: 8, top: 0, bottom: 0, display: "flex", alignItems: "center", zIndex: 2 }}>
                        {eye(showConfirm, setShowConfirm)}
                      </div>
                    </div>
                    {errors.confirmPassword && (
                      <p style={{ fontSize: 12, color: "#EF4444", marginTop: 6 }}>{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <button type="submit" disabled={isLoading} style={{
                    width: "100%", height: 50, border: "none", cursor: isLoading ? "not-allowed" : "pointer",
                    fontFamily: "Arial, sans-serif", fontWeight: 600, fontSize: 15, color: "white",
                    borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: isLoading ? "#D1D5DB" : "linear-gradient(135deg, #1B6FE8 0%, #0E54C4 100%)",
                    transition: "all 0.2s ease", marginTop: 8, opacity: isLoading ? 0.7 : 1
                  }}>
                    {isLoading ? <><Loader2 size={18} className="animate-spin" /> Cambiando...</> : <>Cambiar contraseña <ArrowRight size={18} /></>}
                  </button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
              >
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#F0FDF4", border: "2px solid #86EFAC", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                  <CheckCircle2 size={36} color="#22C55E" />
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0F1F3D", letterSpacing: "-0.02em", marginBottom: 12, textAlign: "center" }}>
                  ¡Contraseña actualizada!
                </h1>
                <p style={{ fontSize: 14, color: "#6B7280", fontWeight: 400, lineHeight: 1.6, marginBottom: 24, textAlign: "center" }}>
                  Serás redirigido al inicio de sesión...
                </p>
              </motion.div>
            )}

            {!success && (
              <p style={{ marginTop: 32, textAlign: "center", fontSize: 14, color: "#9CA3AF", fontWeight: 400 }}>
                <Link to="/login" style={{ color: "#1B6FE8", textDecoration: "none", fontWeight: 600 }}>
                  Volver al inicio de sesión
                </Link>
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}