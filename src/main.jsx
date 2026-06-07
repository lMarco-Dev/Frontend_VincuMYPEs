import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { QueryProvider } from "./app/providers/QueryProvider";
import { AppRouter } from "./app/router/AppRouter";
import { AuthProvider } from "./app/providers/AuthProvider";
import { MaintenanceGate } from "./app/providers/MaintenanceGate";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryProvider>
      <AuthProvider>
        <MaintenanceGate>
          <AppRouter />
        </MaintenanceGate>
      </AuthProvider>
    </QueryProvider>
  </StrictMode>,
);