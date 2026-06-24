import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCrearProyecto } from "./useCrearProyecto";
import { useInsumosProyecto } from "./useInsumosProyecto";
import { useTiposProyecto } from "@/features/admin/useTiposProyecto";

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

export function CrearProyectoManualForm() {
  const { crearProyecto, isLoading, error: apiError, rawError } = useCrearProyecto();
  const { tiposProyecto, isLoading: loadingTipos } = useTiposProyecto();
  const [errorPublicar, setErrorPublicar] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [comentario, setComentario] = useState("");
  const [cuposSeleccionados, setCuposSeleccionados] = useState(1);
  const [diasSeleccionados, setDiasSeleccionados] = useState(7);
  const [insumoFiles, setInsumoFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Solo mostrar tipos activos
  const proyectosDisponibles = (tiposProyecto || []).filter(t => t.activo);

  useEffect(() => {
    if (!rawError) return;
    const status = rawError?.response?.status;
    const message = rawError?.response?.data?.message || rawError?.message;
    if (status === 409) setErrorPublicar("Proyecto duplicado. Ya existe un esfuerzo similar activo.");
    else if (status === 400) setErrorPublicar(message || "Error de validación.");
    else if (status) setErrorPublicar(message || "Error en la transacción.");
  }, [rawError]);

  const tipoProyectoId = selectedProject?.id;
  const { data: insumos = [] } = useInsumosProyecto(tipoProyectoId);

  const insumosFaltantes = insumos.filter(i => i.obligatorio && !insumoFiles[i.id]);
  const canPublish = insumosFaltantes.length === 0;

  const handleSelectProject = (proyecto) => {
    setSelectedProject(proyecto);
    setCuposSeleccionados(proyecto.cuposMin || 1);
    setDiasSeleccionados(proyecto.diasSugerido || 7);
    setErrorPublicar(null);
    setComentario("");
    setInsumoFiles({});
  };

  const handleBack = () => {
    setSelectedProject(null);
    setErrorPublicar(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || !canPublish) return;
    setErrorPublicar(null);
    setIsSubmitting(true);

    const payload = {
      titulo: selectedProject.nombre,
      descripcion: comentario.trim() || `Requerimiento: ${selectedProject.nombre}.`,
      objetivo: `Ejecución enfocada en ${selectedProject.nombre}.`,
      entregablesSugeridos: "",
      areaSistemas: selectedProject.areaSistemas || AREA.OTRO,
      cupos: cuposSeleccionados,
      fechaInicio: null,
      diasEstimados: diasSeleccionados,
      fechaLimite: null,
      tipoProyectoId: selectedProject.id || null,
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

  if (loadingTipos) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#6B7280", fontFamily: FONT_MONO, fontSize: 12 }}>
        CARGANDO CATÁLOGO...
      </div>
    );
  }

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
        .b-card { border: 1px solid #E5E7EB; border-radius: 6px; padding: 14px; cursor: pointer; transition: all 0.15s; }
        .b-card:hover { border-color: #000000; background: #FAFAFA; }
        .b-card.selected { border-color: #000000; border-width: 2px; background: #FAFAFA; }
        .b-slider-row { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid #E5E7EB; }
        .b-slider-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .b-slider-top { display: flex; justify-content: space-between; align-items: center; }
        .b-slider-val { font-family: ${FONT_MONO}; font-size: 12px; font-weight: 600; background: #F3F4F6; padding: 2px 8px; border-radius: 4px; }
        .b-slider { -webkit-appearance: none; width: 100%; height: 2px; background: #E5E7EB; border-radius: 2px; outline: none; margin: 6px 0; }
        .b-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #000000; cursor: pointer; }
        .b-file-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background: #F9FAFB; border-radius: 4px; border: 1px solid #E5E7EB; margin-top: 8px; }
        .b-file-row.has-file { border-color: #000000; background: #FFFFFF; }
        .b-file-btn { border: 1px solid #D1D5DB; background: #FFFFFF; border-radius: 4px; font-family: ${FONT}; font-size: 11px; font-weight: 600; padding: 3px 8px; cursor: pointer; color: #374151; white-space: nowrap; }
        .b-textarea { width: 100%; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 6px; padding: 10px 12px; font-family: ${FONT}; font-size: 13px; color: #111827; outline: none; min-height: 80px; resize: vertical; line-height: 1.5; }
        .b-textarea:focus { border-color: #000000; }
        .b-button-primary { background: #000000; color: #FFFFFF; border: 1px solid #000000; width: 100%; height: 38px; border-radius: 6px; font-family: ${FONT}; font-weight: 500; font-size: 13px; cursor: pointer; margin-top: 12px; }
        .b-button-primary:disabled { opacity: 0.3; cursor: not-allowed; }
        .b-btn-text { background: transparent; border: none; font-family: ${FONT}; font-size: 10px; font-weight: 600; color: #6B7280; padding: 0; cursor: pointer; }
        .b-btn-text:hover { color: #111827; }
        .b-status-banner { padding: 8px 10px; background: #FEF2F2; border-left: 2px solid #EF4444; border-radius: 0 4px 4px 0; margin-top: 12px; font-size: 12px; color: #991B1B; font-weight: 500; }
      `}</style>

      <div className="b-tool-header">
        <div>
          <span className="b-text-xs">Flujo Maestro Operativo</span>
          <div className="b-text-lg" style={{ marginTop: 2 }}>
            {selectedProject ? "Gestión de Requerimiento TI" : "Catálogo de Proyectos"}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedProject && (
          <motion.div key="catalogo" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2, ease }}>
            <div style={{ marginBottom: 16 }}>
              <h3 className="b-text-xl" style={{ marginBottom: 6 }}>Seleccione el tipo de proyecto</h3>
              <p className="b-text-mute">Catálogo administrado por el sistema.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 10 }}>
              {proyectosDisponibles.map((proyecto) => (
                <div key={proyecto.id} className="b-card" onClick={() => handleSelectProject(proyecto)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <span className="b-text-xs" style={{ marginBottom: 0 }}>{proyecto.rama || proyecto.areaSistemas}</span>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 9, color: "#9CA3AF" }}>{proyecto.codigo}</span>
                  </div>
                  <div className="b-text-base" style={{ fontWeight: 600, marginBottom: 6 }}>{proyecto.nombre}</div>
                  <div style={{ display: "flex", gap: 12, fontSize: 10, color: "#6B7280", fontFamily: FONT_MONO }}>
                    <span>{proyecto.cuposMin}-{proyecto.cuposMax} cupos</span>
                    <span>{proyecto.diasSugerido}d sugeridos</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {selectedProject && (
          <motion.form key="formulario" onSubmit={handleSubmit} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.25, ease }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr 320px", gap: 24, alignItems: "start" }}>
            
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div>
                <div className="b-text-xs">Directriz Establecida</div>
                <h4 className="b-text-xl" style={{ marginTop: 2, marginBottom: 16 }}>{selectedProject.nombre}</h4>
                {selectedProject.descripcionMype && (
                  <p className="b-text-mute" style={{ marginBottom: 16 }}>{selectedProject.descripcionMype}</p>
                )}
                <div style={{ display: "flex", gap: 12, fontSize: 10, color: "#6B7280", fontFamily: FONT_MONO, marginTop: 16 }}>
                  <span>Código: {selectedProject.codigo}</span>
                  <span>Rama: {selectedProject.rama}</span>
                </div>
              </div>
              <div style={{ marginTop: "auto", paddingTop: 20 }}>
                <button type="button" className="b-btn-text" onClick={handleBack}>← VOLVER</button>
              </div>
            </div>

            <div className="b-border-box" style={{ padding: 14 }}>
              <div className="b-text-xs" style={{ marginBottom: 12 }}>Controles Sistémicos</div>
              <div className="b-slider-row">
                <div className="b-slider-top">
                  <span className="b-text-base" style={{ fontSize: 12 }}>Estudiantes</span>
                  <span className="b-slider-val">{cuposSeleccionados}</span>
                </div>
                {selectedProject.cuposMin && selectedProject.cuposMax && selectedProject.cuposMax > selectedProject.cuposMin ? (
                  <input type="range" className="b-slider" min={selectedProject.cuposMin} max={selectedProject.cuposMax} value={cuposSeleccionados} onChange={(e) => setCuposSeleccionados(Number(e.target.value))} />
                ) : (
                  <div className="b-text-mute" style={{ fontSize: 10 }}>Régimen operativo base fijo.</div>
                )}
              </div>
              <div className="b-slider-row">
                <div className="b-slider-top">
                  <span className="b-text-base" style={{ fontSize: 12 }}>Tiempo Estimado</span>
                  <span className="b-slider-val">{diasSeleccionados}d</span>
                </div>
                <input type="range" className="b-slider" min={selectedProject.diasMin || 7} max={Math.max(selectedProject.diasSugerido || 14, selectedProject.diasMin || 7)} value={diasSeleccionados} onChange={(e) => setDiasSeleccionados(Number(e.target.value))} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#9CA3AF", fontFamily: FONT_MONO }}>
                  <span>MIN:{selectedProject.diasMin || 7}</span>
                  <span>MAX:{Math.max(selectedProject.diasSugerido || 14, selectedProject.diasMin || 7)}</span>
                </div>
              </div>
              {insumos.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div className="b-text-xs">Archivos Matriz</div>
                  {insumos.slice(0, 3).map((insumo) => {
                    const fileInfo = insumoFiles[insumo.id];
                    return (
                      <div key={insumo.id} className={`b-file-row ${fileInfo ? "has-file" : ""}`}>
                        <div style={{ overflow: "hidden", flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 500, color: fileInfo ? "#111827" : "#4B5563" }}>{insumo.nombre}</div>
                          <div style={{ fontSize: 9, fontFamily: FONT_MONO, color: "#9CA3AF" }}>{insumo.obligatorio ? "OB" : "OP"} • {fileInfo ? "OK" : "PEND"}</div>
                        </div>
                        <label className="b-file-btn">
                          {fileInfo ? "EDIT" : "SUBIR"}
                          <input type="file" style={{ display: "none" }} onChange={(e) => { const f = e.target.files[0]; if (f) setInsumoFiles(prev => ({ ...prev, [insumo.id]: f })); }} />
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="b-text-xs" style={{ display: "block" }}>Especificación [Obligatoria]</label>
              <textarea required value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Instrucciones detalladas del alcance comercial..." className="b-textarea" />
              {insumosFaltantes.length > 0 && <div className="b-status-banner">Requiere adjuntar documentación obligatoria (OB).</div>}
              {errorPublicar && <div className="b-status-banner">{errorPublicar}</div>}
              {apiError && !errorPublicar && <div className="b-status-banner">{apiError}</div>}
              <button type="submit" disabled={isLoading || isSubmitting || !canPublish} className="b-button-primary">
                {isLoading || isSubmitting ? "PROCESANDO..." : "PUBLICAR PROYECTO"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}