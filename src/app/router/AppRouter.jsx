import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { LandingPage } from "@pages/auth/LandingPage";
import { LoginPage } from "@pages/auth/LoginPage";
import { RegisterPage } from "@pages/auth/RegisterPage";
import { ProtectedRoute } from "./ProtectedRoute";

// Páginas de Estudiante
import EstudianteDashboardPage from '@pages/estudiante/EstudianteDashboardPage';
import ProyectosPage from '@pages/estudiante/ProyectosPage';
import DetalleProyectoPage from '@pages/estudiante/DetalleProyectoPage';
import PerfilPage from '@pages/estudiante/PerfilPage';
import MisPostulacionesPage from '@pages/estudiante/MisPostulacionesPage';
import StudentLayout from '@shared/layouts/StudentLayout';

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
      <ProtectedRoute rolesPermitidos={["ROLE_MYPE", "MYPE"]}>
        <div>Dashboard MYPE — próximamente</div>
      </ProtectedRoute>
    ),
  },
  // Rutas Protegidas para ESTUDIANTE con Layout
  {
    element: <ProtectedRoute rolesPermitidos={["ESTUDIANTE", "ROLE_ESTUDIANTE"]} />,
    children: [
      {
        element: <StudentLayout />,
        children: [
          {
            path: "/dashboard/estudiante",
            element: <EstudianteDashboardPage />,
          },
          {
            path: "/proyectos",
            element: <ProyectosPage />,
          },
          {
            path: "/proyectos/:id",
            element: <DetalleProyectoPage />,
          },
          {
            path: "/mis-postulaciones",
            element: <MisPostulacionesPage />,
          },
          {
            path: "/perfil",
            element: <PerfilPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Navigate to="/dashboard/estudiante" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
