import { Shield, Edit3, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";

const FONT = "'Angro Std', 'Outfit', sans-serif";

export function MypeProfileHeader({ perfil, puedeEditar, onEditar }) {
  const canvasRef = useRef(null);
  const headerRef = useRef(null);

  const iniciales =
    perfil.nombreComercial
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "M";

  useEffect(() => {
    const canvas = canvasRef.current;
    const header = headerRef.current;
    if (!canvas || !header) return;

    const ctx = canvas.getContext("2d");
    let W, H, animId;
    const COLORS = ["rgba(27,111,232,", "rgba(6,182,212,", "rgba(245,158,11,"];

    const resize = () => {
      W = canvas.width = header.offsetWidth;
      H = canvas.height = header.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(header);

    class Particle {
      constructor() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = Math.random() * 0.3 + 0.1;
      }
      update() {
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

    const particles = Array.from({ length: 35 }, () => new Particle());

    const animate = () => {
      ctx.fillStyle = "rgba(13, 27, 53, 0.1)";
      ctx.fillRect(0, 0, W, H);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
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
      ref={headerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background:
          "linear-gradient(135deg, #0A1628 0%, #0F2A4A 60%, #1E3A5F 100%)",
        borderRadius: "2rem",
        padding: "44px 52px",
        position: "relative",
        overflow: "hidden",
        marginBottom: 28,
        display: "flex",
        alignItems: "center",
        gap: 36,
        flexWrap: "wrap",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      {/* Canvas de partículas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: 0.6,
        }}
      />

      {/* Dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(circle at 1px 1px,rgba(255,255,255,0.04) 1px,transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Glow orbs */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "radial-gradient(circle, #06B6D4, transparent 70%)",
          opacity: 0.1,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: 80,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, #F59E0B, transparent 70%)",
          opacity: 0.08,
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* Avatar con marco animado */}
      <div style={{ position: "relative" }}>
        <motion.div
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: -6,
            borderRadius: "1.5rem",
            background: "linear-gradient(135deg, #1B6FE8, #06B6D4, #F59E0B)",
            opacity: 0.5,
            filter: "blur(10px)",
          }}
        />
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: "1.5rem",
            background: "linear-gradient(135deg, #1B6FE8, #06B6D4)",
            border: "3px solid rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 38,
            fontWeight: 800,
            color: "#fff",
            position: "relative",
            zIndex: 1,
            fontFamily: FONT,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          }}
        >
          {iniciales}
        </div>
      </div>

      {/* Información */}
      <div style={{ flex: 1, position: "relative", zIndex: 1, minWidth: 200 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 10,
          }}
        >
          <h1
            style={{
              fontFamily: FONT,
              fontSize: "clamp(22px, 3vw, 32px)",
              fontWeight: 800,
              color: "#fff",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            {perfil.nombreComercial}
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(6,182,212,0.15)",
              border: "1px solid rgba(6,182,212,0.3)",
              borderRadius: 30,
              padding: "4px 14px",
            }}
          >
            <Shield size={13} color="#06B6D4" />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#67E8F9",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                fontFamily: FONT,
              }}
            >
              MYPE Verificada
            </span>
          </div>
        </div>

        {perfil.razonSocial && (
          <p
            style={{
              fontFamily: FONT,
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              margin: "0 0 10px",
            }}
          >
            {perfil.razonSocial}
          </p>
        )}

        {perfil.rubro && (
          <span
            style={{
              fontFamily: FONT,
              fontSize: 11,
              fontWeight: 600,
              background: "rgba(249,115,22,0.15)",
              color: "#FB923C",
              border: "1px solid rgba(249,115,22,0.25)",
              padding: "5px 14px",
              borderRadius: 30,
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Sparkles size={11} />
            {perfil.rubro}
          </span>
        )}
      </div>

      {/* Stats rápidos */}
      <div
        style={{ display: "flex", gap: 12, position: "relative", zIndex: 1 }}
      >
        <motion.div
          whileHover={{ y: -2 }}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "1rem",
            padding: "12px 20px",
            textAlign: "center",
            backdropFilter: "blur(10px)",
            minWidth: 90,
            transition: "all 0.2s",
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#06B6D4",
              lineHeight: 1,
            }}
          >
            {perfil.totalProyectos ?? 0}
          </div>
          <div
            style={{
              fontSize: 9,
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginTop: 4,
              fontWeight: 600,
            }}
          >
            Proyectos
          </div>
        </motion.div>
        <motion.div
          whileHover={{ y: -2 }}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "1rem",
            padding: "12px 20px",
            textAlign: "center",
            backdropFilter: "blur(10px)",
            minWidth: 90,
            transition: "all 0.2s",
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#F59E0B",
              lineHeight: 1,
            }}
          >
            {perfil.proyectosActivos ?? 0}
          </div>
          <div
            style={{
              fontSize: 9,
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginTop: 4,
              fontWeight: 600,
            }}
          >
            Activos
          </div>
        </motion.div>
      </div>

      {/* Botón editar — solo si es propietario */}
      {puedeEditar && onEditar && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={onEditar}
          style={{
            fontFamily: FONT,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 22px",
            borderRadius: "0.75rem",
            fontSize: 13,
            fontWeight: 600,
            background: "rgba(255,255,255,0.1)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.2)",
            cursor: "pointer",
            transition: "all 0.2s",
            position: "relative",
            zIndex: 1,
            backdropFilter: "blur(8px)",
          }}
          whileHover={{
            background: "rgba(255,255,255,0.2)",
            y: -2,
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Edit3 size={15} /> Editar perfil
        </motion.button>
      )}

      {/* Línea inferior decorativa */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background:
            "linear-gradient(90deg, transparent, #1B6FE8, #06B6D4, #F59E0B, transparent)",
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
}
