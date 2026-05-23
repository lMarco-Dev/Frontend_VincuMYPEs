import { useState } from "react";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import { useAuthStore } from "@/store/authStore";
import {
  useActualizarInfo,
  useCambiarPassword,
  useCambiarEmail,
  useDesactivarCuenta,
} from "@/features/configuracion/useConfiguracion";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
  Save,
  X,
  CheckCircle2,
  Loader2,
  Calendar,
} from "lucide-react";

const FONT = "'Angro Std', 'Outfit', sans-serif";
const fd = (d = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: d, ease: [0.22, 1, 0.36, 1] },
});

// ── Input reutilizable ────────────────────────────────────────
function Campo({ label, children }) {
  return (
    <div>
      <label
        style={{
          fontFamily: FONT,
          fontSize: 11,
          fontWeight: 700,
          color: "#6B7280",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          display: "block",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputSt = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  fontFamily: FONT,
  fontSize: 13,
  border: "1px solid #E5E7EB",
  outline: "none",
  background: "#fff",
  color: "#111827",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

// ── Input de contraseña con toggle ────────────────────────────
function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ ...inputSt, paddingRight: 40 }}
        onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
        onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#9CA3AF",
          padding: 2,
        }}
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

// ── Mensaje de éxito / error ──────────────────────────────────
function FeedbackMsg({ success, error }) {
  if (!success && !error) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        borderRadius: 8,
        padding: "8px 12px",
        background: success ? "#F0FDF4" : "#FEF2F2",
        border: `1px solid ${success ? "#BBF7D0" : "#FECACA"}`,
      }}
    >
      {success ? (
        <CheckCircle2 size={14} color="#15803D" />
      ) : (
        <AlertTriangle size={14} color="#DC2626" />
      )}
      <span
        style={{
          fontFamily: FONT,
          fontSize: 12,
          color: success ? "#15803D" : "#DC2626",
        }}
      >
        {success ? "Cambios guardados correctamente" : error}
      </span>
    </div>
  );
}

// ── Sección: Información personal ────────────────────────────
function SeccionInfo({ user }) {
  const { ejecutar, isLoading, isSuccess, error, reset } = useActualizarInfo();
  const [form, setForm] = useState({
    nombre: user?.nombre ?? "",
    telefono: user?.telefono ?? "",
  });
  const [editando, setEditando] = useState(false);

  const handleGuardar = () => {
    ejecutar(form, {
      onSuccess: () => {
        setEditando(false);
      },
    });
  };

  return (
    <motion.div
      {...fd(0)}
      style={{
        background: "#fff",
        border: "0.5px solid #E5E7EB",
        borderRadius: "1rem",
        overflow: "hidden",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "0.5px solid #F3F4F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "#EFF6FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={15} color="#1B6FE8" />
          </div>
          <div>
            <p
              style={{
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: 700,
                color: "#0F1F3D",
                margin: 0,
              }}
            >
              Información personal
            </p>
            <p
              style={{
                fontFamily: FONT,
                fontSize: 11,
                color: "#9CA3AF",
                margin: "1px 0 0",
              }}
            >
              Nombre y teléfono de tu cuenta
            </p>
          </div>
        </div>
        {!editando && (
          <button
            onClick={() => {
              setEditando(true);
              reset();
            }}
            style={{
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              background: "transparent",
              color: "#374151",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Editar
          </button>
        )}
      </div>

      <div style={{ padding: "16px 20px" }}>
        {!editando ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { label: "Nombre completo", valor: user?.nombre, editable: true },
              {
                label: "DNI",
                valor: user?.dni || "No registrado",
                editable: false,
              },
              {
                label: "Teléfono",
                valor: user?.telefono || "No especificado",
                editable: true,
              },
              {
                label: "Email",
                valor: user?.email,
                editable: false,
                nota: "Cámbialo en la sección de correo",
              },
            ].map(({ label, valor, editable, nota }, i, arr) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom:
                    i < arr.length - 1 ? "0.5px solid #F9FAFB" : "none",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: FONT,
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      margin: 0,
                    }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      fontFamily: FONT,
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#111827",
                      margin: "2px 0 0",
                    }}
                  >
                    {valor}
                  </p>
                  {nota && (
                    <p
                      style={{
                        fontFamily: FONT,
                        fontSize: 10,
                        color: "#C4B5FD",
                        margin: "2px 0 0",
                      }}
                    >
                      {nota}
                    </p>
                  )}
                </div>
                {!editable && (
                  <span
                    style={{
                      fontFamily: FONT,
                      fontSize: 10,
                      color: "#D1D5DB",
                      background: "#F9FAFB",
                      border: "1px solid #E5E7EB",
                      padding: "2px 8px",
                      borderRadius: 20,
                    }}
                  >
                    Bloqueado
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <Campo label="Nombre completo">
                <input
                  value={form.nombre}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, nombre: e.target.value }))
                  }
                  style={inputSt}
                  onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </Campo>
              <Campo label="Teléfono">
                <input
                  value={form.telefono}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, telefono: e.target.value }))
                  }
                  style={inputSt}
                  placeholder="+51 976 543 210"
                  onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </Campo>
            </div>
            <FeedbackMsg success={isSuccess} error={error} />
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
            >
              <button
                onClick={() => setEditando(false)}
                disabled={isLoading}
                style={{
                  fontFamily: FONT,
                  padding: "0 16px",
                  height: 38,
                  borderRadius: 9,
                  background: "transparent",
                  border: "1px solid #E5E7EB",
                  color: "#6B7280",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                disabled={isLoading}
                style={{
                  fontFamily: FONT,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "0 18px",
                  height: 38,
                  borderRadius: 9,
                  background: "linear-gradient(135deg,#1B6FE8,#0E54C4)",
                  color: "#fff",
                  border: "none",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2
                      size={13}
                      style={{ animation: "spin 1s linear infinite" }}
                    />{" "}
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={13} /> Guardar
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Sección: Cambiar email ────────────────────────────────────
function SeccionEmail({ user }) {
  const { ejecutar, isLoading, isSuccess, error, reset } = useCambiarEmail();
  const [abierto, setAbierto] = useState(false);
  const [form, setForm] = useState({ emailNuevo: "", passwordActual: "" });

  const handleGuardar = () => {
    ejecutar(form, { onSuccess: () => setAbierto(false) });
  };

  return (
    <motion.div
      {...fd(0.06)}
      style={{
        background: "#fff",
        border: "0.5px solid #E5E7EB",
        borderRadius: "1rem",
        overflow: "hidden",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          padding: "14px 20px",
          borderBottom: abierto ? "0.5px solid #F3F4F6" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "#FEF3C7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Mail size={15} color="#D97706" />
          </div>
          <div>
            <p
              style={{
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: 700,
                color: "#0F1F3D",
                margin: 0,
              }}
            >
              Correo electrónico
            </p>
            <p
              style={{
                fontFamily: FONT,
                fontSize: 11,
                color: "#9CA3AF",
                margin: "1px 0 0",
              }}
            >
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setAbierto(!abierto);
            reset();
          }}
          style={{
            fontFamily: FONT,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            padding: "6px 14px",
            borderRadius: 8,
            border: "1px solid #E5E7EB",
            background: "transparent",
            color: "#374151",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          {abierto ? "Cancelar" : "Cambiar email"}
        </button>
      </div>

      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div
                style={{
                  background: "#FFFBEB",
                  border: "1px solid #FDE68A",
                  borderRadius: 8,
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                }}
              >
                <AlertTriangle
                  size={13}
                  color="#D97706"
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: 12,
                    color: "#92400E",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  Al cambiar tu email deberás usar el nuevo para iniciar sesión.
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <Campo label="Nuevo email">
                  <input
                    type="email"
                    value={form.emailNuevo}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, emailNuevo: e.target.value }))
                    }
                    style={inputSt}
                    placeholder="nuevo@email.com"
                    onFocus={(e) => (e.target.style.borderColor = "#D97706")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                </Campo>
                <Campo label="Confirma tu contraseña">
                  <PasswordInput
                    value={form.passwordActual}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, passwordActual: e.target.value }))
                    }
                    placeholder="Tu contraseña actual"
                  />
                </Campo>
              </div>
              <FeedbackMsg success={isSuccess} error={error} />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={handleGuardar}
                  disabled={
                    isLoading || !form.emailNuevo || !form.passwordActual
                  }
                  style={{
                    fontFamily: FONT,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "0 18px",
                    height: 38,
                    borderRadius: 9,
                    background: "linear-gradient(135deg,#D97706,#B45309)",
                    color: "#fff",
                    border: "none",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading || !form.emailNuevo ? 0.6 : 1,
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        size={13}
                        style={{ animation: "spin 1s linear infinite" }}
                      />{" "}
                      Cambiando...
                    </>
                  ) : (
                    <>
                      <Mail size={13} /> Confirmar cambio
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Sección: Cambiar contraseña ───────────────────────────────
function SeccionPassword() {
  const { ejecutar, isLoading, isSuccess, error, reset } = useCambiarPassword();
  const [abierto, setAbierto] = useState(false);
  const [form, setForm] = useState({
    passwordActual: "",
    passwordNueva: "",
    passwordRepetir: "",
  });

  const noCoincide =
    form.passwordNueva &&
    form.passwordRepetir &&
    form.passwordNueva !== form.passwordRepetir;

  const handleGuardar = () => {
    if (form.passwordNueva !== form.passwordRepetir) return;
    ejecutar(
      {
        passwordActual: form.passwordActual,
        passwordNueva: form.passwordNueva,
      },
      {
        onSuccess: () => {
          setAbierto(false);
          setForm({
            passwordActual: "",
            passwordNueva: "",
            passwordRepetir: "",
          });
        },
      },
    );
  };

  return (
    <motion.div
      {...fd(0.1)}
      style={{
        background: "#fff",
        border: "0.5px solid #E5E7EB",
        borderRadius: "1rem",
        overflow: "hidden",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          padding: "14px 20px",
          borderBottom: abierto ? "0.5px solid #F3F4F6" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "#F3F4F6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lock size={15} color="#6B7280" />
          </div>
          <div>
            <p
              style={{
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: 700,
                color: "#0F1F3D",
                margin: 0,
              }}
            >
              Contraseña
            </p>
            <p
              style={{
                fontFamily: FONT,
                fontSize: 11,
                color: "#9CA3AF",
                margin: "1px 0 0",
              }}
            >
              ••••••••••••
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setAbierto(!abierto);
            reset();
          }}
          style={{
            fontFamily: FONT,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            padding: "6px 14px",
            borderRadius: 8,
            border: "1px solid #E5E7EB",
            background: "transparent",
            color: "#374151",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          {abierto ? "Cancelar" : "Cambiar contraseña"}
        </button>
      </div>

      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <Campo label="Contraseña actual">
                <PasswordInput
                  value={form.passwordActual}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, passwordActual: e.target.value }))
                  }
                  placeholder="Tu contraseña actual"
                />
              </Campo>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <Campo label="Nueva contraseña">
                  <PasswordInput
                    value={form.passwordNueva}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, passwordNueva: e.target.value }))
                    }
                    placeholder="Mínimo 8 caracteres"
                  />
                </Campo>
                <Campo label="Repetir nueva contraseña">
                  <div>
                    <PasswordInput
                      value={form.passwordRepetir}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          passwordRepetir: e.target.value,
                        }))
                      }
                      placeholder="Repite la contraseña"
                    />
                    {noCoincide && (
                      <p
                        style={{
                          fontFamily: FONT,
                          fontSize: 11,
                          color: "#DC2626",
                          marginTop: 4,
                        }}
                      >
                        Las contraseñas no coinciden
                      </p>
                    )}
                  </div>
                </Campo>
              </div>
              <FeedbackMsg success={isSuccess} error={error} />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={handleGuardar}
                  disabled={
                    isLoading ||
                    !form.passwordActual ||
                    !form.passwordNueva ||
                    noCoincide
                  }
                  style={{
                    fontFamily: FONT,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "0 18px",
                    height: 38,
                    borderRadius: 9,
                    background: "linear-gradient(135deg,#374151,#111827)",
                    color: "#fff",
                    border: "none",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity:
                      isLoading || !form.passwordActual || noCoincide ? 0.6 : 1,
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        size={13}
                        style={{ animation: "spin 1s linear infinite" }}
                      />{" "}
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Lock size={13} /> Actualizar contraseña
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Sección: Estado de la cuenta ──────────────────────────────
function SeccionEstado({ user }) {
  const fechaRegistro = user?.fechaRegistro
    ? new Date(user.fechaRegistro).toLocaleDateString("es-PE", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <motion.div
      {...fd(0.14)}
      style={{
        background: "#fff",
        border: "0.5px solid #E5E7EB",
        borderRadius: "1rem",
        overflow: "hidden",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "0.5px solid #F3F4F6",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: "#F0FDF4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Shield size={15} color="#15803D" />
        </div>
        <div>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 13,
              fontWeight: 700,
              color: "#0F1F3D",
              margin: 0,
            }}
          >
            Estado de la cuenta
          </p>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 11,
              color: "#9CA3AF",
              margin: "1px 0 0",
            }}
          >
            Información sobre tu membresía en VincuMYPEs
          </p>
        </div>
      </div>
      <div
        style={{
          padding: "16px 20px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16,
        }}
      >
        {[
          {
            label: "Estado",
            content: (
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 12,
                  fontWeight: 700,
                  background: "#F0FDF4",
                  color: "#15803D",
                  border: "1px solid #BBF7D0",
                  padding: "4px 12px",
                  borderRadius: 20,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <CheckCircle2 size={12} /> Cuenta activa
              </span>
            ),
          },
          {
            label: "Miembro desde",
            content: (
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#0F1F3D",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Calendar size={13} color="#9CA3AF" />
                {fechaRegistro || "—"}
              </span>
            ),
          },
          {
            label: "Tipo de cuenta",
            content: (
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 12,
                  fontWeight: 700,
                  background: "#EFF6FF",
                  color: "#1D4ED8",
                  border: "1px solid #BFDBFE",
                  padding: "4px 12px",
                  borderRadius: 20,
                  display: "inline-block",
                }}
              >
                MYPE
              </span>
            ),
          },
        ].map(({ label, content }) => (
          <div key={label}>
            <p
              style={{
                fontFamily: FONT,
                fontSize: 10,
                fontWeight: 700,
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                margin: "0 0 6px",
              }}
            >
              {label}
            </p>
            {content}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Sección: Zona de peligro ──────────────────────────────────
function SeccionPeligro() {
  const [abierto, setAbierto] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState(false);
  const { logout } = useAuthStore();

  const { ejecutar, isLoading, error } = useDesactivarCuenta(() => {
    logout();
    window.location.href = "/";
  });

  return (
    <motion.div
      {...fd(0.18)}
      style={{
        background: "#fff",
        border: "0.5px solid #FECACA",
        borderRadius: "1rem",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 20px",
          background: "#FEF2F2",
          borderBottom: abierto ? "0.5px solid #FECACA" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertTriangle size={15} color="#DC2626" />
          </div>
          <div>
            <p
              style={{
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: 700,
                color: "#DC2626",
                margin: 0,
              }}
            >
              Zona de peligro
            </p>
            <p
              style={{
                fontFamily: FONT,
                fontSize: 11,
                color: "#F87171",
                margin: "1px 0 0",
              }}
            >
              Acciones irreversibles sobre tu cuenta
            </p>
          </div>
        </div>
        <button
          onClick={() => setAbierto(!abierto)}
          style={{
            fontFamily: FONT,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            padding: "6px 14px",
            borderRadius: 8,
            border: "1px solid #FECACA",
            background: "transparent",
            color: "#DC2626",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#FEF2F2")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          {abierto ? "Cerrar" : "Ver opciones"}
        </button>
      </div>

      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {!confirmar ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "14px",
                    background: "#FFF5F5",
                    border: "1px solid #FEE2E2",
                    borderRadius: 10,
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: FONT,
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#991B1B",
                        margin: "0 0 4px",
                      }}
                    >
                      Desactivar cuenta
                    </p>
                    <p
                      style={{
                        fontFamily: FONT,
                        fontSize: 12,
                        color: "#7F1D1D",
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      Tu cuenta quedará inactiva. Tus proyectos serán ocultados
                      y no recibirás nuevas postulaciones. Puedes contactar al
                      equipo de VincuMYPEs para reactivarla.
                    </p>
                  </div>
                  <button
                    onClick={() => setConfirmar(true)}
                    style={{
                      fontFamily: FONT,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      padding: "7px 16px",
                      borderRadius: 8,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      border: "1px solid #FCA5A5",
                      background: "transparent",
                      color: "#DC2626",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#FEE2E2";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    Desactivar cuenta
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    padding: "14px",
                    background: "#FFF5F5",
                    border: "1px solid #FCA5A5",
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <AlertTriangle size={16} color="#DC2626" />
                    <p
                      style={{
                        fontFamily: FONT,
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#991B1B",
                        margin: 0,
                      }}
                    >
                      Confirma tu contraseña para continuar
                    </p>
                  </div>
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                  />
                  {error && (
                    <p
                      style={{
                        fontFamily: FONT,
                        fontSize: 12,
                        color: "#DC2626",
                        margin: 0,
                      }}
                    >
                      {error}
                    </p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 8,
                    }}
                  >
                    <button
                      onClick={() => {
                        setConfirmar(false);
                        setPassword("");
                      }}
                      style={{
                        fontFamily: FONT,
                        padding: "0 14px",
                        height: 36,
                        borderRadius: 8,
                        background: "transparent",
                        border: "1px solid #E5E7EB",
                        color: "#6B7280",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => ejecutar({ password })}
                      disabled={isLoading || !password}
                      style={{
                        fontFamily: FONT,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "0 18px",
                        height: 36,
                        borderRadius: 8,
                        background: "linear-gradient(135deg,#DC2626,#B91C1C)",
                        color: "#fff",
                        border: "none",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor:
                          isLoading || !password ? "not-allowed" : "pointer",
                        opacity: isLoading || !password ? 0.6 : 1,
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2
                            size={13}
                            style={{ animation: "spin 1s linear infinite" }}
                          />{" "}
                          Procesando...
                        </>
                      ) : (
                        "Sí, desactivar mi cuenta"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Página principal ──────────────────────────────────────────
export function MypeConfiguracionPage() {
  const { user } = useAuthStore();

  return (
    <MypeLayout titulo="Configuración">
      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <SeccionInfo user={user} />
        <SeccionEmail user={user} />
        <SeccionPassword />
        <SeccionEstado user={user} />
        <SeccionPeligro />
      </div>
    </MypeLayout>
  );
}
