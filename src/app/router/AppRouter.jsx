import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="p-10 text-center text-2xl font-bold">
        Landing Page Pública 🌍
      </div>
    ),
  },
  {
    path: "/login",
    element: (
      <div className="p-10 text-center text-2xl text-blue-600">
        Página de Login 🔐
      </div>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <div className="p-10 text-center text-2xl text-green-600">
        Dashboard Privado 📊
      </div>
    ),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
