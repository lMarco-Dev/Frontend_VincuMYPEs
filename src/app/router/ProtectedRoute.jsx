import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export function ProtectedRoute({ children, rolesPermitidos }) {
  const { isAuthenticated, rol } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (rolesPermitidos) {
    // 1. Extraemos el rol (por si es un array tomamos el primer elemento)
    let rolActual = Array.isArray(rol) ? rol[0] : String(rol);
    
    // 2. Lo pasamos a mayúsculas y le quitamos el prefijo "ROLE_" por seguridad
    rolActual = rolActual.toUpperCase().replace("ROLE_", "");

    // 3. Normalizamos los roles permitidos a mayúsculas también
    const rolesPermitidosUpper = rolesPermitidos.map(r => r.toUpperCase());

    // 4. Verificamos
    if (!rolesPermitidosUpper.includes(rolActual)) {
      console.warn(`🛑 Acceso denegado. 
      Rol en store: ${JSON.stringify(rol)} 
      Rol normalizado: ${rolActual} 
      Permitidos: ${rolesPermitidosUpper.join(", ")}`);
      
      return <Navigate to="/" replace />;
    }
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;