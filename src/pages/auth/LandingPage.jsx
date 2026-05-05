// src/pages/auth/LandingPage.jsx
import { Link } from "react-router-dom";
import { Button } from "@shared/ui/Button";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary">VincuMYPEs</h1>
        <div className="flex gap-3">
          <Link to="/login">
            <Button variant="outline">Iniciar sesión</Button>
          </Link>
          <Link to="/register/estudiante">
            <Button>Soy Estudiante</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Conectamos MYPEs con{" "}
          <span className="text-primary">estudiantes de ingeniería</span>
        </h2>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Las empresas publican sus proyectos tecnológicos y los estudiantes los
          desarrollan, ganando experiencia real.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register/mype">
            <Button className="px-8 py-3 text-base">
              Registrar mi empresa
            </Button>
          </Link>
          <Link to="/proyectos">
            <Button variant="outline" className="px-8 py-3 text-base">
              Ver proyectos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
