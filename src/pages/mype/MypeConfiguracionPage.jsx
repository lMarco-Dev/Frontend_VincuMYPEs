import { useState } from "react";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import { useAuthStore } from "@/store/authStore";
import { useUsuarioMe } from "@/features/configuracion/useConfiguracion";
import {
  useCambiarPassword,
  useCambiarEmail,
  useDesactivarCuenta,
} from "@/features/configuracion/useConfiguracion";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const FONT = "'Angro Std', 'Outfit', sans-serif";

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 8,
  fontFamily: FONT,
  fontSize: 15,
  border: "1px solid #E5E7EB",
  outline: "none",
  background: "#FFFFFF",
  color: "#1F2937",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

const labelStyle = {
  fontFamily: FONT,
  fontSize: 13,
  fontWeight: 500,
  color: "#6B7280",
  display: "block",
  marginBottom: 6,
  letterSpacing: "0.02em",
};

// ── Input de contraseña ───────────────────────────────────────
function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ ...inputStyle, paddingRight: 44 }}
        onFocus={(e) => (e.target.style.borderColor = "#9CA3AF")}
        onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        style={{
          position: "absolute",
          right: 14,
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#D1D5DB",
          padding: 4,
        }}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

// ── Mensaje feedback ──────────────────────────────────────────
function FeedbackMsg({ success, error }) {
  if (!success && !error) return null;
  return (
    <div
      style={{
        padding: "10px 14px",
        borderRadius: 8,
        background: success ? "#F9FAFB" : "#FEF2F2",
        fontFamily: FONT,
        fontSize: 13,
        color: success ? "#374151" : "#DC2626",
      }}
    >
      {success ? "Cambios guardados" : error}
    </div>
  );
}

// ── Botones reutilizables ─────────────────────────────────────
const buttonPrimary = {
  fontFamily: FONT,
  padding: "12px 22px",
  borderRadius: 8,
  background: "#1F2937",
  color: "#FFFFFF",
  border: "none",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  transition: "opacity 0.15s",
};

const buttonSecondary = {
  fontFamily: FONT,
  padding: "12px 22px",
  borderRadius: 8,
  background: "#FFFFFF",
  color: "#6B7280",
  border: "1px solid #E5E7EB",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.15s",
};

// ── Página principal ──────────────────────────────────────────
export function MypeConfiguracionPage() {
  const { usuario: user, isLoading: loadingUser } = useUsuarioMe();

  // Estado compartido: solo una sección abierta a la vez
  const [seccionAbierta, setSeccionAbierta] = useState(null); // "email" | "password" | "desactivar" | null

  // Email
  const { ejecutar: cambiarEmail, isLoading: loadingEmail, isSuccess: successEmail, error: errorEmail, reset: resetEmail } = useCambiarEmail();
  const [formEmail, setFormEmail] = useState({ emailNuevo: "", passwordActual: "" });

  // Password
  const { ejecutar: cambiarPassword, isLoading: loadingPass, isSuccess: successPass, error: errorPass, reset: resetPass } = useCambiarPassword();
  const [formPass, setFormPass] = useState({ passwordActual: "", passwordNueva: "", passwordRepetir: "" });

  // Desactivar
  const [passwordDesactivar, setPasswordDesactivar] = useState("");
  const { logout } = useAuthStore();
  const { ejecutar: desactivar, isLoading: loadingDes, error: errorDes } = useDesactivarCuenta(() => {
    logout();
    window.location.href = "/";
  });

  const noCoincide = formPass.passwordNueva && formPass.passwordRepetir && formPass.passwordNueva !== formPass.passwordRepetir;

  const abrirSeccion = (nombre) => {
    setSeccionAbierta(seccionAbierta === nombre ? null : nombre);
    // Resetear forms al cambiar
    if (nombre !== "email") { setFormEmail({ emailNuevo: "", passwordActual: "" }); resetEmail(); }
    if (nombre !== "password") { setFormPass({ passwordActual: "", passwordNueva: "", passwordRepetir: "" }); resetPass(); }
    if (nombre !== "desactivar") setPasswordDesactivar("");
  };

  if (loadingUser) {
    return (
      <MypeLayout titulo="Configuración">
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          {[48, 48, 48].map((h, i) => (
            <div
              key={i}
              style={{
                height: h,
                borderRadius: 8,
                background: "#F3F4F6",
                marginBottom: 16,
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
      </MypeLayout>
    );
  }

  return (
    <MypeLayout titulo="Configuración">
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        {/* Encabezado */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: FONT, fontSize: 20, fontWeight: 500, color: "#1F2937", margin: "0 0 6px" }}>
            Configuración de cuenta
          </h2>
          <p style={{ fontFamily: FONT, fontSize: 14, color: "#9CA3AF", margin: 0 }}>
            Gestiona tu correo electrónico y contraseña
          </p>
        </div>

        {/* Contenido */}
        <div style={{ background: "#FFFFFF", border: "1px solid #F3F4F6", borderRadius: 14, padding: "28px 30px" }}>
          
          {/* ── Email ── */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ ...labelStyle, fontSize: 12, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Correo electrónico
              </label>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: FONT, fontSize: 16, color: "#1F2937", fontWeight: 400 }}>
                  {user?.email || "No registrado"}
                </span>
                {seccionAbierta !== "email" && (
                  <button onClick={() => abrirSeccion("email")} style={{ fontFamily: FONT, fontSize: 13, color: "#6B7280", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    Cambiar
                  </button>
                )}
              </div>
            </div>

            <AnimatePresence>
              {seccionAbierta === "email" && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
                  <div style={{ paddingTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <div>
                        <label style={labelStyle}>Nuevo email</label>
                        <input type="email" value={formEmail.emailNuevo} onChange={(e) => setFormEmail((p) => ({ ...p, emailNuevo: e.target.value }))} style={inputStyle} placeholder="nuevo@email.com" />
                      </div>
                      <div>
                        <label style={labelStyle}>Contraseña actual</label>
                        <PasswordInput value={formEmail.passwordActual} onChange={(e) => setFormEmail((p) => ({ ...p, passwordActual: e.target.value }))} placeholder="Para confirmar" />
                      </div>
                    </div>
                    <FeedbackMsg success={successEmail} error={errorEmail} />
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                      <button onClick={() => abrirSeccion(null)} disabled={loadingEmail} style={buttonSecondary}>Cancelar</button>
                      <button onClick={() => cambiarEmail(formEmail, { onSuccess: () => abrirSeccion(null) })} disabled={loadingEmail || !formEmail.emailNuevo || !formEmail.passwordActual} style={buttonPrimary}>
                        {loadingEmail ? "Cambiando..." : "Guardar"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ height: 1, background: "#F3F4F6", marginTop: seccionAbierta === "email" ? 20 : 24 }} />
          </div>

          {/* ── Contraseña ── */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ ...labelStyle, fontSize: 12, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Contraseña
              </label>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: FONT, fontSize: 16, color: "#1F2937", fontWeight: 400 }}>••••••••••••</span>
                {seccionAbierta !== "password" && (
                  <button onClick={() => abrirSeccion("password")} style={{ fontFamily: FONT, fontSize: 13, color: "#6B7280", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    Cambiar
                  </button>
                )}
              </div>
            </div>

            <AnimatePresence>
              {seccionAbierta === "password" && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
                  <div style={{ paddingTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
                    <div>
                      <label style={labelStyle}>Contraseña actual</label>
                      <PasswordInput value={formPass.passwordActual} onChange={(e) => setFormPass((p) => ({ ...p, passwordActual: e.target.value }))} placeholder="Contraseña actual" />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <div>
                        <label style={labelStyle}>Nueva contraseña</label>
                        <PasswordInput value={formPass.passwordNueva} onChange={(e) => setFormPass((p) => ({ ...p, passwordNueva: e.target.value }))} placeholder="Mínimo 8 caracteres" />
                      </div>
                      <div>
                        <label style={labelStyle}>Repetir contraseña</label>
                        <PasswordInput value={formPass.passwordRepetir} onChange={(e) => setFormPass((p) => ({ ...p, passwordRepetir: e.target.value }))} placeholder="Repetir contraseña" />
                        {noCoincide && <p style={{ fontFamily: FONT, fontSize: 12, color: "#DC2626", marginTop: 4 }}>No coinciden</p>}
                      </div>
                    </div>
                    <FeedbackMsg success={successPass} error={errorPass} />
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                      <button onClick={() => abrirSeccion(null)} disabled={loadingPass} style={buttonSecondary}>Cancelar</button>
                      <button
                        onClick={() => {
                          if (formPass.passwordNueva !== formPass.passwordRepetir) return;
                          cambiarPassword({ passwordActual: formPass.passwordActual, passwordNueva: formPass.passwordNueva }, { onSuccess: () => abrirSeccion(null) });
                        }}
                        disabled={loadingPass || !formPass.passwordActual || !formPass.passwordNueva || noCoincide}
                        style={buttonPrimary}
                      >
                        {loadingPass ? "Guardando..." : "Guardar"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ height: 1, background: "#F3F4F6", marginTop: seccionAbierta === "password" ? 20 : 24 }} />
          </div>

          {/* ── Desactivar cuenta ── */}
          <div style={{ marginTop: 4 }}>
            {seccionAbierta !== "desactivar" ? (
              <button
                onClick={() => abrirSeccion("desactivar")}
                style={{ fontFamily: FONT, fontSize: 13, color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#6B7280")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
              >
                Desactivar cuenta
              </button>
            ) : (
              <AnimatePresence>
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
                  <div style={{ paddingTop: 8, display: "flex", flexDirection: "column", gap: 12 }}>
                    <p style={{ fontFamily: FONT, fontSize: 13, color: "#9CA3AF", margin: 0, lineHeight: 1.5 }}>
                      Esta acción es irreversible. Tus proyectos serán ocultados y dejarás de recibir postulaciones.
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ flex: 1, maxWidth: 280 }}>
                        <PasswordInput value={passwordDesactivar} onChange={(e) => setPasswordDesactivar(e.target.value)} placeholder="Tu contraseña" />
                      </div>
                      <button onClick={() => abrirSeccion(null)} style={{ fontFamily: FONT, fontSize: 13, color: "#9CA3AF", background: "none", border: "none", cursor: "pointer", padding: "6px 10px" }}>Cancelar</button>
                      <button onClick={() => desactivar({ password: passwordDesactivar })} disabled={loadingDes || !passwordDesactivar} style={{ ...buttonPrimary, padding: "14px 24px", opacity: loadingDes || !passwordDesactivar ? 0.5 : 1, fontSize: 13 }}>
                        {loadingDes ? "..." : "Confirmar"}
                      </button>
                    </div>
                    {errorDes && <p style={{ fontFamily: FONT, fontSize: 12, color: "#DC2626", margin: 0 }}>{errorDes}</p>}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

        </div>
      </div>
    </MypeLayout>
  );
}