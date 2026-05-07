// src/app/router/AppRouter.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LandingPage } from "@pages/auth/LandingPage";
import { LoginPage } from "@pages/auth/LoginPage";
import { RegisterPage } from "@pages/auth/RegisterPage";
import { ProtectedRoute } from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register/:tipo",
    element: <RegisterPage />,
  },
  // Rutas MYPE — solo ROLE_MYPE puede entrar
  {
    path: "/dashboard/mype",
    element: (
      <ProtectedRoute rolesPermitidos={["ROLE_MYPE"]}>
        <div>Dashboard MYPE — próximamente</div>
      </ProtectedRoute>
    ),
  },

  // Rutas ESTUDIANTE — solo ROLE_ESTUDIANTE puede entrar
  {
    path: "/dashboard/estudiante",
    element: (
      <ProtectedRoute rolesPermitidos={["ROLE_ESTUDIANTE"]}>
        <div>Dashboard Estudiante — próximamente</div>
      </ProtectedRoute>
    ),
  },

  // Proyectos — público
  {
    path: "/proyectos",
    element: <div>Lista proyectos — próximamente</div>,
  },
  {
    path: "/proyectos/:id",
    element: <div>Detalle proyecto — próximamente</div>,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
