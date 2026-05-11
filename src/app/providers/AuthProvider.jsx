import { useEffect, useState } from "react";
import { useUserStore } from "@entities/user/userStore";
import { tokenStorage } from "@shared/api/tokenStorage";
import { decodeJwt, isTokenExpired } from "@/shared/lib/jwt";
import { httpClient } from "@/shared/api/httpClient";

export function AuthProvider({ children }) {
  const { setUser, logout } = useUserStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const token = tokenStorage.getAccessToken();

    if (!token) {
      setIsInitializing(false);
      return;
    }

    const decoded = decodeJwt(token);
    if (!decoded || isTokenExpired(decoded)) {
      logout();
      setIsInitializing(false);
      return;
    }

    setUser({ token, id: decoded.sub, rol: decoded.rol });

    httpClient
      .get("/usuarios/me")
      .then(({ data }) => {
        setUser({
          token,
          id: data.id,
          nombre: data.nombre,
          email: data.email,
          rol: data.rol,
          telefono: data.telefono,
          fotoPerfil: data.fotoPerfil,
        });
      })
      .catch(() => logout())
      .finally(() => setIsInitializing(false));
  }, [setUser, logout]);

  //Skeleton elegante
  if (isInitializing)
    return (
      <div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );

  return children;
}
