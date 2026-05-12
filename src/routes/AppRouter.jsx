import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Páginas de Autenticación
import { LandingPage } from '@pages/auth/LandingPage';
import { LoginPage } from '@pages/auth/LoginPage';
import { RegisterPage } from '@pages/auth/RegisterPage';

// Páginas de Estudiante
import EstudianteDashboardPage from '@pages/estudiante/EstudianteDashboardPage';
import ProyectosPage from '@pages/estudiante/ProyectosPage';
import DetalleProyectoPage from '@pages/estudiante/DetalleProyectoPage';
import PerfilPage from '@pages/estudiante/PerfilPage';
import MisPostulacionesPage from '@pages/estudiante/MisPostulacionesPage';
import StudentLayout from '@shared/layouts/StudentLayout';

const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/:tipo" element={<RegisterPage />} />
      
      {/* Rutas Protegidas para ESTUDIANTE con Layout */}
      <Route element={<ProtectedRoute allowedRole="ESTUDIANTE" />}>
        <Route element={<StudentLayout />}>
          <Route path="/dashboard/estudiante" element={<EstudianteDashboardPage />} />
          <Route path="/proyectos" element={<ProyectosPage />} />
          <Route path="/proyectos/:id" element={<DetalleProyectoPage />} />
          
          {/* Rutas pendientes de construcción */}
          <Route path="/mis-postulaciones" element={<MisPostulacionesPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
        </Route>
      </Route>

      {/* Redirecciones */}
      <Route path="/dashboard" element={<Navigate to="/dashboard/estudiante" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
