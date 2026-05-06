// src/features/auth-register/RegisterForm.jsx
import { useForm } from "react-hook-form";
import { Button } from "@shared/ui/Button";
import { useRegister } from "./useRegister";

// tipo = "estudiante" o "mype"
export function RegisterForm({ tipo }) {
  const { register: registerUser, isLoading, error } = useRegister(tipo);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => registerUser(data);

  const esEstudiante = tipo === "estudiante";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nombre completo — ambos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre completo
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("nombre", { required: "El nombre es obligatorio" })}
        />
        {errors.nombre && (
          <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>
        )}
      </div>

      {/* Email — ambos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Correo electrónico
        </label>
        <input
          type="email"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("email", {
            required: "El email es obligatorio",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Email inválido",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password — ambos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <input
          type="password"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("password", {
            required: "La contraseña es obligatoria",
            minLength: { value: 6, message: "Mínimo 6 caracteres" },
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Campos solo para ESTUDIANTE */}
      {esEstudiante && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Universidad
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="Universidad Privada del Norte"
              {...register("universidad")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carrera
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="Ingeniería de Sistemas Computacionales"
              {...register("carrera")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código de estudiante
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ejm: N00000000"
              {...register("codigoEstudiante")}
            />
          </div>
        </>
      )}

      {/* Campos solo para MYPE */}
      {!esEstudiante && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre comercial
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Pollería El Sabrosón"
              {...register("nombreComercial", {
                required: "El nombre comercial es obligatorio",
              })}
            />
            {errors.nombreComercial && (
              <p className="text-red-500 text-xs mt-1">
                {errors.nombreComercial.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rubro
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Gastronomía, Retail, Servicios"
              {...register("rubro")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RUC
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="20123456789"
              {...register("ruc")}
            />
          </div>
        </>
      )}

      {/* Error del backend */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Registrando..." : "Crear cuenta"}
      </Button>
    </form>
  );
}
