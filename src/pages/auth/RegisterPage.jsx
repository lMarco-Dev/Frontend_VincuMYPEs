import { useParams, Link } from "react-router-dom";
import { RegisterForm } from "@features/auth-register/RegisterForm";
import { Logo } from "@shared/ui/Logo";

export function RegisterPage() {
  const { tipo } = useParams();
  const esEstudiante = tipo === "estudiante";

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
          Únete como{" "}
          <span className="font-bold text-primary">
            {esEstudiante ? "Estudiante" : "MYPE"}
          </span>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-8 px-4 shadow-2xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          <RegisterForm tipo={tipo} />

          <div className="mt-6 text-center">
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
