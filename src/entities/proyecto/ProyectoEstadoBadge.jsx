// src/entities/proyecto/ProyectoEstadoBadge.jsx

import { Badge } from "@shared/ui/Badge"
import { PROYECTO_ESTADO_LABELS, PROYECTO_ESTADO_COLORS } from "./proyecto.constants"

// Exactamente igual que RoleBadge pero para estados de proyecto
// Recibe: estado = "PENDIENTE", "EN_DESARROLLO", etc.
export function ProyectoEstadoBadge({ estado }) {
  return (
    <Badge variant={PROYECTO_ESTADO_COLORS[estado] ?? "gray"}>
      {PROYECTO_ESTADO_LABELS[estado] ?? estado}
    </Badge>
  )
}