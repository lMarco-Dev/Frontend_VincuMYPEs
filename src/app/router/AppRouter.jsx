import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Auth pages
import { LandingPage } from "@pages/auth/LandingPage";
import { LoginPage } from "@pages/auth/LoginPage";
import { RegisterPage } from "@pages/auth/RegisterPage";

// MYPE pages (tu parte)
import { MypeDashboardPage } from "@pages/mype/MypeDashboardPage";
import { CrearProyectoPage } from "@pages/mype/CrearProyectoPage";

// Estudiante pages (parte de tu compañero)
import EstudianteDashboardPage from "@pages/estudiante/EstudianteDashboardPage";
import ProyectosPage from "@pages/estudiante/ProyectosPage";
import DetalleProyectoPage from "@pages/estudiante/DetalleProyectoPage";
import MisPostulacionesPage from "@pages/estudiante/MisPostulacionesPage";
import CertificadosPage from "@pages/estudiante/CertificadosPage";
import PerfilPage from "@pages/estudiante/PerfilPage";

// Layouts
import StudentLayout from "@shared/layouts/StudentLayout";

// Guard
import { ProtectedRoute } from "./ProtectedRoute";

const router = createBrowserRouter([
  // ── Rutas públicas ──────────────────────────────────────────
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register/:tipo", element: <RegisterPage /> },

  // ── Rutas MYPE (tu parte) ───────────────────────────────────
  // Cada página ya incluye MypeLayout internamente
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
  // Aquí irán tus demás páginas MYPE cuando las construyas:
  // /dashboard/mype/postulantes, /dashboard/mype/mensajes, etc.

  // ── Rutas ESTUDIANTE (parte de tu compañero) ────────────────
  // StudentLayout usa <Outlet />, así que se pone como padre
  {
    element: (
      <ProtectedRoute rolesPermitidos={["ESTUDIANTE"]}>
        <StudentLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/dashboard/estudiante", element: <EstudianteDashboardPage /> },
      { path: "/proyectos", element: <ProyectosPage /> },
      { path: "/proyectos/:id", element: <DetalleProyectoPage /> },
      { path: "/mis-postulaciones", element: <MisPostulacionesPage /> },
      { path: "/certificados", element: <CertificadosPage /> },
      { path: "/perfil", element: <PerfilPage /> },
    ],
  },

  // ── Fallbacks ───────────────────────────────────────────────
  { path: "/dashboard", element: <Navigate to="/login" replace /> },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
