// src/features/proyecto-create/CrearProyectoForm.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, HelpCircle, CheckCircle2, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { useCrearProyecto } from "./useCrearProyecto";

// ── CONFIGURACIÓN DEL ÁRBOL DE DECISIONES DETERMINÍSTICO ──────────────────────
const ARBOL_DECISION = {
  inicio: {
    pregunta: "¿Cuál es la principal necesidad actual de tu negocio?",
    opciones: [
      { texto: "Mostrar mi negocio en internet o captar clientes", siguiente: "mostrar_internet" },
      { texto: "Organizar u ordenar la información interna de mi negocio", siguiente: "organizar_info" },
      { texto: "Mejorar la experiencia digital de mis clientes", siguiente: "experiencia_clientes" },
      { texto: "Mejorar mi red local o mi infraestructura tecnológica", siguiente: "infraestructura" }
    ]
  },
  mostrar_internet: {
    pregunta: "¿Cuál es tu situación digital actual?",
    opciones: [
      { texto: "No tengo presencia en internet todavía", resultado: "1.1" },
      { texto: "Tengo redes sociales activas pero no una página web", resultado: "1.1" },
      { texto: "Tengo una web básica pero quiero mostrar mejor mis productos", resultado: "1.2" }
    ]
  },
  organizar_info: {
    pregunta: "¿Qué tipo de información necesitas organizar prioritariamente?",
    opciones: [
      { texto: "Control de clientes, pedidos, citas o reservas de servicios", resultado: "1.3" },
      { texto: "Registro de ventas, inventario de productos o datos que manejo en Excel", siguiente: "excel_opciones" },
      { texto: "No lo sé con certeza, mi información está muy desorganizada", resultado: "2.2" }
    ]
  },
  excel_opciones: {
    pregunta: "¿Qué te gustaría lograr principalmente con esos datos de Excel?",
    opciones: [
      { texto: "Quiero entender patrones ocultos y qué me dicen los datos", resultado: "2.3" },
      { texto: "Quiero visualizarlos en gráficos interactivos fáciles de entender", resultado: "1.4" },
      { texto: "Quiero estructurarlos en una base de datos real, robusta y segura", resultado: "2.1" }
    ]
  },
  experiencia_clientes: {
    pregunta: "¿Tienes identificado qué aspecto deseas optimizar con tus clientes?",
    opciones: [
      { texto: "Sí, sé exactamente qué aplicación o sistema web requiero mapear", resultado: "3.1" },
      { texto: "Tengo un proceso digital actual que suele confundir o trabar a mis clientes", resultado: "3.2" },
      { texto: "No sé dónde está el cuello de botella o por qué abandonan mi web", resultado: "3.3" }
    ]
  },
  infraestructura: {
    pregunta: "¿Cuál es la situación más crítica de tu entorno tecnológico?",
    opciones: [
      { texto: "Mi red local falla, la conexión va lenta y desconozco el motivo", resultado: "4.1" },
      { texto: "Voy a abrir o ampliar un local y necesito saber qué equipos instalar", resultado: "4.2" },
      { texto: "Quiero saber si las cuentas y datos de mi negocio están protegidos", resultado: "5.1" },
      { texto: "Quiero asegurar que nunca perderé mis archivos o registros importantes", resultado: "5.2" }
    ]
  }
};

const LEAF_PROJECTS = {
  "1.1": {
    titulo: "Página web de presentación (Landing Page) con formulario",
    areaSistemas: "DESARROLLO_WEB", // ✅ Correcto
    cupos: 1, 
    entregables: [
      "Diseño visual previo de la estructura de la página antes de programar",
      "Código fuente completo alojado y ordenado en GitHub o GitLab",
      "Página web publicada y accesible desde internet (Hosting configurado)",
      "Formulario de contacto funcional vinculado a tu WhatsApp o correo corporativo",
      "Manual de usuario digital paso a paso para modificar los textos tú mismo"
    ]
  },
  "1.2": {
    titulo: "Prototipo interactivo de Catálogo Digital de Productos",
    areaSistemas: "DESARROLLO_WEB", // ✅ Correcto
    cupos: 2, 
    entregables: [
      "Estructura organizada de categorías de productos acordada con el negocio",
      "Plataforma web con buscador interactivo y visualización dinámica de imágenes",
      "Código fuente completo, modular y listo para producción en Git",
      "Manual de administración para el registro, edición y baja de productos"
    ]
  },
  "1.3": {
    titulo: "Prototipo de sistema de registro de clientes y pedidos",
    areaSistemas: "DESARROLLO_SOFTWARE", // 🔄 CORREGIDO (Era SISTEMAS_INFORMACION)
    cupos: 2, 
    entregables: [
      "Formulario web interactivo y seguro para capturar datos de clientes",
      "Panel interno privado para consultar, ordenar y filtrar pedidos o citas",
      "Código fuente del software con manejo seguro de sesiones y credenciales",
      "Guía práctica de operación del sistema para el personal encargado"
    ]
  },
  "1.4": {
    titulo: "Dashboard interactivo para la visualización de datos empresariales",
    areaSistemas: "ANALISIS_DATOS", // 🔄 CORREGIDO (Era SISTEMAS_INFORMACION)
    cupos: 2, 
    entregables: [
      "Maquetación previa de la distribución del panel de control gráfico",
      "Dashboard web interactivo con gráficos estadísticos (barras, líneas, KPI)",
      "Módulo de importación o carga de datos históricos desde archivos Excel/CSV",
      "Manual interpretativo para el análisis de las métricas comerciales resultantes"
    ]
  },
  "2.1": {
    titulo: "Diseño e implementación de Base de Datos relacional profesional",
    areaSistemas: "BASE_DE_DATOS", // 🔄 CORREGIDO (Era BASE_DATOS - Falta el "_DE_")
    cupos: 2, 
    entregables: [
      "Diagrama del Modelo Entidad-Relación conceptual y lógico de los datos",
      "Scripts de programación SQL estructurados y listos para ejecutar en el servidor",
      "Diccionario de datos detallando la función de cada tabla y columna",
      "Reporte técnico de pruebas de conectividad y optimización de consultas"
    ]
  },
  "2.2": {
    titulo: "Servicio integral de limpieza, ordenamiento y migración de datos",
    areaSistemas: "BASE_DE_DATOS", // 🔄 CORREGIDO
    cupos: 2, 
    entregables: [
      "Informe diagnóstico detallando los errores e inconsistencias encontrados originalmente",
      "Archivos o tablas limpias, libres de registros duplicados o corruptos",
      "Scripts automáticos o mapeos lógicos ejecutados para la transformación de datos",
      "Documentación técnica del nuevo formato estandarizado y unificado"
    ]
  },
  "2.3": {
    titulo: "Análisis exploratorio de datos y diagnóstico de negocio",
    areaSistemas: "ANALISIS_DATOS", // 🔄 CORREGIDO (Era INTELIGENCIA_NEGOCIO)
    cupos: 2, 
    entregables: [
      "Informe ejecutivo de analítica comercial descriptiva con hallazgos críticos",
      "Gráficos interactivos detallando tendencias de venta, horarios pico e inventario",
      "Segmentación analítica de clientes clave basada en comportamiento histórico",
      "Presentación final con conclusiones operativas para la toma de decisiones"
    ]
  },
  "3.1": {
    titulo: "Diseño de interfaz de usuario interactiva (UI/UX) en Figma",
    areaSistemas: "DESARROLLO_WEB", // 🔄 CORREGIDO (Era DISEÑO_SOFTWARE)
    cupos: 1, 
    entregables: [
      "Wireframes (bocetos en blanco y negro) del flujo de navegación inicial",
      "Enlace al prototipo de alta fidelidad interactivo en Figma (simulación de clics)",
      "Guía de estilo digital que incluye paleta de colores, tipografías e íconos",
      "Paquete de recursos visuales exportados y listos para el equipo de desarrollo"
    ]
  },
  "3.2": {
    titulo: "Rediseño optimizado de experiencia de usuario para canales digitales",
    areaSistemas: "DESARROLLO_WEB", // 🔄 CORREGIDO
    cupos: 1, 
    entregables: [
      "Informe de auditoría de usabilidad detallando fricciones en la plataforma actual",
      "Propuesta visual rediseñada con flujos simplificados para el cliente",
      "Prototipo interactivo comparativo demostrando las mejoras de experiencia",
      "Documento formal con las especificaciones y estándares UX recomendados"
    ]
  },
  "3.3": {
    titulo: "Mapa de experiencia del cliente (Customer Journey Map) y diagnóstico",
    areaSistemas: "ANALISIS_DATOS", // 🔄 CORREGIDO
    cupos: 1, 
    entregables: [
      "Mapa visual detallado del viaje del cliente (Customer Journey Map) interactivo",
      "Identificación formal de puntos de fricción y cuellos de botella operativos",
      "Matriz priorizada de oportunidades de mejora según el impacto en el negocio",
      "Informe estratégico con tácticas aplicables a los canales del negocio"
    ]
  },
  "4.1": {
    titulo: "Diagnóstico de conectividad y plan de mejora de infraestructura de red",
    areaSistemas: "SOPORTE_TI", // 🔄 CORREGIDO (Era REDES_TELECOM)
    cupos: 2, 
    entregables: [
      "Informe del estado, rendimiento, latencia y cobertura actual de tu red local",
      "Diagrama técnico de la topología de red física con fallas identificadas",
      "Plan de acción estructurado con configuraciones optimizadas de red",
      "Lista de equipos recomendados (hardware) alineada al presupuesto comercial"
    ]
  },
  "4.2": {
    titulo: "Diseño técnico de arquitectura de red para nuevos locales",
    areaSistemas: "SOPORTE_TI", // 🔄 CORREGIDO
    cupos: 2, 
    entregables: [
      "Plano constructivo, lógico y físico de las conexiones de red en el nuevo local",
      "Ubicación estratégica de cableado estructurado y puntos de acceso Wi-Fi",
      "Especificaciones de hardware recomendadas (modelos de Router, Switches, APs)",
      "Arquitectura de seguridad perimetral inicial para segmentar la red interna"
    ]
  },
  "5.1": {
    titulo: "Auditoría básica preventiva de seguridad digital y accesos",
    areaSistemas: "SOPORTE_TI", // 🔄 CORREGIDO (Era SEGURIDAD_INFORMATICA)
    cupos: 2, 
    entregables: [
      "Informe confidencial de riesgos identificados en cuentas de correo y contraseñas",
      "Reporte del estado de permisos, accesos y roles del personal en tus sistemas",
      "Manual preventivo de ciberseguridad con políticas de protección para la empresa",
      "Plan de acción detallado para el blindaje de credenciales críticas"
    ]
  },
  "5.2": {
    titulo: "Diseño y despliegue automatizado de plan de respaldo de datos (Backup)",
    areaSistemas: "SOPORTE_TI", // 🔄 CORREGIDO
    cupos: 2, 
    entregables: [
      "Política formal y cronograma de copias de seguridad de la información del negocio",
      "Configuración e instalación de scripts o software de backup automático en la nube",
      "Manual operativo de recuperación de archivos ante incidentes o emergencias",
      "Reporte de pruebas exitosas de restauración de datos ejecutadas en el entorno"
    ]
  }
};

export function CrearProyectoForm() {
  // Conectamos tu mutación real de TanStack Query
  const { crearProyecto, isLoading, error: apiError } = useCrearProyecto();

  const [history, setHistory] = useState(["inicio"]);
  const [currentKey, setCurrentKey] = useState("inicio");
  const [selectedResult, setSelectedResult] = useState(null);
  const [comentario, setComentario] = useState("");

  const currentNode = ARBOL_DECISION[currentKey];
  const ease = [0.22, 1, 0.36, 1];

  const handleOptionClick = (opcion) => {
    if (opcion.resultado) {
      setSelectedResult(LEAF_PROJECTS[opcion.resultado]);
    } else if (opcion.siguiente) {
      setHistory((prev) => [...prev, opcion.siguiente]);
      setCurrentKey(opcion.siguiente);
    }
  };

  const handleBack = () => {
    if (selectedResult) {
      setSelectedResult(null);
    } else if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setCurrentKey(newHistory[newHistory.length - 1]);
    }
  };

  const handlePublishSubmit = (e) => {
    e.preventDefault();
    
    const projectPayload = {
      titulo: selectedResult.titulo,
      descripcion: comentario.trim() 
        ? comentario.trim() 
        : `Requerimiento solicitado para el desarrollo e implementación de un(a) ${selectedResult.titulo}.`,
      objetivo: `Solucionar la necesidad empresarial mediante un diseño de ${selectedResult.titulo} a medida.`,
      entregablesSugeridos: selectedResult.entregables.map(e => `• ${e}`).join("\n"),
      areaSistemas: selectedResult.areaSistemas,
      
      cupos: selectedResult.cupos, 
      
      fechaInicio: null,
      fechaLimite: null
    };

    crearProyecto(projectPayload);
  };

  return (
    <div>
      <style>{`
        .wizard-option-btn {
          width: 100%;
          padding: 16px 20px;
          background: #081828;
          border: 1px solid rgba(27, 111, 232, 0.25);
          color: #E2E8F0;
          border-radius: 12px;
          font-family: inherit;
          font-weight: 500;
          font-size: 14px;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .wizard-option-btn:hover {
          border-color: #F97316;
          background: #0F2A4A;
          color: #FFFFFF;
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.1);
        }
        .text-brand-orange { color: #F97316; }
        .text-brand-cyan { color: #06B6D4; }
        
        .saas-textarea {
          width: 100%;
          min-height: 100px;
          background: #081828;
          border: 1px solid rgba(27, 111, 232, 0.2);
          border-radius: 10px;
          color: white;
          padding: 12px;
          font-family: inherit;
          font-size: 14px;
          outline: none;
          resize: vertical;
          transition: border-color 0.2s;
        }
        .saas-textarea:focus { border-color: #F97316; }
      `}</style>

      <AnimatePresence mode="wait">
        {!selectedResult ? (
          /* ── PREGUNTAS DEL ÁRBOL ── */
          <motion.div
            key={currentKey}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25, ease }}
            className="flex flex-col gap-5"
          >
            <div className="flex items-center gap-2.5 mb-1">
              <HelpCircle size={18} className="text-brand-cyan shrink-0" />
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
                Asistente de Clasificación MYPElink
              </p>
            </div>

            <h3 className="text-lg font-bold text-white leading-snug mb-2">
              {currentNode.pregunta}
            </h3>

            <div className="flex flex-col gap-3">
              {currentNode.opciones.map((opcion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleOptionClick(opcion)}
                  className="wizard-option-btn group"
                >
                  <span>{opcion.texto}</span>
                  <ArrowRight size={16} className="text-slate-500 group-hover:text-brand-orange transition-colors shrink-0 ml-3" />
                </button>
              ))}
            </div>

            {history.length > 1 && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0"
                >
                  <ArrowLeft size={14} /> Volver a la pregunta anterior
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          /* ── CONFIRMACIÓN FINAL Y ENVÍO RE-ACOPLADO ── */
          <motion.form
            key="resultado-final"
            onSubmit={handlePublishSubmit}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease }}
            className="flex flex-col gap-5"
          >
            <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-lg w-fit">
              <Sparkles size={14} className="text-brand-orange" />
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">
                Proyecto sugerido para tu negocio
              </span>
            </div>

            {/* Ficha Resumen del Proyecto Mapeado con Entregables en Lista */}
            <div className="bg-[#081828] border border-slate-700/50 rounded-xl p-5 flex flex-col gap-5 shadow-inner">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Título del proyecto propuesto:</p>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-brand-orange shrink-0" />
                  {selectedResult.titulo}
                </h4>
              </div>

              {/* Lista Desplegada de Entregables Estructurados */}
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">Lo que recibirás de los estudiantes:</p>
                <div className="flex flex-col gap-2.5">
                  {selectedResult.entregables?.map((entregable, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-slate-300 font-light leading-snug">
                      <CheckCircle2 size={14} className="text-brand-orange shrink-0 mt-0.5" />
                      <span>{entregable}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Describe detalladamente tu problema o requerimiento (Obligatorio)
              </label>
              <textarea
                required
                className="saas-textarea"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Por favor, cuéntanos en un par de líneas qué negocio tienes y qué necesitas resolver exactamente..."
              />
            </div>

            {apiError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2.5 text-red-400 text-sm">
                <AlertCircle size={16} className="shrink-0" />
                <p>{apiError}</p>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={handleBack}
                disabled={isLoading}
                style={{ flex: "0 0 auto", width: 50, height: 48, borderRadius: 10, border: "1.5px solid rgba(27, 111, 232, 0.25)", background: "#081828", display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => !isLoading && (e.currentTarget.style.borderColor = "#F97316", e.currentTarget.style.color = "white")}
                onMouseLeave={e => !isLoading && (e.currentTarget.style.borderColor = "rgba(27, 111, 232, 0.25)", e.currentTarget.style.color = "#94A3B8")}
                title="Cambiar respuestas"
              >
                <ArrowLeft size={18} />
              </button>

              <button
                type="submit"
                disabled={isLoading}
                style={{ flex: 1, height: 48, borderRadius: 10, border: "none", color: "white", background: "linear-gradient(135deg,#F97316,#DC4A00)", cursor: "pointer", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "transform 0.2s", opacity: isLoading ? 0.7 : 1 }}
                onMouseEnter={e => !isLoading && (e.currentTarget.style.transform = "translateY(-1px)")}
                onMouseLeave={e => !isLoading && (e.currentTarget.style.transform = "translateY(0)")}
              >
                {isLoading ? (
                  <><Loader2 size={16} className="animate-spin" /> Publicando requerimiento...</>
                ) : (
                  <>Publicar proyecto</>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}