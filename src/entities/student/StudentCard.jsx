// src/entities/student/StudentCard.jsx

import { Card } from "@shared/ui/Card";
import { UserAvatar } from "@entities/user/UserAvatar";

export function StudentCard({ estudiante }) {
  if (!estudiante) return null;

  const nombre = estudiante.usuario?.nombre || "Usuario desconocido";
  const foto = estudiante.usuario?.foto_perfil;
  const carrera = estudiante.carrera || "Carrera no especificada";
  const universidad = estudiante.universidad || "Universidad no especificada";

  return (
    <Card className="p-5">
      {/* Fila superior: avatar + nombre */}
      <div className="flex items-center gap-3 mb-3">
        <UserAvatar avatarUrl={foto} name={nombre} size="md" />
        <div>
          <h3 className="font-semibold text-gray-900">{nombre}</h3>
          <p className="text-xs text-gray-500">{carrera}</p>
        </div>
      </div>

      {/* Universidad */}
      <p className="text-sm text-gray-500 mb-2">{universidad}</p>

      {/* Bio — solo si existe */}
      {estudiante.bio && (
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {estudiante.bio}
        </p>
      )}

      {/* Skills */}
      {estudiante.skills && estudiante.skills.length > 0 && (
        <p className="text-xs text-gray-400">
          <span className="font-medium text-gray-700">Skills: </span>
          {/* Si skills es un arreglo en BD, hacemos join. Si es string, lo pinta directo */}
          {Array.isArray(estudiante.skills)
            ? estudiante.skills.join(", ")
            : estudiante.skills}
        </p>
      )}
    </Card>
  );
}
