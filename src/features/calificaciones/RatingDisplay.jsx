import { Star } from "lucide-react";
import { useRating } from "./useRating";

export default function RatingDisplay({ usuarioId, size = "md" }) {
  const { rating, isLoading, isForbidden, error } = useRating(usuarioId);

  if (isLoading || isForbidden) return null;
  if (error && error.response?.status !== 403) return null;
  if (!rating || !rating.promedio || rating.cantidad === 0) {
    return (
      <span style={{ fontSize: size === "sm" ? 11 : 12, color: "#9ca3af", fontStyle: "italic" }}>
        Sin calificaciones
      </span>
    );
  }

  const { promedio, cantidad } = rating;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: size === "sm" ? 11 : 13,
        fontWeight: 600,
        color: "#374151",
      }}
    >
      <Star size={size === "sm" ? 12 : 14} fill="#facc15" color="#facc15" />
      {promedio.toFixed(1)}{" "}
      <span style={{ fontWeight: 400, color: "#6b7280" }}>
        · {cantidad} calificación{cantidad !== 1 ? "es" : ""}
      </span>
    </span>
  );
}