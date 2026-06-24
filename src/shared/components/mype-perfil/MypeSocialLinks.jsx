import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp, FaGlobe } from "react-icons/fa";

const FONT = "'Inter', 'Outfit', sans-serif";

export function MypeSocialLinks({ perfil, variant = "compact" }) {
  const links = [];

  if (perfil.instagram) {
    const url = perfil.instagram.startsWith("http") ? perfil.instagram : `https://instagram.com/${perfil.instagram.replace("@", "")}`;
    links.push({ icon: FaInstagram, label: "Instagram", url, displayLabel: perfil.instagram });
  }

  if (perfil.facebook) {
    const url = perfil.facebook.startsWith("http") ? perfil.facebook : `https://facebook.com/${perfil.facebook.replace("@", "")}`;
    links.push({ icon: FaFacebook, label: "Facebook", url, displayLabel: perfil.facebook });
  }

  if (perfil.tiktok) {
    const url = perfil.tiktok.startsWith("http") ? perfil.tiktok : `https://tiktok.com/@${perfil.tiktok.replace("@", "")}`;
    links.push({ icon: FaTiktok, label: "TikTok", url, displayLabel: perfil.tiktok });
  }

  if (perfil.whatsapp) {
    const url = `https://wa.me/${perfil.whatsapp.replace(/\D/g, "")}`;
    links.push({ icon: FaWhatsapp, label: "WhatsApp", url, displayLabel: "Contacto directo" });
  }

  if (perfil.sitioWeb) {
    links.push({ icon: FaGlobe, label: "Web Central", url: perfil.sitioWeb, displayLabel: perfil.sitioWeb.replace(/^https?:\/\//, "") });
  }

  if (links.length === 0) return null;

  const isCompact = variant === "compact";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: "13px",
              color: isCompact ? "#a1a1aa" : "#71717a",
              textDecoration: "none",
              background: isCompact ? "transparent" : "#ffffff",
              border: isCompact ? "none" : "1px solid #e4e4e7",
              padding: isCompact ? "4px 8px 4px 0" : "8px 16px",
              borderRadius: isCompact ? "4px" : "8px",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              fontWeight: 500,
              fontFamily: FONT,
              boxShadow: isCompact ? "none" : "0 1px 2px rgba(0,0,0,0.02)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#09090b";
              e.currentTarget.style.borderColor = "#09090b";
              if(!isCompact) e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = isCompact ? "#a1a1aa" : "#71717a";
              e.currentTarget.style.borderColor = isCompact ? "transparent" : "#e4e4e7";
              if(!isCompact) e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.02)";
            }}
          >
            <Icon size={14} style={{ color: "currentColor", opacity: 0.9 }} />
            {isCompact ? null : link.displayLabel || link.label}
          </a>
        );
      })}
    </div>
  );
}