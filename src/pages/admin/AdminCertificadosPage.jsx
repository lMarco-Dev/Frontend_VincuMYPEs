// src/pages/admin/AdminCertificadosPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/shared/api/httpClient";
import {
  Award,
  Search,
  Download,
  Eye,
  Loader2,
  Calendar,
  Building2,
  User,
  FileText,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

const FONT = "'Angro Std', 'Outfit', sans-serif";

// ─── Animaciones ───
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] },
});

// ─── Helper para formatear fecha ─────────────────────────────────────────────
const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ─── Obtener certificados desde el backend ──────────────────────────────────
const getCertificadosAdmin = async () => {
  const response = await httpClient.get("/certificados/admin/todos");
  return response.data;
};

// ─── Hero Banner ────────────────────────────────────────────────────────────
const CertificadosHeroBanner = ({ totalCertificados }) => {
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
            <Award size={24} style={{ color: "#F59E0B" }} />
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#fff",
                margin: 0,
              }}
            >
              Certificados Digitales
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
            Administra todos los certificados emitidos en la plataforma.
            Visualiza, descarga y gestiona la documentación.
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
            <div style={{ fontSize: 24, fontWeight: 800, color: "#F59E0B" }}>
              {totalCertificados}
            </div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
              }}
            >
              Certificados
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
            <CheckCircle2
              size={24}
              style={{ color: "#06B6D4", marginBottom: 4 }}
            />
            <div
              style={{
                fontSize: 9,
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
              }}
            >
              Verificados
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Componente principal ───────────────────────────────────────────────────
export default function AdminCertificadosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: certificados = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-certificados"],
    queryFn: getCertificadosAdmin,
  });

  // Filtrar por código, estudiante, proyecto o MYPE
  const filtered = certificados.filter((cert) => {
    const term = searchTerm.toLowerCase();
    return (
      cert.codigo?.toLowerCase().includes(term) ||
      cert.nombreEstudiante?.toLowerCase().includes(term) ||
      cert.nombreProyecto?.toLowerCase().includes(term) ||
      cert.nombreMype?.toLowerCase().includes(term)
    );
  });

  // Paginación
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  // Resetear página cuando cambia el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const descargarCertificado = (url, nombreArchivo) => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Si está cargando
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-slate-500 font-medium">Cargando certificados...</p>
      </div>
    );
  }

  // Si hay error
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 max-w-md mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-2">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Error al cargar los certificados
        </h3>
        <p className="text-sm text-slate-500">
          {error?.message || "No se pudo establecer conexión con el servidor."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div
      className="space-y-6 pb-12"
      style={{ fontFamily: FONT, maxWidth: 1400, margin: "0 auto" }}
    >
      {/* Hero Banner */}
      <CertificadosHeroBanner totalCertificados={certificados.length} />

      {/* Barra de búsqueda */}
      <motion.div
        {...fadeUp(0.05)}
        className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Buscar por código, estudiante, proyecto o empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Mostrando {filtered.length} de {certificados.length} certificados
        </p>
      </motion.div>

      {/* Tabla de certificados */}
      <motion.div {...fadeUp(0.1)}>
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              No hay certificados
            </h3>
            <p className="text-sm text-slate-500">
              {searchTerm
                ? "No se encontraron certificados con esos criterios."
                : "Aún no se ha emitido ningún certificado."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-5 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-5 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Estudiante
                    </th>
                    <th className="px-5 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Proyecto
                    </th>
                    <th className="px-5 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Empresa
                    </th>
                    <th className="px-5 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-5 py-3 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.map((cert, idx) => (
                    <tr
                      key={cert.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                          {cert.codigo}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                            {cert.nombreEstudiante?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {cert.nombreEstudiante}
                            </p>
                            <p className="text-xs text-slate-400">
                              {cert.emailEstudiante}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-700 font-medium">
                          {cert.nombreProyecto}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <Building2 size={14} className="text-slate-400" />
                          <span className="text-sm text-slate-600">
                            {cert.nombreMype}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-slate-400" />
                          <span className="text-sm text-slate-600">
                            {formatDate(cert.fechaEmision)}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              descargarCertificado(
                                cert.urlCertificado,
                                `certificado-${cert.codigo}.pdf`,
                              )
                            }
                            disabled={!cert.urlCertificado}
                            className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50"
                            title="Descargar PDF"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Mostrando {startIndex + 1} -{" "}
                  {Math.min(startIndex + itemsPerPage, filtered.length)} de{" "}
                  {filtered.length}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from(
                    { length: Math.min(totalPages, 5) },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-primary text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
