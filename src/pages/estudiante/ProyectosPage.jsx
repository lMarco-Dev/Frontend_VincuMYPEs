// src/pages/estudiante/ProyectosPage.jsx
import { ProyectoCard } from "@entities/proyecto/ProyectoCard";
import { ApplyButton } from "@features/proyecto-apply/ApplyButton";

export function ProyectosPage({ proyectos }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {proyectos.map((proyecto) => (
        <div key={proyecto.id} className="relative">
          {/* 1. La Entidad (Muestra los datos) */}
          <ProyectoCard proyecto={proyecto} />

          {/* 2. El Feature (La acción de negocio) */}
          <div className="mt-2">
            <ApplyButton proyectoId={proyecto.id} />
          </div>
        </div>
      ))}
    </div>
  );
}
