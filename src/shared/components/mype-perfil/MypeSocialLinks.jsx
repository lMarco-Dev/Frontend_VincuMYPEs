import {
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaWhatsapp,
  FaGlobe,
} from "react-icons/fa";

const FONT = "'Angro Std', 'Outfit', sans-serif";

export function MypeSocialLinks({ perfil, variant = "compact" }) {
  const links = [];

  // Instagram
  if (perfil.instagram) {
    const url = perfil.instagram.startsWith("http")
      ? perfil.instagram
      : `https://instagram.com/${perfil.instagram.replace("@", "")}`;
    links.push({
      icon: FaInstagram,
      label: "Instagram",
      url,
      color: "#E1306C",
    });
  }

  // Facebook
  if (perfil.facebook) {
    const url = perfil.facebook.startsWith("http")
      ? perfil.facebook
      : `https://facebook.com/${perfil.facebook.replace("@", "")}`;
    links.push({ icon: FaFacebook, label: "Facebook", url, color: "#1877F2" });
  }

  // TikTok
  if (perfil.tiktok) {
    const url = perfil.tiktok.startsWith("http")
      ? perfil.tiktok
      : `https://tiktok.com/@${perfil.tiktok.replace("@", "")}`;
    links.push({ icon: FaTiktok, label: "TikTok", url, color: "#111827" });
  }

  // WhatsApp
  if (perfil.whatsapp) {
    const url = `https://wa.me/${perfil.whatsapp.replace(/\D/g, "")}`;
    links.push({ icon: FaWhatsapp, label: "WhatsApp", url, color: "#25D366" });
  }

  // Sitio web
  if (perfil.sitioWeb) {
    links.push({
      icon: FaGlobe,
      label: "Sitio web",
      url: perfil.sitioWeb,
      color: "#6B7280",
      displayLabel: perfil.sitioWeb.replace(/^https?:\/\//, ""),
    });
  }

  if (links.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
        marginBottom: 20,
      }}
    >
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
              fontSize: variant === "compact" ? 11 : 13,
              color:
                variant === "compact" ? "rgba(255,255,255,0.6)" : link.color,
              textDecoration: "none",
              background:
                variant === "compact"
                  ? "rgba(255,255,255,0.08)"
                  : `${link.color}12`,
              border:
                variant === "compact"
                  ? "1px solid rgba(255,255,255,0.12)"
                  : `1px solid ${link.color}25`,
              padding: variant === "compact" ? "6px 14px" : "8px 16px",
              borderRadius: 40,
              transition: "all 0.2s",
              fontWeight: 500,
              fontFamily: FONT,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color =
                variant === "compact" ? "#fff" : link.color;
              e.currentTarget.style.background =
                variant === "compact"
                  ? "rgba(255,255,255,0.15)"
                  : `${link.color}20`;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                variant === "compact" ? "rgba(255,255,255,0.6)" : link.color;
              e.currentTarget.style.background =
                variant === "compact"
                  ? "rgba(255,255,255,0.08)"
                  : `${link.color}12`;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <Icon size={variant === "compact" ? 12 : 14} />
            {variant === "compact"
              ? link.label
              : link.displayLabel || link.label}
          </a>
        );
      })}
    </div>
  );
}
