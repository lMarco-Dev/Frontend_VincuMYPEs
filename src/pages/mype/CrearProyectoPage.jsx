// src/pages/mype/CrearProyectoPage.jsx
import { MypeLayout } from "@shared/layouts/MypeLayout";
import { CrearProyectoForm } from "@/features/proyecto-create/CrearProyectoForm";

export function CrearProyectoPage() {
  return (
    <MypeLayout titulo="Publicar nuevo proyecto">
      <div className="max-w-2xl mx-auto lg:mx-0">
        <p className="text-sm text-slate-400 font-light mb-6">
          Describe la problemática o requerimiento tecnológico de tu negocio para que los estudiantes de Ingeniería de Sistemas de la UPN puedan postular con soluciones.
        </p>
        
        {/* Contenedor del Asistente */}
        <div className="bg-[#0F2A4A] rounded-xl border border-slate-700/50 p-8 shadow-xl">
          <CrearProyectoForm />
        </div>
      </div>
    </MypeLayout>
  );
}