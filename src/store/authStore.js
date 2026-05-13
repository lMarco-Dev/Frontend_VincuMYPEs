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
        set({
          token,
          user: { nombre, email, id: usuarioId },
          rol,
          isAuthenticated: true,
        });
      },

      setUser: (data) => {
        const { token, id, rol } = data; // ← "rol" no "role"
        const currentUser = get().user || {};
        set((state) => ({
          token: token ?? state.token,
          user: { ...currentUser, id },
          rol: rol ?? state.rol,
          isAuthenticated: true,
        }));
      },

      logout: () =>
        set({
          token: null,
          user: null,
          rol: null,
          isAuthenticated: false,
        }),
    }),
    { name: "vincumypes-auth" }, // Zustand persist maneja localStorage solo
  ),
);
