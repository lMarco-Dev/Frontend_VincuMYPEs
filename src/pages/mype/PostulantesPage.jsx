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

// ── Badge de estado ──────────────────────────────────────────
function EstadoPostBadge({ estado }) {
  const map = {
    PENDIENTE: {
      bg: "#FFFBEB",
      color: "#B45309",
      border: "#FDE68A",
      label: "Pendiente",
    },
    ACEPTADO: {
      bg: "#F0FDF4",
      color: "#15803D",
      border: "#BBF7D0",
      label: "Aceptado",
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

// ── Fila de postulante ───────────────────────────────────────
function FilaPostulante({ postulacion, proyectoId, verTodos }) {
  const { cambiarEstado, isLoading } = useCambiarEstadoPostulacion(proyectoId);

  const iniciales =
    postulacion.estudianteNombre
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";

  const puedeAccionar = verTodos && postulacion.estado === "PENDIENTE";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: verTodos
          ? "2fr 3fr 1fr 1fr 1.5fr"
          : "2fr 3fr 1fr 1fr",
        gap: 12,
        padding: "10px 16px",
        alignItems: "center",
        borderBottom: "0.5px solid #F9FAFB",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {/* Avatar + nombre */}
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
          {/* CV — cuando esté disponible */}
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
                transition: "color 0.15s",
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
              Sin CV adjunto
            </span>
          )}
        </div>
      </div>

      {/* Mensaje */}
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

      {/* Fecha */}
      <span style={{ fontFamily: FONT, fontSize: 11, color: "#9CA3AF" }}>
        {new Date(postulacion.fechaPostulacion).toLocaleDateString("es-PE")}
      </span>

      {/* Estado */}
      <EstadoPostBadge estado={postulacion.estado} />

      {/* Acciones — solo en modo ver todos */}
      {verTodos && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 6,
            alignItems: "center",
          }}
        >
          {puedeAccionar && !isLoading && (
            <>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `¿Aceptar a ${postulacion.estudianteNombre}?`,
                    )
                  )
                    cambiarEstado({
                      proyectoId,
                      postulacionId: postulacion.id,
                      estado: "ACEPTADO",
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
                <CheckCircle size={11} /> Aceptar
              </button>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `¿Rechazar a ${postulacion.estudianteNombre}?`,
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
            </>
          )}
          {isLoading && (
            <Loader2
              size={14}
              color="#9CA3AF"
              style={{ animation: "spin 1s linear infinite" }}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ── Bloque por proyecto ──────────────────────────────────────
function BloqueProyecto({ proyecto, verTodos }) {
  const [abierto, setAbierto] = useState(true);

  // Usa el hook correcto según el modo
  const hookAceptadas = usePostulacionesAceptadas(proyecto.id);
  const hookTodas = usePostulaciones(verTodos ? proyecto.id : null);

  // En modo normal usa solo aceptadas, en modo completo usa todas
  const { postulaciones, isLoading } = verTodos ? hookTodas : hookAceptadas;

  const pendientes = hookTodas.postulaciones.filter(
    (p) => p.estado === "PENDIENTE",
  ).length;
  const aceptados = hookAceptadas.postulaciones.length;

  // En modo normal, si no hay aceptados no mostramos el bloque
  if (!verTodos && !hookAceptadas.isLoading && aceptados === 0) return null;

  const cols = verTodos ? "2fr 3fr 1fr 1fr 1.5fr" : "2fr 3fr 1fr 1fr";

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
        onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
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

          {!verTodos && aceptados > 0 && (
            <span
              style={{
                fontFamily: FONT,
                fontSize: 10,
                fontWeight: 700,
                background: "#F0FDF4",
                color: "#15803D",
                border: "1px solid #BBF7D0",
                padding: "1px 8px",
                borderRadius: 10,
              }}
            >
              {aceptados} aceptado{aceptados > 1 ? "s" : ""}
            </span>
          )}

          {verTodos && pendientes > 0 && (
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
              {pendientes} pendiente{pendientes > 1 ? "s" : ""}
            </span>
          )}

          {isLoading && (
            <Loader2
              size={12}
              color="#9CA3AF"
              style={{ animation: "spin 1s linear infinite" }}
            />
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
          ) : postulaciones.length === 0 ? (
            <div
              style={{
                padding: "24px 16px",
                textAlign: "center",
                borderTop: "0.5px solid #F3F4F6",
              }}
            >
              <Clock size={22} color="#D1D5DB" style={{ marginBottom: 6 }} />
              <p style={{ fontFamily: FONT, fontSize: 12, color: "#9CA3AF" }}>
                {verTodos
                  ? "Nadie se ha postulado todavía"
                  : "Sin estudiantes aceptados aún"}
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
                  ...(verTodos ? ["Acciones"] : []),
                ].map((h, i) => (
                  <span
                    key={h}
                    style={{
                      fontFamily: FONT,
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      textAlign: verTodos && i === 4 ? "right" : "left",
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>
              {postulaciones.map((p) => (
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

// ── Página principal ─────────────────────────────────────────
export function PostulantesPage() {
  const { proyectos, isLoading } = useMisProyectos();
  const [verTodos, setVerTodos] = useState(false);

  const proyectosActivos = proyectos.filter(
    (p) => p.estado === "PENDIENTE" || p.estado === "EN_DESARROLLO",
  );

  return (
    <MypeLayout titulo="Postulantes">
      {/* Header con subtítulo y toggle */}
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
            ? "Estás viendo todos los postulantes. Puedes aceptar o rechazar manualmente."
            : "Solo se muestran los estudiantes ya aprobados por el equipo de MYPElink."}
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
          onMouseEnter={(e) => {
            e.currentTarget.style.background = verTodos
              ? "rgba(27,111,232,0.14)"
              : "#F3F4F6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = verTodos
              ? "rgba(27,111,232,0.08)"
              : "#F9FAFB";
          }}
        >
          {verTodos ? (
            <>
              <EyeOff size={14} /> Ver solo aceptados
            </>
          ) : (
            <>
              <Eye size={14} /> Solicitar ver todos
            </>
          )}
        </button>
      </div>

      {/* Aviso cuando está en modo ver todos */}
      {verTodos && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            background: "rgba(27,111,232,0.05)",
            border: "1px solid rgba(27,111,232,0.15)",
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 15, flexShrink: 0 }}>ℹ️</span>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 12,
              color: "#374151",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Estás viendo <strong>todos los postulantes</strong>, incluyendo los
            pendientes de revisión del equipo MYPElink. Si aceptas o rechazas
            manualmente, tu decisión tiene prioridad.
          </p>
        </div>
      )}

      {/* Contenido principal */}
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
        // No tiene ningún proyecto creado
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
          <p style={{ fontFamily: FONT, fontSize: 12, color: "#D1D5DB" }}>
            Publica un proyecto para empezar a recibir postulantes
          </p>
        </div>
      ) : proyectosActivos.length === 0 ? (
        // Tiene proyectos pero todos son BORRADOR o COMPLETADO
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
          <p style={{ fontFamily: FONT, fontSize: 12, color: "#D1D5DB" }}>
            Solo los proyectos en estado <strong>Publicado</strong> o{" "}
            <strong>En desarrollo</strong> pueden recibir postulantes
          </p>
        </div>
      ) : (
        // Muestra los bloques por proyecto
        proyectosActivos.map((p) => (
          <BloqueProyecto key={p.id} proyecto={p} verTodos={verTodos} />
        ))
      )}
    </MypeLayout>
  );
}
