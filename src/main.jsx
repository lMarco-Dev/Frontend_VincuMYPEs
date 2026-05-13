import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Importamos los cimientos
import { QueryProvider } from "./app/providers/QueryProvider";
import { AppRouter } from "./app/router/AppRouter";
import { AuthProvider } from "./app/providers/AuthProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryProvider>
  </StrictMode>,
);
