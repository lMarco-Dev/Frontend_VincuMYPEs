import { useState, useRef, useEffect } from "react";
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
import { motion } from "framer-motion";
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
        [certificadoId]: "Error al enviar. Intenta de nuevo.",
      }));
    } finally {
      setLoading((p) => ({ ...p, [certificadoId]: false }));
    }
  };

  return { enviar, loading, errorMap };
}

// ── Hero Banner con logo Linkuy ─────────────────────────────────
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

// ── Plantilla visual de preview ─────────────────────────────────
function PlantillaCertificado({ datos, isExport = false }) {
  const hoy = new Date().toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const codigoCert =
    datos.codigo ||
    `CERT-${new Date().getFullYear()}-${String(datos.proyectoId || "0").padStart(5, "0")}`;

  return (
    <div
      id="certificado-preview"
      style={{
        // Si es para exportar, forzamos proporciones y tamaños de un documento A4 real
        width: isExport ? "297mm" : "100%",
        height: isExport ? "210mm" : "auto",
        aspectRatio: isExport ? "unset" : "297/210",
        background: "#fff",
        border: isExport ? "none" : "1px solid #E5E7EB",
        borderRadius: isExport ? 0 : 12,
        padding: isExport ? "12mm" : "4%",
        position: "relative",
        margin: "0 auto",
        boxSizing: "border-box",
        fontFamily: "'Outfit',Georgia,serif",
        boxShadow: isExport ? "none" : "0 4px 12px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          border: "2px solid #1B6FE8",
          borderRadius: isExport ? 16 : 12,
          width: "100%",
          height: "100%",
          position: "relative",
          padding: isExport ? "35px 50px" : "20px 30px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Esquinas decorativas */}
        {[
          {
            top: 12,
            left: 12,
            borderTop: "2px solid #1B6FE8",
            borderLeft: "2px solid #1B6FE8",
            borderRadius: "8px 0 0 0",
          },
          {
            top: 12,
            right: 12,
            borderTop: "2px solid #1B6FE8",
            borderRight: "2px solid #1B6FE8",
            borderRadius: "0 8px 0 0",
          },
          {
            bottom: 12,
            left: 12,
            borderBottom: "2px solid #1B6FE8",
            borderLeft: "2px solid #1B6FE8",
            borderRadius: "0 0 0 8px",
          },
          {
            bottom: 12,
            right: 12,
            borderBottom: "2px solid #1B6FE8",
            borderRight: "2px solid #1B6FE8",
            borderRadius: "0 0 8px 0",
          },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: isExport ? 30 : 20,
              height: isExport ? 30 : 20,
              ...s,
            }}
          />
        ))}

        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: isExport ? 28 : 20,
              fontWeight: 700,
              color: "#1E3A5F",
              marginBottom: 10,
            }}
          >
            linkuy
          </div>
          <div
            style={{
              height: 1,
              background:
                "linear-gradient(90deg,transparent,#1B6FE8,transparent)",
              width: "60%",
              margin: "0 auto 10px",
            }}
          />
          <div
            style={{
              fontSize: isExport ? 14 : 10,
              fontWeight: 700,
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            Certificado de participación
          </div>
          <div
            style={{
              fontSize: isExport ? 36 : 26,
              fontWeight: 700,
              color: "#111827",
              marginTop: 10,
            }}
          >
            linkuy
          </div>
          <div
            style={{
              fontSize: isExport ? 16 : 12,
              color: "#6B7280",
              marginTop: 5,
            }}
          >
            Plataforma de vinculación académico-empresarial · Cajamarca, Perú
          </div>
        </div>

        {/* Cuerpo (Estudiante) */}
        <div style={{ textAlign: "center", margin: "auto 0" }}>
          <div style={{ fontSize: isExport ? 16 : 13, color: "#6B7280" }}>
            Este certificado se otorga a
          </div>
          <div
            style={{
              fontSize: isExport ? 34 : 24,
              fontWeight: 700,
              color: "#1B6FE8",
              borderBottom: "2px solid #E5E7EB",
              paddingBottom: 6,
              display: "inline-block",
              margin: "15px 0",
            }}
          >
            {datos.estudianteNombre || "Nombre del Estudiante"}
          </div>
          <div style={{ fontSize: isExport ? 16 : 13, color: "#6B7280" }}>
            por su participación y culminación exitosa del proyecto
          </div>
          <div
            style={{
              fontSize: isExport ? 20 : 15,
              fontWeight: 600,
              color: "#111827",
              margin: "10px 0",
            }}
          >
            {datos.proyectoTitulo || "Título del Proyecto"}
          </div>
          <p
            style={{
              fontSize: isExport ? 15 : 12,
              color: "#9CA3AF",
              maxWidth: isExport ? "70%" : "85%",
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
            borderTop: "1px solid #F3F4F6",
            paddingTop: 20,
          }}
        >
          <div style={{ textAlign: "center", flex: 1 }}>
            {datos.firmaUrl ? (
              <img
                src={datos.firmaUrl}
                alt="Firma"
                style={{
                  height: isExport ? 50 : 36,
                  objectFit: "contain",
                  marginBottom: 5,
                }}
              />
            ) : (
              <div
                style={{
                  height: isExport ? 50 : 36,
                  color: "#9CA3AF",
                  fontStyle: "italic",
                  fontSize: 12,
                }}
              >
                firma digital
              </div>
            )}
            <div
              style={{
                width: 140,
                height: 1,
                background: "#D1D5DB",
                margin: "5px auto",
              }}
            />
            <div
              style={{
                fontSize: isExport ? 15 : 12,
                fontWeight: 600,
                color: "#374151",
              }}
            >
              {datos.gerente || "Nombre del Gerente"}
            </div>
            <div style={{ fontSize: isExport ? 12 : 10, color: "#9CA3AF" }}>
              {datos.mypeNombre || "Nombre de la Empresa"}
            </div>
          </div>

          <div style={{ flex: 1, textAlign: "center" }}>
            <div
              style={{
                fontSize: isExport ? 12 : 9,
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Fecha de emisión
            </div>
            <div
              style={{
                fontSize: isExport ? 16 : 12,
                fontWeight: 600,
                color: "#374151",
                marginTop: 5,
              }}
            >
              {hoy}
            </div>
          </div>

          <div style={{ flex: 1, textAlign: "center" }}>
            <div
              style={{
                fontSize: isExport ? 12 : 10,
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Verificación digital
            </div>
            <div
              style={{
                fontSize: isExport ? 14 : 10,
                color: "#6B7280",
                fontFamily: "monospace",
                marginTop: 5,
              }}
            >
              {codigoCert}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Modal emitir certificado ──────────────────────────────────
function ModalEmitirCertificado({
  proyectosCompletados,
  mypeNombre,
  gerenteNombre,
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
        const res = await httpClient.get(
          `/proyectos/${p.id}/postulaciones/aceptadas`,
        );
        const confirmados = (res.data || []).filter(
          (post) => post.estado === "CONFIRMADO" || post.estado === "ACEPTADO",
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

  const handleFirma = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
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
          const lum =
            0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          if (lum > 200) {
            data[i + 3] = 0;
          } else if (lum > 160) {
            data[i + 3] = Math.round(((200 - lum) / 40) * 255);
          }
        }
        ctx.putImageData(imageData, 0, 0);
        set("firmaUrl", canvas.toDataURL("image/png"));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleExportarPDF = async () => {
    setExportando(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;

      // Forzamos al contenedor temporal a medir físicamente un A4
      const contenedor = document.createElement("div");
      contenedor.style.cssText =
        "position:fixed;left:-9999px;top:0;width:297mm;height:210mm;background:#fff;z-index:-1;";
      document.body.appendChild(contenedor);

      const { createRoot } = await import("react-dom/client");
      const root = createRoot(contenedor);

      const datos = datosParaPDF || { ...form, mypeNombre };
      // Pasamos un prop 'isExport' para que sepa que debe usar medidas estáticas
      root.render(<PlantillaCertificado datos={datos} isExport={true} />);

      // Damos 800ms para asegurar que las fuentes y firmas cargaron
      await new Promise((r) => setTimeout(r, 800));

      const el = contenedor.querySelector("#certificado-preview");
      if (el) {
        await html2pdf()
          .set({
            margin: 0,
            filename: `certificado-${datos.estudianteNombre || "proyecto"}.pdf`,
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
      console.error("Error PDF:", e);
    } finally {
      setExportando(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const primerEstudiante = estudiantesConfirmados.find(
      (est) => est.estudianteId === form.estudiantesSeleccionados[0],
    );
    setDatosParaPDF({
      estudianteNombre: primerEstudiante?.estudianteNombre || "Estudiante",
      proyectoTitulo: form.proyectoTitulo,
      descripcion: form.descripcion,
      gerente: form.gerente,
      firmaUrl: form.firmaUrl,
      mypeNombre,
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
              margin: "0 0 24px",
            }}
          >
            El PDF fue generado y subido. Usa el botón "Descargar PDF" en la
            lista para abrirlo, o envíalo al estudiante directamente.
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
              {exportando ? (
                <Loader2
                  size={16}
                  style={{ animation: "spin 1s linear infinite" }}
                />
              ) : (
                <Download size={16} />
              )}
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
            <form
              onSubmit={handleSubmit}
              style={{
                flex: 1,
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
                <div style={{ position: "relative" }}>
                  <select
                    required
                    value={form.proyectoId}
                    onChange={handleProyectoChange}
                    style={{
                      ...inputSt,
                      paddingRight: 36,
                      appearance: "none",
                      cursor: "pointer",
                    }}
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
                  <ChevronDown
                    size={14}
                    color="#9CA3AF"
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
                {proyectosCompletados.length === 0 && (
                  <p
                    style={{
                      fontFamily: FONT,
                      fontSize: 11,
                      color: "#F97316",
                      margin: "6px 0 0",
                    }}
                  >
                    Solo puedes emitir certificados de proyectos COMPLETADOS
                  </p>
                )}
              </div>

              <div>
                <label style={labelSt}>
                  <User size={12} /> Estudiantes confirmados
                </label>
                {!form.proyectoId ? (
                  <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 8 }}>
                    Primero selecciona un proyecto
                  </p>
                ) : cargandoEstudiantes ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "12px 0",
                    }}
                  >
                    <Loader2
                      size={16}
                      style={{
                        animation: "spin 1s linear infinite",
                        color: "#1B6FE8",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: FONT,
                        fontSize: 12,
                        color: "#9CA3AF",
                      }}
                    >
                      Cargando estudiantes...
                    </span>
                  </div>
                ) : estudiantesConfirmados.length === 0 ? (
                  <p style={{ fontSize: 12, color: "#F97316", marginTop: 8 }}>
                    No hay estudiantes confirmados en este proyecto.
                  </p>
                ) : (
                  <div
                    style={{
                      maxHeight: 200,
                      overflowY: "auto",
                      border: "1px solid #E5E7EB",
                      borderRadius: 12,
                      padding: 12,
                      background: "#fff",
                    }}
                  >
                    {estudiantesConfirmados.map((est) => (
                      <label
                        key={est.estudianteId}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "6px 0",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={form.estudiantesSeleccionados.includes(
                            est.estudianteId,
                          )}
                          onChange={() => toggleEstudiante(est.estudianteId)}
                          style={{
                            width: 16,
                            height: 16,
                            cursor: "pointer",
                            accentColor: "#1B6FE8",
                          }}
                        />
                        <span style={{ fontSize: 13, color: "#111827" }}>
                          {est.estudianteNombre}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                {form.estudiantesSeleccionados.length > 0 && (
                  <p
                    style={{
                      fontSize: 11,
                      color: "#059669",
                      marginTop: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <CheckCircle2 size={11} />{" "}
                    {form.estudiantesSeleccionados.length} estudiante(s)
                    seleccionado(s)
                  </p>
                )}
              </div>

              <div>
                <label style={labelSt}>
                  <User size={12} /> Nombre del gerente / representante
                </label>
                <input
                  required
                  placeholder="Nombre completo del gerente"
                  value={form.gerente}
                  onChange={(e) => set("gerente", e.target.value)}
                  style={inputSt}
                  onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>

              <div>
                <label style={labelSt}>
                  <Calendar size={12} /> Descripción del logro (opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Ej: El estudiante completó el proyecto con todos los entregables aprobados..."
                  value={form.descripcion}
                  onChange={(e) => set("descripcion", e.target.value)}
                  style={{ ...inputSt, resize: "vertical" }}
                  onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>

              <div>
                <label style={labelSt}>
                  <FileText size={12} /> Firma digital del gerente (PNG/JPG)
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
                    <div>
                      <p
                        style={{
                          fontFamily: FONT,
                          fontSize: 10,
                          color: "#6B7280",
                          marginBottom: 6,
                        }}
                      >
                        Firma procesada (fondo eliminado):
                      </p>
                      <div
                        style={{
                          backgroundImage:
                            "linear-gradient(45deg,#E5E7EB 25%,transparent 25%,transparent 75%,#E5E7EB 75%),linear-gradient(45deg,#E5E7EB 25%,transparent 25%,transparent 75%,#E5E7EB 75%)",
                          backgroundSize: "12px 12px",
                          backgroundPosition: "0 0, 6px 6px",
                          backgroundColor: "#fff",
                          borderRadius: 8,
                          padding: 8,
                          display: "inline-block",
                          border: "1px solid #E5E7EB",
                        }}
                      >
                        <img
                          src={form.firmaUrl}
                          alt="Firma"
                          style={{
                            height: 60,
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          set("firmaUrl", "");
                          document.getElementById("firma-input").value = "";
                        }}
                        style={{
                          fontFamily: FONT,
                          fontSize: 11,
                          color: "#DC2626",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          marginTop: 8,
                          padding: 0,
                          display: "block",
                          margin: "8px auto 0",
                        }}
                      >
                        × Cambiar firma
                      </button>
                    </div>
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
                        Clic para cargar la firma del gerente
                      </p>
                      <p
                        style={{
                          fontFamily: FONT,
                          fontSize: 10,
                          color: "#D1D5DB",
                          margin: "4px 0 0",
                        }}
                      >
                        PNG o JPG — se eliminará el fondo automáticamente
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
                    style={{ fontFamily: FONT, fontSize: 12, color: "#DC2626" }}
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
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !form.proyectoId ||
                    form.estudiantesSeleccionados.length === 0 ||
                    !form.gerente
                  }
                  style={{
                    fontFamily: FONT,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 24px",
                    borderRadius: 10,
                    background: "linear-gradient(135deg,#1B6FE8,#0E54C4)",
                    color: "#fff",
                    border: "none",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        size={14}
                        style={{ animation: "spin 1s linear infinite" }}
                      />{" "}
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
                    Vista previa en tiempo real
                  </p>
                  <div
                    style={{
                      maxHeight: "calc(90vh - 300px)",
                      overflowY: "auto",
                      padding: "0 16px",
                    }}
                  >
                    {(() => {
                      const primerEstudiante =
                        estudiantesConfirmados.find(
                          (e) =>
                            e.estudianteId ===
                            form.estudiantesSeleccionados?.[0],
                        )?.estudianteNombre || "Estudiante(s)";
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

        <div
          style={{
            padding: "14px 24px",
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
            }}
          >
            {exportando ? (
              <Loader2
                size={14}
                style={{ animation: "spin 1s linear infinite" }}
              />
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

// ── Card de certificado emitido (CON BOTÓN ELIMINAR) ───────────
const CertificadoCard = ({
  certificado,
  index,
  onEnviar,
  onEliminar,
  enviando,
  eliminando,
  errorEnvio,
  errorEliminar,
}) => {
  const enviado = certificado.enviadoEmail === true;
  const puedeEliminar = !enviado;

  const handleDescargar = () => {
    if (certificado.urlCertificado) {
      window.open(certificado.urlCertificado, "_blank");
    }
  };

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
          background:
            "linear-gradient(135deg,transparent 50%,rgba(27,111,232,0.05) 50%)",
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
                background: enviado ? "#F0FDF4" : "#FEF3C7",
                color: enviado ? "#059669" : "#D97706",
                border: `1px solid ${enviado ? "#BBF7D0" : "#FDE68A"}`,
                padding: "2px 8px",
                borderRadius: 10,
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              {enviado ? (
                <CheckCircle2 size={10} />
              ) : (
                <AlertTriangle size={10} />
              )}
              {enviado ? "Enviado" : "No enviado"}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#374151",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <User size={11} color="#6B7280" />
              {certificado.estudianteNombre || "—"}
            </span>
            <span style={{ color: "#D1D5DB" }}>·</span>
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
              {certificado.fechaEmision
                ? new Date(certificado.fechaEmision).toLocaleDateString("es-PE")
                : "—"}
            </span>
            {certificado.proyectoTitulo && (
              <>
                <span style={{ color: "#D1D5DB" }}>·</span>
                <span style={{ fontSize: 10, color: "#9CA3AF" }}>
                  {certificado.proyectoTitulo}
                </span>
              </>
            )}
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
            {certificado.codigo ||
              `CERT-${new Date().getFullYear()}-${String(certificado.id).padStart(5, "0")}`}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          marginTop: 14,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button
          onClick={handleDescargar}
          disabled={!certificado.urlCertificado}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: "0.75rem",
            fontSize: 11,
            fontWeight: 700,
            cursor: certificado.urlCertificado ? "pointer" : "not-allowed",
            border: "1px solid rgba(27,111,232,0.15)",
            background: certificado.urlCertificado
              ? "rgba(27,111,232,0.06)"
              : "#F9FAFB",
            color: certificado.urlCertificado ? "#1B6FE8" : "#D1D5DB",
            transition: "all 0.2s",
          }}
        >
          <Download size={12} /> Descargar PDF
        </button>

        <button
          onClick={() => onEnviar(certificado.id)}
          disabled={enviando || enviado}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: "0.75rem",
            fontSize: 11,
            fontWeight: 700,
            cursor: enviando || enviado ? "not-allowed" : "pointer",
            border: "none",
            transition: "all 0.2s",
            background: enviado
              ? "#F0FDF4"
              : enviando
                ? "#F3F4F6"
                : "linear-gradient(135deg,#059669,#047857)",
            color: enviado ? "#15803D" : enviando ? "#9CA3AF" : "#fff",
            opacity: enviando ? 0.7 : 1,
          }}
        >
          {enviando ? (
            <>
              <Loader2
                size={12}
                style={{ animation: "spin 1s linear infinite" }}
              />{" "}
              Enviando...
            </>
          ) : enviado ? (
            <>
              <CheckCircle2 size={12} /> Enviado
            </>
          ) : (
            <>
              <Send size={12} /> Enviar
            </>
          )}
        </button>

        {puedeEliminar && (
          <button
            onClick={() => {
              if (
                window.confirm(
                  "¿Estás seguro de que deseas eliminar este certificado? Esta acción no se puede deshacer.",
                )
              ) {
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
              transition: "all 0.2s",
            }}
          >
            {eliminando ? (
              <Loader2
                size={12}
                style={{ animation: "spin 1s linear infinite" }}
              />
            ) : (
              <Trash2 size={12} />
            )}
            Eliminar
          </button>
        )}
      </div>

      {errorEnvio && (
        <p
          style={{
            fontFamily: FONT,
            fontSize: 11,
            color: "#DC2626",
            margin: "6px 0 0",
            textAlign: "right",
          }}
        >
          {errorEnvio}
        </p>
      )}
      {errorEliminar && (
        <p
          style={{
            fontFamily: FONT,
            fontSize: 11,
            color: "#DC2626",
            margin: "6px 0 0",
            textAlign: "right",
          }}
        >
          {errorEliminar}
        </p>
      )}
    </motion.div>
  );
};

// ── Página principal ──────────────────────────────────────────
export function CertificadosPage() {
  const { certificados, isLoading } = useCertificadosEmitidos();
  const { proyectos } = useMisProyectos();
  const { perfil } = useMiPerfilMype();
  const { user } = useAuthStore();
  const [modalAbierto, setModalAbierto] = useState(false);
  const { enviar, loading: enviandoMap, errorMap } = useEnviarCertificado();
  const {
    eliminar,
    isLoading: eliminandoMap,
    error: errorEliminarGeneral,
  } = useEliminarCertificado();

  const proyectosCompletados = proyectos.filter(
    (p) => p.estado === "COMPLETADO",
  );
  const totalEmitidos = certificados?.length || 0;

  const estudiantesCert = new Set(
    certificados?.map((c) => c.estudianteNombre) ?? [],
  ).size;
  const proyectosConCert = new Set(
    certificados?.map((c) => c.proyectoTitulo) ?? [],
  ).size;

  return (
    <MypeLayout titulo="Certificados">
      {modalAbierto && (
        <ModalEmitirCertificado
          proyectosCompletados={proyectosCompletados}
          mypeNombre={perfil?.nombreComercial ?? ""}
          gerenteNombre={perfil?.nombreRepresentante ?? user?.nombre ?? ""}
          onClose={() => setModalAbierto(false)}
        />
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <CertificadosHeroBanner
          totalEmitidos={totalEmitidos}
          proyectosCompletadosCount={proyectosCompletados.length}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: 20,
            marginBottom: 32,
          }}
        >
          {[
            {
              delay: 0.05,
              label: "Certificados Emitidos",
              value: totalEmitidos,
              sub: "Documentos verificados",
              Icon: Award,
              bg: "#EFF6FF",
              color: "#1B6FE8",
            },
            {
              delay: 0.1,
              label: "Estudiantes Certificados",
              value: estudiantesCert,
              sub: "Talento reconocido",
              Icon: Users,
              bg: "#FFFBEB",
              color: "#D97706",
            },
            {
              delay: 0.15,
              label: "Proyectos Certificados",
              value: proyectosConCert,
              sub: "Proyectos finalizados",
              Icon: TrendingUp,
              bg: "#F0FDF4",
              color: "#059669",
            },
          ].map(({ delay, label, value, sub, Icon, bg, color }) => (
            <motion.div
              key={label}
              {...fadeUp(delay)}
              style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: "1.5rem",
                padding: 24,
                display: "flex",
                alignItems: "center",
                gap: 16,
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
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                  {sub}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp(0.2)} style={{ marginBottom: 32 }}>
          <button
            onClick={() => setModalAbierto(true)}
            disabled={proyectosCompletados.length === 0}
            style={{
              fontFamily: FONT,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 28px",
              borderRadius: "1rem",
              border: "none",
              background:
                proyectosCompletados.length === 0
                  ? "#E5E7EB"
                  : "linear-gradient(135deg,#1B6FE8,#0E54C4)",
              color: proyectosCompletados.length === 0 ? "#9CA3AF" : "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor:
                proyectosCompletados.length === 0 ? "not-allowed" : "pointer",
              boxShadow:
                proyectosCompletados.length > 0
                  ? "0 4px 12px rgba(27,111,232,0.2)"
                  : "none",
            }}
          >
            <Plus size={18} /> Emitir nuevo certificado
          </button>
          {proyectosCompletados.length === 0 && (
            <p
              style={{
                fontFamily: FONT,
                fontSize: 12,
                color: "#9CA3AF",
                marginTop: 8,
              }}
            >
              Debes marcar al menos un proyecto como COMPLETADO para emitir
              certificados.
            </p>
          )}
        </motion.div>

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
              digitales verificables para tus estudiantes.
            </p>
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
                errorEliminar={
                  errorEliminarGeneral
                    ? "Error al eliminar el certificado"
                    : null
                }
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </MypeLayout>
  );
}
