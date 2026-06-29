// src/features/auth-register/RegisterForm.jsx
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  User, Mail, Lock, Building2, Briefcase, FileText,
  GraduationCap, BookOpen, BadgeInfo, AlertCircle, Phone,
  CheckCircle2, ChevronDown, Eye, EyeOff, ArrowRight, ArrowLeft,
  Loader2, Search, IdCard, Clock
} from "lucide-react";
import { useRegister } from "./useRegister";
import { useConsultaDni } from "./hooks/useConsultaDni";
import { useConsultaRuc } from "./hooks/useConsultaRuc";
import { checkDniApi, checkRucApi, checkEmailApi, checkCodigoApi, checkTelefonoApi } from "./authRegister.api";
import { authRecoveryApi } from "@features/auth-recovery/authRecovery.api";

// ── Security ──────────────────────────────────────────────────────────────────
const stripXSS = (v = "") =>
  v.replace(/<[^>]*>/g, "").replace(/javascript:/gi, "")
   .replace(/on\w+\s*=/gi, "").replace(/[<>"'`]/g, "");

const MAX = 100;
const ease = [0.22, 1, 0.36, 1];
const CONSULTA_COOLDOWN = 10000; // 10 segundos de bloqueo

// ── Peruvian validation rules ─────────────────────────────────────────────────
const EMAIL_RE   = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const RUC_RE     = /^(10|20)\d{9}$/;
const PHONE_RE   = /^9\d{8}$/;
const CODIGO_RE  = /^N00\d{6}$/i;
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

// ── Field strength indicator for password (mejorado con barra) ───────────────
function PasswordStrength({ value = "" }) {
  const checks = [
    { label: "8 caracteres",     ok: value.length >= 8 },
    { label: "Mayúscula",        ok: /[A-Z]/.test(value) },
    { label: "Minúscula",        ok: /[a-z]/.test(value) },
    { label: "Número",           ok: /\d/.test(value) },
    { label: "Símbolo (@$!...)", ok: /[@$!%*?&\-_#]/.test(value) },
  ];

  const score = checks.filter(c => c.ok).length;
  const getColor = () => {
    if (score <= 2) return "#EF4444";
    if (score <= 3) return "#F59E0B";
    if (score <= 4) return "#10B981";
    return "#22C55E";
  };
  const width = `${(score / 5) * 100}%`;

  if (!value) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease }}
      style={{ marginTop: 10 }}
    >
      {/* Barra de fortaleza */}
      <div style={{ height: 4, background: "#E5E7EB", borderRadius: 2, overflow: "hidden", marginBottom: 8 }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ height: "100%", background: getColor(), borderRadius: 2 }}
        />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px" }}>
        {checks.map(c => (
          <span key={c.label} style={{
            fontSize: 11, display: "flex", alignItems: "center", gap: 4,
            color: c.ok ? "#22C55E" : "#9CA3AF",
            fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
            fontWeight: c.ok ? 500 : 400,
            transition: "color 0.3s ease",
          }}>
            <CheckCircle2 size={11} style={{ opacity: c.ok ? 1 : 0.4 }} />
            {c.label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ── Input field wrapper (sin cambios) ───────────────────────────────────────
function Field({ label, icon: Icon, error, rightEl, hint, children }) {
  return (
    <div style={{ paddingBottom: error?.message ? 20 : 14 }}>
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
          <Icon size={17} color={error && error.message ? "#F87171" : "#9CA3AF"} />
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
        {error && error.message && error.message.trim() && (
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

// ── Main form ─────────────────────────────────────────────────────────────────
export function RegisterForm({ tipo, onDirtyChange, hasAcceptedTerms, onOpenTerms }) {
  const esEstudiante = tipo === "estudiante";
  const colorTema = esEstudiante ? "#1B6FE8" : "#F97316";
  const EMAIL_VERIFICATION_ENABLED = import.meta.env.VITE_EMAIL_VERIFICATION_ENABLED === "true";
  const TOTAL_STEPS = EMAIL_VERIFICATION_ENABLED ? 4 : 3;

  const { register: registerUser, isLoading, error: backendError, successData, sendOtp, resetOtpState, otpSent, otpError } = useRegister(tipo);
  const [showBackendError, setShowBackendError] = useState(false);
  const { buscarDni, isLoading: isLoadingDni, error: dniError, clearError: clearDniError } = useConsultaDni();
  const { buscarRuc, isLoading: isLoadingRuc, error: rucError, clearError: clearRucError } = useConsultaRuc();
  const [isValidating, setIsValidating] = useState(false);

  // ── ESTADOS DEL WIZARD ──
  const [step, setStep] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [dniConsultado, setDniConsultado] = useState(false);
  const [dniData, setDniData] = useState(null);
  const [rucConsultado, setRucConsultado] = useState(false);
  const [rucData, setRucData] = useState(null);

  const [otpEnviado, setOtpEnviado] = useState(false);

  // ── ESTADOS PARA COOLDOWN ──
  const [dniCooldown, setDniCooldown] = useState(false);
  const [dniCooldownTime, setDniCooldownTime] = useState(0);
  const [rucCooldown, setRucCooldown] = useState(false);
  const [rucCooldownTime, setRucCooldownTime] = useState(0);
  // ── ESTADOS OTP (VERIFICACIÓN) ──
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSending, setOtpSending] = useState(false);
  const otpRefs = useRef([]);
const [sendingOtp, setSendingOtp] = useState(false);
const [otpErrorLocal, setOtpErrorLocal] = useState("");

const [otpExpirySeconds, setOtpExpirySeconds] = useState(0); // 300 = 5 minutos
const otpExpiryTimerRef = useRef(null);

  const dniTimerRef = useRef(null);
  const rucTimerRef = useRef(null);
  const otpEnviadoRef = useRef(false);
  

  const {
    register, handleSubmit, watch, trigger, clearErrors,
    setValue, setError,
    formState: { errors },
    
  } = useForm({
    mode: "onChange",
    defaultValues: {
      dni: "", nombres: "", apellidoPaterno: "", apellidoMaterno: "",
      email: "", telefono: "", password: "", confirmPassword: "",
      universidad: "", carrera: "", codigoEstudiante: "",
      nombre: "", nombreComercial: "", ruc: "", rubro: "", direccion: "",
    }
  });

  const email = watch("email");
  const codigoEstudiante = watch("codigoEstudiante");

  useEffect(() => {
  if (esEstudiante && codigoEstudiante?.length === 9) {
    const emailGenerado = `${codigoEstudiante.toLowerCase()}@upn.pe`;
    const emailActual = watch("email");
    if (emailGenerado !== emailActual) {
      setValue("email", emailGenerado, { shouldValidate: true });
    }
  }
}, [codigoEstudiante, esEstudiante, setValue, watch]);

  // ── Limpiar timers al desmontar ──
  /*useEffect(() => {
    return () => {
      if (dniTimerRef.current) clearInterval(dniTimerRef.current);
      if (rucTimerRef.current) clearInterval(rucTimerRef.current);
      if (otpExpiryTimerRef.current) clearInterval(otpExpiryTimerRef.current);
    };
  }, []);*/

  useEffect(() => {
    if (backendError) {
      setShowBackendError(true);
    } else {
      clearErrors();
      setShowBackendError(false);
    }
  }, [step, backendError, clearErrors]);

  const passValue = watch("password", "");
  const dniValue = watch("dni", "");
  const rucValue = watch("ruc", "");
  const formValues = watch();

  // ── LÓGICA DE VALIDACIÓN REACTIVA POR PASO ──
  const isStep0Valid = esEstudiante
    ? (formValues.dni?.length === 8 && formValues.nombres && formValues.apellidoPaterno && formValues.apellidoMaterno)
    : (formValues.ruc?.length === 11 && formValues.nombre && formValues.nombreComercial && formValues.direccion);

  const isStep1Valid = EMAIL_VERIFICATION_ENABLED
    ? (esEstudiante
        ? (formValues.universidad && formValues.carrera && formValues.telefono?.length === 9 && formValues.codigoEstudiante?.length === 9)
        : (formValues.rubro && formValues.telefono?.length === 9))
    : (EMAIL_RE.test((formValues.email || "").trim()) && PASS_RE.test(formValues.password || "") &&
       (formValues.confirmPassword === formValues.password && (formValues.password || "").length > 0));

  const passwordValue = watch("password", "");
  const confirmPasswordValue = watch("confirmPassword", "");
  const emailValue = watch("email", "");

  const isStep2Valid = EMAIL_VERIFICATION_ENABLED
    ? (EMAIL_RE.test(emailValue.trim()) && PASS_RE.test(passwordValue) &&
      (confirmPasswordValue === passwordValue && passwordValue.length > 0))
    : (esEstudiante
        ? (formValues.universidad && formValues.carrera && formValues.telefono?.length === 9 && formValues.codigoEstudiante?.length === 9)
        : (formValues.rubro && formValues.telefono?.length === 9));

  const isStep3Valid = true;

  const isCurrentStepValid = step === 0 ? isStep0Valid
    : (step === 1 ? isStep1Valid
    : (step === 2 ? isStep2Valid
    : isStep3Valid));

  const canSubmit = EMAIL_VERIFICATION_ENABLED
  ? (hasAcceptedTerms && otp.every(d => d !== "") && otpExpirySeconds > 0)
  : (hasAcceptedTerms && (esEstudiante
      ? (formValues.universidad && formValues.carrera && formValues.telefono?.length === 9 && formValues.codigoEstudiante?.length === 9)
      : (formValues.rubro && formValues.telefono?.length === 9)));

  const isNextDisabled = !isCurrentStepValid || isLoading || isValidating;

  // ── AVISAR A LA PÁGINA SI HAY CAMBIOS ──
  useEffect(() => {
    const hasData = Object.values(formValues).some(v => typeof v === 'string' && v.trim().length > 0);
    if (onDirtyChange) onDirtyChange(hasData);
  }, [formValues, onDirtyChange]);

  // ── FUNCIÓN PARA INICIAR COOLDOWN DNI ──
  const iniciarCooldownDni = () => {
    setDniCooldown(true);
    setDniCooldownTime(CONSULTA_COOLDOWN / 1000);
    if (dniTimerRef.current) clearInterval(dniTimerRef.current);
    dniTimerRef.current = setInterval(() => {
      setDniCooldownTime(prev => {
        if (prev <= 1) {
          clearInterval(dniTimerRef.current);
          dniTimerRef.current = null;
          setDniCooldown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ── FUNCIÓN PARA INICIAR COOLDOWN RUC ──
  const iniciarCooldownRuc = () => {
    setRucCooldown(true);
    setRucCooldownTime(CONSULTA_COOLDOWN / 1000);
    if (rucTimerRef.current) clearInterval(rucTimerRef.current);
    rucTimerRef.current = setInterval(() => {
      setRucCooldownTime(prev => {
        if (prev <= 1) {
          clearInterval(rucTimerRef.current);
          rucTimerRef.current = null;
          setRucCooldown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleConsultarDni = async () => {
    if (dniValue.length !== 8 || dniCooldown) return;
    clearDniError();
    const data = await buscarDni(dniValue);
    iniciarCooldownDni();
    if (data) {
      setDniData(data);
      setDniConsultado(true);
      setValue("nombres", data.nombres, { shouldValidate: true });
      setValue("apellidoPaterno", data.apellidoPaterno, { shouldValidate: true });
      setValue("apellidoMaterno", data.apellidoMaterno, { shouldValidate: true });
    } else {
      setDniConsultado(false);
      setDniData(null);
      setValue("nombres", "", { shouldValidate: false });
      setValue("apellidoPaterno", "", { shouldValidate: false });
      setValue("apellidoMaterno", "", { shouldValidate: false });
    }
  };

  const handleConsultarRuc = async () => {
    if (rucValue.length !== 11 || rucCooldown) return;
    clearRucError();
    const data = await buscarRuc(rucValue);
    iniciarCooldownRuc();
    if (data) {
      setRucData(data);
      setRucConsultado(true);
      setValue("nombre", data.razonSocial, { shouldValidate: true });
      setValue("nombreComercial", data.razonSocial, { shouldValidate: false });
      setValue("direccion", data.direccion, { shouldValidate: true });
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
      setValue("nombres", "", { shouldValidate: false });
      setValue("apellidoPaterno", "", { shouldValidate: false });
      setValue("apellidoMaterno", "", { shouldValidate: false });
    }
  }, [dniValue, dniConsultado, setValue]);

  // ── Limpiar estado si se modifica manualmente el RUC ──
  useEffect(() => {
    if (rucConsultado && rucValue.length !== 11) {
      setRucConsultado(false);
      setRucData(null);
      setValue("nombre", "", { shouldValidate: false });
      setValue("nombreComercial", "", { shouldValidate: false });
      setValue("direccion", "", { shouldValidate: false });
    }
  }, [rucValue, rucConsultado, setValue]);

  const handleNext = async () => {
  const maxStep = TOTAL_STEPS - 1;
  if (step >= maxStep) return;

  setIsValidating(true);
  try {
    // 🔹 Paso 0: Identidad - Validar DNI (estudiante) o RUC (mype)
    if (step === 0) {
      if (esEstudiante) {
        const dni = watch("dni");
        if (!dni || dni.length !== 8) {
          setError("dni", { message: "El DNI debe tener 8 dígitos" });
          return;
        }
        // Validar unicidad del DNI
        const { data: dniExists } = await checkDniApi(dni);
        if (dniExists) {
          setError("dni", { message: "Este DNI ya está registrado" });
          return;
        }
      } else {
        const ruc = watch("ruc");
        if (!ruc || ruc.length !== 11) {
          setError("ruc", { message: "El RUC debe tener 11 dígitos" });
          return;
        }
        // Validar unicidad del RUC
        const { data: rucExists } = await checkRucApi(ruc);
        if (rucExists) {
          setError("ruc", { message: "Este RUC ya está registrado" });
          return;
        }
      }
    }

    // Resto de validaciones (teléfono, email, código, etc.) - ya las tienes
    if (EMAIL_VERIFICATION_ENABLED) {
      if (step === 1) {
        const { data: telefonoExists } = await checkTelefonoApi(watch("telefono"));
        if (telefonoExists) {
          setError("telefono", { message: "Este número de teléfono ya está registrado" });
          return;
        }
        if (esEstudiante) {
          const { data: codExists } = await checkCodigoApi(watch("codigoEstudiante"));
          if (codExists) {
            setError("codigoEstudiante", { message: "Este código ya está registrado" });
            return;
          }
        }
      }
      if (step === 2) {
        const { data: emailExists } = await checkEmailApi(watch("email"));
        if (emailExists) {
          setError("email", { message: "Este correo ya está registrado" });
          return;
        }
      }
    } else {
      if (step === 1) {
        const { data: emailExists } = await checkEmailApi(watch("email"));
        if (emailExists) {
          setError("email", { message: "Este correo ya está registrado" });
          return;
        }
      }
      if (step === 2 && esEstudiante) {
        const { data: codExists } = await checkCodigoApi(watch("codigoEstudiante"));
        if (codExists) {
          setError("codigoEstudiante", { message: "Este código ya está registrado" });
          return;
        }
        const { data: telefonoExists } = await checkTelefonoApi(watch("telefono"));
        if (telefonoExists) {
          setError("telefono", { message: "Este número de teléfono ya está registrado" });
          return;
        }
      } else if (step === 2 && !esEstudiante) {
        const { data: telefonoExists } = await checkTelefonoApi(watch("telefono"));
        if (telefonoExists) {
          setError("telefono", { message: "Este número de teléfono ya está registrado" });
          return;
        }
      }
    }
  } catch (err) {
    console.error("Error en validación asíncrona:", err);
  } finally {
    setIsValidating(false);
  }

  // Luego, validar campos obligatorios con react-hook-form
  const fieldsToValidate = step === 0
    ? (esEstudiante ? ["dni", "nombres"] : ["ruc", "nombre"])
    : ["email", "password"];
  const isStepValid = await trigger(fieldsToValidate);

  if (isStepValid) {
    setStep(s => s + 1);
    setTimeout(() => clearErrors(), 10);
  }
};

 const checkKeyDown = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    
    // Si estamos en el último paso (OTP), no hacer nada con Enter
    if (step >= TOTAL_STEPS - 1) return;
    
    // 🔥 VALIDACIÓN ESPECÍFICA PARA EL PASO DE CONTRASEÑAS
    if (step === 2 && EMAIL_VERIFICATION_ENABLED) {
      const pass = watch("password");
      const confirmPass = watch("confirmPassword");
      
      let hasError = false;
      
      // Validar contraseña
      if (!pass || pass.length < 8) {
        setError("password", { message: "La contraseña debe tener al menos 8 caracteres" });
        trigger("password");
        hasError = true;
      } else if (!PASS_RE.test(pass)) {
        setError("password", { message: "La contraseña debe tener mayúscula, minúscula, número y símbolo" });
        trigger("password");
        hasError = true;
      }
      
      // Validar confirmación
      if (!confirmPass || confirmPass.length === 0) {
        setError("confirmPassword", { message: "Confirma tu contraseña" });
        trigger("confirmPassword");
        hasError = true;
      } else if (pass !== confirmPass) {
        setError("confirmPassword", { message: "Las contraseñas no coinciden" });
        trigger("confirmPassword");
        hasError = true;
      }
      
      // Si hay errores, no avanzar
      if (hasError) return;
      
      // Si todo está bien, avanzar
      handleNext();
      return;
    }
    
    // Para cualquier otro caso, usar la validación normal
    if (isCurrentStepValid) {
      handleNext();
    } else {
      // Disparar validación para mostrar errores
      const fieldsToValidate = step === 0
        ? (esEstudiante ? ["dni", "nombres", "apellidoPaterno", "apellidoMaterno"] : ["ruc", "nombre", "nombreComercial", "direccion"])
        : step === 1 && EMAIL_VERIFICATION_ENABLED
          ? (esEstudiante ? ["universidad", "carrera", "telefono", "codigoEstudiante"] : ["rubro", "telefono"])
          : ["email", "password", "confirmPassword"];
      
      trigger(fieldsToValidate);
    }
  }
};


  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const onSubmit = (data) => {
  const maxStep = TOTAL_STEPS - 1;
  if (step < maxStep) {
    handleNext();
    return;
  }

  const clean = { ...data };
  Object.keys(clean).forEach(k => { clean[k] = stripXSS(String(clean[k] || "")).trim(); });
  delete clean.confirmPassword;
  if (esEstudiante) {
    clean.otpCode = otp.join("");
  }

  if (esEstudiante) {
    clean.nombre = `${clean.nombres} ${clean.apellidoPaterno} ${clean.apellidoMaterno}`.trim();
    delete clean.nombres;
    delete clean.apellidoPaterno;
    delete clean.apellidoMaterno;
  }
  
  // ✅ Validación OTP - solo verificar que esté completo
  // Validación OTP en onSubmit
if (EMAIL_VERIFICATION_ENABLED) {
  const code = otp.join("");
  if (code.length !== 6) {
    setOtpErrorLocal("📝 Ingresa el código de verificación completo (6 dígitos)");
    return;
  }
  if (otpExpirySeconds === 0) {
    setOtpErrorLocal("El código ha expirado. Haz clic en 'Reenviar código' para obtener uno nuevo.");
    return;
  }
}

  registerUser({ ...clean, otpCode: otp.join("") }, {
    onError: (error) => {
      const errorMsg = error?.response?.data?.message || error.message || "Error al registrar usuario";
      const msgLower = errorMsg.toLowerCase();

      // Detectar errores de OTP
      if (msgLower.includes("otp") || 
          msgLower.includes("código de verificación") || 
          (msgLower.includes("código") && msgLower.includes("expir")) ||
          (msgLower.includes("invalid") && msgLower.includes("code"))) {
        
        let mensajeMostrar = "";
        
        // 🔥 LÓGICA CORREGIDA: Usar el contador para determinar el mensaje
        if (otpExpirySeconds === 0) {
          // Si el contador ya llegó a 0, definitivamente es expiración
          mensajeMostrar = "⏰ El código de verificación ha expirado. Solicita uno nuevo.";
        } else if (otpExpirySeconds > 0) {
          // Si aún hay tiempo, el código es incorrecto (aunque el backend diga expirado)
          mensajeMostrar = "El código de verificación es incorrecto. Intenta nuevamente.";
        } else {
          // Fallback: usar el mensaje del backend
          if (msgLower.includes("expir") || msgLower.includes("expirado") || msgLower.includes("tiempo")) {
            mensajeMostrar = "El código de verificación ha expirado. Solicita uno nuevo.";
          } else {
            mensajeMostrar = "El código de verificación es incorrecto. Intenta nuevamente.";
          }
        }
        
        setOtpErrorLocal(mensajeMostrar);
        return; // Salir para no duplicar
      }

      // Resto de errores...
      if (msgLower.includes("dni")) {
        setError("dni", { type: "server", message: errorMsg });
        setStep(0);
      }
      else if (msgLower.includes("ruc")) {
        setError("ruc", { type: "server", message: errorMsg });
        setStep(0);
      }
      else if (msgLower.includes("correo") || msgLower.includes("email")) {
        setError("email", { type: "server", message: errorMsg });
        setStep(EMAIL_VERIFICATION_ENABLED ? 2 : 1);
      }
      else if (msgLower.includes("código") || msgLower.includes("codigo")) {
        setError("codigoEstudiante", { type: "server", message: errorMsg });
        setStep(EMAIL_VERIFICATION_ENABLED ? 1 : 2);
      }
      else if (msgLower.includes("teléfono") || msgLower.includes("telefono")) {
        setError("telefono", { type: "server", message: errorMsg });
        setStep(EMAIL_VERIFICATION_ENABLED ? 1 : 2);
      }
    }
  });
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

  const onChangeNombre = (e) => {
    e.target.value = e.target.value
      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, "")
      .toUpperCase();
  };

  const onChangeApellido = (e) => {
    e.target.value = e.target.value
      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]/g, "")
      .toUpperCase();
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // 🔥 Limpiar error cuando el usuario cambia CUALQUIER dígito
    setOtpErrorLocal("");
    
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    paste.split("").forEach((char, i) => { if (i < 6) newOtp[i] = char; });
    setOtp(newOtp);
    otpRefs.current[Math.min(paste.length, 5)]?.focus();
  };
  

  const handleSendOtp = async () => {
    const emailActual = watch("email");
    if (!emailActual) {
      setOtpErrorLocal("No se encontró el correo");
      return;
    }
    if (otpExpirySeconds > 0) return;

    setSendingOtp(true);
    setOtpErrorLocal("");
    setOtp(["", "", "", "", "", ""]);

    try {
      await authRecoveryApi.sendVerificationOtp(emailActual);
      setOtpEnviado(true);
      otpEnviadoRef.current = true;
      setOtpExpirySeconds(600);

      if (otpExpiryTimerRef.current) {
        clearInterval(otpExpiryTimerRef.current);
      }
      otpExpiryTimerRef.current = setInterval(() => {
        setOtpExpirySeconds(prev => {
          if (prev <= 1) {
            clearInterval(otpExpiryTimerRef.current);
            otpExpiryTimerRef.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      console.log("OTP enviado a:", emailActual);
    } catch (err) {
    otpEnviadoRef.current = false;
    setOtpEnviado(false);
    const msg = err.response?.data?.message || err.message || "Error al enviar el código";
    // Mostrar mensaje más amigable
    if (msg.toLowerCase().includes("timeout") || msg.toLowerCase().includes("tiempo")) {
      setOtpErrorLocal("⏱️ El servidor tardó en responder. Intenta nuevamente.");
    } else {
      setOtpErrorLocal("❌ " + msg);
    }
  } finally {
    setSendingOtp(false);
  }
};

  const handleResendOtp = async () => {
  // 🔥 PERMITIR reenviar incluso si el contador está en 0
  // (antes tenía if (otpExpirySeconds > 0) return;)

  setOtpSending(true);
  setOtpErrorLocal("");
  setOtp(["", "", "", "", "", ""]); // Limpiar inputs

  try {
    const emailActual = watch("email");
    await authRecoveryApi.sendVerificationOtp(emailActual);
    setOtpEnviado(true);
    otpEnviadoRef.current = true;
    
    // 🔥 REINICIAR el contador a 600 segundos
    setOtpExpirySeconds(600);

    if (otpExpiryTimerRef.current) {
      clearInterval(otpExpiryTimerRef.current);
    }
    otpExpiryTimerRef.current = setInterval(() => {
      setOtpExpirySeconds(prev => {
        if (prev <= 1) {
          clearInterval(otpExpiryTimerRef.current);
          otpExpiryTimerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  } catch (err) {
    otpEnviadoRef.current = false;
    setOtpEnviado(false);
    const msg = err.response?.data?.message || err.message || "Error al enviar el código";
    setOtpErrorLocal("❌ " + msg);
  } finally {
    setOtpSending(false);
  }
};


  const isDniSearchBlocked = dniCooldown || isLoadingDni;
  const isRucSearchBlocked = rucCooldown || isLoadingRuc;

  if (successData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        style={{ textAlign: "center", padding: "20px 0" }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #DBEAFE, #BFDBFE)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <Clock size={32} color="#1B6FE8" />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f1f3d", margin: "0 0 12px" }}>
          Registro exitoso
        </h2>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: "0 0 24px" }}>
          {successData.mensaje || "Tu cuenta está pendiente de aprobación por el administrador."}
        </p>
        <Link
          to="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "linear-gradient(135deg, #1B6FE8, #0E54C4)",
            color: "#fff",
            textDecoration: "none",
            borderRadius: 10,
            padding: "12px 28px",
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "Arial, sans-serif",
            transition: "transform 0.25s ease, box-shadow 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(27,111,232,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Ir a iniciar sesión <ArrowRight size={18} />
        </Link>
      </motion.div>
    );
  }

  return (
    <>
      <style>{`
        .rf-input:focus {
          border-color: transparent !important;
          box-shadow: 0 0 0 3px ${colorTema}20 !important;
          background: white !important;
          outline: none !important;
          border-image: linear-gradient(135deg, ${colorTema}, ${colorTema === "#1B6FE8" ? "#0E54C4" : "#DC4A00"}) 1 !important;
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
          <span>
            {EMAIL_VERIFICATION_ENABLED
              ? (step === 0 ? "1. Identidad" : step === 1 ? "2. Perfil" : step === 2 ? "3. Cuenta" : "4. Verificación")
              : (step === 0 ? "1. Contacto" : step === 1 ? "2. Seguridad" : "3. Detalles")
            }
          </span>
          <span>Paso {step + 1} de {TOTAL_STEPS}</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[...Array(TOTAL_STEPS)].map((_, i) => (
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
          {/* ── PASO 1: CONTACTO / IDENTIDAD ── */}
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
                          style={{ ...inputStyle(!!errors.dni || !!dniError), paddingRight: 16 }}
                          {...register("dni", {
                            required: "El DNI es obligatorio",
                            minLength: { value: 8, message: "El DNI debe tener 8 dígitos" },
                            maxLength: { value: 8, message: "El DNI debe tener 8 dígitos" },
                            validate: { soloNumeros: (v) => /^\d{8}$/.test(v) || "Solo se permiten números" },
                            onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 8); },
                          })}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleConsultarDni}
                        disabled={dniValue.length !== 8 || isDniSearchBlocked}
                        style={{
                          width: 48, height: 48, borderRadius: 10,
                          border: `1.5px solid ${dniConsultado ? "#86EFAC" : dniCooldown ? "#FCD34D" : "#E5E7EB"}`,
                          background: dniConsultado ? "#F0FDF4" : dniCooldown ? "#FFFBEB" : "white",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: (dniValue.length === 8 && !isDniSearchBlocked) ? "pointer" : "not-allowed",
                          opacity: (dniValue.length === 8 && !isDniSearchBlocked) ? 1 : 0.5,
                          transition: "all 0.2s ease",
                          color: dniConsultado ? "#22C55E" : dniCooldown ? "#D97706" : "#9CA3AF",
                          position: "relative",
                        }}
                        className="dni-button"
                        title={dniCooldown ? `Espera ${dniCooldownTime}s` : dniConsultado ? "DNI ya consultado" : "Consultar DNI"}
                      >
                        {isLoadingDni ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : dniCooldown ? (
                          <>
                            <Clock size={18} />
                            <span style={{
                              position: "absolute", top: -8, right: -8,
                              background: "#F97316", color: "white", borderRadius: "50%",
                              width: 20, height: 20, fontSize: 10, fontWeight: 700,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontFamily: "inherit",
                            }}>
                              {dniCooldownTime}
                            </span>
                          </>
                        ) : dniConsultado ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <Search size={18} />
                        )}
                      </button>
                    </div>
                    {dniConsultado && dniData && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: 12, color: "#22C55E", marginTop: 6, display: "flex", alignItems: "center", gap: 4, fontWeight: 500, fontFamily: "inherit" }}
                      >
                        <CheckCircle2 size={12} /> DNI encontrado y verificado
                      </motion.p>
                    )}
                  </Field>

                  <div style={{ marginTop: dniConsultado ? 12 : 0 }}>
                    <Field label="Nombres" icon={User} error={errors.nombres}>
                      <input
                        type="text" maxLength={40}
                        className={`rf-input${errors.nombres ? " err" : ""}`}
                        style={{
                          ...inputStyle(!!errors.nombres),
                          background: dniConsultado ? "#F0FDF4" : "#F9FAFB",
                          borderColor: dniConsultado ? "#86EFAC" : "#E5E7EB",
                          color: "#111827",
                        }}
                        placeholder="Autocompletado por DNI o escribe aquí"
                        {...register("nombres", {
                          required: "Los nombres son obligatorios",
                          minLength: { value: 2, message: "Mínimo 2 caracteres" },
                          maxLength: { value: 40, message: "Máximo 40 caracteres" },
                          validate: {
                            soloLetras: (v) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(v) || "Solo se permiten letras y espacios",
                            sinEspaciosExcesivos: (v) => (v.trim().split(/\s+/).length <= 4) || "Máximo 4 nombres",
                            sinEspaciosBordes: (v) => v.trim() === v || "No debe empezar ni terminar con espacios",
                          },
                          onChange: onChangeNombre,
                        })}
                      />
                    </Field>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Field label="Apellido Paterno" icon={User} error={errors.apellidoPaterno}>
                      <input
                        type="text" maxLength={40}
                        className={`rf-input${errors.apellidoPaterno ? " err" : ""}`}
                        style={{
                          ...inputStyle(!!errors.apellidoPaterno),
                          background: dniConsultado ? "#F0FDF4" : "#F9FAFB",
                          borderColor: dniConsultado ? "#86EFAC" : "#E5E7EB",
                          color: "#111827",
                        }}
                        placeholder="Autocompletado o escribe aquí"
                        {...register("apellidoPaterno", {
                          required: "El apellido paterno es obligatorio",
                          minLength: { value: 2, message: "Mínimo 2 caracteres" },
                          maxLength: { value: 40, message: "Máximo 40 caracteres" },
                          validate: { soloLetrasEspacios: (v) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]+$/.test(v) || "Solo letras, espacios y guiones" },
                          onChange: onChangeApellido,
                        })}
                      />
                    </Field>

                    <Field label="Apellido Materno" icon={User} error={errors.apellidoMaterno}>
                      <input
                        type="text" maxLength={40}
                        className={`rf-input${errors.apellidoMaterno ? " err" : ""}`}
                        style={{
                          ...inputStyle(!!errors.apellidoMaterno),
                          background: dniConsultado ? "#F0FDF4" : "#F9FAFB",
                          borderColor: dniConsultado ? "#86EFAC" : "#E5E7EB",
                          color: "#111827",
                        }}
                        placeholder="Autocompletado o escribe aquí"
                        {...register("apellidoMaterno", {
                          required: "El apellido materno es obligatorio",
                          minLength: { value: 2, message: "Mínimo 2 caracteres" },
                          maxLength: { value: 40, message: "Máximo 40 caracteres" },
                          validate: { soloLetrasEspacios: (v) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]+$/.test(v) || "Solo letras, espacios y guiones" },
                          onChange: onChangeApellido,
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
                          type="text" inputMode="numeric" maxLength={11} placeholder="20123456789"
                          className={`rf-input${errors.ruc || rucError ? " err" : ""} ${rucConsultado ? " dni-input-success" : ""}`}
                          style={{ ...inputStyle(!!errors.ruc || !!rucError), paddingRight: 16 }}
                          {...register("ruc", {
                            required: "El RUC es obligatorio",
                            minLength: { value: 11, message: "El RUC debe tener 11 dígitos" },
                            maxLength: { value: 11, message: "El RUC debe tener 11 dígitos" },
                            validate: { formato: (v) => RUC_RE.test(v) || "Debe empezar con 10 o 20" },
                            onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11); },
                          })}
                        />
                      </div>
                      <button
                        type="button" onClick={handleConsultarRuc}
                        disabled={rucValue.length !== 11 || isRucSearchBlocked}
                        style={{
                          width: 48, height: 48, borderRadius: 10,
                          border: `1.5px solid ${rucConsultado ? "#86EFAC" : rucCooldown ? "#FCD34D" : "#E5E7EB"}`,
                          background: rucConsultado ? "#F0FDF4" : rucCooldown ? "#FFFBEB" : "white",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: (rucValue.length === 11 && !isRucSearchBlocked) ? "pointer" : "not-allowed",
                          opacity: (rucValue.length === 11 && !isRucSearchBlocked) ? 1 : 0.5,
                          transition: "all 0.2s ease",
                          color: rucConsultado ? "#22C55E" : rucCooldown ? "#D97706" : "#9CA3AF",
                          position: "relative",
                        }}
                        className="dni-button"
                        title={rucCooldown ? `Espera ${rucCooldownTime}s` : rucConsultado ? "RUC ya consultado" : "Consultar RUC"}
                      >
                        {isLoadingRuc ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : rucCooldown ? (
                          <>
                            <Clock size={18} />
                            <span style={{
                              position: "absolute", top: -8, right: -8,
                              background: "#F97316", color: "white", borderRadius: "50%",
                              width: 20, height: 20, fontSize: 10, fontWeight: 700,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontFamily: "inherit",
                            }}>
                              {rucCooldownTime}
                            </span>
                          </>
                        ) : rucConsultado ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <Search size={18} />
                        )}
                      </button>
                    </div>
                    {rucConsultado && rucData && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: 12, color: "#22C55E", marginTop: 6, display: "flex", alignItems: "center", gap: 4, fontWeight: 500, fontFamily: "inherit" }}
                      >
                        <CheckCircle2 size={12} /> RUC encontrado y verificado
                      </motion.p>
                    )}
                  </Field>

                  {/* Razón Social - editable, precargado por RUC */}
                  <Field label="Razón Social" icon={Building2} error={errors.nombre}>
                    <input
                      type="text" maxLength={100}
                      className={`rf-input${errors.nombre ? " err" : ""}`}
                      style={{
                        ...inputStyle(!!errors.nombre),
                        background: rucConsultado ? "#F0FDF4" : "#F9FAFB",
                        borderColor: rucConsultado ? "#86EFAC" : "#E5E7EB",
                        color: "#111827",
                      }}
                      placeholder="Autocompletado por RUC o escribe aquí"
                      {...register("nombre", {
                        required: "La razón social es obligatoria",
                        minLength: { value: 2, message: "Mínimo 2 caracteres" },
                        maxLength: { value: 100, message: "Máximo 100 caracteres" },
                        validate: {
                          soloLetras: (v) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.,\-]+$/.test(v.trim()) || "Solo letras, puntos y comas",
                          sinEspaciosBordes: (v) => v.trim() === v || "Sin espacios al inicio o final",
                        },
                        onChange: (e) => {
                          e.target.value = e.target.value
                            .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.,\-]/g, "")
                            .toUpperCase();
                        },
                      })}
                    />
                  </Field>

                  {/* Nombre Comercial - editable, ingreso manual */}
                  <Field label="Nombre Comercial" icon={Building2} error={errors.nombreComercial}
                    hint="Nombre que verán los usuarios en la plataforma">
                    <input
                      type="text" maxLength={50}
                      className={`rf-input${errors.nombreComercial ? " err" : ""}`}
                      style={inputStyle(!!errors.nombreComercial)}
                      placeholder="Ej: Restaurante El Sabor"
                      {...register("nombreComercial", {
                        required: "El nombre comercial es obligatorio",
                        minLength: { value: 2, message: "Mínimo 2 caracteres" },
                        maxLength: { value: 50, message: "Máximo 50 caracteres" },
                        validate: {
                          soloLetras: (v) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.,\-]+$/.test(v.trim()) || "Solo letras, puntos y comas",
                          sinEspaciosBordes: (v) => v.trim() === v || "Sin espacios al inicio o final",
                        },
                        onChange: (e) => {
                          e.target.value = e.target.value
                            .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.,\-]/g, "")
                            .toUpperCase();
                        },
                      })}
                    />
                  </Field>

                  {/* Dirección - editable, precargado por RUC */}
                  <Field label="Dirección" icon={Building2} error={errors.direccion}>
                    <input
                      type="text" maxLength={100}
                      className={`rf-input${errors.direccion ? " err" : ""}`}
                      style={{
                        ...inputStyle(!!errors.direccion),
                        background: rucConsultado ? "#F0FDF4" : "#F9FAFB",
                        borderColor: rucConsultado ? "#86EFAC" : "#E5E7EB",
                        color: "#111827",
                      }}
                      placeholder="Autocompletado por RUC o escribe aquí"
                      {...register("direccion", {
                        required: "La dirección es obligatoria",
                        minLength: { value: 5, message: "Mínimo 5 caracteres" },
                        maxLength: { value: 100, message: "Máximo 100 caracteres" },
                        validate: {
                          soloLetrasYNumeros: (v) => /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,\-]+$/.test(v.trim()) || "Solo letras, números, puntos y comas",
                          sinEspaciosBordes: (v) => v.trim() === v || "Sin espacios al inicio o final",
                        },
                        onChange: (e) => {
                          e.target.value = e.target.value
                            .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,\-]/g, "")
                            .toUpperCase();
                        },
                      })}
                    />
                  </Field>
                </>
              )}
            </motion.div>
          )}

          {/* ── PASO 2: PERFIL (si verification) / SEGURIDAD (si no) ── */}
          {step === 1 && EMAIL_VERIFICATION_ENABLED && (
            <motion.div key="step1-ver" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {esEstudiante ? (
                <>
                  <Field label="Sede y Universidad" icon={GraduationCap} error={errors.universidad}>
                    <div style={{ position: "relative" }}>
                      <select defaultValue="" className={`rf-select rf-input${errors.universidad ? " err" : ""}`}
                        style={{ ...inputStyle(!!errors.universidad, true), cursor: "pointer", color: watch("universidad") ? "#111827" : "#9CA3AF" }}
                        {...register("universidad", { required: "Selecciona tu universidad" })}>
                        <option value="" disabled hidden>Selecciona tu universidad</option>
                        <option value={UNIVERSIDADES[0]} style={{ color: "#111827" }}>{UNIVERSIDADES[0]} - Cajamarca</option>
                        <option disabled style={{ color: "#9CA3AF", fontStyle: "italic" }}>Próximamente más sedes...</option>
                      </select>
                      <ChevronDown size={16} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} />
                    </div>
                  </Field>
                  <Field label="Carrera de ingeniería" icon={BookOpen} error={errors.carrera}>
                    <div style={{ position: "relative" }}>
                      <select defaultValue="" className={`rf-select rf-input${errors.carrera ? " err" : ""}`}
                        style={{ ...inputStyle(!!errors.carrera, true), cursor: "pointer", color: watch("carrera") ? "#111827" : "#9CA3AF" }}
                        {...register("carrera", { required: "Selecciona tu carrera" })}>
                        <option value="" disabled hidden>Selecciona tu carrera</option>
                        <option value={CARRERAS[0]} style={{ color: "#111827" }}>{CARRERAS[0]}</option>
                        <option disabled style={{ color: "#9CA3AF", fontStyle: "italic" }}>Próximamente más carreras...</option>
                      </select>
                      <ChevronDown size={16} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} />
                    </div>
                  </Field>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Field label="Teléfono Celular" icon={Phone} error={errors.telefono}>
                      <input type="text" inputMode="numeric" autoComplete="tel" maxLength={9} className={`rf-input${errors.telefono ? " err" : ""}`} style={inputStyle(!!errors.telefono)}
                        {...register("telefono", { required: "El celular es obligatorio", validate: { format: (v) => PHONE_RE.test(v.trim()) || "Formato inválido" }, onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 9); } })} />
                    </Field>
                    <Field label="Código de estudiante" icon={BadgeInfo} error={errors.codigoEstudiante}>
                      <input type="text" maxLength={9} className={`rf-input${errors.codigoEstudiante ? " err" : ""}`} style={inputStyle(!!errors.codigoEstudiante)}
                        {...register("codigoEstudiante", { required: "El código de estudiante es obligatorio", minLength: { value: 9, message: "Debe tener exactamente 9 caracteres" }, maxLength: { value: 9, message: "Debe tener exactamente 9 caracteres" }, validate: { format: (v) => CODIGO_RE.test(v.trim()) || "Formato inválido" }, onChange: (e) => { e.target.value = e.target.value.replace(/[\s-]/g, "").toUpperCase(); } })} />
                    </Field>
                  </div>
                </>
              ) : (
                <>
                  <Field label="Rubro del negocio" icon={Briefcase} error={errors.rubro}>
                    <div style={{ position: "relative" }}>
                      <select defaultValue="" className={`rf-select rf-input${errors.rubro ? " err" : ""}`} style={{ ...inputStyle(!!errors.rubro, true), cursor: "pointer", color: watch("rubro") ? "#111827" : "#9CA3AF" }} {...register("rubro", { required: "Selecciona el rubro de tu negocio" })}>
                        <option value="" disabled hidden>Selecciona tu rubro</option>
                        {RUBROS.map(r => <option key={r} value={r} style={{ color: "#111827" }}>{r}</option>)}
                      </select>
                      <ChevronDown size={16} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} />
                    </div>
                  </Field>
                  <Field label="Teléfono Celular" icon={Phone} error={errors.telefono}>
                    <input type="text" inputMode="numeric" autoComplete="tel" maxLength={9} className={`rf-input${errors.telefono ? " err" : ""}`} style={inputStyle(!!errors.telefono)}
                      {...register("telefono", { required: "El celular es obligatorio", validate: { format: (v) => PHONE_RE.test(v.trim()) || "Formato inválido" }, onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 9); } })} />
                  </Field>
                </>
              )}
            </motion.div>
          )}

          {/* ── PASO 2: SEGURIDAD (flujo sin verificación) ───────────────── */}
          {step === 1 && !EMAIL_VERIFICATION_ENABLED && (
            <motion.div key="step1-old" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Field label="Correo electrónico" icon={Mail} error={errors.email}>
                <input type="text" inputMode="email" autoComplete="email" maxLength={MAX} className={`rf-input${errors.email ? " err" : ""}`} style={inputStyle(!!errors.email)}
                  {...register("email", { required: "El correo es obligatorio", maxLength: { value: MAX, message: `Máximo ${MAX} caracteres` }, validate: { format: (v) => EMAIL_RE.test(stripXSS(v).trim()) || "Formato de correo inválido", noScript: (v) => !/<|javascript:|on\w+=/.test(v) || "Caracteres no permitidos" }, onChange: (e) => { e.target.value = e.target.value.replace(/<[^>]*>/g, "").replace(/javascript:/gi, "").replace(/on\w+\s*=/gi, "").replace(/[<>"'`]/g, ""); } })} />
              </Field>
              <Field label="Contraseña" icon={Lock} error={errors.password} rightEl={eye(showPass, setShowPass)}>
                <input type={showPass ? "text" : "password"} autoComplete="new-password" maxLength={MAX} className={`rf-input${errors.password ? " err" : ""}`} style={inputStyle(!!errors.password, true)}
                  {...register("password", { required: "La contraseña es obligatoria", minLength: { value: 8, message: " " }, maxLength: { value: MAX, message: `Máximo ${MAX} caracteres` }, validate: { strong: (v) => PASS_RE.test(v) || "", noScript: (v) => !/<script|javascript:|on\w+=/.test(v) || "Caracteres no permitidos" } })} />
              </Field>
              <PasswordStrength value={passValue} />
              <Field label="Confirmar contraseña" icon={CheckCircle2} error={errors.confirmPassword} rightEl={eye(showConfirm, setShowConfirm)}>
                <input type={showConfirm ? "text" : "password"} autoComplete="new-password" maxLength={MAX} className={`rf-input${errors.confirmPassword ? " err" : ""}`} style={inputStyle(!!errors.confirmPassword, true)}
                  {...register("confirmPassword", { required: "Confirma tu contraseña", validate: (v) => v === passValue || "Las contraseñas no coinciden" })} />
              </Field>
            </motion.div>
          )}

          {/* ── PASO 3: CUENTA (flujo con verificación) ──────────────────── */}
          {step === 2 && EMAIL_VERIFICATION_ENABLED && (
            <motion.div key="step2-ver" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Field label="Correo electrónico" icon={Mail} error={errors.email}>
                <input
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={MAX}
                  className={`rf-input${errors.email ? " err" : ""}`}
                  readOnly={esEstudiante}
                  style={{
                    ...inputStyle(!!errors.email),
                    background: esEstudiante ? "#F0FDF4" : "#F9FAFB",
                    cursor: esEstudiante ? "not-allowed" : "text",
                  }}
                  {...register("email", {
                    required: "El correo es obligatorio",
                    maxLength: { value: MAX, message: `Máximo ${MAX} caracteres` },
                    validate: {
                      format: (v) => EMAIL_RE.test(stripXSS(v).trim()) || "Formato de correo inválido",
                      noScript: (v) => !/<|javascript:|on\w+=/.test(v) || "Caracteres no permitidos"
                    },
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/<[^>]*>/g, "").replace(/javascript:/gi, "").replace(/on\w+\s*=/gi, "").replace(/[<>"'`]/g, "");
                    }
                  })}
                />
              </Field>
              <Field label="Contraseña" icon={Lock} error={errors.password} rightEl={eye(showPass, setShowPass)}>
                <input type={showPass ? "text" : "password"} autoComplete="new-password" maxLength={MAX} className={`rf-input${errors.password ? " err" : ""}`} style={inputStyle(!!errors.password, true)}
                  {...register("password", { required: "La contraseña es obligatoria", minLength: { value: 8, message: " " }, maxLength: { value: MAX, message: `Máximo ${MAX} caracteres` }, validate: { strong: (v) => PASS_RE.test(v) || "", noScript: (v) => !/<script|javascript:|on\w+=/.test(v) || "Caracteres no permitidos" } })} />
              </Field>
              <PasswordStrength value={passValue} />
              <Field label="Confirmar contraseña" icon={CheckCircle2} error={errors.confirmPassword} rightEl={eye(showConfirm, setShowConfirm)}>
                <input type={showConfirm ? "text" : "password"} autoComplete="new-password" maxLength={MAX} className={`rf-input${errors.confirmPassword ? " err" : ""}`} style={inputStyle(!!errors.confirmPassword, true)}
                  {...register("confirmPassword", { required: "Confirma tu contraseña", validate: (v) => v === passValue || "Las contraseñas no coinciden" })} />
              </Field>
            </motion.div>
          )}

          {/* ── PASO 3: DETALLES (flujo sin verificación) ────────────────── */}
          {step === 2 && !EMAIL_VERIFICATION_ENABLED && esEstudiante && (
            <motion.div key="step2-est" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Field label="Sede y Universidad" icon={GraduationCap} error={errors.universidad}>
                <div style={{ position: "relative" }}>
                  <select defaultValue="" className={`rf-select rf-input${errors.universidad ? " err" : ""}`} style={{ ...inputStyle(!!errors.universidad, true), cursor: "pointer", color: watch("universidad") ? "#111827" : "#9CA3AF" }} {...register("universidad", { required: "Selecciona tu universidad" })}>
                    <option value="" disabled hidden>Selecciona tu universidad</option>
                    <option value={UNIVERSIDADES[0]} style={{ color: "#111827" }}>{UNIVERSIDADES[0]} - Cajamarca</option>
                    <option disabled style={{ color: "#9CA3AF", fontStyle: "italic" }}>Próximamente más sedes...</option>
                  </select>
                  <ChevronDown size={16} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} />
                </div>
              </Field>
              <Field label="Carrera de ingeniería" icon={BookOpen} error={errors.carrera}>
                <div style={{ position: "relative" }}>
                  <select defaultValue="" className={`rf-select rf-input${errors.carrera ? " err" : ""}`} style={{ ...inputStyle(!!errors.carrera, true), cursor: "pointer", color: watch("carrera") ? "#111827" : "#9CA3AF" }} {...register("carrera", { required: "Selecciona tu carrera" })}>
                    <option value="" disabled hidden>Selecciona tu carrera</option>
                    <option value={CARRERAS[0]} style={{ color: "#111827" }}>{CARRERAS[0]}</option>
                    <option disabled style={{ color: "#9CA3AF", fontStyle: "italic" }}>Próximamente más carreras...</option>
                  </select>
                  <ChevronDown size={16} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} />
                </div>
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Teléfono Celular" icon={Phone} error={errors.telefono}>
                  <input type="text" inputMode="numeric" autoComplete="tel" maxLength={9} className={`rf-input${errors.telefono ? " err" : ""}`} style={inputStyle(!!errors.telefono)}
                    {...register("telefono", { required: "El celular es obligatorio", validate: { format: (v) => PHONE_RE.test(v.trim()) || "Formato inválido" }, onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 9); } })} />
                </Field>
                <Field label="Código de estudiante" icon={BadgeInfo} error={errors.codigoEstudiante}>
                  <input type="text" maxLength={9} className={`rf-input${errors.codigoEstudiante ? " err" : ""}`} style={inputStyle(!!errors.codigoEstudiante)}
                    {...register("codigoEstudiante", { required: "El código de estudiante es obligatorio", minLength: { value: 9, message: "Debe tener exactamente 9 caracteres" }, maxLength: { value: 9, message: "Debe tener exactamente 9 caracteres" }, validate: { format: (v) => CODIGO_RE.test(v.trim()) || "Formato inválido" }, onChange: (e) => { e.target.value = e.target.value.replace(/[\s-]/g, "").toUpperCase(); } })} />
                </Field>
              </div>
            </motion.div>
          )}

          {step === 2 && !EMAIL_VERIFICATION_ENABLED && !esEstudiante && (
            <motion.div key="step2-mype" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Field label="Rubro del negocio" icon={Briefcase} error={errors.rubro}>
                <div style={{ position: "relative" }}>
                  <select defaultValue="" className={`rf-select rf-input${errors.rubro ? " err" : ""}`} style={{ ...inputStyle(!!errors.rubro, true), cursor: "pointer", color: watch("rubro") ? "#111827" : "#9CA3AF" }} {...register("rubro", { required: "Selecciona el rubro de tu negocio" })}>
                    <option value="" disabled hidden>Selecciona tu rubro</option>
                    {RUBROS.map(r => <option key={r} value={r} style={{ color: "#111827" }}>{r}</option>)}
                  </select>
                  <ChevronDown size={16} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} />
                </div>
              </Field>
              <Field label="Teléfono Celular" icon={Phone} error={errors.telefono}>
                <input type="text" inputMode="numeric" autoComplete="tel" maxLength={9} className={`rf-input${errors.telefono ? " err" : ""}`} style={inputStyle(!!errors.telefono)}
                  {...register("telefono", { required: "El celular es obligatorio", validate: { format: (v) => PHONE_RE.test(v.trim()) || "Formato inválido" }, onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 9); } })} />
              </Field>
            </motion.div>
          )}

          {/* ── PASO 4: VERIFICACIÓN OTP ────────────────────────────────── */}
          {EMAIL_VERIFICATION_ENABLED && step === 3 && (
            <motion.div key="step3-otp" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                <Mail size={28} color="#1B6FE8" />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F1F3D", marginBottom: 8 }}>Verifica tu correo</h3>
                <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>Enviamos un código de 6 dígitos a <strong>{watch("email")}</strong></p>
              </div>

              {!otpEnviado ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                  style={{
                    width: "100%",
                    height: 48,
                    border: "none",
                    borderRadius: 8,
                    background: sendingOtp ? "#D1D5DB" : "linear-gradient(135deg, #1B6FE8 0%, #0E54C4 100%)",
                    color: "white",
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: sendingOtp ? "not-allowed" : "pointer",
                    fontFamily: "Arial, sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  {sendingOtp ? <><Loader2 size={18} className="animate-spin" /> Enviando...</> : "Enviar código de verificación"}
                </button>
              ) : (
                <>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center" }} onPaste={handleOtpPaste}>
                    {otp.map((digit, index) => (
                      <input key={index} ref={el => otpRefs.current[index] = el} type="text" inputMode="numeric" maxLength={1} value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(index, e)} disabled={isLoading}
                        autoFocus={index === 0}
                        style={{ width: 48, height: 56, textAlign: "center", fontSize: 22, fontWeight: 700, border: `1.5px solid ${otpErrorLocal ? "#FCA5A5" : "#E5E7EB"}`, borderRadius: 8, background: otpErrorLocal ? "#FFF5F5" : "white", color: "#0F1F3D", fontFamily: "Arial, sans-serif", outline: "none", transition: "all 0.2s ease" }} />
                    ))}
                  </div>

                  {/* 🔥 SOLO UN MENSAJE DE ERROR */}
                  {otpErrorLocal && <p style={{ fontSize: 13, color: "#EF4444", margin: 0 }}>{otpErrorLocal}</p>}

                  {/* 🔥 CONTADOR SIEMPRE visible cuando hay tiempo, incluso si hay error */}
                  {otpExpirySeconds > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: otpExpirySeconds < 60 ? "#EF4444" : "#6B7280", fontWeight: 500 }}>
                      <Clock size={14} color={otpExpirySeconds < 60 ? "#EF4444" : "#6B7280"} />
                      <span>
                        El código expira en{" "}
                        <strong style={{ color: otpExpirySeconds < 60 ? "#DC2626" : "#0F1F3D" }}>
                          {Math.floor(otpExpirySeconds / 60)}:{String(otpExpirySeconds % 60).padStart(2, "0")}
                        </strong>
                      </span>
                    </div>
                  )}
                  
                  {/* 🔥 Botón "Reenviar código" SIEMPRE visible cuando no hay tiempo */}
                  {otpExpirySeconds === 0 && (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={otpSending}
                      style={{
                        background: "none",
                        border: "none",
                        color: otpSending ? "#9CA3AF" : "#1B6FE8",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: otpSending ? "not-allowed" : "pointer",
                        fontFamily: "Arial, sans-serif",
                        padding: "4px 8px",
                        marginTop: 4,
                      }}
                    >
                      {otpSending ? <Loader2 size={14} className="animate-spin" /> : "Reenviar código"}
                    </button>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Backend error display - solo si no hay errores de campo específicos */}
        <AnimatePresence>
          {showBackendError && backendError && 
            !errors.dni && !errors.ruc && !errors.email && !errors.codigoEstudiante && !errors.telefono && 
            !backendError.toLowerCase().includes("otp") && 
            !backendError.toLowerCase().includes("código de verificación") && (
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
                fontSize: 13, color: "#EF4444",
                fontWeight: 500, fontFamily: "inherit"
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} /> {backendError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Términos y Condiciones (solo paso final) ── */}
        {(EMAIL_VERIFICATION_ENABLED ? step === 3 : step === 2) && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <input
              type="checkbox"
              checked={hasAcceptedTerms}
              readOnly
              onClick={() => { if (!hasAcceptedTerms) onOpenTerms(); }}
              style={{
                width: 16, height: 16,
                cursor: "pointer", accentColor: "#1B6FE8", flexShrink: 0,
              }}
              
            />
            
            <p style={{ margin: 0, fontFamily: "inherit", fontSize: 13, color: "#4B5563", lineHeight: 1.55 }}>
              He leído y acepto los{" "}
              <button
                type="button"
                onClick={onOpenTerms}
                style={{
                  background: "none", border: "none", padding: 0,
                  color: "#1B6FE8", textDecoration: "underline",
                  fontWeight: 600, cursor: "pointer",
                  fontSize: 13, fontFamily: "inherit",
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

          {step < TOTAL_STEPS - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isNextDisabled}
              style={{
                flex: 1,
                height: 52,
                borderRadius: 12,
                border: "none",
                color: "white",
                background: (isLoading || isValidating || !isCurrentStepValid)
                  ? "#D1D5DB"
                  : `linear-gradient(135deg, ${colorTema} 0%, ${colorTema === "#1B6FE8" ? "#0E54C4" : "#DC4A00"} 100%)`,
                cursor: (isLoading || isValidating || !isCurrentStepValid) ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                fontWeight: 600,
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "transform 0.2s, box-shadow 0.2s, opacity 0.2s",
                boxShadow: (isLoading || isValidating || !isCurrentStepValid) ? "none" : `0 4px 12px ${colorTema}40`,
              }}
              onMouseEnter={e => {
                if (!isLoading && !isValidating && isCurrentStepValid) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 8px 20px ${colorTema}60`;
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = (isLoading || isValidating || !isCurrentStepValid) ? "none" : `0 4px 12px ${colorTema}40`;
              }}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
              {isLoading ? "Procesando..." : "Continuar"}
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading || !canSubmit}
              style={{
                flex: 1,
                height: 52,
                borderRadius: 12,
                border: "none",
                color: "white",
                background: (!canSubmit || isLoading) ? "#D1D5DB" : (esEstudiante ? "linear-gradient(135deg,#1B6FE8,#0E54C4)" : "linear-gradient(135deg,#F97316,#DC4A00)"),
                cursor: (!canSubmit || isLoading) ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                fontWeight: 600,
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 0.2s",
                boxShadow: (!canSubmit || isLoading) ? "none" : `0 4px 12px ${esEstudiante ? "#1B6FE8" : "#F97316"}40`,
              }}
              onMouseEnter={e => {
                if (!isLoading && canSubmit) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 8px 20px ${esEstudiante ? "#1B6FE8" : "#F97316"}60`;
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = (!canSubmit || isLoading) ? "none" : `0 4px 12px ${esEstudiante ? "#1B6FE8" : "#F97316"}40`;
              }}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
              {isLoading ? "Registrando..." : "Crear cuenta"}
            </button>
          )}
        </div>
      </form>
    </>
  );
}