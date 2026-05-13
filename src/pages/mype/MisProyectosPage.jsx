import { MypeLayout } from "@shared/layouts/MypeLayout";
import { useMisProyectos } from "@/features/proyecto-list-mype/useMisProyectos";
import {
  AREA_SISTEMAS_LABELS,
  PROYECTO_ESTADO,
} from "@/entities/proyecto/proyecto.constants";
import { Skeleton } from "@/shared/ui/Skeleton";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/Button";
import { Users, Plus, Pencil, Trash2 } from "lucide-react";

export function MisProyectosPage() {
  const { proyectos, isLoading } = useMisProyectos();
  const navigate = useNavigate();

  return (
    <MypeLayout
      titulo="Mis proyectos"
      accion={{ to: "/dashboard/mype/crear", label: "Nuevo proyecto" }}
    >
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : proyectos.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 mb-4">
            Aún no tienes proyectos publicados
          </p>
          <Link to="/dashboard/mype/crear">
            <Button>Publicar mi primer proyecto</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          {/* Cabecera tabla */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wide">
            <span className="col-span-4">Proyecto</span>
            <span className="col-span-2">Área</span>
            <span className="col-span-2">Estado</span>
            <span className="col-span-2">Fecha límite</span>
            <span className="col-span-2 text-right">Acciones</span>
          </div>

          {/* Filas */}
          {proyectos.map((p, i) => (
            <div
              key={p.id}
              className={`grid grid-cols-12 gap-4 px-5 py-4 items-center text-sm ${i !== proyectos.length - 1 ? "border-b border-gray-50" : ""}`}
            >
              {/* Título + descripción */}
              <div className="col-span-4 min-w-0">
                <p className="font-medium text-gray-900 truncate">{p.titulo}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {p.descripcion}
                </p>
              </div>

              {/* Área */}
              <div className="col-span-2">
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                  {AREA_SISTEMAS_LABELS[p.areaSistemas] ?? p.areaSistemas}
                </span>
              </div>

              {/* Estado */}
              <div className="col-span-2">
                <EstadoBadge estado={p.estado} />
              </div>

              {/* Fecha límite */}
              <div className="col-span-2 text-gray-500">
                {p.fechaLimite ? (
                  new Date(p.fechaLimite).toLocaleDateString("es-PE")
                ) : (
                  <span className="text-gray-300">—</span>
                )}
              </div>

              {/* Acciones */}
              <div className="col-span-2 flex items-center justify-end gap-2">
                <button
                  onClick={() =>
                    navigate(`/dashboard/mype/postulantes?proyecto=${p.id}`)
                  }
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Ver postulantes"
                >
                  <Users size={14} /> Postulantes
                </button>
                <button
                  className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Pencil size={14} />
                </button>
                <button
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </MypeLayout>
  );
}

function EstadoBadge({ estado }) {
  const map = {
    BORRADOR: "bg-gray-100 text-gray-600",
    PENDIENTE: "bg-violet-100 text-violet-700",
    EN_DESARROLLO: "bg-amber-100 text-amber-700",
    EN_REVISION: "bg-blue-100 text-blue-700",
    COMPLETADO: "bg-green-100 text-green-700",
  };
  const labels = {
    BORRADOR: "Borrador",
    PENDIENTE: "Publicado",
    EN_DESARROLLO: "En desarrollo",
    EN_REVISION: "En revisión",
    COMPLETADO: "Completado",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[estado] ?? "bg-gray-100 text-gray-600"}`}
    >
      {labels[estado] ?? estado}
    </span>
  );
}
