import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Award,
  Calendar,
  ExternalLink,
  FolderOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  Download,
} from "lucide-react";
import { useCertificados } from "@features/certificados/useCertificados";
import { PlantillaCertificado } from "@/features/certificados/PlantillaCertificado";
import { useCalificacionesPendientes } from "@/features/calificaciones/useCalificacionesPendientes";
import RateUserModal from "@/features/calificaciones/RateUserModal";
import { useQueryClient } from "@tanstack/react-query";
import { useMypePerfil } from "@/features/mype-perfil/useMypePerfil";

const FONT = "'Angro Std', 'Outfit', sans-serif";
const ITEMS_PER_PAGE = 5;

/* ═══════════════════════════════════════════════
   MODAL VISTA PREVIA
═══════════════════════════════════════════════ */
function VistaPreviaCertificado({ certificado, onClose }) {
  const { perfil: perfilMype } = useMypePerfil(certificado?.mypeUsuarioId);
  const [descargando, setDescargando] = useState(false);
  const datosCert = {
    ...certificado,
    rucMype: certificado.rucMype || perfilMype?.ruc || "",
  };

  const tienePdf = !!certificado.pdfBase64;

  const handleDescargarPDF = async () => {
    if (tienePdf) {
      const link = document.createElement("a");
      link.href = certificado.pdfBase64;
      link.download = `certificado_${certificado.estudianteNombre || "certificado"}.pdf`;
      link.click();
      return;
    }
    // Fallback: generar PDF desde la plantilla renderizada
    setDescargando(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const { createRoot } = await import("react-dom/client");
      const { createElement } = await import("react");
      const contenedor = document.createElement("div");
      contenedor.style.cssText = "position:fixed;left:-9999px;top:0;width:297mm;height:210mm;background:#fff;z-index:-1;";
      document.body.appendChild(contenedor);
      const root = createRoot(contenedor);
      root.render(createElement(PlantillaCertificado, { datos: datosCert }));
      await new Promise(r => setTimeout(r, 900));
      const el = contenedor.querySelector("#certificado-preview");
      if (el) {
        await html2pdf()
          .set({ margin: 0, filename: `certificado_${certificado.estudianteNombre || "certificado"}.pdf`, image: { type: "jpeg", quality: 1 }, html2canvas: { scale: 2, useCORS: true, logging: false }, jsPDF: { unit: "mm", format: "a4", orientation: "landscape" } })
          .from(el)
          .save();
      }
      root.unmount();
      document.body.removeChild(contenedor);
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(10,22,40,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
        style={{ background: "#FFFFFF", borderRadius: 16, width: "95%", maxWidth: 1400, height: "90vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }}
      >
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FFFFFF" }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: FONT, fontSize: 16, fontWeight: 600, color: "#0F172A" }}>Certificado Oficial</h3>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748B", fontFamily: FONT }}>
              Emitido por: <strong>{certificado.mypeNombre}</strong> | Proyecto: {certificado.proyectoTitulo}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={handleDescargarPDF}
              disabled={descargando}
              style={{ padding: "10px 20px", background: descargando ? "#64748B" : "#0F172A", color: "#FFF", borderRadius: 8, border: "none", cursor: descargando ? "wait" : "pointer", fontSize: 12, fontWeight: 600, fontFamily: FONT, display: "flex", alignItems: "center", gap: 8, opacity: descargando ? 0.7 : 1 }}
            >
              <Download size={14} /> {descargando ? "Generando..." : "Descargar PDF"}
            </button>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: "8px", borderRadius: "6px" }}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          {tienePdf ? (
            <iframe
              src={certificado.pdfBase64}
              title="Certificado PDF"
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          ) : (
            <VistaPlantillaFallback datosCert={datosCert} />
          )}
        </div>
      </motion.div>
    </div>
  );
}

function VistaPlantillaFallback({ datosCert }) {
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(0.65);
  const PADDING = 60;
  const adjustScaleToFit = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    setZoom(Math.min((clientWidth - PADDING * 2) / 1122.5, (clientHeight - PADDING * 2) / 793.7, 1.2));
  }, []);
  useEffect(() => {
    adjustScaleToFit();
    window.addEventListener("resize", adjustScaleToFit);
    const t = setTimeout(adjustScaleToFit, 150);
    return () => { window.removeEventListener("resize", adjustScaleToFit); clearTimeout(t); };
  }, [adjustScaleToFit]);
  const w = 1122.5 * zoom;
  const h = 793.7 * zoom;
  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", background: "#E2E8F0", backgroundImage: "linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px)", backgroundSize: "24px 24px", overflow: "auto", position: "relative" }}>
      <div style={{ position: "absolute", width: `${w}px`, height: `${h}px`, left: w < (containerRef.current?.clientWidth || 0) ? `calc(50% - ${w / 2}px)` : `${PADDING}px`, top: h < (containerRef.current?.clientHeight || 0) ? `calc(50% - ${h / 2}px)` : `${PADDING}px` }}>
        <div style={{ transform: `scale(${zoom})`, transformOrigin: "0 0" }}>
          <PlantillaCertificado datos={datosCert} isForPreviewCanvas={true} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   COMMAND CENTER
═══════════════════════════════════════════════ */
const CertificadosCommandCenter = ({ total }) => {
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
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
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
        ctx.fillStyle = "rgba(139,92,246,0.35)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x;
          const dy = particles[j].y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.strokeStyle = `rgba(139,92,246,${0.08 * (1 - dist / 80)})`;
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
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "relative",
        background: "linear-gradient(135deg, #0A1628 0%, #0F2A4A 55%, #1E3A5F 100%)",
        borderRadius: "20px",
        padding: "48px 56px",
        overflow: "hidden",
        boxShadow: "0 24px 48px -12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        marginBottom: 32,
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        gap: 40,
      }}
    >
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: -100, right: -50, width: 300, height: 300, background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />

      {/* Titular */}
      <div style={{ position: "relative", zIndex: 10, flex: "1 1 50%" }}>
        <h1 style={{ fontFamily: FONT, fontSize: "2.4rem", fontWeight: 500, color: "#FFFFFF", margin: "0 0 12px", letterSpacing: "-0.03em" }}>
          Mis Certificados
        </h1>
        <p style={{ fontFamily: FONT, fontSize: 15, color: "#94A3B8", margin: 0, lineHeight: 1.6, fontWeight: 400, maxWidth: "90%" }}>
          Reconocimientos oficiales por tu participación exitosa en proyectos con empresas MYPE.
        </p>
      </div>

      {/* KPI único */}
      <div style={{ position: "relative", zIndex: 10, flex: "0 0 auto" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px 40px", backdropFilter: "blur(10px)", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94A3B8", marginBottom: 12, justifyContent: "center" }}>
            <Award size={16} />
            <span style={{ fontSize: 11, fontWeight: 600, fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total emitidos</span>
          </div>
          <div style={{ fontSize: 48, fontWeight: 400, color: "#FFFFFF", fontFamily: FONT, lineHeight: 1 }}>{total}</div>
        </div>
      </div>
    </motion.div>
  );
};


/* ═══════════════════════════════════════════════
   FILA DE CERTIFICADO — acordeón expandible
═══════════════════════════════════════════════ */
const CertificadoRow = ({ cert, index, onVerCertificado }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const titulo = cert.tituloCertificado || "Certificado Académico";
  const proyecto = cert.proyectoTitulo || "Proyecto MYPE";
  const mype = cert.nombreMype || cert.mypeNombre || "MYPE";
  const fecha = cert.fechaEmision
    ? new Date(cert.fechaEmision).toLocaleDateString("es-PE", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC"  
      })
    : "Reciente";
  const codigo = cert.codigo || "VAL-—";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      style={{
        background: isExpanded ? "#FFFFFF" : "#FCFDFD",
        border: "1px solid",
        borderColor: isExpanded ? "#E2E8F0" : "#F1F5F9",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: isExpanded ? "0 12px 32px -8px rgba(15,23,42,0.08)" : "0 2px 4px rgba(15,23,42,0.01)",
        transition: "box-shadow 0.3s ease, border-color 0.3s ease",
        marginBottom: 16,
      }}
    >
      {/* Fila principal */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "minmax(260px, 2fr) 1.5fr 1fr 1fr auto", gap: 20, alignItems: "center", cursor: "pointer" }}
      >
        {/* ID + Título */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, fontFamily: FONT, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {`CERT-${String(cert.id || index + 1).padStart(4, "0")}`}
            </span>
            <span style={{ fontSize: 9, fontFamily: FONT, fontWeight: 600, color: "#8B5CF6", background: "#F5F3FF", padding: "2px 8px", borderRadius: "4px" }}>
              {mype}
            </span>
          </div>
          <h3 style={{ margin: 0, fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "#0F1F3D", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {titulo}
          </h3>
        </div>

        {/* Proyecto */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ fontSize: 10, fontFamily: FONT, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Proyecto</span>
          <span style={{ fontSize: 13, fontFamily: FONT, fontWeight: 500, color: "#475569", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{proyecto}</span>
        </div>

        {/* Estado */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <CheckCircle2 size={13} color="#10B981" />
          <span style={{ fontSize: 12, fontFamily: FONT, fontWeight: 600, color: "#0F1F3D" }}>Completado</span>
        </div>

        {/* Fecha */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748B", fontFamily: FONT, fontSize: 12 }}>
          <Calendar size={13} />
          <span style={{ fontWeight: 500 }}>{fecha}</span>
        </div>

        {/* Flecha expandir */}
        <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
          <ChevronRight size={18} color="#94A3B8" />
        </motion.div>
      </div>

      {/* Panel expandido */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden", borderTop: "1px solid #F1F5F9" }}
          >
            <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 32, background: "#FFFFFF", flexWrap: "wrap" }}>

              {/* Código de validación */}
              <div style={{ flexShrink: 0 }}>
                <span style={{ display: "block", fontSize: 11, fontFamily: FONT, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Código de validación</span>
                <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "7px 12px", border: "1px solid #E2E8F0", display: "inline-block" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#475569", fontFamily: "monospace" }}>{codigo}</span>
                </div>
              </div>

              <div style={{ width: 1, height: 36, background: "#E2E8F0", flexShrink: 0 }} />

              {/* Empresa */}
              <div style={{ flexShrink: 0 }}>
                <span style={{ display: "block", fontSize: 11, fontFamily: FONT, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Empresa</span>
                <span style={{ fontSize: 13, fontFamily: FONT, color: "#0F1F3D", fontWeight: 600 }}>{mype}</span>
              </div>

              <div style={{ width: 1, height: 36, background: "#E2E8F0", flexShrink: 0 }} />

              {/* Fecha */}
              <div style={{ flexShrink: 0 }}>
                <span style={{ display: "block", fontSize: 11, fontFamily: FONT, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Fecha de emisión</span>
                <span style={{ fontSize: 13, fontFamily: FONT, color: "#0F1F3D", fontWeight: 600 }}>{fecha}</span>
              </div>

              <div style={{ width: 1, height: 36, background: "#E2E8F0", flexShrink: 0 }} />

              {/* Proyecto */}
              <div style={{ flex: 1, minWidth: 120 }}>
                <span style={{ display: "block", fontSize: 11, fontFamily: FONT, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Proyecto</span>
                <span style={{ fontSize: 13, fontFamily: FONT, color: "#0F1F3D", fontWeight: 600 }}>{proyecto}</span>
              </div>

              {/* Botón */}
              <button
                onClick={e => { e.stopPropagation(); onVerCertificado(cert); }}
                style={{ flexShrink: 0, background: "#1B6FE8", color: "#FFFFFF", fontFamily: FONT, border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", boxShadow: "0 4px 12px rgba(27,111,232,0.25)", transition: "all 0.2s ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(27,111,232,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(27,111,232,0.25)"; }}
              >
                Ver certificado <ExternalLink size={13} />
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


/* ═══════════════════════════════════════════════
   PAGINACIÓN
═══════════════════════════════════════════════ */
const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32, padding: "16px 24px", border: "1px solid #E2E8F0", borderRadius: 16, background: "#FAFAFA" }}>
    <span style={{ fontSize: 12, fontFamily: FONT, color: "#64748B", fontWeight: 500 }}>
      Página <span style={{ color: "#0F1F3D", fontWeight: 700 }}>{currentPage}</span> de <span style={{ color: "#0F1F3D", fontWeight: 700 }}>{totalPages}</span>
    </span>
    <div style={{ display: "flex", gap: 12 }}>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(p => Math.max(1, p - 1))}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: currentPage === 1 ? "#F1F5F9" : "#FFFFFF", border: "1px solid", borderColor: currentPage === 1 ? "transparent" : "#E2E8F0", color: currentPage === 1 ? "#94A3B8" : "#0F1F3D", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
      >
        <ChevronLeft size={16} />
      </button>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(p => Math.min(totalPages, p + 1))}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: currentPage === totalPages ? "#F1F5F9" : "#FFFFFF", border: "1px solid", borderColor: currentPage === totalPages ? "transparent" : "#E2E8F0", color: currentPage === totalPages ? "#94A3B8" : "#0F1F3D", cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  </div>
);


/* ═══════════════════════════════════════════════
   PÁGINA PRINCIPAL
═══════════════════════════════════════════════ */
const CertificadosPage = () => {
  const { data: certificados = [], isLoading, isError, error } = useCertificados();
  const { pendientes: pendientesCalificacion } = useCalificacionesPendientes();
  const [modalCalificacion, setModalCalificacion] = useState({ open: false, data: null });
  const [certificadoVistaPrevia, setCertificadoVistaPrevia] = useState(null);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const abrirCertificado = (cert) => {
    setCertificadoVistaPrevia(cert);
  };

  const handleVerCertificado = (cert) => {
    const pendiente = pendientesCalificacion?.some(
      p => p.proyectoId === cert.proyectoId && p.calificadoId === cert.mypeUsuarioId
    );
    if (pendiente) {
      setModalCalificacion({
        open: true,
        data: {
          proyectoId: cert.proyectoId,
          calificadoId: cert.mypeUsuarioId,
          calificadoNombre: cert.nombreMype,
          proyectoTitulo: cert.proyectoTitulo,
          cert,
        },
      });
    } else {
      abrirCertificado(cert);
    }
  };

  if (isLoading) {
    return (
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 36px 48px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: 80, background: "#F1F5F9", borderRadius: 16, animation: "pulse 2s infinite ease-in-out" }} />
          ))}
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }`}</style>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 36px 48px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <div style={{ background: "#fef2f2", color: "#dc2626", padding: 24, borderRadius: 16, border: "0.5px solid #fecaca", maxWidth: 400, textAlign: "center", fontFamily: FONT }}>
          <p style={{ fontWeight: 700, marginBottom: 4 }}>Error al cargar los certificados</p>
          <p style={{ fontSize: 13, opacity: 0.9 }}>{error?.message || "Error desconocido"}</p>
        </div>
      </div>
    );
  }

  const total = certificados.length;
  const certificadosOrdenados = [...certificados].sort((a, b) => {
    const fechaA = a.fechaEmision ? new Date(a.fechaEmision).getTime() : 0;
    const fechaB = b.fechaEmision ? new Date(b.fechaEmision).getTime() : 0;
    return fechaB - fechaA; // Descendente
  });
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const paginados = certificadosOrdenados.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 36px 48px", paddingBottom: 120, fontFamily: FONT }}>
      <AnimatePresence>
        {certificadoVistaPrevia && (
          <VistaPreviaCertificado
            certificado={certificadoVistaPrevia}
            onClose={() => setCertificadoVistaPrevia(null)}
          />
        )}
      </AnimatePresence>

      <CertificadosCommandCenter total={total} />

      {total === 0 ? (
        <div style={{ textAlign: "center", padding: "100px 40px", border: "1px dashed #CBD5E1", borderRadius: 24, background: "#FAFAFA", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <FolderOpen size={48} color="#CBD5E1" strokeWidth={1} style={{ marginBottom: 20 }} />
          <h3 style={{ margin: "0 0 8px 0", fontFamily: FONT, fontSize: 18, fontWeight: 500, color: "#0F1F3D" }}>Aún no tienes certificados</h3>
          <p style={{ margin: "0 0 24px", fontFamily: FONT, fontSize: 14, color: "#64748B", maxWidth: 400 }}>
            Los certificados se generan automáticamente al finalizar exitosamente tu vinculación con una MYPE.
          </p>
          <Link to="/proyectos" style={{ textDecoration: "none" }}>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ fontFamily: FONT, background: "#1B6FE8", color: "#FFFFFF", border: "none", borderRadius: "10px", padding: "12px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >
              Explorar proyectos
            </motion.button>
          </Link>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, borderBottom: "1px solid #E2E8F0", paddingBottom: 16 }}>
            <div>
              <h2 style={{ fontFamily: FONT, margin: 0, fontSize: 18, color: "#0F1F3D", fontWeight: 600 }}>Certificados emitidos</h2>
              <p style={{ fontFamily: FONT, margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
                {total} {total === 1 ? "certificado" : "certificados"} con código de validación.
              </p>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {paginados.map((cert, idx) => (
              <CertificadoRow
                key={cert.id || idx}
                cert={cert}
                index={idx}
                onVerCertificado={handleVerCertificado}
              />
            ))}
          </AnimatePresence>

          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </div>
      )}

      {modalCalificacion.open && (
        <RateUserModal
          open={modalCalificacion.open}
          pendiente={modalCalificacion.data}
          onClose={() => setModalCalificacion({ open: false, data: null })}
          onSuccess={() => {
            const cert = modalCalificacion.data?.cert;
            queryClient.invalidateQueries(["calificaciones-pendientes"]);
            queryClient.invalidateQueries(["certificados"]);
            setModalCalificacion({ open: false, data: null });
            if (cert) setTimeout(() => abrirCertificado(cert), 100);
          }}
        />
      )}

      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }`}</style>
    </div>
  );
};

export default CertificadosPage;
