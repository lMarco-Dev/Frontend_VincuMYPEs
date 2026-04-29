import { create } from "zustand";
import { tokenStorage } from "@shared/api/tokenStorage";

export const useUserStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (userData) =>
    set({
      user: userData,
      isAuthenticated: !!userData,
    }),

  logout: () => {
    tokenStorage.clearTokens();
    set({ user: null, isAuthenticated: false });
  },
}));
