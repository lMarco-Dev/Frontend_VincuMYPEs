// src/entities/user/RoleBadge.jsx

import { Badge } from "@shared/ui/Badge"
import { ROLE_LABELS, ROLE_COLORS } from "./user.constants"

// Recibe el rol como string ("ROLE_MYPE", "ROLE_ESTUDIANTE", etc.)
export function RoleBadge({ role }) {

  return (
    <Badge variant={ROLE_COLORS[role] ?? "gray"}>
      {ROLE_LABELS[role] ?? role}
    </Badge>
  )
}