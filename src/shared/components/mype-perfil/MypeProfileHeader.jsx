import { Edit3, Camera, Upload, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { httpClient } from "@/shared/api/httpClient";

const FONT = "'Inter', 'Outfit', sans-serif";

export function MypeProfileHeader({ perfil, puedeEditar, onEditar }) {
  const canvasRef = useRef(null);
  const headerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(perfil.fotoPerfil || null);
  const [isUploading, setIsUploading] = useState(false);

  const iniciales = perfil.nombreComercial
    ?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() ?? "M";

  // Sincronizar si el perfil cambia externamente
  useEffect(() => {
    if (perfil.fotoPerfil) {
      setAvatarPreview(perfil.fotoPerfil);
    }
  }, [perfil.fotoPerfil]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const header = headerRef.current;
    if (!canvas || !header) return;
    const ctx = canvas.getContext("2d");
    let W, H, animId;
    const COLORS = ["rgba(255,255,255,"];
    const resize = () => { W = canvas.width = header.offsetWidth; H = canvas.height = header.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(header);
    class Particle {
      constructor() {
        this.x = Math.random() * W; this.y = Math.random() * H;
        this.size = Math.random() * 1.5;
        this.speedX = (Math.random() - 0.5) * 0.1; this.speedY = (Math.random() - 0.5) * 0.1;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = Math.random() * 0.05 + 0.02;
      }
      update() { this.x += this.speedX; this.y += this.speedY; if (this.x < 0 || this.x > W) this.speedX *= -1; if (this.y < 0 || this.y > H) this.speedY *= -1; }
      draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fillStyle = this.color + this.alpha + ")"; ctx.fill(); }
    }
    const particles = Array.from({ length: 40 }, () => new Particle());
    const animate = () => { ctx.clearRect(0, 0, W, H); particles.forEach((p) => { p.update(); p.draw(); }); animId = requestAnimationFrame(animate); };
    animate();
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);

  const uploadPhoto = async (file) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file, "profile.jpg");
      const res = await httpClient.post("/mypes/upload-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.url;
    } catch (error) { return null; }
    finally { setIsUploading(false); }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Mostrar preview inmediato
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
    
    // Subir al backend
    const uploadedUrl = await uploadPhoto(file);
    if (uploadedUrl) {
      setAvatarPreview(uploadedUrl);
      perfil.fotoPerfil = uploadedUrl;
    }
  };

  return (
    <motion.div
      ref={headerRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: "linear-gradient(135deg, #0A1628 0%, #0F2A4A 55%, #152642 100%)",
        borderRadius: "20px", padding: "44px 48px", position: "relative",
        overflow: "hidden", marginBottom: "32px", display: "flex",
        alignItems: "center", gap: 32, flexWrap: "wrap",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 24px 48px -12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle at 1px 1px,rgba(255,255,255,0.06) 1px,transparent 0)", backgroundSize: "32px 32px", zIndex: 1 }} />
      <div style={{ position: "absolute", top: -120, right: -60, width: 450, height: 450, background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none", zIndex: 0 }} />

      {/* Avatar con upload automático */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <div onClick={() => !isUploading && fileInputRef.current?.click()}
          style={{
            width: 120, height: 120, borderRadius: "14px",
            background: avatarPreview ? `url(${avatarPreview}) center/cover` : "#ffffff",
            border: "2px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "42px", fontWeight: 700,
            color: avatarPreview ? "transparent" : "#0A1628",
            fontFamily: FONT, cursor: isUploading ? "wait" : "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1), 0 20px 30px -8px rgba(0,0,0,0.4)",
            position: "relative", overflow: "hidden", transition: "all 0.2s ease",
            opacity: isUploading ? 0.7 : 1,
          }}
        >
          {isUploading ? (
            <Loader2 size={32} color="#0A1628" className="animate-spin" />
          ) : !avatarPreview ? (
            iniciales
          ) : null}
          
          {!isUploading && (
            <div style={{
              position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
              opacity: 0, transition: "opacity 0.2s ease", borderRadius: "14px",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "0"; }}
            >
              {avatarPreview ? (
                <><Upload size={24} color="#FFFFFF" /><span style={{ fontFamily: FONT, fontSize: 10, color: "#FFFFFF", fontWeight: 500 }}>Cambiar foto</span></>
              ) : (
                <><Camera size={24} color="#FFFFFF" /><span style={{ fontFamily: FONT, fontSize: 10, color: "#FFFFFF", fontWeight: 500 }}>Subir foto</span></>
              )}
            </div>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileSelect} />
      </div>

      <div style={{ flex: 1, position: "relative", zIndex: 2, minWidth: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: "8px" }}>
          <h1 style={{ fontFamily: FONT, fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 600, color: "#ffffff", margin: 0, letterSpacing: "-0.5px" }}>{perfil.nombreComercial}</h1>
        </div>
        {perfil.razonSocial && <p style={{ fontFamily: FONT, fontSize: "14px", fontWeight: 400, color: "#a1a1aa", margin: "0 0 16px 0", letterSpacing: "-0.2px" }}>{perfil.razonSocial}</p>}
        {perfil.rubro && <span style={{ fontFamily: FONT, fontSize: "12px", fontWeight: 500, color: "#94A3B8" }}>{perfil.rubro}</span>}
      </div>

      {puedeEditar && onEditar && (
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          onClick={onEditar}
          whileHover={{ background: "#f4f4f5", color: "#09090b", borderColor: "#e4e4e7" }}
          style={{
            fontFamily: FONT, display: "flex", alignItems: "center", gap: "8px",
            height: "42px", padding: "0 20px", borderRadius: "8px", fontSize: "13px",
            fontWeight: 500, background: "#ffffff", color: "#09090b",
            border: "1px solid transparent", cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            position: "relative", zIndex: 2, boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          }}
        ><Edit3 size={15} /> Editar perfil</motion.button>
      )}
    </motion.div>
  );
}