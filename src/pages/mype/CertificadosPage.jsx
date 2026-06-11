import { useState, useRef, useEffect, useCallback } from "react";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import { useAuthStore } from "@/store/authStore";
import {
  useCertificadosEmitidos,
  useEmitirCertificado,
  useEliminarCertificado,
} from "@/features/certificados/useCertificadosMype";
import { useMisProyectos } from "@/features/proyecto-list-mype/useMisProyectos";
import { useMiPerfilMype } from "@/features/mype-perfil/useMypePerfil";
import { httpClient } from "@/shared/api/httpClient";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Download,
  ShieldCheck,
  Send,
  Users,
  Trash2,
  Check,
  ArrowRight,
  Shield,
  FileCheck,
  Building,
  BriefcaseBusiness,
  Award,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  Maximize,
  Plus
} from "lucide-react";

const FONT = "'Angro Std', 'Outfit', sans-serif";
const FONT_SERIF = "Georgia, 'Times New Roman', serif";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

// ── Hook para enviar certificado ───────────────────────────────
function useEnviarCertificado() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState({});
  const [errorMap, setErrorMap] = useState({});

  const enviar = async (certificadoId) => {
    setLoading((p) => ({ ...p, [certificadoId]: true }));
    setErrorMap((p) => ({ ...p, [certificadoId]: null }));
    try {
      await httpClient.post(`/certificados/${certificadoId}/enviar`);
      queryClient.invalidateQueries({ queryKey: ["certificados-emitidos"] });
    } catch (e) {
      setErrorMap((p) => ({
        ...p,
        [certificadoId]: "Error al formalizar despacho. Reintente proceso.",
      }));
    } finally {
      setLoading((p) => ({ ...p, [certificadoId]: false }));
    }
  };

  return { enviar, loading, errorMap };
}

/* ═══════════════════════════════════════════════
   BANNER EJECUTIVO: CENTRO DE CERTIFICACIÓN
═══════════════════════════════════════════════ */
function CentroCertificacionHero({ certificadosEmitidos, estudiantesReconocidos, operacionesCompletadas }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 1.5 + 0.5,
      });
    }

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x;
          const dy = particles[j].y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    const ro = new ResizeObserver(() => {
      if (!canvas) return;
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "relative",
        background: "linear-gradient(135deg, #0A1628 0%, #0F2A4A 55%, #152642 100%)",
        borderRadius: "20px",
        padding: "48px 56px",
        overflow: "hidden",
        boxShadow: "0 24px 48px -12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        marginBottom: 24,
        border: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "stretch",
        flexWrap: "wrap",
        gap: 40,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      />
      <div
        style={{ position: "absolute", top: -120, right: -60, width: 450, height: 450, background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }}
      />

      <div style={{ position: "relative", zIndex: 10, flex: "1 1 45%", minWidth: 320 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: "6px", padding: "6px 14px", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#38BDF8", marginBottom: 20 }}>
          Emisión Documentaria
        </div>
        <h1 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3.5vw, 32px)", fontWeight: 500, color: "#FFFFFF", margin: "0 0 14px", letterSpacing: "-0.02em" }}>
          Centro de Certificación y Conformidad
        </h1>
        <p style={{ fontFamily: FONT, fontSize: 14, color: "#94A3B8", margin: 0, lineHeight: 1.7, fontWeight: 400, maxWidth: "90%" }}>
          Administra y emite certificados digitales para tus proyectos finalizados. Reconoce el trabajo de los estudiantes que completaron exitosamente sus entregables.        </p>
      </div>

      <div style={{ position: "relative", zIndex: 10, flex: "1 1 45%", minWidth: 320, display: "flex", flexDirection: "column", gap: 16, justifyContent: "center" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 16 }}>
          {[
            { v: certificadosEmitidos.toString().padStart(2, "0"), l: "Certificados Emitidos", color: "#10B981" },
            { v: estudiantesReconocidos.toString().padStart(2, "0"), l: "Estudiantes Certificados", color: "#38BDF8" }
          ].map((stat, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "24px 20px", backdropFilter: "blur(10px)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ fontSize: 36, fontWeight: 300, color: "#FFFFFF", fontFamily: FONT, lineHeight: 1, letterSpacing: "-0.03em" }}>
                {stat.v}
              </div>
              <div style={{ marginTop: 12, fontSize: 11, color: stat.color, display: "flex", alignItems: "center", gap: 6, fontFamily: FONT, fontWeight: 600, letterSpacing: "0.02em" }}>
                <span style={{ width: 6, height: 6, background: stat.color, borderRadius: "50%", boxShadow: `0 0 10px ${stat.color}` }} /> {stat.l}
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ background: "linear-gradient(to right, rgba(255,255,255,0.02), rgba(245, 158, 11, 0.05))", border: "1px solid rgba(245, 158, 11, 0.15)", borderRadius: 12, padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 12, color: "#FFFFFF", fontWeight: 600, fontFamily: FONT, marginBottom: 5, letterSpacing: "0.02em" }}>Resumen General</div>
            <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: FONT }}>{operacionesCompletadas === 0 ? "Sin flujos resolutivos integrados actualmente." : `${operacionesCompletadas} operaciones estratégicas registradas integralmente.`}</div>
          </div>
          {operacionesCompletadas > 0 && (
             <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#F59E0B", fontSize: 14 }}>
               <FileCheck size={18} strokeWidth={1.5} />
             </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Plantilla Visual Premium Real Fija (100% de la experiencia) ──
function PlantillaCertificado({ datos, isForPreviewCanvas = false }) {
  const hoy = new Date().toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" });
  const codigoCert = datos.codigo || `CTX-V${new Date().getFullYear()}-${String(datos.proyectoId || "1").padStart(6, "0")}`;

  return (
    <div
      id="certificado-preview"
      style={{
        width: "297mm", 
        height: "210mm",
        background: "#FFFFFF",
        position: "relative",
        boxSizing: "border-box",
        fontFamily: FONT_SERIF,
        color: "#1E293B",
        // En vista "canvas interactivo" aportamos sombras profundas, en exportación es limpio
        boxShadow: isForPreviewCanvas ? "0 30px 60px rgba(0,0,0,0.1), 0 5px 25px rgba(0,0,0,0.08)" : "none",
        overflow: "hidden",
        border: "none",
        // Origen desde el eje superior izquierdo previene recálculos gráficos visuales
        transformOrigin: "top left", 
      }}
    >
      {/* LOGO EN ESQUINA SUPERIOR DERECHA */}
      <div style={{
        position: "absolute",
        top: "20mm",
        right: "20mm",
        zIndex: 10,
        background: "transparent"
      }}>
        <img 
          src="/linkuy_logo_Blanco.svg" 
          alt="Logo Linkuy" 
          style={{
            width: "35mm",         /* ← Ancho fijo en mm */
            height: "auto",        /* ← Altura automática para mantener proporción */
            objectFit: "contain"
          }}
        />
      </div>
      <div style={{ 
        position: "absolute", top: "15mm", bottom: "15mm", 
        left: "15mm", right: "15mm", 
        border: "1.5px solid #0F172A", padding: "3px" 
      }}>
        <div style={{ 
          border: "0.5px solid #475569", height: "100%", width: "100%", position: "relative", 
          boxSizing: "border-box", display: "flex", flexDirection: "column", padding: "26mm 35mm",
          background: "linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(248,250,252,0.8) 100%)"
        }}>
          
          {/* Filigree corner simulation pure css */}
          {[
            { top: -2, left: -2, borderBottom: "1.5px solid #0F172A", borderRight: "1.5px solid #0F172A" },
            { top: -2, right: -2, borderBottom: "1.5px solid #0F172A", borderLeft: "1.5px solid #0F172A" },
            { bottom: -2, left: -2, borderTop: "1.5px solid #0F172A", borderRight: "1.5px solid #0F172A" },
            { bottom: -2, right: -2, borderTop: "1.5px solid #0F172A", borderLeft: "1.5px solid #0F172A" }
          ].map((style, idx) => (
             <div key={idx} style={{ position: "absolute", width: "12px", height: "12px", background: "#FFFFFF", ...style }} />
          ))}

          <div style={{ textAlign: "center", marginBottom: 15 }}>
             <h4 style={{ 
               margin: 0, fontSize: 13, fontWeight: 400, letterSpacing: "0.4em", textTransform: "uppercase", color: "#64748B", 
               fontFamily: "system-ui, sans-serif" 
             }}>Certificado Oficial</h4>
             <div style={{ width: 45, height: "1.5px", background: "#D4AF37", margin: "14px auto" }} />
             <h1 style={{ margin: 0, fontSize: 46, fontWeight: 400, color: "#0F172A", lineHeight: 1.1 }}>
               Constancia de Participación
             </h1>
          </div>

          <div style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
             <p style={{ margin: 0, fontSize: 18, fontStyle: "italic", color: "#475569" }}>Por conducto de este documento se confiere validación expresa a:</p>
             <h2 style={{ 
                margin: "18px 0", fontSize: 38, fontWeight: 400, 
                borderBottom: "1.5px dashed #CBD5E1", paddingBottom: "4px", display: "inline-block",
                letterSpacing: "-0.01em"
             }}>
                {datos.estudianteNombre || "Individuo Calificado / Talento Estratégico"}
             </h2>
             <p style={{ margin: "0", fontSize: 16, color: "#475569", lineHeight: 1.8, maxWidth: "90%" }}>
                Por su participación activa, cumplimiento de hitos y calidad en los entregables, demostrando habilidades técnicas y trabajo en equipo durante el desarrollo del proyecto.             </p>
             <div style={{ background: "#F1F5F9", border: "1px solid #E2E8F0", padding: "18px 24px", margin: "22px 0", borderRadius: "2px", width: "100%", maxWidth: "80%" }}>
               <h3 style={{ margin: 0, fontSize: 19, fontWeight: 600, fontFamily: "system-ui, sans-serif", letterSpacing: "-0.01em", color: "#1E293B" }}>
                 {datos.proyectoTitulo || "[Referencia Oficial de Operación Acreditada]"}
               </h3>
               
             </div>
          </div>

          <div style={{ 
             display: "flex", justifyContent: "space-between", alignItems: "flex-end", 
             marginTop: "auto", borderTop: "1.5px solid rgba(15,23,42,0.1)", paddingTop: 15, 
             fontFamily: "system-ui, sans-serif" 
          }}>
             <div style={{ flex: 1, textAlign: "left", marginTop: 20 }}>  {/* ← Agrega esta línea */}
              <p style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 6px" }}>ID de Validación Matriz</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#1E293B", margin: 0 }}>{codigoCert}</p>
            </div>

             <div style={{ flex: 1.5, textAlign: "center", paddingBottom: "2px" }}>
                {datos.firmaUrl ? (
                   <img src={datos.firmaUrl} alt="Suscripción" style={{ height: 60, objectFit: "contain", margin: "0 auto" }} />
                ) : (
                   <div style={{ height: 60, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ border: "1px dashed #CBD5E1", padding: "5px 15px", color: "#94A3B8", fontSize: 11 }}>Firma Digital Pendiente</span>
                   </div>
                )}
                <div style={{ width: "65%", height: "1px", background: "#0F172A", margin: "10px auto" }} />
                <p style={{ fontSize: 15, fontWeight: 600, color: "#1E293B", margin: "0 0 4px" }}>
                  {datos.gerente || "Representante Legal"}
                </p>
                <p style={{ fontSize: 12, color: "#64748B", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {datos.mypeNombre || "CORPORACIÓN TITULAR"}
                </p>
             </div>

             <div style={{ flex: 1, textAlign: "right" }}>
                <p style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 6px" }}>Acta Fechada en Perú</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#1E293B", margin: 0 }}>{hoy}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Overlay Formal de Emisión con Controles Avanzados ──────────────────────────────────
function FormalizacionDocumentalOverlay({
  proyectosCompletados,
  mypeNombre,
  gerenteNombre,
  onClose,
}) {
  const [datosParaPDF, setDatosParaPDF] = useState(null);
  const { emitir, isLoading, isSuccess, error } = useEmitirCertificado();
  const [exportando, setExportando] = useState(false);
  const [estudiantesConfirmados, setEstudiantesConfirmados] = useState([]);
  const [cargandoEstudiantes, setCargandoEstudiantes] = useState(false);
  const [firmaTemporal, setFirmaTemporal] = useState(null);
  const [mostrarEditorFirma, setMostrarEditorFirma] = useState(false);
  
  // Workspace and Panning controls
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(0.65); // Starting fallback zoom
  const PADDING = 60; // Internal buffer area in pixels for the preview

  // Dynamic Scale Calculator (Fits naturally inside current screen/wrapper layout)
  const adjustScaleToFit = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    // La dimensión de nuestra hoja virtual A4 apaisado es fija ~1122x794 px (~297mm x ~210mm @ 96dpi)
    const exactPaperPxWidth = 1122.5; 
    const exactPaperPxHeight = 793.7;

    const scaleWidth = (clientWidth - PADDING * 2) / exactPaperPxWidth;
    const scaleHeight = (clientHeight - PADDING * 2) / exactPaperPxHeight;
    // We adjust down to fit seamlessly whichever constraints are tighter
    const appropriateFit = Math.min(scaleWidth, scaleHeight, 1.2); 
    setZoom(appropriateFit);
  }, []);

  // When layout is painted and DOM fully ref'd, force 1 immediate correct scale matching viewer
  useEffect(() => {
    const handleResize = () => adjustScaleToFit();
    
    adjustScaleToFit();
    window.addEventListener("resize", handleResize);
    
    // Quick timeout needed slightly as Framer-Motion overlay plays entry animation rendering dims late
    const animateTimeoutId = setTimeout(adjustScaleToFit, 150); 
    
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(animateTimeoutId);
    };
  }, [adjustScaleToFit]);

  const [form, setForm] = useState({
    proyectoId: "",
    proyectoTitulo: "",
    estudiantesSeleccionados: [],
    gerente: gerenteNombre || "",
    firmaUrl: "",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleProyectoChange = async (e) => {
    const valId = e.target.value;
    const p = proyectosCompletados.find((p) => String(p.id) === String(valId));
    if (p) {
      set("proyectoId", p.id);
      set("proyectoTitulo", p.titulo);
      set("estudiantesSeleccionados", []);
      setCargandoEstudiantes(true);
      try {
        const res = await httpClient.get(`/proyectos/${p.id}/postulaciones/aceptadas`);
        const confirmados = (res.data || []).filter(
          (post) => post.estado === "CONFIRMADO" || post.estado === "ACEPTADO",
        );
        setEstudiantesConfirmados(confirmados);
        if(confirmados.length === 1) {
          setForm(prev => ({...prev, estudiantesSeleccionados: [confirmados[0].estudianteId]}));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCargandoEstudiantes(false);
      }
    } else {
      set("proyectoId", "");
      set("proyectoTitulo", "");
      setEstudiantesConfirmados([]);
    }
  };

  const toggleEstudiante = (id) =>
    setForm((prev) => ({
      ...prev,
      estudiantesSeleccionados: prev.estudiantesSeleccionados.includes(id)
        ? prev.estudiantesSeleccionados.filter((x) => x !== id)
        : [...prev.estudiantesSeleccionados, id],
    }));

  const handleFirma = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    setFirmaTemporal(ev.target.result);
    setMostrarEditorFirma(true);
  };
  reader.readAsDataURL(file);
  };
  const confirmarFirma = (imagenProcesada) => {
    set("firmaUrl", imagenProcesada);
    setMostrarEditorFirma(false);
    setFirmaTemporal(null);
  };

  const handleExportarPDF = async () => {
    setExportando(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const contenedor = document.createElement("div");
      
      // Creamos forzadamente en una celda externa de render oculta una página exacta de proporciones sin afectarse
      contenedor.style.cssText = "position:fixed;left:-9999px;top:0;width:297mm;height:210mm;background:#fff;z-index:-1;";
      document.body.appendChild(contenedor);
      const { createRoot } = await import("react-dom/client");
      const root = createRoot(contenedor);

      const primerNombre = estudiantesConfirmados.find(e => e.estudianteId === form.estudiantesSeleccionados[0])?.estudianteNombre;
      const datos = datosParaPDF || { ...form, mypeNombre, estudianteNombre: primerNombre };
      
      root.render(<PlantillaCertificado datos={datos} />);

      await new Promise((r) => setTimeout(r, 800));

      const el = contenedor.querySelector("#certificado-preview");
      if (el) {
        await html2pdf()
          .set({
            margin: 0,
            filename: `documento_oficial_${datos.estudianteNombre || "referencia"}.pdf`,
            image: { type: "jpeg", quality: 1 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
          })
          .from(el)
          .save();
      }
      root.unmount();
      document.body.removeChild(contenedor);
    } catch (e) {
      console.error("Fallo estructural Export:", e);
    } finally {
      setExportando(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emitir({
      proyectoId: Number(form.proyectoId),
      estudiantesIds: form.estudiantesSeleccionados,
      tituloCertificado: `Registro Formal — ${form.proyectoTitulo}`,
      firmaBase64: form.firmaUrl || null,
      gerenteNombre: form.gerente || null,
    });
  };

  const currentDisplayNombre = estudiantesConfirmados.find(e => e.estudianteId === form.estudiantesSeleccionados?.[0])?.estudianteNombre || null;
  const isFormCompleto = form.proyectoId && form.estudiantesSeleccionados.length > 0 && form.gerente && form.firmaUrl;

  const formSectionLabelStyle = { fontFamily: FONT, fontSize: 10, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, display: "block" };
  const genericInputStyle = { width: "100%", padding: "10px 14px", borderRadius: 8, fontFamily: FONT, fontSize: 13, border: "1px solid #CBD5E1", outline: "none", background: "#FFFFFF", color: "#1E293B", transition: "border 0.2s" };

  // Helper variables for centering calculations cleanly 
  const exactWidthToExpect = 1122.5 * zoom; 
  const exactHeightToExpect = 793.7 * zoom;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(10,22,40,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }} style={{
          background: "#FFFFFF", borderRadius: 16, width: "100%", maxWidth: 1500, height: "92vh",
          display: "flex", overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.5)"
      }}>
        
        {/* PANEL LATERAL FORMULARIO - ASISTENTE ESTACIONARIO */}
        <div style={{ width: 440, minWidth: 440, background: "#FFFFFF", borderRight: "1px solid #E2E8F0", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <div>
               <h3 style={{ margin: 0, fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "#0F172A", letterSpacing: "-0.01em" }}>Emitir Certificado</h3>
               <p style={{ margin: "2px 0 0", fontFamily: FONT, fontSize: 11, color: "#64748B" }}>Completa los siguientes datos</p>
             </div>
             <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><X size={20}/></button>
          </div>
          
          <form style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 24 }}>
             <div>
                <label style={formSectionLabelStyle}>1. Proyecto Completado</label>
                <div style={{ position: "relative" }}>
                   <select required value={form.proyectoId} onChange={handleProyectoChange} style={{ ...genericInputStyle, paddingRight: 30, appearance: "none", cursor: "pointer" }}>
                     <option value="" disabled>Seleccionar mandato u operación resoluta...</option>
                     {proyectosCompletados.map(p => <option key={p.id} value={p.id}>{p.titulo}</option>)}
                   </select>
                   <ChevronDown size={14} color="#64748B" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                </div>
             </div>

             <div style={{ opacity: form.proyectoId ? 1 : 0.4, pointerEvents: form.proyectoId ? "auto" : "none", transition: "all 0.2s" }}>
                <label style={formSectionLabelStyle}>2. Estudiantes del Proyecto</label>
                {cargandoEstudiantes ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#64748B" }}><Loader2 size={14} className="animate-spin" /> Auditando roles formales del contrato...</div>
                ) : estudiantesConfirmados.length === 0 ? (
                  <div style={{ fontSize: 12, color: "#F59E0B" }}>No hay estudiantes disponibles para este proyecto.</div>
                ) : (
                  <div style={{ border: "1px solid #E2E8F0", borderRadius: 8, overflow: "hidden", background: "#F8FAFC" }}>
                     {estudiantesConfirmados.map((est) => (
                       <label key={est.estudianteId} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: "1px solid #E2E8F0", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                         <div style={{ width: 14, height: 14, borderRadius: 3, border: form.estudiantesSeleccionados.includes(est.estudianteId) ? "none" : "1px solid #94A3B8", background: form.estudiantesSeleccionados.includes(est.estudianteId) ? "#0F172A" : "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                           {form.estudiantesSeleccionados.includes(est.estudianteId) && <Check size={10} color="#FFF"/>}
                         </div>
                         <input type="checkbox" checked={form.estudiantesSeleccionados.includes(est.estudianteId)} onChange={() => toggleEstudiante(est.estudianteId)} style={{ display: "none" }} />
                         <span style={{ fontSize: 13, color: "#1E293B", fontFamily: FONT }}>{est.estudianteNombre}</span>
                       </label>
                     ))}
                  </div>
                )}
             </div>

             <div style={{ opacity: form.proyectoId ? 1 : 0.4, pointerEvents: form.proyectoId ? "auto" : "none", transition: "all 0.2s" }}>
                <label style={formSectionLabelStyle}>3. Datos del Representante Legal</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input placeholder="Nombre de quien refrenda operativamente..." required value={form.gerente} onChange={(e) => set("gerente", e.target.value)} style={genericInputStyle} />
                  
                  
                  <div onClick={() => document.getElementById("firma-file").click()} style={{ border: "1px dashed #CBD5E1", borderRadius: 8, padding: 16, background: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, transition: "border 0.2s" }} onMouseEnter={e => e.currentTarget.style.borderColor="#0F172A"} onMouseLeave={e => e.currentTarget.style.borderColor="#CBD5E1"}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: form.firmaUrl ? "#0F172A" : "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: form.firmaUrl ? "#FFF" : "#94A3B8" }}>
                      {form.firmaUrl ? <CheckCircle2 size={16} /> : <FileCheck size={16} />}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontFamily: FONT, fontSize: 12, fontWeight: 500, color: "#0F172A" }}>Subir Firma Digital</p>
                      <p style={{ margin: "2px 0 0", fontFamily: FONT, fontSize: 10, color: "#64748B" }}>Autoremoción computarizada del área visual del fondo aplicada automáticamente.</p>
                    </div>
                    <input id="firma-file" type="file" accept="image/*" style={{ display: "none" }} onChange={handleFirma} />
                  </div>
                </div>
             </div>

             {error && <div style={{ fontSize: 12, color: "#DC2626", background: "#FEF2F2", padding: "8px 12px", borderRadius: 6, display: "flex", gap: 8, alignItems: "center" }}><AlertTriangle size={14} /> El cierre transaccional falló. Retomar intento operativor.</div>}
          </form>
          {/* Modal Editor de Firma */}
          {mostrarEditorFirma && firmaTemporal && (
            <EditorFirmaModal
              imagenSrc={firmaTemporal}
              onConfirm={confirmarFirma}
              onCancel={() => {
                setMostrarEditorFirma(false);
                setFirmaTemporal(null);
              }}
            />
          )}
          {/* AREA BUTTON ABSOLUTE BOTTOM IN PANEL */}
          <div style={{ padding: "20px 24px", borderTop: "1px solid #E2E8F0", background: "#FFFFFF" }}>
            {isSuccess ? (
               <div style={{ textAlign: "center" }}>
                 <p style={{ margin: "0 0 10px", fontSize: 12, color: "#16A34A", fontWeight: 600, display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}><ShieldCheck size={14}/> Certificado emitido con éxito</p>
                 <button onClick={onClose} style={{ width: "100%", padding: 16, background: "#0F172A", color: "#FFF", borderRadius: 8, fontFamily: FONT, fontSize: 12, letterSpacing:"0.15em", textTransform: "uppercase", fontWeight: 700, border: "none", cursor: "pointer" }}>Abandonar Sistema</button>
               </div>
            ) : (
               <button 
                 type="button" 
                 onClick={handleSubmit} 
                 disabled={isLoading || !isFormCompleto} 
                 style={{ 
                   width: "100%", padding: "16px 0", borderRadius: 8, fontFamily: FONT, fontSize: 12, 
                   fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", 
                   border: "none", outline: "none", display: "flex", alignItems: "center", justifyContent: "center",
                   cursor: isFormCompleto && !isLoading ? "pointer" : "not-allowed",
                   background: isFormCompleto ? "#0F172A" : "#F1F5F9", 
                   color: isFormCompleto ? "#FFFFFF" : "#94A3B8", 
                   boxShadow: isFormCompleto ? "0 8px 16px -4px rgba(15,23,42,0.3)" : "none",
                   transition: "all 0.3s"
                 }}>
                   {isLoading ? "Procesando certificado..." : "Emitir Certificado"}
               </button>
            )}
          </div>
        </div>

        {/* WORKSPACE ÁREA - HOJA VISUAL PRINCIPAL DINÁMICA DE PRECISIÓN ABSOLUTA */}
        <div style={{ 
            flex: 1, 
            background: "#E2E8F0",
            backgroundImage: "linear-gradient(rgba(148, 163, 184, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.15) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            position: "relative", 
            display: "flex", 
            flexDirection: "column", 
            overflow: "hidden" 
        }}>
          
          {/* Action / Tools Header (Workspace controls) */}
          <div style={{ 
              position: "absolute", top: 16, right: 24, zIndex: 15, display: "flex", gap: 12, alignItems: "center"
          }}>
            {/* Download Prototype Control */}
             <button onClick={handleExportarPDF} disabled={exportando || !form.proyectoId} style={{ background: "#FFFFFF", border: "1px solid #CBD5E1", padding: "8px 16px", borderRadius: 6, display: "flex", alignItems: "center", gap: 8, cursor: form.proyectoId ? "pointer" : "not-allowed", fontSize: 11, fontWeight: 600, color: form.proyectoId ? "#0F172A" : "#94A3B8", fontFamily: FONT, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
               {exportando ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} 
               DESCARGAR MODELO PRELIMINAR (PDF)
            </button>

            <div style={{ width: 1, height: 24, background: "#CBD5E1", margin: "0 4px" }} />

            {/* Scale Management Interface Tooling */}
            <div style={{ background: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: 6, display: "flex", alignItems: "stretch", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", overflow: "hidden" }}>
              <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.3))} style={{ background: "none", border: "none", padding: "8px 10px", cursor: "pointer", color: "#64748B", display: "flex" }}>
                <ZoomOut size={16}/>
              </button>
              <div style={{ borderLeft: "1px solid #F1F5F9", borderRight: "1px solid #F1F5F9", padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, fontFamily: "monospace", color: "#0F172A", background: "#F8FAFC" }}>
                {Math.round(zoom * 100)}%
              </div>
              <button onClick={() => setZoom(z => Math.min(z + 0.1, 1.8))} style={{ background: "none", border: "none", padding: "8px 10px", cursor: "pointer", color: "#64748B", display: "flex" }}>
                <ZoomIn size={16}/>
              </button>
              <button title="Adaptar Lupa al Límite" onClick={adjustScaleToFit} style={{ background: "none", border: "none", padding: "8px 10px", cursor: "pointer", borderLeft: "1px solid #F1F5F9", color: "#0F172A", display: "flex" }}>
                <Maximize size={16}/>
              </button>
            </div>
          </div>
          
          <div style={{ position: "absolute", bottom: 20, right: 24, zIndex: 10, color: "#64748B", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.1em", fontWeight: 600 }}>
             DOM_PROPS: W: 297mm · A4 LNDSCP_NATIVE · S_{Math.round(zoom * 100)}
          </div>

          {/* Canvas Scrollable PanArea para el documento real de medidas milimetradas A4 completas */}
          <div ref={containerRef} style={{ flex: 1, width: "100%", height: "100%", overflow: "auto", position: "relative", cursor: "grab" }}>
             
             {/* Center Mechanism using margin autos dynamically responding exactly inside panning view based on bounding logic relative.  */}
             <div style={{
                position: "absolute",
                // This formula guarantees exact visual padding or centers perfectly within boundaries if boundaries permit bigger
                width: `${exactWidthToExpect}px`, 
                height: `${exactHeightToExpect}px`,
                // Keep it absolutely spaced if it's large and spans boundaries via negative origins tracking
                left: exactWidthToExpect < (containerRef.current?.clientWidth || 0) ? `calc(50% - ${exactWidthToExpect / 2}px)` : `${PADDING}px`,
                top: exactHeightToExpect < (containerRef.current?.clientHeight || 0) ? `calc(50% - ${exactHeightToExpect / 2}px)` : `${PADDING}px`,
                minWidth: "max-content", // Allow inner flex behaviors space stability on bounds wrapping over zoom sizes exceeding normal screens limits
                minHeight: "max-content"
             }}>
                 {/* This wrapper forces hardware scaler down rendering to pixel values exactly without flex disruption reflowing constraints over textual inputs rendering realtime WYSIWYG sizes perfectly static! */}
                 <div style={{ transform: `scale(${zoom})`, transformOrigin: "0 0" }}>
                   <PlantillaCertificado 
                     datos={{ ...form, mypeNombre, estudianteNombre: currentDisplayNombre }} 
                     isForPreviewCanvas={true} 
                   />
                 </div>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
// ── Editor de Firma con Control de Eliminación de Fondo ──────────────────────────────
function EditorFirmaModal({ imagenSrc, onConfirm, onCancel }) {
  const [umbral, setUmbral] = useState(200); // Valor de luminosidad para eliminar fondo
  const [imagenProcesada, setImagenProcesada] = useState(null);
  const [previsualizando, setPrevisualizando] = useState(true);

  // Procesar imagen con el umbral actual
  const procesarImagen = useCallback(() => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        
        if (lum > umbral) {
          data[i + 3] = 0; // Transparente
        } else if (lum > umbral - 40) {
          data[i + 3] = Math.round(((umbral - lum) / 40) * 255); // Semitransparente
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      setImagenProcesada(canvas.toDataURL("image/png"));
    };
    img.src = imagenSrc;
  }, [imagenSrc, umbral]);

  useEffect(() => {
    procesarImagen();
  }, [procesarImagen]);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 200,
      background: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "#FFFFFF",
        borderRadius: 16,
        width: "90%",
        maxWidth: 800,
        maxHeight: "90vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: FONT, fontSize: 16, fontWeight: 600 }}>Editor de Firma Digital</h3>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748B" }}>Ajusta el control para eliminar el fondo blanco de tu firma</p>
          </div>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}>
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div style={{ display: "flex", gap: 24, padding: "24px", flex: 1, overflow: "auto" }}>
          
          {/* Panel izquierdo - Original */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#64748B", marginBottom: 8 }}>Imagen Original</p>
            <div style={{
              background: "#F1F5F9",
              borderRadius: 8,
              padding: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 200,
              border: "1px solid #E2E8F0"
            }}>
              <img src={imagenSrc} alt="Original" style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain" }} />
            </div>
          </div>

          {/* Panel derecho - Resultado */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#64748B", marginBottom: 8 }}>Vista Previa (sin fondo)</p>
            <div style={{
              background: "repeating-conic-gradient(#E2E8F0 0% 25%, #FFFFFF 0% 50%) 50% / 20px 20px",
              borderRadius: 8,
              padding: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 200,
              border: "1px solid #E2E8F0"
            }}>
              {imagenProcesada && (
                <img src={imagenProcesada} alt="Procesada" style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain" }} />
              )}
            </div>
          </div>
        </div>

        {/* Control deslizante */}
        <div style={{ padding: "0 24px 16px" }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: "#0F172A", display: "block", marginBottom: 8 }}>
            Umbral de eliminación de fondo: <strong style={{ color: "#1B6FE8" }}>{umbral}</strong>
          </label>
          <input
            type="range"
            min="100"
            max="250"
            value={umbral}
            onChange={(e) => setUmbral(parseInt(e.target.value))}
            style={{ width: "100%", cursor: "pointer" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94A3B8", marginTop: 4 }}>
            <span>Más agresivo (elimina más fondo)</span>
            <span>Más conservador (preserva más detalles)</span>
          </div>
          <p style={{ fontSize: 11, color: "#64748B", marginTop: 8, fontStyle: "italic" }}>
            💡 Mueve el deslizador hacia la izquierda para eliminar más fondo blanco, o hacia la derecha para preservar bordes.
          </p>
        </div>

        {/* Botones */}
        <div style={{
          padding: "16px 24px",
          borderTop: "1px solid #E2E8F0",
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          background: "#F8FAFC"
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              background: "#FFFFFF",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(imagenProcesada)}
            style={{
              padding: "10px 24px",
              borderRadius: 8,
              border: "none",
              background: "#0F172A",
              color: "#FFFFFF",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
          >
            <ShieldCheck size={16} />
            Aplicar Firma al Certificado
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LÍNEA DE HISTORIAL PROFESIONAL 
═══════════════════════════════════════════════ */
const HistorialCertificaciones = ({ certificados, enviarMap, eliminar, envError, eliError }) => {
  return (
    <div style={{ marginTop: 20, background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden" }}>
      <div style={{ padding: "24px 30px", borderBottom: "1px solid #F1F5F9", background: "#F8FAFC", display: "flex", alignItems: "center", gap: 10 }}>
        
         <h3 style={{ margin: 0, fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.08em" }}>Certificados Emitidos</h3>
      </div>
      
      <div style={{ padding: "30px", position: "relative" }}>
         {/* Vertical line constraint */}
         <div style={{ position: "absolute", top: 40, bottom: 40, left: 180, width: 2, background: "#E2E8F0" }} />

         <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
           {certificados.map((cert, index) => {
             const enviado = cert.enviadoEmail === true;
             const isEnviando = enviarMap.loading[cert.id] || false;
             
             return (
                <motion.div key={cert.id} {...fadeUp(index * 0.05)} style={{ position: "relative", display: "flex", gap: 30, zIndex: 10 }}>
                  
                  {/* Axis Dates & Indicators */}
                  <div style={{ width: 120, flexShrink: 0, textAlign: "right", position: "relative" }}>
                     <div style={{ fontFamily: "monospace", fontSize: 11, color: "#64748B", marginTop: 4 }}>
                       {new Date(cert.fechaEmision || new Date()).toLocaleDateString("en-GB", {day:'2-digit', month:'short', year:'numeric'}).replace(/ /g,'-')}
                     </div>
                     <div style={{ 
                        position: "absolute", top: 5, right: -36, width: 14, height: 14, borderRadius: "50%", 
                        background: enviado ? "#FFFFFF" : "#FEF3C7", 
                        border: `3px solid ${enviado ? "#0F172A" : "#F59E0B"}`,
                        zIndex: 2, boxShadow: "0 0 0 4px #FFFFFF" 
                     }} />
                  </div>

                  {/* Main Document Block */}
                  <div style={{ 
                    flex: 1, border: "1px solid #E2E8F0", borderRadius: 8, padding: "20px 24px", 
                    background: "#FFFFFF", transition: "transform 0.2s, box-shadow 0.2s" 
                  }} onMouseEnter={e => {e.currentTarget.style.transform = "translateX(5px)"; e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.03)"}} onMouseLeave={e => {e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.boxShadow = "none"}}>
                    
                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <p style={{ margin: "0 0 4px", fontSize: 10, fontFamily: FONT, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748B" }}>Código del Certificado: {cert.codigo || `VAL-${cert.id}`}</p>
                      <h4 style={{ margin: 0, fontSize: 16, fontFamily: FONT, fontWeight: 600, color: "#0F172A" }}>Certificado — {cert.proyectoTitulo || "Proyecto Finalizado"}</h4>
                    </div>
                    <span style={{ 
                      fontSize: 12, 
                      fontWeight: 600, 
                      fontFamily: FONT, 
                      color: enviado ? "#10B981" : "#0b0b04"
                    }}>
                      {enviado ? <CheckCircle2 size={14} style={{ display: "inline", marginRight: 4 }} /> : <AlertTriangle size={14} style={{ display: "inline", marginRight: 4 }} />}
                      {enviado ? "Enviado" : "Sin enviar"}
                    </span>
                  </div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                       <div style={{ width: 32, height: 32, borderRadius: 6, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Users size={14} color="#64748B"/>
                       </div>
                       <div>
                         <p style={{ margin: 0, fontSize: 10, color: "#94A3B8", fontFamily: FONT }}>Estudiante Certificado:</p>
                         <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#1E293B", fontFamily: FONT }}>{cert.estudianteNombre || "Identidad Regulada"}</p>
                       </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 14, borderTop: "1px solid #F1F5F9" }}>
                      
                      <button onClick={() => { if(cert.urlCertificado) window.open(cert.urlCertificado, "_blank") }} disabled={!cert.urlCertificado} style={{ 
                        display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 6, border: "1px solid #E2E8F0", 
                        background: cert.urlCertificado ? "#FFFFFF" : "#F8FAFC", color: cert.urlCertificado ? "#0F172A" : "#94A3B8", 
                        fontSize: 11, fontWeight: 600, fontFamily: FONT, cursor: cert.urlCertificado ? "pointer" : "not-allowed" 
                      }}>
                        <Award size={12}/> Ver Certificado
                      </button>
                      
                      <button onClick={() => enviarMap.enviar(cert.id)} disabled={isEnviando || enviado} style={{ 
                        display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 6, border: "1px solid #0F172A", 
                        background: enviado ? "#F1F5F9" : (isEnviando ? "#E2E8F0" : "#0F172A"), color: enviado ? "#94A3B8" : (isEnviando ? "#64748B" : "#FFF"), 
                        fontSize: 11, fontWeight: 600, fontFamily: FONT, cursor: (isEnviando || enviado) ? "not-allowed" : "pointer" 
                      }}>
                        {isEnviando ? <Loader2 size={12} className="animate-spin"/> : <ArrowRight size={12}/>}
                        {enviado ? "Certificado Enviado" : "Enviar al Estudiante"}
                      </button>

                      {!enviado && (
                        <button onClick={() => {
                          if (window.confirm("¿Autoriza revocar e inactivar el documento emitido permanentemente del registro auditable?")) {
                            eliminar(cert.id);
                          }
                        }} style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto", background: "none", border: "none", fontSize: 11, fontWeight: 600, color: "#DC2626", cursor: "pointer", fontFamily: FONT }}>
                          <Trash2 size={12}/> Eliminar Certificado
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
             )
           })}
         </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   CONTROL PRINCIPAL DE FLUJO E INTERFAZ
═══════════════════════════════════════════════ */
export function CertificadosPage() {
  const { certificados, isLoading } = useCertificadosEmitidos();
  const { proyectos } = useMisProyectos();
  const { perfil } = useMiPerfilMype();
  const { user } = useAuthStore();
  const [modalAbierto, setModalAbierto] = useState(false);
  const { eliminar, error: errorEliminarGeneral } = useEliminarCertificado();
  const enviadorTools = useEnviarCertificado(); 

  const proyectosCompletados = proyectos.filter((p) => p.estado === "COMPLETADO");
  const certsArr = certificados || [];
  
  const totalEmitidos = certsArr.length;
  const estudiantesCert = new Set(certsArr.map((c) => c.estudianteNombre)).size;
  const operacionesConCert = new Set(certsArr.map((c) => c.proyectoId)).size;

  return (
    <MypeLayout titulo="Conformidad Contractual y Cierre">
      <AnimatePresence>
        {modalAbierto && (
          <FormalizacionDocumentalOverlay
            proyectosCompletados={proyectosCompletados}
            mypeNombre={perfil?.nombreComercial ?? ""}
            gerenteNombre={perfil?.nombreRepresentante ?? user?.nombre ?? ""}
            onClose={() => setModalAbierto(false)}
          />
        )}
      </AnimatePresence>

      <div style={{ maxWidth: 1200, margin: "0 auto", paddingBottom: 60 }}>
        
        <CentroCertificacionHero 
           certificadosEmitidos={totalEmitidos}
           estudiantesReconocidos={estudiantesCert}
           operacionesCompletadas={operacionesConCert}
        />

    <motion.div {...fadeUp(0.1)} style={{ marginBottom: 20 }}>
          <button
            onClick={() => setModalAbierto(true)}
            disabled={proyectosCompletados.length === 0}
            style={{
              fontFamily: FONT,
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 24px 10px 20px",
              borderRadius: "10px",
              border: "none",
              background: "#0F172A",
              color: "#FFFFFF",
              fontSize: 13,
              fontWeight: 500,
              cursor: proyectosCompletados.length === 0 ? "not-allowed" : "pointer",
              opacity: proyectosCompletados.length === 0 ? 0.5 : 1,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              if (proyectosCompletados.length > 0) {
                e.currentTarget.style.background = "#1E293B";
                e.currentTarget.style.transform = "scale(1.02)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#0F172A";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <div style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0F172A"
            }}>
              <Plus size={14} strokeWidth={3} />
            </div>
            Crear Nuevo Certificado
          </button>

          
          {proyectosCompletados.length === 0 && (
            <p style={{ fontFamily: FONT, fontSize: 11, color: "#F59E0B", marginTop: 8, marginLeft: 2, display: "flex", alignItems: "center", gap: 5 }}>
              <ShieldAlert size={12}/> Imprescindible contar con flujos técnicos validados como FINALIZADOS previos a certificar.
            </p>
          )}
        </motion.div>

        {isLoading ? (
           <div style={{ background: "#FFFFFF", padding: 40, borderRadius: 16, border: "1px solid #E2E8F0" }}>
              <div style={{ width: "100%", height: 300, background: "#F1F5F9", borderRadius: 8, animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
           </div>
        ) : totalEmitidos === 0 ? (
          <motion.div
            {...fadeUp(0.2)}
            style={{
              textAlign: "center", padding: "80px 40px", border: "1px solid #E2E8F0", borderRadius: 16, background: "#FFFFFF"
            }}
          >
            <div style={{ width: 64, height: 64, borderRadius: "12px", background: "#F8FAFC", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <BriefcaseBusiness size={28} color="#64748B" />
            </div>
            <h3 style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: "#0F172A", marginBottom: 12, letterSpacing: "-0.01em" }}>
              Carencia Registral Operativa
            </h3>
            <p style={{ fontFamily: FONT, fontSize: 13, color: "#64748B", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
              En la eventualidad del cumplimiento sustancial de una meta u hito institucional, facúltese aquí para certificar digital y protocolarmente las acreditaciones resolutivas exigidas por contrato.
            </p>
          </motion.div>
        ) : (
          <HistorialCertificaciones 
            certificados={certsArr} 
            enviarMap={enviadorTools} 
            eliminar={eliminar} 
            envError={enviadorTools.errorMap} 
            eliError={errorEliminarGeneral} 
          />
        )}
      </div>
      
      <style>{`
         .animate-spin { animation: spin 1.2s linear infinite; }
         @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:.5;} }
         @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </MypeLayout>
  );
}

// Icono Soporte requerido
function ShieldAlert({size, color="#currentColor"}) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 22-8-4.8V7l8-4.8 8 4.8v10.2L12 22Z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
}