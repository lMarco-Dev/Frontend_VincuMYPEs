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
      color: "bg-slate-50 text-slate-700 border-slate-200",
    },
    {
      label: "Publicados",
      valor: pendientes,
      icon: Users,
      color: "bg-orange-50/60 text-orange-600 border-orange-100",
    },
    {
      label: "En desarrollo",
      valor: enDesarrollo,
      icon: Play,
      color: "bg-slate-50 text-slate-700 border-slate-200",
    },
    {
      label: "Completados",
      valor: completados,
      icon: CheckCircle,
      color: "bg-slate-50 text-slate-700 border-slate-200",
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
      <style>{`
        .saas-card {
          background: #ffffff;
          border: 1px solid #E2E8F0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .saas-card:hover {
          border-color: #CBD5E1;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }
        .text-brand-orange {
          color: #F97316;
        }
        .bg-brand-orange {
          background-color: #F97316;
        }
      `}</style>

      {/* Stats Grid */}
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
                  className="saas-card rounded-xl p-5 flex items-center gap-4"
                >
                  <div
                    className={`w-11 h-11 rounded-lg border flex items-center justify-center shrink-0 ${s.color}`}
                  >
                    <Icon size={18} strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 tracking-tight">
                      {s.valor}
                    </p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{s.label}</p>
                  </div>
                </div>
              );
            })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Proyectos recientes */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider text-xs">
              Proyectos recientes
            </h2>
            <Link
              to="/dashboard/mype/proyectos"
              className="text-xs font-semibold text-brand-orange hover:text-orange-700 flex items-center gap-1 transition-colors"
            >
              Ver todos <ArrowRight size={13} />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : recientes.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <p className="text-slate-400 text-sm mb-4">
                Aún no tienes proyectos registrados en la plataforma
              </p>
              <Link to="/dashboard/mype/crear">
                <Button className="bg-brand-orange hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-lg text-sm transition-all shadow-sm">
                  Crear mi primer proyecto
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              {recientes.map((p) => (
                <Link
                  key={p.id}
                  to="/dashboard/mype/proyectos"
                  className="flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-brand-orange transition-colors truncate">
                      {p.titulo}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      {p.fechaLimite
                        ? `Límite de entrega: ${new Date(p.fechaLimite).toLocaleDateString("es-PE")}`
                        : "Sin fecha límite especificada"}
                    </p>
                  </div>
                  <EstadoBadge estado={p.estado} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Panel de distribución por estado */}
        <div className="bg-[#0F2A4A] border border-slate-700/40 rounded-xl p-6 shadow-xl flex flex-col gap-6 w-full">
          
          {/* Bloque superior: Gráfico o Estado de Proyectos */}
          <div className="w-full">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
              Estado de proyectos
            </h2>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 bg-[#081828] rounded-lg" />
                ))}
              </div>
            ) : proyectos.length === 0 ? (
              /* Caja contenedora elegante para el estado vacío, evitando que se pegue al costado */
              <div className="text-center py-8 bg-[#081828]/40 border border-dashed border-slate-700/40 rounded-xl w-full">
                <p className="text-slate-400 text-xs font-light">
                  Sin datos estadísticos activos
                </p>
              </div>
            ) : (
              <div className="space-y-4 w-full">
                {[
                  { label: "Borradores", count: borradores, color: "bg-[#081828]", bar: "bg-slate-500" },
                  { label: "Publicados / En espera", count: pendientes, color: "bg-[#081828]", bar: "bg-blue-500" },
                  { label: "En desarrollo", count: enDesarrollo, color: "bg-[#081828]", bar: "bg-cyan-500" },
                  { label: "Completados", count: completados, color: "bg-[#081828]", bar: "bg-emerald-500" },
                ].map((item) => (
                  <div key={item.label} className="w-full">
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                      <span>{item.label}</span>
                      <span className="text-white font-bold">{item.count}</span>
                    </div>
                    <div className={`h-2 rounded-full w-full ${item.color}`}>
                      <div
                        className={`h-2 rounded-full ${item.bar} transition-all duration-500`}
                        style={{
                          width: proyectos.length > 0 ? `${(item.count / proyectos.length) * 100}%` : "0%",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Línea divisoria nítida */}
          <div className="w-full border-t border-slate-700/50" />

          {/* Bloque inferior: Accesos Rápidos Estructurados */}
          <div className="w-full">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              Accesos rápidos
            </p>
            <div className="flex flex-col gap-2 w-full">
              <Link to="/dashboard/mype/crear" className="block w-full text-decoration-none">
                <button className="flex items-center gap-3 w-full text-sm font-medium text-slate-300 hover:text-brand-orange hover:bg-[#081828]/80 bg-[#081828]/30 rounded-xl px-4 py-3 transition-all border border-transparent hover:border-slate-700/50 cursor-pointer text-left">
                  <Plus size={16} strokeWidth={2.5} className="text-brand-orange shrink-0" /> 
                  <span>Publicar nuevo proyecto</span>
                </button>
              </Link>
              <Link to="/dashboard/mype/postulantes" className="block w-full text-decoration-none">
                <button className="flex items-center gap-3 w-full text-sm font-medium text-slate-300 hover:text-brand-cyan hover:bg-[#081828]/80 bg-[#081828]/30 rounded-xl px-4 py-3 transition-all border border-transparent hover:border-slate-700/50 cursor-pointer text-left">
                  <Users size={16} strokeWidth={2.2} className="text-brand-cyan shrink-0" /> 
                  <span>Revisar postulantes de la UPN</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MypeLayout>
  );
}

// Badge de estado globalizado e impecable
export function EstadoBadge({ estado }) {
  const map = {
    BORRADOR: "bg-slate-100 text-slate-700 border-slate-200",
    PENDIENTE: "bg-blue-50 text-blue-700 border-blue-100",
    EN_DESARROLLO: "bg-amber-50 text-amber-700 border-amber-100",
    EN_REVISION: "bg-indigo-50 text-indigo-700 border-indigo-100",
    COMPLETADO: "bg-emerald-50 text-emerald-700 border-emerald-100",
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
      className={`text-xs px-2.5 py-1 rounded-full font-semibold border shrink-0 tracking-wide ${map[estado] ?? "bg-slate-100 text-slate-600"}`}
    >
      {labels[estado] ?? estado}
    </span>
  );
}