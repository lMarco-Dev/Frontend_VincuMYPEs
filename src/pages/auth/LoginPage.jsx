import { LoginForm } from "@/features/auth-login/LoginForm";
import { Link } from "react-router-dom";

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">VincuMYPEs</h1>
          <p className="text-gray-500 mt-2">Inicia sesión en tu cuenta</p>
        </div>

        {/* Cards */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <LoginForm />

          {/* Registro */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-500">¿No tienes cuenta?</p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/register/estudiante"
                className="text-sm text-blue-600 hover:underline"
              >
                Registrarme como ESTUDIANTE
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                to="/register/mype"
                className="text-sm text-blue-600 hover:underline"
              >
                Registrar mi Empresa
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
