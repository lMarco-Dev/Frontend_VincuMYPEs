import { useForm } from "react-hook-form";
import { Button } from "@shared/ui/Button";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { useLogin } from "./useLogin";

// =========================================================================
// WRAPPER EXTERNO (Para evitar re-renders y bug de foco)
// =========================================================================
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
          ${
            error
              ? "border-red-400 focus:ring-red-400"
              : "border-gray-300 focus:ring-primary/20 focus:border-primary"
          }`}
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

// =========================================================================
// COMPONENTE PRINCIPAL
// =========================================================================
export function LoginForm() {
  const { login, isLoading, error: backendError } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => login(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* 1. CORREO ELECTRÓNICO */}
      <InputWrapper
        icon={Mail}
        type="email"
        label="Correo Electrónico"
        placeholder="usuario@email.com"
        {...register("email", {
          required: "El email es obligatorio",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Email inválido",
          },
        })}
        error={errors.email}
      />

      {/* 2. CONTRASEÑA */}
      <InputWrapper
        icon={Lock}
        type="password"
        label="Contraseña"
        placeholder="••••••••••"
        {...register("password", {
          required: "La contraseña es obligatoria",
          minLength: { value: 6, message: "Mínimo 6 caracteres" },
        })}
        error={errors.password}
      />

      {/* 3. ERRORES DEL BACKEND */}
      {backendError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm text-center font-medium">
            {backendError}
          </p>
        </div>
      )}

      {/* 4. BOTÓN SUBMIT */}
      <Button
        type="submit"
        className="w-full h-12 text-base rounded-xl mt-2 shadow-lg shadow-primary/20"
        disabled={isLoading}
      >
        {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>
    </form>
  );
}
