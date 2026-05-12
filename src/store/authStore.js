import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: localStorage.getItem('token') || null,
      user: JSON.parse(localStorage.getItem('user')) || null,
      rol: localStorage.getItem('rol') || null,
      isAuthenticated: !!localStorage.getItem('token'),

      login: (data) => {
        const { token, nombre, rol, email, usuarioId } = data;
        
        const userData = { 
          nombre, 
          email, 
          id: usuarioId 
        };

        // Mantener compatibilidad con archivos que leen localStorage directamente
        localStorage.setItem('token', token);
        localStorage.setItem('rol', rol);
        localStorage.setItem('user', JSON.stringify(userData));
        
        set({
          token,
          user: userData,
          rol: rol,
          isAuthenticated: true,
        });
      },

      setUser: (data) => {
        const { token, id, role } = data;
        const currentUser = JSON.parse(localStorage.getItem("user")) || {};
        
        const userData = { 
          ...currentUser,
          id 
        };

        localStorage.setItem("token", token);
        localStorage.setItem("rol", role);
        localStorage.setItem("user", JSON.stringify(userData));
        
        set({
          token,
          user: userData,
          rol: role,
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        localStorage.removeItem('user');
        
        set({
          token: null,
          user: null,
          rol: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'vincumypes-auth',
    }
  )
);
