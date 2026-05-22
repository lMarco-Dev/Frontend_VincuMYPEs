import { useState, useRef, useEffect } from "react";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import {
  useCertificadosEmitidos,
  useEmitirCertificado,
} from "@/features/certificados/useCertificadosMype";
import { useMisProyectos } from "@/features/proyecto-list-mype/useMisProyectos";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
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
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Search,
  Building2,
  Users,
} from "lucide-react";

const FONT = "'Angro Std', 'Outfit', sans-serif";

/* ─── Animaciones ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ═══════════════════════════════════════════════
   HERO BANNER ANIMADO PARA CERTIFICADOS MYPE
═══════════════════════════════════════════════ */
const CertificadosHeroBanner = ({
  totalEmitidos,
  proyectosCompletadosCount,
}) => {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
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
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
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
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
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
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "2rem",
        background:
          "linear-gradient(135deg, #0A1628 0%, #0F2A4A 60%, #1E3A5F 100%)",
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

      {/* Luces Ambientales */}
      <div
        style={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "radial-gradient(circle, #F59E0B, transparent 70%)",
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
          background: "radial-gradient(circle, #06B6D4, transparent 70%)",
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
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 20,
              padding: "6px 14px",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#fff",
              marginBottom: 16,
              backdropFilter: "blur(8px)",
            }}
          >
            <Award size={12} style={{ color: "#F59E0B" }} /> Certificados MYPE
          </motion.div>
          <h1
            style={{
              fontSize: "clamp(26px, 3vw, 36px)",
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
              fontWeight: 400,
            }}
          >
            Emite certificados digitales con firma verificable para los
            estudiantes que completaron exitosamente tus proyectos.
          </p>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <div
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
                color: "#06B6D4",
                lineHeight: 1,
              }}
            >
              {totalEmitidos}
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
              Certificados Emitidos
            </div>
          </div>
          <div
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
                color: "#F59E0B",
                lineHeight: 1,
              }}
            >
              {proyectosCompletadosCount}
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
              Proyectos Completados
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   TARJETA DE MÉTRICA BENTO
═══════════════════════════════════════════════ */
const MetricCard = ({
  label,
  value,
  sub,
  color,
  bg,
  border,
  icon: Icon,
  delay,
}) => (
  <motion.div
    {...fadeUp(delay)}
    style={{
      background: "#fff",
      border: "1px solid #E5E7EB",
      borderRadius: "1.5rem",
      padding: 24,
      display: "flex",
      alignItems: "center",
      gap: 16,
      transition: "all 0.3s ease",
      cursor: "default",
      position: "relative",
      overflow: "hidden",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.06)";
      e.currentTarget.style.borderColor = border;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.borderColor = "#E5E7EB";
    }}
  >
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: "1.2rem",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon size={26} color={color} />
    </div>
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "#9CA3AF",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: "#0F1F3D",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#6B7280",
            marginTop: 4,
          }}
        >
          {sub}
        </div>
      )}
    </div>
    <div
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 80,
        height: 80,
        background: bg,
        borderRadius: "50%",
        filter: "blur(30px)",
        opacity: 0.5,
        pointerEvents: "none",
      }}
    />
  </motion.div>
);

/* ═══════════════════════════════════════════════
   TARJETA DE CERTIFICADO EMITIDO
═══════════════════════════════════════════════ */
const CertificadoCard = ({ certificado, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: "1.5rem",
        padding: 20,
        transition: "all 0.3s ease",
        cursor: "pointer",
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
      {/* Decorative corner */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 60,
          height: 60,
          background:
            "linear-gradient(135deg, transparent 50%, rgba(27,111,232,0.05) 50%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "1rem",
            background: "linear-gradient(135deg, #1B6FE8, #06B6D4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Award size={24} color="#fff" />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 4,
            }}
          >
            <h3
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#0F1F3D",
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {certificado.tituloCertificado}
            </h3>
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                background: "#F0FDF4",
                color: "#059669",
                border: "1px solid #BBF7D0",
                padding: "2px 8px",
                borderRadius: 10,
              }}
            >
              <CheckCircle2
                size={10}
                style={{ display: "inline", marginRight: 3 }}
              />
              Verificado
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 6,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: "#6B7280",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Calendar size={11} />
              {new Date(certificado.fechaEmision).toLocaleDateString("es-PE")}
            </span>
            <span
              style={{
                fontSize: 10,
                color: "#6B7280",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Building2 size={11} />
              Proyecto #{certificado.proyectoId}
            </span>
          </div>

          <div
            style={{
              marginTop: 12,
              background: "#F8FAFC",
              borderRadius: "0.75rem",
              padding: "6px 10px",
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
            Código: CERT-{new Date().getFullYear()}-
            {String(certificado.id).padStart(5, "0")}
          </div>
        </div>
      </div>

      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}
      >
        {certificado.urlCertificado && (
          <a
            href={certificado.urlCertificado}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: "0.75rem",
              fontSize: 11,
              fontWeight: 700,
              color: "#1B6FE8",
              background: "rgba(27,111,232,0.06)",
              border: "1px solid rgba(27,111,232,0.15)",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(27,111,232,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(27,111,232,0.06)";
            }}
          >
            <ExternalLink size={12} /> Ver PDF
          </a>
        )}
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   MODAL PARA EMITIR CERTIFICADO (REDISEÑADO)
═══════════════════════════════════════════════ */
function ModalEmitirCertificado({ proyectosCompletados, mypeNombre, onClose }) {
  const { emitir, isLoading, isSuccess, error } = useEmitirCertificado();
  const [preview, setPreview] = useState(false);
  const [exportando, setExportando] = useState(false);

  const [form, setForm] = useState({
    proyectoId: "",
    proyectoTitulo: "",
    estudianteId: "",
    estudianteNombre: "",
    gerente: "",
    descripcion: "",
    firmaUrl: "",
  });

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleProyectoChange = (e) => {
    const p = proyectosCompletados.find((p) => p.id === Number(e.target.value));
    if (p) {
      handleChange("proyectoId", p.id);
      handleChange("proyectoTitulo", p.titulo);
    }
  };

  const handleFirma = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => handleChange("firmaUrl", ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleExportarPDF = async () => {
    setExportando(true);
    const html2pdf = (await import("html2pdf.js")).default;
    const elemento = document.getElementById("certificado-preview");
    if (elemento) {
      await html2pdf()
        .set({
          margin: 10,
          filename: `certificado-${form.estudianteNombre || "estudiante"}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
        })
        .from(elemento)
        .save();
    }
    setExportando(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emitir({
      proyectoId: Number(form.proyectoId),
      estudianteId: Number(form.estudianteId),
      tituloCertificado: `Certificado de Participación — ${form.proyectoTitulo}`,
      descripcionCertificado: form.descripcion,
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
          <h3
            style={{
              fontFamily: FONT,
              fontSize: 20,
              fontWeight: 800,
              color: "#0F1F3D",
              margin: "0 0 8px",
            }}
          >
            ¡Certificado emitido!
          </h3>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 13,
              color: "#6B7280",
              margin: "0 0 8px",
            }}
          >
            El certificado fue registrado en el sistema.
          </p>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 12,
              color: "#9CA3AF",
              margin: "0 0 24px",
            }}
          >
            Descárgalo ahora en PDF para enviarlo al estudiante:
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
                background: "linear-gradient(135deg, #1B6FE8, #0E54C4)",
                color: "#fff",
                border: "none",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(27,111,232,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {exportando ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              Descargar PDF
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
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F9FAFB";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
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
        overflow: "auto",
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
        {/* Header con gradiente */}
        <div
          style={{
            padding: "20px 24px",
            background: "linear-gradient(135deg, #F8FAFC, #fff)",
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
                background: "linear-gradient(135deg, #1B6FE8, #06B6D4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Award size={22} color="#fff" />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: FONT,
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#0F1F3D",
                  margin: 0,
                }}
              >
                Emitir certificado
              </h2>
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: 12,
                  color: "#6B7280",
                  margin: "2px 0 0",
                }}
              >
                Completa los datos y genera un PDF verificable
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
                transition: "all 0.2s",
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
                borderRadius: "0.5rem",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#F3F4F6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {/* Formulario */}
            <form
              onSubmit={handleSubmit}
              style={{
                flex: preview ? 1 : 1,
                minWidth: preview ? 300 : "100%",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div>
                <label style={labelSt}>
                  <Briefcase size={12} /> Proyecto completado
                </label>
                <select
                  required
                  value={form.proyectoId}
                  onChange={handleProyectoChange}
                  style={inputSt}
                  onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                >
                  <option value="">Selecciona un proyecto...</option>
                  {proyectosCompletados.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.titulo}
                    </option>
                  ))}
                </select>
                {proyectosCompletados.length === 0 && (
                  <p
                    style={{
                      fontFamily: FONT,
                      fontSize: 11,
                      color: "#F97316",
                      margin: "6px 0 0",
                    }}
                  >
                    ⚠ Solo proyectos en estado COMPLETADO
                  </p>
                )}
              </div>

              <div>
                <label style={labelSt}>
                  <User size={12} /> Nombre del estudiante
                </label>
                <input
                  required
                  placeholder="Ej: Marco Antonio Chuquilín Pérez"
                  value={form.estudianteNombre}
                  onChange={(e) =>
                    handleChange("estudianteNombre", e.target.value)
                  }
                  style={inputSt}
                  onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>

              <div>
                <label style={labelSt}>
                  <User size={12} /> ID del estudiante
                </label>
                <input
                  required
                  type="number"
                  min={1}
                  placeholder="ID del estudiante en el sistema"
                  value={form.estudianteId}
                  onChange={(e) => handleChange("estudianteId", e.target.value)}
                  style={inputSt}
                  onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>

              <div>
                <label style={labelSt}>
                  <User size={12} /> Nombre del gerente
                </label>
                <input
                  required
                  placeholder="Ej: Juan Carlos Rojas Mendoza"
                  value={form.gerente}
                  onChange={(e) => handleChange("gerente", e.target.value)}
                  style={inputSt}
                  onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>

              <div>
                <label style={labelSt}>
                  <Calendar size={12} /> Descripción del logro
                </label>
                <textarea
                  rows={3}
                  placeholder="Ej: Proyecto finalizado el 30 de mayo de 2026..."
                  value={form.descripcion}
                  onChange={(e) => handleChange("descripcion", e.target.value)}
                  style={{ ...inputSt, resize: "vertical" }}
                  onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>

              {/* Subida de firma */}
              <div>
                <label style={labelSt}>
                  <FileText size={12} /> Firma del gerente (PNG/JPG)
                </label>
                <div
                  style={{
                    border: "1.5px dashed #E5E7EB",
                    borderRadius: 12,
                    padding: "16px 20px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: "#F9FAFB",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "#1B6FE8")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "#E5E7EB")
                  }
                  onClick={() => document.getElementById("firma-input").click()}
                >
                  {form.firmaUrl ? (
                    <img
                      src={form.firmaUrl}
                      alt="firma"
                      style={{
                        height: 48,
                        objectFit: "contain",
                        margin: "0 auto",
                      }}
                    />
                  ) : (
                    <>
                      <FileText
                        size={24}
                        color="#D1D5DB"
                        style={{ marginBottom: 8 }}
                      />
                      <p
                        style={{
                          fontFamily: FONT,
                          fontSize: 12,
                          color: "#9CA3AF",
                          margin: 0,
                        }}
                      >
                        Clic para cargar tu firma
                      </p>
                      <p
                        style={{
                          fontFamily: FONT,
                          fontSize: 10,
                          color: "#D1D5DB",
                          margin: "4px 0 0",
                        }}
                      >
                        PNG o JPG con fondo transparente
                      </p>
                    </>
                  )}
                  <input
                    id="firma-input"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFirma}
                  />
                </div>
              </div>

              {error && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#FEF2F2",
                    border: "1px solid #FECACA",
                    borderRadius: 10,
                    padding: "10px 14px",
                  }}
                >
                  <AlertTriangle size={14} color="#DC2626" />
                  <span
                    style={{
                      fontFamily: FONT,
                      fontSize: 12,
                      color: "#DC2626",
                      fontWeight: 500,
                    }}
                  >
                    {error}
                  </span>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "flex-end",
                  marginTop: 8,
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    fontFamily: FONT,
                    padding: "10px 20px",
                    borderRadius: 10,
                    background: "transparent",
                    border: "1px solid #E5E7EB",
                    color: "#6B7280",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#F9FAFB")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !form.proyectoId ||
                    !form.estudianteId ||
                    !form.estudianteNombre ||
                    !form.gerente
                  }
                  style={{
                    fontFamily: FONT,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 24px",
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #1B6FE8, #0E54C4)",
                    color: "#fff",
                    border: "none",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.7 : 1,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 14px rgba(27,111,232,0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Emitiendo...
                    </>
                  ) : (
                    <>
                      <Award size={14} /> Emitir certificado
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Preview del certificado */}
            {preview && (
              <div style={{ flex: 1.2, minWidth: 320 }}>
                <div
                  style={{
                    background: "#F8FAFC",
                    borderRadius: "1rem",
                    padding: "16px 0",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <p
                    style={{
                      fontFamily: FONT,
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: 12,
                      paddingLeft: 16,
                    }}
                  >
                    Vista previa del certificado
                  </p>
                  <div
                    style={{
                      maxHeight: "calc(90vh - 300px)",
                      overflowY: "auto",
                      padding: "0 16px",
                    }}
                  >
                    <PlantillaCertificado datos={{ ...form, mypeNombre }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer con botón de descarga */}
        <div
          style={{
            padding: "16px 24px",
            background: "#F8FAFC",
            borderTop: "1px solid #E5E7EB",
            display: "flex",
            justifyContent: "flex-end",
            flexShrink: 0,
          }}
        >
          <button
            onClick={handleExportarPDF}
            disabled={exportando || !form.proyectoId}
            style={{
              fontFamily: FONT,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              borderRadius: 10,
              background: form.proyectoId ? "#F0FDF4" : "#F9FAFB",
              color: form.proyectoId ? "#15803D" : "#D1D5DB",
              border: `1px solid ${form.proyectoId ? "#BBF7D0" : "#E5E7EB"}`,
              fontSize: 12,
              fontWeight: 600,
              cursor: form.proyectoId ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (form.proyectoId) {
                e.currentTarget.style.background = "#DCFCE7";
              }
            }}
            onMouseLeave={(e) => {
              if (form.proyectoId) {
                e.currentTarget.style.background = "#F0FDF4";
              }
            }}
          >
            {exportando ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Download size={14} />
            )}
            Descargar PDF de prueba
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Plantilla visual del certificado (mantenida igual pero con pequeño ajuste) ──
function PlantillaCertificado({ datos }) {
  const hoy = new Date().toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const certificadoCodigo = datos.id
    ? String(datos.id).padStart(5, "0")
    : datos.proyectoId
      ? String(datos.proyectoId).padStart(5, "0")
      : "00000";

  return (
    <div
      id="certificado-preview"
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 12,
        padding: "32px 40px",
        maxWidth: 680,
        position: "relative",
        fontFamily: "'Outfit', Georgia, serif",
        margin: "0 auto",
        boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
      }}
    >
      {/* Marco decorativo */}
      <div
        style={{
          position: "absolute",
          inset: 8,
          border: "2px solid #1B6FE8",
          borderRadius: 8,
          opacity: 0.12,
          pointerEvents: "none",
        }}
      />
      {[
        {
          top: 14,
          left: 14,
          borderTop: "2px solid #1B6FE8",
          borderLeft: "2px solid #1B6FE8",
          borderRadius: "4px 0 0 0",
        },
        {
          top: 14,
          right: 14,
          borderTop: "2px solid #1B6FE8",
          borderRight: "2px solid #1B6FE8",
          borderRadius: "0 4px 0 0",
        },
        {
          bottom: 14,
          left: 14,
          borderBottom: "2px solid #1B6FE8",
          borderLeft: "2px solid #1B6FE8",
          borderRadius: "0 0 0 4px",
        },
        {
          bottom: 14,
          right: 14,
          borderBottom: "2px solid #1B6FE8",
          borderRight: "2px solid #1B6FE8",
          borderRadius: "0 0 4px 0",
        },
      ].map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 24,
            height: 24,
            opacity: 0.4,
            ...s,
          }}
        />
      ))}

      {/* Header con logo */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
            <path d="M20 15 L50 85 L65 85 L35 15 Z" fill="#1B6FE8" />
            <path
              d="M80 15 L50 85 L35 85 L65 15 Z"
              fill="#06B6D4"
              opacity="0.9"
            />
            <circle cx="50" cy="85" r="8" fill="#F97316" />
          </svg>
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#1E3A5F",
              letterSpacing: -0.5,
            }}
          >
            Vincu<span style={{ color: "#06B6D4" }}>MYPEs</span>
          </span>
        </div>
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg,transparent,#1B6FE8,transparent)",
            width: "70%",
            margin: "0 auto 14px",
          }}
        />
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#9CA3AF",
            textTransform: "uppercase",
            letterSpacing: 2,
            marginBottom: 4,
          }}
        >
          Certificado de participación
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#111827",
            letterSpacing: -0.5,
            marginBottom: 2,
          }}
        >
          VincuMYPEs
        </div>
        <div style={{ fontSize: 12, color: "#6B7280" }}>
          Plataforma de vinculación académico-empresarial · Cajamarca, Perú
        </div>
      </div>

      {/* Cuerpo */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 6 }}>
          Este certificado se otorga a
        </p>
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#1B6FE8",
            fontStyle: "italic",
            borderBottom: "2px solid #E5E7EB",
            paddingBottom: 6,
            display: "inline-block",
            marginBottom: 10,
          }}
        >
          {datos.estudianteNombre || "Nombre del Estudiante"}
        </div>
        <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 6 }}>
          por su participación y culminación exitosa del proyecto
        </p>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#111827",
            marginBottom: 8,
          }}
        >
          {datos.proyectoTitulo || "Título del Proyecto"}
        </div>
        <p
          style={{
            fontSize: 12,
            color: "#9CA3AF",
            maxWidth: 480,
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          {datos.descripcion ||
            "El estudiante demostró compromiso y habilidades técnicas durante el desarrollo del proyecto, entregando los resultados acordados de manera satisfactoria."}
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingTop: 18,
          borderTop: "1px solid #F3F4F6",
        }}
      >
        {/* Firma */}
        <div style={{ textAlign: "center", flex: 1 }}>
          {datos.firmaUrl ? (
            <img
              src={datos.firmaUrl}
              alt="Firma"
              style={{ height: 36, marginBottom: 4, objectFit: "contain" }}
            />
          ) : (
            <div
              style={{
                height: 24,
                marginBottom: 4,
                fontSize: 10,
                color: "#9CA3AF",
                fontStyle: "italic",
              }}
            >
              firma digital
            </div>
          )}
          <div
            style={{
              width: 100,
              height: 1,
              background: "#D1D5DB",
              margin: "0 auto 6px",
            }}
          />
          <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
            {datos.gerente || "Nombre del Gerente"}
          </div>
          <div style={{ fontSize: 10, color: "#9CA3AF" }}>
            {datos.mypeNombre || "Nombre de la Empresa"}
          </div>
        </div>

        {/* Sello central */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              border: "2px solid #1B6FE8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Award size={22} color="#1B6FE8" />
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 9,
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 1,
              }}
            >
              Fecha de emisión
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
              {hoy}
            </div>
          </div>
        </div>

        {/* Código QR mock */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              background: "#F3F4F6",
              border: "1px solid #E5E7EB",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileText size={18} color="#D1D5DB" />
          </div>
          <div style={{ fontSize: 10, color: "#9CA3AF" }}>
            Verificación digital
          </div>
          <div style={{ fontSize: 8, color: "#D1D5DB" }}>
            CERT-{new Date().getFullYear()}-{certificadoCodigo}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Página principal ─────────────────────────────────────────
export function CertificadosPage() {
  const { certificados, isLoading } = useCertificadosEmitidos();
  const { proyectos } = useMisProyectos();
  const { user } = useAuthStore();
  const [modalAbierto, setModalAbierto] = useState(false);

  const proyectosCompletados = proyectos.filter(
    (p) => p.estado === "COMPLETADO",
  );

  const totalEmitidos = certificados?.length || 0;
  const proyectosCompletadosCount = proyectosCompletados.length;

  return (
    <MypeLayout titulo="Certificados">
      {modalAbierto && (
        <ModalEmitirCertificado
          proyectosCompletados={proyectosCompletados}
          mypeNombre={user?.nombre ?? ""}
          onClose={() => setModalAbierto(false)}
        />
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Hero Banner */}
        <CertificadosHeroBanner
          totalEmitidos={totalEmitidos}
          proyectosCompletadosCount={proyectosCompletadosCount}
        />

        {/* Métricas Bento */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
            marginBottom: 32,
          }}
        >
          <MetricCard
            delay={0.05}
            label="Certificados Emitidos"
            value={totalEmitidos}
            sub="Documentos verificados"
            icon={Award}
            bg="#EFF6FF"
            color="#1B6FE8"
            border="#BFDBFE"
          />
          <MetricCard
            delay={0.1}
            label="Proyectos Completados"
            value={proyectosCompletadosCount}
            sub="Elegibles para certificar"
            icon={TrendingUp}
            bg="#F0FDF4"
            color="#059669"
            border="#BBF7D0"
          />
          <MetricCard
            delay={0.15}
            label="Estudiantes Certificados"
            value={certificados?.length || 0}
            sub="Talento reconocido"
            icon={Users}
            bg="#FFFBEB"
            color="#D97706"
            border="#FDE68A"
          />
        </div>

        {/* Botón de acción */}
        <motion.div {...fadeUp(0.2)} style={{ marginBottom: 32 }}>
          <button
            onClick={() => setModalAbierto(true)}
            disabled={proyectosCompletadosCount === 0}
            style={{
              fontFamily: FONT,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 28px",
              borderRadius: "1rem",
              border: "none",
              background:
                proyectosCompletadosCount === 0
                  ? "#E5E7EB"
                  : "linear-gradient(135deg, #1B6FE8, #0E54C4)",
              color: proyectosCompletadosCount === 0 ? "#9CA3AF" : "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor:
                proyectosCompletadosCount === 0 ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow:
                proyectosCompletadosCount > 0
                  ? "0 4px 12px rgba(27,111,232,0.2)"
                  : "none",
            }}
            onMouseEnter={(e) => {
              if (proyectosCompletadosCount > 0) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(27,111,232,0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (proyectosCompletadosCount > 0) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(27,111,232,0.2)";
              }
            }}
          >
            <Plus size={18} /> Emitir nuevo certificado
          </button>
        </motion.div>

        {/* Lista de certificados */}
        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: 120,
                  borderRadius: "1.5rem",
                  background: "#E5E7EB",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        ) : totalEmitidos === 0 ? (
          <motion.div
            {...fadeUp(0.25)}
            style={{
              textAlign: "center",
              padding: "80px 40px",
              border: "1px dashed #E5E7EB",
              borderRadius: "2rem",
              background: "#fff",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "2rem",
                background: "#F3F4F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <Award size={40} color="#D1D5DB" />
            </div>
            <h3
              style={{
                fontFamily: FONT,
                fontSize: 18,
                fontWeight: 800,
                color: "#0F1F3D",
                marginBottom: 8,
              }}
            >
              Aún no has emitido certificados
            </h3>
            <p
              style={{
                fontFamily: FONT,
                fontSize: 13,
                color: "#9CA3AF",
                maxWidth: 400,
                margin: "0 auto",
              }}
            >
              Cuando un proyecto esté completado, podrás emitir certificados
              digitales verificables para los estudiantes.
            </p>
          </motion.div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {certificados.map((cert, index) => (
              <CertificadoCard key={cert.id} certificado={cert} index={index} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </MypeLayout>
  );
}
