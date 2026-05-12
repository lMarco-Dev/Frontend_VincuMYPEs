import { CrearProyectoForm } from "@/features/proyecto-create/CrearProyectoForm";
import { Logo } from "@/shared/ui/Logo";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function CrearProyectoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <Link
          to="/dashboard/mype"
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Logo />
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-700">
            Publicar nuevo proyecto
          </h1>
          <p className="text-gray-500 mt-1">Describe tu problematica</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <CrearProyectoForm />
      </div>
    </div>
  );
}
