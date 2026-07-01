import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import { useEntregables } from "@/features/proyecto-entregables/useEntregables";
import { useCompletarProyecto } from "@/features/proyecto-edit/useEditarProyecto";
import { FormalizacionDocumentalOverlay } from "@/pages/mype/CertificadosPage";
import { useNavigate } from "react-router-dom";
import { useMiPerfilMype } from "@/features/mype-perfil/useMypePerfil";
import { useAuthStore } from "@/store/authStore";
import { httpClient } from "@/shared/api/httpClient";
import { puedeEmitirCertificado } from "@/features/proyectos-list/proyectos.api";
import { useQuery } from "@tanstack/react-query";
import RateUserModal from "@/features/calificaciones/RateUserModal";
import { getSafeUrl } from "@/utils/s3";


import { AnimatePresence } from "framer-motion"; 

import { useMisProyectos } from "@/features/proyecto-list-mype/useMisProyectos";
import { Skeleton } from "@/shared/ui/Skeleton";
import {
  ExternalLink,
  ArrowLeft,
  Loader2,
  ChevronDown,
  Info,
  Award,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

/**
 * COMPONENTE VISUAL PRINCIPAL (UI Luminosa - Tamaños reducidos)
 */
export function RevisionEntregablesPage() {
  const { id: proyectoId } = useParams();
  

  const { entregables, isLoading, revisarEntregable, isRevisando, refetch } =
    useEntregables(proyectoId, false, true);
  const [observacion, setObservacion] = useState("");
  const [entregableSeleccionado, setEntregableSeleccionado] = useState(null);
  const navigate = useNavigate();
const { user } = useAuthStore();
const { perfil } = useMiPerfilMype();

const mypeNombre = perfil?.nombreComercial || "MYPE";
const rucMype = perfil?.ruc || "";
const gerenteNombre = perfil?.nombreRepresentante || user?.nombre || "";

  const [expandidoId, setExpandidoId] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [tooltipChart, setTooltipChart] = useState(null);

  const { completar, isLoading: completando } = useCompletarProyecto();
  const [confirmarCompletado, setConfirmarCompletado] = useState(false);
const { proyectos, refetch: refetchProyectos } = useMisProyectos();  const proyecto = proyectos.find((p) => p.id === Number(proyectoId));
  const isCompletado = proyecto?.estado === "COMPLETADO";
  const [mostrarModalCertificado, setMostrarModalCertificado] = useState(false);
  const [mostrarModalCompletado, setMostrarModalCompletado] = useState(false);
  const [proyectoParaCertificar, setProyectoParaCertificar] = useState(null);

  const [mostrarModalCalificacion, setMostrarModalCalificacion] = useState(false);
  const [estudiantesParaCalificar, setEstudiantesParaCalificar] = useState([]);
  const [indiceEstudiante, setIndiceEstudiante] = useState(0);
  const [calificacionesCompletadas, setCalificacionesCompletadas] = useState(false);

  const { data: puedeEmitir } = useQuery({
    queryKey: ['puede-emitir-certificado', proyectoId],
    queryFn: () => puedeEmitirCertificado(Number(proyectoId)),
    enabled: !!proyectoId && !isCompletado
  });

  const handleRevisar = (entregableId, estado) => {
    revisarEntregable(
      {
        entregableId,
        payload: { estado, observaciones: observacion },
      },
      {
        onError: (error) => {
          const msg = error.response?.data?.message || error.message || "Error al revisar el entregable";
          if (msg.includes("delegado") || msg.includes("votación")) {
            alert("El proyecto no puede completarse porque el equipo aún no ha elegido un delegado. Espera a que finalice la votación.");
          } else {
            alert(msg);
          }
          setEntregableSeleccionado(null);
          setObservacion("");
        },
        onSuccess: async () => {
          setEntregableSeleccionado(null);
          setObservacion("");
          
          // Refrescar datos
          await refetch(); // Refrescar entregables
          await refetchProyectos(); // Refrescar proyectos
          
          // ✅ Obtener el proyecto actualizado
          const proyectoActualizado = proyectos.find((p) => p.id === Number(proyectoId));
          
          // ✅ Verificar si todos los entregables están aprobados
          // Usamos entregables del hook (ya deberían estar actualizados después del refetch)
          const totalEntregables = entregables.length;
          const aprobados = entregables.filter(e => e.estado === "APROBADO").length;
          const todosAprobados = totalEntregables > 0 && aprobados === totalEntregables;
          
          // ✅ Si todos están aprobados y el proyecto no está completado, mostrar modal
          if (todosAprobados && proyectoActualizado?.estado !== "COMPLETADO") {
            setMostrarModalCompletado(true);
          }
        },
      }
    );
  };

  const handleToggleExpand = (id) => {
    setExpandidoId((prev) => (prev === id ? null : id));
  };

  const abrirFormObservacion = (e, id) => {
    e.stopPropagation();
    setEntregableSeleccionado((prev) => (prev === id ? null : id));
  };

    const handleEmitirCertificado = () => {
    setProyectoParaCertificar(proyecto);
    setMostrarModalCertificado(true);
    setMostrarModalCompletado(false);
  };

  const handleCalificacionCompletada = () => {
  if (indiceEstudiante + 1 < estudiantesParaCalificar.length) {
    setIndiceEstudiante((prev) => prev + 1);
  } else {
    completar(Number(proyectoId));
    refetch();
    refetchProyectos();
    setMostrarModalCalificacion(false);
    setEstudiantesParaCalificar([]);
    setIndiceEstudiante(0);
    setCalificacionesCompletadas(true);
  }
};

  const entregablesData = useMemo(() => entregables || [], [entregables]);
  const indicadores = useMemo(() => {
    const total = entregablesData.length;
    const aprobados = entregablesData.filter((e) => e.estado === "APROBADO").length;
    const revision = entregablesData.filter((e) => e.estado === "PENDIENTE").length;
    const atencion = entregablesData.filter((e) => e.estado === "RECHAZADO").length;
    return { total, aprobados, revision, atencion };
  }, [entregablesData]);

  const existenEntregables = indicadores.total > 0;
  const todosAprobados = existenEntregables && (indicadores.aprobados === indicadores.total);
  const esCertificable = todosAprobados && !isCompletado;

  const ITEMS_POR_PAGINA = 5;
  const totalPaginas = Math.ceil(indicadores.total / ITEMS_POR_PAGINA);
  const dataPaginada = entregablesData.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  );

  return (
    <MypeLayout titulo="Seguimiento de Entregables">
      <div className="w-full pb-8 antialiased font-sans flex flex-col gap-5 max-w-[1200px] mx-auto text-slate-800">
        
        {/* ENCABEZADO */}
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between w-full mt-2 gap-3">
          <div className="w-full">
            <Link
              to="/dashboard/mype/proyectos"
              className="group flex w-max items-center gap-1.5 text-[13px] text-slate-500 hover:text-blue-700 transition-colors tracking-wide font-medium"
            >
              <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform text-blue-600" />
              Volver al listado
            </Link>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight mt-3">
              Auditoría de Entregables
            </h1>
            <p className="text-[13px] text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Revise el avance de cada entrega, apruebe o solicite correcciones, y emita el certificado al finalizar.
            </p>
          </div>
        </header>

        {isLoading ? (
          <div className="space-y-3 pt-2">
            <Skeleton className="w-full h-20 bg-slate-100 rounded-lg border border-slate-200" />
            <div className="flex gap-3">
               <Skeleton className="w-1/4 h-20 bg-slate-100 rounded-lg border border-slate-200" />
               <Skeleton className="w-3/4 h-20 bg-slate-100 rounded-lg border border-slate-200" />
            </div>
            <Skeleton className="w-full h-14 bg-slate-100 rounded-lg border border-slate-200 mt-4" />
          </div>
        ) : (
          <>
            {/* CERTIFICACIÓN */}
            {puedeEmitir === true && (
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                  <div className="flex gap-3 items-center flex-1">
                     <div className="bg-emerald-100 p-2 rounded-full text-emerald-700">
                        <Award size={20} />
                     </div>
                     <div>
                        <h2 className="text-[15px] font-bold text-slate-900 mb-0.5">
                          Proyecto listo para certificar
                        </h2>
                        <p className="text-[13px] text-slate-600">
                          Todos los entregables han sido aprobados. Emita el certificado de conformidad.
                        </p>
                     </div>
                  </div>

                  <div className="w-full md:w-auto">
                     {confirmarCompletado ? (
                      <div className="flex gap-2">
                        <button onClick={() => setConfirmarCompletado(false)}>Cancelar</button>
                        <button onClick={() => {
                          // Mostrar modal de calificación en lugar de completar directamente
                          setMostrarModalCalificacion(true);
                          setConfirmarCompletado(false);
                        }}>
                          Emitir Certificado
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmarCompletado(true)}>Emitir Certificado</button>
                    )}
                  </div>
               </div>
            )}

            {isCompletado && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center gap-3">
                  <div className="bg-blue-100 p-1.5 rounded-full text-blue-600">
                     <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h2 className="text-[13px] font-bold text-slate-900">Certificado Emitido</h2>
                    <p className="text-[12px] text-slate-500">Proyecto cerrado y archivado correctamente.</p>
                  </div>
                </div>
            )}

            {/* KPI - TAMAÑOS REDUCIDOS */}
            <div className="flex flex-col lg:flex-row gap-3">
              
              <div className="w-full lg:w-48 flex lg:flex-col gap-2 overflow-x-auto">
                <KPICard title="Total" value={indicadores.total} label="Registrados" />
                <KPICard title="Aprobados" value={indicadores.aprobados} label="Validados" valColor="text-emerald-700" baseBorderColor="border-l-[3px] border-l-emerald-500" />
                <KPICard title="Rechazados" value={indicadores.atencion} label="Con alertas" valColor="text-orange-600" baseBorderColor="border-l-[3px] border-l-orange-500" />
                <KPICard title="Pendientes" value={indicadores.revision} label="En espera" valColor="text-blue-600" baseBorderColor="border-l-[3px] border-l-blue-500" />
              </div>

              {/* GRÁFICO AUDITORÍA TIMELINE */}
              <div className="relative bg-white shadow-sm flex-1 border border-slate-200 rounded-lg p-4 flex flex-col">
                <div className="mb-4">
                    <h3 className="text-[15px] font-bold text-slate-800 mb-1">Línea de Tiempo de Auditoría</h3>
                    <p className="text-[12px] text-slate-500">Trazabilidad histórica independiente de cada entregable a lo largo del proyecto.</p>
                </div>
                
                <div className="w-full flex-1 min-h-[220px] select-none relative overflow-x-auto overflow-y-hidden custom-scrollbar">
                  {entregablesData.length > 0 ? (
                    <TimelineAuditoriaGrafico data={entregablesData} onHoverNode={setTooltipChart} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-50 rounded border border-slate-100">
                       <span className="text-[13px] text-slate-500">Sin datos para mostrar</span>
                    </div>
                  )}

                  {/* TOOLTIP DETALLADO */}
                  {tooltipChart && (
                    <div
                      className="fixed bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-slate-200 rounded-lg p-3 min-w-[240px] max-w-[280px] pointer-events-none z-[100]"
                      style={{ top: tooltipChart.y + 15, left: tooltipChart.x + 15 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tooltipChart.colorLínea }}></span>
                        <p className="text-[11px] font-bold text-slate-500 uppercase truncate">
                          {tooltipChart.item.titulo}
                        </p>
                      </div>
                      
                      <div className="space-y-1.5">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-semibold">Estado</span>
                          <span className="text-[12px] font-bold" style={{ color: tooltipChart.evento.colorEstado }}>
                            {tooltipChart.evento.estado}
                          </span>
                        </div>
                        
                        <div className="flex justify-between gap-4">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Fecha</span>
                            <span className="text-[12px] text-slate-700">{tooltipChart.evento.fechaStr}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Responsable</span>
                            <span className="text-[12px] text-slate-700">{tooltipChart.evento.responsable}</span>
                          </div>
                        </div>

                        {tooltipChart.evento.comentario && (
                          <div className="mt-2 pt-2 border-t border-slate-100">
                            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Comentario</span>
                            <p className="text-[11px] text-slate-600 italic leading-snug mt-0.5">
                              "{tooltipChart.evento.comentario}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>


            {/* LISTA DE ENTREGABLES */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
                   Lista de Entregables
                   {dataPaginada.length > 0 && (
                     <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[11px] font-semibold rounded border border-slate-200">
                       {dataPaginada.length} / {indicadores.total}
                     </span>
                   )}
                </h2>
              </div>

              {entregablesData.length === 0 ? (
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg text-center">
                   <Info size={24} className="text-slate-400 mx-auto mb-2" />
                   <p className="text-[13px] text-slate-500">No hay entregables registrados aún.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {dataPaginada.map((ent) => {
                    const isActive = expandidoId === ent.id;
                    const visualState = mapDataVisualVisualOnly(ent.estado);

                    return (
                      <div
                        key={ent.id}
                        onClick={() => !entregableSeleccionado && handleToggleExpand(ent.id)}
                        className={`transition-all duration-200 group w-full text-left flex flex-col relative rounded-lg cursor-pointer
                          ${isActive ? "bg-white border border-slate-300 shadow-md" : "bg-white border border-slate-200 shadow-sm hover:shadow-md"}`}
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg" style={{ backgroundColor: visualState.hexColorCode }} />

                        <div className="p-3 px-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                          <div className="flex-1">
                             <div className="flex items-center gap-2 mb-1 flex-wrap">
                               <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ color: visualState.hexColorCode, backgroundColor: `${visualState.hexColorCode}10` }}>
                                 {visualState.label}
                               </span>
                               <span className="text-[11px] text-slate-500">
                                 <span className="text-slate-700 font-medium">{ent.estudianteNombre}</span>
                               </span>
                             </div>
                             <h3 className="text-[14px] font-semibold text-slate-800">{ent.titulo}</h3>
                          </div>

                          <div className="sm:absolute right-3 top-3 sm:top-1/2 sm:-translate-y-1/2">
                             <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`} />
                          </div>
                        </div>

                        {/* EXPANDIDO */}
                        <div
                          className={`transition-all overflow-hidden bg-slate-50 border-t border-slate-100
                             ${isActive ? "opacity-100 py-3 px-4 max-h-[500px]" : "opacity-0 max-h-0 py-0 px-4"}`}
                           onClick={(e) => e.stopPropagation()}
                        >
                          <div className="grid md:grid-cols-2 gap-4">
                             
                             <div className="bg-white border border-slate-200 rounded-md p-3">
                                 <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-2">Descripción</h4>
                                 <p className="text-[13px] text-slate-600 mb-3">
                                    {ent.descripcion || "Sin descripción adicional."}
                                 </p>
                                 <a
                                  href={getSafeUrl(ent.archivo)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-[12px] font-medium text-blue-600 hover:text-blue-700 border border-blue-200 px-3 py-1.5 rounded-md bg-blue-50"
                                >
                                  Ver archivo <ExternalLink size={12} />
                                </a>
                             </div>

                             <div className="bg-white border border-slate-200 rounded-md p-3">
                                  <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-2">Acción requerida</h4>
                                  
                                  {ent.estado === 'PENDIENTE' && !entregableSeleccionado ? (
                                    <p className="text-[12px] text-slate-500 mb-3">Este entregable requiere su revisión y dictamen.</p>
                                  ) : (ent.estado !== 'PENDIENTE' && !entregableSeleccionado) && (
                                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                                        <span className="text-[12px] font-semibold" style={{ color: visualState.hexColorCode }}>{visualState.label}</span>
                                    </div>
                                  )}

                                  {ent.estado === 'PENDIENTE' && (
                                     <div className="mt-2">
                                        {entregableSeleccionado === ent.id ? (
                                            <div className="space-y-2">
                                              <textarea
                                                className="w-full text-[13px] text-slate-700 p-2 border border-slate-300 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                rows={3}
                                                placeholder="Describa los cambios o correcciones necesarias..."
                                                value={observacion}
                                                onChange={(e) => setObservacion(e.target.value)}
                                                autoFocus
                                              />
                                              <div className="flex gap-2 justify-end">
                                                <button onClick={() => setEntregableSeleccionado(null)} className="text-[12px] px-3 py-1.5 bg-slate-100 rounded-md">Cancelar</button>
                                                <button onClick={() => handleRevisar(ent.id, "RECHAZADO")} disabled={!observacion.trim()} className="text-[12px] px-3 py-1.5 bg-orange-600 text-white rounded-md disabled:opacity-50">
                                                  Enviar corrección
                                                </button>
                                              </div>
                                            </div>
                                        ) : (
                                           <div className="flex gap-2">
                                                <button
                                                  onClick={(e) => { e.stopPropagation(); handleRevisar(ent.id, "APROBADO")}}
                                                  disabled={isRevisando}
                                                  className="flex-1 text-[12px] font-semibold py-2 bg-emerald-600 text-white rounded-md"
                                                >
                                                  Aprobar
                                                </button>
                                                <button
                                                  onClick={(e) => abrirFormObservacion(e, ent.id)}
                                                  className="flex-1 text-[12px] font-semibold py-2 bg-white border border-orange-500 text-orange-600 rounded-md"
                                                >
                                                  Rechazar
                                                </button>
                                           </div>
                                        )}
                                     </div>
                                  )}
                             </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* PAGINACIÓN */}
              {totalPaginas > 1 && (
                 <div className="mt-6 flex justify-center">
                    <div className="flex gap-1 p-1 bg-white rounded-lg border border-slate-200">
                       {Array.from({ length: totalPaginas }).map((_, idx) => {
                          const pag = idx + 1;
                          return (
                            <button
                              key={pag}
                              onClick={() => { setPaginaActual(pag); setExpandidoId(null); setEntregableSeleccionado(null) }}
                              className={`text-[13px] font-semibold w-8 h-8 rounded-md transition-colors
                                ${paginaActual === pag ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                               {pag}
                            </button>
                          );
                       })}
                    </div>
                 </div>
              )}
            </div>
            
          </>
          
        )}
        
      </div>
      

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
      {/* Modal de confirmación de proyecto completado */}
      {mostrarModalCompletado && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "rgba(10,22,40,0.85)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "40px 32px 32px",
              maxWidth: "440px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
              fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif"
            }}
          >
            {/* Icono de éxito */}
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "#F0FDF4",
              border: "1px solid #BBF7D0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px"
            }}>
              <CheckCircle2 size={32} color="#16A34A" />
            </div>

            <h3 style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#0F1F3D",
              margin: "0 0 8px",
              letterSpacing: "-0.02em"
            }}>
              Proyecto completado
            </h3>
            <p style={{
              fontSize: "14px",
              color: "#6B7280",
              margin: "0 0 24px",
              lineHeight: 1.6
            }}>
              Todos los entregables han sido aprobados. ¿Quieres emitir el certificado ahora?
            </p>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => {
                  setMostrarModalCompletado(false);
                  navigate("/dashboard/mype/proyectos");
                }}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  borderRadius: "8px",
                  border: "1.5px solid #E5E7EB",
                  background: "#FFFFFF",
                  color: "#4B5563",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#F9FAFB";
                  e.currentTarget.style.borderColor = "#D1D5DB";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FFFFFF";
                  e.currentTarget.style.borderColor = "#E5E7EB";
                }}
              >
                Más tarde
              </button>
              <button
                onClick={() => {
                  setMostrarModalCompletado(false);
                  handleEmitirCertificado();
                }}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#0F1F3D",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1B6FE8";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(27,111,232,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#0F1F3D";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Sí, emitir ahora
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {mostrarModalCalificacion && estudiantesParaCalificar[indiceEstudiante] && (
  <RateUserModal
    open={mostrarModalCalificacion}
    onClose={() => {
      setMostrarModalCalificacion(false);
      setEstudiantesParaCalificar([]);
      setIndiceEstudiante(0);
    }}
    pendiente={{
      proyectoId: Number(proyectoId),
      calificadoId: estudiantesParaCalificar[indiceEstudiante]?.estudianteId,
      calificadoNombre: estudiantesParaCalificar[indiceEstudiante]?.estudianteNombre,
      proyectoTitulo: proyecto?.titulo || "",
    }}
    onSuccess={handleCalificacionCompletada}
    closeOnSuccess={false}
  />
)}
      
    <AnimatePresence>
      {mostrarModalCertificado && proyectoParaCertificar && (
        <FormalizacionDocumentalOverlay
          proyectosCompletados={[proyectoParaCertificar]}
          mypeNombre={mypeNombre}
          rucMype={rucMype}
          gerenteNombre={gerenteNombre}
          certificadosEmitidos={[]}
          onClose={() => setMostrarModalCertificado(false)}
          onSuccess={async () => {
            setMostrarModalCertificado(false);
            navigate("/dashboard/mype/certificados");
          }}
        />
      )}
    </AnimatePresence>
  </MypeLayout>
    
  );
}

/* ==================================================== 
   SUB-COMPONENTES
==================================================== */

const KPICard = ({ title, value, label, baseBorderColor = "border-l-slate-200", valColor = "text-slate-800" }) => (
  <div className={`bg-white pl-3 py-2 pr-3 shadow-sm rounded-lg border flex lg:w-full min-w-[140px] border-slate-200 ${baseBorderColor}`}>
      <div className="flex-1">
          <p className="text-[10px] font-bold uppercase text-slate-400">{title}</p>
          <div className={`text-xl font-bold ${valColor}`}>
            {value < 10 && value > 0 ? `0${value}` : value}
          </div>
          <span className="text-[10px] text-slate-500">{label}</span>
      </div>
  </div>
);

function mapDataVisualVisualOnly(dbStateStr) {
  switch (dbStateStr) {
    case 'APROBADO':
       return { label: 'Aprobado', hexColorCode: '#10B981', advancePorcentage: 100 };
    case 'RECHAZADO':
       return { label: 'Rechazado', hexColorCode: '#F97316', advancePorcentage: 40 };
    case 'PENDIENTE':
    default:
       return { label: 'Pendiente', hexColorCode: '#3B82F6', advancePorcentage: 75 };
  }
}

/**
 * GRÁFICO TIMELINE DE AUDITORÍA
 * Genera trazabilidad histórica independiente para cada entregable.
 * Garantiza datos si el backend solo devuelve el estado actual.
 */
/**
 * GRÁFICO TIMELINE DE AUDITORÍA - VERSIÓN CON DATOS REALES
 * Usa el historial real del backend en lugar de generar datos ficticios
 */
function TimelineAuditoriaGrafico({ data, onHoverNode }) {
  const PALETTE = ["#3B82F6", "#8B5CF6", "#EC4899", "#14B8A6", "#F59E0B", "#EF4444", "#6366F1", "#10B981"];
  
  // ✅ USAR HISTORIAL REAL del backend
  const timelineData = useMemo(() => {
    return data.map((ent, idx) => {
      const colorLínea = PALETTE[idx % PALETTE.length];
      
      // Obtener eventos del historial real
      let eventos = [];
      
      if (ent.historialReal && ent.historialReal.length > 0) {
        // ✅ USAR HISTORIAL REAL
        eventos = [...ent.historialReal];
      } else if (ent.estado) {
        // Fallback: si no hay historial, crear un evento con el estado actual
        eventos = [{
          id: `estado-${ent.id}`,
          estado: ent.estado,
          fechaObj: ent.fechaEntrega ? new Date(ent.fechaEntrega) : new Date(),
          fechaStr: ent.fechaEntrega ? new Date(ent.fechaEntrega).toLocaleDateString('es-ES') : 'Reciente',
          comentario: ent.observaciones || 'Estado actual',
          responsable: ent.subidoPorNombre || ent.estudianteNombre || 'Estudiante',
          colorEstado: getColorEstado(ent.estado)
        }];
      }
      
      // Ordenar cronológicamente (del más antiguo al más nuevo)
      eventos.sort((a, b) => a.fechaObj - b.fechaObj);
      
      return {
        ...ent,
        colorLínea,
        eventos
      };
    });
  }, [data]);

  // Si no hay datos o todos los eventos están vacíos
  if (timelineData.length === 0 || timelineData.every(t => t.eventos.length === 0)) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <div className="text-center">
          <Info size={32} className="text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No hay historial de auditoría disponible</p>
          <p className="text-xs text-slate-400 mt-1">El historial se generará al revisar entregables</p>
        </div>
      </div>
    );
  }

  // Calcular fechas reales para la escala
  const allDates = timelineData.flatMap(t => t.eventos.map(e => e.fechaObj?.getTime())).filter(Boolean);
  const minDate = allDates.length > 0 ? Math.min(...allDates) : Date.now() - 30 * 24 * 60 * 60 * 1000;
  const maxDate = allDates.length > 0 ? Math.max(...allDates) : Date.now();
  const timeSpan = Math.max(maxDate - minDate, 1000 * 60 * 60 * 24 * 7); // Mínimo 7 días

  // Dimensiones del SVG
  const LABEL_WIDTH = 140;
  const ROW_HEIGHT = 50;
  const HEADER_HEIGHT = 30;
  const WIDTH = Math.max(900, timelineData.length * 160);
  const HEIGHT = HEADER_HEIGHT + (timelineData.length * ROW_HEIGHT) + 40;

  const getX = (date) => {
    if (!date) return LABEL_WIDTH + 40;
    const ratio = (date.getTime() - minDate) / timeSpan;
    return LABEL_WIDTH + 40 + ratio * (WIDTH - LABEL_WIDTH - 80);
  };

  const getFechaEscala = (offset) => {
    const date = new Date(minDate + (offset / 100) * timeSpan);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  const handleMouseMove = (e, item, evento, colorLínea) => {
    onHoverNode({
      x: e.clientX,
      y: e.clientY,
      item,
      evento,
      colorLínea
    });
  };

  return (
    <div className="w-full h-full" onMouseLeave={() => onHoverNode(null)}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width="100%" height={HEIGHT} className="block overflow-visible" style={{ minHeight: 400 }}>
        
        {/* Línea base del timeline */}
        <line x1={LABEL_WIDTH} y1={HEADER_HEIGHT} x2={WIDTH - 20} y2={HEADER_HEIGHT} stroke="#CBD5E1" strokeWidth="1" />
        
        {/* Marcadores de tiempo (0%, 25%, 50%, 75%, 100%) */}
        {[0, 25, 50, 75, 100].map(percent => (
          <g key={percent}>
            <line 
              x1={LABEL_WIDTH + 40 + (percent / 100) * (WIDTH - LABEL_WIDTH - 80)} 
              y1={HEADER_HEIGHT - 5} 
              x2={LABEL_WIDTH + 40 + (percent / 100) * (WIDTH - LABEL_WIDTH - 80)} 
              y2={HEADER_HEIGHT + 5} 
              stroke="#CBD5E1" 
              strokeWidth="1" 
            />
            <text 
              x={LABEL_WIDTH + 40 + (percent / 100) * (WIDTH - LABEL_WIDTH - 80)} 
              y={HEADER_HEIGHT - 8} 
              fontSize="9" 
              fill="#94A3B8" 
              textAnchor="middle"
            >
              {getFechaEscala(percent)}
            </text>
          </g>
        ))}

        {/* Filas de entregables */}
        {timelineData.map((row, idx) => {
          const yCenter = HEADER_HEIGHT + (idx * ROW_HEIGHT) + (ROW_HEIGHT / 2);
          const firstX = row.eventos.length > 0 ? getX(row.eventos[0].fechaObj) : LABEL_WIDTH + 40;
          const lastX = row.eventos.length > 0 ? getX(row.eventos[row.eventos.length - 1].fechaObj) : LABEL_WIDTH + 40;
          
          return (
            <g key={row.id}>
              {/* Fila alternada (fondo) */}
              {idx % 2 === 0 && (
                <rect x="0" y={yCenter - ROW_HEIGHT/2} width={WIDTH} height={ROW_HEIGHT} fill="#F8FAFC" rx="4" />
              )}
              
              {/* Nombre del entregable */}
              <text x="10" y={yCenter + 4} fontSize="11" fill="#1E293B" fontWeight="600" className="cursor-default">
                {row.titulo?.length > 25 ? row.titulo.substring(0, 25) + '...' : row.titulo || 'Sin título'}
                <title>{row.titulo}</title>
              </text>
              
              {/* Línea de conexión entre primer y último evento */}
              <line x1={firstX} y1={yCenter} x2={lastX} y2={yCenter} stroke={row.colorLínea} strokeWidth="2" strokeOpacity="0.3" strokeDasharray="4 4" />
              
              {/* Eventos (puntos en la línea de tiempo) */}
              {row.eventos.map((ev, evIdx) => {
                const cx = getX(ev.fechaObj);
                const isLast = evIdx === row.eventos.length - 1;
                const isFirst = evIdx === 0;
                
                return (
                  <g 
                    key={ev.id} 
                    className="cursor-pointer transition-transform hover:scale-110 origin-center"
                    style={{ transformOrigin: `${cx}px ${yCenter}px`, cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      handleMouseMove(e, row, ev, row.colorLínea);
                    }}
                    onMouseMove={(e) => {
                      e.stopPropagation();
                      handleMouseMove(e, row, ev, row.colorLínea);
                    }}
                  >
                    {/* Círculo exterior (solo para el último evento) */}
                    {isLast && (
                      <circle cx={cx} cy={yCenter} r="8" fill={ev.colorEstado} fillOpacity="0.15" />
                    )}
                    
                    {/* Círculo interior principal */}
                    <circle 
                      cx={cx} 
                      cy={yCenter} 
                      r="5" 
                      fill="#FFFFFF" 
                      stroke={ev.colorEstado} 
                      strokeWidth="2.5"
                    />
                    
                    {/* Etiqueta de fecha para el primer evento */}
                    {isFirst && (
                      <text x={cx} y={yCenter - 12} fontSize="8" fill="#64748B" textAnchor="middle" fontWeight="500">
                        {ev.fechaStr?.split(',')[0] || ''}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-slate-100 justify-center">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#64748B]"></span>
          <span className="text-[10px] text-slate-500">Registrado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#3B82F6]"></span>
          <span className="text-[10px] text-slate-500">Pendiente</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#F97316]"></span>
          <span className="text-[10px] text-slate-500">Rechazado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#10B981]"></span>
          <span className="text-[10px] text-slate-500">Aprobado</span>
        </div>
      </div>
    </div>
  );
}

// Función auxiliar para colores de estado
function getColorEstado(estado) {
  switch(estado) {
    case 'APROBADO': return '#10B981';
    case 'RECHAZADO': return '#F97316';
    case 'PENDIENTE': return '#3B82F6';
    case 'REGISTRADO': return '#64748B';
    default: return '#94A3B8';
  }
}