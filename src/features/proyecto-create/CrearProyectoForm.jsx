import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const FONT = "'Inter', 'Angro Std', 'Outfit', -apple-system, sans-serif";
const FONT_MONO = "ui-monospace, SFMono-Regular, Consolas, 'Courier New', monospace";
const ease = [0.16, 1, 0.3, 1];

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

const ARBOL = {
  inicio: {
    pregunta: "Principales objetivos estratégicos o cuellos de botella de negocio",
    tieneInputLibre: true,
    inputPlaceholder: "Ingresar problema técnico no listado y presionar Entrar...",
    opciones: [
      { texto: "Presencia de marca en internet y/o atracción comercial de clientes", siguiente: "mostrar_internet" },
      { texto: "Gestión, estructuración o depuración de la información operativa interna", siguiente: "organizar_info" },
      { texto: "Fricción o fallas críticas en los canales y aplicaciones para usuarios", siguiente: "experiencia_clientes" },
      { texto: "Problemas y vulnerabilidades en red o escalamiento en hardware de puntos", siguiente: "infraestructura" },
    ],
  },
  mostrar_internet: {
    pregunta: "Fase actual del posicionamiento o madurez de los activos web",
    opciones: [
      { texto: "Identidad digital nula (iniciando presencia) en motores de búsqueda", resultado: "1.1" },
      { texto: "Presencia informal exclusiva en redes (sin embudo transaccional web)", resultado: "1.1" },
      { texto: "Sistema web estático desactualizado (requiere catálogo o visualización web)", resultado: "1.2" },
    ],
  },
  organizar_info: {
    pregunta: "Identificación de los nodos de datos clave que demandan atención",
    opciones: [
      { texto: "Datos relacionales de seguimiento (ventas, stock, reservas o agenda de citas)", resultado: "1.3" },
      { texto: "Datos no centralizados almacenados en libros manuales o dispersos en .xlsx", siguiente: "excel_opciones" },
      { texto: "Infraestructura carente de modelo lógico (Datos perdidos, silos y alta fricción)", resultado: "2.2" },
    ],
  },
  excel_opciones: {
    pregunta: "Requisito táctico de transformación y analítica",
    opciones: [
      { texto: "Descubrimiento de insights a través del modelado exploratorio", resultado: "2.3" },
      { texto: "Proyección interactiva en cuadros de mando (indicadores, reportes visuales)", resultado: "1.4" },
      { texto: "Consolidación rígida dentro de una Base de Datos central transaccional (SQL)", resultado: "2.1" },
    ],
  },
  experiencia_clientes: {
    pregunta: "Priorización de mejora UX según métricas del viaje del cliente",
    opciones: [
      { texto: "Mapeo esquemático o Wireframing (aplicativo con especificación definida)", resultado: "3.1" },
      { texto: "Problemas en etapas específicas del funnel (tasa de conversión lenta, UI obsoleta)", resultado: "3.2" },
      { texto: "Ataque frontal a la pérdida de clientes: Desconocimiento total de por qué abandonan", resultado: "3.3" },
    ],
  },
  infraestructura: {
    pregunta: "Definición del nivel de gravedad/escalamiento requerido en entorno TI",
    tieneInputLibre: true,
    inputPlaceholder: "Declaración abierta del evento en infraestructura de redes o hardware...",
    opciones: [
      { texto: "Latencias locales crónicas, hardware obsoleto o incidentes sin solución clara", resultado: "4.1" },
      { texto: "Lanzamiento u apertura de ubicación. Despliegue primario y auditoría", resultado: "4.2" },
      { texto: "Test general de protocolos, seguridad lógica e indentificación de vectores de riesgo", resultado: "5.1" },
      { texto: "Protección a nivel archivo: Restauraciones y almacenamiento a resguardo total", resultado: "5.2" },
    ],
  },
};

const LEAF_PROJECTS = {
  1.1: { titulo: "Página web de presentación (Landing Page) con formulario", areaSistemas: AREA.WEB, cupos: 1, entregables: ["Diseño visual de interfaz (Previa)", "Entregable en repositorio (Git)", "Implementación en producción web", "Inyección del Webform a Correo/App", "Documento táctico para editores"] },
  1.2: { titulo: "Prototipo interactivo de Catálogo Digital de Productos", areaSistemas: AREA.WEB, cupos: 2, entregables: ["Modelado lógico de las taxonomías", "Buscador modular y panel", "Release taggeado en ambiente de versión", "Guía y soporte post-configuración"] },
  1.3: { titulo: "Prototipo de sistema de registro de clientes y pedidos", areaSistemas: AREA.SOFTWARE, cupos: 2, entregables: ["Vista o formulario modular central", "Capa de presentación o vista para administradores", "Controles estrictos (Manejo de estados con sesión)", "Fichas técnicas / de usuario"] },
  1.4: { titulo: "Dashboard interactivo para visualización de datos", areaSistemas: AREA.DATOS, cupos: 2, entregables: ["Arquitectura lógica del cuadro de mando", "Implementación sobre KPI dictaminados", "Pipeline básico en importación plana (Csv)", "Documento funcional metodológico"] },
  2.1: { titulo: "Diseño e implementación de Base de Datos relacional", areaSistemas: AREA.BD, cupos: 2, entregables: ["Matriz o Diagrama de ER normativo", "DDL Scripts con constraints documentados", "Mapeo al modelo (Diccionario)", "Resumen ejecutivo post ejecución y unit tests"] },
  2.2: { titulo: "Servicio de limpieza y migración de datos", areaSistemas: AREA.BD, cupos: 2, entregables: ["Inventario previo / de consistencias", "Depuración, homologación (Dataset maestro)", "Algoritmo y/o Query generativo o Transformación ETL básica", "Planimetría táctica de pasos y resultados"] },
  2.3: { titulo: "Análisis exploratorio de datos y diagnóstico", areaSistemas: AREA.DATOS, cupos: 2, entregables: ["Informe C-level orientado y procesado a acciones", "Dashboard u outputs tabulares, estadísticos temporales", "Separación en cortes de cliente para targetización pura", "Cierre ejecutivo guiado"] },
  3.1: { titulo: "Diseño de interfaz UI/UX de alta fidelidad", areaSistemas: AREA.SOFTWARE, cupos: 1, entregables: ["Arquitectura de pantallas esquematizadas (Frames)", "Render clickeable para usuario e ingenieros UI", "Bibliotecas con definiciones semánticas para componentes", "Lotes empaquetados con fuentes y gráficos web listos"] },
  3.2: { titulo: "Auditoría, plan y despliegue interactivo para la eficiencia y satisfacción final", areaSistemas: AREA.SOFTWARE, cupos: 1, entregables: ["Auditoría heurística", "Esqueleto técnico", "Implementación estándar UI"] },
  3.3: { titulo: "Mapas dinámicos de experiencia centrados el problema cliente", areaSistemas: AREA.SOFTWARE, cupos: 1, entregables: ["Cuerpo maestro mapa completo", "Detección específica de cuellos", "Listados de estrategias", "Entrega global e integral"] },
  4.1: { titulo: "Monitoreo e identificación a fallas de protocolos topológicos", areaSistemas: AREA.SOPORTE, cupos: 2, entregables: ["Monitoreo completo", "Mapeado a la planimetría", "Gestión de recomendaciones", "Especificación técnica"] },
  4.2: { titulo: "Modelado LAN/WLAN plan estructural locales operacionales", areaSistemas: AREA.SOPORTE, cupos: 2, entregables: ["Levantamiento de especificaciones", "Routing cables", "Requisitos BOM", "Medidas perimetrales"] },
  5.1: { titulo: "Consultoría de seguridad informática local", areaSistemas: AREA.SOPORTE, cupos: 2, entregables: ["Scouting base", "Análisis de accesos", "Guía de reglas", "Modelos de contingencias"] },
  5.2: { titulo: "Política Resiliencia Recuperación", areaSistemas: AREA.SOPORTE, cupos: 2, entregables: ["Diseño de esquema backup", "Configuración de herramienta", "Script automático", "Test de contingencia"] },
};

export function CrearProyectoForm() {
  const { crearProyecto, isLoading, error: apiError, rawError } = useCrearProyecto();
  const [errorPublicar, setErrorPublicar] = useState(null);

  useEffect(() => {
    if (!rawError) return;
    const status = rawError?.response?.status;
    const message = rawError?.response?.data?.message || rawError?.message;
    if (status === 409) {
      setErrorPublicar("Proyecto duplicado: Actualmente gestiona un esfuerzo de la misma índole técnica. Archívelo antes.");
    } else if (status === 400) {
      setErrorPublicar(message || "Fallo sistémico de publicación debido a validaciones no cubiertas.");
    } else if (status) {
      setErrorPublicar(message || "Transacción abortada: Discrepancias generales durante post-request.");
    }
  }, [rawError]);

  const { data: arbolData, isLoading: arbolIsLoading, isError: arbolIsError } = useArbolDecision();
  const arbol = arbolData && !arbolIsError ? arbolData : {
    nodoRaizCodigo: "inicio",
    nodos: ARBOL,
    resultados: LEAF_PROJECTS,
  };

  const [plazo, setPlazo] = useState("CORTO");
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
      const dur = resultadoData ? { min: resultadoData.diasMin, sugerido: resultadoData.diasSugerido } : DURACIONES.personalizado;
      setDuracionInfo(dur);
      setSelectedResult(arbol.resultados[opcion.resultado] || LEAF_PROJECTS[opcion.resultado]);
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
    setDuracionInfo(DURACIONES.personalizado);
    setSelectedResult({
      titulo: inputLibre.trim(),
      areaSistemas: AREA.OTRO,
      cupos: 1,
      entregables: ["Cuerpo resolutivo por determinar luego de sesión kick-off técnica asignada"],
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

  const insumosFaltantes = insumos.filter(i => i.obligatorio && !insumoFiles[i.id]);
  const canPublish = insumosFaltantes.length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || !canPublish) return;
    setErrorPublicar(null);
    setIsSubmitting(true);

    const payload = {
      titulo: selectedResult.titulo || selectedResult.nombre,
      descripcion: comentario.trim() ? comentario.trim() : `Requerimiento automatizado. Desarrollo: ${selectedResult.titulo || selectedResult.nombre}.`,
      objetivo: `Ejecución iterativa enfocada en solucionar inoperancias vinculadas a ${selectedResult.titulo || selectedResult.nombre}.`,
      entregablesSugeridos: (selectedResult.entregables || []).map((ent) => `- ${ent.titulo || ent}`).join("\n"),
      areaSistemas: selectedResult.areaSistemas || AREA.OTRO,
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
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ fontFamily: FONT, width: "100%", maxWidth: 1400, margin: "0 auto", padding: "16px 24px 32px", color: "#111827", lineHeight: 1.5 }}>
      <style>{`
        * { box-sizing: border-box; }
        .b-tool-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E5E7EB; padding-bottom: 12px; margin-bottom: 20px; }
        .b-text-xs { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #6B7280; margin-bottom: 4px; }
        .b-text-base { font-size: 13px; font-weight: 500; color: #111827; }
        .b-text-lg { font-size: 15px; font-weight: 600; color: #111827; letter-spacing: -0.01em; }
        .b-text-xl { font-size: 17px; font-weight: 600; color: #111827; letter-spacing: -0.02em; }
        .b-text-mute { color: #6B7280; font-size: 12px; font-weight: 400; }
        
        .b-border-box { border: 1px solid #E5E7EB; border-radius: 6px; background: #FFFFFF; }
        
        .b-toggle-group { display: flex; gap: 4px; background: #F3F4F6; padding: 3px; border-radius: 5px; }
        .b-toggle { border: none; background: transparent; padding: 5px 12px; font-size: 11px; font-weight: 600; font-family: ${FONT}; color: #6B7280; border-radius: 4px; cursor: pointer; transition: all 0.15s ease; }
        .b-toggle.active { background: #FFFFFF; color: #111827; box-shadow: 0 1px 2px rgba(0,0,0,0.06); }
        .b-toggle:disabled { cursor: not-allowed; opacity: 0.6; }

        .b-menu-row { display: flex; align-items: center; width: 100%; text-align: left; background: #FFFFFF; border: none; border-bottom: 1px solid #E5E7EB; padding: 12px 14px; cursor: pointer; font-family: ${FONT}; font-size: 13px; font-weight: 500; color: #111827; transition: background 0.1s ease; line-height: 1.4; }
        .b-menu-row:last-child { border-bottom: none; }
        .b-menu-row:hover { background: #F9FAFB; }
        .b-menu-row .b-indicator { margin-right: 12px; color: #D1D5DB; font-weight: bold; width: 24px; text-align: center; font-family: ${FONT_MONO}; font-size: 11px; }

        .b-input-minimal { width: 100%; border: none; padding: 14px; background: transparent; font-family: ${FONT}; font-size: 13px; font-weight: 500; outline: none; }
        .b-input-minimal::placeholder { color: #9CA3AF; }

        .b-textarea { width: 100%; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 6px; padding: 10px 12px; font-family: ${FONT}; font-size: 13px; color: #111827; outline: none; transition: border-color 0.15s; min-height: 100px; resize: vertical; line-height: 1.5; }
        .b-textarea:focus { border-color: #000000; box-shadow: inset 0 0 0 1px #000000; }
        .b-textarea::placeholder { color: #9CA3AF; }

        .b-slider-row { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid #E5E7EB; }
        .b-slider-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .b-slider-top { display: flex; justify-content: space-between; align-items: center; }
        .b-slider-val { font-family: ${FONT_MONO}; font-size: 12px; font-weight: 600; background: #F3F4F6; padding: 2px 8px; border-radius: 4px; }
        .b-slider { -webkit-appearance: none; width: 100%; height: 2px; background: #E5E7EB; border-radius: 2px; outline: none; margin: 6px 0; }
        .b-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #000000; cursor: pointer; transition: transform 0.1s; }
        .b-slider::-webkit-slider-thumb:hover { transform: scale(1.1); }
        
        .b-file-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background: #F9FAFB; border-radius: 4px; border: 1px solid #E5E7EB; margin-top: 8px; transition: border-color 0.1s; }
        .b-file-row.has-file { border-color: #000000; background: #FFFFFF; }
        .b-file-btn { border: 1px solid #D1D5DB; background: #FFFFFF; border-radius: 4px; font-family: ${FONT}; font-size: 11px; font-weight: 600; padding: 3px 8px; cursor: pointer; color: #374151; white-space: nowrap; }
        .b-file-btn:hover { background: #F3F4F6; }

        .b-button-primary { background: #000000; color: #FFFFFF; border: 1px solid #000000; width: 100%; height: 38px; border-radius: 6px; font-family: ${FONT}; font-weight: 500; font-size: 13px; cursor: pointer; transition: all 0.1s; display: inline-flex; align-items: center; justify-content: center; margin-top: 12px; }
        .b-button-primary:hover:not(:disabled) { background: #111827; }
        .b-button-primary:disabled { opacity: 0.3; cursor: not-allowed; border-color: transparent; }
        
        .b-btn-text { background: transparent; border: none; font-family: ${FONT}; font-size: 12px; font-weight: 500; color: #6B7280; padding: 0; cursor: pointer; transition: color 0.15s; }
        .b-btn-text:hover { color: #111827; }

        .b-status-banner { padding: 8px 10px; background: #FEF2F2; border-left: 2px solid #EF4444; border-radius: 0 4px 4px 0; margin-top: 12px; font-size: 12px; color: #991B1B; font-weight: 500; line-height: 1.4; }

        @keyframes bTyping { 0% { content: "."; } 33% { content: ".."; } 66% { content: "..."; } }
        .b-loader::after { content: "."; animation: bTyping 1.2s infinite steps(1); display: inline-block; width: 14px; text-align: left; }
      `}</style>

      {/* HEADER COMPACTO */}
      <div className="b-tool-header">
        <div>
          <span className="b-text-xs">Flujo Maestro Operativo</span>
          <div className="b-text-lg" style={{ marginTop: 2 }}>{selectedResult ? "Gestión de Requerimiento TI" : "Motor de Diagnóstico Lógico"}</div>
        </div>
        <div className="b-toggle-group">
          <button className={`b-toggle ${plazo === "CORTO" ? "active" : ""}`} onClick={() => setPlazo("CORTO")}>Corto Plazo</button>
          <button className="b-toggle" onClick={() => {}} disabled>Largo Plazo</button>
        </div>
      </div>

      {arbolIsLoading ? (
        <div style={{ textAlign: "center", paddingTop: 60, color: "#6B7280", fontSize: 12, fontFamily: FONT_MONO, fontWeight: 500 }}>
          ESTABLECIENDO CONEXIÓN DE ESTADO <span className="b-loader"></span>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          
          {/* FASE 1: DIAGNÓSTICO - LAYOUT HORIZONTAL COMPACTO */}
          {!selectedResult && (
            <motion.div
              key={currentKey}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2, ease }}
              style={{
                display: "grid",
                gridTemplateColumns: "280px minmax(0, 1fr)",
                gap: 32,
                alignItems: "start"
              }}
            >
              <div>
                <div className="b-text-xs">Secuencia Operativa Actual</div>
                <h3 className="b-text-xl" style={{ marginTop: 4, marginBottom: 12 }}>{currentNode.pregunta}</h3>
                <p className="b-text-mute" style={{ marginBottom: 20 }}>Seleccione el eje temático que presenta fricción interna.</p>
                {history.length > 1 && (
                  <button className="b-btn-text" onClick={handleBack}>← Retroceder capa</button>
                )}
              </div>

              <div className="b-border-box">
                {currentNode.opciones.map((op, idx) => {
                  const numberPrefix = (idx + 1).toString().padStart(2, "0");
                  return (
                    <button key={idx} className="b-menu-row" onClick={() => handleOptionClick(op)}>
                      <span className="b-indicator">{numberPrefix}</span>
                      <span style={{ flex: 1 }}>{op.texto}</span>
                      <span style={{ fontFamily: FONT_MONO, fontSize: 9, color: "#9CA3AF" }}>{op.resultado ? "→" : "↘"}</span>
                    </button>
                  );
                })}
                {currentNode.tieneInputLibre && (
                  <div style={{ display: "flex", borderTop: "1px solid #E5E7EB", width: "100%", background: "#F9FAFB", borderRadius: "0 0 6px 6px" }}>
                    <input
                      className="b-input-minimal"
                      type="text"
                      value={inputLibre}
                      onChange={(e) => setInputLibre(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleInputLibreSubmit()}
                      placeholder={currentNode.inputPlaceholder}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* FASE 2: CONFIGURACIÓN - 3 COLUMNAS MÁS ANCHAS Y MENOS ALTAS */}
          {selectedResult && (
            <motion.form
              key="formulario"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25, ease }}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 320px",
                gap: 24,
                alignItems: "start"
              }}
            >
              
              {/* COLUMNA 1: DIRECTRIZ */}
              <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                {/* Título y contenido principal */}
                <div>
                  <div className="b-text-xs">Directriz Establecida</div>
                  <h4 className="b-text-xl" style={{ marginTop: 2, marginBottom: 16 }}>{selectedResult.titulo}</h4>
                  
                  {!selectedResult.esPersonalizado && (
                    <div style={{ marginTop: 20 }}>
                      <div className="b-text-xs" style={{ borderBottom: "1px solid #E5E7EB", paddingBottom: 5, marginBottom: 10 }}>Vector De Ejecutables</div>
                      <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
                        {selectedResult.entregables.slice(0, 5).map((ent, i) => (
                          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#4B5563", marginBottom: 8, lineHeight: 1.4 }}>
                            <span style={{ color: "#D1D5DB" }}>—</span> {typeof ent === "string" ? ent.substring(0, 60) : (ent.titulo || ent.nombre).substring(0, 60)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Botón VOLVER al final - abajo a la izquierda */}
                <div style={{ marginTop: "auto", paddingTop: 20 }}>
                  <button 
                    type="button" 
                    className="b-btn-text" 
                    onClick={handleBack} 
                    style={{ fontSize: 10, fontWeight: 600 }}
                  >
                    ← VOLVER
                  </button>
                </div>
              </div>

              {/* COLUMNA 2: PARÁMETROS OPERATIVOS */}
              <div className="b-border-box" style={{ padding: 14 }}>
                <div className="b-text-xs" style={{ marginBottom: 12 }}>Controles Sistémicos</div>
                
                <div className="b-slider-row">
                  <div className="b-slider-top">
                    <span className="b-text-base" style={{ fontSize: 12 }}>Estudiantes</span>
                    <span className="b-slider-val">{cuposSeleccionados}</span>
                  </div>
                  {selectedResult.cuposMin && selectedResult.cuposMax && selectedResult.cuposMax > selectedResult.cuposMin ? (
                    <input type="range" className="b-slider" min={selectedResult.cuposMin} max={selectedResult.cuposMax} value={cuposSeleccionados} onChange={(e) => setCuposSeleccionados(Number(e.target.value))} />
                  ) : (
                    <div className="b-text-mute" style={{ fontSize: 10 }}>Régimen operativo base fijo.</div>
                  )}
                </div>

                {duracionInfo && (
                  <div className="b-slider-row">
                    <div className="b-slider-top">
                      <span className="b-text-base" style={{ fontSize: 12 }}>Tiempo Estimado</span>
                      <span className="b-slider-val">{diasSeleccionados}d</span>
                    </div>
                    <input type="range" className="b-slider" min={duracionInfo.min} max={Math.max(duracionInfo.sugerido, duracionInfo.min)} value={diasSeleccionados} onChange={(e) => setDiasSeleccionados(Number(e.target.value))} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#9CA3AF", fontFamily: FONT_MONO }}>
                      <span>MIN:{duracionInfo.min}</span>
                      <span>MAX:{Math.max(duracionInfo.sugerido, duracionInfo.min)}</span>
                    </div>
                  </div>
                )}

                {insumos.length > 0 && !selectedResult.esPersonalizado && (
                  <div style={{ marginTop: 16 }}>
                    <div className="b-text-xs">Archivos Matriz</div>
                    {insumos.slice(0, 3).map((insumo) => {
                      const fileInfo = insumoFiles[insumo.id];
                      return (
                        <div key={insumo.id} className={`b-file-row ${fileInfo ? "has-file" : ""}`}>
                          <div style={{ overflow: "hidden", flex: 1 }}>
                            <div style={{ fontSize: 12, fontWeight: 500, color: fileInfo ? "#111827" : "#4B5563", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {insumo.nombre}
                            </div>
                            <div style={{ fontSize: 9, fontFamily: FONT_MONO, color: "#9CA3AF" }}>
                              {insumo.obligatorio ? "OB" : "OP"} • {fileInfo ? "OK" : "PEND"}
                            </div>
                          </div>
                          <label className="b-file-btn">
                            {fileInfo ? "EDIT" : "SUBIR"}
                            <input type="file" style={{ display: "none" }} accept={insumo.formato === "PDF" ? ".pdf" : insumo.formato === "IMAGEN" ? "image/*" : undefined} onChange={(e) => { const f = e.target.files[0]; if (f) setInsumoFiles(prev => ({ ...prev, [insumo.id]: f })); }} />
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* COLUMNA 3: EJECUCIÓN */}
              <div>
                <label className="b-text-xs" style={{ display: "block" }}>Especificación [Obligatoria]</label>
                <textarea
                  required
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Instrucciones detalladas del alcance comercial..."
                  className="b-textarea"
                  style={{ minHeight: 80 }}
                />

                {insumosFaltantes.length > 0 && (
                  <div className="b-status-banner">⚠️ Requiere adjuntar documentación obligatoria (OB).</div>
                )}

                {errorPublicar && (
                  <div className="b-status-banner">⚠️ {errorPublicar}</div>
                )}
                {apiError && !errorPublicar && (
                  <div className="b-status-banner">⚠️ {apiError}</div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || isSubmitting || !canPublish}
                  className="b-button-primary"
                >
                  {isLoading || isSubmitting ? "PROCESANDO..." : "PUBLICAR PROYECTO"}
                </button>
              </div>

            </motion.form>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}