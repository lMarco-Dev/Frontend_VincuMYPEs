import { useMantenimientoEstado } from "@/features/mantenimiento/useMantenimientoEstado";
import { useAuthStore } from "@/store/authStore";
import MaintenanceScreen from "@/pages/mantenimiento/MaintenanceScreen";

/**
 * Envuelve la aplicación y decide si renderizar el contenido normal
 * o la pantalla de mantenimiento.
 *
 * Reglas:
 * - Si NO está en mantenimiento → renderiza children.
 * - Si SÍ está en mantenimiento y el usuario es admin → renderiza children
 *   (admin debe poder seguir operando para desactivar el modo).
 * - En cualquier otro caso (no logueado, mype, estudiante) → muestra pantalla.
 */
export function MaintenanceGate({ children }) {
  const { estaEnMantenimiento, isLoading } = useMantenimientoEstado();
  const { rol } = useAuthStore();

  const esAdmin = rol === "ADMIN" || rol === "ROLE_ADMIN";

  // Mientras carga la primera vez, dejamos pasar (evita flash de pantalla).
  if (isLoading) return children;

  if (estaEnMantenimiento && !esAdmin) {
    return <MaintenanceScreen />;
  }

  return children;
}