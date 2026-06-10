import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import RatingDisplay from "@/features/calificaciones/RatingDisplay";
import {
  ChevronLeft,
  GraduationCap,
  MapPin,
  FileText,
  ExternalLink,
  Briefcase,
  Globe,
  AlertCircle,
  Loader2,
  User,
  Mail,
  Phone,
  Hash,
  Lock,
  ShieldAlert,
  Award,
  CheckCircle2,
  ArrowRight,
  X,
} from "lucide-react";
import { usePerfilPublicoEstudiante } from "@/features/perfil-publico/usePerfilPublicoEstudiante";
import { useAuthStore } from "@/store/authStore";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

const StaticMapWithCircle = ({ lat, lng, height = 180 }) => {
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!window.google || !window.google.maps) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !lat || !lng) return;
    const position = { lat: parseFloat(lat), lng: parseFloat(lng) };
    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 15,
      center: position,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: false,
      draggable: false,
      scrollwheel: false,
      disableDoubleClickZoom: true,
      styles: [
        { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
      ],
    });

    new window.google.maps.Marker({
      position,
      map,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#FACC15",
        fillOpacity: 1,
        strokeColor: "#fff",
        strokeWeight: 2.5,
      },
    });

    new window.google.maps.Circle({
      map,
      center: position,
      radius: 150,
      strokeColor: "#FACC15",
      strokeOpacity: 0.85,
      strokeWeight: 2,
      fillColor: "#FACC15",
      fillOpacity: 0.15,
    });
  }, [isLoaded, lat, lng]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height,
        borderRadius: 14,
        overflow: "hidden",
        border: "0.5px solid #e8e8e4",
        background: "#e2e8f0",
      }}
    >
      {!isLoaded && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "#94a3b8",
          }}
        >
          <Loader2 size={18} className="animate-spin" />
        </div>
      )}
    </div>
  );
};

const Section = ({ title, children, admin = false }) => {
  return (
    <motion.section
      {...fadeUp(0)}
      style={{
        background: admin ? "#FFFBEB" : "#fff",
        border: admin ? "1px solid #FDE68A" : "0.5px solid #e8e8e4",
        borderRadius: 16,
        padding: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h3
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: admin ? "#92400E" : "#0f1f3d",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {admin && <Lock size={11} />}
          {title}
        </h3>
      </div>
      {children}
    </motion.section>
  );
};

const HeroBannerPublico = ({ nombre, displayRol, academicInfo, fotoPerfil, iniciales, usuarioId  }) => {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext("2d");
    let W, H, animId;
    const COLORS = ["rgba(27,111,232,", "rgba(6,182,212,", "rgba(212,88,10,", "rgba(255,255,255,", "rgba(16,185,129,"];

    const resize = () => {
      W = canvas.width = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(hero);

    class RisingParticle {
      reset() {
        this.x = Math.random() * W;
        this.y = H + Math.random() * 50;
        this.size = Math.random() * 2.5 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = -(Math.random() * 1.2 + 0.4);
        this.alpha = Math.random() * 0.5 + 0.2;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.waveFreq = Math.random() * Math.PI * 2;
      }
      constructor() { this.reset(); }
      update() {
        this.x += this.speedX + Math.sin(Date.now() * 0.002 + this.waveFreq) * 0.15;
        this.y += this.speedY;
        if (this.y < -20) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ")";
        ctx.fill();
        if (this.size > 1.8) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = this.color + this.alpha + ")";
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }
    const particles = Array.from({ length: 85 }, () => new RisingParticle());
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 70) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(27,111,232,${0.05 * (1 - d / 70)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };
    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      drawConnections();
      particles.forEach((p) => { p.update(); p.draw(); });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
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
        borderRadius: 20,
        background: "linear-gradient(135deg,#0d1b35,#0f2a4a 60%,#0a2240)",
        padding: "40px 44px",
        color: "#fff",
        marginBottom: 24,
        minHeight: 250,
      }}
    >
      <style>{`
        @keyframes heroPulse{0%{box-shadow:0 0 0 0 rgba(74,222,128,0.45)}70%{box-shadow:0 0 0 9px rgba(74,222,128,0)}100%{box-shadow:0 0 0 0 rgba(74,222,128,0)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes orbF1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-18px,14px) scale(1.08)}66%{transform:translate(9px,-9px) scale(0.95)}}
        @keyframes orbF2{0%,100%{transform:translate(0,0)}40%{transform:translate(14px,-18px)}70%{transform:translate(-9px,11px)}}
        @keyframes orbF3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-13px,18px) scale(1.1)}}
        .hero-rating span { color: rgba(255,255,255,0.8) !important; }
      `}</style>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.6, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(27,111,232,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(27,111,232,0.06) 1px,transparent 1px)", backgroundSize: "48px 48px", WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 55% 50%,black,transparent)", maskImage: "radial-gradient(ellipse 80% 80% at 55% 50%,black,transparent)" }} />
      <div style={{ position: "absolute", top: -70, right: -40, width: 250, height: 250, borderRadius: "50%", background: "rgba(27,111,232,0.16)", filter: "blur(40px)", animation: "orbF1 8s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: -65, right: 140, width: 190, height: 190, borderRadius: "50%", background: "rgba(212,88,10,0.09)", filter: "blur(40px)", animation: "orbF2 10s ease-in-out infinite" }} />
      <div style={{ position: "absolute", top: 10, right: 210, width: 150, height: 150, borderRadius: "50%", background: "rgba(6,182,212,0.07)", filter: "blur(40px)", animation: "orbF3 13s ease-in-out infinite" }} />

      <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ maxWidth: 500 }}>
          <div style={{ fontSize: "clamp(23px,2.5vw,30px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.035em", marginBottom: 6 }}>
            <div style={{ overflow: "hidden" }}>
              <motion.div initial={{ y: "110%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }} style={{ color: "#fff" }}>
                {nombre}
              </motion.div>
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
            <span style={{ padding: "4px 12px", borderRadius: 7, background: "rgba(27,111,232,0.2)", border: "0.5px solid rgba(27,111,232,0.3)", fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#67d4f8" }}>
              {displayRol}
            </span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
              {academicInfo.universidad}
            </span>
            <span className="hero-rating">
              <RatingDisplay usuarioId={usuarioId} size="sm" />
            </span>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.55, duration: 0.7 }} style={{ flexShrink: 0, marginLeft: 30, position: "relative" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 120, height: 120, borderRadius: "50%", border: "1.5px solid rgba(27,111,232,0.2)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 145, height: 145, borderRadius: "50%", border: "0.8px solid rgba(27,111,232,0.1)", pointerEvents: "none" }} />
          <div style={{ width: 95, height: 95, borderRadius: 24, border: "3px solid rgba(255,255,255,0.22)", boxShadow: "0 18px 45px rgba(0,0,0,0.3), 0 0 30px rgba(27,111,232,0.15)", overflow: "hidden", background: "#fff", position: "relative", zIndex: 2 }}>
            {fotoPerfil ? (
              <img alt="Foto" style={{ width: "100%", height: "100%", objectFit: "cover" }} src={fotoPerfil} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#1B6FE8,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 800, color: "#fff" }}>
                {iniciales}
              </div>
            )}
          </div>
        </motion.div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1.5, background: "linear-gradient(90deg,transparent,rgba(27,111,232,0.5) 30%,rgba(6,182,212,0.5) 60%,transparent)" }} />
    </motion.div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 12px",
      background: "rgba(255,255,255,0.6)",
      border: "1px solid rgba(253,230,138,0.5)",
      borderRadius: 8,
    }}
  >
    <span style={{ color: "#92400E" }}>{icon}</span>
    <span style={{ fontSize: 11, color: "#92400E", fontWeight: 600, minWidth: 70 }}>
      {label}
    </span>
    <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{value}</span>
  </div>
);

const Centered = ({ children }) => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 40,
      fontFamily: "Inter, Arial, 'Helvetica Neue', sans-serif",
      background: "#F8FAFC",
    }}
  >
    {children}
  </div>
);

const titleError = { marginTop: 14, fontSize: 18, fontWeight: 700, color: "#0F1F3D" };
const textError = {
  color: "#64748B",
  marginTop: 6,
  fontSize: 13,
  textAlign: "center",
  maxWidth: 380,
};

const btnVolver = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  marginTop: 18,
  padding: "8px 18px",
  background: "#1B6FE8",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 13,
};

export default function PerfilPublicoEstudiantePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const rol = useAuthStore((state) => state.rol);
  const { perfil, isLoading, isForbidden, isNotFound, errorMessage } = usePerfilPublicoEstudiante(id);

  // Función para volver preservando la pestaña
  // Dentro del componente, después de const location = useLocation();
  const handleGoBack = () => {
    const returnTab = location.state?.returnTab || 'todos';
    const returnProyectoId = location.state?.returnProyectoId;
    const returnProyectoTitle = location.state?.returnProyectoTitle;
    
    navigate('/dashboard/mype/postulantes', { 
      state: { 
        returnTab,
        returnProyectoId,
        returnProyectoTitle
      } 
    });
  };

  if (isLoading) {
    return (
      <Centered>
        <Loader2 size={32} style={{ animation: "spin 1s linear infinite", color: "#1B6FE8" }} />
        <p style={{ marginTop: 14, color: "#64748B", fontSize: 14 }}>Cargando perfil...</p>
      </Centered>
    );
  }

  if (isNotFound) {
    return (
      <Centered>
        <AlertCircle size={44} color="#DC2626" />
        <h2 style={titleError}>Estudiante no encontrado</h2>
        <p style={textError}>El perfil que buscas no existe o fue eliminado.</p>
        <button onClick={handleGoBack} style={btnVolver}>
          <ChevronLeft size={14} /> Volver
        </button>
      </Centered>
    );
  }

  if (isForbidden) {
    return (
      <Centered>
        <ShieldAlert size={44} color="#D97706" />
        <h2 style={titleError}>No tienes acceso a este perfil</h2>
        <p style={textError}>
          {errorMessage ||
            "Solo puedes ver el perfil de un estudiante con el que estés vinculado por un proyecto."}
        </p>
        <button onClick={handleGoBack} style={btnVolver}>
          <ChevronLeft size={14} /> Volver
        </button>
      </Centered>
    );
  }

  if (!perfil) return null;

  const nombreCompleto = perfil.nombre || "Estudiante";
  const iniciales = nombreCompleto
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const skillsList = perfil.skills
    ? perfil.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const academicInfo = {
    universidad: perfil.universidad || "No especificada",
    carrera: perfil.carrera || "No especificada",
    codigo: perfil.codigoEstudiante || "No especificado",
  };

  const locationInfo = {
  ciudad: perfil.ciudad || "",
  pais: perfil.pais || "",
  sector: perfil.sector || "",
  barrio: perfil.barrio || "",
  lat: perfil.lat || null,
  lng: perfil.lng || null,
};
  const locationString = [locationInfo.barrio, locationInfo.ciudad, locationInfo.pais]
    .filter(Boolean)
    .join(", ");

  const isAdmin = rol === "ADMIN" || rol === "ROLE_ADMIN";

  const getSkillColor = (skill) => {
    const s = skill.toLowerCase().trim();
    if (["react","vue","angular","next.js","html","css","javascript","typescript","tailwind","sass"].some(k => s.includes(k)))
      return { bg: '#eff6ff', color: '#1B6FE8', border: '#bfdbfe' };
    if (["java","spring","kotlin","android"].some(k => s.includes(k)))
      return { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' };
    if (["python","django","flask","fastapi","tensorflow","pytorch"].some(k => s.includes(k)))
      return { bg: '#fefce8', color: '#ca8a04', border: '#fde68a' };
    if (["mysql","postgresql","mongodb","sql","oracle","firebase"].some(k => s.includes(k)))
      return { bg: '#f0fdf4', color: '#059669', border: '#bbf7d0' };
    if (["docker","git","linux","aws","azure","devops","kubernetes"].some(k => s.includes(k)))
      return { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' };
    return { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' };
  };

  const linkItemStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 10,
    background: "#f8fafc",
    border: "0.5px solid #e8e8e4",
    textDecoration: "none",
    transition: "all 0.2s",
  };

  const linkItemInactive = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 10,
    background: "#f8fafc",
    border: "0.5px solid #e8e8e4",
    cursor: "default",
  };

  return (
  <div
    style={{
      fontFamily: "Inter, Arial, 'Helvetica Neue', sans-serif",
      background: "#f8fafc",
      minHeight: "100vh",
      padding: "32px 36px",
      maxWidth: 1440,
      margin: "0 auto",
    }}
  >
    <button
      onClick={handleGoBack}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: 12,
        color: "#6B7280",
        fontWeight: 600,
        marginBottom: 14,
        padding: 0,
      }}
    >
      <ChevronLeft size={14} /> Volver
    </button>

    <HeroBannerPublico
      nombre={nombreCompleto}
      displayRol="Estudiante"
      academicInfo={academicInfo}
      fotoPerfil={perfil.fotoPerfil}
      iniciales={iniciales}
      usuarioId={perfil.usuarioId} 
    />

    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.9fr", gap: 24 }}>
      {/* COLUMNA IZQUIERDA */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Trayectoria Académica */}
        <Section title="Trayectoria Académica">
          <div
            style={{
              position: "relative",
              paddingLeft: 24,
              borderLeft: "2px solid #f1f5f9",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: -5,
                top: 4,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#1B6FE8",
                border: "2px solid #fff",
                boxShadow: "0 0 0 3px rgba(27,111,232,0.12)",
              }}
            />
            <div
              style={{
                padding: 16,
                background: "#f8fafc",
                borderRadius: 14,
                border: "0.5px solid #e8e8e4",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 4,
                }}
              >
                <h4
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#1B6FE8",
                    margin: 0,
                  }}
                >
                  {academicInfo.carrera}
                </h4>
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: 700,
                    color: "#059669",
                    background: "#ecfdf5",
                    border: "0.5px solid #a7f3d0",
                    padding: "3px 8px",
                    borderRadius: 20,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <CheckCircle2 size={9} /> Activo
                </span>
              </div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#0f1f3d",
                  margin: "4px 0 0",
                }}
              >
                {academicInfo.universidad}
              </p>
              <p
                style={{
                  fontSize: 10,
                  color: "#6b6b7a",
                  fontWeight: 500,
                  margin: 0,
                  marginTop: 4,
                }}
              >
                Código: {academicInfo.codigo}
              </p>
            </div>
          </div>
        </Section>

        {/* Perfil Profesional (bio) */}
        <Section title="Perfil Profesional">
          <div
            style={{
              padding: 16,
              background: "#f8fafc",
              borderRadius: 14,
              border: "0.5px solid #e8e8e4",
            }}
          >
            {perfil.bio ? (
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#334155",
                  lineHeight: 1.7,
                  margin: 0,
                  whiteSpace: "pre-wrap",
                }}
              >
                {perfil.bio}
              </p>
            ) : (
              <p
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                  fontStyle: "italic",
                  margin: 0,
                }}
              >
                Este estudiante aún no ha añadido una biografía.
              </p>
            )}
          </div>
        </Section>

        {/* Currículum Vitae (solo si existe) */}
        {perfil.cvUrl && (
          <Section title="Currículum Vitae">
            <a
              href={perfil.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 12,
                background: "#f8fafc",
                borderRadius: 12,
                border: "0.5px solid #e8e8e4",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#eff6ff";
                e.currentTarget.style.borderColor = "#bfdbfe";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f8fafc";
                e.currentTarget.style.borderColor = "#e8e8e4";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FileText size={16} color="#1B6FE8" />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#0f1f3d" }}>
                  Ver / descargar CV
                </span>
              </div>
              <ExternalLink size={12} color="#6b6b7a" />
            </a>
          </Section>
        )}

        {/* Información administrativa (solo admin) */}
        {isAdmin && (perfil.email || perfil.telefono || perfil.codigoEstudiante) && (
          <Section title="Información administrativa" admin>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {perfil.codigoEstudiante && (
                <InfoRow icon={<Hash size={13} />} label="Código" value={perfil.codigoEstudiante} />
              )}
              {perfil.email && (
                <InfoRow icon={<Mail size={13} />} label="Email" value={perfil.email} />
              )}
              {perfil.telefono && (
                <InfoRow icon={<Phone size={13} />} label="Teléfono" value={perfil.telefono} />
              )}
              {perfil.barrio && (
                <InfoRow icon={<MapPin size={13} />} label="Barrio" value={perfil.barrio} />
              )}
            </div>
          </Section>
        )}
      </div>

      {/* COLUMNA DERECHA */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Ubicación (solo texto, sin mapa) */}
        <Section title="Ubicación">
        {locationString ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 14px",
                background: "#f8fafc",
                borderRadius: 12,
                border: "0.5px solid #e8e8e4",
                marginBottom: 12,
              }}
            >
              <MapPin size={18} color="#1B6FE8" />
              <span style={{ fontSize: 13, fontWeight: 500, color: "#0f1f3d" }}>
                {locationString}
              </span>
            </div>
            {locationInfo.lat && locationInfo.lng && (
              <StaticMapWithCircle lat={locationInfo.lat} lng={locationInfo.lng} height={180} />
            )}
          </>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
              background: "#f8fafc",
              borderRadius: 12,
              border: "0.5px dashed #e2e8f0",
              color: "#94a3b8",
            }}
          >
            <MapPin size={28} strokeWidth={1.5} />
            <p style={{ fontSize: 11, fontWeight: 500, marginTop: 8, marginBottom: 0 }}>
              Sin ubicación
            </p>
          </div>
        )}
      </Section>

        {/* Habilidades */}
        <Section title="Habilidades">
          {skillsList.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {skillsList.map((skill, idx) => {
                const { bg, color, border } = getSkillColor(skill);
                return (
                  <span
                    key={idx}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 20,
                      fontSize: 10,
                      fontWeight: 700,
                      background: bg,
                      color: color,
                      border: `0.5px solid ${border}`,
                    }}
                  >
                    {skill}
                  </span>
                );
              })}
            </div>
          ) : (
            <p
              style={{
                fontSize: 11,
                color: "#94a3b8",
                fontStyle: "italic",
                margin: 0,
              }}
            >
              No se han añadido habilidades.
            </p>
          )}
        </Section>

        {/* Conectividad (LinkedIn y Portafolio) */}
        <Section title="Conectividad">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* LinkedIn */}
            {perfil.linkedinUrl ? (
              <a
                href={perfil.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={linkItemStyle}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: "#0077B5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Globe size={13} color="#fff" />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#0f1f3d" }}>
                    LinkedIn
                  </span>
                </div>
                <ExternalLink size={12} color="#6b6b7a" />
              </a>
            ) : (
              <div style={linkItemInactive}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: "#e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Globe size={13} color="#94a3b8" />
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "#94a3b8",
                      fontStyle: "italic",
                    }}
                  >
                    No vinculado
                  </span>
                </div>
              </div>
            )}

            {/* Portafolio */}
            {perfil.portafolioUrl ? (
              <a
                href={perfil.portafolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={linkItemStyle}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: "#0d1b35",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Briefcase size={13} color="#fff" />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#0f1f3d" }}>
                    Portafolio
                  </span>
                </div>
                <ExternalLink size={12} color="#6b6b7a" />
              </a>
            ) : (
              <div style={linkItemInactive}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: "#e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Briefcase size={13} color="#94a3b8" />
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "#94a3b8",
                      fontStyle: "italic",
                    }}
                  >
                    Sin portafolio
                  </span>
                </div>
              </div>
            )}
          </div>
        </Section>
      </div>
    </div>

    <style>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);
}