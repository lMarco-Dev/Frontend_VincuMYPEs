import { MypeLayout } from "@shared/layouts/MypeLayout";
import { useMisProyectos } from "@/features/proyecto-list-mype/useMisProyectos";
import {
  AREA_SISTEMAS_LABELS,
  PROYECTO_ESTADO,
} from "@/entities/proyecto/proyecto.constants";
import { Skeleton } from "@/shared/ui/Skeleton";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/Button";
import { Users, Pencil, Trash2 } from "lucide-react";
import { EstadoBadge } from "./MypeDashboardPage";

export function MisProyectosPage() {
  const { proyectos, isLoading } = useMisProyectos();
  const navigate = useNavigate();

  return (
    <MypeLayout
      titulo="Mis proyectos"
      accion={{ to: "/dashboard/mype/crear", label: "Nuevo proyecto" }}
    >
      <style>{`
        .table-row-saas {
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        .table-row-saas:hover {
          background-color: #F8FAFC;
        }
        .action-icon-btn {
          padding: 6px;
          border-radius: 8px;
          color: #94A3B8;
          border: 1px solid transparent;
          transition: all 0.2s ease;
          background: transparent;
          cursor: pointer;
        }
        .action-icon-btn:hover {
          border-color: #E2E8F0;
          background: #FFFFFF;
        }
        .text-brand-orange { color: #F97316; }
      `}</style>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : proyectos.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-200 rounded-xl bg-white max-w-3xl mx-auto">
          <p className="text-slate-400 font-medium mb-4">
            Aún no has publicado ningún requerimiento o proyecto
          </p>
          <Link to="/dashboard/mype/crear">
            <Button className="bg-brand-orange hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-lg">
              Publicar mi primer proyecto
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {/* Cabecera de la Tabla */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <span className="col-span-4">Proyecto / Problema</span>
            <span className="col-span-2">Área Académica</span>
            <span className="col-span-2">Estado</span>
            <span className="col-span-2">Fecha límite</span>
            <span className="col-span-2 text-right">Acciones</span>
          </div>

          {/* Filas de Datos */}
          {proyectos.map((p, i) => (
            <div
              key={p.id}
              className={`grid grid-cols-12 gap-4 px-6 py-4.5 items-center text-sm table-row-saas ${
                i !== proyectos.length - 1 ? "border-b border-slate-100" : ""
              }`}
            >
              {/* Título + descripción corta */}
              <div className="col-span-4 min-w-0 pr-4">
                <p className="font-semibold text-slate-900 truncate">{p.titulo}</p>
                <p className="text-xs text-slate-400 truncate mt-1 font-light">
                  {p.descripcion}
                </p>
              </div>

              {/* Área del sistema */}
              <div className="col-span-2">
                <span className="text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-md">
                  {AREA_SISTEMAS_LABELS[p.areaSistemas] ?? p.areaSistemas}
                </span>
              </div>

              {/* Estado Badge */}
              <div className="col-span-2">
                <EstadoBadge estado={p.estado} />
              </div>

              {/* Fecha límite */}
              <div className="col-span-2 font-medium text-slate-600">
                {p.fechaLimite ? (
                  new Date(p.fechaLimite).toLocaleDateString("es-PE")
                ) : (
                  <span className="text-slate-300 font-light">—</span>
                )}
              </div>

              {/* Acciones del SaaS */}
              <div className="col-span-2 flex items-center justify-end gap-1.5">
                <button
                  onClick={() => navigate(`/dashboard/mype/postulantes?proyecto=${p.id}`)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-orange px-2.5 py-1.5 rounded-lg hover:bg-orange-50/60 border border-transparent hover:border-orange-100 transition-all"
                  title="Ver estudiantes postulantes"
                >
                  <Users size={14} /> <span>Postulantes</span>
                </button>
                
                <button
                  className="action-icon-btn hover:text-amber-600 hover:!border-amber-200 hover:!bg-amber-50/50"
                  title="Editar proyecto"
                >
                  <Pencil size={14} />
                </button>
                
                <button
                  className="action-icon-btn hover:text-red-600 hover:!border-red-200 hover:!bg-red-50/50"
                  title="Eliminar proyecto"
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