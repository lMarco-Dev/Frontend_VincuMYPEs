// src/app/router/AppRouter.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LandingPage } from "@pages/auth/LandingPage";
import { LoginPage } from "@pages/auth/LoginPage";
import { RegisterPage } from "@pages/auth/RegisterPage";

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
  {
    path: "/dashboard/mype",
    element: (
      <div className="p-10 text-center text-2xl text-green-600">
        Dashboard MYPE 🏢 (próximamente)
      </div>
    ),
  },
  {
    path: "/dashboard/estudiante",
    element: (
      <div className="p-10 text-center text-2xl text-blue-600">
        Dashboard Estudiante 🎓 (próximamente)
      </div>
    ),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
