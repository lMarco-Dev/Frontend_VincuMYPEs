// src/entities/student/StudentCard.jsx

import { Card } from "@shared/ui/Card"
import { UserAvatar } from "@entities/user/UserAvatar"

export function StudentCard({ estudiante }) {
  return (
    <Card className="p-5">
      {/* Fila superior: avatar + nombre */}
      <div className="flex items-center gap-3 mb-3">
        <UserAvatar
          avatarUrl={estudiante.usuario?.foto_perfil}
          name={estudiante.usuario?.nombre}
          size="md"
        />
        <div>
          <h3 className="font-semibold text-gray-900">
            {estudiante.usuario?.nombre}
          </h3>
          <p className="text-xs text-gray-500">{estudiante.carrera}</p>
        </div>
      </div>

      {/* Universidad */}
      <p className="text-sm text-gray-500 mb-2">{estudiante.universidad}</p>

      {/* Bio — solo si existe */}
      {estudiante.bio && (
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {estudiante.bio}
        </p>
      )}

      {/* Skills */}
      {estudiante.skills && (
        <p className="text-xs text-gray-400">
          <span className="font-medium">Skills: </span>
          {estudiante.skills}
        </p>
      )}
    </Card>
  )
}