import { MypeLayout } from "@shared/layouts/MypeLayout";
import { CrearProyectoForm } from "@/features/proyecto-create/CrearProyectoForm";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FONT = "'Angro Std', 'Outfit', sans-serif";

function ProjectTypeSelector({ onSelectAssistant, onSelectDirect }) {
  const [hoveredPath, setHoveredPath] = useState(null);
  const [flowKey, setFlowKey] = useState(0);
  const hoverTimerRef = useRef(null);
  const animationTimerRef = useRef(null);
const FONT = "'Angro Std', 'Outfit', sans-serif";
  const isAssistant = hoveredPath === "assistant";
  const isDirect = hoveredPath === "direct";
  const isAny = isAssistant || isDirect;

  const INPUT_DURATION = 1;
  const OUTPUT_DURATION = 1.5;

  const clearAllTimers = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
      animationTimerRef.current = null;
    }
  }, []);

  const handleHoverStart = useCallback((path) => {
    clearAllTimers();
    setHoveredPath(path);
    setFlowKey(prev => prev + 1);
    animationTimerRef.current = setTimeout(() => {}, (INPUT_DURATION + OUTPUT_DURATION) * 1000);
  }, [clearAllTimers]);

  const handleHoverEnd = useCallback(() => {
    clearAllTimers();
    hoverTimerRef.current = setTimeout(() => {
      setHoveredPath(null);
    }, 50);
  }, [clearAllTimers]);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  const particleInputVariants = {
    inactive: { strokeDashoffset: 0, opacity: 0 },
    active: {
      strokeDashoffset: -400,
      opacity: [0, 1, 1, 0],
      transition: { duration: INPUT_DURATION, ease: "easeInOut" },
    },
  };

  const particleOutputVariants = {
    inactive: { strokeDashoffset: 0, opacity: 0 },
    active: {
      strokeDashoffset: -400,
      opacity: [0, 1, 1, 0],
      transition: { duration: OUTPUT_DURATION, ease: "easeInOut", delay: INPUT_DURATION },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ maxWidth: "100%", margin: "0 auto", paddingBottom: 40 }}
    >
      {/* Header */}
      <div style={{ marginBottom: 40, maxWidth: "100%" }}>
        <h1
          style={{
            fontSize: "clamp(25px, 3vw, 30px)",
            fontWeight: 580,
            color: "#0F1F3D",
            margin: "0 0 12px",
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
          }}
        >
          Convierte una necesidad en una solución
        </h1>
        <p
          style={{
            fontSize: 17,
            color: "#64748B",
            lineHeight: 1.6,
            margin: 0,
            fontWeight: 400,
          }}
        >
          Define tu proyecto y nosotros te ayudamos a hacerlo realidad
        </p>
      </div>

      {/* Grid Principal - MÁS ANCHO */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(380px, 30%) 1fr",
          gap: 48,
          alignItems: "stretch",
        }}
      >
        {/* LADO IZQUIERDO */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, zIndex: 10, justifyContent: "center" }}>
          
          {/* Opción 1 - Asistente Inteligente */}
          <motion.div
            onClick={onSelectAssistant}
            onHoverStart={() => handleHoverStart("assistant")}
            onHoverEnd={handleHoverEnd}
            initial="rest"
            whileHover="hover"
            animate={isAssistant ? "hover" : "rest"}
            variants={{
              rest: { borderColor: "#E2E8F0", backgroundColor: "#FFFFFF", boxShadow: "0 2px 8px -2px rgba(0,0,0,0.02)" },
              hover: { borderColor: "#1B6FE8", backgroundColor: "#FFFFFF", boxShadow: "0 20px 40px -10px rgba(27,111,232,0.12)" },
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              borderRadius: 16,
              border: "1px solid",
              padding: 32,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between", 
              marginBottom: 16 
            }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: "#1B6FE8", letterSpacing: "0.08em" }}>
                Recomendado
              </span>
              <span style={{ 
                fontSize: 10, 
                fontWeight: 600, 
                color: "#1F2937",
                background: "#F3F4F6",
                padding: "4px 10px",
                borderRadius: 10,
                letterSpacing: "0.02em"
              }}>
                Nosotros te ayudamos
              </span>
            </div>
            
            <h3 style={{ margin: "0 0 12px", fontSize: 20, fontWeight: 600, color: "#0F1F3D", letterSpacing: "-0.01em" }}>
              Asistente Inteligente
            </h3>
            
            <div style={{ 
              height: "2px", 
              background: "linear-gradient(90deg, #1B6FE8, transparent)",
              marginBottom: 16,
              opacity: 1
            }} />
            
            <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.5, margin: 0 }}>
              Proceso guiado paso a paso. Traducimos tu problema en un requerimiento técnico estructurado.
            </p>
          </motion.div>

          {/* Opción 2 - Configuración Manual */}
          <motion.div
            onClick={onSelectDirect}
            onHoverStart={() => handleHoverStart("direct")}
            onHoverEnd={handleHoverEnd}
            initial="rest"
            whileHover="hover"
            animate={isDirect ? "hover" : "rest"}
            variants={{
              rest: { borderColor: "#E2E8F0", backgroundColor: "#FFFFFF", boxShadow: "0 2px 8px -2px rgba(0,0,0,0.02)" },
              hover: { borderColor: "#10B981", backgroundColor: "#FFFFFF", boxShadow: "0 20px 40px -10px rgba(16,185,129,0.12)" },
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              borderRadius: 16,
              border: "1px solid",
              padding: 32,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between", 
              marginBottom: 16 
            }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: "#10B981", letterSpacing: "0.08em" }}>
                Para Expertos
              </span>
              <span style={{ 
                fontSize: 10, 
                fontWeight: 600, 
                color: "#1F2937",
                background: "#F3F4F6",
                padding: "4px 10px",
                borderRadius: 10,
                letterSpacing: "0.02em"
              }}>
                Tú describes, nosotros conectamos
              </span>
            </div>
            
            <h3 style={{ margin: "0 0 12px", fontSize: 20, fontWeight: 600, color: "#0F1F3D", letterSpacing: "-0.01em" }}>
              Configuración Manual
            </h3>
            
            <div style={{ 
              height: "2px", 
              background: "linear-gradient(90deg, #10B981, transparent)",
              marginBottom: 16,
              opacity: 1
            }} />
            
            <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.5, margin: 0 }}>
              Acceso directo a las especificaciones. Define tecnologías, alcances y entregables con total libertad.
            </p>
          </motion.div>
        </div>

        {/* LADO DERECHO - MÁS ANCHO */}
        <div
          style={{
            position: "relative",
            background: "#FFFFFF",
            borderRadius: 24,
            border: "1px solid #E2E8F0",
            overflow: "hidden",
            minHeight: 420,
          }}
        >
          {/* NÚCLEO CENTRAL */}
          <motion.div
            key={`nucleo-${flowKey}`}
            animate={{
              scale: isAny ? 1.05 : 1,
             borderColor: isAssistant ? "#1B6FE8" : isDirect ? "#10B981" : "#E2E8F0",
              boxShadow: isAssistant ? "0 0 60px rgba(27,111,232,0.15)" : isDirect ? "0 0 60px rgba(16,185,129,0.15)" : "0 0 0 rgba(0,0,0,0)",
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: "24%",
              top: "35%",
              transform: "translate(-50%, -50%)",
              background: "#FFFFFF",
              borderRadius: "50%",
              border: "2px solid",
              width: 160,
              height: 160,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
            }}
          >
            <motion.div
              animate={{ 
                scale: isAny ? [1, 1.2, 1] : 1,
                opacity: isAny ? [0.5, 0, 0.5] : 0.2
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: "absolute", inset: -12, border: "1px solid", borderColor: isAssistant ? "#1B6FE8" : isDirect ? "#10B981" : "#E2E8F0", borderRadius: "50%" }}
            />
            
            <span style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
              El Origen
            </span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#0F1F3D", textAlign: "center", lineHeight: 1.2 }}>
              Necesidad<br />Empresarial
            </span>
          </motion.div>

          {/* SVG CON RUTAS */}
          <svg 
            key={`svg-${flowKey}`}
            viewBox="0 0 1000 560" 
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 10 }}
          >
            <defs>
              <filter id="glow-blue">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="glow-green">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <g stroke="#F1F5F9" strokeWidth="2" fill="none">
              <path d="M 0 180 C 160 180, 160 280, 320 280" />
              <path d="M 0 380 C 160 380, 160 280, 320 280" />
              <path d="M 320 280 C 520 280, 520 110, 780 110" />
              <path d="M 320 280 C 520 280, 520 210, 780 210" />
              <path d="M 320 280 C 520 280, 520 310, 780 310" />
              <path d="M 320 280 C 520 280, 520 420, 780 420" />
            </g>

            <motion.path
              d="M 0 180 C 160 180, 160 280, 320 280"
              stroke="#1B6FE8" strokeWidth="4" strokeLinecap="round" strokeDasharray="12 1000" filter="url(#glow-blue)" fill="none"
              variants={particleInputVariants} 
              initial="inactive" 
              animate={isAssistant ? "active" : "inactive"}
            />
            <motion.path
              d="M 0 380 C 160 380, 160 280, 320 280"
              stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeDasharray="12 1000" filter="url(#glow-green)" fill="none"
              variants={particleInputVariants} 
              initial="inactive" 
              animate={isDirect ? "active" : "inactive"}
            />

            <motion.path
              d="M 320 280 C 520 280, 520 110, 780 110"
              stroke="#1B6FE8" strokeWidth="4" strokeLinecap="round" strokeDasharray="12 1000" filter="url(#glow-blue)" fill="none"
              variants={particleOutputVariants} 
              initial="inactive" 
              animate={isAny ? "active" : "inactive"}
            />
            <motion.path
              d="M 320 280 C 520 280, 520 210, 780 210"
              stroke="#06B6D4" strokeWidth="4" strokeLinecap="round" strokeDasharray="12 1000" fill="none"
              variants={particleOutputVariants} 
              initial="inactive" 
              animate={isAny ? "active" : "inactive"}
            />
            <motion.path
              d="M 320 280 C 520 280, 520 310, 780 310"
              stroke="#8B5CF6" strokeWidth="4" strokeLinecap="round" strokeDasharray="12 1000" fill="none"
              variants={particleOutputVariants} 
              initial="inactive" 
              animate={isAny ? "active" : "inactive"}
            />
            <motion.path
              d="M 320 280 C 520 280, 520 420, 780 420"
              stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeDasharray="12 1000" filter="url(#glow-green)" fill="none"
              variants={particleOutputVariants} 
              initial="inactive" 
              animate={isAny ? "active" : "inactive"}
            />
          </svg>

          {/* NODOS DE RESULTADOS */}
          <div style={{ position: "absolute", left: "80%", top: 0, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "90px 0", zIndex: 20 }}>
            
            <motion.div animate={{ opacity: isAny ? 1 : 0.6 }} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0F1F3D" }}>Talento Universitario</span>
              <span style={{ fontSize: 11, color: "#64748B" }}>Match preciso con perfiles.</span>
            </motion.div>

            <motion.div animate={{ opacity: isAny ? 1 : 0.6 }} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0F1F3D" }}>Desarrollo Activo</span>
              <span style={{ fontSize: 11, color: "#64748B" }}>Ejecución estructurada.</span>
            </motion.div>

            <motion.div animate={{ opacity: isAny ? 1 : 0.6 }} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0F1F3D" }}>Innovación Aplicada</span>
              <span style={{ fontSize: 11, color: "#64748B" }}>Nuevas perspectivas.</span>
            </motion.div>

            <motion.div animate={{ opacity: isAny ? 1 : 0.6 }} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0F1F3D" }}>Impacto Empresarial</span>
              <span style={{ fontSize: 11, color: "#64748B" }}>Solución lista para tu negocio.</span>
            </motion.div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function CrearProyectoPage() {
  const [mode, setMode] = useState(null);

  const handleSelectAssistant = () => setMode("assistant");
  const handleSelectDirect = () => setMode("direct");
  const handleBack = () => setMode(null);

  const backButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    marginBottom: 24,
    padding: "8px 0",
    fontFamily: FONT,
    fontSize: 12,
    fontWeight: 700,
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    transition: "color 0.2s ease",
  };

  return (
    <MypeLayout titulo="Publicar nuevo proyecto" fullWidth>
      <div style={{ maxWidth: "100%", margin: "0 auto", padding: "20px 24px 40px" }}>
        <AnimatePresence mode="wait">
          {!mode && (
            <ProjectTypeSelector
              key="selector"
              onSelectAssistant={handleSelectAssistant}
              onSelectDirect={handleSelectDirect}
            />
          )}

          {mode === "assistant" && (
            <motion.div key="assistant" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} style={{ maxWidth: "100%", margin: "0 auto" }}>
              <button onClick={handleBack} style={backButtonStyle}>← Volver a la selección</button>
              <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 24, padding: "40px 48px", boxShadow: "0 24px 48px -12px rgba(0,0,0,0.05)" }}>
                {/* Cabecera del Proyecto - MODIFICADO: LÍNEA MÁS LARGA */}
                <div style={{ marginBottom: 32, paddingBottom: 20, borderBottom: "1px solid #E2E8F0" }}>
                  {/* Texto "Asistente Inteligente" con línea azul más larga */}
                  <div style={{ 
                    marginBottom: 16
                  }}>
                    <span style={{ 
                      fontSize: 12, 
                      fontWeight: 400, 
                      color: "#1B6FE8", 
                      letterSpacing: "0.08em", 
                    //  textTransform: "uppercase",
                      display: "block",
                      marginBottom: 6,
                      fontFamily: FONT 
                    }}>
                      Asistente Inteligente
                    </span>
                    {/* Línea separada - más larga */}
                    <div style={{ 
                      width: "1100px",           // ← Ajusta este valor para controlar el largo
                      height: "2px", 
                      background: "#1B6FE8"
                    }} />
                  </div>
                  <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 600, color: "#0F1F3D", letterSpacing: "-0.02em" ,fontFamily: FONT }}>
                    Estructuración guiada
                  </h2>
                  <p style={{ margin: 0, fontSize: 15, color: "#64748B", lineHeight: 1.5 ,fontFamily: FONT }}>
                    Describe tu necesidad. El sistema clasificará automáticamente los detalles técnicos para conectar con el perfil adecuado.
                  </p>
                </div>
                <CrearProyectoForm />
              </div>
            </motion.div>
          )}

          {mode === "direct" && (
            <motion.div key="direct" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} style={{ maxWidth: "100%", margin: "0 auto" }}>
              <button onClick={handleBack} style={backButtonStyle}>← Volver a la selección</button>
              <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 24, padding: "40px 48px", boxShadow: "0 24px 48px -12px rgba(0,0,0,0.05)" }}>
                <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid #F1F5F9" }}>
               {/* Texto "Configuración Manual" con línea verde larga */}
                <div style={{ marginBottom: 16 }}>
                  <span style={{ 
                    fontSize: 12, 
                    fontWeight: 400, 
                    color: "#10B981", 
                    letterSpacing: "0.08em", 
                    //textTransform: "uppercase",
                    display: "block",
                    marginBottom: 6,
                    fontFamily: FONT 
                  }}>
                    Configuración Manual
                  </span>
                  <div style={{ 
                    width: "1100px", 
                    height: "2px", 
                    background: "#10B981"
                  }} />
                </div>
                <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 600, color: "#0F1F3D", letterSpacing: "-0.02em" ,fontFamily: FONT }}>
                  Especificaciones del Proyecto
                </h2>
                <p style={{ margin: 0, fontSize: 15, color: "#64748B", lineHeight: 1.5 ,fontFamily: FONT }}>
                  Define los requerimientos exactos de tu solución. Cuanto más específico seas, mejor será el match con el talento.
                </p>
              </div>
                <CrearProyectoForm />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MypeLayout>
  );
}