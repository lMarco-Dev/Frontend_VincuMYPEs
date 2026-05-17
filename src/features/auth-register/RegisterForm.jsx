// src/features/auth-register/RegisterForm.jsx
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  User, Mail, Lock, Building2, Briefcase, FileText,
  GraduationCap, BookOpen, BadgeInfo, AlertCircle, Phone,
  CheckCircle2, ChevronDown, Eye, EyeOff, ArrowRight, ArrowLeft, Loader2,
} from "lucide-react";
import { useRegister } from "./useRegister";

// ── Security ──────────────────────────────────────────────────────────────────
const stripXSS = (v = "") =>
  v.replace(/<[^>]*>/g, "").replace(/javascript:/gi, "")
   .replace(/on\w+\s*=/gi, "").replace(/[<>"'`]/g, "");

const MAX = 40;
const ease = [0.22, 1, 0.36, 1];

// ── Peruvian validation rules ─────────────────────────────────────────────────
const EMAIL_RE   = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
// RUC peruano: empieza con 10 o 20, 11 dígitos
const RUC_RE     = /^(10|20)\d{9}$/;
// Teléfono móvil peruano: 9 dígitos, empieza con 9
const PHONE_RE   = /^9\d{8}$/;
// Código de estudiante UPN: letra(s) + dígitos
const CODIGO_RE  = /^N00\d{6}$/i;
// Nombre: solo letras, tildes, espacios — mín 2 palabras
const NOMBRE_RE  = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+(\s[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)+$/;
// Contraseña fuerte
const PASS_RE    = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_#])[A-Za-z\d@$!%*?&\-_#]{8,}$/;

const UNIVERSIDADES = [
  "Universidad Privada del Norte (UPN)"
];

const CARRERAS = [
  "Ingeniería de Sistemas Computacionales"
];

const RUBROS = [
  "Gastronomía / Restaurante",
  "Comercio / Retail",
  "Servicios de salud",
  "Educación",
  "Tecnología",
  "Construcción",
  "Agricultura / Agropecuario",
  "Turismo / Hospedaje",
  "Transporte / Logística",
  "Manufactura / Producción",
  "Consultoría / Servicios profesionales",
  "Otro",
];

// ── Field strength indicator for password ─────────────────────────────────────
function PasswordStrength({ value = "" }) {
  const checks = [
    { label: "8 caracteres",     ok: value.length >= 8 },
    { label: "Mayúscula",        ok: /[A-Z]/.test(value) },
    { label: "Minúscula",        ok: /[a-z]/.test(value) },
    { label: "Número",           ok: /\d/.test(value) },
    { label: "Símbolo (@$!...)", ok: /[@$!%*?&\-_#]/.test(value) },
  ];
  const score = checks.filter(c => c.ok).length;
  const color = score <= 1 ? "#EF4444" : score <= 3 ? "#F97316" : "#22C55E";
  const label = score <= 1 ? "Muy débil" : score <= 3 ? "Regular" : score === 4 ? "Buena" : "Fuerte";

  if (!value) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease }}
      style={{ marginTop: 10 }}
    >
      <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= score ? color : "#E5E7EB",
            transition: "background 0.3s ease",
          }} />
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px" }}>
        {checks.map(c => (
          <span key={c.label} style={{
            fontSize: 11, display: "flex", alignItems: "center", gap: 4,
            color: c.ok ? "#22C55E" : "#9CA3AF",
            fontFamily: "inherit", fontWeight: c.ok ? 500 : 300,
            transition: "color 0.2s ease",
          }}>
            <CheckCircle2 size={11} style={{ opacity: c.ok ? 1 : 0.4 }} />
            {c.label}
          </span>
        ))}
        <span style={{ fontSize: 11, fontWeight: 600, color, fontFamily: "inherit", marginLeft: "auto" }}>
          {label}
        </span>
      </div>
    </motion.div>
  );
}

// ── Input field wrapper ───────────────────────────────────────────────────────
function Field({ label, icon: Icon, error, rightEl, hint, children }) {
  return (
    <div>
      <label style={{
        display: "block", fontSize: 11, fontWeight: 700,
        color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.07em",
        marginBottom: 8, fontFamily: "inherit",
      }}>
        {label}
      </label>
      <div style={{ position: "relative", width: "100%" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 52,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none", zIndex: 2
        }}>
          <Icon size={17} color={error ? "#F87171" : "#9CA3AF"} />
        </div>
        
        {children}

        {rightEl && (
          <div style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: 48,
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 2
          }}>
            {rightEl}
          </div>
        )}
      </div>
      {hint && !error && (
        <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 6, fontFamily: "inherit", fontWeight: 300 }}>
          {hint}
        </p>
      )}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p key="err"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, color: "#EF4444", marginTop: 6,
              fontWeight: 500, fontFamily: "inherit",
            }}
          >
            <AlertCircle size={12} style={{ flexShrink: 0 }} />
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Shared input/select style ─────────────────────────────────────────────────
const inputStyle = (hasErr, hasRight = false) => ({
  width: "100%", height: 48,
  background: hasErr ? "#FFF5F5" : "#F9FAFB",
  border: `1.5px solid ${hasErr ? "#FCA5A5" : "#E5E7EB"}`,
  borderRadius: 10, outline: "none", 
  paddingLeft: 56, // ← El espacio extra centrado
  paddingRight: hasRight ? 48 : 16,
  fontSize: 14, color: "#111827",
  fontFamily: "inherit", fontWeight: 400,
  transition: "border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
  boxSizing: "border-box",
  appearance: "none",
});

// ── Section header (Si en algún momento quisieras usarlo) ─────────────────────
function SectionHeader({ children }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      margin: "24px 0 16px", paddingTop: 4,
      borderTop: "1px solid #F3F4F6",
    }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "inherit", whiteSpace: "nowrap" }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: "#F3F4F6" }} />
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────
export function RegisterForm({ tipo, onDirtyChange }) {
  const esEstudiante = tipo === "estudiante";
  const colorTema = esEstudiante ? "#1B6FE8" : "#F97316";

  const { register: registerUser, isLoading, error: backendError } = useRegister(tipo);
  
  // ── ESTADOS DEL WIZARD ──
  const [step, setStep] = useState(0);
  const [showPass, setShowPass]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register, handleSubmit, watch, trigger, clearErrors,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    clearErrors();
  }, [step, clearErrors]);

  const passValue    = watch("password", "");
  const formValues   = watch(); // Obtenemos todos los valores del formulario

  // ── AVISAR A LA PÁGINA SI HAY CAMBIOS ──
  useEffect(() => {
    // Verificamos si algún campo de texto no está vacío
    const hasData = Object.values(formValues).some(v => typeof v === 'string' && v.trim().length > 0);
    if (onDirtyChange) onDirtyChange(hasData);
  }, [formValues, onDirtyChange]);

  // ── LÓGICA DE NAVEGACIÓN ENTRE PASOS ──
  // ── LÓGICA DE NAVEGACIÓN ENTRE PASOS ──
  const handleNext = async () => {
    let fieldsToValidate = [];
    if (step === 0) {
      fieldsToValidate = esEstudiante 
        ? ["nombre", "email", "telefono"] 
        : ["nombre", "nombreComercial", "email", "telefono"];
    }
    if (step === 1) fieldsToValidate = ["password", "confirmPassword"];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep(s => s + 1);
      setTimeout(() => clearErrors(), 10); 
    }
  };

  const checkKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      if (step < 2) handleNext(); 
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const onSubmit = (data) => {
    if (step < 2) {
      handleNext();
      return;
    }
    
    const clean = {};
    Object.keys(data).forEach(k => { clean[k] = stripXSS(String(data[k] || "")).trim(); });
    
    delete clean.confirmPassword;

    registerUser(clean);
  };

  const eye = (show, setShow) => (
    <button type="button"
      onClick={() => setShow(p => !p)}
      tabIndex={-1}
      aria-label={show ? "Ocultar" : "Mostrar"}
      style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#9CA3AF", display: "flex", alignItems: "center", transition: "color 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.color = colorTema}
      onMouseLeave={e => e.currentTarget.style.color = "#9CA3AF"}
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );

  const onChangeStrip = (e) => {
    e.target.value = stripXSS(e.target.value).toUpperCase();
  };

  return (
    <>
      <style>{`
        .rf-input:focus {
          border-color: ${colorTema} !important;
          box-shadow: 0 0 0 3px ${colorTema}20 !important;
          background: white !important;
          outline: none !important;
        }
        .rf-input.err:focus {
          border-color: #F87171 !important;
          box-shadow: 0 0 0 3px rgba(248,113,113,0.08) !important;
        }
        .rf-input::placeholder { color: transparent; }
        .rf-select { background-image: none !important; }
        .rf-select:focus {
          border-color: ${colorTema} !important;
          box-shadow: 0 0 0 3px ${colorTema}20 !important;
          background: white !important;
          outline: none !important;
        }
      `}</style>

      {/* ── BARRA DE PROGRESO ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, color: "#6B7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "inherit" }}>
          <span>{step === 0 ? "1. Contacto" : step === 1 ? "2. Seguridad" : "3. Detalles"}</span>
          <span>Paso {step + 1} de 3</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i <= step ? colorTema : "#E5E7EB",
              transition: "background 0.3s ease"
            }} />
          ))}
        </div>
      </div>

      <form 
          onKeyDown={checkKeyDown} 
          onSubmit={handleSubmit(onSubmit)} 
          style={{ display: "flex", flexDirection: "column", gap: 18, minHeight: 280 }}
        >
        <AnimatePresence mode="wait">
          {/* ── PASO 1: CONTACTO ─────────────────────────────────────────── */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              
              {esEstudiante ? (
                <Field label="Nombre completo" icon={User} error={errors.nombre} hint="Tal como aparece en tu DNI">
                  <input
                    type="text" autoComplete="name" maxLength={MAX} className={`rf-input${errors.nombre ? " err" : ""}`} style={inputStyle(!!errors.nombre)}
                    {...register("nombre", {
                      required: "El nombre es obligatorio",
                      minLength: { value: 5, message: "Mínimo 5 caracteres" },
                      maxLength: { value: MAX, message: `Máximo ${MAX} caracteres` },
                      validate: {
                        twoWords: (v) => NOMBRE_RE.test(stripXSS(v).trim()) || "Ingresa nombre y apellido",
                        noScript: (v) => !/<|javascript:|on\w+=/.test(v) || "Caracteres no permitidos",
                      },
                      onChange: onChangeStrip,
                    })}
                  />
                </Field>
              ) : (
                <>
                  {/* Nombre del Dueño / Gerente */}
                  <Field label="Nombre del representante" icon={User} error={errors.nombre} hint="Dueño o gerente de la empresa">
                    <input
                      type="text" maxLength={MAX} className={`rf-input${errors.nombre ? " err" : ""}`} style={inputStyle(!!errors.nombre)}
                      {...register("nombre", {
                        required: "El nombre del representante es obligatorio",
                        minLength: { value: 5, message: "Mínimo 5 caracteres" },
                        maxLength: { value: MAX, message: `Máximo ${MAX} caracteres` },
                        validate: {
                          twoWords: (v) => NOMBRE_RE.test(stripXSS(v).trim()) || "Ingresa nombre y apellido",
                          noScript: (v) => !/<|javascript:|on\w+=/.test(v) || "Caracteres no permitidos",
                        },
                        onChange: onChangeStrip,
                      })}
                    />
                  </Field>

                  {/* Nombre de la Empresa */}
                  <Field label="Nombre comercial" icon={Building2} error={errors.nombreComercial} hint="Nombre con el que opera tu negocio">
                    <input
                      type="text" maxLength={MAX} className={`rf-input${errors.nombreComercial ? " err" : ""}`} style={inputStyle(!!errors.nombreComercial)}
                      {...register("nombreComercial", {
                        required: "El nombre comercial es obligatorio",
                        minLength: { value: 2, message: "Mínimo 2 caracteres" },
                        maxLength: { value: MAX, message: `Máximo ${MAX} caracteres` },
                        validate: { noScript: (v) => !/<|javascript:|on\w+=/.test(v) || "Caracteres no permitidos" },
                        onChange: onChangeStrip,
                      })}
                    />
                  </Field>
                </>
              )}

              <Field label="Correo electrónico" icon={Mail} error={errors.email}>
                <input
                  type="text" inputMode="email" autoComplete="email" maxLength={MAX} className={`rf-input${errors.email ? " err" : ""}`} style={inputStyle(!!errors.email)}
                  {...register("email", {
                    required: "El correo es obligatorio",
                    maxLength: { value: MAX, message: `Máximo ${MAX} caracteres` },
                    validate: {
                      format:   (v) => EMAIL_RE.test(stripXSS(v).trim()) || "Formato de correo inválido",
                      noScript: (v) => !/<|javascript:|on\w+=/.test(v) || "Caracteres no permitidos",
                    },
                    onChange: (e) => { 
                      // Se agregó .toUpperCase() al final
                      e.target.value = e.target.value.replace(/<[^>]*>/g, "").replace(/javascript:/gi, "").replace(/on\w+\s*=/gi, "").replace(/[<>"'`]/g, "").toUpperCase(); 
                    },
                  })}
                />
              </Field>

              <Field label="Teléfono Celular" icon={Phone} error={errors.telefono} hint="9 dígitos — Empezando con 9">
                <input
                  type="text" inputMode="numeric" autoComplete="tel" maxLength={9} className={`rf-input${errors.telefono ? " err" : ""}`} style={inputStyle(!!errors.telefono)}
                  {...register("telefono", {
                    required: "El celular es obligatorio",
                    validate: { format: (v) => PHONE_RE.test(v.trim()) || "Formato inválido. Debe empezar con 9 y tener 9 dígitos" },
                    onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 9); },
                  })}
                />
              </Field>
            </motion.div>
          )}

          {/* ── PASO 2: SEGURIDAD ─────────────────────────────────────────── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Field label="Contraseña" icon={Lock} error={errors.password} rightEl={eye(showPass, setShowPass)}>
                <input
                  type={showPass ? "text" : "password"} autoComplete="new-password" maxLength={MAX} className={`rf-input${errors.password ? " err" : ""}`} style={inputStyle(!!errors.password, true)}
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: { value: 8, message: "Mínimo 8 caracteres" },
                    maxLength: { value: MAX, message: `Máximo ${MAX} caracteres` },
                    validate: {
                      strong:   (v) => PASS_RE.test(v) || "Debe tener mayúscula, minúscula, número y símbolo",
                      noScript: (v) => !/<script|javascript:|on\w+=/.test(v) || "Caracteres no permitidos",
                    },
                  })}
                />
              </Field>
              <PasswordStrength value={passValue} />

              <Field label="Confirmar contraseña" icon={CheckCircle2} error={errors.confirmPassword} rightEl={eye(showConfirm, setShowConfirm)}>
                <input
                  type={showConfirm ? "text" : "password"} autoComplete="new-password" maxLength={MAX} className={`rf-input${errors.confirmPassword ? " err" : ""}`} style={inputStyle(!!errors.confirmPassword, true)}
                  {...register("confirmPassword", {
                    required: "Confirma tu contraseña",
                    validate: (v) => v === passValue || "Las contraseñas no coinciden",
                  })}
                />
              </Field>
            </motion.div>
          )}

          {/* ── PASO 3: DETALLES ESTUDIANTE ──────────────────────────────────────────── */}
          {step === 2 && esEstudiante && (
            <motion.div key="step2-est" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              
              <Field label="Sede y Universidad" icon={GraduationCap} error={errors.universidad}>
                <div style={{ position: "relative" }}>
                  <select
                    defaultValue=""
                    className={`rf-select rf-input${errors.universidad ? " err" : ""}`}
                    style={{ ...inputStyle(!!errors.universidad, true), cursor: "pointer", color: watch("universidad") ? "#111827" : "#9CA3AF" }}
                    {...register("universidad", { required: "Selecciona tu universidad" })}
                  >
                    <option value="" disabled hidden>Selecciona tu universidad</option>
                    <option value={UNIVERSIDADES[0]} style={{ color: "#111827" }}>{UNIVERSIDADES[0]} - Cajamarca</option>
                    <option disabled style={{ color: "#9CA3AF", fontStyle: "italic" }}>Próximamente más sedes...</option>
                  </select>
                  <ChevronDown size={16} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} />
                </div>
              </Field>

              <Field label="Carrera de ingeniería" icon={BookOpen} error={errors.carrera}>
                <div style={{ position: "relative" }}>
                  <select
                    defaultValue=""
                    className={`rf-select rf-input${errors.carrera ? " err" : ""}`}
                    style={{ ...inputStyle(!!errors.carrera, true), cursor: "pointer", color: watch("carrera") ? "#111827" : "#9CA3AF" }}
                    {...register("carrera", { required: "Selecciona tu carrera" })}
                  >
                    <option value="" disabled hidden>Selecciona tu carrera</option>
                    <option value={CARRERAS[0]} style={{ color: "#111827" }}>{CARRERAS[0]}</option>
                    <option disabled style={{ color: "#9CA3AF", fontStyle: "italic" }}>Próximamente más carreras...</option>
                  </select>
                  <ChevronDown size={16} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} />
                </div>
              </Field>

              <Field label="Código de estudiante" icon={BadgeInfo} error={errors.codigoEstudiante} hint="Ej: N00123456 — Empieza con N00 + 6 números">
                <input
                  type="text" 
                  maxLength={9} 
                  className={`rf-input${errors.codigoEstudiante ? " err" : ""}`} 
                  style={inputStyle(!!errors.codigoEstudiante)}
                  {...register("codigoEstudiante", {
                    required: "El código de estudiante es obligatorio",
                    minLength: { value: 9, message: "Debe tener exactamente 9 caracteres" },
                    maxLength: { value: 9, message: "Debe tener exactamente 9 caracteres" },
                    validate: {
                      format:   (v) => CODIGO_RE.test(v.trim()) || "Formato inválido. Debe empezar con 'N00' y tener 6 números más",
                      noScript: (v) => !/<|javascript:|on\w+=/.test(v) || "Caracteres no permitidos",
                    },
                    onChange: (e) => { e.target.value = e.target.value.replace(/[\s-]/g, "").toUpperCase(); },
                  })}
                />
              </Field>
            </motion.div>
          )}

          {step === 2 && !esEstudiante && (
            <motion.div key="step2-mype" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Field label="Rubro del negocio" icon={Briefcase} error={errors.rubro}>
                <div style={{ position: "relative" }}>
                  <select
                    defaultValue=""
                    className={`rf-select rf-input${errors.rubro ? " err" : ""}`}
                    style={{ ...inputStyle(!!errors.rubro, true), cursor: "pointer", color: watch("rubro") ? "#111827" : "#9CA3AF" }}
                    {...register("rubro", { required: "Selecciona el rubro de tu negocio" })}
                  >
                    <option value="" disabled hidden>Selecciona tu rubro</option>
                    {RUBROS.map(r => <option key={r} value={r} style={{ color: "#111827" }}>{r}</option>)}
                  </select>
                  <ChevronDown size={16} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} />
                </div>
              </Field>

              <Field label="RUC" icon={FileText} error={errors.ruc} hint="11 dígitos — persona natural (10...) o jurídica (20...)">
                <input
                  type="text" inputMode="numeric" maxLength={11} className={`rf-input${errors.ruc ? " err" : ""}`} style={inputStyle(!!errors.ruc)}
                  {...register("ruc", {
                    required: "El RUC es obligatorio",
                    validate: {
                      format: (v) => RUC_RE.test(v.trim()) || "Debe tener 11 dígitos y empezar con 10 o 20",
                      luhn:   (v) => {
                        const digits = v.trim().split("").map(Number);
                        const factors = [5,4,3,2,7,6,5,4,3,2];
                        const sum = factors.reduce((acc, f, i) => acc + f * digits[i], 0);
                        const remainder = 11 - (sum % 11);
                        const check = remainder >= 10 ? remainder - 10 : remainder;
                        return check === digits[10] || "Dígito verificador de RUC incorrecto";
                      },
                    },
                    onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11); },
                  })}
                />
              </Field>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Backend error display */}
        <AnimatePresence>
          {backendError && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease }}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", marginTop: 8, background: "#FFF5F5", borderLeft: "4px solid #F87171", borderRadius: "0 8px 8px 0", fontSize: 13, color: "#EF4444", fontWeight: 500, fontFamily: "inherit" }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} /> {backendError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── BOTONES DE NAVEGACIÓN ── */}
        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          {step > 0 && (
            <button type="button" onClick={handleBack}
              style={{ flex: "0 0 auto", width: 50, height: 50, borderRadius: 10, border: "1.5px solid #E5E7EB", background: "white", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#9CA3AF"; e.currentTarget.style.color = "#111827"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#6B7280"; }}>
              <ArrowLeft size={20} />
            </button>
          )}
          
          {step < 2 ? (
            <button type="button" onClick={handleNext} style={{ flex: 1, height: 50, borderRadius: 10, border: "none", color: "white", background: esEstudiante ? "linear-gradient(135deg,#1B6FE8,#0E54C4)" : "linear-gradient(135deg,#F97316,#DC4A00)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "transform 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              Continuar <ArrowRight size={18} />
            </button>
          ) : (
            <button type="submit" disabled={isLoading} style={{ flex: 1, height: 50, borderRadius: 10, border: "none", color: "white", background: esEstudiante ? "linear-gradient(135deg,#1B6FE8,#0E54C4)" : "linear-gradient(135deg,#F97316,#DC4A00)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "transform 0.2s", opacity: isLoading ? 0.7 : 1 }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              {isLoading ? <><Loader2 size={18} className="animate-spin" /> Registrando...</> : <>Crear cuenta</>}
            </button>
          )}
        </div>

        {step === 2 && (
          <p style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", fontWeight: 300, fontFamily: "inherit", lineHeight: 1.6, margin: "8px 0 0" }}>
            Al registrarte aceptas los términos de uso de MYPElink. Solo usamos tus datos para conectarte con {esEstudiante ? "empresas" : "estudiantes"} de Cajamarca.
          </p>
        )}
      </form>
    </>
  );
}