// src/app/providers/AuthProvider.jsx
import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import { tokenStorage } from "@shared/api/tokenStorage";
import { decodeJwt, isTokenExpired } from "@/shared/lib/jwt";
import { httpClient } from "@/shared/api/httpClient";

export function AuthProvider({ children }) {
  const { setUser, logout } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const inactivityTimer = useRef(null);
  const profileRefreshInterval = useRef(null);

  // Restaurar sesión al cargar la página
  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    const refreshToken = tokenStorage.getRefreshToken();

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

    // Restaurar estado básico
    setUser({ token, id: decoded.sub, rol: decoded.rol, refreshToken });

    // Cargar perfil completo desde el backend
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
          refreshToken,
        });
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setIsInitializing(false);
      });
  }, [setUser, logout]);

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      logout();
      tokenStorage.clearTokens();
      window.location.href = "/login";
    }, 30 * 60 * 1000);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach(event => window.addEventListener(event, resetInactivityTimer));
    resetInactivityTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetInactivityTimer));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, []);

  // Refrescar perfil cada 5 minutos (si hay token)
  useEffect(() => {
    if (!tokenStorage.getAccessToken()) return;
    profileRefreshInterval.current = setInterval(() => {
      httpClient.get("/usuarios/me")
        .then(({ data }) => {
          setUser({
            token: tokenStorage.getAccessToken(),
            id: data.id,
            nombre: data.nombre,
            email: data.email,
            rol: data.rol,
            telefono: data.telefono,
            fotoPerfil: data.fotoPerfil,
            refreshToken: tokenStorage.getRefreshToken(),
          });
        })
        .catch(() => {});
    }, 5 * 60 * 1000);

    return () => clearInterval(profileRefreshInterval.current);
  }, [setUser]);

  if (isInitializing) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return children;
}