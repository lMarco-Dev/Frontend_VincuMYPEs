import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Auth pages
import { LandingPage } from "@pages/auth/LandingPage";
import { LoginPage } from "@pages/auth/LoginPage";
import { RegisterPage } from "@pages/auth/RegisterPage";
import { ForgotPasswordPage } from "@pages/auth/ForgotPasswordPage";
import { VerifyOtpPage } from "@pages/auth/VerifyOtpPage";
import { ResetPasswordPage } from "@pages/auth/ResetPasswordPage";

// MYPE pages
import { MypeDashboardPage } from "@pages/mype/MypeDashboardPage";
import { CrearProyectoPage } from "@pages/mype/CrearProyectoPage";
import { MisProyectosPage } from "@/pages/mype/MisProyectosPage";
import { RevisionEntregablesPage } from "@/pages/mype/RevisionEntregablesPage";
import { PostulantesPage } from "@/pages/mype/PostulantesPage";
import { CertificadosPage as CertificadosMypePage } from "@/pages/mype/CertificadosPage";
import { MypePerfilPage } from "@/pages/mype/MypePerfilPage";
import { MypeConfiguracionPage } from "@/pages/mype/MypeConfiguracionPage";
import { MensajesPage } from "@/pages/mype/MensajesPage";
import { EjecucionPage } from "@/pages/mype/EjecucionPage";

// Estudiante pages
import EstudianteDashboardPage from "@pages/estudiante/EstudianteDashboardPage";
import ProyectosPage from "@pages/estudiante/ProyectosPage";
import DetalleProyectoPage from "@pages/estudiante/DetalleProyectoPage";
import MisPostulacionesPage from "@pages/estudiante/MisPostulacionesPage";
import CertificadosEstudiantePage from "@pages/estudiante/CertificadosPage";
import PerfilPage from "@pages/estudiante/PerfilPage";
import ProyectoWorkspacePage from "@pages/estudiante/ProyectoWorkspacePage";
import WorkspaceSelectorPage from "@pages/estudiante/WorkspaceSelectorPage";
import MypePublicProfilePage from "@pages/estudiante/MypePublicProfilePage";

// Admin pages
import AdminDashboardPage from "@pages/admin/AdminDashboardPage";
import AdminProyectosPage from "@pages/admin/AdminProyectosPage";
import AdminUsuariosPage from "@pages/admin/AdminUsuariosPage";
import AdminAuditoriaPage from "@pages/admin/AdminAuditoriaPage";
import AdminReportesPage from "@pages/admin/AdminReportesPage";
import AdminConfiguracionPage from "@pages/admin/AdminConfiguracionPage";
import AdminPostulacionesPage from "@pages/admin/AdminPostulacionesPage";


// Layouts
import StudentLayout from "@shared/layouts/StudentLayout";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import AdminLayout from "@shared/layouts/AdminLayout";

// Guard
import { ProtectedRoute } from "./ProtectedRoute";

const router = createBrowserRouter([
  // ── Rutas públicas ──────────────────────────────────────────
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register/:tipo", element: <RegisterPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/verify-otp", element: <VerifyOtpPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },

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
        <PostulantesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/mype/mensajes",
    element: (
      <ProtectedRoute rolesPermitidos={["MYPE"]}>
        <MensajesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/mype/ejecucion",
    element: (
      <ProtectedRoute rolesPermitidos={["MYPE"]}>
        <EjecucionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/mype/certificados",
    element: (
      <ProtectedRoute rolesPermitidos={["MYPE"]}>
        <CertificadosMypePage />{" "}
        {/* ✨ Corregido: Ahora renderiza la página de certificados de la MYPE */}
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/mype/perfil",
    element: (
      <ProtectedRoute rolesPermitidos={["MYPE"]}>
        <MypePerfilPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/mype/configuracion",
    element: (
      <ProtectedRoute rolesPermitidos={["MYPE"]}>
        <MypeConfiguracionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/empresas/:id",
    element: <MypePublicProfilePage />,
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
      { path: "/workspace", element: <WorkspaceSelectorPage /> },
      { path: "/workspace/:proyectoId", element: <ProyectoWorkspacePage /> },
      { path: "/certificados", element: <CertificadosEstudiantePage /> }, // ✨ Corregido: Renderiza la página del Estudiante
      { path: "/perfil", element: <PerfilPage /> },
    ],
  },

  /* ===========================================================================================
                                        RUTAS ADMINISTRADOR
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
      { path: "/admin/configuracion", element: <AdminConfiguracionPage /> },
      { path: "/admin/postulaciones", element: <AdminPostulacionesPage /> }
    ],
  },

  // ── Fallbacks ───────────────────────────────────────────────
  { path: "/dashboard", element: <Navigate to="/login" replace /> },
  { path: "/admin", element: <Navigate to="/admin/dashboard" replace /> },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
