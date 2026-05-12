import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { tokenStorage } from "@shared/api/tokenStorage";
import { decodeJwt, isTokenExpired } from "@shared/lib/jwt";

export function AuthProvider({ children }) {
  const { setUser, logout } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      const decoded = decodeJwt(token);

      if (!decoded || isTokenExpired(decoded)) {
        logout();
      } else {
        // El token es válido — restauramos la sesión
        setUser({
          token: token,
          id: decoded.sub,
          role: decoded.rol ?? decoded.role ?? decoded.authorities,
        });
      }
    }
    setTimeout(() => setIsInitializing(false), 0);
  }, [setUser, logout]);

  if (isInitializing)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );

  return children;
}
