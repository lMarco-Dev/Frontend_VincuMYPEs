import { Sidebar } from "./Sidebar";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/Button";

export function MypeLayout({ children, titulo, accion }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-6 h-[52px] flex items-center justify-between shrink-0">
          <h1 className="text-[15px] font-medium text-gray-900">{titulo}</h1>
          {accion && (
            <Link to={accion.to}>
              <Button className="flex items-center gap-1.5 text-sm">
                <Plus size={15} />
                {accion.label}
              </Button>
            </Link>
          )}
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
