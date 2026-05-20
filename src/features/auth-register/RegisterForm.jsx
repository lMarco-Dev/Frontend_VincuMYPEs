// src/features/auth-register/RegisterForm.jsx
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  User, Mail, Lock, Building2, Briefcase, FileText,
  GraduationCap, BookOpen, BadgeInfo, AlertCircle, Phone,
  CheckCircle2, ChevronDown, Eye, EyeOff, ArrowRight, ArrowLeft, 
  Loader2, Search, IdCard
} from "lucide-react";
import { useRegister } from "./useRegister";
import { useConsultaDni } from "./hooks/useConsultaDni";
import { useConsultaRuc } from "./hooks/useConsultaRuc";

// ── Security ──────────────────────────────────────────────────────────────────
const stripXSS = (v = "") =>
  v.replace(/<[^>]*>/g, "").replace(/javascript:/gi, "")
   .replace(/on\w+\s*=/gi, "").replace(/[<>"'`]/g, "");

const MAX = 100;
const ease = [0.22, 1, 0.36, 1];

// ── Peruvian validation rules ─────────────────────────────────────────────────
const EMAIL_RE   = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const RUC_RE     = /^(10|20)\d{9}$/;
const PHONE_RE   = /^9\d{8}$/;
const CODIGO_RE  = /^N00\d{6}$/i;
const NOMBRE_RE  = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+(\s[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)+$/;
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
      <div style={{ position: "relative", width: "100%", height: 48 }}>
        <div style={{
          position: "absolute", left: 0, top: 0, height: 48, width: 52,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none", zIndex: 2
        }}>
          <Icon size={17} color={error ? "#F87171" : "#9CA3AF"} />
        </div>
        
        {children}

        {rightEl && (
          <div style={{
            position: "absolute", right: 0, top: 0, height: 48, width: 48,
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
  paddingLeft: 56,
  paddingRight: hasRight ? 48 : 16,
  fontSize: 14, color: "#111827",
  fontFamily: "inherit", fontWeight: 400,
  transition: "border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
  boxSizing: "border-box",
  appearance: "none",
});

// ── Main form ─────────────────────────────────────────────────────────────────
export function RegisterForm({ tipo, onDirtyChange, hasAcceptedTerms, onOpenTerms }) {
  const esEstudiante = tipo === "estudiante";
  const colorTema = esEstudiante ? "#1B6FE8" : "#F97316";

  const { register: registerUser, isLoading, error: backendError } = useRegister(tipo);
  const { buscarDni, isLoading: isLoadingDni, error: dniError, clearError: clearDniError } = useConsultaDni();
  const { buscarRuc, isLoading: isLoadingRuc, error: rucError, clearError: clearRucError } = useConsultaRuc();
  
  // ── ESTADOS DEL WIZARD ──
  const [step, setStep] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [dniConsultado, setDniConsultado] = useState(false);
  const [dniData, setDniData] = useState(null);
  const [rucConsultado, setRucConsultado] = useState(false);
  const [rucData, setRucData] = useState(null);

  const {
    register, handleSubmit, watch, trigger, clearErrors,
    setValue, formState: { errors },
  } = useForm({ 
    mode: "onChange",
    defaultValues: {
      dni: "",
      nombres: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      email: "",
      telefono: "",
      password: "",
      confirmPassword: "",
      universidad: "",
      carrera: "",
      codigoEstudiante: "",
      nombre: "",
      nombreComercial: "",
      ruc: "",
      rubro: "",
    }
  });

  useEffect(() => {
    clearErrors();
  }, [step, clearErrors]);

  const passValue = watch("password", "");
  const dniValue = watch("dni", "");
  const rucValue = watch("ruc", "");
  const formValues = watch();

  const isStep3Valid = esEstudiante
    ? (formValues.universidad && formValues.carrera && formValues.telefono?.length === 9 && formValues.codigoEstudiante?.length === 9)
    : (formValues.rubro && formValues.telefono?.length === 9);

  const canSubmit = hasAcceptedTerms && isStep3Valid;
    // ── AVISAR A LA PÁGINA SI HAY CAMBIOS ──
  useEffect(() => {
    const hasData = Object.values(formValues).some(v => typeof v === 'string' && v.trim().length > 0);
    if (onDirtyChange) onDirtyChange(hasData);
  }, [formValues, onDirtyChange]);

  // ── FUNCIÓN PARA CONSULTAR DNI ──
  const handleConsultarDni = async () => {
    if (dniValue.length !== 8) {
      return;
    }
    
    clearDniError();
    const data = await buscarDni(dniValue);
    
    if (data) {
      setDniData(data);
      setDniConsultado(true);
      
      setValue("nombres", data.nombres, { shouldValidate: true });
      setValue("apellidoPaterno", data.apellidoPaterno, { shouldValidate: true });
      setValue("apellidoMaterno", data.apellidoMaterno, { shouldValidate: true });
    } else {
      setDniConsultado(false);
      setDniData(null);
    }
  };

  // ── FUNCIÓN PARA CONSULTAR RUC ──
  const handleConsultarRuc = async () => {
    if (rucValue.length !== 11) {
      return;
    }
    
    clearRucError();
    const data = await buscarRuc(rucValue);
    
    if (data) {
      setRucData(data);
      setRucConsultado(true);
      
      setValue("nombre", data.razonSocial, { shouldValidate: true });
       setValue("nombreComercial", data.direccion, { shouldValidate: true });
    } else {
      setRucConsultado(false);
      setRucData(null);
    }
  };

  // ── Limpiar estado si se modifica manualmente el DNI ──
  useEffect(() => {
    if (dniConsultado && dniValue.length !== 8) {
      setDniConsultado(false);
      setDniData(null);
    }
  }, [dniValue, dniConsultado]);

  // ── Limpiar estado si se modifica manualmente el RUC ──
  useEffect(() => {
    if (rucConsultado && rucValue.length !== 11) {
      setRucConsultado(false);
      setRucData(null);
    }
  }, [rucValue, rucConsultado]);

  // ── LÓGICA DE NAVEGACIÓN ENTRE PASOS ──
  const handleNext = async () => {
    let fieldsToValidate = [];
    if (step === 0) {
      fieldsToValidate = esEstudiante 
        ? ["dni", "nombres", "apellidoPaterno", "apellidoMaterno"] 
        : ["ruc", "nombre", "nombreComercial"];
    }
    if (step === 1) {
      fieldsToValidate = esEstudiante
        ? ["email", "password", "confirmPassword"]
        : ["email", "telefono", "password", "confirmPassword"];
    }

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
    
    if (esEstudiante) {
      clean.nombre = `${clean.nombres} ${clean.apellidoPaterno} ${clean.apellidoMaterno}`.trim();
      delete clean.nombres;
      delete clean.apellidoPaterno;
      delete clean.apellidoMaterno;
    }

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
        .dni-input-success {
          background: #F0FDF4 !important;
          border-color: #86EFAC !important;
        }
        .dni-button:hover:not(:disabled) {
          background: ${colorTema} !important;
          color: white !important;
          border-color: ${colorTema} !important;
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
                <>
                  {/* CAMPO DNI CON BOTÓN DE CONSULTA */}
                  <Field 
                    label="DNI" 
                    icon={IdCard} 
                    error={errors.dni || (dniError ? { message: dniError } : null)}
                    hint={dniConsultado ? "" : "Ingresa tu DNI y haz clic en buscar"}
                  >
                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={{ position: "relative", flex: 1 }}>
                        <input
                          type="text" 
                          inputMode="numeric" 
                          maxLength={8} 
                          placeholder="12345678"
                          className={`rf-input${errors.dni || dniError ? " err" : ""} ${dniConsultado ? " dni-input-success" : ""}`}
                          style={{
                            ...inputStyle(!!errors.dni || !!dniError),
                            paddingRight: 16
                          }}
                          {...register("dni", {
                            required: "El DNI es obligatorio",
                            minLength: { value: 8, message: "El DNI debe tener 8 dígitos" },
                            maxLength: { value: 8, message: "El DNI debe tener 8 dígitos" },
                            validate: {
                              soloNumeros: (v) => /^\d{8}$/.test(v) || "Solo se permiten números",
                            },
                            onChange: (e) => { 
                              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 8);
                            },
                          })}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleConsultarDni}
                        disabled={dniValue.length !== 8 || isLoadingDni}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 10,
                          border: `1.5px solid ${dniConsultado ? "#86EFAC" : "#E5E7EB"}`,
                          background: dniConsultado ? "#F0FDF4" : "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: dniValue.length === 8 && !isLoadingDni ? "pointer" : "not-allowed",
                          opacity: dniValue.length === 8 && !isLoadingDni ? 1 : 0.5,
                          transition: "all 0.2s ease",
                          color: dniConsultado ? "#22C55E" : "#9CA3AF",
                        }}
                        className="dni-button"
                        title="Consultar DNI"
                      >
                        {isLoadingDni ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : dniConsultado ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <Search size={18} />
                        )}
                      </button>
                    </div>
                    {dniConsultado && dniData && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          fontSize: 12,
                          color: "#22C55E",
                          marginTop: 6,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontWeight: 500,
                          fontFamily: "inherit"
                        }}
                      >
                        <CheckCircle2 size={12} />
                        DNI encontrado
                      </motion.p>
                    )}
                  </Field>

                  {/* NOMBRES */}
                    <div style={{ marginTop: dniConsultado ? 12 : 0 }}>
                      <Field 
                        label="Nombres" 
                        icon={User} 
                        error={errors.nombres}
                      >
                    <input
                      type="text"
                      maxLength={40}
                      disabled={dniConsultado}
                      className={`rf-input${errors.nombres ? " err" : ""}`}
                      style={{
                        ...inputStyle(!!errors.nombres),
                        ...(dniConsultado ? {
                          background: "#F3F4F6",
                          borderColor: "#D1D5DB",
                          color: "#6B7280",
                          cursor: "not-allowed",
                          opacity: 0.8
                        } : {})
                      }}
                      {...register("nombres", {
                        required: "Los nombres son obligatorios",
                        minLength: { value: 2, message: "Mínimo 2 caracteres" },
                        maxLength: { value: 40, message: "Máximo 40 caracteres" },
                        validate: {
                          soloLetras: (v) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(v) || "Solo letras y espacios",
                        },
                        onChange: onChangeStrip,
                      })}
                    />
                   </Field>
                  </div>

                  {/* APELLIDO PATERNO Y MATERNO EN LA MISMA LÍNEA */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Field 
                      label="Apellido Paterno" 
                      icon={User} 
                      error={errors.apellidoPaterno}
                    >
                      <input
                        type="text"
                        maxLength={40}
                        disabled={dniConsultado}
                        className={`rf-input${errors.apellidoPaterno ? " err" : ""}`}
                        style={{
                          ...inputStyle(!!errors.apellidoPaterno),
                          ...(dniConsultado ? {
                            background: "#F3F4F6",
                            borderColor: "#D1D5DB",
                            color: "#6B7280",
                            cursor: "not-allowed",
                            opacity: 0.8
                          } : {})
                        }}
                        {...register("apellidoPaterno", {
                          required: "El apellido paterno es obligatorio",
                          minLength: { value: 2, message: "Mínimo 2 caracteres" },
                          maxLength: { value: 40, message: "Máximo 40 caracteres" },
                          validate: {
                            soloLetras: (v) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$/.test(v) || "Solo letras",
                          },
                          onChange: onChangeStrip,
                        })}
                      />
                    </Field>

                    <Field 
                      label="Apellido Materno" 
                      icon={User} 
                      error={errors.apellidoMaterno}
                    >
                      <input
                        type="text"
                        maxLength={40}
                        disabled={dniConsultado}
                        className={`rf-input${errors.apellidoMaterno ? " err" : ""}`}
                        style={{
                          ...inputStyle(!!errors.apellidoMaterno),
                          ...(dniConsultado ? {
                            background: "#F3F4F6",
                            borderColor: "#D1D5DB",
                            color: "#6B7280",
                            cursor: "not-allowed",
                            opacity: 0.8
                          } : {})
                        }}
                        {...register("apellidoMaterno", {
                          required: "El apellido materno es obligatorio",
                          minLength: { value: 2, message: "Mínimo 2 caracteres" },
                          maxLength: { value: 40, message: "Máximo 40 caracteres" },
                          validate: {
                            soloLetras: (v) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$/.test(v) || "Solo letras",
                          },
                          onChange: onChangeStrip,
                        })}
                      />
                    </Field>
                  </div>
                </>
              ) : (
                <>
                  {/* CAMPO RUC CON BOTÓN DE CONSULTA */}
                  <Field 
                    label="RUC" 
                    icon={FileText} 
                    error={errors.ruc || (rucError ? { message: rucError } : null)}
                    hint={rucConsultado ? "" : "Ingresa tu RUC y haz clic en buscar"}
                  >
                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={{ position: "relative", flex: 1 }}>
                        <input
                          type="text" 
                          inputMode="numeric" 
                          maxLength={11} 
                          placeholder="20123456789"
                          className={`rf-input${errors.ruc || rucError ? " err" : ""} ${rucConsultado ? " dni-input-success" : ""}`}
                          style={{
                            ...inputStyle(!!errors.ruc || !!rucError),
                            paddingRight: 16
                          }}
                          {...register("ruc", {
                            required: "El RUC es obligatorio",
                            minLength: { value: 11, message: "El RUC debe tener 11 dígitos" },
                            maxLength: { value: 11, message: "El RUC debe tener 11 dígitos" },
                            validate: {
                              formato: (v) => RUC_RE.test(v) || "Debe empezar con 10 o 20",
                            },
                            onChange: (e) => { 
                              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11);
                            },
                          })}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleConsultarRuc}
                        disabled={rucValue.length !== 11 || isLoadingRuc}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 10,
                          border: `1.5px solid ${rucConsultado ? "#86EFAC" : "#E5E7EB"}`,
                          background: rucConsultado ? "#F0FDF4" : "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: rucValue.length === 11 && !isLoadingRuc ? "pointer" : "not-allowed",
                          opacity: rucValue.length === 11 && !isLoadingRuc ? 1 : 0.5,
                          transition: "all 0.2s ease",
                          color: rucConsultado ? "#22C55E" : "#9CA3AF",
                        }}
                        className="dni-button"
                        title="Consultar RUC"
                      >
                        {isLoadingRuc ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : rucConsultado ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <Search size={18} />
                        )}
                      </button>
                    </div>
                    {rucConsultado && rucData && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          fontSize: 12,
                          color: "#22C55E",
                          marginTop: 6,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontWeight: 500,
                          fontFamily: "inherit"
                        }}
                      >
                        <CheckCircle2 size={12} />
                        RUC encontrado
                      </motion.p>
                    )}
                  </Field>

                  {/* Razón Social */}
                    <div style={{ marginTop: rucConsultado ? 12 : 0 }}>
                      <Field 
                        label="Razón Social" 
                        icon={Building2} 
                        error={errors.nombre}
                      >
                    <input
                      type="text"
                      maxLength={MAX}
                      disabled={rucConsultado}
                      className={`rf-input${errors.nombre ? " err" : ""}`}
                      style={{
                        ...inputStyle(!!errors.nombre),
                        ...(rucConsultado ? {
                          background: "#F3F4F6",
                          borderColor: "#D1D5DB",
                          color: "#6B7280",
                          cursor: "not-allowed",
                          opacity: 0.8
                        } : {})
                      }}
                      {...register("nombre", {
                        required: "La razón social es obligatoria",
                        minLength: { value: 2, message: "Mínimo 2 caracteres" },
                        maxLength: { value: MAX, message: `Máximo ${MAX} caracteres` },
                        validate: {
                          noScript: (v) => !/<|javascript:|on\w+=/.test(v) || "Caracteres no permitidos",
                        },
                        onChange: onChangeStrip,
                      })}
                    />
                  </Field>
                  </div>
                  {/* Dirección */}
                    <Field 
                      label="Dirección" 
                      icon={Building2} 
                      error={errors.nombreComercial}
                    >
                    <input
                      type="text"
                      maxLength={MAX}
                      disabled={rucConsultado}
                      className={`rf-input${errors.nombreComercial ? " err" : ""}`}
                      style={{
                        ...inputStyle(!!errors.nombreComercial),
                        ...(rucConsultado ? {
                          background: "#F3F4F6",
                          borderColor: "#D1D5DB",
                          color: "#6B7280",
                          cursor: "not-allowed",
                          opacity: 0.8
                        } : {})
                      }}
                      {...register("nombreComercial", {
                        required: "El nombre comercial es obligatorio",
                        minLength: { value: 2, message: "Mínimo 2 caracteres" },
                        maxLength: { value: MAX, message: `Máximo ${MAX} caracteres` },
                        validate: { 
                          noScript: (v) => !/<|javascript:|on\w+=/.test(v) || "Caracteres no permitidos" 
                        },
                        onChange: onChangeStrip,
                      })}
                    />
                  </Field>
                </>
              )}
            </motion.div>
          )}

          {/* ── PASO 2: SEGURIDAD ─────────────────────────────────────────── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
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
                      e.target.value = e.target.value.replace(/<[^>]*>/g, "").replace(/javascript:/gi, "").replace(/on\w+\s*=/gi, "").replace(/[<>"'`]/g, ""); 
                    },
                  })}
                />
              </Field>

              

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

              {/* TELÉFONO Y CÓDIGO DE ESTUDIANTE EN LA MISMA LÍNEA */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Teléfono Celular" icon={Phone} error={errors.telefono}>
                  <input
                    type="text" inputMode="numeric" autoComplete="tel" maxLength={9} className={`rf-input${errors.telefono ? " err" : ""}`} style={inputStyle(!!errors.telefono)}
                    {...register("telefono", {
                      required: "El celular es obligatorio",
                      validate: { format: (v) => PHONE_RE.test(v.trim()) || "Formato inválido. Debe empezar con 9 y tener 9 dígitos" },
                      onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 9); },
                    })}
                  />
                </Field>

                <Field label="Código de estudiante" icon={BadgeInfo} error={errors.codigoEstudiante}>
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
              </div>
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

    <Field label="Teléfono Celular" icon={Phone} error={errors.telefono}>
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

        {/* ── SECCIÓN TÉRMINOS Y CONDICIONES (Solo Paso Final) ── */}
        {step === 2 && (
          <div style={{ marginTop: 24, marginBottom: 12, display: "flex", alignItems: "center", gap: 8, padding: "0 4px" }}>
            <input 
              type="checkbox" 
              checked={hasAcceptedTerms}
              readOnly
              onClick={() => {
                if (!hasAcceptedTerms) onOpenTerms();
              }}
              style={{ width: 16, height: 16, cursor: "pointer", accentColor: "#1B6FE8", margin: 0 }} 
            />
            <p style={{ margin: 0, fontSize: 14, color: "#4B5563" }}>
              He leído y acepto los {" "}
              <button 
                type="button"
                onClick={onOpenTerms}
                style={{ 
                  background: "none", border: "none", padding: 0, 
                  color: "#1B6FE8", textDecoration: "underline", 
                  fontWeight: 600, cursor: "pointer", fontSize: 14, 
                  fontFamily: "inherit" 
                }}
              >
                Términos y Condiciones
              </button>
            </p>
          </div>
        )}

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
            <button 
              type="submit" 
              disabled={isLoading || !canSubmit} 
              style={{ 
                flex: 1, height: 50, borderRadius: 10, border: "none", color: "white", 
                background: esEstudiante ? "linear-gradient(135deg,#1B6FE8,#0E54C4)" : "linear-gradient(135deg,#F97316,#DC4A00)", 
                cursor: (isLoading || !canSubmit) ? "not-allowed" : "pointer", 
                fontFamily: "inherit", fontWeight: 600, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, 
                transition: "all 0.2s", 
                opacity: (isLoading || !canSubmit) ? 0.5 : 1 
              }}
              onMouseEnter={e => { if(!isLoading && canSubmit) e.currentTarget.style.transform = "translateY(-2px)" }}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              {isLoading ? <><Loader2 size={18} className="animate-spin" /> Registrando...</> : <>Crear cuenta</>}
            </button>
          )}
        </div>
      </form>
    </>
  );
}