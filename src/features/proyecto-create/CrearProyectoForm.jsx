import { useState, useEffect } from "react";
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
  FileText,
} from "lucide-react";
import { useCrearProyecto } from "./useCrearProyecto";
import { useArbolDecision } from "./useArbolDecision";
import { useInsumosProyecto } from "./useInsumosProyecto";

const AREA = {
  WEB: "DESARROLLO_WEB",
  MOVIL: "DESARROLLO_MOVIL",
  SOFTWARE: "DESARROLLO_SOFTWARE",
  BD: "BASE_DE_DATOS",
  DATOS: "ANALISIS_DATOS",
  SOPORTE: "SOPORTE_TI",
  OTRO: "OTRO",
};

const FONT = "'Angro Std', 'Outfit', sans-serif";
const ease = [0.22, 1, 0.36, 1];

// ── Duraciones estándar por tipo (fallback) ──────────────────
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

const sumarDias = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
};

// ── Árbol de decisiones (fallback) ───────────────────────────
const ARBOL = {
  inicio: {
    pregunta: "¿Cuál es la principal necesidad actual de tu negocio?",
    tieneInputLibre: true,
    inputPlaceholder: "O descríbela con tus propias palabras...",
    opciones: [
      { texto: "Mostrar mi negocio en internet o captar clientes", siguiente: "mostrar_internet" },
      { texto: "Organizar u ordenar la información interna de mi negocio", siguiente: "organizar_info" },
      { texto: "Mejorar la experiencia digital de mis clientes", siguiente: "experiencia_clientes" },
      { texto: "Mejorar mi red local o mi infraestructura tecnológica", siguiente: "infraestructura" },
    ],
  },
  mostrar_internet: {
    pregunta: "¿Cuál es tu situación digital actual?",
    opciones: [
      { texto: "No tengo presencia en internet todavía", resultado: "1.1" },
      { texto: "Tengo redes sociales activas pero no una página web", resultado: "1.1" },
      { texto: "Tengo una web básica pero quiero mostrar mejor mis productos", resultado: "1.2" },
    ],
  },
  organizar_info: {
    pregunta: "¿Qué tipo de información necesitas organizar prioritariamente?",
    opciones: [
      { texto: "Control de clientes, pedidos, citas o reservas", resultado: "1.3" },
      { texto: "Registro de ventas, inventario o datos en Excel", siguiente: "excel_opciones" },
      { texto: "No lo sé con certeza, mi información está muy desorganizada", resultado: "2.2" },
    ],
  },
  excel_opciones: {
    pregunta: "¿Qué te gustaría lograr principalmente con esos datos?",
    opciones: [
      { texto: "Entender patrones ocultos y qué me dicen los datos", resultado: "2.3" },
      { texto: "Visualizarlos en gráficos interactivos fáciles de entender", resultado: "1.4" },
      { texto: "Estructurarlos en una base de datos real y segura", resultado: "2.1" },
    ],
  },
  experiencia_clientes: {
    pregunta: "¿Tienes identificado qué aspecto deseas optimizar con tus clientes?",
    opciones: [
      { texto: "Sí, sé exactamente qué aplicación o sistema web requiero mapear", resultado: "3.1" },
      { texto: "Tengo un proceso digital que suele confundir a mis clientes", resultado: "3.2" },
      { texto: "No sé dónde está el cuello de botella o por qué abandonan mi web", resultado: "3.3" },
    ],
  },
  infraestructura: {
    pregunta: "¿Cuál es la situación más crítica de tu entorno tecnológico?",
    tieneInputLibre: true,
    inputPlaceholder: "O descríbela con tus propias palabras...",
    opciones: [
      { texto: "Mi red local falla, la conexión va lenta y desconozco el motivo", resultado: "4.1" },
      { texto: "Voy a abrir un local nuevo y necesito saber qué equipos instalar", resultado: "4.2" },
      { texto: "Quiero saber si las cuentas y datos de mi negocio están protegidos", resultado: "5.1" },
      { texto: "Quiero asegurar que nunca perderé mis archivos importantes", resultado: "5.2" },
    ],
  },
};

// ── Proyectos hoja (fallback) ────────────────────────────────
const LEAF_PROJECTS = {
  1.1: { titulo: "Página web de presentación (Landing Page) con formulario", areaSistemas: AREA.WEB, cupos: 1, entregables: ["Diseño visual previo", "Código fuente en GitHub", "Página publicada", "Formulario al WhatsApp/correo", "Manual de edición"] },
  1.2: { titulo: "Prototipo interactivo de Catálogo Digital de Productos", areaSistemas: AREA.WEB, cupos: 2, entregables: ["Estructura de categorías", "Web con buscador", "Código en Git", "Manual de administración"] },
  1.3: { titulo: "Prototipo de sistema de registro de clientes y pedidos", areaSistemas: AREA.SOFTWARE, cupos: 2, entregables: ["Formulario de captura", "Panel de consulta", "Código con sesiones seguras", "Guía de operación"] },
  1.4: { titulo: "Dashboard interactivo para visualización de datos", areaSistemas: AREA.DATOS, cupos: 2, entregables: ["Maquetación del panel", "Dashboard con KPIs", "Importación desde Excel/CSV", "Manual de análisis"] },
  2.1: { titulo: "Diseño e implementación de Base de Datos relacional", areaSistemas: AREA.BD, cupos: 2, entregables: ["Diagrama ER", "Scripts SQL", "Diccionario de datos", "Reporte de pruebas"] },
  2.2: { titulo: "Servicio de limpieza y migración de datos", areaSistemas: AREA.BD, cupos: 2, entregables: ["Informe diagnóstico", "Datos limpios", "Scripts de transformación", "Documentación"] },
  2.3: { titulo: "Análisis exploratorio de datos y diagnóstico", areaSistemas: AREA.DATOS, cupos: 2, entregables: ["Informe ejecutivo", "Gráficos de tendencias", "Segmentación de clientes", "Presentación"] },
  3.1: { titulo: "Diseño de interfaz UI/UX en Figma", areaSistemas: AREA.SOFTWARE, cupos: 1, entregables: ["Wireframes", "Prototipo en Figma", "Guía de estilo", "Recursos exportados"] },
  3.2: { titulo: "Rediseño optimizado de experiencia de usuario", areaSistemas: AREA.SOFTWARE, cupos: 1, entregables: ["Auditoría de usabilidad", "Propuesta visual", "Prototipo comparativo", "Estándares UX"] },
  3.3: { titulo: "Mapa de experiencia del cliente (Journey Map)", areaSistemas: AREA.SOFTWARE, cupos: 1, entregables: ["Journey visual", "Puntos de fricción", "Matriz de oportunidades", "Informe estratégico"] },
  4.1: { titulo: "Diagnóstico y plan de mejora de red", areaSistemas: AREA.SOPORTE, cupos: 2, entregables: ["Informe de red", "Topología con fallas", "Plan de acción", "Lista de equipos"] },
  4.2: { titulo: "Diseño técnico de red para nuevos locales", areaSistemas: AREA.SOPORTE, cupos: 2, entregables: ["Plano de conexiones", "Cableado y Wi-Fi", "Hardware recomendado", "Seguridad perimetral"] },
  5.1: { titulo: "Auditoría preventiva de seguridad digital", areaSistemas: AREA.SOPORTE, cupos: 2, entregables: ["Informe de riesgos", "Reporte de accesos", "Manual de ciberseguridad", "Plan de blindaje"] },
  5.2: { titulo: "Plan y despliegue de backup en nube", areaSistemas: AREA.SOPORTE, cupos: 2, entregables: ["Política de backup", "Backup automático", "Manual de recuperación", "Pruebas de restauración"] },
};

const ARBOL_FALLBACK = ARBOL;
const LEAF_PROJECTS_FALLBACK = LEAF_PROJECTS;
const DURACIONES_FALLBACK = DURACIONES;
const AREA_FALLBACK = AREA;

// ── Componente principal ──────────────────────────────────────
export function CrearProyectoForm() {
  const { crearProyecto, isLoading, error: apiError, rawError } = useCrearProyecto();

  // Bloque de error visible cuando el back rechaza la publicación.
  // Reemplaza al modal "Sí, es distinto" porque ese flujo ya no aplica:
  // la regla de negocio bloquea duro publicar dos proyectos del mismo tipo
  // activos para la misma MYPE.
  const [errorPublicar, setErrorPublicar] = useState(null);

  useEffect(() => {
    if (!rawError) return;
    const status = rawError?.response?.status;
    const message = rawError?.response?.data?.message || rawError?.message;
    if (status === 409) {
      setErrorPublicar({
        tipo: "duplicado",
        mensaje: message || "Ya tienes un proyecto activo del mismo tipo.",
      });
    } else if (status === 400) {
      setErrorPublicar({
        tipo: "validacion",
        mensaje: message || "No se pudo publicar el proyecto.",
      });
    } else if (status) {
      setErrorPublicar({
        tipo: "generico",
        mensaje: message || "Ocurrió un error al publicar.",
      });
    }
  }, [rawError]);

  const { data: arbolData, isLoading: arbolIsLoading, isError: arbolIsError } = useArbolDecision();

  // Árbol dinámico con fallback a constantes
  const arbol = arbolData && !arbolIsError ? arbolData : {
    nodoRaizCodigo: "inicio",
    nodos: ARBOL_FALLBACK,
    resultados: LEAF_PROJECTS_FALLBACK,
  };

  const [plazo, setPlazo] = useState("corto");

  const [history, setHistory] = useState(["inicio"]);
  const [currentKey, setCurrentKey] = useState("inicio");
  const [selectedResult, setSelectedResult] = useState(null);
  const [inputLibre, setInputLibre] = useState("");

  const [comentario, setComentario] = useState("");
  const [duracionInfo, setDuracionInfo] = useState(null);
  const [cuposSeleccionados, setCuposSeleccionados] = useState(1);
  const [diasSeleccionados, setDiasSeleccionados] = useState(7);
  const [insumoFiles, setInsumoFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tipoProyectoId = selectedResult?.tipoProyectoId;
  const { data: insumos = [] } = useInsumosProyecto(tipoProyectoId);
  const currentNode = arbol.nodos[currentKey];

  const handleOptionClick = (opcion) => {
    if (opcion.resultado) {
      const resultadoData = arbol.resultados[opcion.resultado];
      const dur = resultadoData
        ? { min: resultadoData.diasMin, sugerido: resultadoData.diasSugerido }
        : DURACIONES_FALLBACK.personalizado;
      setDuracionInfo(dur);
      setSelectedResult(arbol.resultados[opcion.resultado] || LEAF_PROJECTS_FALLBACK[opcion.resultado]);
      setCuposSeleccionados(resultadoData?.cuposMin || 1);
      setDiasSeleccionados(resultadoData?.diasSugerido || 7);
      setErrorPublicar(null);
    } else if (opcion.siguiente) {
      setHistory((prev) => [...prev, opcion.siguiente]);
      setCurrentKey(opcion.siguiente);
      setInputLibre("");
    }
  };

  const handleInputLibreSubmit = () => {
    if (!inputLibre.trim()) return;
    const dur = DURACIONES_FALLBACK.personalizado;
    setDuracionInfo(dur);
    setSelectedResult({
      titulo: inputLibre.trim(),
      areaSistemas: AREA_FALLBACK.OTRO,
      cupos: 1,
      entregables: ["Entregable a definir junto con el equipo asignado"],
      esPersonalizado: true,
    });
    setErrorPublicar(null);
  };

  const handleBack = () => {
    if (selectedResult) {
      setSelectedResult(null);
      setDuracionInfo(null);
      setErrorPublicar(null);
    } else if (history.length > 1) {
      const newH = [...history];
      newH.pop();
      setHistory(newH);
      setCurrentKey(newH[newH.length - 1]);
    }
  };

  // Insumos obligatorios que aún no se cargaron
  const insumosFaltantes = insumos.filter(i => i.obligatorio && !insumoFiles[i.id]);
  const canPublish = insumosFaltantes.length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || !canPublish) return;
    setErrorPublicar(null);
    setIsSubmitting(true);

    const payload = {
      titulo: selectedResult.titulo || selectedResult.nombre,
      descripcion: comentario.trim()
        ? comentario.trim()
        : `Requerimiento para el desarrollo de: ${selectedResult.titulo || selectedResult.nombre}.`,
      objetivo: `Solucionar la necesidad empresarial mediante ${selectedResult.titulo || selectedResult.nombre}.`,
      entregablesSugeridos: (selectedResult.entregables || [])
        .map((e) => `• ${e.titulo || e}`)
        .join("\n"),
      areaSistemas: selectedResult.areaSistemas || AREA_FALLBACK.OTRO,
      cupos: cuposSeleccionados,
      fechaInicio: null,
      diasEstimados: diasSeleccionados,
      fechaLimite: null,
      tipoProyectoId: selectedResult.tipoProyectoId || null,
      resultadoId: null,
    };

    const insumosToUpload = Object.entries(insumoFiles).map(([insumoTipoId, file]) => ({
      insumoTipoId: parseInt(insumoTipoId),
      file,
    }));

    try {
      await crearProyecto({ payload, insumos: insumosToUpload });
      // En éxito el hook navega; no reseteo isSubmitting porque el componente
      // se va a desmontar.
    } catch (err) {
      setIsSubmitting(false);
      // El useEffect del rawError ya setea errorPublicar; no hace falta hacer
      // nada extra acá.
    }
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

      {/* Toggle corto / largo plazo */}
      <div style={{ background: "#0A1E35", border: "1px solid rgba(27,111,232,0.2)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 10px" }}>
          Tipo de proyecto
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => setPlazo("corto")}
            className="plazo-btn"
            style={plazo === "corto"
              ? { background: "rgba(27,111,232,0.18)", color: "#93C5FD", borderColor: "rgba(27,111,232,0.4)" }
              : { background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.4)", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <Clock size={14} /> Corto plazo
            <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 6, background: "rgba(6,182,212,0.15)", color: "#67E8F9", border: "1px solid rgba(6,182,212,0.2)" }}>
              Activo
            </span>
          </button>
          <button
            type="button"
            disabled
            className="plazo-btn"
            title="Disponible próximamente"
            style={{ background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.2)", borderColor: "rgba(255,255,255,0.05)", cursor: "not-allowed", opacity: 0.5 }}
          >
            <Calendar size={14} /> Largo plazo
            <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 6, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}>
              Próximamente
            </span>
          </button>
        </div>
        {plazo === "corto" && (
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: "8px 0 0", lineHeight: 1.5 }}>
            Proyectos de días a pocas semanas. Ideal para soluciones puntuales y rápidas.
          </p>
        )}
      </div>

      {arbolIsLoading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Loader2 size={24} color="#67E8F9" style={{ animation: "spin 1s linear infinite" }} />
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 12, fontFamily: FONT }}>
            Cargando recomendaciones...
          </p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
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
                <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                  Asistente de clasificación MYPElink
                </span>
              </div>

              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.4 }}>
                {currentNode.pregunta}
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {currentNode.opciones.map((op, idx) => (
                  <button key={idx} type="button" className="wizard-btn" onClick={() => handleOptionClick(op)}>
                    <span>{op.texto}</span>
                    <ArrowRight size={15} style={{ color: "#475569", flexShrink: 0 }} />
                  </button>
                ))}
              </div>

              {currentNode.tieneInputLibre && (
                <div style={{ marginTop: 4 }}>
                  <div style={{ height: "0.5px", background: "rgba(255,255,255,0.07)", margin: "4px 0 12px" }} />
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: "0 0 8px", fontWeight: 500 }}>
                    ¿Tu caso no está en la lista? Descríbelo:
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      value={inputLibre}
                      onChange={(e) => setInputLibre(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleInputLibreSubmit()}
                      placeholder={currentNode.inputPlaceholder}
                      style={{ ...inputStyle(), height: 40, padding: "0 12px", resize: "none" }}
                    />
                    <button
                      type="button"
                      onClick={handleInputLibreSubmit}
                      disabled={!inputLibre.trim()}
                      style={{
                        fontFamily: FONT, padding: "0 16px", height: 40, borderRadius: 8,
                        background: inputLibre.trim() ? "linear-gradient(135deg,#1B6FE8,#0E54C4)" : "rgba(255,255,255,0.05)",
                        color: inputLibre.trim() ? "#fff" : "rgba(255,255,255,0.2)",
                        border: "none", fontSize: 12, fontWeight: 600, flexShrink: 0,
                        cursor: inputLibre.trim() ? "pointer" : "not-allowed", transition: "all 0.2s",
                      }}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {history.length > 1 && (
                <button type="button" onClick={handleBack} style={{
                  background: "none", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                  fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.35)",
                  padding: 0, fontFamily: FONT, marginTop: 4,
                }}>
                  <ArrowLeft size={13} /> Volver a la pregunta anterior
                </button>
              )}
            </motion.div>
          )}

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
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)",
                padding: "5px 12px", borderRadius: 8, width: "fit-content",
              }}>
                <Sparkles size={13} color="#F97316" />
                <span style={{ fontSize: 10, fontWeight: 700, color: "#FB923C", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                  Proyecto sugerido para tu negocio
                </span>
              </div>

              {/* Ficha del proyecto */}
              <div style={{
                background: "#081828", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 12,
              }}>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 6px" }}>
                    Título del proyecto propuesto
                  </p>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                    <Sparkles size={15} color="#F97316" style={{ flexShrink: 0 }} />
                    {selectedResult.titulo}
                  </h4>

                  {selectedResult.cuposMin && selectedResult.cuposMax && (
                    <div style={{
                      background: "rgba(27,111,232,0.08)", border: "1px solid rgba(27,111,232,0.2)",
                      borderRadius: 8, padding: "10px 14px",
                      display: "flex", alignItems: "center", gap: 12, marginTop: 12,
                    }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>
                        Cupos del proyecto:
                      </span>
                      {selectedResult.cuposMax > selectedResult.cuposMin ? (
                        <>
                          <input
                            type="range"
                            min={selectedResult.cuposMin}
                            max={selectedResult.cuposMax}
                            value={cuposSeleccionados}
                            onChange={(e) => setCuposSeleccionados(Number(e.target.value))}
                            style={{ flex: 1, accentColor: "#F97316" }}
                          />
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#F97316", minWidth: 20, textAlign: "center" }}>
                            {cuposSeleccionados}
                          </span>
                        </>
                      ) : (
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#F97316" }}>
                          {selectedResult.cuposMin} {selectedResult.cuposMin === 1 ? "cupo" : "cupos"} (fijo)
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {!selectedResult.esPersonalizado && (
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 8px" }}>
                      Lo que recibirás de los estudiantes
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {selectedResult.entregables.map((ent, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <CheckCircle2 size={13} color="#F97316" style={{ flexShrink: 0, marginTop: 2 }} />
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                            {typeof ent === "string" ? ent : ent.titulo || ent.nombre || JSON.stringify(ent)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Insumos requeridos */}
                    {insumos.length > 0 && (
                      <div style={{
                        background: "#081828", border: "1px solid rgba(27,111,232,0.2)",
                        borderRadius: 12, padding: 14,
                        display: "flex", flexDirection: "column", gap: 12, marginTop: 16,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <FileText size={14} color="#06B6D4" />
                          <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.8px", margin: 0 }}>
                            Requisitos para publicar
                          </p>
                        </div>

                        {insumos.map((insumo) => (
                          <div key={insumo.id} style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 8, padding: "10px 14px",
                            display: "flex", flexDirection: "column", gap: 6,
                          }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>
                                <p style={{ fontSize: 12, fontWeight: 700, color: "#E2E8F0", margin: 0 }}>
                                  {insumo.nombre}
                                  {insumo.obligatorio && (
                                    <span style={{ fontSize: 9, color: "#F97316", marginLeft: 6 }}>(Obligatorio)</span>
                                  )}
                                </p>
                                {insumo.descripcion && (
                                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", margin: "2px 0 0" }}>
                                    {insumo.descripcion}
                                  </p>
                                )}
                                {insumo.formato && (
                                  <p style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", margin: "2px 0 0" }}>
                                    Formato: {insumo.formato}
                                  </p>
                                )}
                              </div>
                              <div>
                                <label style={{
                                  display: "inline-block",
                                  padding: "6px 12px",
                                  background: insumoFiles[insumo.id] ? "rgba(27,111,232,0.15)" : "rgba(255,255,255,0.05)",
                                  border: `1px solid ${insumoFiles[insumo.id] ? "rgba(27,111,232,0.4)" : "rgba(255,255,255,0.1)"}`,
                                  borderRadius: 6,
                                  cursor: "pointer",
                                  fontSize: 11,
                                  fontWeight: 600,
                                  color: insumoFiles[insumo.id] ? "#93C5FD" : "rgba(255,255,255,0.4)",
                                }}>
                                  {insumoFiles[insumo.id] ? insumoFiles[insumo.id].name : "Adjuntar archivo"}
                                  <input
                                    type="file"
                                    accept={insumo.formato === "PDF" ? ".pdf" : insumo.formato === "IMAGEN" ? "image/*" : undefined}
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        setInsumoFiles(prev => ({ ...prev, [insumo.id]: file }));
                                      }
                                    }}
                                    style={{ display: "none" }}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Duración */}
              {duracionInfo && (
                <div style={{ background: "#081828", border: "1px solid rgba(27,111,232,0.2)", borderRadius: 12, padding: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <Clock size={14} color="#06B6D4" />
                    <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.8px", margin: 0 }}>
                      Duración estimada del proyecto
                    </p>
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.15)",
                    borderRadius: 8, padding: "8px 12px", marginBottom: 12,
                  }}>
                    <Clock size={12} color="#67E8F9" style={{ flexShrink: 0 }} />
                    <p style={{ fontFamily: FONT, fontSize: 11, color: "#67E8F9", margin: 0 }}>
                      Mínimo: <strong>{duracionInfo.min} días</strong> · Sugerido: <strong>{duracionInfo.sugerido} días</strong>
                    </p>
                  </div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6 }}>
                    ¿Cuántos días necesitas para completar el proyecto?
                  </label>
                  <input
                    type="range"
                    min={duracionInfo.min}
                    max={Math.max(duracionInfo.sugerido, duracionInfo.min)}
                    value={diasSeleccionados}
                    onChange={(e) => setDiasSeleccionados(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#F97316" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{duracionInfo.min} días</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#F97316" }}>{diasSeleccionados} días</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{Math.max(duracionInfo.sugerido, duracionInfo.min)} días</span>
                  </div>
                </div>
              )}

              {/* Descripción adicional */}
              <div>
                <label style={{
                  fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase", letterSpacing: "0.8px",
                  display: "block", marginBottom: 8,
                }}>
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

              {/* ── BANNER: insumos faltantes ──
                  Aparece arriba del botón cuando hay obligatorios sin cargar,
                  para que la MYPE sepa por qué el botón está bloqueado en lugar
                  de quedarse mirando un disabled silencioso. */}
              {insumosFaltantes.length > 0 && (
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  background: "rgba(251,191,36,0.08)",
                  border: "1px solid rgba(251,191,36,0.25)",
                  borderRadius: 10, padding: "12px 14px",
                }}>
                  <AlertCircle size={16} color="#FBBF24" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#FBBF24", margin: "0 0 4px" }}>
                      Falta{insumosFaltantes.length === 1 ? "" : "n"} {insumosFaltantes.length} insumo{insumosFaltantes.length === 1 ? "" : "s"} obligatorio{insumosFaltantes.length === 1 ? "" : "s"}
                    </p>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 11, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                      {insumosFaltantes.map(i => (
                        <li key={i.id}>{i.nombre}</li>
                      ))}
                    </ul>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", margin: "6px 0 0" }}>
                      Adjúntalos arriba para poder publicar el proyecto.
                    </p>
                  </div>
                </div>
              )}

              {/* ── BLOQUE DE ERROR del backend ──
                  Reemplaza al viejo modal "Sí, es distinto". Hard block del 409:
                  la MYPE no puede insistir; le explicamos qué hacer. */}
              {errorPublicar && (
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  background: errorPublicar.tipo === "duplicado"
                    ? "rgba(249,115,22,0.08)"
                    : "rgba(239,68,68,0.08)",
                  border: errorPublicar.tipo === "duplicado"
                    ? "1px solid rgba(249,115,22,0.25)"
                    : "1px solid rgba(239,68,68,0.25)",
                  borderRadius: 10, padding: "12px 14px",
                }}>
                  <AlertCircle
                    size={16}
                    color={errorPublicar.tipo === "duplicado" ? "#F97316" : "#F87171"}
                    style={{ flexShrink: 0, marginTop: 1 }}
                  />
                  <div>
                    <p style={{
                      fontSize: 12, fontWeight: 700,
                      color: errorPublicar.tipo === "duplicado" ? "#FB923C" : "#F87171",
                      margin: "0 0 4px",
                    }}>
                      {errorPublicar.tipo === "duplicado"
                        ? "No puedes publicar otro proyecto del mismo tipo"
                        : "No se pudo publicar el proyecto"}
                    </p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.5 }}>
                      {errorPublicar.mensaje}
                    </p>
                    {errorPublicar.tipo === "duplicado" && (
                      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", margin: "6px 0 0", lineHeight: 1.5 }}>
                        Si necesitas más estudiantes para algo parecido, espera a que el proyecto actual termine y vuelve a publicar otro.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Error genérico del hook (si viene de otro lado, no del rawError) */}
              {apiError && !errorPublicar && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 8, padding: "10px 14px",
                }}>
                  <AlertCircle size={15} color="#F87171" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: "#F87171", margin: 0 }}>{apiError}</p>
                </div>
              )}

              {/* Botones */}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isLoading}
                  style={{
                    fontFamily: FONT, width: 44, height: 46, borderRadius: 9, flexShrink: 0,
                    background: "#081828", border: "1.5px solid rgba(27,111,232,0.25)",
                    color: "#94A3B8", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
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
                  disabled={isLoading || isSubmitting || !canPublish}
                  style={{
                    fontFamily: FONT, flex: 1, height: 46, borderRadius: 9,
                    border: "none", color: "#fff",
                    background: canPublish
                      ? "linear-gradient(135deg,#F97316,#DC4A00)"
                      : "rgba(255,255,255,0.08)",
                    cursor: (isLoading || !canPublish) ? "not-allowed" : "pointer",
                    fontWeight: 600, fontSize: 14,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    opacity: isLoading ? 0.7 : 1,
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && canPublish) e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
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
      )}
    </div>
  );
}