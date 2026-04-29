// src/entities/proyecto/AreaBadge.jsx

import { Badge } from "@shared/ui/Badge"
import { AREA_SISTEMAS_LABELS } from "./proyecto.constants"

// Muestra el área de sistemas con texto legible
// Recibe: area = "DESARROLLO_WEB", "BASE_DE_DATOS", etc.
export function AreaBadge({ area }) {
  return (
    <Badge variant="gray">
      {AREA_SISTEMAS_LABELS[area] ?? area}
    </Badge>
  )
}