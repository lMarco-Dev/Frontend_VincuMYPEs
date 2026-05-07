import { useEffect, useState } from "react";
import { useUserStore } from "@entities/user/userStore";
import { tokenStorage } from "@shared/api/tokenStorage";
import { decodeJwt, isTokenExpired } from "@/shared/lib/jwt";

export function AuthProvider({ children }) {
  const { setUser, logout } = useUserStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const token = tokenStorage.getAccessToken();

    if (token) {
      const decoded = decodeJwt(token);

      if (!decoded || isTokenExpired(decoded)) {
        logout();
      } else {
        setUser({
          token: token,
          id: decoded.sub,
          role: decoded.role ?? decoded.rol ?? decoded.authorities,
        });
      }
    }

    setIsInitializing(false);
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
