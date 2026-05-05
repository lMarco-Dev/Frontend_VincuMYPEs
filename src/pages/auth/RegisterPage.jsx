// src/pages/auth/RegisterPage.jsx
import { useParams, Link } from "react-router-dom";
import { RegisterForm } from "@features/auth-register/RegisterForm";

export function RegisterPage() {
  // La URL será /register/estudiante o /register/mype
  // useParams saca el valor de :tipo de la URL
  const { tipo } = useParams();

  const esEstudiante = tipo === "estudiante";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">VincuMYPEs</h1>
          <p className="text-gray-500 mt-2">
            {esEstudiante ? "Registro de Estudiante" : "Registro de Empresa"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <RegisterForm tipo={tipo} />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
