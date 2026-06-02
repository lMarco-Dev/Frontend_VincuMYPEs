import { queryClient } from "@/shared/api/queryClient";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      rol: null,
      isAuthenticated: false,

      login: (data) => {
        const { token, nombre, rol, email, usuarioId } = data;
        // Normalizar: eliminar prefijo "ROLE_" si existe
        const rolNormalizado = rol?.startsWith("ROLE_") ? rol.substring(5) : rol;
        set({
          token,
          user: { nombre, email, id: usuarioId },
          rol: rolNormalizado,
          isAuthenticated: true,
        });
      },

      setUser: (data) => {
        const { token, id, rol } = data;
        const rolNormalizado = rol?.startsWith("ROLE_") ? rol.substring(5) : rol;
        const currentUser = get().user || {};
        set((state) => ({
          token: token ?? state.token,
          user: { ...currentUser, id },
          rol: rolNormalizado ?? state.rol,
          isAuthenticated: true,
        }));
      },

      logout: () => {
        queryClient.clear();
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