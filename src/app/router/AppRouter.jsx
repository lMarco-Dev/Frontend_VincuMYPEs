import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { LandingPage } from "@pages/auth/LandingPage";
import { LoginPage } from "@pages/auth/LoginPage";
import { RegisterPage } from "@pages/auth/RegisterPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { MypeDashboardPage } from "@/pages/mype/MypeDashboardPage";
import { CrearProyectoPage } from "@/pages/mype/CrearProyectoPage";

// Páginas de Estudiante
import EstudianteDashboardPage from '@pages/estudiante/EstudianteDashboardPage';
import ProyectosPage from '@pages/estudiante/ProyectosPage';
import DetalleProyectoPage from '@pages/estudiante/DetalleProyectoPage';
import PerfilPage from '@pages/estudiante/PerfilPage';
import MisPostulacionesPage from '@pages/estudiante/MisPostulacionesPage';
import CertificadosPage from '@pages/estudiante/CertificadosPage';
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
  // Rutas MYPE
  {
    path: "/dashboard/mype",
    element: (
      <ProtectedRoute rolesPermitidos={["MYPE"]}>
        <MypeDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/mype/crear",
    element: (
      <ProtectedRoute rolesPermitidos={["MYPE"]}>
        <CrearProyectoPage />
      </ProtectedRoute>
    ),
  },
  // Rutas ESTUDIANTE
  {
    element: (
      <ProtectedRoute rolesPermitidos={["ESTUDIANTE"]}>
        <StudentLayout />
      </ProtectedRoute>
    ),
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
        path: "/certificados",
        element: <CertificadosPage />,
      },
      {
        path: "/perfil",
        element: <PerfilPage />,
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
