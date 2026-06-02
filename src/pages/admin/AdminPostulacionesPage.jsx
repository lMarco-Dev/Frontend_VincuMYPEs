import React, { useState, useEffect } from "react";
import { useAdminProyectos } from "@features/admin/useAdminProyectos";
import { usePostulaciones, useCambiarEstadoPostulacion } from "@features/proyecto-postulaciones/usePostulaciones";
import { Loader2, Search, Users, Building2, Eye, CheckCircle2, XCircle, User } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";

const ESTADO_BADGE = {
  PENDIENTE: "bg-amber-50 text-amber-700 border-amber-200",
  PRESELECCIONADO: "bg-blue-50 text-blue-700 border-blue-200",
  VALIDADO_MYPE: "bg-purple-50 text-purple-700 border-purple-200",
  CONFIRMADO: "bg-emerald-50 text-emerald-700 border-emerald-200",
  RECHAZADO: "bg-red-50 text-red-600 border-red-200",
  RETIRADO: "bg-slate-100 text-slate-500 border-slate-200",
  EXPIRADO: "bg-orange-50 text-orange-600 border-orange-200",
};

const getEstadoBadge = (estado) => (
  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${ESTADO_BADGE[estado] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
    {estado.replace("_", " ")}
  </span>
);

const iniciales = (nombre) =>
  nombre?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() ?? "?";

export default function AdminPostulacionesPage() {
  const [searchParams] = useSearchParams();
  const proyectoIdFromUrl = searchParams.get("proyectoId");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (proyectoIdFromUrl) {
      setSelectedProjectId(Number(proyectoIdFromUrl));
    }
  }, [proyectoIdFromUrl]);

  const { proyectos, isLoading } = useAdminProyectos();
  const { postulaciones, isLoading: loadingPostulantes } = usePostulaciones(selectedProjectId);
  const { cambiarEstado, isLoading: isCambiando, errorActual } = useCambiarEstadoPostulacion(selectedProjectId);

  const filteredProyectos = proyectos
    ?.filter(p => p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || p.mypeNombre?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (a.postulantesPendientes > 0 && b.postulantesPendientes === 0) return -1;
      if (b.postulantesPendientes > 0 && a.postulantesPendientes === 0) return 1;
      return b.id - a.id;
    }) || [];

  const selectedProject = proyectos?.find(p => p.id === selectedProjectId);
  const pendientes = postulaciones?.filter(p => p.estado === "PENDIENTE") || [];
  const historial = postulaciones?.filter(p => p.estado !== "PENDIENTE") || [];

  const handlePreseleccionar = (postulacionId) => {
    cambiarEstado({ proyectoId: selectedProjectId, postulacionId, estado: "PRESELECCIONADO" });
  };

  const handleRechazar = (postulacionId) => {
    cambiarEstado({ proyectoId: selectedProjectId, postulacionId, estado: "RECHAZADO" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-0 animate-fade-in">
      <div className="w-96 border-r border-slate-200 bg-white flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Proyectos con postulantes</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Buscar proyecto o MYPE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredProyectos.map((proyecto) => (
            <button
              key={proyecto.id}
              onClick={() => setSelectedProjectId(proyecto.id)}
              className={`w-full text-left p-4 border-b border-slate-50 transition-colors hover:bg-slate-50 ${selectedProjectId === proyecto.id ? "bg-indigo-50 border-l-4 border-l-primary" : ""}`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-bold text-slate-900 truncate pr-2">{proyecto.titulo}</p>
                {proyecto.postulantesPendientes > 0 && (
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-[10px] font-bold animate-pulse">
                    {proyecto.postulantesPendientes}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Building2 size={12} /> {proyecto.mypeNombre}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs text-slate-400">
                  <Users size={12} className="inline mr-1" />
                  {proyecto.cuposAceptados}/{proyecto.cuposTotales}
                </span>
                {proyecto.gestionCedida && (
                  <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Cedida</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-slate-50 overflow-y-auto">
        {!selectedProjectId ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Users size={48} className="mb-4" />
            <p className="text-lg font-semibold">Selecciona un proyecto</p>
            <p className="text-sm">Para ver los postulantes</p>
          </div>
        ) : loadingPostulantes ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : (
          <div className="p-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-6">
              <h3 className="text-lg font-bold text-slate-900">{selectedProject?.titulo}</h3>
              <p className="text-sm text-slate-500">{selectedProject?.mypeNombre}</p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className="font-bold">Cupos: {selectedProject?.cuposAceptados}/{selectedProject?.cuposTotales}</span>
                <span className="text-amber-600 font-bold">Pendientes: {pendientes.length}</span>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <button className={`px-4 py-2 rounded-lg text-sm font-bold ${pendientes.length > 0 ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-500"}`}>
                Por evaluar ({pendientes.length})
              </button>
              <button className="px-4 py-2 rounded-lg text-sm font-bold bg-slate-200 text-slate-500">
                Historial ({historial.length})
              </button>
            </div>

            {pendientes.length > 0 && (
              <div className="space-y-3 mb-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pendientes de revisión</p>
                {pendientes.map((p) => (
                  <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                        {iniciales(p.estudianteNombre)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{p.estudianteNombre}</p>
                        <p className="text-xs text-slate-500">{p.mensajePostulacion || "Sin mensaje"}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <Link
                            to={`/estudiante/${p.estudianteId}`}
                            className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1"
                          >
                            <User size={12} /> Ver perfil
                          </Link>
                          {p.estudianteCvUrl && (
                            <a
                              href={p.estudianteCvUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1"
                            >
                              <Eye size={12} /> Ver CV
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.estudianteOcupado ? (
                        <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-xs font-bold border border-orange-200">
                          Ocupado
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => handlePreseleccionar(p.id)}
                            disabled={isCambiando}
                            className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 disabled:opacity-50"
                          >
                            <CheckCircle2 size={14} className="inline mr-1" /> Preseleccionar
                          </button>
                          <button
                            onClick={() => handleRechazar(p.id)}
                            disabled={isCambiando}
                            className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white disabled:opacity-50"
                          >
                            <XCircle size={14} className="inline mr-1" /> Rechazar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {historial.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Historial de notificados</p>
                {historial.map((p) => (
                  <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold shrink-0">
                        {iniciales(p.estudianteNombre)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{p.estudianteNombre}</p>
                        <p className="text-xs text-slate-400">{p.mensajePostulacion || "Sin mensaje"}</p>
                        <Link
                          to={`/estudiante/${p.estudianteId}`}
                          className="text-xs text-primary font-bold hover:underline mt-1 inline-flex items-center gap-1"
                        >
                          <User size={12} /> Ver perfil
                        </Link>
                      </div>
                    </div>
                    {getEstadoBadge(p.estado)}
                  </div>
                ))}
              </div>
            )}

            {postulaciones?.length === 0 && (
              <div className="text-center py-12">
                <Users size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm text-slate-500">Nadie se ha postulado aún</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast de error opcional para 409 */}
      {errorActual && errorActual.tipo === "ocupado" && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg shadow-lg z-50">
          {errorActual.mensaje}
        </div>
      )}
    </div>
  );
}