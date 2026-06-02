import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import { useEntregables } from "@/features/proyecto-entregables/useEntregables";
import { useCompletarProyecto } from "@/features/proyecto-edit/useEditarProyecto";
import { useMisProyectos } from "@/features/proyecto-list-mype/useMisProyectos"; // ✅ Importación agregada
import { Skeleton } from "@/shared/ui/Skeleton";
import {
  FileText,
  CheckCircle,
  XCircle,
  ExternalLink,
  ArrowLeft,
  Loader2,
} from "lucide-react";

export function RevisionEntregablesPage() {
  const { id: proyectoId } = useParams();
  const { entregables, isLoading, revisarEntregable, isRevisando, refetch } =
    useEntregables(proyectoId, false, true);
  const [observacion, setObservacion] = useState("");
  const [entregableSeleccionado, setEntregableSeleccionado] = useState(null);
  const { completar, isLoading: completando } = useCompletarProyecto();
  const [confirmarCompletado, setConfirmarCompletado] = useState(false);

  // Obtener estado del proyecto para saber si ya está completado
  const { proyectos } = useMisProyectos();
  const proyecto = proyectos.find((p) => p.id === Number(proyectoId));
  const isCompletado = proyecto?.estado === "COMPLETADO";

  const handleRevisar = (entregableId, estado) => {
    revisarEntregable({
      entregableId,
      payload: { estado, observaciones: observacion },
    });
    setEntregableSeleccionado(null);
    setObservacion("");
    refetch();
  };

  return (
    <MypeLayout titulo="Revisión de Entregables">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/dashboard/mype/proyectos"
          className="flex items-center gap-2 text-sm text-brand-cyan hover:text-cyan-400 mb-6 w-fit transition-colors"
        >
          <ArrowLeft size={16} /> Volver a mis proyectos
        </Link>

        <div className="bg-[#0F2A4A] rounded-xl border border-slate-700/50 p-6 shadow-xl">
          <div className="flex justify-between items-end mb-6 border-b border-slate-700/50 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">
                Checklist de Seguimiento
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Revisa los documentos PDF subidos por tu equipo asignado.
              </p>
            </div>
          </div>

          {/* Boton para completar el proyecto */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: "24px",
            }}
          >
            {!isCompletado ? (
              confirmarCompletado ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "#94A3B8" }}>
                    ¿Confirmar que el proyecto está completo?
                  </span>
                  <button
                    onClick={() =>
                      completar(Number(proyectoId), {
                        onSuccess: () => setConfirmarCompletado(false),
                      })
                    }
                    disabled={completando}
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      padding: "6px 14px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      background: "linear-gradient(135deg,#059669,#047857)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      opacity: completando ? 0.7 : 1,
                    }}
                  >
                    {completando ? (
                      <>
                        <Loader2
                          size={12}
                          style={{ animation: "spin 1s linear infinite" }}
                        />{" "}
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={12} /> Confirmar
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setConfirmarCompletado(false)}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "6px 14px",
                      borderRadius: 8,
                      border: "1px solid #475569",
                      background: "transparent",
                      color: "#94A3B8",
                      cursor: "pointer",
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmarCompletado(true)}
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "8px 18px",
                    borderRadius: 8,
                    border: "1px solid rgba(5,150,105,0.4)",
                    background: "rgba(5,150,105,0.1)",
                    color: "#34D399",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <CheckCircle size={14} /> Marcar proyecto como completado
                </button>
              )
            ) : (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "8px 18px",
                  borderRadius: 8,
                  background: "rgba(5,150,105,0.1)",
                  color: "#34D399",
                  border: "1px solid rgba(5,150,105,0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <CheckCircle size={14} /> Proyecto completado
              </span>
            )}
          </div>

          {/* Lista de entregables */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 bg-[#081828] rounded-xl" />
              ))}
            </div>
          ) : entregables.length === 0 ? (
            <div className="text-center py-12 bg-[#081828]/50 rounded-xl border border-dashed border-slate-700/50">
              <FileText size={32} className="mx-auto text-slate-500 mb-3" />
              <p className="text-sm text-slate-400">
                Los estudiantes aún no han subido ningún entregable.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {entregables.map((ent) => (
                <div
                  key={ent.id}
                  className="bg-[#081828] border border-slate-700/40 rounded-xl p-5 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between transition-all hover:border-brand-orange/50"
                >
                  {/* Info del Entregable */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          ent.estado === "APROBADO"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : ent.estado === "RECHAZADO"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {ent.estado === "APROBADO"
                          ? "Aprobado"
                          : ent.estado === "RECHAZADO"
                            ? "Rechazado"
                            : "Pendiente"}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Por: {ent.estudianteNombre}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-200">
                      {ent.titulo}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {ent.descripcion}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <a
                      href={ent.archivo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors border border-slate-600"
                    >
                      <ExternalLink size={14} /> Ver PDF
                    </a>

                    {ent.estado === "PENDIENTE" && (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleRevisar(ent.id, "APROBADO")}
                          disabled={isRevisando}
                          className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold rounded-lg transition-colors border border-emerald-500/30 w-full sm:w-auto"
                        >
                          <CheckCircle size={14} /> Aprobar
                        </button>
                        <button
                          onClick={() =>
                            setEntregableSeleccionado(
                              ent.id === entregableSeleccionado ? null : ent.id,
                            )
                          }
                          className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg transition-colors border border-red-500/20 w-full sm:w-auto"
                        >
                          <XCircle size={14} /> Observar
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Caja de Observación Desplegable */}
                  {entregableSeleccionado === ent.id && (
                    <div className="w-full mt-4 bg-[#0F2A4A] p-4 rounded-lg border border-red-500/20 col-span-full">
                      <label className="block text-xs font-bold text-slate-300 mb-2">
                        Motivo de la corrección:
                      </label>
                      <textarea
                        className="w-full bg-[#081828] border border-slate-600 rounded-lg p-2.5 text-sm text-white focus:border-brand-orange outline-none resize-none mb-3"
                        rows="2"
                        placeholder="Ej: Faltan los diagramas en la página 3..."
                        value={observacion}
                        onChange={(e) => setObservacion(e.target.value)}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEntregableSeleccionado(null)}
                          className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleRevisar(ent.id, "RECHAZADO")}
                          disabled={!observacion.trim() || isRevisando}
                          className="px-4 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
                        >
                          {isRevisando ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            "Enviar corrección"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MypeLayout>
  );
}
