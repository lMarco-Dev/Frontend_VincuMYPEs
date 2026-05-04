// src/app/providers/AuthProvider.jsx
import { useEffect, useState } from "react";
import { useUserStore } from "@entities/user/userStore";
import { tokenStorage } from "@shared/api/tokenStorage";

function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

// Esta función verifica si el token ya expiró
function tokenExpirado(decoded) {
  if (!decoded?.exp) return true;
  return decoded.exp * 1000 < Date.now();
}

export function AuthProvider({ children }) {
  const { setUser, logout } = useUserStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const token = tokenStorage.getAccessToken();

    if (token) {
      const decoded = decodeToken(token);

      // Si el token expiró o está corrupto, limpiamos todo
      if (!decoded || tokenExpirado(decoded)) {
        logout();
      } else {
        // El token es válido — restauramos la sesión
        // Spring Security guarda el subject (sub) como el email o ID del usuario
        setUser({
          token: token,
          id: decoded.sub,
          rol: decoded.rol ?? decoded.role ?? decoded.authorities,
        });
      }
    }

    setIsInitializing(false);
  }, [setUser, logout]);

  if (isInitializing) return <div className="h-screen bg-gray-50"></div>;

  return children;
}
