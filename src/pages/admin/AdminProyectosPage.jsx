// src/pages/admin/AdminProyectosPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAdminProyectos,
  usePostulacionesAdmin,
} from "@features/admin/useAdminProyectos";
import { Loader2 } from "lucide-react";
import {
  Search,
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Users,
  Building2,
  ArrowRightLeft,
  RefreshCw,
  Briefcase,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FONT = "'Angro Std', 'Outfit', sans-serif";

const ESTADO_LABELS = {
  TODOS: "Todos",
  BORRADOR: "Borrador",
  PENDIENTE: "Pendiente",
  EN_DESARROLLO: "En Desarrollo",
  EN_REVISION: "En Revisión",
  COMPLETADO: "Completado",
};

const getEstadoBadge = (estado) => {
  const styles = {
    BORRADOR: "bg-slate-100 text-slate-600 border-slate-200",
    PENDIENTE: "bg-amber-50 text-amber-700 border-amber-200",
    EN_DESARROLLO: "bg-blue-50 text-blue-700 border-blue-200",
    EN_REVISION: "bg-purple-50 text-purple-700 border-purple-200",
    COMPLETADO: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${styles[estado] || styles.BORRADOR}`}
    >
      {ESTADO_LABELS[estado] || estado.replace("_", " ")}
    </span>
  );
};

// ─── Animaciones ───
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] },
});

// ─── Hero Banner ────────────────────────────────────────────────────────
const ProyectosHeroBanner = ({
  totalProyectos,
  proyectosActivos,
  tasaOcupacion,
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
            <Briefcase size={24} style={{ color: "#06B6D4" }} />
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#fff",
                margin: 0,
              }}
            >
              Gestión de Proyectos
            </h1>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.6)",
              margin: 0,
              maxWidth: 450,
            }}
          >
            Administra y supervisa todos los proyectos de la plataforma.
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
            <div style={{ fontSize: 24, fontWeight: 800, color: "#06B6D4" }}>
              {totalProyectos}
            </div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
              }}
            >
              Total
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
            <div style={{ fontSize: 24, fontWeight: 800, color: "#F59E0B" }}>
              {proyectosActivos}
            </div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
              }}
            >
              Activos
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
            <div style={{ fontSize: 24, fontWeight: 800, color: "#A855F7" }}>
              {tasaOcupacion}%
            </div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
              }}
            >
              Ocupación
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Modal Auditoría ────────────────────────────────────────────
function ModalAuditoriaBody({ proyecto, onClose, onConfirm, isAuditando }) {
  const { postulaciones, isLoading } = usePostulacionesAdmin(proyecto?.id);
  const [selectedPostulacionId, setSelectedPostulacionId] = useState("");

  const activos =
    postulaciones?.filter(
      (p) => p.estado === "CONFIRMADO" || p.estado === "VALIDADO_MYPE",
    ) || [];

  React.useEffect(() => {
    if (activos.length === 1)
      setSelectedPostulacionId(activos[0].id.toString());
    else if (activos.length === 0) setSelectedPostulacionId("");
  }, [activos]);

  const handleConfirmar = () => {
    if (!selectedPostulacionId) {
      alert("Por favor, selecciona al estudiante que deseas expulsar.");
      return;
    }
    onConfirm(Number(selectedPostulacionId));
  };

  return (
    <div className="p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle size={32} />
      </div>
      <h3 className="text-xl font-extrabold text-slate-900 mb-2">
        Auditoría de Abandono
      </h3>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      ) : activos.length === 0 ? (
        <div className="my-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-left">
          <p className="text-sm font-semibold text-amber-800">
            No se encontraron estudiantes activos en este proyecto.
          </p>
          <p className="text-xs text-amber-700 mt-1">
            Si continúas, se intentará usar la postulación por defecto.
          </p>
        </div>
      ) : (
        <div className="my-4 text-left">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
            Seleccionar estudiante a expulsar:
          </label>
          <div className="space-y-2">
            {activos.map((p) => (
              <label
                key={p.id}
                className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${selectedPostulacionId === p.id.toString() ? "bg-red-50/50 border-red-200 ring-2 ring-red-500/15" : "bg-slate-50 border-slate-200 hover:bg-slate-100/70"}`}
              >
                <input
                  type="radio"
                  name="estudianteExpulsar"
                  value={p.id}
                  checked={selectedPostulacionId === p.id.toString()}
                  onChange={(e) => setSelectedPostulacionId(e.target.value)}
                  className="text-red-600 focus:ring-red-500"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {p.estudianteNombre}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Estado: {p.estado}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-slate-500 font-medium mb-6">
        Estás a punto de expulsar a un estudiante del proyecto{" "}
        <strong className="text-slate-800">"{proyecto?.titulo}"</strong>{" "}
        reportado por la MYPE.
      </p>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-3 mb-6">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Flujo de Reapertura:
        </h4>
        <ul className="text-sm text-slate-600 font-medium space-y-2">
          <li className="flex items-start gap-2">
            <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" /> El
            estudiante será marcado como RECHAZADO.
          </li>
          <li className="flex items-start gap-2">
            <RefreshCw size={16} className="text-amber-500 shrink-0 mt-0.5" />{" "}
            El proyecto retrocederá a PENDIENTE.
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2
              size={16}
              className="text-emerald-500 shrink-0 mt-0.5"
            />{" "}
            Se notificará a los postulantes rechazados.
          </li>
        </ul>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200"
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirmar}
          disabled={
            isAuditando || (activos.length > 0 && !selectedPostulacionId)
          }
          className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 shadow-lg disabled:opacity-50"
        >
          {isAuditando ? "Procesando..." : "Confirmar Expulsión"}
        </button>
      </div>
    </div>
  );
}

// ─── Modal Ceder Gestión ────────────────────────────────────────────
function ModalCederBody({ proyecto, onClose, onConfirm }) {
  return (
    <div className="p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4">
        <ArrowRightLeft size={32} />
      </div>
      <h3 className="text-xl font-extrabold text-slate-900 mb-2">
        Ceder gestión a la MYPE
      </h3>
      <p className="text-sm text-slate-500 mb-4">
        ¿Estás seguro de que deseas ceder la gestión de postulantes a la MYPE?
      </p>
      <p className="text-xs text-slate-400 bg-slate-50 p-3 rounded-xl mb-6">
        La MYPE podrá aceptar o rechazar postulantes directamente sin
        intervención del administrador.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-3 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 shadow-lg"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}

// =========================================================================
// COMPONENTE PRINCIPAL
// =========================================================================
export default function AdminProyectosPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const {
    proyectosData,
    isLoading,
    cederGestion,
    auditarAbandono,
    isAuditando,
  } = useAdminProyectos();

  const proyectos = proyectosData?.content || [];
  const totalProyectos = proyectosData?.totalElements || 0;
  const proyectosActivos = proyectos.filter(
    (p) => p.estado === "PENDIENTE" || p.estado === "EN_DESARROLLO",
  ).length;
  const tasaOcupacion =
    proyectos.length > 0
      ? Math.round(
          (proyectos.filter((p) => p.cuposAceptados > 0).length /
            proyectos.length) *
            100,
        )
      : 0;

  const [modalAuditoria, setModalAuditoria] = useState({
    isOpen: false,
    proyecto: null,
  });
  const [modalCeder, setModalCeder] = useState({
    isOpen: false,
    proyecto: null,
  });

  const filteredProyectos = proyectos
    .filter((p) => {
      const matchesSearch =
        p.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.mypeNombre &&
          p.mypeNombre.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesEstado =
        filtroEstado === "TODOS" || p.estado === filtroEstado;
      return matchesSearch && matchesEstado;
    })
    .sort((a, b) => {
      const pendA = a.postulantesPendientes || 0;
      const pendB = b.postulantesPendientes || 0;
      if (pendA > 0 && pendB === 0) return -1;
      if (pendB > 0 && pendA === 0) return 1;
      if (pendA > 0 && pendB > 0) return pendB - pendA;
      return b.id - a.id;
    });

  const handleConfirmarCeder = () => {
    if (modalCeder.proyecto) cederGestion(modalCeder.proyecto.id);
    setModalCeder({ isOpen: false, proyecto: null });
  };

  const handleConfirmarAuditoria = (postulacionId) => {
    auditarAbandono({ proyectoId: modalAuditoria.proyecto.id, postulacionId });
    setModalAuditoria({ isOpen: false, proyecto: null });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-slate-500 font-medium">Cargando proyectos...</p>
      </div>
    );
  }

  return (
    <div
      className="space-y-6 pb-12"
      style={{ fontFamily: FONT, maxWidth: 1400, margin: "0 auto" }}
    >
      {/* Hero Banner */}
      <ProyectosHeroBanner
        totalProyectos={totalProyectos}
        proyectosActivos={proyectosActivos}
        tasaOcupacion={tasaOcupacion}
      />

      {/* Toolbar */}
      <motion.div
        {...fadeUp(0.05)}
        className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex flex-wrap gap-1.5">
            {[
              "TODOS",
              "BORRADOR",
              "PENDIENTE",
              "EN_DESARROLLO",
              "EN_REVISION",
              "COMPLETADO",
            ].map((estado) => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  filtroEstado === estado
                    ? "bg-primary text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {ESTADO_LABELS[estado] || estado}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Buscar proyecto o empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </motion.div>

      {/* Tabla de Proyectos */}
      <motion.div
        {...fadeUp(0.1)}
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Proyecto / Empresa
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Cupos
                </th>
                <th className="px-5 py-3 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProyectos.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    <Briefcase
                      size={40}
                      className="mx-auto text-slate-300 mb-3"
                    />
                    <p className="font-medium">No se encontraron proyectos</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Prueba con otros filtros
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProyectos.map((proyecto) => (
                  <tr
                    key={proyecto.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-slate-800">
                            {proyecto.titulo}
                          </p>
                          {proyecto.postulantesPendientes > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-orange-100 text-orange-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                              {proyecto.postulantesPendientes} pendientes
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Building2 size={11} /> {proyecto.mypeNombre}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {getEstadoBadge(proyecto.estado)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-primary"
                            style={{
                              width: `${Math.round((proyecto.cuposAceptados / proyecto.cuposTotales) * 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700">
                          {proyecto.cuposAceptados}/{proyecto.cuposTotales}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {proyecto.estado === "PENDIENTE" && (
                          <>
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/postulaciones?proyectoId=${proyecto.id}`,
                                )
                              }
                              className={`p-1.5 rounded-lg transition-colors ${
                                proyecto.postulantesPendientes > 0
                                  ? "bg-orange-500 text-white hover:bg-orange-600"
                                  : "text-primary bg-indigo-50 hover:bg-primary hover:text-white"
                              }`}
                              title="Revisar postulantes"
                            >
                              <Eye size={14} />
                            </button>
                            {!proyecto.gestionCedida && (
                              <button
                                onClick={() =>
                                  setModalCeder({ isOpen: true, proyecto })
                                }
                                className="p-1.5 text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                                title="Ceder gestión a la MYPE"
                              >
                                <ArrowRightLeft size={14} />
                              </button>
                            )}
                          </>
                        )}
                        {proyecto.estado === "EN_DESARROLLO" && (
                          <button
                            onClick={() =>
                              setModalAuditoria({ isOpen: true, proyecto })
                            }
                            className="p-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            title="Auditar abandono"
                          >
                            <AlertTriangle size={14} />
                          </button>
                        )}
                        {proyecto.estado === "COMPLETADO" && (
                          <span className="text-xs text-slate-400 px-2">
                            Completado
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modales */}
      <AnimatePresence>
        {modalAuditoria.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() =>
                setModalAuditoria({ isOpen: false, proyecto: null })
              }
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10"
            >
              <ModalAuditoriaBody
                proyecto={modalAuditoria.proyecto}
                onClose={() =>
                  setModalAuditoria({ isOpen: false, proyecto: null })
                }
                onConfirm={handleConfirmarAuditoria}
                isAuditando={isAuditando}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalCeder.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setModalCeder({ isOpen: false, proyecto: null })}
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10"
            >
              <ModalCederBody
                proyecto={modalCeder.proyecto}
                onClose={() => setModalCeder({ isOpen: false, proyecto: null })}
                onConfirm={handleConfirmarCeder}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
