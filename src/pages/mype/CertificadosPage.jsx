import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import { motion } from "framer-motion";
import { useCalificacionesPendientes } from "@/features/calificaciones/useCalificacionesPendientes";
import RateUserModal from "@/features/calificaciones/RateUserModal";
import {
  Award,
  Plus,
  X,
  Loader2,
  CheckCircle2,
  User,
  Briefcase,
  Calendar,
  FileText,
  AlertTriangle,
  Download,
  Eye,
  TrendingUp,
  ShieldCheck,
  Send,
  ChevronDown,
  Users,
  Trash2,
} from "lucide-react";

const FONT = "'Angro Std', 'Outfit', sans-serif";
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

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
      setErrorMap((p) => ({ ...p, [certificadoId]: "Error al enviar. Intenta de nuevo." }));
    } finally {
      setLoading((p) => ({ ...p, [certificadoId]: false }));
    }
  };

  return { enviar, loading, errorMap };
}

// ── Hero Banner (sin cambios, solo visual) ─────────────────────
const CertificadosHeroBanner = ({
  totalEmitidos,
  proyectosCompletadosCount,
}) => {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current,
      hero = heroRef.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext("2d");
    let W, H, animId;
    const mouse = { x: -999, y: -999 };
    const COLORS = ["rgba(27,111,232,", "rgba(6,182,212,", "rgba(245,158,11,"];
    const resize = () => {
      W = canvas.width = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(hero);
    hero.addEventListener("mousemove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    hero.addEventListener("mouseleave", () => {
      mouse.x = -999;
      mouse.y = -999;
    });
    class Particle {
      constructor() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.size = Math.random() * 2 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = Math.random() * 0.5 + 0.2;
      }
      update() {
        const dx = this.x - mouse.x,
          dy = this.y - mouse.y,
          d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          this.x += dx * 0.02;
          this.y += dy * 0.02;
        }
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > W) this.speedX *= -1;
        if (this.y < 0 || this.y > H) this.speedY *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ")";
        ctx.fill();
      }
    }
    const particles = Array.from({ length: 50 }, () => new Particle());
    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x,
            dy = particles[i].y - particles[j].y,
            dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(27,111,232,${0.1 * (1 - dist / 80)})`;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <motion.div
      ref={heroRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "2rem",
        background:
          "linear-gradient(135deg,#0A1628 0%,#0F2A4A 60%,#1E3A5F 100%)",
        padding: "40px 48px",
        color: "#fff",
        marginBottom: 24,
        minHeight: 200,
        display: "flex",
        alignItems: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "radial-gradient(circle,#F59E0B,transparent 70%)",
          opacity: 0.12,
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -50,
          left: 100,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle,#06B6D4,transparent 70%)",
          opacity: 0.1,
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div style={{ maxWidth: 500 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 1092 1092"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon
                points="287,191 250,210 225,241 223,280 224,420 336,418 338,280 295,250 296,342 287,191"
                fill="#60A5FA"
              />
              <polygon
                points="804,191 842,210 867,241 867,280 866,420 752,418 750,280 795,250 795,342 804,191"
                fill="#06B6D4"
              />
              <circle cx="546" cy="290" r="48" fill="#F97316" />
            </svg>
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: -0.5,
              }}
            >
              linkuy
            </span>
          </div>
          <h1
            style={{
              fontSize: "clamp(22px,3vw,32px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 12,
            }}
          >
            Reconocimiento oficial para{" "}
            <span style={{ color: "#F59E0B" }}>tus colaboradores</span>
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Emite certificados digitales con firma verificable y envíalos
            directamente al email del estudiante.
          </p>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {[
            { n: totalEmitidos, lbl: "Certificados Emitidos", c: "#06B6D4" },
            {
              n: proyectosCompletadosCount,
              lbl: "Proyectos Completados",
              c: "#F59E0B",
            },
          ].map((s) => (
            <div
              key={s.lbl}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16,
                padding: "16px 24px",
                textAlign: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: s.c,
                  lineHeight: 1,
                }}
              >
                {s.n}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginTop: 4,
                  fontWeight: 600,
                }}
              >
                {s.lbl}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ── NUEVA PLANTILLA DE CERTIFICADO (A4 horizontal, profesional) ──
function PlantillaCertificado({ datos }) {
  const hoy = new Date().toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const fechaInicioStr = datos.fechaInicio
    ? new Date(datos.fechaInicio).toLocaleDateString("es-PE")
    : hoy;

  return (
    <div
      id="certificado-preview"
      style={{
        width: "297mm",
        height: "210mm",
        margin: 0,
        padding: "15mm 20mm",
        background: "#fff",
        fontFamily: "'Times New Roman', 'Georgia', serif",
        boxSizing: "border-box",
        position: "relative",
        pageBreakAfter: "avoid",
        breakInside: "avoid",
      }}
    >
      {/* Borde decorativo sutil */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          right: 10,
          bottom: 10,
          border: "1px solid #ddd",
          pointerEvents: "none",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
        {/* Encabezado: Logo y nombre de la plataforma */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <svg width="50" height="50" viewBox="0 0 1092 1092" fill="none" style={{ margin: "0 auto" }}>
            <polygon points="287,191 250,210 225,241 223,280 224,420 336,418 338,280 295,250 296,342 287,191" fill="#1B6FE8"/>
            <polygon points="804,191 842,210 867,241 867,280 866,420 752,418 750,280 795,250 795,342 804,191" fill="#06B6D4"/>
            <circle cx="546" cy="290" r="48" fill="#F97316"/>
          </svg>
          <h1 style={{ fontSize: 26, fontWeight: "normal", margin: "10px 0 5px", letterSpacing: 2 }}>
            linkuy
          </h1>
          <p style={{ fontSize: 11, color: "#555", margin: 0 }}>
            Plataforma de vinculación académico-empresarial · Cajamarca, Perú
          </p>
        </div>

        {/* Cuerpo principal */}
        <div style={{ flex: 1, textAlign: "center", padding: "20px 0" }}>
          <p style={{ fontSize: 15, marginBottom: 20, letterSpacing: 1 }}>CERTIFICADO DE PARTICIPACIÓN</p>
          <p style={{ fontSize: 13, marginBottom: 8 }}>Otorgado a</p>
          <div style={{ fontSize: 34, fontStyle: "italic", fontWeight: "bold", marginBottom: 25, borderBottom: "1px solid #ccc", display: "inline-block", paddingBottom: 6 }}>
            {datos.nombreEstudiante || "Estudiante"}
          </div>
          <p style={{ fontSize: 13, marginBottom: 8 }}>por su participación en el proyecto</p>
          <p style={{ fontSize: 20, fontWeight: "bold", marginBottom: 25 }}>
            «{datos.nombreProyecto || "Proyecto"}»
          </p>
          <p style={{ fontSize: 12, marginBottom: 5 }}>
            Desarrollado en el marco de la vinculación entre linkuy y la empresa <strong>{datos.nombreMype || "MYPE"}</strong>.
          </p>
          <p style={{ fontSize: 12, marginBottom: 5 }}>
            Fecha de inicio: {fechaInicioStr} &nbsp;|&nbsp; Fecha de emisión: {hoy}
          </p>
        </div>

        {/* Pie: firma y datos de la empresa */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 20 }}>
          <div style={{ textAlign: "center", width: "40%" }}>
            {datos.firmaUrl ? (
              <img src={datos.firmaUrl} alt="Firma" style={{ height: 60, objectFit: "contain", marginBottom: 5 }} />
            ) : (
              <div style={{ height: 60, borderBottom: "1px solid #000", marginBottom: 5 }} />
            )}
            <p style={{ fontSize: 11, margin: 0 }}>{datos.gerente || "Gerente General"}</p>
            <p style={{ fontSize: 10, color: "#555" }}>{datos.nombreMype || "Empresa"}</p>
          </div>
          <div style={{ textAlign: "center", width: "40%" }}>
            <p style={{ fontSize: 11, marginBottom: 2 }}>RUC: {datos.rucMype || "________________"}</p>
            <p style={{ fontSize: 9, color: "#777" }}>Certificado digital verificable en www.linkuy.pe</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Modal emitir certificado (actualizado) ──────────────────────
function ModalEmitirCertificado({
  proyectosCompletados,
  mypeNombre,
  gerenteNombre,
  rucMype,
  onClose,
}) {
  const [datosParaPDF, setDatosParaPDF] = useState(null);
  const { emitir, isLoading, isSuccess, error } = useEmitirCertificado();
  const [preview, setPreview] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [estudiantesConfirmados, setEstudiantesConfirmados] = useState([]);
  const [cargandoEstudiantes, setCargandoEstudiantes] = useState(false);
  const [form, setForm] = useState({
    proyectoId: "",
    proyectoTitulo: "",
    estudiantesSeleccionados: [],
    gerente: gerenteNombre || "",
    descripcion: "",
    firmaUrl: "",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleProyectoChange = async (e) => {
    const p = proyectosCompletados.find((p) => p.id === Number(e.target.value));
    if (p) {
      set("proyectoId", p.id);
      set("proyectoTitulo", p.titulo);
      set("estudiantesSeleccionados", []);
      setCargandoEstudiantes(true);
      try {
        const res = await httpClient.get(`/proyectos/${p.id}/postulaciones/aceptadas`);
        const confirmados = (res.data || []).filter(
          (post) => post.estado === "CONFIRMADO" || post.estado === "ACEPTADO"
        );
        setEstudiantesConfirmados(confirmados);
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

  // Versión mejorada de handleFirma con escalado a 200px y eliminación de fondo
  const handleFirma = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxWidth = 200;
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (lum > 200) {
            data[i + 3] = 0; // transparente
          } else if (lum > 160) {
            data[i + 3] = Math.floor(((200 - lum) / 40) * 255);
          }
        }
        ctx.putImageData(imageData, 0, 0);
        set("firmaUrl", canvas.toDataURL("image/png"));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Exportar PDF con tamaño A4 landscape sin márgenes
  const handleExportarPDF = async () => {
    setExportando(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const contenedor = document.createElement("div");
      contenedor.style.cssText = "position:fixed;left:-9999px;top:0;width:1200px;background:#fff;z-index:-1;";
      document.body.appendChild(contenedor);
      const { createRoot } = await import("react-dom/client");
      const root = createRoot(contenedor);
      const datos = datosParaPDF || { ...form, mypeNombre };
      root.render(<PlantillaCertificado datos={datos} />);
      await new Promise((r) => setTimeout(r, 500));
      const el = contenedor.querySelector("#certificado-preview");
      if (el) {
        await html2pdf()
          .set({
            margin: 0,
            filename: `certificado-${datos.nombreEstudiante || "certificado"}.pdf`,
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
          })
          .from(el)
          .save();
      }
      root.unmount();
      document.body.removeChild(contenedor);
    } catch (e) {
      console.error("Error PDF:", e);
    } finally {
      setExportando(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const proyecto = proyectosCompletados.find((p) => p.id === Number(form.proyectoId));
    const fechaInicio = proyecto?.fechaInicioReal ?? proyecto?.fechaInicio ?? null;
    const primerEstudiante = estudiantesConfirmados.find(
      (est) => est.estudianteId === form.estudiantesSeleccionados[0]
    );
    setDatosParaPDF({
      nombreEstudiante: primerEstudiante?.estudianteNombre || "Estudiante",
      nombreProyecto: form.proyectoTitulo,
      fechaInicio,
      nombreMype: mypeNombre,
      rucMype: rucMype || null,
      firmaUrl: form.firmaUrl,
      gerente: form.gerente,
    });
    emitir({
      proyectoId: Number(form.proyectoId),
      estudiantesIds: form.estudiantesSeleccionados,
      tituloCertificado: `Certificado de Participación — ${form.proyectoTitulo}`,
      descripcionCertificado: form.descripcion,
      firmaBase64: form.firmaUrl || null,
      gerenteNombre: form.gerente || null,
    });
  };

  const inputSt = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    fontFamily: FONT,
    fontSize: 13,
    border: "1px solid #E5E7EB",
    outline: "none",
    background: "#fff",
    color: "#111827",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };
  const labelSt = {
    fontFamily: FONT,
    fontSize: 11,
    fontWeight: 700,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    display: "flex",
    alignItems: "center",
    gap: 5,
    marginBottom: 6,
  };

  if (isSuccess) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          background: "rgba(15,42,74,0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: "#fff",
            borderRadius: "2rem",
            width: "100%",
            maxWidth: 420,
            padding: 32,
            textAlign: "center",
            boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#F0FDF4",
              border: "2px solid #BBF7D0",
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircle2 size={32} color="#15803D" />
          </div>
          <h3 style={{ fontFamily: FONT, fontSize: 20, fontWeight: 800, color: "#0F1F3D", margin: "0 0 8px" }}>
            ¡Certificado emitido!
          </h3>
          <p style={{ fontFamily: FONT, fontSize: 13, color: "#6B7280", margin: "0 0 24px" }}>
            El PDF fue generado y subido. Usa el botón "Descargar PDF" en la lista para abrirlo, o envíalo al estudiante.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={handleExportarPDF}
              disabled={exportando}
              style={{
                fontFamily: FONT,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                borderRadius: 12,
                background: "linear-gradient(135deg,#1B6FE8,#0E54C4)",
                color: "#fff",
                border: "none",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {exportando ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Download size={16} />}
              Vista previa PDF
            </button>
            <button
              onClick={onClose}
              style={{
                fontFamily: FONT,
                padding: "12px 24px",
                borderRadius: 12,
                background: "transparent",
                border: "1px solid #E5E7EB",
                color: "#6B7280",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(15,42,74,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        overflowY: "auto",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{
          background: "#fff",
          borderRadius: "2rem",
          width: "100%",
          maxWidth: preview ? 900 : 640,
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            height: 4,
            background: "linear-gradient(90deg,#1B6FE8,#06B6D4)",
            flexShrink: 0,
          }}
        />
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "1rem",
                background: "linear-gradient(135deg,#1B6FE8,#06B6D4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Award size={22} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontFamily: FONT, fontSize: 18, fontWeight: 800, color: "#0F1F3D", margin: 0 }}>
                Emitir certificado
              </h2>
              <p style={{ fontFamily: FONT, fontSize: 12, color: "#6B7280", margin: "2px 0 0" }}>
                Selecciona proyecto y estudiantes
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setPreview(!preview)}
              style={{
                fontFamily: FONT,
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: "0.75rem",
                fontSize: 12,
                fontWeight: 600,
                background: preview ? "rgba(27,111,232,0.08)" : "#F3F4F6",
                color: preview ? "#1B6FE8" : "#6B7280",
                border: `1px solid ${preview ? "rgba(27,111,232,0.2)" : "#E5E7EB"}`,
                cursor: "pointer",
              }}
            >
              <Eye size={14} /> {preview ? "Ocultar" : "Ver"} preview
            </button>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#9CA3AF",
                padding: 6,
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <form onSubmit={handleSubmit} style={{ flex: 1, minWidth: preview ? 300 : "100%", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Campos del formulario (iguales a los que ya tenías, no modificados) */}
              <div>
                <label style={labelSt}><Briefcase size={12} /> Proyecto completado</label>
                <div style={{ position: "relative" }}>
                  <select
                    required
                    value={form.proyectoId}
                    onChange={handleProyectoChange}
                    style={{ ...inputSt, paddingRight: 36, appearance: "none", cursor: "pointer" }}
                  >
                    <option value="">Selecciona un proyecto...</option>
                    {proyectosCompletados.map((p) => (
                      <option key={p.id} value={p.id}>{p.titulo}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} color="#9CA3AF" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                </div>
                {proyectosCompletados.length === 0 && <p style={{ fontFamily: FONT, fontSize: 11, color: "#F97316", margin: "6px 0 0" }}>Solo puedes emitir certificados de proyectos COMPLETADOS</p>}
              </div>

              <div>
                <label style={labelSt}><User size={12} /> Estudiantes confirmados</label>
                {!form.proyectoId ? (
                  <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 8 }}>Primero selecciona un proyecto</p>
                ) : cargandoEstudiantes ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 0" }}>
                    <Loader2 size={16} style={{ animation: "spin 1s linear infinite", color: "#1B6FE8" }} />
                    <span style={{ fontFamily: FONT, fontSize: 12, color: "#9CA3AF" }}>Cargando estudiantes...</span>
                  </div>
                ) : estudiantesConfirmados.length === 0 ? (
                  <p style={{ fontSize: 12, color: "#F97316", marginTop: 8 }}>No hay estudiantes confirmados en este proyecto.</p>
                ) : (
                  <div style={{ maxHeight: 200, overflowY: "auto", border: "1px solid #E5E7EB", borderRadius: 12, padding: 12, background: "#fff" }}>
                    {estudiantesConfirmados.map((est) => (
                      <label key={est.estudianteId} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={form.estudiantesSeleccionados.includes(est.estudianteId)}
                          onChange={() => toggleEstudiante(est.estudianteId)}
                          style={{ width: 16, height: 16, cursor: "pointer", accentColor: "#1B6FE8" }}
                        />
                        <span style={{ fontSize: 13, color: "#111827" }}>{est.estudianteNombre}</span>
                      </label>
                    ))}
                  </div>
                )}
                {form.estudiantesSeleccionados.length > 0 && (
                  <p style={{ fontSize: 11, color: "#059669", marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                    <CheckCircle2 size={11} /> {form.estudiantesSeleccionados.length} estudiante(s) seleccionado(s)
                  </p>
                )}
              </div>

              <div>
                <label style={labelSt}><User size={12} /> Nombre del gerente / representante</label>
                <input required placeholder="Nombre completo del gerente" value={form.gerente} onChange={(e) => set("gerente", e.target.value)} style={inputSt} />
              </div>

              <div>
                <label style={labelSt}><Calendar size={12} /> Descripción del logro (opcional)</label>
                <textarea rows={3} placeholder="Ej: El estudiante completó el proyecto con todos los entregables aprobados..." value={form.descripcion} onChange={(e) => set("descripcion", e.target.value)} style={{ ...inputSt, resize: "vertical" }} />
              </div>

              <div>
                <label style={labelSt}><FileText size={12} /> Firma digital del gerente (PNG/JPG)</label>
                <div
                  style={{ border: "1.5px dashed #E5E7EB", borderRadius: 12, padding: "16px 20px", textAlign: "center", cursor: "pointer", transition: "all 0.2s", background: "#F9FAFB" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#1B6FE8")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
                  onClick={() => document.getElementById("firma-input").click()}
                >
                  {form.firmaUrl ? (
                    <div>
                      <p style={{ fontFamily: FONT, fontSize: 10, color: "#6B7280", marginBottom: 6 }}>Firma procesada (fondo eliminado):</p>
                      <div style={{
                        backgroundImage: "linear-gradient(45deg,#E5E7EB 25%,transparent 25%,transparent 75%,#E5E7EB 75%),linear-gradient(45deg,#E5E7EB 25%,transparent 25%,transparent 75%,#E5E7EB 75%)",
                        backgroundSize: "12px 12px", backgroundPosition: "0 0, 6px 6px", backgroundColor: "#fff", borderRadius: 8, padding: 8, display: "inline-block", border: "1px solid #E5E7EB"
                      }}>
                        <img src={form.firmaUrl} alt="Firma" style={{ height: 60, objectFit: "contain", display: "block" }} />
                      </div>
                      <button type="button" onClick={(e) => { e.stopPropagation(); set("firmaUrl", ""); document.getElementById("firma-input").value = ""; }} style={{ fontFamily: FONT, fontSize: 11, color: "#DC2626", background: "none", border: "none", cursor: "pointer", marginTop: 8, padding: 0, display: "block", margin: "8px auto 0" }}>
                        × Cambiar firma
                      </button>
                    </div>
                  ) : (
                    <>
                      <FileText size={24} color="#D1D5DB" style={{ marginBottom: 8 }} />
                      <p style={{ fontFamily: FONT, fontSize: 12, color: "#9CA3AF", margin: 0 }}>Clic para cargar la firma del gerente</p>
                      <p style={{ fontFamily: FONT, fontSize: 10, color: "#D1D5DB", margin: "4px 0 0" }}>PNG o JPG — se eliminará el fondo automáticamente</p>
                    </>
                  )}
                  <input id="firma-input" type="file" accept="image/*" style={{ display: "none" }} onChange={handleFirma} />
                </div>
              </div>

              {error && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px" }}>
                  <AlertTriangle size={14} color="#DC2626" />
                  <span style={{ fontFamily: FONT, fontSize: 12, color: "#DC2626" }}>{error}</span>
                </div>
              )}

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
                <button type="button" onClick={onClose} style={{ fontFamily: FONT, padding: "10px 20px", borderRadius: 10, background: "transparent", border: "1px solid #E5E7EB", color: "#6B7280", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
                <button type="submit" disabled={isLoading || !form.proyectoId || form.estudiantesSeleccionados.length === 0 || !form.gerente} style={{ fontFamily: FONT, display: "flex", alignItems: "center", gap: 8, padding: "10px 24px", borderRadius: 10, background: "linear-gradient(135deg,#1B6FE8,#0E54C4)", color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1 }}>
                  {isLoading ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Emitiendo...</> : <><Award size={14} /> Emitir certificado</>}
                </button>
              </div>
            </form>

            {preview && (
              <div style={{ flex: 1.2, minWidth: 320 }}>
                <div style={{ background: "#F8FAFC", borderRadius: "1rem", padding: "16px 0", border: "1px solid #E5E7EB" }}>
                  <p style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12, paddingLeft: 16 }}>Vista previa en tiempo real</p>
                  <div style={{ maxHeight: "calc(90vh - 300px)", overflowY: "auto", padding: "0 16px" }}>
                    {(() => {
                      const primerEstudiante = estudiantesConfirmados.find(e => e.estudianteId === form.estudiantesSeleccionados?.[0])?.estudianteNombre || "Estudiante(s)";
                      return (
                        <PlantillaCertificado
                          datos={{
                            ...form,
                            mypeNombre,
                            estudianteNombre: primerEstudiante,
                          }}
                        />
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: "14px 24px", background: "#F8FAFC", borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
          <button onClick={handleExportarPDF} disabled={exportando || !form.proyectoId} style={{ fontFamily: FONT, display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10, background: form.proyectoId ? "#F0FDF4" : "#F9FAFB", color: form.proyectoId ? "#15803D" : "#D1D5DB", border: `1px solid ${form.proyectoId ? "#BBF7D0" : "#E5E7EB"}`, fontSize: 12, fontWeight: 600, cursor: form.proyectoId ? "pointer" : "not-allowed" }}>
            {exportando ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Download size={14} />}
            Descargar PDF de prueba
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Tarjeta de certificado (fallback de descarga con nuevo diseño) ──
const CertificadoCard = ({
  certificado,
  index,
  onEnviar,
  onEliminar,
  enviando,
  eliminando,
  errorEnvio,
  errorEliminar,
  pendientesCalificacion,
  onAbrirModalCalificacion,
}) => {
  const [descargando, setDescargando] = useState(false);
  const yaEnviado = !!certificado.fechaEnvio;
  const puedeEliminar = !yaEnviado;

  const handleDescargar = async () => {
    if (certificado.urlCertificado) {
      window.open(certificado.urlCertificado, "_blank");
    } else {
      setDescargando(true);
      try {
        const html2pdf = (await import("html2pdf.js")).default;
        const contenedor = document.createElement("div");
        contenedor.style.cssText = "position:fixed;left:-9999px;top:0;width:1200px;background:#fff;z-index:-1;";
        document.body.appendChild(contenedor);
        const { createRoot } = await import("react-dom/client");
        const root = createRoot(contenedor);
        const datos = {
          nombreEstudiante: certificado.estudianteNombre,
          nombreProyecto: certificado.proyectoTitulo,
          nombreMype: certificado.nombreMype,
          gerente: "",
          firmaUrl: "",
          rucMype: "",
        };
        root.render(<PlantillaCertificado datos={datos} />);
        await new Promise((r) => setTimeout(r, 600));
        const el = contenedor.querySelector("#certificado-preview");
        if (el) {
          await html2pdf()
            .set({
              margin: 0,
              filename: `certificado-${certificado.estudianteNombre}.pdf`,
              html2canvas: { scale: 2, useCORS: true, letterRendering: true },
              jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
            })
            .from(el)
            .save();
        }
        root.unmount();
        document.body.removeChild(contenedor);
      } catch (e) {
        console.error(e);
      } finally {
        setDescargando(false);
      }
    }
  };

  const estaPendiente = pendientesCalificacion.some(
    (p) => p.proyectoId === certificado.proyectoId && p.calificadoId === certificado.estudianteId
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: "1.5rem",
        padding: 20,
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.08)";
        e.currentTarget.style.borderColor = "#BFDBFE";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#E5E7EB";
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 60,
          height: 60,
          background: "linear-gradient(135deg,transparent 50%,rgba(27,111,232,0.05) 50%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "1rem",
            background: "linear-gradient(135deg,#1B6FE8,#06B6D4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Award size={24} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0F1F3D", margin: 0, lineHeight: 1.3 }}>{certificado.tituloCertificado}</h3>
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                background: yaEnviado ? "#F0FDF4" : "#FEF3C7",
                color: yaEnviado ? "#059669" : "#D97706",
                border: `1px solid ${yaEnviado ? "#BBF7D0" : "#FDE68A"}`,
                padding: "2px 8px",
                borderRadius: 10,
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              {yaEnviado ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
              {yaEnviado ? "Enviado" : "No enviado"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: 4 }}>
              <User size={11} color="#6B7280" /> {certificado.estudianteNombre}
            </span>
            <span style={{ color: "#D1D5DB" }}>·</span>
            <span style={{ fontSize: 10, color: "#6B7280", display: "flex", alignItems: "center", gap: 3 }}>
              <Calendar size={11} /> {new Date(certificado.fechaEmision).toLocaleDateString("es-PE")}
            </span>
          </div>
          <div
            style={{
              background: "#F8FAFC",
              borderRadius: "0.75rem",
              padding: "5px 10px",
              fontSize: 10,
              color: "#64748B",
              fontFamily: "monospace",
              border: "1px solid #E2E8F0",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <ShieldCheck size={11} color="#1B6FE8" />
            {certificado.codigo || `CERT-${new Date().getFullYear()}-${String(certificado.id).padStart(5, "0")}`}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
        <button
          onClick={handleDescargar}
          disabled={descargando}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: "0.75rem",
            fontSize: 11,
            fontWeight: 700,
            cursor: descargando ? "not-allowed" : "pointer",
            border: "1px solid rgba(27,111,232,0.15)",
            background: descargando ? "#F3F4F6" : "rgba(27,111,232,0.06)",
            color: descargando ? "#9CA3AF" : "#1B6FE8",
            transition: "all 0.2s",
          }}
        >
          {descargando ? <><Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> Generando...</> : <><Download size={12} /> Descargar PDF</>}
        </button>

        <button
          onClick={() => {
            if (yaEnviado) return;
            if (estaPendiente) {
              onAbrirModalCalificacion({
                proyectoId: certificado.proyectoId,
                calificadoId: certificado.estudianteId,
                calificadoNombre: certificado.estudianteNombre,
                proyectoTitulo: certificado.proyectoTitulo,
                onSuccess: () => onEnviar(certificado.id),
              });
            } else {
              onEnviar(certificado.id);
            }
          }}
          disabled={enviando || yaEnviado}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: "0.75rem",
            fontSize: 11,
            fontWeight: 700,
            cursor: enviando || yaEnviado ? "not-allowed" : "pointer",
            border: "none",
            transition: "all 0.2s",
            background: yaEnviado ? "#F0FDF4" : enviando ? "#F3F4F6" : "linear-gradient(135deg,#059669,#047857)",
            color: yaEnviado ? "#15803D" : enviando ? "#9CA3AF" : "#fff",
            opacity: enviando ? 0.7 : 1,
          }}
        >
          {enviando ? <><Loader2 size={12} className="animate-spin" /> Enviando...</> : yaEnviado ? <><CheckCircle2 size={12} /> Enviado</> : <><Send size={12} /> Enviar</>}
        </button>

        {puedeEliminar && (
          <button
            onClick={() => {
              if (window.confirm("¿Estás seguro de que deseas eliminar este certificado? Esta acción no se puede deshacer.")) {
                onEliminar(certificado.id);
              }
            }}
            disabled={eliminando}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: "0.75rem",
              fontSize: 11,
              fontWeight: 700,
              cursor: eliminando ? "not-allowed" : "pointer",
              border: "1px solid rgba(220,38,38,0.2)",
              background: "rgba(220,38,38,0.06)",
              color: "#DC2626",
            }}
          >
            {eliminando ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
            Eliminar
          </button>
        )}
      </div>

      {errorEnvio && <p style={{ color: "#DC2626", fontSize: 11, marginTop: 6 }}>{errorEnvio}</p>}
      {errorEliminar && <p style={{ color: "#DC2626", fontSize: 11, marginTop: 6 }}>{errorEliminar}</p>}
    </motion.div>
  );
};

// ── Página principal (actualizada) ──
export function CertificadosPage() {
  const { certificados, isLoading } = useCertificadosEmitidos();
  const { pendientes: pendientesCalificacion } = useCalificacionesPendientes();
  const [modalCalificacion, setModalCalificacion] = useState({ open: false, data: null });
  const { proyectos } = useMisProyectos();
  const { perfil } = useMiPerfilMype();
  const { user } = useAuthStore();
  const [modalAbierto, setModalAbierto] = useState(false);
  const { enviar, loading: enviandoMap, errorMap } = useEnviarCertificado();
  const { eliminar, isLoading: eliminandoMap, error: errorEliminarGeneral } = useEliminarCertificado();

  const proyectosCompletados = proyectos.filter((p) => p.estado === "COMPLETADO");
  const totalEmitidos = certificados?.length || 0;
  const estudiantesCert = new Set(certificados?.map((c) => c.estudianteNombre) ?? []).size;
  const proyectosConCert = new Set(certificados?.map((c) => c.proyectoTitulo) ?? []).size;

  return (
    <MypeLayout titulo="Certificados">
      {modalAbierto && (
        <ModalEmitirCertificado
          proyectosCompletados={proyectosCompletados}
          mypeNombre={perfil?.nombreComercial ?? ""}
          gerenteNombre={perfil?.nombreRepresentante ?? user?.nombre ?? ""}
          rucMype={perfil?.ruc ?? ""}
          onClose={() => setModalAbierto(false)}
        />
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <CertificadosHeroBanner totalEmitidos={totalEmitidos} proyectosCompletadosCount={proyectosCompletados.length} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20, marginBottom: 32 }}>
          {[
            { delay: 0.05, label: "Certificados Emitidos", value: totalEmitidos, sub: "Documentos verificados", Icon: Award, bg: "#EFF6FF", color: "#1B6FE8" },
            { delay: 0.1, label: "Estudiantes Certificados", value: estudiantesCert, sub: "Talento reconocido", Icon: Users, bg: "#FFFBEB", color: "#D97706" },
            { delay: 0.15, label: "Proyectos Certificados", value: proyectosConCert, sub: "Proyectos finalizados", Icon: TrendingUp, bg: "#F0FDF4", color: "#059669" },
          ].map(({ delay, label, value, sub, Icon, bg, color }) => (
            <motion.div key={label} {...fadeUp(delay)} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "1.5rem", padding: 24, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: "1.2rem", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon size={26} color={color} /></div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#0F1F3D", lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>{sub}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp(0.2)} style={{ marginBottom: 32 }}>
          <button onClick={() => setModalAbierto(true)} disabled={proyectosCompletados.length === 0} style={{ fontFamily: FONT, display: "flex", alignItems: "center", gap: 10, padding: "14px 28px", borderRadius: "1rem", border: "none", background: proyectosCompletados.length === 0 ? "#E5E7EB" : "linear-gradient(135deg,#1B6FE8,#0E54C4)", color: proyectosCompletados.length === 0 ? "#9CA3AF" : "#fff", fontSize: 14, fontWeight: 700, cursor: proyectosCompletados.length === 0 ? "not-allowed" : "pointer", boxShadow: proyectosCompletados.length > 0 ? "0 4px 12px rgba(27,111,232,0.2)" : "none" }}>
            <Plus size={18} /> Emitir nuevo certificado
          </button>
          {proyectosCompletados.length === 0 && <p style={{ fontFamily: FONT, fontSize: 12, color: "#9CA3AF", marginTop: 8 }}>Debes marcar al menos un proyecto como COMPLETADO para emitir certificados.</p>}
        </motion.div>

        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{[1, 2, 3].map((i) => <div key={i} style={{ height: 120, borderRadius: "1.5rem", background: "#E5E7EB", animation: "pulse 1.5s ease-in-out infinite" }} />)}</div>
        ) : totalEmitidos === 0 ? (
          <motion.div {...fadeUp(0.25)} style={{ textAlign: "center", padding: "80px 40px", border: "1px dashed #E5E7EB", borderRadius: "2rem", background: "#fff" }}>
            <div style={{ width: 80, height: 80, borderRadius: "2rem", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}><Award size={40} color="#D1D5DB" /></div>
            <h3 style={{ fontFamily: FONT, fontSize: 18, fontWeight: 800, color: "#0F1F3D", marginBottom: 8 }}>Aún no has emitido certificados</h3>
            <p style={{ fontFamily: FONT, fontSize: 13, color: "#9CA3AF", maxWidth: 400, margin: "0 auto" }}>Cuando un proyecto esté completado, podrás emitir certificados digitales verificables para tus estudiantes.</p>
          </motion.div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {certificados.map((cert, index) => (
              <CertificadoCard
                key={cert.id}
                certificado={cert}
                index={index}
                onEnviar={enviar}
                onEliminar={eliminar}
                enviando={enviandoMap[cert.id] ?? false}
                eliminando={eliminandoMap ?? false}
                errorEnvio={errorMap[cert.id] ?? null}
                errorEliminar={errorEliminarGeneral ? "Error al eliminar el certificado" : null}
                pendientesCalificacion={pendientesCalificacion}
                onAbrirModalCalificacion={(data) => setModalCalificacion({ open: true, data })}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} } @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>

      {modalCalificacion.open && (
        <RateUserModal
          open={modalCalificacion.open}
          pendiente={modalCalificacion.data}
          onClose={() => setModalCalificacion({ open: false, data: null })}
          onSuccess={() => {
            modalCalificacion.data?.onSuccess?.();
            setModalCalificacion({ open: false, data: null });
          }}
        />
      )}
    </MypeLayout>
  );
}