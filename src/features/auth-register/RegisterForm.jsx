// src/features/auth-register/RegisterForm.jsx
import { useForm } from "react-hook-form";
import { Button } from "@shared/ui/Button";
import { useRegister } from "./useRegister";
import {
  User,
  Mail,
  Lock,
  Building2,
  Briefcase,
  FileText,
  GraduationCap,
  BookOpen,
  BadgeInfo,
  AlertCircle,
  CheckCircle,
  ChevronDown, // <-- Faltaba importar este ícono
} from "lucide-react";

const UNIVERSIDADES = [
  "Universidad Nacional de Cajamarca (UNC)",
  "Universidad Privada del Norte (UPN)",
];

const CARRERAS_INGENIERIA = [
  "Ingeniería de Sistemas",
  "Ingeniería de Minas",
  "Ingeniería Civil",
  "Ingeniería Industrial",
  "Ingeniería Geológica",
  "Ingeniería Ambiental",
  "Ingeniería Hidráulica",
  "Ingeniería de Industrias Alimentarias",
];

const InputWrapper = ({ icon: Icon, label, error, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all bg-gray-50 focus:bg-white
            ${error ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-primary/20 focus:border-primary"}`}
        {...props}
      />
    </div>
    {error && (
      <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {error.message}
      </p>
    )}
  </div>
);

const SelectWrapper = ({ icon: Icon, label, options, error, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <select
        className={`w-full appearance-none border rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all bg-gray-50 focus:bg-white cursor-pointer
            ${error ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-primary/20 focus:border-primary"}`}
        {...props}
      >
        <option value="">Selecciona una opción</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {/* Ícono de flechita hacia abajo personalizado */}
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </div>
    </div>
    {error && (
      <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {error.message}
      </p>
    )}
  </div>
);

// tipo = "estudiante" o "mype"
export function RegisterForm({ tipo }) {
  const {
    register: registerUser,
    isLoading,
    error: backendError,
  } = useRegister(tipo);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => registerUser(data);

  const esEstudiante = tipo === "estudiante";

  const passwordActual = watch("password", "");
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 1. Nombre completo*/}
      <InputWrapper
        icon={User}
        label="Nombre Completo"
        placeholder="Ej. Juan Perez"
        {...register("nombre", {
          required: "El nombre es obligatorio",
          minLength: { value: 5, message: "Debe tener al menos 5" },
          pattern: {
            value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
            message: "Solo se permiten letras",
          },
        })}
        error={errors.nombre}
      />

      {/* 2. EMAIL */}
      <InputWrapper
        icon={Mail}
        type="email" // CORRECCIÓN: type="email" en lugar de type={email}
        label="Correo Electrónico"
        placeholder="usuario@gmail.com"
        {...register("email", {
          required: "El correo es obligatorio",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Ingresa un formato válido",
          },
        })}
        error={errors.email}
      />

      {/* 3. CONTRASEÑA (Alta seguridad) */}
      <InputWrapper
        icon={Lock}
        type="password"
        label="Contraseña"
        placeholder="••••••••••"
        {...register("password", {
          required: "La contraseña es obligatoria",
          pattern: {
            value: passwordRegex,
            message:
              "Debe incluir: 8 chars, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo (@$!%*?&)",
          },
        })}
        error={errors.password}
      />

      {/* 4. CONFIRMAR CONTRASEÑA */}
      <InputWrapper
        icon={CheckCircle}
        type="password"
        label="Confirmar contraseña"
        placeholder="••••••••••"
        {...register("confirmPassword", {
          required: "Debes confirmar tu contraseña",
          validate: (value) =>
            value === passwordActual || "Las contraseñas no coinciden",
        })}
        error={errors.confirmPassword}
      />

      {/* ================= CAMPOS DE ESTUDIANTE ================= */}
      {esEstudiante && (
        <div className="pt-4 border-t border-gray-100 space-y-4">
          <SelectWrapper
            icon={GraduationCap}
            label="Universidad"
            options={UNIVERSIDADES}
            {...register("universidad", {
              required: "Este campo es obligatorio",
            })}
            error={errors.universidad}
          />
          <SelectWrapper
            icon={BookOpen}
            label="Carrera"
            options={CARRERAS_INGENIERIA}
            {...register("carrera", { required: "Este campo es obligatorio" })}
            error={errors.carrera}
          />
          <InputWrapper
            icon={BadgeInfo}
            label="Código de estudiante"
            placeholder="Ej: N00012345"
            maxLength={10}
            {...register("codigoEstudiante", {
              required: "El código es obligatorio",
              maxLength: {
                value: 10,
                message: "No puedes exceder los 10 caracteres",
              },
              pattern: {
                value: /^[A-Za-z0-9]{5,10}$/,
                message: "Formato de código inválido (sin guiones ni espacios)",
              },
            })}
            error={errors.codigoEstudiante}
          />
        </div>
      )}

      {/* ================= CAMPOS DE MYPE ================= */}
      {!esEstudiante && (
        <div className="pt-4 border-t border-gray-100 space-y-4">
          <InputWrapper
            icon={Building2}
            label="Nombre comercial"
            placeholder="Ej: Pollería El Sabrosón"
            {...register("nombreComercial", {
              required: "El nombre de la empresa es obligatorio",
              minLength: { value: 2, message: "Mínimo 2 caracteres" },
            })}
            error={errors.nombreComercial}
          />
          <InputWrapper
            icon={Briefcase}
            label="Rubro"
            placeholder="Ej: Gastronomía, Retail"
            {...register("rubro", { required: "El rubro es obligatorio" })}
            error={errors.rubro}
          />
          <InputWrapper
            icon={FileText}
            label="RUC"
            placeholder="20123456789"
            {...register("ruc", {
              required: "El RUC es obligatorio",
              pattern: {
                value: /^(10|20)\d{9}$/,
                message:
                  "RUC inválido. Debe tener 11 dígitos y empezar con 10 o 20",
              },
            })}
            error={errors.ruc}
          />
        </div>
      )}

      {/* ERRORES DEL BACKEND */}
      {backendError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm text-center font-medium">
            {backendError}
          </p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-12 text-base rounded-xl mt-4 shadow-lg shadow-primary/20"
        disabled={isLoading}
      >
        {isLoading ? "Validando y Registrando..." : "Crear cuenta"}
      </Button>
    </form>
  );
}
