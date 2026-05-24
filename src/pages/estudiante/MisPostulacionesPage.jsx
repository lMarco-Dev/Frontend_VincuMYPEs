import React from "react";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Building2,
  Calendar,
  Lightbulb,
  TrendingUp,
  ClipboardList,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { OfertaAceptadaBanner } from "@/features/postulaciones-list/OfertaAceptadaBanner";
import { useMisPostulaciones } from "@features/postulaciones-list/useMisPostulaciones";

const MisPostulacionesPage = () => {
  const {
    data: postulaciones = [],
    isLoading,
    isError,
    error,
  } = useMisPostulaciones();

  // ── Badge de estado actualizado con flujo trilateral ────────
  const getStatusStyle = (estado) => {
    switch (estado) {
      case "CONFIRMADO":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
          icon: <CheckCircle2 size={14} className="text-emerald-600" />,
          label: "Confirmado ✓✓",
        };
      case "VALIDADO_MYPE":
        return {
          bg: "bg-teal-50 text-teal-700 border-teal-100",
          icon: (
            <CheckCircle2 size={14} className="text-teal-600 animate-pulse" />
          ),
          label: "Aceptado — confirma ahora",
        };
      case "PRESELECCIONADO":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-100",
          icon: <Clock size={14} className="text-blue-500 animate-pulse" />,
          label: "Preseleccionado",
        };
      case "RECHAZADO":
        return {
          bg: "bg-red-50 text-red-700 border-red-100",
          icon: <XCircle size={14} className="text-red-600" />,
          label: "No seleccionado",
        };
      case "RETIRADO":
        return {
          bg: "bg-slate-50 text-slate-500 border-slate-100",
          icon: <XCircle size={14} className="text-slate-400" />,
          label: "Retirado",
        };
      case "EXPIRADO":
        return {
          bg: "bg-orange-50 text-orange-600 border-orange-100",
          icon: <Clock size={14} className="text-orange-400" />,
          label: "Expirado",
        };
      case "PENDIENTE":
      default:
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-100",
          icon: (
            <Clock
              size={14}
              className="text-amber-600 animate-spin"
              style={{ animationDuration: "3s" }}
            />
          ),
          label: "En revisión",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
        <svg className="animate-spin h-6 w-6 text-primary" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="font-semibold text-sm">
          Cargando tus postulaciones...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 lg:p-12 lg:pt-0 flex items-center justify-center min-h-[400px]">
        <div className="text-red-500 bg-red-50 p-5 rounded-2xl border border-red-100 max-w-md text-center">
          <p className="font-bold mb-1">Error al cargar las postulaciones</p>
          <p className="text-sm">
            {error.response?.data?.message ||
              error.message ||
              "Error desconocido"}
          </p>
        </div>
      </div>
    );
  }

  // ── Estadísticas con los nuevos estados ─────────────────────
  const total = postulaciones.length;
  const enRevision = postulaciones.filter((p) =>
    ["PENDIENTE", "PRESELECCIONADO"].includes(p.estado),
  ).length;
  const aceptadas = postulaciones.filter((p) =>
    ["CONFIRMADO", "VALIDADO_MYPE"].includes(p.estado),
  ).length;
  const rechazadas = postulaciones.filter((p) =>
    ["RECHAZADO", "EXPIRADO", "RETIRADO"].includes(p.estado),
  ).length;

  // Postulaciones que necesitan acción inmediata del estudiante
  const ofertasPendientes = postulaciones.filter(
    (p) => p.estado === "VALIDADO_MYPE",
  );

  const hasPostulaciones = total > 0;

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
          Mis Postulaciones
        </h1>
        <p className="text-base text-slate-500 font-semibold">
          Gestiona y revisa en tiempo real el estado de tus aplicaciones a
          proyectos MYPE.
        </p>
      </div>

      {/* ── Banners de ofertas pendientes de confirmación ───────
           Aparecen SIEMPRE arriba de todo cuando el estudiante
           tiene algo que confirmar. Son lo más urgente. */}
      {ofertasPendientes.length > 0 && (
        <div className="mb-6 space-y-3">
          {ofertasPendientes.map((p) => (
            <OfertaAceptadaBanner key={p.id} postulacion={p} />
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/50 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-primary flex items-center justify-center shrink-0">
            <Briefcase size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Enviadas
            </p>
            <p className="text-2xl font-extrabold text-slate-800">{total}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/50 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock size={22} className="animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              En Revisión
            </p>
            <p className="text-2xl font-extrabold text-slate-800">
              {enRevision}
            </p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/50 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Aceptadas
            </p>
            <p className="text-2xl font-extrabold text-slate-800">
              {aceptadas}
            </p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/50 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <XCircle size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              No Seleccionado
            </p>
            <p className="text-2xl font-extrabold text-slate-800">
              {rechazadas}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de postulaciones */}
      <div className="flex flex-col gap-6">
        {!hasPostulaciones ? (
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-[2.5rem] p-10 lg:p-16 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-indigo-50/40 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-blue-50/30 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col items-center">
              <div
                className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#1e3a5f] to-[#4648d4] text-white flex items-center justify-center shadow-lg shadow-indigo-100 mb-8 animate-bounce shrink-0"
                style={{ animationDuration: "3s" }}
              >
                <Briefcase size={36} />
              </div>
              <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                No has postulado a ningún proyecto
              </h3>
              <p className="text-sm text-slate-500 font-semibold max-w-md mb-8 leading-relaxed">
                Tu lista de candidaturas está vacía. ¡Comienza tu camino
                profesional hoy postulando a proyectos reales de MYPEs!
              </p>
              <Link to="/proyectos">
                <button className="bg-gradient-to-r from-primary to-[#4648d4] text-white font-bold px-8 py-3.5 rounded-2xl shadow-xl shadow-primary/20 hover:opacity-95 transition-all active:scale-95 flex items-center gap-2 text-sm">
                  <ClipboardList size={18} />
                  Explorar Proyectos Disponibles
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {postulaciones.map((postulacion, index) => {
              const status = getStatusStyle(postulacion.estado);
              const fecha = postulacion.fechaPostulacion
                ? new Date(postulacion.fechaPostulacion).toLocaleDateString(
                    "es-PE",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )
                : "Fecha no disponible";
              const firstLetter = postulacion.proyectoTitulo
                ? postulacion.proyectoTitulo.charAt(0).toUpperCase()
                : "P";

              return (
                <motion.div
                  key={postulacion.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/40 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="flex-1 flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50/80 text-primary border border-indigo-100 flex items-center justify-center shrink-0 font-extrabold text-lg">
                      {firstLetter}
                    </div>
                    <div className="space-y-2.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 border ${status.bg}`}
                        >
                          {status.icon}
                          {status.label.toUpperCase()}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                          <Calendar size={13} /> {fecha}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-lg font-extrabold text-slate-900 mb-1 leading-snug truncate">
                          {postulacion.proyectoTitulo || "Proyecto sin título"}
                        </h2>
                        <div className="flex items-center gap-4 text-xs text-slate-500 font-bold">
                          <span className="flex items-center gap-1">
                            <Building2 size={14} className="text-slate-400" />
                            MYPE Asociada
                          </span>
                        </div>
                        {postulacion.mensajePostulacion && (
                          <div className="text-xs text-slate-600 mt-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100/80 flex gap-2.5 items-start">
                            <MessageSquare
                              size={16}
                              className="text-slate-400 shrink-0 mt-0.5"
                            />
                            <p className="font-semibold leading-relaxed">
                              <span className="text-slate-400 font-bold uppercase text-[9px] block mb-0.5">
                                Tu Mensaje de Presentación
                              </span>
                              "{postulacion.mensajePostulacion}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <Link
                      to={`/proyectos/${postulacion.proyectoId}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-100 border border-slate-200/50 transition-colors group whitespace-nowrap"
                    >
                      Ver Proyecto
                      <ArrowRight
                        size={14}
                        className="text-slate-400 group-hover:translate-x-0.5 transition-transform"
                      />
                    </Link>

                    // En MisPostulacionesPage.jsx, línea ~289
                    {postulacion.estado === "CONFIRMADO" && (
                      <Link
                        to={`/workspace/${postulacion.proyectoId}`} // ✅ Ruta correcta
                        className="px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:bg-[#3b5998] hover:shadow-lg transition-all flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Sparkles size={13} className="animate-pulse" />
                        Ir al Workspace
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Tarjetas de recomendación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gradient-to-tr from-indigo-50/50 to-blue-50/50 border border-indigo-50 p-6 rounded-[2rem] flex items-start gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-primary flex items-center justify-center shrink-0">
              <Lightbulb className="text-primary animate-pulse" size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm mb-1">
                ¿Sabías que...?
              </p>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Los estudiantes con perfiles completos tienen 3 veces más
                probabilidades de ser aceptados por MYPEs.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-tr from-amber-50/50 to-orange-50/50 border border-amber-50 p-6 rounded-[2rem] flex items-start gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <TrendingUp className="text-amber-600" size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm mb-1">
                Tendencia de esta semana
              </p>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Los proyectos de Desarrollo Web y Base de Datos son los más
                buscados y con mayor respuesta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisPostulacionesPage;
