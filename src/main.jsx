import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { QueryProvider } from "./app/providers/QueryProvider";
import { AppRouter } from "./app/router/AppRouter";
import { AuthProvider } from "./app/providers/AuthProvider";
import { MaintenanceGate } from "./app/providers/MaintenanceGate";
import MobileBlockPage from "./pages/mantenimiento/MobileBlockPage";

// ═══════════════════════════════════════════════════════════════
// 🚀 COMPONENTE PRINCIPAL CON DETECCIÓN EN TIEMPO REAL
// ═══════════════════════════════════════════════════════════════
function AppRoot() {
  const [esMovil, setEsMovil] = useState(() => {
    const ancho = window.innerWidth;
    const agente = navigator.userAgent || '';
    return ancho <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile|webOS/i.test(agente);
  });

  const [ancho, setAncho] = useState(window.innerWidth);

  useEffect(() => {
    // Función que detecta cambios de tamaño
    const handleResize = () => {
      const nuevoAncho = window.innerWidth;
      setAncho(nuevoAncho);
      
      const agente = navigator.userAgent || '';
      const nuevoEsMovil = nuevoAncho <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile|webOS/i.test(agente);
      setEsMovil(nuevoEsMovil);
    };

    // Escuchar cambios de tamaño
    window.addEventListener('resize', handleResize);

    // Limpiar al desmontar
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 📱 Si es móvil → bloqueo
  if (esMovil) {
    return (
      <StrictMode>
        <MobileBlockPage ancho={ancho} />
      </StrictMode>
    );
  }

  // 💻 Si es escritorio → app normal
  return (
    <StrictMode>
      <QueryProvider>
        <AuthProvider>
          <MaintenanceGate>
            <AppRouter />
          </MaintenanceGate>
        </AuthProvider>
      </QueryProvider>
    </StrictMode>
  );
}

// ═══════════════════════════════════════════════════════════════
// 🚀 RENDERIZAR
// ═══════════════════════════════════════════════════════════════
createRoot(document.getElementById("root")).render(<AppRoot />);