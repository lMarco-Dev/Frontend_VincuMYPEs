import { Link } from "react-router-dom";
import { Button } from "@shared/ui/Button";
import { Logo } from "@shared/ui/Logo";
import {
  Building2,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <Logo />
        <div className="flex gap-4 items-center">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link to="/register/mype">
            <Button
              variant="primary"
              className="shadow-md hover:shadow-lg transition-all"
            >
              Registrar mi Empresa
            </Button>
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8">
          <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
          Conectando el talento de ingeniería en Cajamarca
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight max-w-4xl">
          El puente entre{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
            MYPEs
          </span>{" "}
          y{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-pink-500">
            Estudiantes
          </span>
        </h1>

        <p className="text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed">
          Publica los desafíos tecnológicos de tu negocio o únete a proyectos
          reales para ganar experiencia y armar tu portafolio profesional.
        </p>

        {/* BOTONES LADO A LADO */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md mx-auto">
          <Link to="/register/estudiante" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full h-14 px-8 text-lg border-2 flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <GraduationCap className="w-5 h-5" />
              Soy Estudiante
            </Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button
              variant="primary"
              className="w-full h-14 px-8 text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
            >
              Iniciar Sesión
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* SECCIÓN: ¿CÓMO FUNCIONA? */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Por qué usar VincuMYPEs?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Match Inteligente",
                desc: "Nuestro algoritmo conecta tus habilidades exactas con la empresa correcta.",
              },
              {
                title: "Experiencia Real",
                desc: "Deja la teoría y construye software que resuelve problemas del mundo real.",
              },
              {
                title: "Certificación",
                desc: "Obtén certificados digitales verificables con SHA-256 al terminar cada proyecto.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors"
              >
                <CheckCircle2 className="w-8 h-8 text-success mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN: MYPES ASOCIADAS */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center px-6">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">
            Empresas que confían en el talento local
          </p>
          <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 text-2xl font-black text-gray-800">
              <Building2 /> Michi Café
            </div>
            <div className="flex items-center gap-2 text-2xl font-black text-gray-800">
              <Building2 /> EMSI S.A.C.
            </div>
            <div className="flex items-center gap-2 text-2xl font-black text-gray-800">
              <Building2 /> Movietime
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
