import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  CheckCircle2,
  Sparkles,
  Loader2,
  AlertCircle,
  Clock,
  Calendar,
} from "lucide-react";
import { useCrearProyecto } from "./useCrearProyecto";

const FONT = "'Angro Std', 'Outfit', sans-serif";
const ease = [0.22, 1, 0.36, 1];

// ── Enum exacto del backend ──────────────────────────────────
const AREA = {
  WEB: "DESARROLLO_WEB",
  MOVIL: "DESARROLLO_MOVIL",
  SOFTWARE: "DESARROLLO_SOFTWARE",
  BD: "BASE_DE_DATOS",
  DATOS: "ANALISIS_DATOS",
  SOPORTE: "SOPORTE_TI",
  OTRO: "OTRO",
};

// ── Duraciones estándar por tipo ─────────────────────────────
const DURACIONES = {
  1.1: { min: 7, sugerido: 10 },
  1.2: { min: 7, sugerido: 10 },
  1.3: { min: 14, sugerido: 18 },
  1.4: { min: 14, sugerido: 18 },
  2.1: { min: 14, sugerido: 21 },
  2.2: { min: 14, sugerido: 21 },
  2.3: { min: 10, sugerido: 14 },
  3.1: { min: 7, sugerido: 10 },
  3.2: { min: 14, sugerido: 21 },
  3.3: { min: 10, sugerido: 14 },
  4.1: { min: 10, sugerido: 14 },
  4.2: { min: 10, sugerido: 14 },
  5.1: { min: 14, sugerido: 21 },
  5.2: { min: 14, sugerido: 21 },
  personalizado: { min: 7, sugerido: 14 },
};

const hoy = () => new Date().toISOString().split("T")[0];

const sumarDias = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
};

// ── Árbol de decisiones ──────────────────────────────────────
const ARBOL = {
  inicio: {
    pregunta: "¿Cuál es la principal necesidad actual de tu negocio?",
    tieneInputLibre: true,
    inputPlaceholder: "O descríbela con tus propias palabras...",
    opciones: [
      {
        texto: "Mostrar mi negocio en internet o captar clientes",
        siguiente: "mostrar_internet",
      },
      {
        texto: "Organizar u ordenar la información interna de mi negocio",
        siguiente: "organizar_info",
      },
      {
        texto: "Mejorar la experiencia digital de mis clientes",
        siguiente: "experiencia_clientes",
      },
      {
        texto: "Mejorar mi red local o mi infraestructura tecnológica",
        siguiente: "infraestructura",
      },
    ],
  },
  mostrar_internet: {
    pregunta: "¿Cuál es tu situación digital actual?",
    opciones: [
      { texto: "No tengo presencia en internet todavía", resultado: "1.1" },
      {
        texto: "Tengo redes sociales activas pero no una página web",
        resultado: "1.1",
      },
      {
        texto: "Tengo una web básica pero quiero mostrar mejor mis productos",
        resultado: "1.2",
      },
    ],
  },
  organizar_info: {
    pregunta: "¿Qué tipo de información necesitas organizar prioritariamente?",
    opciones: [
      {
        texto: "Control de clientes, pedidos, citas o reservas",
        resultado: "1.3",
      },
      {
        texto: "Registro de ventas, inventario o datos en Excel",
        siguiente: "excel_opciones",
      },
      {
        texto: "No lo sé con certeza, mi información está muy desorganizada",
        resultado: "2.2",
      },
    ],
  },
  excel_opciones: {
    pregunta: "¿Qué te gustaría lograr principalmente con esos datos?",
    opciones: [
      {
        texto: "Entender patrones ocultos y qué me dicen los datos",
        resultado: "2.3",
      },
      {
        texto: "Visualizarlos en gráficos interactivos fáciles de entender",
        resultado: "1.4",
      },
      {
        texto: "Estructurarlos en una base de datos real y segura",
        resultado: "2.1",
      },
    ],
  },
  experiencia_clientes: {
    pregunta:
      "¿Tienes identificado qué aspecto deseas optimizar con tus clientes?",
    opciones: [
      {
        texto:
          "Sí, sé exactamente qué aplicación o sistema web requiero mapear",
        resultado: "3.1",
      },
      {
        texto: "Tengo un proceso digital que suele confundir a mis clientes",
        resultado: "3.2",
      },
      {
        texto:
          "No sé dónde está el cuello de botella o por qué abandonan mi web",
        resultado: "3.3",
      },
    ],
  },
  infraestructura: {
    pregunta: "¿Cuál es la situación más crítica de tu entorno tecnológico?",
    tieneInputLibre: true,
    inputPlaceholder: "O descríbela con tus propias palabras...",
    opciones: [
      {
        texto:
          "Mi red local falla, la conexión va lenta y desconozco el motivo",
        resultado: "4.1",
      },
      {
        texto:
          "Voy a abrir un local nuevo y necesito saber qué equipos instalar",
        resultado: "4.2",
      },
      {
        texto:
          "Quiero saber si las cuentas y datos de mi negocio están protegidos",
        resultado: "5.1",
      },
      {
        texto: "Quiero asegurar que nunca perderé mis archivos importantes",
        resultado: "5.2",
      },
    ],
  },
};

// ── Proyectos hoja ────────────────────────────────────────────
const LEAF_PROJECTS = {
  1.1: {
    titulo: "Página web de presentación (Landing Page) con formulario",
    areaSistemas: AREA.WEB,
    cupos: 1,
    entregables: [
      "Diseño visual previo de la estructura de la página antes de programar",
      "Código fuente completo alojado en GitHub o GitLab",
      "Página web publicada y accesible desde internet",
      "Formulario de contacto vinculado a tu WhatsApp o correo",
      "Manual de usuario para modificar los textos tú mismo",
    ],
  },
  1.2: {
    titulo: "Prototipo interactivo de Catálogo Digital de Productos",
    areaSistemas: AREA.WEB,
    cupos: 2,
    entregables: [
      "Estructura organizada de categorías de productos",
      "Web con buscador interactivo y visualización de imágenes",
      "Código fuente completo en Git",
      "Manual de administración para registrar y editar productos",
    ],
  },
  1.3: {
    titulo: "Prototipo de sistema de registro de clientes y pedidos",
    areaSistemas: AREA.SOFTWARE,
    cupos: 2,
    entregables: [
      "Formulario web interactivo para capturar datos de clientes",
      "Panel interno para consultar y filtrar pedidos o citas",
      "Código fuente con manejo seguro de sesiones",
      "Guía de operación del sistema para el personal",
    ],
  },
  1.4: {
    titulo: "Dashboard interactivo para visualización de datos empresariales",
    areaSistemas: AREA.DATOS,
    cupos: 2,
    entregables: [
      "Maquetación del panel de control gráfico",
      "Dashboard con gráficos estadísticos (barras, líneas, KPI)",
      "Módulo de importación de datos desde Excel/CSV",
      "Manual interpretativo para análisis de métricas",
    ],
  },
  2.1: {
    titulo: "Diseño e implementación de Base de Datos relacional",
    areaSistemas: AREA.BD,
    cupos: 2,
    entregables: [
      "Diagrama Entidad-Relación conceptual y lógico",
      "Scripts SQL estructurados y listos para ejecutar",
      "Diccionario de datos de cada tabla y columna",
      "Reporte de pruebas de conectividad y optimización",
    ],
  },
  2.2: {
    titulo: "Servicio de limpieza, ordenamiento y migración de datos",
    areaSistemas: AREA.BD,
    cupos: 2,
    entregables: [
      "Informe diagnóstico de errores e inconsistencias encontrados",
      "Archivos o tablas limpias, sin duplicados",
      "Scripts de transformación de datos",
      "Documentación del nuevo formato estandarizado",
    ],
  },
  2.3: {
    titulo: "Análisis exploratorio de datos y diagnóstico de negocio",
    areaSistemas: AREA.DATOS,
    cupos: 2,
    entregables: [
      "Informe ejecutivo de analítica descriptiva con hallazgos clave",
      "Gráficos de tendencias de venta, horarios pico e inventario",
      "Segmentación de clientes basada en comportamiento histórico",
      "Presentación con conclusiones para la toma de decisiones",
    ],
  },
  3.1: {
    titulo: "Diseño de interfaz de usuario interactiva (UI/UX) en Figma",
    areaSistemas: AREA.SOFTWARE,
    cupos: 1,
    entregables: [
      "Wireframes del flujo de navegación inicial",
      "Prototipo de alta fidelidad interactivo en Figma",
      "Guía de estilo con colores, tipografías e íconos",
      "Recursos visuales exportados para el equipo de desarrollo",
    ],
  },
  3.2: {
    titulo: "Rediseño optimizado de experiencia de usuario",
    areaSistemas: AREA.SOFTWARE,
    cupos: 1,
    entregables: [
      "Informe de auditoría de usabilidad de la plataforma actual",
      "Propuesta visual con flujos simplificados",
      "Prototipo comparativo demostrando las mejoras",
      "Especificaciones y estándares UX recomendados",
    ],
  },
  3.3: {
    titulo: "Mapa de experiencia del cliente (Customer Journey Map)",
    areaSistemas: AREA.SOFTWARE,
    cupos: 1,
    entregables: [
      "Mapa visual del viaje del cliente interactivo",
      "Identificación de puntos de fricción y cuellos de botella",
      "Matriz de oportunidades de mejora por impacto",
      "Informe estratégico con tácticas aplicables",
    ],
  },
  4.1: {
    titulo: "Diagnóstico de conectividad y plan de mejora de red",
    areaSistemas: AREA.SOPORTE,
    cupos: 2,
    entregables: [
      "Informe del estado, rendimiento y cobertura actual de tu red",
      "Diagrama de topología física con fallas identificadas",
      "Plan de acción con configuraciones optimizadas",
      "Lista de equipos recomendados alineada al presupuesto",
    ],
  },
  4.2: {
    titulo: "Diseño técnico de arquitectura de red para nuevos locales",
    areaSistemas: AREA.SOPORTE,
    cupos: 2,
    entregables: [
      "Plano constructivo y lógico de conexiones de red",
      "Ubicación de cableado y puntos de acceso Wi-Fi",
      "Especificaciones de hardware recomendadas",
      "Arquitectura de seguridad perimetral inicial",
    ],
  },
  5.1: {
    titulo: "Auditoría básica preventiva de seguridad digital",
    areaSistemas: AREA.SOPORTE,
    cupos: 2,
    entregables: [
      "Informe de riesgos en cuentas de correo y contraseñas",
      "Reporte de permisos, accesos y roles del personal",
      "Manual preventivo de ciberseguridad",
      "Plan de acción para el blindaje de credenciales críticas",
    ],
  },
  5.2: {
    titulo: "Diseño y despliegue de plan de respaldo de datos (Backup)",
    areaSistemas: AREA.SOPORTE,
    cupos: 2,
    entregables: [
      "Política y cronograma de copias de seguridad",
      "Scripts o software de backup automático en la nube",
      "Manual de recuperación de archivos ante emergencias",
      "Reporte de pruebas exitosas de restauración",
    ],
  },
};

// ── Componente principal ──────────────────────────────────────
export function CrearProyectoForm() {
  const { crearProyecto, isLoading, error: apiError } = useCrearProyecto();

  // Plazo
  const [plazo, setPlazo] = useState("corto");

  // Árbol
  const [history, setHistory] = useState(["inicio"]);
  const [currentKey, setCurrentKey] = useState("inicio");
  const [selectedResult, setSelectedResult] = useState(null);
  const [inputLibre, setInputLibre] = useState("");

  // Confirmación
  const [comentario, setComentario] = useState("");
  const [fechaLimite, setFechaLimite] = useState("");
  const [duracionInfo, setDuracionInfo] = useState(null);

  const currentNode = ARBOL[currentKey];

  const handleOptionClick = (opcion) => {
    if (opcion.resultado) {
      const dur = DURACIONES[opcion.resultado] ?? DURACIONES.personalizado;
      setDuracionInfo(dur);
      setFechaLimite(sumarDias(dur.sugerido));
      setSelectedResult(LEAF_PROJECTS[opcion.resultado]);
    } else if (opcion.siguiente) {
      setHistory((prev) => [...prev, opcion.siguiente]);
      setCurrentKey(opcion.siguiente);
      setInputLibre("");
    }
  };

  const handleInputLibreSubmit = () => {
    if (!inputLibre.trim()) return;
    const dur = DURACIONES.personalizado;
    setDuracionInfo(dur);
    setFechaLimite(sumarDias(dur.sugerido));
    setSelectedResult({
      titulo: inputLibre.trim(),
      areaSistemas: AREA.OTRO,
      cupos: 1,
      entregables: ["Entregable a definir junto con el equipo asignado"],
      esPersonalizado: true,
    });
  };

  const handleBack = () => {
    if (selectedResult) {
      setSelectedResult(null);
      setDuracionInfo(null);
      setFechaLimite("");
    } else if (history.length > 1) {
      const newH = [...history];
      newH.pop();
      setHistory(newH);
      setCurrentKey(newH[newH.length - 1]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      titulo: selectedResult.titulo,
      descripcion: comentario.trim()
        ? comentario.trim()
        : `Requerimiento para el desarrollo de: ${selectedResult.titulo}.`,
      objetivo: `Solucionar la necesidad empresarial mediante ${selectedResult.titulo}.`,
      entregablesSugeridos: selectedResult.entregables
        .map((ent) => `• ${ent}`)
        .join("\n"),
      areaSistemas: selectedResult.areaSistemas,
      cupos: selectedResult.cupos ?? 1,
      fechaInicio: null,
      fechaLimite: fechaLimite || null,
    };
    crearProyecto(payload);
  };

  // ── Estilos reutilizables ────────────────────────────────────
  const inputStyle = () => ({
    width: "100%",
    background: "#081828",
    border: "1px solid rgba(27,111,232,0.2)",
    borderRadius: 10,
    color: "#E2E8F0",
    padding: "10px 14px",
    fontFamily: FONT,
    fontSize: 14,
    outline: "none",
    resize: "vertical",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  });

  const dateInputStyle = {
    background: "#081828",
    border: "1px solid rgba(27,111,232,0.2)",
    borderRadius: 8,
    color: "#E2E8F0",
    padding: "8px 12px",
    fontFamily: FONT,
    fontSize: 13,
    outline: "none",
    colorScheme: "dark",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div style={{ fontFamily: FONT }}>
      <style>{`
        .wizard-btn {
          width: 100%; padding: 14px 18px; background: #081828;
          border: 1px solid rgba(27,111,232,0.25); color: #E2E8F0;
          border-radius: 12px; font-family: inherit; font-weight: 500;
          font-size: 14px; text-align: left; cursor: pointer;
          display: flex; align-items: center; justify-content: space-between;
          transition: all 0.2s;
        }
        .wizard-btn:hover {
          border-color: #F97316; background: #0F2A4A;
          color: #fff; transform: translateX(3px);
        }
        .date-input:focus { border-color: #1B6FE8 !important; }
        .saas-textarea:focus { border-color: #F97316 !important; }
        .plazo-btn {
          flex: 1; padding: 10px 16px; border-radius: 8px;
          font-family: inherit; font-size: 13px; font-weight: 600;
          cursor: pointer; border: 1.5px solid transparent;
          transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
      `}</style>

      {/* ── Toggle corto / largo plazo ───────────────────────── */}
      <div
        style={{
          background: "#0A1E35",
          border: "1px solid rgba(27,111,232,0.2)",
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "rgba(255,255,255,0.35)",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            margin: "0 0 10px",
          }}
        >
          Tipo de proyecto
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {/* Corto plazo — activo */}
          <button
            type="button"
            onClick={() => setPlazo("corto")}
            className="plazo-btn"
            style={
              plazo === "corto"
                ? {
                    background: "rgba(27,111,232,0.18)",
                    color: "#93C5FD",
                    borderColor: "rgba(27,111,232,0.4)",
                  }
                : {
                    background: "rgba(255,255,255,0.03)",
                    color: "rgba(255,255,255,0.4)",
                    borderColor: "rgba(255,255,255,0.08)",
                  }
            }
          >
            <Clock size={14} /> Corto plazo
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                padding: "1px 6px",
                borderRadius: 6,
                background: "rgba(6,182,212,0.15)",
                color: "#67E8F9",
                border: "1px solid rgba(6,182,212,0.2)",
              }}
            >
              Activo
            </span>
          </button>

          {/* Largo plazo — deshabilitado */}
          <button
            type="button"
            disabled
            className="plazo-btn"
            title="Disponible próximamente"
            style={{
              background: "rgba(255,255,255,0.02)",
              color: "rgba(255,255,255,0.2)",
              borderColor: "rgba(255,255,255,0.05)",
              cursor: "not-allowed",
              opacity: 0.5,
            }}
          >
            <Calendar size={14} /> Largo plazo
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                padding: "1px 6px",
                borderRadius: 6,
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              Próximamente
            </span>
          </button>
        </div>

        {plazo === "corto" && (
          <p
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.3)",
              margin: "8px 0 0",
              lineHeight: 1.5,
            }}
          >
            Proyectos de días a pocas semanas. Ideal para soluciones puntuales y
            rápidas.
          </p>
        )}
      </div>

      {/* ── Wizard ──────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {/* Árbol de preguntas */}
        {!selectedResult && (
          <motion.div
            key={currentKey}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.22, ease }}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <HelpCircle size={16} color="#06B6D4" />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                }}
              >
                Asistente de clasificación MYPElink
              </span>
            </div>

            <h3
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#fff",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {currentNode.pregunta}
            </h3>

            {/* Opciones */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {currentNode.opciones.map((op, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="wizard-btn"
                  onClick={() => handleOptionClick(op)}
                >
                  <span>{op.texto}</span>
                  <ArrowRight
                    size={15}
                    style={{ color: "#475569", flexShrink: 0 }}
                  />
                </button>
              ))}
            </div>

            {/* Input libre — solo en nodos marcados */}
            {currentNode.tieneInputLibre && (
              <div style={{ marginTop: 4 }}>
                <div
                  style={{
                    height: "0.5px",
                    background: "rgba(255,255,255,0.07)",
                    margin: "4px 0 12px",
                  }}
                />
                <p
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.3)",
                    margin: "0 0 8px",
                    fontWeight: 500,
                  }}
                >
                  ¿Tu caso no está en la lista? Descríbelo:
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    value={inputLibre}
                    onChange={(e) => setInputLibre(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleInputLibreSubmit()
                    }
                    placeholder={currentNode.inputPlaceholder}
                    style={{
                      ...inputStyle(),
                      height: 40,
                      padding: "0 12px",
                      resize: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleInputLibreSubmit}
                    disabled={!inputLibre.trim()}
                    style={{
                      fontFamily: FONT,
                      padding: "0 16px",
                      height: 40,
                      borderRadius: 8,
                      background: inputLibre.trim()
                        ? "linear-gradient(135deg,#1B6FE8,#0E54C4)"
                        : "rgba(255,255,255,0.05)",
                      color: inputLibre.trim()
                        ? "#fff"
                        : "rgba(255,255,255,0.2)",
                      border: "none",
                      fontSize: 12,
                      fontWeight: 600,
                      flexShrink: 0,
                      cursor: inputLibre.trim() ? "pointer" : "not-allowed",
                      transition: "all 0.2s",
                    }}
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {/* Volver */}
            {history.length > 1 && (
              <button
                type="button"
                onClick={handleBack}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.35)",
                  padding: 0,
                  fontFamily: FONT,
                  marginTop: 4,
                }}
              >
                <ArrowLeft size={13} /> Volver a la pregunta anterior
              </button>
            )}
          </motion.div>
        )}

        {/* Paso final: confirmación */}
        {selectedResult && (
          <motion.form
            key="resultado-final"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease }}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(249,115,22,0.1)",
                border: "1px solid rgba(249,115,22,0.2)",
                padding: "5px 12px",
                borderRadius: 8,
                width: "fit-content",
              }}
            >
              <Sparkles size={13} color="#F97316" />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#FB923C",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                }}
              >
                Proyecto sugerido para tu negocio
              </span>
            </div>

            {/* Ficha */}
            <div
              style={{
                background: "#081828",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    margin: "0 0 6px",
                  }}
                >
                  Título del proyecto propuesto
                </p>
                <h4
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#fff",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Sparkles
                    size={15}
                    color="#F97316"
                    style={{ flexShrink: 0 }}
                  />
                  {selectedResult.titulo}
                </h4>
              </div>

              {!selectedResult.esPersonalizado && (
                <div>
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                      margin: "0 0 8px",
                    }}
                  >
                    Lo que recibirás de los estudiantes
                  </p>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                  >
                    {selectedResult.entregables.map((ent, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                        }}
                      >
                        <CheckCircle2
                          size={13}
                          color="#F97316"
                          style={{ flexShrink: 0, marginTop: 2 }}
                        />
                        <span
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.6)",
                            lineHeight: 1.5,
                          }}
                        >
                          {ent}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Fecha límite con duración automática ── */}
            <div
              style={{
                background: "#081828",
                border: "1px solid rgba(27,111,232,0.2)",
                borderRadius: 12,
                padding: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 10,
                }}
              >
                <Clock size={14} color="#06B6D4" />
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    margin: 0,
                  }}
                >
                  Fecha límite de entrega
                </p>
              </div>

              {/* Info de duración estándar */}
              {duracionInfo && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(6,182,212,0.08)",
                    border: "1px solid rgba(6,182,212,0.15)",
                    borderRadius: 8,
                    padding: "8px 12px",
                    marginBottom: 12,
                  }}
                >
                  <Clock size={12} color="#67E8F9" style={{ flexShrink: 0 }} />
                  <p
                    style={{
                      fontFamily: FONT,
                      fontSize: 11,
                      color: "#67E8F9",
                      margin: 0,
                    }}
                  >
                    Mínimo recomendado: <strong>{duracionInfo.min} días</strong>
                    &nbsp;·&nbsp; Sugerido:{" "}
                    <strong>{duracionInfo.sugerido} días</strong>
                  </p>
                </div>
              )}

              <label
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.4)",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                ¿Cuándo necesitas tener el proyecto listo?
              </label>
              <input
                type="date"
                value={fechaLimite}
                min={duracionInfo ? sumarDias(duracionInfo.min) : hoy()}
                onChange={(e) => setFechaLimite(e.target.value)}
                className="date-input"
                style={dateInputStyle}
              />

              {fechaLimite && (
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: 11,
                    color: "#67E8F9",
                    margin: "8px 0 0",
                  }}
                >
                  Duración seleccionada:{" "}
                  <strong>
                    {Math.ceil(
                      (new Date(fechaLimite) - new Date()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    días desde hoy
                  </strong>
                </p>
              )}
            </div>

            {/* Descripción adicional */}
            <div>
              <label
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Describe tu problema o requerimiento (obligatorio)
              </label>
              <textarea
                required
                rows={3}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Cuéntanos en detalle qué necesitas resolver en tu negocio..."
                className="saas-textarea"
                style={{ ...inputStyle(), minHeight: 90 }}
              />
            </div>

            {/* Error del backend */}
            {apiError && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 8,
                  padding: "10px 14px",
                }}
              >
                <AlertCircle
                  size={15}
                  color="#F87171"
                  style={{ flexShrink: 0 }}
                />
                <p style={{ fontSize: 13, color: "#F87171", margin: 0 }}>
                  {apiError}
                </p>
              </div>
            )}

            {/* Botones */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={handleBack}
                disabled={isLoading}
                style={{
                  fontFamily: FONT,
                  width: 44,
                  height: 46,
                  borderRadius: 9,
                  flexShrink: 0,
                  background: "#081828",
                  border: "1.5px solid rgba(27,111,232,0.25)",
                  color: "#94A3B8",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#F97316";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(27,111,232,0.25)";
                  e.currentTarget.style.color = "#94A3B8";
                }}
              >
                <ArrowLeft size={17} />
              </button>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  fontFamily: FONT,
                  flex: 1,
                  height: 46,
                  borderRadius: 9,
                  border: "none",
                  color: "#fff",
                  background: "linear-gradient(135deg,#F97316,#DC4A00)",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  opacity: isLoading ? 0.7 : 1,
                  transition: "transform 0.2s",
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
                      size={16}
                      style={{ animation: "spin 1s linear infinite" }}
                    />{" "}
                    Publicando...
                  </>
                ) : (
                  "Publicar proyecto"
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
