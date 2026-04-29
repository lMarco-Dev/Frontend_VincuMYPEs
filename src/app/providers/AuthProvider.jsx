import { useEffect, useState } from "react";
import { useUserStore } from "@entities/user/userStore";
import { tokenStorage } from "@shared/api/tokenStorage";

export function AuthProvider({ children }) {
  const { setUser } = useUserStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Al recargar la página, miramos si hay un token guardado
    const token = tokenStorage.getAccessToken();

    if (token) {
      // 💡 Nota: En la Fase 3, aquí decodificaremos el JWT para sacar el ID y Rol real
      setUser({ token: token, role: "MYPE" }); // Dato simulado por ahora
    }

    setIsInitializing(false);
  }, [setUser]);

  // Evitamos renderizar la app hasta saber si el usuario está logueado o no
  if (isInitializing) return <div className="h-screen bg-gray-50"></div>;

  return children;
}
