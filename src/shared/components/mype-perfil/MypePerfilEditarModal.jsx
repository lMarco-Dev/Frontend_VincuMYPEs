import { useState } from "react";
import { motion } from "framer-motion";
import { useActualizarMypePerfil } from "@/features/mype-perfil/useMypePerfil";
import {
  Loader2,
  Save,
  X,
  MapPin,
  Phone,
  Mail,
  Building2,
  Globe,
} from "lucide-react";
// Importa los iconos de react-icons
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp } from "react-icons/fa";

const FONT = "'Angro Std', 'Outfit', sans-serif";

export function MypePerfilEditarModal({ perfil, onClose }) {
  const { actualizar, isLoading, error } = useActualizarMypePerfil(perfil.id);
  const [form, setForm] = useState({
    rubro: perfil.rubro ?? "",
    descripcion: perfil.descripcion ?? "",
    sitioWeb: perfil.sitioWeb ?? "",
    instagram: perfil.instagram ?? "",
    facebook: perfil.facebook ?? "",
    tiktok: perfil.tiktok ?? "",
    whatsapp: perfil.whatsapp ?? "",
    direccion: perfil.direccion ?? "",
    telefono: perfil.telefono ?? "",
    emailContacto: perfil.emailContacto ?? "",
  });

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const inputSt = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    fontFamily: FONT,
    fontSize: 13,
    border: "1px solid #E5E7EB",
    outline: "none",
    background: "#fff",
    color: "#111827",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  const lbl = {
    fontFamily: FONT,
    fontSize: 11,
    fontWeight: 700,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    display: "block",
    marginBottom: 6,
  };

  const secTitle = {
    fontFamily: FONT,
    fontSize: 11,
    fontWeight: 700,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: "0 0 12px",
    paddingTop: 8,
    borderTop: "0.5px solid #E5E7EB",
  };

  const handleSubmit = () => {
    actualizar(form, { onSuccess: onClose });
  };

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
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: "#fff",
          borderRadius: "1.5rem",
          width: "100%",
          maxWidth: 580,
          maxHeight: "92vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
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
            padding: "18px 24px",
            borderBottom: "0.5px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: FONT,
                fontSize: 16,
                fontWeight: 800,
                color: "#0F1F3D",
                margin: 0,
              }}
            >
              Editar perfil de empresa
            </h2>
            <p
              style={{
                fontFamily: FONT,
                fontSize: 12,
                color: "#9CA3AF",
                margin: "2px 0 0",
              }}
            >
              Los cambios serán visibles públicamente
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#9CA3AF",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Información pública */}
            <div>
              <label style={lbl}>Rubro / Sector</label>
              <input
                value={form.rubro}
                onChange={set("rubro")}
                style={inputSt}
                placeholder="Ej: Tecnología, Restaurante, Comercio"
              />
            </div>

            <div>
              <label style={lbl}>Descripción de la empresa</label>
              <textarea
                rows={3}
                value={form.descripcion}
                onChange={set("descripcion")}
                style={{ ...inputSt, resize: "vertical" }}
                placeholder="Cuéntanos sobre tu empresa: misión, qué ofrecen..."
              />
            </div>

            {/* Redes sociales */}
            <p style={secTitle}>Redes sociales (públicas)</p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <label
                  style={{
                    ...lbl,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <FaInstagram size={12} color="#E1306C" /> Instagram
                </label>
                <input
                  value={form.instagram}
                  onChange={set("instagram")}
                  style={inputSt}
                  placeholder="@usuario o URL"
                />
              </div>
              <div>
                <label
                  style={{
                    ...lbl,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <FaFacebook size={12} color="#1877F2" /> Facebook
                </label>
                <input
                  value={form.facebook}
                  onChange={set("facebook")}
                  style={inputSt}
                  placeholder="@página o URL"
                />
              </div>
              <div>
                <label
                  style={{
                    ...lbl,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <FaTiktok size={12} color="#111827" /> TikTok
                </label>
                <input
                  value={form.tiktok}
                  onChange={set("tiktok")}
                  style={inputSt}
                  placeholder="@usuario o URL"
                />
              </div>
              <div>
                <label
                  style={{
                    ...lbl,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <FaWhatsapp size={12} color="#25D366" /> WhatsApp
                </label>
                <input
                  value={form.whatsapp}
                  onChange={set("whatsapp")}
                  style={inputSt}
                  placeholder="+51 976 543 210"
                />
              </div>
              <div>
                <label
                  style={{
                    ...lbl,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <Globe size={12} color="#6B7280" /> Sitio web
                </label>
                <input
                  value={form.sitioWeb}
                  onChange={set("sitioWeb")}
                  style={inputSt}
                  placeholder="https://miempresa.com"
                />
              </div>
            </div>

            {/* Datos privados */}
            <p style={secTitle}>Datos de contacto (privados)</p>

            <div>
              <label style={lbl}>Dirección</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MapPin size={16} color="#9CA3AF" />
                <input
                  value={form.direccion}
                  onChange={set("direccion")}
                  style={inputSt}
                  placeholder="Jr. Amazonas 123, Cajamarca"
                />
              </div>
            </div>

            <div>
              <label style={lbl}>Teléfono</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Phone size={16} color="#9CA3AF" />
                <input
                  value={form.telefono}
                  onChange={set("telefono")}
                  style={inputSt}
                  placeholder="+51 976 543 210"
                />
              </div>
            </div>

            <div>
              <label style={lbl}>Email de contacto</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Mail size={16} color="#9CA3AF" />
                <input
                  type="email"
                  value={form.emailContacto}
                  onChange={set("emailContacto")}
                  style={inputSt}
                  placeholder="contacto@empresa.com"
                />
              </div>
            </div>

            {error && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 8,
                  padding: "10px 14px",
                }}
              >
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: 12,
                    color: "#DC2626",
                    margin: 0,
                  }}
                >
                  {error}
                </p>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            padding: "14px 24px",
            borderTop: "0.5px solid #E5E7EB",
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            disabled={isLoading}
            style={{
              fontFamily: FONT,
              padding: "0 20px",
              height: 40,
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
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              fontFamily: FONT,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "0 20px",
              height: 40,
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
                Guardando...
              </>
            ) : (
              <>
                <Save size={14} /> Guardar cambios
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
