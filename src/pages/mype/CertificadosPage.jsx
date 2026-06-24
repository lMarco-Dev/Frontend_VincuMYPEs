import { useState, useRef, useEffect, useCallback } from "react";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import { useAuthStore } from "@/store/authStore";
import {
  useCertificadosEmitidos,
  useEmitirCertificado,
  useEliminarCertificado,
  useEnviarCertificado,
} from "@/features/certificados/useCertificadosMype";
import { PlantillaCertificado } from "@/features/certificados/PlantillaCertificado";
import { useMisProyectos } from "@/features/proyecto-list-mype/useMisProyectos";
import RateUserModal from "@/features/calificaciones/RateUserModal";
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
  Plus,
  Eye,
  Mail,
  FileText
} from "lucide-react";

const FONT = "'Angro Std', 'Outfit', sans-serif";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

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
        
        <h1 style={{ fontFamily: FONT, fontSize: "clamp(26px, 3.5vw, 32px)", fontWeight: 500, color: "#FFFFFF", margin: "0 0 14px", letterSpacing: "-0.02em" }}>
          Centro de Certificación
        </h1>
        <p style={{ fontFamily: FONT, fontSize: 14, color: "#94A3B8", margin: 0, lineHeight: 1.7, fontWeight: 400, maxWidth: "90%" }}>
          Administra y emite certificados digitales para tus proyectos finalizados. Reconoce el trabajo de los estudiantes que completaron exitosamente sus entregables.
        </p>
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

// ── Modal de Vista Previa de Certificado ──────────────────────────────────
function VistaPreviaCertificado({ certificado, onClose }) {
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(0.65);
  const PADDING = 60;

  const adjustScaleToFit = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const exactPaperPxWidth = 1122.5; 
    const exactPaperPxHeight = 793.7;

    const scaleWidth = (clientWidth - PADDING * 2) / exactPaperPxWidth;
    const scaleHeight = (clientHeight - PADDING * 2) / exactPaperPxHeight;
    const appropriateFit = Math.min(scaleWidth, scaleHeight, 1.2); 
    setZoom(appropriateFit);
  }, []);

  useEffect(() => {
    adjustScaleToFit();
    window.addEventListener("resize", adjustScaleToFit);
    const timeoutId = setTimeout(adjustScaleToFit, 150);
    return () => {
      window.removeEventListener("resize", adjustScaleToFit);
      clearTimeout(timeoutId);
    };
  }, [adjustScaleToFit]);

  const handleDescargarPDF = async () => {
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const contenedor = document.createElement("div");
      contenedor.style.cssText = "position:fixed;left:-9999px;top:0;width:297mm;height:210mm;background:#fff;z-index:-1;";
      document.body.appendChild(contenedor);
      
      const { createRoot } = await import("react-dom/client");
      const root = createRoot(contenedor);
      
      const datosCertificado = {
  codigo: certificado.codigo,
  certificadoId: certificado.id,
  proyectoId: certificado.proyectoId,
  proyectoTitulo: certificado.proyectoTitulo,
  estudianteNombre: certificado.estudianteNombre,
  gerente: certificado.gerente,
  cargo: certificado.cargo,
  mypeNombre: certificado.mypeNombre,
  rucMype: certificado.rucMype,
  firmaUrl: certificado.firmaUrl
};
      console.log('🔍 Datos del certificado para PDF:', datosCertificado);
console.log('📸 URL de la firma:', certificado.firmaUrl);
      
      root.render(<PlantillaCertificado datos={datosCertificado} />);
      await new Promise((r) => setTimeout(r, 800));
      
      const el = contenedor.querySelector("#certificado-preview");
      if (el) {
        await html2pdf()
          .set({
            margin: 0,
            filename: `certificado_${certificado.estudianteNombre || "estudiante"}.pdf`,
            image: { type: "jpeg", quality: 1 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
          })
          .from(el)
          .save();
      }
      
      root.unmount();
      document.body.removeChild(contenedor);
    } catch (error) {
      console.error("Error al descargar certificado:", error);
    }
  };

  const exactWidthToExpect = 1122.5 * zoom; 
  const exactHeightToExpect = 793.7 * zoom;

  return (
    <div style={{ 
      position: "fixed", inset: 0, zIndex: 100, 
      background: "rgba(10,22,40,0.85)", backdropFilter: "blur(8px)", 
      display: "flex", alignItems: "center", justifyContent: "center" 
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "#FFFFFF", borderRadius: 16, 
          width: "95%", maxWidth: 1400, height: "90vh",
          display: "flex", flexDirection: "column", overflow: "hidden",
          boxShadow: "0 40px 80px rgba(0,0,0,0.5)"
        }}
      >
        {/* Header */}
        <div style={{ 
          padding: "20px 24px", borderBottom: "1px solid #E2E8F0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "#FFFFFF"
        }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: FONT, fontSize: 16, fontWeight: 600, color: "#0F172A" }}>
              Certificado Oficial
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748B", fontFamily: FONT }}>
              Emitido para: <strong>{certificado.estudianteNombre}</strong> | Proyecto: {certificado.proyectoTitulo}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button 
              onClick={handleDescargarPDF} 
              style={{
                padding: "10px 20px", 
                background: "#0F172A", 
                color: "#FFF",
                borderRadius: 8, 
                border: "none", 
                cursor: "pointer",
                fontSize: 12, 
                fontWeight: 600, 
                fontFamily: FONT,
                display: "flex", 
                alignItems: "center", 
                gap: 8,
                letterSpacing: "0.02em",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1E293B";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#0F172A";
              }}
            >
              <Download size={14} /> Descargar PDF
            </button>
            <button 
              onClick={onClose} 
              style={{ 
                background: "none", 
                border: "none", 
                cursor: "pointer", 
                color: "#94A3B8",
                padding: "8px",
                borderRadius: "6px",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F1F5F9";
                e.currentTarget.style.color = "#0F172A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.color = "#94A3B8";
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Controles de Zoom */}
        <div style={{ 
          padding: "12px 24px", 
          background: "#F8FAFC", 
          borderBottom: "1px solid #E2E8F0",
          display: "flex", 
          alignItems: "center", 
          gap: 12 
        }}>
          <div style={{ 
            background: "#FFFFFF", 
            border: "1px solid #CBD5E1", 
            borderRadius: 6, 
            display: "flex", 
            alignItems: "stretch", 
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)", 
            overflow: "hidden" 
          }}>
            <button 
              onClick={() => setZoom(z => Math.max(z - 0.1, 0.3))} 
              style={{ 
                background: "none", 
                border: "none", 
                padding: "8px 12px", 
                cursor: "pointer", 
                color: "#64748B", 
                display: "flex",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#F1F5F9"}
              onMouseLeave={(e) => e.currentTarget.style.background = "none"}
            >
              <ZoomOut size={16}/>
            </button>
            <div style={{ 
              borderLeft: "1px solid #F1F5F9", 
              borderRight: "1px solid #F1F5F9", 
              padding: "0 14px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              fontSize: 11, 
              fontWeight: 600, 
              fontFamily: "monospace", 
              color: "#0F172A", 
              background: "#F8FAFC" 
            }}>
              {Math.round(zoom * 100)}%
            </div>
            <button 
              onClick={() => setZoom(z => Math.min(z + 0.1, 1.5))} 
              style={{ 
                background: "none", 
                border: "none", 
                padding: "8px 12px", 
                cursor: "pointer", 
                color: "#64748B", 
                display: "flex",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#F1F5F9"}
              onMouseLeave={(e) => e.currentTarget.style.background = "none"}
            >
              <ZoomIn size={16}/>
            </button>
            <button 
              title="Ajustar al tamaño" 
              onClick={adjustScaleToFit} 
              style={{ 
                background: "none", 
                border: "none", 
                padding: "8px 12px", 
                cursor: "pointer", 
                borderLeft: "1px solid #F1F5F9", 
                color: "#0F172A", 
                display: "flex",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#F1F5F9"}
              onMouseLeave={(e) => e.currentTarget.style.background = "none"}
            >
              <Maximize size={16}/>
            </button>
          </div>
        </div>

        {/* Área de visualización */}
        <div 
          ref={containerRef} 
          style={{ 
            flex: 1, 
            background: "#E2E8F0",
            backgroundImage: "linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            overflow: "auto", 
            position: "relative" 
          }}
        >
          <div style={{
            position: "absolute",
            width: `${exactWidthToExpect}px`, 
            height: `${exactHeightToExpect}px`,
            left: exactWidthToExpect < (containerRef.current?.clientWidth || 0) ? `calc(50% - ${exactWidthToExpect / 2}px)` : `${PADDING}px`,
            top: exactHeightToExpect < (containerRef.current?.clientHeight || 0) ? `calc(50% - ${exactHeightToExpect / 2}px)` : `${PADDING}px`,
          }}>
            <div style={{ transform: `scale(${zoom})`, transformOrigin: "0 0" }}>
              <PlantillaCertificado
  datos={{
    codigo: certificado.codigo,
    certificadoId: certificado.id,
    proyectoId: certificado.proyectoId,
    proyectoTitulo: certificado.proyectoTitulo,
    estudianteNombre: certificado.estudianteNombre,
    gerente: certificado.gerente,
    cargo: certificado.cargo,
    mypeNombre: certificado.mypeNombre,
    rucMype: certificado.rucMype,
    firmaUrl: certificado.firmaUrl
  }}
  isForPreviewCanvas={true}
/>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Overlay Formal de Emisión con Controles Avanzados ──────────────────────────────────
function FormalizacionDocumentalOverlay({
  proyectosCompletados,
  mypeNombre,
  rucMype,
  gerenteNombre,
  certificadosEmitidos,
  onClose,
  onSuccess,
}) {
  const [datosParaPDF, setDatosParaPDF] = useState(null);
  const { emitir, isLoading, isSuccess, error } = useEmitirCertificado();
  const [exportando, setExportando] = useState(false);
  const [estudiantesConfirmados, setEstudiantesConfirmados] = useState([]);
  const [cargandoEstudiantes, setCargandoEstudiantes] = useState(false);
  const [firmaTemporal, setFirmaTemporal] = useState(null);
  const [mostrarEditorFirma, setMostrarEditorFirma] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(0.65);
  const PADDING = 60;

  const adjustScaleToFit = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const exactPaperPxWidth = 1122.5; 
    const exactPaperPxHeight = 793.7;

    const scaleWidth = (clientWidth - PADDING * 2) / exactPaperPxWidth;
    const scaleHeight = (clientHeight - PADDING * 2) / exactPaperPxHeight;
    const appropriateFit = Math.min(scaleWidth, scaleHeight, 1.2); 
    setZoom(appropriateFit);
  }, []);

  useEffect(() => {
    const handleResize = () => adjustScaleToFit();
    
    adjustScaleToFit();
    window.addEventListener("resize", handleResize);
    
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
    gerente: "",
    cargo: "",
    firmaUrl: "",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // Excluir proyectos que ya tienen al menos un certificado emitido
  const proyectosConCert = new Set(certificadosEmitidos.map(c => c.proyectoId));
  const proyectosDisponibles = proyectosCompletados.filter(p => !proyectosConCert.has(p.id));

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
        const todosLosConfirmados = (res.data || []).filter(
          (post) => post.estado === "CONFIRMADO" || post.estado === "ACEPTADO",
        );
        
        // Filtrar estudiantes que ya tienen certificado
        const certificadosExistentes = certificadosEmitidos.filter(
          cert => cert.proyectoId === p.id
        );
        
        const estudiantesDisponibles = todosLosConfirmados.filter(
          estudiante => !certificadosExistentes.some(
            cert => cert.estudianteId === estudiante.estudianteId
          )
        );
        
        setEstudiantesConfirmados(estudiantesDisponibles);
        setForm(prev => ({
          ...prev,
          estudiantesSeleccionados: estudiantesDisponibles.map(e => e.estudianteId),
        }));
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
      
      contenedor.style.cssText = "position:fixed;left:-9999px;top:0;width:297mm;height:210mm;background:#fff;z-index:-1;";
      document.body.appendChild(contenedor);
      const { createRoot } = await import("react-dom/client");
      const root = createRoot(contenedor);

      const primerNombre = estudiantesConfirmados.find(e => e.estudianteId === form.estudiantesSeleccionados[0])?.estudianteNombre;
      const datos = datosParaPDF || { ...form, mypeNombre, rucMype, estudianteNombre: primerNombre };
      
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

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const resultado = await emitir({
      proyectoId: Number(form.proyectoId),
      estudiantesIds: form.estudiantesSeleccionados,
      tituloCertificado: `Registro Formal — ${form.proyectoTitulo}`,
      firmaBase64: form.firmaUrl || null,
      gerenteNombre: form.gerente || null,
      cargoRepresentante: form.cargo || null,
    });
    
    console.log('✅ Certificado emitido:', resultado);
    
    if (onSuccess) {
      await onSuccess(resultado, {
        proyectoId: form.proyectoId,
        gerente: form.gerente,
        cargo: form.cargo,
      });
    }
  } catch (err) {
    setSubmitError(err.response?.data?.message || err.message || "Error al emitir el certificado");

  }
};

  const currentDisplayNombre = estudiantesConfirmados.find(e => e.estudianteId === form.estudiantesSeleccionados?.[0])?.estudianteNombre || null;
  const isFormCompleto = form.proyectoId && form.estudiantesSeleccionados.length > 0 && form.gerente && form.cargo && form.firmaUrl;

  const formSectionLabelStyle = { fontFamily: FONT, fontSize: 10, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, display: "block" };
  const genericInputStyle = { width: "100%", padding: "10px 14px", borderRadius: 8, fontFamily: FONT, fontSize: 13, border: "1px solid #CBD5E1", outline: "none", background: "#FFFFFF", color: "#1E293B", transition: "border 0.2s" };

  const exactWidthToExpect = 1122.5 * zoom; 
  const exactHeightToExpect = 793.7 * zoom;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(10,22,40,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }} style={{
          background: "#FFFFFF", borderRadius: 16, width: "100%", maxWidth: 1500, height: "92vh",
          display: "flex", overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.5)"
      }}>
        
        {/* PANEL LATERAL FORMULARIO */}
        <div style={{ width: 440, minWidth: 440, background: "#FFFFFF", borderRight: "1px solid #E2E8F0", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <div>
               <h3 style={{ margin: 0, fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "#0F172A", letterSpacing: "-0.01em" }}>Emitir Certificado</h3>
               <p style={{ margin: "2px 0 0", fontFamily: FONT, fontSize: 11, color: "#64748B" }}>Completa los siguientes datos</p>
             </div>
             <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><X size={20}/></button>
          </div>
          {submitError && (
            <div style={{ fontSize: 12, color: "#DC2626", background: "#FEF2F2", padding: "8px 12px", borderRadius: 6, marginTop: 10 }}>
              <AlertTriangle size={14} style={{ display: "inline", marginRight: 8 }} />
              {submitError}
            </div>
          )}
          
          <form style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 24 }}>
             <div>
                <label style={formSectionLabelStyle}>1. Proyecto Completado</label>
                <div style={{ position: "relative" }}>
                   <select required value={form.proyectoId} onChange={handleProyectoChange} style={{ ...genericInputStyle, paddingRight: 30, appearance: "none", cursor: "pointer" }}>
                     <option value="" disabled>Seleccionar mandato u operación resoluta...</option>
                     {proyectosDisponibles.map(p => <option key={p.id} value={p.id}>{p.titulo}</option>)}
                   </select>
                   <ChevronDown size={14} color="#64748B" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                </div>
             </div>

             <div style={{ opacity: form.proyectoId ? 1 : 0.4, pointerEvents: form.proyectoId ? "auto" : "none", transition: "all 0.2s" }}>
                <label style={formSectionLabelStyle}>2. Estudiantes del Proyecto</label>
                {cargandoEstudiantes ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#64748B" }}><Loader2 size={14} className="animate-spin" /> Auditando roles formales del contrato...</div>
                ) : estudiantesConfirmados.length === 0 ? (
                  <div style={{ fontSize: 12, color: "#10B981" }}>Todos los estudiantes de este proyecto ya han sido certificados.</div>
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
                  <input placeholder="Ingrese su nombre completo" required value={form.gerente} onChange={(e) => set("gerente", e.target.value.toUpperCase())} style={genericInputStyle} />

                  <div style={{ position: "relative" }}>
                    <select required value={form.cargo} onChange={(e) => set("cargo", e.target.value)} style={{ ...genericInputStyle, paddingRight: 30, appearance: "none", cursor: "pointer" }}>
                      <option value="" disabled>Seleccione cargo del representante...</option>
                      <option value="Gerente General">Gerente General</option>
                      <option value="Administrador">Administrador</option>
                      <option value="Representante Legal">Representante Legal</option>
                      <option value="Director">Director</option>
                      <option value="Propietario">Propietario</option>
                    </select>
                    <ChevronDown size={14} color="#64748B" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>

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

             {error && <div style={{ fontSize: 12, color: "#DC2626", background: "#FEF2F2", padding: "8px 12px", borderRadius: 6, display: "flex", gap: 8, alignItems: "center" }}><AlertTriangle size={14} /> El cierre transaccional falló. Retomar intento operativo.</div>}
          </form>
          
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
          
          <div style={{ padding: "20px 24px", borderTop: "1px solid #E2E8F0", background: "#FFFFFF" }}>
            {isSuccess ? (
               <div style={{ textAlign: "center" }}>
                 <p style={{ margin: "0 0 10px", fontSize: 12, color: "#16A34A", fontWeight: 600, display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}><ShieldCheck size={14}/> Certificado emitido con éxito</p>
                 <button onClick={onClose} style={{ width: "100%", padding: 16, background: "#0F172A", color: "#FFF", borderRadius: 8, fontFamily: FONT, fontSize: 12, letterSpacing:"0.15em", textTransform: "uppercase", fontWeight: 700, border: "none", cursor: "pointer" }}>Cerrar</button>
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

        {/* WORKSPACE ÁREA */}
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
          
          <div style={{ 
              position: "absolute", top: 16, right: 24, zIndex: 15, display: "flex", gap: 12, alignItems: "center"
          }}>
            <button onClick={handleExportarPDF} disabled={exportando || !form.proyectoId} style={{ background: "#FFFFFF", border: "1px solid #CBD5E1", padding: "8px 16px", borderRadius: 6, display: "flex", alignItems: "center", gap: 8, cursor: form.proyectoId ? "pointer" : "not-allowed", fontSize: 11, fontWeight: 600, color: form.proyectoId ? "#0F172A" : "#94A3B8", fontFamily: FONT, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
               {exportando ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} 
               DESCARGAR MODELO PRELIMINAR (PDF)
            </button>

            <div style={{ width: 1, height: 24, background: "#CBD5E1", margin: "0 4px" }} />

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

          <div ref={containerRef} style={{ flex: 1, width: "100%", height: "100%", overflow: "auto", position: "relative", cursor: "grab" }}>
             <div style={{
                position: "absolute",
                width: `${exactWidthToExpect}px`, 
                height: `${exactHeightToExpect}px`,
                left: exactWidthToExpect < (containerRef.current?.clientWidth || 0) ? `calc(50% - ${exactWidthToExpect / 2}px)` : `${PADDING}px`,
                top: exactHeightToExpect < (containerRef.current?.clientHeight || 0) ? `calc(50% - ${exactHeightToExpect / 2}px)` : `${PADDING}px`,
                minWidth: "max-content",
                minHeight: "max-content"
             }}>
                 <div style={{ transform: `scale(${zoom})`, transformOrigin: "0 0" }}>
                   <PlantillaCertificado
  datos={{
    ...form,
    mypeNombre,
    rucMype,
    estudianteNombre: currentDisplayNombre,
    certificadoId: null,
  }}
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
  const [umbral, setUmbral] = useState(200);
  const [imagenProcesada, setImagenProcesada] = useState(null);

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
          data[i + 3] = 0;
        } else if (lum > umbral - 40) {
          data[i + 3] = Math.round(((umbral - lum) / 40) * 255);
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

        <div style={{ display: "flex", gap: 24, padding: "24px", flex: 1, overflow: "auto" }}>
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
        </div>

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
   HISTORIAL DE CERTIFICACIONES (DISEÑO PREMIUM)
═══════════════════════════════════════════════ */

const HistorialCertificaciones = ({ certificados, enviarMap, eliminar, onVerCertificado }) => {
  const [certParaCalificar, setCertParaCalificar] = useState(null);

  return (
    <div style={{ marginTop: 20, background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden" }}>
      <div style={{ padding: "24px 30px", borderBottom: "1px solid #F1F5F9", background: "#F8FAFC", display: "flex", alignItems: "center", gap: 10 }}>
        <Award size={18} color="#0F172A" />
        <h3 style={{ margin: 0, fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.08em" }}>Certificados Emitidos</h3>
      </div>
      
      <div style={{ padding: "30px", position: "relative" }}>
        <div style={{ position: "absolute", top: 40, bottom: 40, left: 180, width: 2, background: "#E2E8F0" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {certificados.map((cert, index) => {
            const enviado = cert.enviadoEmail === true;
            const isEnviando = enviarMap.loading[cert.id] || false;
            
            return (
              <motion.div key={cert.id} {...fadeUp(index * 0.05)} style={{ position: "relative", display: "flex", gap: 30, zIndex: 10 }}>
                
                <div style={{ width: 120, flexShrink: 0, textAlign: "right", position: "relative" }}>
                  <div style={{ fontFamily: "monospace", fontSize: 11, color: "#64748B", marginTop: 4 }}>
                    {new Date(cert.fechaEmision || new Date()).toLocaleDateString("en-GB", {day:'2-digit', month:'short', year:'numeric'}).replace(/ /g,'-')}
                  </div>
                  <div style={{ 
                    position: "absolute", top: 5, right: -36, width: 14, height: 14, borderRadius: "50%", 
                    background: enviado ? "#10B981" : "#F59E0B", 
                    border: `3px solid #FFFFFF`,
                    zIndex: 2, boxShadow: "0 0 0 2px #E2E8F0" 
                  }} />
                </div>

                <div style={{ 
                  flex: 1, border: "1px solid #E2E8F0", borderRadius: 12, padding: "24px", 
                  background: "#FFFFFF", transition: "all 0.3s ease",
                  position: "relative"
                }} 
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "#CBD5E1";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.04)";
                }} 
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "#E2E8F0";
                  e.currentTarget.style.boxShadow = "none";
                }}>
                  
                  <div style={{ position: "absolute", top: 20, right: 20 }}>
                    <span style={{ 
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "6px 12px", borderRadius: 20,
                      fontSize: 11, fontWeight: 600, fontFamily: FONT,
                      background: enviado ? "#F0FDF4" : "#FEF3C7",
                      color: enviado ? "#16A34A" : "#D97706",
                      border: `1px solid ${enviado ? "#BBF7D0" : "#FDE68A"}`
                    }}>
                      {enviado ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                      {enviado ? "Enviado" : "Pendiente"}
                    </span>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <p style={{ margin: "0 0 4px", fontSize: 10, fontFamily: FONT, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748B" }}>
                      Código del Certificado: {cert.codigo || `VAL-${cert.id}`}
                    </p>
                    <h4 style={{ margin: "0 0 12px", fontSize: 16, fontFamily: FONT, fontWeight: 600, color: "#0F172A", maxWidth: "80%" }}>
                      Certificado — {cert.proyectoTitulo || "Proyecto Finalizado"}
                    </h4>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#F8FAFC", borderRadius: 8, marginTop: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Users size={16} color="#64748B"/>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 10, color: "#94A3B8", fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.05em" }}>Estudiante Certificado</p>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "#1E293B", fontFamily: FONT }}>{cert.estudianteNombre || "Identidad Regulada"}</p>
                      </div>
                    </div>
                  </div>

                  {/* ACCIONES CON DISEÑO PREMIUM */}
                  <div style={{ 
                    display: "flex", alignItems: "center", gap: 8, 
                    paddingTop: 16, borderTop: "1px solid #F1F5F9",
                    flexWrap: "wrap"
                  }}>
                    
                    {/* Botón Ver Certificado */}
                    <button 
                      onClick={() => onVerCertificado(cert)} 
                      style={{ 
                        display: "inline-flex", alignItems: "center", gap: 8,
                        padding: "8px 0 8px 4px", 
                        background: "transparent",
                        border: "none",
                        borderBottom: "2px solid #0F172A",
                        color: "#0F172A",
                        fontSize: 13,
                        fontWeight: 500,
                        fontFamily: FONT,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        letterSpacing: "0.02em"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderBottomColor = "#10B981";
                        e.currentTarget.style.gap = "12px";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderBottomColor = "#0F172A";
                        e.currentTarget.style.gap = "8px";
                      }}
                    >
                      <Eye size={14} strokeWidth={2.5} />
                      Ver Certificado
                    </button>

                    {/* Botón Enviar al Estudiante */}
                    <button
                      onClick={() => !enviado && setCertParaCalificar(cert)}
                      disabled={isEnviando || enviado}
                      style={{ 
                        display: "inline-flex", alignItems: "center", gap: 8,
                        padding: "8px 0 8px 4px", 
                        background: "transparent",
                        border: "none",
                        borderBottom: enviado ? "2px solid #10B981" : "2px solid #0F172A",
                        color: enviado ? "#10B981" : "#0F172A",
                        fontSize: 13,
                        fontWeight: 500,
                        fontFamily: FONT,
                        cursor: (isEnviando || enviado) ? "not-allowed" : "pointer",
                        opacity: (isEnviando || enviado) ? 0.7 : 1,
                        transition: "all 0.2s ease",
                        letterSpacing: "0.02em"
                      }}
                      onMouseEnter={(e) => {
                        if (!isEnviando && !enviado) {
                          e.currentTarget.style.borderBottomColor = "#3B82F6";
                          e.currentTarget.style.gap = "12px";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!enviado) {
                          e.currentTarget.style.borderBottomColor = "#0F172A";
                          e.currentTarget.style.gap = "8px";
                        }
                      }}
                    >
                      {isEnviando ? (
                        <Loader2 size={14} className="animate-spin"/>
                      ) : enviado ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <Mail size={14} strokeWidth={2.5} />
                      )}
                      {enviado ? "Certificado Enviado" : isEnviando ? "Enviando..." : "Enviar al Estudiante"}
                    </button>

                    {/* Botón Eliminar (solo si no enviado) */}
                    {!enviado && (
                      <button 
                        onClick={() => {
                          if (window.confirm("¿Autoriza revocar e inactivar el documento emitido permanentemente del registro auditable?")) {
                            eliminar(cert.id);
                          }
                        }} 
                        style={{ 
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: "8px 0 8px 4px", 
                          background: "transparent",
                          border: "none",
                          borderBottom: "2px solid transparent",
                          color: "#DC2626",
                          fontSize: 13,
                          fontWeight: 500,
                          fontFamily: FONT,
                          cursor: "pointer",
                          marginLeft: "auto",
                          transition: "all 0.2s ease",
                          letterSpacing: "0.02em"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderBottomColor = "#DC2626";
                          e.currentTarget.style.gap = "10px";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderBottomColor = "transparent";
                          e.currentTarget.style.gap = "6px";
                        }}
                      >
                        <Trash2 size={14} strokeWidth={2.5} />
                        Eliminar Certificado
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <RateUserModal
        open={!!certParaCalificar}
        pendiente={certParaCalificar ? {
          proyectoId:      certParaCalificar.proyectoId,
          calificadoId:    certParaCalificar.estudianteId,
          calificadoNombre: certParaCalificar.estudianteNombre,
          proyectoTitulo:  certParaCalificar.proyectoTitulo,
        } : null}
        onClose={() => setCertParaCalificar(null)}
        onSuccess={() => {
          const cert = certParaCalificar;
          setCertParaCalificar(null);
          enviarMap.enviar(cert.id, null);
        }}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════
   CONTROL PRINCIPAL DE FLUJO E INTERFAZ
═══════════════════════════════════════════════ */
export function CertificadosPage() {
  const { certificados, isLoading, refetch: refetchCertificados } = useCertificadosEmitidos();
  const { proyectos, refetch: refetchProyectos } = useMisProyectos();
  const { perfil } = useMiPerfilMype();
  const { user } = useAuthStore();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [certificadoVistaPrevia, setCertificadoVistaPrevia] = useState(null);
  const [pendingCertsByProject, setPendingCertsByProject] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vincumype_cert_pending") || "{}");
    } catch {
      return {};
    }
  });
  const { eliminar, error: errorEliminarGeneral } = useEliminarCertificado();
  const enviadorTools = useEnviarCertificado();
  const queryClient = useQueryClient();

  const proyectosCompletados = proyectos.filter((p) => p.estado === "COMPLETADO");

  const certsArr = (certificados || []).map(c => {
    const pending = pendingCertsByProject[c.proyectoId];
    return {
      ...c,
      gerente: c.gerente || (pending ? pending.gerente : ""),
      cargo: c.cargo || (pending ? pending.cargo : ""),
      rucMype: c.rucMype || perfil?.ruc || "",
    };
  });

  const totalEmitidos = certsArr.length;
  const estudiantesCert = new Set(certsArr.map((c) => c.estudianteNombre)).size;
  const operacionesConCert = new Set(certsArr.map((c) => c.proyectoId)).size;

  const handleEmitSuccess = async (resultado, formData) => {
    if (formData?.proyectoId) {
      const entry = { gerente: formData.gerente, cargo: formData.cargo };
      setPendingCertsByProject(prev => {
        const next = { ...prev, [formData.proyectoId]: entry };
        try { localStorage.setItem("vincumype_cert_pending", JSON.stringify(next)); } catch {}
        return next;
      });
    }
    await refetchCertificados();
    queryClient.invalidateQueries({ queryKey: ["certificados-emitidos"] });
    queryClient.invalidateQueries({ queryKey: ["mis-proyectos"] });
    setModalAbierto(false);
  };

  const proyectosConCertEmitido = new Set(certsArr.map(c => c.proyectoId));
  const proyectosDisponibles = proyectosCompletados.filter(p => !proyectosConCertEmitido.has(p.id));

  return (
    <MypeLayout titulo="Conformidad Contractual y Cierre">
      <AnimatePresence>
        {modalAbierto && (
          <FormalizacionDocumentalOverlay
            proyectosCompletados={proyectosCompletados}
            mypeNombre={perfil?.nombreComercial ?? ""}
            rucMype={perfil?.ruc ?? ""}
            gerenteNombre={perfil?.nombreRepresentante ?? user?.nombre ?? ""}
            certificadosEmitidos={certsArr}
            onClose={() => setModalAbierto(false)}
            onSuccess={handleEmitSuccess}
          />
        )}
        
        {certificadoVistaPrevia && (
          <VistaPreviaCertificado
            certificado={certificadoVistaPrevia}
            onClose={() => setCertificadoVistaPrevia(null)}
          />
        )}
      </AnimatePresence>

      <div style={{ maxWidth: 1320, margin: "0 auto", paddingBottom: 60 }}>
        
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
              gap: 10,
              padding: "8px 0 8px 4px",
              background: "transparent",
              border: "none",
              borderBottom: "2px solid #0F172A",
              color: "#0F172A",
              fontSize: 13,
              fontWeight: 500,
              cursor: proyectosCompletados.length === 0 ? "not-allowed" : "pointer",
              opacity: proyectosCompletados.length === 0 ? 0.5 : 1,
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              if (proyectosCompletados.length > 0) {
                e.currentTarget.style.borderBottomColor = "#F59E0B";
                e.currentTarget.style.gap = "14px";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderBottomColor = "#0F172A";
              e.currentTarget.style.gap = "10px";
            }}
          >
            <Plus size={14} strokeWidth={2.5} />
            Crear Nuevo certificado
          </button>

          
          {proyectosDisponibles.length === 0 && proyectosCompletados.length > 0 && (
            <p style={{ fontFamily: FONT, fontSize: 11, color: "#10B981", marginTop: 8, marginLeft: 2, display: "flex", alignItems: "center", gap: 5 }}>
              <CheckCircle2 size={12}/> Todos los proyectos finalizados tienen sus certificados emitidos.
            </p>
          )}
          
          {proyectosCompletados.length === 0 && (
            <p style={{ fontFamily: FONT, fontSize: 11, color: "#F59E0B", marginTop: 8, marginLeft: 2, display: "flex", alignItems: "center", gap: 5 }}>
              <ShieldAlert size={12}/> No hay proyectos finalizados para certificar.
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
              textAlign: "center",
              padding: "100px 40px",
              border: "1px dashed #CBD5E1",
              borderRadius: "20px",
              background: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <BriefcaseBusiness size={48} color="#CBD5E1" strokeWidth={1} style={{ marginBottom: 20 }} />
            <h3 style={{ margin: "0 0 8px 0", fontFamily: FONT, fontSize: 18, fontWeight: 500, color: "#0F1F3D" }}>
              No hay certificados emitidos
            </h3>
            <p style={{ margin: 0, fontFamily: FONT, fontSize: 14, color: "#64748B", maxWidth: 500, lineHeight: 1.6 }}>
              Comienza creando el primer certificado para tus proyectos finalizados.
            </p>
          </motion.div>
        ) : (
          <HistorialCertificaciones 
            certificados={certsArr} 
            enviarMap={enviadorTools} 
            eliminar={eliminar} 
            onVerCertificado={setCertificadoVistaPrevia}
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

export { FormalizacionDocumentalOverlay };

export default CertificadosPage;

// Icono Soporte requerido
function ShieldAlert({size, color="#currentColor"}) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 22-8-4.8V7l8-4.8 8 4.8v10.2L12 22Z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
}