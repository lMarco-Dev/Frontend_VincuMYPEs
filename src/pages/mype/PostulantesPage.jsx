// src/pages/mype/PostulantesPage.jsx

import { useState } from "react";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import { useMisProyectos } from "@/features/proyecto-list-mype/useMisProyectos";
import {
  usePostulaciones,
  usePostulacionesAceptadas,
  useCambiarEstadoPostulacion,
} from "@/features/proyecto-postulaciones/usePostulaciones";
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  Loader2,
  Eye,
  EyeOff,
  FileText,
} from "lucide-react";

const FONT = "'Angro Std', 'Outfit', sans-serif";

function EstadoPostBadge({ estado }) {
  const map = {
    PENDIENTE: {
      bg: "#FFFBEB",
      color: "#B45309",
      border: "#FDE68A",
      label: "Pendiente",
    },
    PRESELECCIONADO: {
      bg: "#EFF6FF",
      color: "#1D4ED8",
      border: "#BFDBFE",
      label: "Preseleccionado",
    },
    VALIDADO_MYPE: {
      bg: "#F0FDF4",
      color: "#15803D",
      border: "#BBF7D0",
      label: "Validado ✓",
    },
    CONFIRMADO: {
      bg: "#ECFDF5",
      color: "#065F46",
      border: "#6EE7B7",
      label: "Confirmado ✓✓",
    },
    RECHAZADO: {
      bg: "#FEF2F2",
      color: "#DC2626",
      border: "#FECACA",
      label: "Rechazado",
    },
    RETIRADO: {
      bg: "#F3F4F6",
      color: "#6B7280",
      border: "#E5E7EB",
      label: "Retirado",
    },
    EXPIRADO: {
      bg: "#FFF7ED",
      color: "#C2410C",
      border: "#FED7AA",
      label: "Expirado",
    },
  };
  const s = map[estado] ?? map.PENDIENTE;
  return (
    <span
      style={{
        fontFamily: FONT,
        fontSize: 10,
        fontWeight: 700,
        padding: "2px 9px",
        borderRadius: 10,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {s.label}
    </span>
  );
}

function FilaPostulante({ postulacion, proyectoId, verTodos }) {
  const { cambiarEstado, isLoading } = useCambiarEstadoPostulacion(proyectoId);

  const iniciales =
    postulacion.estudianteNombre
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";

  // Botones de acción legítimos para la MYPE según tu flujo trilateral:
  // La MYPE valida o rechaza lo que el Admin ya PRESELECCIONÓ
  const puedeValidar = postulacion.estado === "PRESELECCIONADO";
  const puedeRechazar =
    postulacion.estado === "PRESELECCIONADO" ||
    (verTodos && postulacion.estado === "PENDIENTE");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: verTodos
          ? "2fr 3fr 1fr 1fr 2fr"
          : "2fr 3fr 1fr 1fr",
        gap: 12,
        padding: "10px 16px",
        alignItems: "center",
        borderBottom: "0.5px solid #F3F4F6",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            flexShrink: 0,
            background: "linear-gradient(135deg,#EFF6FF,#DBEAFE)",
            border: "1.5px solid #BFDBFE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 700,
            color: "#1D4ED8",
          }}
        >
          {iniciales}
        </div>
        <div style={{ minWidth: 0 }}>
          <span
            style={{
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 600,
              color: "#111827",
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {postulacion.estudianteNombre}
          </span>
          {postulacion.estudianteCvUrl ? (
            <a
              href={postulacion.estudianteCvUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: FONT,
                fontSize: 10,
                fontWeight: 600,
                color: "#1B6FE8",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                marginTop: 2,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#06B6D4")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#1B6FE8")}
            >
              <FileText size={10} /> Ver CV
            </a>
          ) : (
            <span
              style={{
                fontFamily: FONT,
                fontSize: 10,
                color: "#D1D5DB",
                display: "block",
                marginTop: 1,
              }}
            >
              Sin CV
            </span>
          )}
        </div>
      </div>

      <span
        style={{
          fontFamily: FONT,
          fontSize: 11,
          color: "#6B7280",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {postulacion.mensajePostulacion || (
          <span style={{ color: "#D1D5DB", fontStyle: "italic" }}>
            Sin mensaje
          </span>
        )}
      </span>

      <span style={{ fontFamily: FONT, fontSize: 11, color: "#9CA3AF" }}>
        {new Date(postulacion.fechaPostulacion).toLocaleDateString("es-PE")}
      </span>

      <EstadoPostBadge estado={postulacion.estado} />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 6,
          alignItems: "center",
        }}
      >
        {isLoading && (
          <Loader2 size={14} className="animate-spin text-slate-400" />
        )}

        {/* Validar la propuesta del Administrador */}
        {puedeValidar && !isLoading && (
          <button
            onClick={() => {
              if (
                window.confirm(
                  `¿Validar la selección de ${postulacion.estudianteNombre}? Pasa a oferta pendiente para el alumno.`,
                )
              )
                cambiarEstado({
                  proyectoId,
                  postulacionId: postulacion.id,
                  estado: "VALIDADO_MYPE",
                });
            }}
            style={{
              fontFamily: FONT,
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              fontWeight: 700,
              color: "#15803D",
              background: "rgba(21,128,61,0.06)",
              border: "1px solid rgba(21,128,61,0.2)",
              padding: "4px 10px",
              borderRadius: 7,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(21,128,61,0.12)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(21,128,61,0.06)")
            }
          >
            <CheckCircle size={11} /> Validar
          </button>
        )}

        {/* Rechazar la propuesta del Administrador */}
        {puedeRechazar && !isLoading && (
          <button
            onClick={() => {
              if (
                window.confirm(
                  `¿Rechazar a ${postulacion.estudianteNombre}? Se notificará al Administrador.`,
                )
              )
                cambiarEstado({
                  proyectoId,
                  postulacionId: postulacion.id,
                  estado: "RECHAZADO",
                });
            }}
            style={{
              fontFamily: FONT,
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              fontWeight: 700,
              color: "#DC2626",
              background: "rgba(220,38,38,0.05)",
              border: "1px solid rgba(220,38,38,0.15)",
              padding: "4px 10px",
              borderRadius: 7,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(220,38,38,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(220,38,38,0.05)")
            }
          >
            <XCircle size={11} /> Rechazar
          </button>
        )}
      </div>
    </div>
  );
}

function BloqueProyecto({ proyecto, verTodos }) {
  const [abierto, setAbierto] = useState(true);

  const { postulaciones, isLoading } = usePostulaciones(proyecto.id);

  // Filtros de negocio reactivos en el front:
  const preseleccionados = postulaciones.filter(
    (p) => p.estado === "PRESELECCIONADO",
  );
  const confirmados = postulaciones.filter((p) => p.estado === "CONFIRMADO");

  const postulantesVisibles = verTodos
    ? postulaciones
    : postulaciones.filter(
        (p) =>
          p.estado === "PRESELECCIONADO" ||
          p.estado === "CONFIRMADO" ||
          p.estado === "VALIDADO_MYPE",
      );

  // El bloque solo se oculta si verdaderamente no hay registros en la base de datos
  if (!isLoading && postulaciones.length === 0 && !verTodos) return null;

  const cols = verTodos ? "2fr 3fr 1fr 1fr 2fr" : "2fr 3fr 1fr 1fr";

  return (
    <div
      style={{
        background: "#fff",
        border: "0.5px solid #E5E7EB",
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 12,
      }}
    >
      <button
        onClick={() => setAbierto(!abierto)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          transition: "background 0.15s",
          fontFamily: FONT,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontFamily: FONT,
              fontSize: 13,
              fontWeight: 600,
              color: "#111827",
            }}
          >
            {proyecto.titulo}
          </span>

          {confirmados.length > 0 && (
            <span
              style={{
                fontFamily: FONT,
                fontSize: 10,
                fontWeight: 700,
                background: "#ECFDF5",
                color: "#065F46",
                border: "1px solid #6EE7B7",
                padding: "1px 8px",
                borderRadius: 10,
              }}
            >
              {confirmados.length} confirmado{confirmados.length > 1 ? "s" : ""}{" "}
              ✓✓
            </span>
          )}

          {preseleccionados.length > 0 && (
            <span
              style={{
                fontFamily: FONT,
                fontSize: 10,
                fontWeight: 700,
                background: "rgba(249,115,22,0.1)",
                color: "#EA580C",
                border: "1px solid rgba(249,115,22,0.2)",
                padding: "1px 8px",
                borderRadius: 10,
              }}
            >
              {preseleccionados.length} asignado por filtrar ⚠
            </span>
          )}
          {isLoading && (
            <Loader2 size={12} className="animate-spin text-slate-400" />
          )}
        </div>
        <ChevronDown
          size={15}
          color="#9CA3AF"
          style={{
            transform: abierto ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {abierto && (
        <>
          {isLoading ? (
            <div style={{ padding: 16 }}>
              {[1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    height: 44,
                    borderRadius: 8,
                    background: "#F3F4F6",
                    marginBottom: 8,
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
              ))}
            </div>
          ) : postulantesVisibles.length === 0 ? (
            <div
              style={{
                padding: "24px 16px",
                textAlign: "center",
                borderTop: "0.5px solid #F3F4F6",
              }}
            >
              <Clock size={22} color="#D1D5DB" style={{ marginBottom: 6 }} />
              <p style={{ fontFamily: FONT, fontSize: 12, color: "#9CA3AF" }}>
                Sin candidatos pendientes de validación en este momento.
              </p>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: cols,
                  gap: 12,
                  padding: "6px 16px",
                  background: "#F9FAFB",
                  borderTop: "0.5px solid #F3F4F6",
                }}
              >
                {[
                  "Estudiante",
                  "Mensaje",
                  "Fecha",
                  "Estado",
                  ...(verTodos ? [] : []),
                ].map((h) => (
                  <span
                    key={h}
                    style={{
                      fontFamily: FONT,
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>
              {postulantesVisibles.map((p) => (
                <FilaPostulante
                  key={p.id}
                  postulacion={p}
                  proyectoId={proyecto.id}
                  verTodos={verTodos}
                />
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

export function PostulantesPage() {
  const { proyectos, isLoading } = useMisProyectos();
  const [verTodos, setVerTodos] = useState(false);

  const proyectosActivos = proyectos.filter(
    (p) => p.estado === "PENDIENTE" || p.estado === "EN_DESARROLLO",
  );

  return (
    <MypeLayout titulo="Postulantes">
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 20,
          gap: 16,
        }}
      >
        <p
          style={{
            fontFamily: FONT,
            fontSize: 13,
            color: "#6B7280",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {verTodos
            ? "Estás viendo el registro histórico completo de solicitudes (Pendientes, Preseleccionados, Rechazados y Expirados)."
            : "Bandeja de Entrada: Visualiza a los candidatos asignados por el administrador pendientes de tu validación."}
        </p>
        <button
          onClick={() => setVerTodos(!verTodos)}
          style={{
            fontFamily: FONT,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            flexShrink: 0,
            padding: "7px 14px",
            borderRadius: 8,
            transition: "all 0.2s",
            ...(verTodos
              ? {
                  background: "rgba(27,111,232,0.08)",
                  color: "#1B6FE8",
                  border: "1px solid rgba(27,111,232,0.2)",
                }
              : {
                  background: "#F9FAFB",
                  color: "#6B7280",
                  border: "1px solid #E5E7EB",
                }),
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = verTodos
              ? "rgba(27,111,232,0.14)"
              : "#F3F4F6")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = verTodos
              ? "rgba(27,111,232,0.08)"
              : "#F9FAFB")
          }
        >
          {verTodos ? (
            <>
              <EyeOff size={14} /> Ver bandeja de entrada
            </>
          ) : (
            <>
              <Eye size={14} /> Solicitar ver historial
            </>
          )}
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: 64,
                borderRadius: 12,
                background: "#E5E7EB",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
      ) : proyectos.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 24px",
            border: "1px dashed #E5E7EB",
            borderRadius: 12,
            background: "#fff",
          }}
        >
          <Users size={28} color="#D1D5DB" style={{ marginBottom: 10 }} />
          <p
            style={{
              fontFamily: FONT,
              fontSize: 14,
              color: "#9CA3AF",
              marginBottom: 4,
            }}
          >
            No tienes proyectos creados aún
          </p>
        </div>
      ) : proyectosActivos.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 24px",
            border: "1px dashed #E5E7EB",
            borderRadius: 12,
            background: "#fff",
          }}
        >
          <Users size={28} color="#D1D5DB" style={{ marginBottom: 10 }} />
          <p
            style={{
              fontFamily: FONT,
              fontSize: 14,
              color: "#9CA3AF",
              marginBottom: 4,
            }}
          >
            Ningún proyecto está publicado actualmente
          </p>
        </div>
      ) : (
        proyectosActivos.map((p) => (
          <BloqueProyecto key={p.id} proyecto={p} verTodos={verTodos} />
        ))
      )}
    </MypeLayout>
  );
}
