import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Importamos los cimientos de nuestra Fase 1
import { QueryProvider } from "@app/providers/QueryProvider";
import { AuthProvider } from "@app/providers/AuthProvider";
import { AppRouter } from "@app/router/AppRouter";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryProvider>
  </StrictMode>,
);
