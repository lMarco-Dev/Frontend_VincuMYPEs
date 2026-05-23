import React, { useState } from "react";
import {
  useAdminProyectos,
  usePostulacionesAdmin,
} from "@features/admin/useAdminProyectos";
import { Loader2 } from "lucide-react";
import {
  Search,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Users,
  Building2,
  ArrowRightLeft,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ESTADO_LABELS = {
  TODOS: "Todos",
  BORRADOR: "Borrador",
  PENDIENTE: "Pendiente",
  EN_DESARROLLO: "En Desarrollo",
  EN_REVISION: "En Revisión",
  COMPLETADO: "Completado",
};

const getEstadoBadge = (estado) => {
  const styles = {
    BORRADOR: "bg-slate-100 text-slate-600 border-slate-200",
    PENDIENTE: "bg-amber-50 text-amber-700 border-amber-200",
    EN_DESARROLLO: "bg-blue-50 text-blue-700 border-blue-200",
    EN_REVISION: "bg-purple-50 text-purple-700 border-purple-200",
    COMPLETADO: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${styles[estado] || styles.BORRADOR}`}
    >
      {ESTADO_LABELS[estado] || estado.replace("_", " ")}
    </span>
  );
};

// ── Cuerpo del modal con postulantes reales ──────────────────
function ModalPostulantesBody({ proyectoId, onClose }) {
  const { postulaciones, isLoading, cambiarEstado, isCambiando } =
    usePostulacionesAdmin(proyectoId);

  const pendientes = postulaciones.filter((p) => p.estado === "PENDIENTE");
  const otros = postulaciones.filter((p) => p.estado !== "PENDIENTE");

  const handleAceptarPostulante = (postulacion) => {
    if (
      window.confirm(
        `¿Preseleccionar a ${postulacion.estudianteNombre}? Se enviará a la MYPE para validación.`,
      )
    ) {
      cambiarEstado({
        proyectoId: Number(proyectoId),
        postulacionId: Number(postulacion.id),
        estado: "PRESELECCIONADO",
      });
    }
  };

  const handleRechazarPostulante = (postulacion) => {
    if (
      window.confirm(
        `¿Seguro que deseas rechazar la postulación de ${postulacion.estudianteNombre}?`,
      )
    ) {
      cambiarEstado({
        proyectoId: Number(proyectoId),
        postulacionId: Number(postulacion.id),
        estado: "RECHAZADO",
      });
    }
  };

  const iniciales = (nombre) =>
    nombre
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";

  const badgeEstado = (estado) => {
    const map = {
      PENDIENTE: "bg-amber-50 text-amber-700 border-amber-200",
      PRESELECCIONADO: "bg-blue-50 text-blue-700 border-blue-200",
      VALIDADO_MYPE: "bg-purple-50 text-purple-700 border-purple-200",
      CONFIRMADO: "bg-emerald-50 text-emerald-700 border-emerald-200",
      RECHAZADO: "bg-red-50 text-red-600 border-red-200",
      RETIRADO: "bg-slate-100 text-slate-500 border-slate-200",
      EXPIRADO: "bg-orange-50 text-orange-600 border-orange-200",
    };
    return map[estado] ?? "bg-slate-100 text-slate-500 border-slate-200";
  };

  return (
    <>
      <div className="p-6 overflow-y-auto flex-1 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        ) : postulaciones.length === 0 ? (
          <div className="text-center py-10">
            <Users size={28} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm text-slate-500 font-medium">
              Nadie se ha postulado a este proyecto todavía
            </p>
          </div>
        ) : (
          <>
            {/* Pendientes primero */}
            {pendientes.length > 0 && (
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                  Pendientes de revisión ({pendientes.length})
                </p>
                {pendientes.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 bg-amber-50/50 border border-amber-100 rounded-xl mb-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                        {iniciales(p.estudianteNombre)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {p.estudianteNombre}
                        </p>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {p.mensajePostulacion || "Sin mensaje"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <button
                        onClick={() => handleAceptarPostulante(p)}
                        disabled={isCambiando}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle2 size={13} /> Aceptar
                      </button>
                      <button
                        onClick={() => handleRechazarPostulante(p)}
                        disabled={isCambiando}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                      >
                        <XCircle size={13} /> Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Historial */}
            {otros.length > 0 && (
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 mt-4">
                  Historial ({otros.length})
                </p>
                {otros.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl mb-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
                        {iniciales(p.estudianteNombre)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">
                          {p.estudianteNombre}
                        </p>
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {p.mensajePostulacion || "Sin mensaje"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${badgeEstado(p.estado)}`}
                    >
                      {p.estado}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 flex justify-end">
        <button
          onClick={onClose}
          className="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          Cerrar
        </button>
      </div>
    </>
  );
}

// ── Cuerpo del modal de auditoría con selección de estudiante ──
function ModalAuditoriaBody({ proyecto, onClose, onConfirm, isAuditando }) {
  const { postulaciones, isLoading } = usePostulacionesAdmin(proyecto?.id);
  const [selectedPostulacionId, setSelectedPostulacionId] = useState("");

  const activos = postulaciones.filter(
    (p) => p.estado === "CONFIRMADO" || p.estado === "VALIDADO_MYPE"
  );

  React.useEffect(() => {
    if (activos.length === 1) {
      setSelectedPostulacionId(activos[0].id.toString());
    } else if (activos.length === 0) {
      setSelectedPostulacionId("1");
    }
  }, [activos]);

  const handleConfirmar = () => {
    if (!selectedPostulacionId) {
      alert("Por favor, selecciona al estudiante que deseas expulsar.");
      return;
    }
    onConfirm(Number(selectedPostulacionId));
  };

  return (
    <div className="p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle size={32} />
      </div>
      <h3 className="text-xl font-extrabold text-slate-900 mb-2">
        Auditoría de Abandono
      </h3>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      ) : activos.length === 0 ? (
        <div className="my-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-left">
          <p className="text-sm font-semibold text-amber-800">
            No se encontraron estudiantes activos en este proyecto.
          </p>
          <p className="text-xs text-amber-700 mt-1">
            Si continúas, se intentará usar la postulación por defecto.
          </p>
        </div>
      ) : (
        <div className="my-4 text-left">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
            Seleccionar estudiante a expulsar:
          </label>
          <div className="space-y-2">
            {activos.map((p) => (
              <label
                key={p.id}
                className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${selectedPostulacionId === p.id.toString()
                  ? "bg-red-50/50 border-red-200 ring-2 ring-red-500/15"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100/70"
                  }`}
              >
                <input
                  type="radio"
                  name="estudianteExpulsar"
                  value={p.id}
                  checked={selectedPostulacionId === p.id.toString()}
                  onChange={(e) => setSelectedPostulacionId(e.target.value)}
                  className="text-red-600 focus:ring-red-500"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {p.estudianteNombre}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Estado postulación: {p.estado}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-slate-500 font-medium mb-6">
        Estás a punto de expulsar a un estudiante del proyecto{" "}
        <strong className="text-slate-800">
          "{proyecto?.titulo}"
        </strong>{" "}
        reportado por la MYPE.
      </p>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-3 mb-6">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Flujo de Reapertura Dinámica:
        </h4>
        <ul className="text-sm text-slate-600 font-medium space-y-2">
          <li className="flex items-start gap-2">
            <XCircle
              size={16}
              className="text-red-400 shrink-0 mt-0.5"
            />
            El estudiante seleccionado será marcado como CANCELADO (RECHAZADO).
          </li>
          <li className="flex items-start gap-2">
            <RefreshCw
              size={16}
              className="text-amber-500 shrink-0 mt-0.5"
            />
            El proyecto retrocederá al estado PENDIENTE en la bolsa pública.
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2
              size={16}
              className="text-emerald-500 shrink-0 mt-0.5"
            />
            Se notificará automáticamente a los postulantes previamente rechazados.
          </li>
        </ul>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirmar}
          disabled={isAuditando || (activos.length > 0 && !selectedPostulacionId)}
          className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 disabled:opacity-50"
        >
          {isAuditando ? "Procesando..." : "Confirmar Expulsión"}
        </button>
      </div>
    </div>
  );
}

// ── Cuerpo del modal de ceder gestión ──────────────────
function ModalCederBody({ proyecto, onClose, onConfirm }) {
  return (
    <div className="p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4">
        <ArrowRightLeft size={30} />
      </div>
      <h3 className="text-xl font-extrabold text-slate-900 mb-2">
        Ceder Gestión de Postulantes
      </h3>
      <p className="text-sm text-slate-500 font-medium mb-6">
        ¿Estás seguro de ceder la gestión a la MYPE para el proyecto{" "}
        <strong className="text-slate-800">
          "{proyecto?.titulo}"
        </strong>?
      </p>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-3 mb-6">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          ¿Qué implica esta acción?
        </h4>
        <ul className="text-xs text-slate-600 font-medium space-y-2">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
            La MYPE podrá revisar y aceptar a los estudiantes de manera autónoma sin tu validación intermedia.
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
            El proceso se agiliza ya que la selección se realiza directamente por la empresa.
          </li>
        </ul>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-3 bg-amber-600 text-white rounded-xl text-sm font-bold hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/20"
        >
          Sí, ceder gestión
        </button>
      </div>
    </div>
  );
}

// =========================================================================
// COMPONENTE PRINCIPAL
// =========================================================================
export default function AdminProyectosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const { proyectos, isLoading, cederGestion, auditarAbandono, isAuditando } =
    useAdminProyectos();

  const [modalPostulantes, setModalPostulantes] = useState({
    isOpen: false,
    proyecto: null,
  });
  const [modalAuditoria, setModalAuditoria] = useState({
    isOpen: false,
    proyecto: null,
  });
  const [modalCeder, setModalCeder] = useState({
    isOpen: false,
    proyecto: null,
  });

  const getPriorityScore = (p) => {
    if ((p.postulantesPendientes || 0) > 0) return 1;
    const cuposAceptados = p.cuposAceptados || 0;
    const cuposTotales = p.cuposTotales || 0;
    if (cuposAceptados > 0 && cuposAceptados < cuposTotales && p.estado !== "COMPLETADO" && p.estado !== "BORRADOR") {
      return 2;
    }
    if (p.estado === "PENDIENTE" && cuposAceptados === 0) return 3;
    if ((p.estado === "EN_DESARROLLO" || p.estado === "EN_REVISION") && cuposAceptados >= cuposTotales) return 4;
    return 5;
  };

  const filteredProyectos =
    proyectos?.filter(
      (p) => {
        const matchesSearch = p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.mypeNombre && p.mypeNombre.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesEstado = filtroEstado === "TODOS" || p.estado === filtroEstado;
        return matchesSearch && matchesEstado;
      }
    ).sort((a, b) => {
      const pendA = a.postulantesPendientes || 0;
      const pendB = b.postulantesPendientes || 0;

      // Si uno tiene pendientes y el otro no, el que tiene va primero
      if (pendA > 0 && pendB === 0) return -1;
      if (pendB > 0 && pendA === 0) return 1;

      // Si ambos tienen pendientes, ordenar por cantidad de pendientes (mayor a menor)
      if (pendA > 0 && pendB > 0) {
        return pendB - pendA;
      }

      // Si ninguno tiene pendientes, mantener el orden por ID descendente (más nuevos primero)
      return b.id - a.id;
    }) || [];

  const handleConfirmarCeder = () => {
    if (modalCeder.proyecto) {
      cederGestion(modalCeder.proyecto.id);
    }
    setModalCeder({ isOpen: false, proyecto: null });
  };

  const handleConfirmarAuditoria = (postulacionId) => {
    auditarAbandono({
      proyectoId: modalAuditoria.proyecto.id,
      postulacionId: postulacionId,
    });
    setModalAuditoria({ isOpen: false, proyecto: null });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-slate-500 font-medium">Cargando proyectos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
            Control de Proyectos
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Audita las ofertas, clasifica estudiantes y gestiona reaperturas
            dinámicas.
          </p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200 self-stretch sm:self-auto overflow-x-auto">
          {["TODOS", "BORRADOR", "PENDIENTE", "EN_DESARROLLO", "EN_REVISION", "COMPLETADO"].map((estado) => (
            <button
              key={estado}
              onClick={() => setFiltroEstado(estado)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filtroEstado === estado
                ? "bg-white text-primary shadow-sm"
                : "text-slate-500 hover:text-slate-700"
                }`}
            >
              {ESTADO_LABELS[estado] || estado}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-md w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por título u organización..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Proyecto / MYPE
                </th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Estado
                </th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Cupos
                </th>
                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProyectos.map((proyecto) => (
                <tr
                  key={proyecto.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900 mb-0.5 flex items-center flex-wrap gap-2">
                      {proyecto.titulo}
                      {proyecto.postulantesPendientes > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-200 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                          {proyecto.postulantesPendientes} en espera
                        </span>
                      )}
                    </p>
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Building2 size={12} /> {proyecto.mypeNombre}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {getEstadoBadge(proyecto.estado)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-slate-400" />
                      <span className="text-sm font-bold text-slate-700">
                        {proyecto.cuposAceptados}{" "}
                        <span className="text-slate-400 font-medium">
                          / {proyecto.cuposTotales}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {proyecto.estado === "PENDIENTE" && (
                        <>
                          <button
                            onClick={() =>
                              setModalPostulantes({ isOpen: true, proyecto })
                            }
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${proyecto.postulantesPendientes > 0
                              ? "bg-orange-500 text-white border-orange-600 hover:bg-orange-600 hover:border-orange-700 shadow-md shadow-orange-500/10"
                              : "bg-indigo-50 text-primary border-indigo-100 hover:bg-primary hover:text-white"
                              }`}
                          >
                            <Eye size={14} />
                            {proyecto.postulantesPendientes > 0
                              ? `Revisar (${proyecto.postulantesPendientes})`
                              : "Revisar"}
                          </button>

                          {proyecto.gestionCedida ? (
                            <span
                              className="px-2 py-1.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-lg border border-slate-200 flex items-center"
                              title="La MYPE se está encargando de aceptar postulantes"
                            >
                              Gestión Cedida
                            </span>
                          ) : (
                            <button
                              onClick={() => setModalCeder({ isOpen: true, proyecto })}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200"
                              title="Ceder gestión de postulantes a la MYPE"
                            >
                              <ArrowRightLeft size={16} />
                            </button>
                          )}
                        </>
                      )}

                      {proyecto.estado === "EN_DESARROLLO" && (
                        <button
                          onClick={() =>
                            setModalAuditoria({ isOpen: true, proyecto })
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-colors"
                        >
                          <AlertTriangle size={14} /> Auditar / Liberar
                        </button>
                      )}

                      {proyecto.estado === "COMPLETADO" && (
                        <span className="text-xs font-bold text-slate-400 px-3 py-1.5">
                          Sin acciones
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProyectos.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No se encontraron proyectos en el sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: REVISIÓN DE POSTULANTES — conectado al backend
          ========================================================================= */}
      <AnimatePresence>
        {modalPostulantes.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() =>
                setModalPostulantes({ isOpen: false, proyecto: null })
              }
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 flex flex-col max-h-[85vh]"
            >
              {/* Header del modal */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Postulantes en Espera
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Proyecto: {modalPostulantes.proyecto?.titulo}
                  </p>
                </div>
                <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg flex items-center gap-2 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Vacantes libres:
                  </span>
                  <span className="text-sm font-extrabold text-primary">
                    {modalPostulantes.proyecto?.cuposTotales -
                      modalPostulantes.proyecto?.cuposAceptados}
                  </span>
                </div>
              </div>

              {/* Cuerpo conectado */}
              <ModalPostulantesBody
                proyectoId={modalPostulantes.proyecto?.id}
                onClose={() =>
                  setModalPostulantes({ isOpen: false, proyecto: null })
                }
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 2: REAPERTURA DINÁMICA — sin cambios
          ========================================================================= */}
      <AnimatePresence>
        {modalAuditoria.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() =>
                setModalAuditoria({ isOpen: false, proyecto: null })
              }
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10"
            >
              <ModalAuditoriaBody
                proyecto={modalAuditoria.proyecto}
                onClose={() => setModalAuditoria({ isOpen: false, proyecto: null })}
                onConfirm={handleConfirmarAuditoria}
                isAuditando={isAuditando}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 3: CONFIRMACIÓN DE CEDER GESTIÓN — custom modal
          ========================================================================= */}
      <AnimatePresence>
        {modalCeder.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() =>
                setModalCeder({ isOpen: false, proyecto: null })
              }
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10"
            >
              <ModalCederBody
                proyecto={modalCeder.proyecto}
                onClose={() => setModalCeder({ isOpen: false, proyecto: null })}
                onConfirm={handleConfirmarCeder}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
