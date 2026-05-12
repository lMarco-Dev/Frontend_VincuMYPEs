import { MypeLayout } from "./layout/MypeLayout";
import { CrearProyectoForm } from "@/features/proyecto-create/CrearProyectoForm";

export function CrearProyectoPage() {
  return (
    <MypeLayout titulo="Publicar nuevo proyecto">
      <div className="max-w-2xl">
        <p className="text-sm text-gray-500 mb-6">
          Describe la problemática de tu negocio
        </p>
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <CrearProyectoForm />
        </div>
      </div>
    </MypeLayout>
  );
}
