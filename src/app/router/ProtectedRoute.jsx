import { useUserStore } from "@/entities/user/userStore";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children, rolesPermitidos }) {
  const { user, isAuthenticated } = useUserStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (rolesPermitidos && !rolesPermitidos.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
