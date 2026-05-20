import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { KeyRound, ArrowRight, ArrowLeft, Loader2, RefreshCw, Clock } from "lucide-react";
import { Logo } from "@shared/ui/Logo";
import { authRecoveryApi } from "@features/auth-recovery/authRecovery.api";

const ease = [0.22, 1, 0.36, 1];
const RESEND_COOLDOWN = 120; // 2 minutos en segundos

export function VerifyOtpPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef([]);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) navigate("/forgot-password", { replace: true });
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [email, navigate]);

  // Iniciar cooldown automático al montar (ya se envió un código)
  useEffect(() => {
    setCooldown(RESEND_COOLDOWN);
    timerRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    paste.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    const lastIndex = Math.min(paste.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Ingresa el código completo de 6 dígitos");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await authRecoveryApi.verifyOtp(email, code);
      navigate("/reset-password", { state: { token: response.data.token } });
    } catch (err) {
      const msg = err.response?.data?.error || "";
      if (msg.toLowerCase().includes("expirado")) {
        setError("El código ha expirado. Solicita uno nuevo.");
      } else if (msg.toLowerCase().includes("inválido")) {
        setError("Código incorrecto. Verifica e intenta de nuevo.");
      } else {
        setError(msg || "Error al verificar el código");
      }
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    
    setResending(true);
    setError("");
    try {
      await authRecoveryApi.forgotPassword(email);
      setCooldown(RESEND_COOLDOWN);
      timerRef.current = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError("Error al reenviar el código");
    } finally {
      setResending(false);
    }
  };

  const formatCooldown = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <style>{`
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

        .otp-input {
          width: 48px; height: 56px;
          text-align: center; font-size: 22px; font-weight: 700;
          border: 1.5px solid #E5E7EB; border-radius: 8px;
          background: white; color: #0F1F3D;
          font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
          outline: none; transition: all 0.2s ease;
        }
        .otp-input:focus {
          border-color: #1B6FE8 !important;
          box-shadow: 0 0 0 3px rgba(27,111,232,0.1) !important;
        }
        .otp-input.error {
          border-color: #F87171 !important;
          background: #FFF5F5 !important;
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
            <Logo />
        </div>

        <div style={{ 
            position: "relative", 
            zIndex: 10, 
            flex: 1, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            padding: "40px 40px 40px 120px"
        }}>
            <div style={{ textAlign: "center" }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease }}
            >
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(6,182,212,0.1)", border: "2px solid rgba(6,182,212,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24" }}>
                <KeyRound size={36} color="#67d4f8" />
                </div>
                <h2 style={{ color: "white", fontSize: 24, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.02em" }}>
                Verifica tu identidad
                </h2>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 400, lineHeight: 1.6, maxWidth: 280 }}>
                Ingresa el código de 6 dígitos que enviamos a tu correo
                </p>
            </motion.div>
            </div>
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

          <div className="mobile-logo" style={{ position: "absolute", top: 24, left: 24, alignItems: "center" }}>
            <Logo />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
            style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 10 }}
          >
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 32, fontWeight: 700, color: "#0F1F3D", letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.2 }}>
                Código de verificación
              </h1>
              <p style={{ fontSize: 14, color: "#6B7280", fontWeight: 400, lineHeight: 1.5, margin: 0 }}>
                Enviamos un código a <strong style={{ color: "#0F1F3D" }}>{email}</strong>
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }} onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={el => inputRefs.current[index] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`otp-input${error ? " error" : ""}`}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: "center", fontSize: 13, color: "#EF4444", marginTop: 12, fontWeight: 400 }}>
                    {error}
                  </motion.p>
                )}
              </div>

              <button type="submit" disabled={isLoading || otp.some(d => !d)} style={{
                width: "100%", height: 50, border: "none", cursor: (isLoading || otp.some(d => !d)) ? "not-allowed" : "pointer",
                fontFamily: "Arial, sans-serif", fontWeight: 600, fontSize: 15, color: "white",
                borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: (isLoading || otp.some(d => !d)) ? "#D1D5DB" : "linear-gradient(135deg, #1B6FE8 0%, #0E54C4 100%)",
                transition: "all 0.2s ease", opacity: (isLoading || otp.some(d => !d)) ? 0.7 : 1
              }}>
                {isLoading ? <><Loader2 size={18} className="animate-spin" /> Verificando...</> : <>Verificar código <ArrowRight size={18} /></>}
              </button>

              <button 
                type="button" 
                onClick={handleResend} 
                disabled={resending || cooldown > 0} 
                style={{
                  background: "none", border: "none", 
                  cursor: (resending || cooldown > 0) ? "not-allowed" : "pointer",
                  color: cooldown > 0 ? "#9CA3AF" : "#1B6FE8", 
                  fontSize: 13, fontWeight: 500, 
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  fontFamily: "Arial, sans-serif", 
                  opacity: (resending || cooldown > 0) ? 0.6 : 1, 
                  transition: "all 0.2s"
                }}
              >
                {resending ? (
                  <><Loader2 size={14} className="animate-spin" /> Reenviando...</>
                ) : cooldown > 0 ? (
                  <><Clock size={14} /> Reenviar en {formatCooldown(cooldown)}</>
                ) : (
                  <><RefreshCw size={14} /> Reenviar código</>
                )}
              </button>
            </form>

            <p style={{ marginTop: 32, textAlign: "center", fontSize: 14, color: "#9CA3AF", fontWeight: 400 }}>
              <Link to="/forgot-password" style={{ color: "#1B6FE8", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                <ArrowLeft size={14} /> Cambiar correo
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}