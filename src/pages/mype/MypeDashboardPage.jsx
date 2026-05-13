import { MypeLayout } from "@shared/layouts/MypeLayout";
import { useMisProyectos } from "@/features/proyecto-list-mype/useMisProyectos";
import { ProyectoCard } from "@/entities/proyecto/ProyectoCard";
import { Skeleton } from "@/shared/ui/Skeleton";
import { Button } from "@/shared/ui/Button";
import { Link, useNavigate } from "react-router-dom";

export function MypeDashboardPage() {
  const { proyectos, isLoading } = useMisProyectos();
  const navigate = useNavigate();

  return (
    <MypeLayout
      titulo="Dashboard"
      accion={{ to: "/dashboard/mype/crear", label: "Nuevo proyecto" }}
    >
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          {
            label: "Proyectos publicados",
            valor: proyectos.length,
            sub: "+1 este mes",
          },
          {
            label: "Postulantes activos",
            valor: 0,
            sub: "Pendientes de revisión",
          },
          { label: "En ejecución", valor: 0, sub: "Proyectos activos" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white border border-gray-100 rounded-xl p-4"
          >
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-2xl font-medium text-gray-900">{s.valor}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Lista */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-medium text-gray-900">Proyectos recientes</p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : proyectos.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 mb-4">
            Aún no tienes proyectos publicados
          </p>
          <Link to="/dashboard/mype/crear">
            <Button>Publicar mi primer proyecto</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proyectos.map((p) => (
            <ProyectoCard
              key={p.id}
              proyecto={p}
              onClick={() => navigate(`/proyectos/${p.id}`)}
            />
          ))}
        </div>
      )}
    </MypeLayout>
  );
}
