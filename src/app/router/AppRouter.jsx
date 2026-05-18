import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Auth pages
import { LandingPage } from "@pages/auth/LandingPage";
import { LoginPage } from "@pages/auth/LoginPage";
import { RegisterPage } from "@pages/auth/RegisterPage";

// MYPE pages 
import { MypeDashboardPage } from "@pages/mype/MypeDashboardPage";
import { CrearProyectoPage } from "@pages/mype/CrearProyectoPage";
import { MisProyectosPage } from "@/pages/mype/MisProyectosPage";
import { RevisionEntregablesPage } from "@/pages/mype/RevisionEntregablesPage"; 

// Estudiante pages
import EstudianteDashboardPage from "@pages/estudiante/EstudianteDashboardPage";
import ProyectosPage from "@pages/estudiante/ProyectosPage";
import DetalleProyectoPage from "@pages/estudiante/DetalleProyectoPage";
import MisPostulacionesPage from "@pages/estudiante/MisPostulacionesPage";
import CertificadosPage from "@pages/estudiante/CertificadosPage";
import PerfilPage from "@pages/estudiante/PerfilPage";
import ProyectoWorkspacePage from "@pages/estudiante/ProyectoWorkspacePage"; // ✨ NUEVA: Workspace del proyecto activo

// Admin pages (✨ NUEVAS IMPORTACIONES)
import AdminDashboardPage from "@pages/admin/AdminDashboardPage";
import AdminProyectosPage from "@pages/admin/AdminProyectosPage";
import AdminUsuariosPage from "@pages/admin/AdminUsuariosPage";
import AdminAuditoriaPage from "@pages/admin/AdminAuditoriaPage";
import AdminReportesPage from "@pages/admin/AdminReportesPage";
import AdminConfiguracionPage from "@pages/admin/AdminConfiguracionPage";

// Layouts
import StudentLayout from "@shared/layouts/StudentLayout";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import AdminLayout from "@shared/layouts/AdminLayout"; // ✨ NUEVO LAYOUT

// Guard
import { ProtectedRoute } from "./ProtectedRoute";

const router = createBrowserRouter([
  // ── Rutas públicas ──────────────────────────────────────────
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register/:tipo", element: <RegisterPage /> },

  /* ===========================================================================================
                                          RUTAS MYPEs
     =========================================================================================== */
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
  {
    path: "/dashboard/mype/proyectos",
    element: (
      <ProtectedRoute rolesPermitidos={["MYPE"]}>
        <MisProyectosPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/mype/proyectos/:id/entregables",
    element: (
      <ProtectedRoute rolesPermitidos={["MYPE"]}>
        <RevisionEntregablesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/mype/postulantes",
    element: (
      <ProtectedRoute rolesPermitidos={["MYPE"]}>
        <MypeLayout titulo="Postulantes" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/mype/mensajes",
    element: (
      <ProtectedRoute rolesPermitidos={["MYPE"]}>
        <MypeLayout titulo="Mensajes" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/mype/ejecucion",
    element: (
      <ProtectedRoute rolesPermitidos={["MYPE"]}>
        <MypeLayout titulo="En ejecución" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/mype/certificados",
    element: (
      <ProtectedRoute rolesPermitidos={["MYPE"]}>
        <MypeLayout titulo="Certificados" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/mype/perfil",
    element: (
      <ProtectedRoute rolesPermitidos={["MYPE"]}>
        <MypeLayout titulo="Mi perfil" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/mype/configuracion",
    element: (
      <ProtectedRoute rolesPermitidos={["MYPE"]}>
        <MypeLayout titulo="Configuración" />
      </ProtectedRoute>
    ),
  },

  /* ===========================================================================================
                                          RUTAS Estudiantes
     =========================================================================================== */
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
      // ✨ RUTA AÑADIDA: El espacio de trabajo para el alumno cuando es aceptado
      { path: "/workspace/:proyectoId", element: <ProyectoWorkspacePage /> }, 
    ],
  },

  /* ===========================================================================================
                                          RUTAS ADMINISTRADOR (NUEVO)
     =========================================================================================== */
  {
    element: (
      <ProtectedRoute rolesPermitidos={["ROLE_ADMIN"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/admin/dashboard", element: <AdminDashboardPage /> },
      { path: "/admin/proyectos", element: <AdminProyectosPage /> },
      { path: "/admin/usuarios", element: <AdminUsuariosPage /> },
      { path: "/admin/auditoria", element: <AdminAuditoriaPage /> },
      { path: "/admin/reportes", element: <AdminReportesPage /> },
      { path: "/admin/configuracion", element: <AdminConfiguracionPage /> }
    ],
  },

  // ── Fallbacks ───────────────────────────────────────────────
  { path: "/dashboard", element: <Navigate to="/login" replace /> },
  { path: "/admin", element: <Navigate to="/admin/dashboard" replace /> }, // ✨ Redirección de ayuda
  { path: "*", element: <Navigate to="/" replace /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}