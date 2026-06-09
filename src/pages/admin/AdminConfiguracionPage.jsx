// src/pages/admin/AdminConfiguracionPage.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  Settings,
  Database,
  Plus,
  Edit2,
  Trash2,
  SlidersHorizontal,
  Power,
  ShieldAlert,
  Loader2,
  FileText,
  Layers,
  X,
  Check,
  Briefcase,
  Zap,
  Users,
  Calendar,
  Globe,
  TrendingUp,
  Smartphone,
  Code,
  BarChart,
  Wifi,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTiposProyecto } from "@/features/admin/useTiposProyecto";
import { useEntregablesTipo } from "@/features/admin/useEntregablesTipo";
import { useInsumosTipo } from "@/features/admin/useInsumosTipo";

const FONT = "'Angro Std', 'Outfit', sans-serif";

// ─── Animaciones ───
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] },
});

// ─── Colores por área de sistemas ─────────────────────────────────────
const AREA_COLORS = {
  DESARROLLO_WEB: {
    bg: "#EFF6FF",
    text: "#1B6FE8",
    icon: Globe,
    label: "Desarrollo Web",
  },
  DESARROLLO_MOVIL: {
    bg: "#ECFDF5",
    text: "#059669",
    icon: Smartphone,
    label: "Desarrollo Móvil",
  },
  DESARROLLO_SOFTWARE: {
    bg: "#F5F3FF",
    text: "#7C3AED",
    icon: Code,
    label: "Desarrollo Software",
  },
  BASE_DE_DATOS: {
    bg: "#FFFBEB",
    text: "#D97706",
    icon: Database,
    label: "Base de Datos",
  },
  ANALISIS_DATOS: {
    bg: "#FEF2F2",
    text: "#DC2626",
    icon: BarChart,
    label: "Análisis de Datos",
  },
  SOPORTE_TI: {
    bg: "#F0F9FF",
    text: "#0891B2",
    icon: Wifi,
    label: "Soporte TI",
  },
  OTRO: { bg: "#F3F4F6", text: "#6B7280", icon: Settings, label: "Otro" },
};

const RAMAS = [
  "Presencia digital y captación",
  "Datos e inteligencia de negocio",
  "Experiencia de usuario",
  "Infraestructura y redes",
  "Seguridad y continuidad",
];

// ─── Hero Banner ─────────────────────────────────────────────────
const ConfiguracionHeroBanner = () => {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext("2d");
    let W, H, animId;
    const mouse = { x: -999, y: -999 };
    const COLORS = ["rgba(27,111,232,", "rgba(6,182,212,", "rgba(124,58,237,"];

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

    const particles = Array.from({ length: 45 }, () => new Particle());

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
            ctx.strokeStyle = `rgba(124,58,237,${0.12 * (1 - dist / 80)})`;
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
      {...fadeUp(0)}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "2rem",
        background:
          "linear-gradient(135deg, #0A1628 0%, #0F2A4A 60%, #1E3A5F 100%)",
        padding: "32px 40px",
        marginBottom: 28,
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
          background: "radial-gradient(circle, #A855F7, transparent 70%)",
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
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <Settings size={24} style={{ color: "#A855F7" }} />
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#fff",
                margin: 0,
              }}
            >
              Configuración del Sistema
            </h1>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.6)",
              margin: 0,
              maxWidth: 500,
            }}
          >
            Gestiona los parámetros globales, catálogos de proyectos y reglas de
            negocio de la plataforma.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "10px 18px",
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Zap size={20} style={{ color: "#F59E0B", marginBottom: 4 }} />
            <div
              style={{
                fontSize: 9,
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
              }}
            >
              Zona Crítica
            </div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "10px 18px",
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Database size={20} style={{ color: "#06B6D4", marginBottom: 4 }} />
            <div
              style={{
                fontSize: 9,
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
              }}
            >
              Catálogos
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Tarjeta de Tipo de Proyecto (mejorada) ──────────────────────────────
const TipoProyectoCard = ({
  tipo,
  onEdit,
  onEntregables,
  onInsumos,
  onToggle,
}) => {
  const areaConfig = AREA_COLORS[tipo.areaSistemas] || AREA_COLORS.OTRO;
  const AreaIcon = areaConfig.icon;

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 p-4 transition-all hover:shadow-md ${!tipo.activo ? "opacity-60" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {tipo.codigo}
            </span>
            <h4 className="text-sm font-bold text-slate-800">{tipo.nombre}</h4>
            {!tipo.activo && (
              <span className="text-[9px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                Inactivo
              </span>
            )}
          </div>

          {/* Tags de información */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg text-[11px] font-medium text-slate-600">
              <Briefcase size={12} /> {tipo.rama}
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium"
              style={{ background: areaConfig.bg, color: areaConfig.text }}
            >
              <AreaIcon size={12} /> {areaConfig.label}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg text-[11px] font-medium text-slate-600">
              <Users size={12} /> {tipo.cuposMin}-{tipo.cuposMax} cupos
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg text-[11px] font-medium text-slate-600">
              <Calendar size={12} /> {tipo.diasMin}-{tipo.diasSugerido} días
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(tipo)}
            className="p-1.5 text-slate-400 hover:text-primary hover:bg-indigo-50 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onEntregables(tipo)}
            className="p-1.5 text-slate-400 hover:text-primary hover:bg-indigo-50 rounded-lg transition-colors"
            title="Gestionar entregables"
          >
            <Layers size={14} />
          </button>
          <button
            onClick={() => onInsumos(tipo)}
            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Gestionar insumos"
          >
            <FileText size={14} />
          </button>
          <button
            onClick={() => onToggle(tipo)}
            className={`p-1.5 rounded-lg transition-colors ${tipo.activo ? "text-slate-400 hover:text-red-500 hover:bg-red-50" : "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"}`}
            title={tipo.activo ? "Desactivar" : "Activar"}
          >
            <Power size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Modal de Gestión de Entregables ──────────────────────────
function ModalEntregables({ tipo, onClose }) {
  const {
    entregables,
    isLoading,
    crearEntregable,
    actualizarEntregable,
    eliminarEntregable,
  } = useEntregablesTipo(tipo.id);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ titulo: "", descripcion: "", orden: 0 });
  const [errors, setErrors] = useState({});

  const LIMITES = {
    tituloMin: 3,
    tituloMax: 200,
    descripcionMax: 500,
    ordenMin: 0,
    ordenMax: 999,
  };

  const validar = () => {
    const errs = {};
    const titulo = (form.titulo || "").trim();
    if (titulo.length < LIMITES.tituloMin)
      errs.titulo = `Mínimo ${LIMITES.tituloMin} caracteres`;
    else if (titulo.length > LIMITES.tituloMax)
      errs.titulo = `Máximo ${LIMITES.tituloMax} caracteres`;
    if (form.descripcion && form.descripcion.length > LIMITES.descripcionMax)
      errs.descripcion = `Máximo ${LIMITES.descripcionMax} caracteres`;
    const orden = Number(form.orden);
    if (!Number.isInteger(orden) || orden < LIMITES.ordenMin)
      errs.orden = `≥ ${LIMITES.ordenMin}`;
    else if (orden > LIMITES.ordenMax) errs.orden = `≤ ${LIMITES.ordenMax}`;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;
    const payload = {
      titulo: form.titulo.trim(),
      descripcion: form.descripcion?.trim() || null,
      orden: Number(form.orden),
    };
    if (editando)
      actualizarEntregable({ entregableId: editando.id, data: payload });
    else crearEntregable(payload);
    setForm({ titulo: "", descripcion: "", orden: 0 });
    setEditando(null);
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900">
              Entregables: {tipo.nombre}
            </h3>
            <p className="text-xs text-slate-500">
              Define los entregables del proyecto
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 border-b border-slate-100 flex gap-2"
        >
          <input
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            placeholder="Título"
            className="flex-1 px-3 py-2 bg-slate-50 border rounded-lg text-sm"
          />
          <input
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            placeholder="Descripción"
            className="flex-1 px-3 py-2 bg-slate-50 border rounded-lg text-sm"
          />
          <input
            type="number"
            value={form.orden}
            onChange={(e) =>
              setForm({ ...form, orden: parseInt(e.target.value) || 0 })
            }
            className="w-16 px-2 py-2 bg-slate-50 border rounded-lg text-sm text-center"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-bold"
          >
            {editando ? <Check size={14} /> : <Plus size={14} />}
          </button>
        </form>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isLoading ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : (
            entregables?.map((e) => (
              <div
                key={e.id}
                className="flex justify-between items-center p-2 bg-slate-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium">{e.titulo}</p>
                  {e.descripcion && (
                    <p className="text-xs text-slate-500">{e.descripcion}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditando(e);
                      setForm({
                        titulo: e.titulo,
                        descripcion: e.descripcion || "",
                        orden: e.orden,
                      });
                    }}
                    className="p-1 text-slate-400 hover:text-primary"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("¿Eliminar este entregable?"))
                        eliminarEntregable(e.id);
                    }}
                    className="p-1 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Modal de Gestión de Insumos ──────────────────────────────
function ModalInsumos({ tipo, onClose }) {
  const { insumos, isLoading, crearInsumo, actualizarInsumo, eliminarInsumo } =
    useInsumosTipo(tipo.id);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    formato: "",
    obligatorio: false,
    orden: 0,
  });
  const [errors, setErrors] = useState({});

  const LIMITES = {
    nombreMin: 3,
    nombreMax: 200,
    descripcionMax: 500,
    ordenMin: 0,
    ordenMax: 999,
  };
  const FORMATOS = ["", "PDF", "IMAGEN", "EXCEL", "TEXTO", "LINK"];

  const validar = () => {
    const errs = {};
    const nombre = (form.nombre || "").trim();
    if (nombre.length < LIMITES.nombreMin)
      errs.nombre = `Mínimo ${LIMITES.nombreMin} caracteres`;
    else if (nombre.length > LIMITES.nombreMax)
      errs.nombre = `Máximo ${LIMITES.nombreMax}`;
    if (!FORMATOS.includes(form.formato || ""))
      errs.formato = "Formato inválido";
    const orden = Number(form.orden);
    if (!Number.isInteger(orden) || orden < LIMITES.ordenMin)
      errs.orden = `≥ ${LIMITES.ordenMin}`;
    else if (orden > LIMITES.ordenMax) errs.orden = `≤ ${LIMITES.ordenMax}`;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;
    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion?.trim() || null,
      formato: form.formato || null,
      obligatorio: !!form.obligatorio,
      orden: Number(form.orden),
    };
    if (editando) actualizarInsumo({ insumoId: editando.id, data: payload });
    else crearInsumo(payload);
    setForm({
      nombre: "",
      descripcion: "",
      formato: "",
      obligatorio: false,
      orden: 0,
    });
    setEditando(null);
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900">Insumos: {tipo.nombre}</h3>
            <p className="text-xs text-slate-500">Requisitos para publicar</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 border-b border-slate-100 grid grid-cols-4 gap-2"
        >
          <input
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            placeholder="Nombre *"
            className="col-span-1 px-2 py-2 bg-slate-50 border rounded-lg text-sm"
          />
          <input
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            placeholder="Descripción"
            className="col-span-1 px-2 py-2 bg-slate-50 border rounded-lg text-sm"
          />
          <select
            value={form.formato}
            onChange={(e) => setForm({ ...form, formato: e.target.value })}
            className="px-2 py-2 bg-slate-50 border rounded-lg text-sm"
          >
            {FORMATOS.map((f) => (
              <option key={f} value={f}>
                {f || "Cualquiera"}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <label className="text-xs">Oblig.</label>
            <input
              type="checkbox"
              checked={form.obligatorio}
              onChange={(e) =>
                setForm({ ...form, obligatorio: e.target.checked })
              }
              className="w-4 h-4"
            />
          </div>
          <input
            type="number"
            value={form.orden}
            onChange={(e) =>
              setForm({ ...form, orden: parseInt(e.target.value) || 0 })
            }
            className="w-16 px-2 py-2 bg-slate-50 border rounded-lg text-sm text-center"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-bold"
          >
            {editando ? <Check size={14} /> : <Plus size={14} />}
          </button>
        </form>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isLoading ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : (
            insumos?.map((i) => (
              <div
                key={i.id}
                className="flex justify-between items-center p-2 bg-slate-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium">{i.nombre}</p>
                  <div className="flex gap-2 mt-1">
                    {i.formato && (
                      <span className="text-[10px] bg-slate-200 px-1 rounded">
                        {i.formato}
                      </span>
                    )}
                    {i.obligatorio && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-1 rounded">
                        Obligatorio
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditando(i);
                      setForm({
                        nombre: i.nombre,
                        descripcion: i.descripcion || "",
                        formato: i.formato || "",
                        obligatorio: !!i.obligatorio,
                        orden: i.orden,
                      });
                    }}
                    className="p-1 text-slate-400 hover:text-primary"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("¿Eliminar este insumo?"))
                        eliminarInsumo(i.id);
                    }}
                    className="p-1 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════
export default function AdminConfiguracionPage() {
  const { tiposProyecto, crearTipo, actualizarTipo, toggleActivo } =
    useTiposProyecto();
  const [modalNuevoTipo, setModalNuevoTipo] = useState(false);
  const [tipoEditando, setTipoEditando] = useState(null);
  const [modalEntregables, setModalEntregables] = useState(null);
  const [modalInsumos, setModalInsumos] = useState(null);
  const [limiteGlobal, setLimiteGlobal] = useState(1);
  const [mantenimiento, setMantenimiento] = useState(false);

  const handleGuardarTipo = (e) => {
    e.preventDefault();
    const form = e.target;
    const cuposMin = parseInt(form.cuposMin.value, 10);
    const cuposMax = parseInt(form.cuposMax.value, 10);
    const diasMin = parseInt(form.diasMin.value, 10);
    const diasSugerido = parseInt(form.diasSugerido.value, 10);

    if (cuposMin > cuposMax) {
      alert("Cupos mínimos no puede ser mayor que máximos");
      return;
    }
    if (diasMin > diasSugerido) {
      alert("Días mínimos no puede ser mayor que sugeridos");
      return;
    }

    const data = {
      codigo: form.codigo.value.trim(),
      nombre: form.nombre.value.trim(),
      rama: form.rama.value,
      areaSistemas: form.areaSistemas.value,
      cicloMinimo: parseInt(form.cicloMinimo.value, 10),
      complejidad: form.complejidad.value || null,
      esfuerzoHPers: form.esfuerzoHPers.value?.trim()
        ? parseInt(form.esfuerzoHPers.value, 10)
        : null,
      cuposMin,
      cuposMax,
      diasMin,
      diasSugerido,
      descripcionMype: form.descripcionMype.value.trim() || null,
      alcanceIncluye: form.alcanceIncluye.value.trim() || null,
      alcanceNoIncluye: form.alcanceNoIncluye.value.trim() || null,
      activo: tipoEditando?.activo ?? true,
    };
    if (tipoEditando) actualizarTipo({ id: tipoEditando.id, data });
    else crearTipo(data);
    setModalNuevoTipo(false);
    setTipoEditando(null);
  };

  const handleEditar = (tipo) => {
    setTipoEditando(tipo);
    setModalNuevoTipo(true);
  };

  const handleToggleActivo = (tipo) => {
    if (
      window.confirm(
        `¿${tipo.activo ? "Desactivar" : "Activar"} "${tipo.nombre}"?`,
      )
    ) {
      toggleActivo(tipo.id);
    }
  };

  // Agrupar tipos por área para mejor visualización
  const tipos = tiposProyecto || [];
  const tiposAgrupados = tipos.reduce((acc, tipo) => {
    const area = tipo.areaSistemas || "OTRO";
    if (!acc[area]) acc[area] = [];
    acc[area].push(tipo);
    return acc;
  }, {});

  return (
    <div
      className="space-y-6 pb-12"
      style={{ fontFamily: FONT, maxWidth: 1400, margin: "0 auto" }}
    >
      <ConfiguracionHeroBanner />

      {/* Layout de 2 columnas: Parámetros Globales a la izquierda, Catálogo a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMNA IZQUIERDA: Parámetros Globales */}
        <motion.div {...fadeUp(0.05)} className="space-y-6">
          {/* Tarjeta de Límite de Proyectos */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-primary" />
                <h3 className="font-bold text-slate-800">
                  Límite de proyectos
                </h3>
              </div>
            </div>
            <div className="p-5">
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Por estudiante
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Proyectos simultáneos en estado "En Desarrollo"
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={limiteGlobal}
                  onChange={(e) => setLimiteGlobal(e.target.value)}
                  className="w-20 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <span className="text-xs text-slate-400">proyectos máximo</span>
              </div>
            </div>
          </div>

          {/* Tarjeta de Modo Mantenimiento */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-2">
                <ShieldAlert size={18} className="text-amber-500" />
                <h3 className="font-bold text-slate-800">Modo Mantenimiento</h3>
              </div>
            </div>
            <div className="p-5">
              <p className="text-xs text-slate-500 mb-4">
                Bloquea acceso a estudiantes y MYPEs. Solo administradores
                pueden ingresar.
              </p>
              <button
                onClick={() => setMantenimiento(!mantenimiento)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  mantenimiento
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Power size={16} />
                {mantenimiento
                  ? "Mantenimiento Activado"
                  : "Activar Mantenimiento"}
              </button>
            </div>
          </div>

          {/* Alerta Zona Crítica */}
          <div className="bg-amber-50 rounded-2xl p-4 flex gap-3 border border-amber-100">
            <ShieldAlert size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-800">Zona Crítica</h4>
              <p className="text-xs text-amber-700 leading-relaxed">
                Los cambios afectan la lógica de negocio en tiempo real. Actúa
                con precaución.
              </p>
            </div>
          </div>
        </motion.div>

        {/* COLUMNA DERECHA: Catálogo de Tipos de Proyecto */}
        <motion.div {...fadeUp(0.1)} className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Database size={18} className="text-primary" />
                <div>
                  <h3 className="font-bold text-slate-800">
                    Catálogo de Ofertas
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Plantillas base para proyectos
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setTipoEditando(null);
                  setModalNuevoTipo(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors"
              >
                <Plus size={14} /> Nuevo Tipo
              </button>
            </div>

            <div className="p-5 space-y-6 max-h-[650px] overflow-y-auto">
              {tipos.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Database size={40} className="mx-auto mb-3 opacity-50" />
                  <p className="font-medium">
                    No hay tipos de proyecto cargados
                  </p>
                  <p className="text-xs mt-1">
                    Haz clic en "Nuevo Tipo" para comenzar
                  </p>
                </div>
              ) : (
                // Mostrar tipos agrupados por área
                Object.entries(tiposAgrupados).map(([area, tiposPorArea]) => {
                  const areaConfig = AREA_COLORS[area] || AREA_COLORS.OTRO;
                  const AreaIcon = areaConfig.icon;

                  return (
                    <div key={area} className="space-y-3">
                      <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                        <div
                          className="p-1 rounded-lg"
                          style={{ background: areaConfig.bg }}
                        >
                          <AreaIcon
                            size={14}
                            style={{ color: areaConfig.text }}
                          />
                        </div>
                        <h4
                          className="text-xs font-bold uppercase tracking-wider"
                          style={{ color: areaConfig.text }}
                        >
                          {areaConfig.label}
                        </h4>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                          {tiposPorArea.length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {tiposPorArea.map((tipo) => (
                          <TipoProyectoCard
                            key={tipo.id}
                            tipo={tipo}
                            onEdit={handleEditar}
                            onEntregables={setModalEntregables}
                            onInsumos={setModalInsumos}
                            onToggle={handleToggleActivo}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal de Tipo de Proyecto */}
      <AnimatePresence>
        {modalNuevoTipo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => {
                setModalNuevoTipo(false);
                setTipoEditando(null);
              }}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <form
                onSubmit={handleGuardarTipo}
                className="flex flex-col h-full"
              >
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-bold text-slate-900">
                    {tipoEditando ? "Editar Tipo" : "Agregar Tipo"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configura los parámetros del catálogo
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-600">
                        Código *
                      </label>
                      <input
                        name="codigo"
                        defaultValue={tipoEditando?.codigo}
                        required
                        disabled={!!tipoEditando}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm mt-1"
                      />
                      {tipoEditando && (
                        <p className="text-[10px] text-slate-400 mt-1">
                          No editable después de crear
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600">
                        Nombre *
                      </label>
                      <input
                        name="nombre"
                        defaultValue={tipoEditando?.nombre}
                        required
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm mt-1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-600">
                        Rama TI
                      </label>
                      <select
                        name="rama"
                        defaultValue={tipoEditando?.rama || RAMAS[0]}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm mt-1"
                      >
                        {RAMAS.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600">
                        Área Sistemas
                      </label>
                      <select
                        name="areaSistemas"
                        defaultValue={
                          tipoEditando?.areaSistemas || "DESARROLLO_WEB"
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm mt-1"
                      >
                        {Object.entries(AREA_COLORS).map(([key, val]) => (
                          <option key={key} value={key}>
                            {val.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-600">
                        Cupos mín
                      </label>
                      <input
                        name="cuposMin"
                        type="number"
                        defaultValue={tipoEditando?.cuposMin ?? 2}
                        className="w-full px-2 py-2 bg-slate-50 border rounded-lg text-sm mt-1 text-center"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600">
                        Cupos máx
                      </label>
                      <input
                        name="cuposMax"
                        type="number"
                        defaultValue={tipoEditando?.cuposMax ?? 3}
                        className="w-full px-2 py-2 bg-slate-50 border rounded-lg text-sm mt-1 text-center"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600">
                        Días mín
                      </label>
                      <input
                        name="diasMin"
                        type="number"
                        defaultValue={tipoEditando?.diasMin ?? 14}
                        className="w-full px-2 py-2 bg-slate-50 border rounded-lg text-sm mt-1 text-center"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600">
                        Días sug
                      </label>
                      <input
                        name="diasSugerido"
                        type="number"
                        defaultValue={tipoEditando?.diasSugerido ?? 21}
                        className="w-full px-2 py-2 bg-slate-50 border rounded-lg text-sm mt-1 text-center"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">
                      Descripción para MYPE
                    </label>
                    <textarea
                      name="descripcionMype"
                      rows={2}
                      defaultValue={tipoEditando?.descripcionMype || ""}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">
                      Esfuerzo (horas-persona)
                    </label>
                    <input
                      name="esfuerzoHPers"
                      type="number"
                      defaultValue={tipoEditando?.esfuerzoHPers || ""}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm mt-1"
                    />
                  </div>
                </div>
                <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => {
                      setModalNuevoTipo(false);
                      setTipoEditando(null);
                    }}
                    className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg"
                  >
                    {tipoEditando ? "Guardar" : "Crear"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modales de Entregables e Insumos */}
      <AnimatePresence>
        {modalEntregables && (
          <ModalEntregables
            tipo={modalEntregables}
            onClose={() => setModalEntregables(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {modalInsumos && (
          <ModalInsumos
            tipo={modalInsumos}
            onClose={() => setModalInsumos(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
