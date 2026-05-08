import { useParams, Link, useNavigate } from "react-router-dom";
import { RegisterForm } from "@features/auth-register/RegisterForm";
import { Logo } from "@shared/ui/Logo";
import { GraduationCap, Building2 } from "lucide-react";

export function RegisterPage() {
  const { tipo } = useParams();
  const navigate = useNavigate();

  //Validamos el tipo.
  const currentTipo = tipo === "mype" ? "mype" : "estudiante";
  const esEstudiante = currentTipo === "estudiante";

  //Función que se ejecuta al cambiar de tipo
  const handleToggle = (nuevoTipo) => {
    navigate(`/register/${nuevoTipo}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center mb-4">
          <Link to="/">
            <Logo className="scale-125" />
          </Link>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Crea tu cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Únete a VincuMYPEs hoy mismo
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-8 px-4 shadow-2xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          {/* ==================================================== */}
          {/* TOGGLE ELEGANTE (Segmented Control)                  */}
          {/* ==================================================== */}
          <div className="flex p-1 mb-8 bg-gray-100/80 rounded-xl border border-gray-200/50">
            {/* Botón Estudiante */}
            <button
              type="button"
              onClick={() => handleToggle("estudiante")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                esEstudiante
                  ? "bg-white text-primary shadow-sm ring-1 ring-black/5" // Estado Activo
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50" // Estado Inactivo
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Estudiante
            </button>

            {/* Botón MYPE */}
            <button
              type="button"
              onClick={() => handleToggle("mype")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                !esEstudiante
                  ? "bg-white text-primary shadow-sm ring-1 ring-black/5" // Estado Activo
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50" // Estado Inactivo
              }`}
            >
              <Building2 className="w-4 h-4" />
              MYPE
            </button>
          </div>
          {/* ==================================================== */}

          {/* El formulario reaccionará automáticamente al cambio de 'currentTipo' */}
          <RegisterForm tipo={currentTipo} />

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary hover:text-primary-light hover:underline transition-colors"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
