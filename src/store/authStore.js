import { queryClient } from "@/shared/api/queryClient";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { tokenStorage } from "@/shared/api/tokenStorage";
import { httpClient } from "@/shared/api/httpClient";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      rol: null,
      isAuthenticated: false,

      login: (data) => {
        const { token, nombre, rol, email, usuarioId, refreshToken } = data;
        const rolNormalizado = rol?.startsWith("ROLE_") ? rol.substring(5) : rol;
        if (token) tokenStorage.setTokens(token, refreshToken);
        set({
          token,
          user: { nombre, email, id: usuarioId },
          rol: rolNormalizado,
          isAuthenticated: true,
        });
      },

      setUser: (data) => {
        const { token, id, rol, refreshToken } = data;
        const rolNormalizado = rol?.startsWith("ROLE_") ? rol.substring(5) : rol;
        const currentUser = get().user || {};
        if (token) tokenStorage.setTokens(token, refreshToken);
        set((state) => ({
          token: token ?? state.token,
          user: { ...currentUser, id },
          rol: rolNormalizado ?? state.rol,
          isAuthenticated: true,
        }));
      },

      logout: () => {
        // Notificar al backend (fire-and-forget) antes de limpiar tokens
        const refreshToken = tokenStorage.getRefreshToken();
        if (refreshToken) {
          httpClient
            .post("/auth/logout", { refreshToken })
            .catch(() => {}); // ignorar errores de red en el logout
        }

        queryClient.clear();
        tokenStorage.clearTokens();
        set({
          token: null,
          user: null,
          rol: null,
          isAuthenticated: false,
        });
      },
    }),
    { name: "vincumypes-auth" }
  ),
);