// src/entities/proyecto/ProyectoCard.jsx

import { Card } from "@shared/ui/Card";
import { ProyectoEstadoBadge } from "./ProyectoEstadoBadge";
import { AreaBadge } from "./AreaBadge";

export function ProyectoCard({ proyecto, onClick }) {
  return (
    <Card
      className="p-5 cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={onClick}
    >
      {/* Fila superior: área y estado */}
      <div className="flex items-center justify-between mb-3">
        <AreaBadge area={proyecto.areaSistemas} />
        <ProyectoEstadoBadge estado={proyecto.estado} />
      </div>

      {/* Título del proyecto */}
      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
        {proyecto.titulo}
      </h3>

      {/* Nombre de la empresa */}
      <p className="text-sm text-gray-500 mb-3">
        {proyecto.mypeNombre ?? "Empresa no disponible"}
      </p>

      {/* Descripción corta */}
      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
        {proyecto.descripcion}
      </p>

      {/* Fecha límite — solo se muestra si existe */}
      {proyecto.fechaLimite && (
        <p className="text-xs text-gray-400">
          Límite: {new Date(proyecto.fechaLimite).toLocaleDateString("es-PE")}
        </p>
      )}
    </Card>
  );
}
