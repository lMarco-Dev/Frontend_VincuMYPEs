import { useState } from "react";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import { useMisProyectos } from "@/features/proyecto-list-mype/useMisProyectos";
import { AREA_SISTEMAS_LABELS } from "@/entities/proyecto/proyecto.constants";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Pencil,
  Trash2,
  FileText,
  Loader2,
  X,
  Save,
} from "lucide-react";
import { EstadoBadge } from "./MypeDashboardPage";
import {
  useEditarProyecto,
  useEliminarProyecto,
} from "@/features/proyecto-edit/useEditarProyecto";

const FONT = "'Angro Std', 'Outfit', sans-serif";

const AREAS = [
  { value: "DESARROLLO_WEB", label: "Desarrollo Web" },
  { value: "DESARROLLO_MOVIL", label: "Desarrollo Móvil" },
  { value: "DESARROLLO_SOFTWARE", label: "Desarrollo Software" },
  { value: "BASE_DE_DATOS", label: "Base de Datos" },
  { value: "ANALISIS_DATOS", label: "Análisis de Datos" },
  { value: "SOPORTE_TI", label: "Soporte TI" },
  { value: "OTRO", label: "Otro" },
];

const hoy = () => new Date().toISOString().split("T")[0];

function Sk() {
  return (
    <div
      style={{
        height: 60,
        borderRadius: 10,
        background: "#E5E7EB",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    />
  );
}

// ── Modal de edición ─────────────────────────────────────────
function ModalEditar({ proyecto, onClose }) {
  const { editarProyecto, isLoading, error } = useEditarProyecto();

  const [form, setForm] = useState({
    titulo: proyecto.titulo ?? "",
    descripcion: proyecto.descripcion ?? "",
    objetivo: proyecto.objetivo ?? "",
    requisitos: proyecto.requisitos ?? "",
    entregablesSugeridos: proyecto.entregablesSugeridos ?? "",
    areaSistemas: proyecto.areaSistemas ?? "OTRO",
    cupos: proyecto.cupos ?? 1,
    fechaInicio: proyecto.fechaInicio ?? "",
    fechaLimite: proyecto.fechaLimite ?? "",
  });

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    editarProyecto(
      { id: proyecto.id, data: { ...form, cupos: Number(form.cupos) } },
      { onSuccess: onClose },
    );
  };

  const inputSt = {
    width: "100%",
    padding: "9px 12px",
    borderRadius: 8,
    fontFamily: FONT,
    fontSize: 13,
    border: "1px solid #E5E7EB",
    outline: "none",
    background: "#fff",
    color: "#111827",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    // Fondo overlay — posición fija simulada con flex en el layout
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(15,42,74,0.55)",
        backdropFilter: "blur(3px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          width: "100%",
          maxWidth: 560,
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header del modal */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "0.5px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: FONT,
                fontSize: 15,
                fontWeight: 700,
                color: "#111827",
                margin: 0,
              }}
            >
              Editar proyecto
            </h2>
            <p
              style={{
                fontFamily: FONT,
                fontSize: 11,
                color: "#9CA3AF",
                margin: "2px 0 0",
              }}
            >
              {proyecto.titulo}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#9CA3AF",
              padding: 4,
              borderRadius: 6,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#374151")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulario con scroll */}
        <form
          onSubmit={handleSubmit}
          style={{ flex: 1, overflowY: "auto", padding: 20 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Título */}
            <div>
              <label
                style={{
                  fontFamily: FONT,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#6B7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Título
              </label>
              <input
                required
                value={form.titulo}
                onChange={(e) => handleChange("titulo", e.target.value)}
                style={inputSt}
                onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
            </div>

            {/* Descripción */}
            <div>
              <label
                style={{
                  fontFamily: FONT,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#6B7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Descripción del problema
              </label>
              <textarea
                required
                rows={3}
                value={form.descripcion}
                onChange={(e) => handleChange("descripcion", e.target.value)}
                style={{ ...inputSt, resize: "vertical" }}
                onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
            </div>

            {/* Área + Cupos en dos columnas */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <label
                  style={{
                    fontFamily: FONT,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Área de sistemas
                </label>
                <select
                  value={form.areaSistemas}
                  onChange={(e) => handleChange("areaSistemas", e.target.value)}
                  style={{ ...inputSt, cursor: "pointer" }}
                  onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                >
                  {AREAS.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  style={{
                    fontFamily: FONT,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Cupos de estudiantes
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={form.cupos}
                  onChange={(e) => handleChange("cupos", e.target.value)}
                  style={inputSt}
                  onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>
            </div>

            {/* Fechas en dos columnas */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <label
                  style={{
                    fontFamily: FONT,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  value={form.fechaInicio?.split("T")[0] ?? ""}
                  min={hoy()}
                  onChange={(e) => handleChange("fechaInicio", e.target.value)}
                  style={inputSt}
                  onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>
              <div>
                <label
                  style={{
                    fontFamily: FONT,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Fecha límite de entrega
                </label>
                <input
                  type="date"
                  value={form.fechaLimite?.split("T")[0] ?? ""}
                  min={form.fechaInicio || hoy()}
                  onChange={(e) => handleChange("fechaLimite", e.target.value)}
                  style={inputSt}
                  onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>
            </div>

            {/* Objetivo */}
            <div>
              <label
                style={{
                  fontFamily: FONT,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#6B7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Objetivo (opcional)
              </label>
              <input
                value={form.objetivo}
                onChange={(e) => handleChange("objetivo", e.target.value)}
                style={inputSt}
                onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 8,
                  padding: "10px 12px",
                }}
              >
                <span style={{ fontSize: 13, color: "#DC2626" }}>{error}</span>
              </div>
            )}
          </div>
        </form>

        {/* Footer del modal */}
        <div
          style={{
            padding: "14px 20px",
            borderTop: "0.5px solid #E5E7EB",
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            disabled={isLoading}
            style={{
              fontFamily: FONT,
              padding: "0 18px",
              height: 38,
              borderRadius: 8,
              background: "transparent",
              border: "1px solid #E5E7EB",
              color: "#6B7280",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Cancelar
          </button>
          <button
            onClick={(e) => {
              // Llamamos al submit del form manualmente
              e.currentTarget
                .closest("div")
                .previousSibling.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true }),
                );
            }}
            disabled={isLoading}
            style={{
              fontFamily: FONT,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "0 18px",
              height: 38,
              borderRadius: 8,
              background: "linear-gradient(135deg,#1B6FE8,#0E54C4)",
              color: "#fff",
              border: "none",
              fontSize: 13,
              fontWeight: 600,
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!isLoading)
                e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {isLoading ? (
              <>
                <Loader2
                  size={14}
                  style={{ animation: "spin 1s linear infinite" }}
                />{" "}
                Guardando...
              </>
            ) : (
              <>
                <Save size={14} /> Guardar cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal ─────────────────────────────────────────
export function MisProyectosPage() {
  const { proyectos, isLoading } = useMisProyectos();
  const navigate = useNavigate();
  const { eliminarProyecto, isLoading: eliminando } = useEliminarProyecto();

  // Control del modal de edición
  const [proyectoEditando, setProyectoEditando] = useState(null);

  const handleEliminar = (id, titulo) => {
    if (
      window.confirm(
        `¿Eliminar el proyecto "${titulo}"?\nEsta acción no se puede deshacer.`,
      )
    )
      eliminarProyecto(id);
  };

  return (
    <MypeLayout
      titulo="Mis proyectos"
      accion={{ to: "/dashboard/mype/crear", label: "Nuevo proyecto" }}
    >
      {/* Modal de edición — se monta sobre todo */}
      {proyectoEditando && (
        <ModalEditar
          proyecto={proyectoEditando}
          onClose={() => setProyectoEditando(null)}
        />
      )}

      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[1, 2, 3].map((i) => (
            <Sk key={i} />
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
          <p
            style={{
              fontFamily: FONT,
              fontSize: 14,
              color: "#9CA3AF",
              marginBottom: 16,
            }}
          >
            Aún no has publicado ningún proyecto
          </p>
          <Link to="/dashboard/mype/crear">
            <button
              style={{
                fontFamily: FONT,
                padding: "0 20px",
                height: 38,
                borderRadius: 9,
                background: "linear-gradient(135deg,#1B6FE8,#0E54C4)",
                color: "#fff",
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Publicar mi primer proyecto
            </button>
          </Link>
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            border: "0.5px solid #E5E7EB",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {/* Cabecera */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1.4fr",
              gap: 12,
              padding: "10px 20px",
              background: "#F9FAFB",
              borderBottom: "0.5px solid #E5E7EB",
            }}
          >
            {["Proyecto", "Área", "Estado", "Fecha límite", "Acciones"].map(
              (h, i) => (
                <span
                  key={h}
                  style={{
                    fontFamily: FONT,
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    textAlign: i === 4 ? "right" : "left",
                  }}
                >
                  {h}
                </span>
              ),
            )}
          </div>

          {/* Filas */}
          {proyectos.map((p, i) => (
            <div
              key={p.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1.4fr",
                gap: 12,
                padding: "12px 20px",
                alignItems: "center",
                borderBottom:
                  i < proyectos.length - 1 ? "0.5px solid #F3F4F6" : "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#FAFAFA")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {/* Título + descripción */}
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#111827",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.titulo}
                </p>
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: 11,
                    color: "#9CA3AF",
                    margin: "2px 0 0",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.descripcion}
                </p>
              </div>

              {/* Área */}
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 10,
                  fontWeight: 600,
                  background: "#F1F5F9",
                  color: "#475569",
                  border: "1px solid #E2E8F0",
                  padding: "2px 8px",
                  borderRadius: 6,
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {AREA_SISTEMAS_LABELS[p.areaSistemas] ?? p.areaSistemas}
              </span>

              <EstadoBadge estado={p.estado} />

              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 12,
                  color: "#6B7280",
                  fontWeight: 500,
                }}
              >
                {p.fechaLimite ? (
                  new Date(p.fechaLimite).toLocaleDateString("es-PE")
                ) : (
                  <span style={{ color: "#D1D5DB" }}>—</span>
                )}
              </span>

              {/* Acciones */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 4,
                }}
              >
                {/* Botón dinámico: Postulantes o Revisar entregables */}
                {p.estado === "EN_DESARROLLO" ? (
                  <Link
                    to={`/dashboard/mype/proyectos/${p.id}/entregables`}
                    style={{
                      fontFamily: FONT,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#0891B2",
                      background: "rgba(8,145,178,0.06)",
                      border: "1px solid rgba(8,145,178,0.15)",
                      padding: "4px 10px",
                      borderRadius: 7,
                      textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(8,145,178,0.12)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(8,145,178,0.06)")
                    }
                  >
                    <FileText size={12} /> Revisar
                  </Link>
                ) : (
                  <button
                    onClick={() =>
                      navigate(`/dashboard/mype/postulantes?proyecto=${p.id}`)
                    }
                    style={{
                      fontFamily: FONT,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#1B6FE8",
                      background: "rgba(27,111,232,0.06)",
                      border: "1px solid rgba(27,111,232,0.15)",
                      padding: "4px 10px",
                      borderRadius: 7,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(27,111,232,0.12)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(27,111,232,0.06)")
                    }
                  >
                    <Users size={12} /> Postulantes
                  </button>
                )}

                {/* Editar — deshabilitado si está EN_DESARROLLO o COMPLETADO */}
                <button
                  title={
                    p.estado === "EN_DESARROLLO" || p.estado === "COMPLETADO"
                      ? "No se puede editar en este estado"
                      : "Editar proyecto"
                  }
                  disabled={
                    p.estado === "EN_DESARROLLO" || p.estado === "COMPLETADO"
                  }
                  onClick={() => setProyectoEditando(p)}
                  style={{
                    background: "transparent",
                    border: "1px solid transparent",
                    borderRadius: 7,
                    padding: 5,
                    cursor:
                      p.estado === "EN_DESARROLLO" || p.estado === "COMPLETADO"
                        ? "not-allowed"
                        : "pointer",
                    color:
                      p.estado === "EN_DESARROLLO" || p.estado === "COMPLETADO"
                        ? "#D1D5DB"
                        : "#9CA3AF",
                    transition: "all 0.2s",
                    opacity:
                      p.estado === "EN_DESARROLLO" || p.estado === "COMPLETADO"
                        ? 0.4
                        : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (
                      p.estado !== "EN_DESARROLLO" &&
                      p.estado !== "COMPLETADO"
                    ) {
                      e.currentTarget.style.color = "#D97706";
                      e.currentTarget.style.background = "#FFFBEB";
                      e.currentTarget.style.borderColor = "#FDE68A";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#9CA3AF";
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                >
                  <Pencil size={13} />
                </button>

                {/* Eliminar — deshabilitado si está EN_DESARROLLO */}
                <button
                  title={
                    p.estado === "EN_DESARROLLO"
                      ? "No se puede eliminar un proyecto con estudiantes asignados"
                      : "Eliminar proyecto"
                  }
                  disabled={eliminando || p.estado === "EN_DESARROLLO"}
                  onClick={() => handleEliminar(p.id, p.titulo)}
                  style={{
                    background: "transparent",
                    border: "1px solid transparent",
                    borderRadius: 7,
                    padding: 5,
                    cursor:
                      eliminando || p.estado === "EN_DESARROLLO"
                        ? "not-allowed"
                        : "pointer",
                    color: "#9CA3AF",
                    transition: "all 0.2s",
                    opacity:
                      eliminando || p.estado === "EN_DESARROLLO" ? 0.4 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!eliminando && p.estado !== "EN_DESARROLLO") {
                      e.currentTarget.style.color = "#DC2626";
                      e.currentTarget.style.background = "#FEF2F2";
                      e.currentTarget.style.borderColor = "#FECACA";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#9CA3AF";
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                >
                  {eliminando ? (
                    <Loader2
                      size={13}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                  ) : (
                    <Trash2 size={13} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </MypeLayout>
  );
}
