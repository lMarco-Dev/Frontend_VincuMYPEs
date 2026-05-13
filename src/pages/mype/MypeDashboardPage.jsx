import { MypeLayout } from "@shared/layouts/MypeLayout";
import { useMisProyectos } from "@/features/proyecto-list-mype/useMisProyectos";
import { PROYECTO_ESTADO } from "@/entities/proyecto/proyecto.constants";
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/ui/Skeleton";
import {
  FileText,
  Users,
  Play,
  CheckCircle,
  Plus,
  ArrowRight,
} from "lucide-react";

export function MypeDashboardPage() {
  const { proyectos, isLoading } = useMisProyectos();

  // Métricas calculadas desde los datos reales
  const pendientes = proyectos.filter(
    (p) => p.estado === PROYECTO_ESTADO.PENDIENTE,
  ).length;
  const enDesarrollo = proyectos.filter(
    (p) => p.estado === PROYECTO_ESTADO.EN_DESARROLLO,
  ).length;
  const completados = proyectos.filter(
    (p) => p.estado === PROYECTO_ESTADO.COMPLETADO,
  ).length;
  const borradores = proyectos.filter(
    (p) => p.estado === PROYECTO_ESTADO.BORRADOR,
  ).length;

  const stats = [
    {
      label: "Total proyectos",
      valor: proyectos.length,
      icon: FileText,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Publicados",
      valor: pendientes,
      icon: Users,
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "En desarrollo",
      valor: enDesarrollo,
      icon: Play,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Completados",
      valor: completados,
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
    },
  ];

  // Proyectos recientes (últimos 3)
  const recientes = [...proyectos]
    .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
    .slice(0, 3);

  return (
    <MypeLayout
      titulo="Dashboard"
      accion={{ to: "/dashboard/mype/crear", label: "Nuevo proyecto" }}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading
          ? [1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))
          : stats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${s.color}`}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-gray-900">
                      {s.valor}
                    </p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                </div>
              );
            })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Proyectos recientes */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium text-gray-900">
              Proyectos recientes
            </h2>
            <Link
              to="/dashboard/mype/proyectos"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : recientes.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 text-sm mb-3">
                Aún no tienes proyectos
              </p>
              <Link to="/dashboard/mype/crear">
                <Button>Crear mi primer proyecto</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recientes.map((p) => (
                <Link
                  key={p.id}
                  to="/dashboard/mype/proyectos"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {p.titulo}
                    </p>
                    <p className="text-xs text-gray-400">
                      {p.fechaLimite
                        ? `Límite: ${new Date(p.fechaLimite).toLocaleDateString("es-PE")}`
                        : "Sin fecha límite"}
                    </p>
                  </div>
                  <EstadoBadge estado={p.estado} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Panel de distribución por estado */}
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-900 mb-4">
            Estado de proyectos
          </h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-8 rounded-lg" />
              ))}
            </div>
          ) : proyectos.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">
              Sin datos aún
            </p>
          ) : (
            <div className="space-y-3">
              {[
                {
                  label: "Borrador",
                  count: borradores,
                  color: "bg-gray-200",
                  bar: "bg-gray-400",
                },
                {
                  label: "Publicados",
                  count: pendientes,
                  color: "bg-violet-100",
                  bar: "bg-violet-500",
                },
                {
                  label: "En desarrollo",
                  count: enDesarrollo,
                  color: "bg-amber-100",
                  bar: "bg-amber-500",
                },
                {
                  label: "Completados",
                  count: completados,
                  color: "bg-green-100",
                  bar: "bg-green-500",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{item.label}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                  <div className={`h-2 rounded-full ${item.color}`}>
                    <div
                      className={`h-2 rounded-full ${item.bar} transition-all duration-500`}
                      style={{
                        width:
                          proyectos.length > 0
                            ? `${(item.count / proyectos.length) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Acceso rápido */}
          <div className="mt-6 pt-4 border-t border-gray-50">
            <p className="text-xs text-gray-400 mb-3">Acceso rápido</p>
            <Link to="/dashboard/mype/crear">
              <button className="flex items-center gap-2 w-full text-sm text-primary hover:bg-blue-50 rounded-lg px-3 py-2 transition-colors">
                <Plus size={15} /> Nuevo proyecto
              </button>
            </Link>
            <Link to="/dashboard/mype/postulantes">
              <button className="flex items-center gap-2 w-full text-sm text-gray-600 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
                <Users size={15} /> Ver postulantes
              </button>
            </Link>
          </div>
        </div>
      </div>
    </MypeLayout>
  );
}

// Badge de estado inline
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
      className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ml-3 ${map[estado] ?? "bg-gray-100 text-gray-600"}`}
    >
      {labels[estado] ?? estado}
    </span>
  );
}
