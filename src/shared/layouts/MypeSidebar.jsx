import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  CheckCircle,
  Award,
  MessageSquare,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { clsx } from "clsx";
import { queryClient } from "../api/queryClient";

const FONT = "'Angro Std', 'Outfit', sans-serif";

const NAV = [
  {
    label: "Principal",
    items: [
      { to: "/dashboard/mype", icon: LayoutDashboard, label: "Dashboard" },
      {
        to: "/dashboard/mype/proyectos",
        icon: Briefcase,
        label: "Mis proyectos",
      },
      {
        to: "/dashboard/mype/postulantes",
        icon: Users,
        label: "Postulantes",
        badge: true,
      },
    ],
  },
  {
    label: "Gestión",
    items: [
      {
        to: "/dashboard/mype/ejecucion",
        icon: CheckCircle,
        label: "En ejecución",
      },
      {
        to: "/dashboard/mype/certificados",
        icon: Award,
        label: "Certificados",
      },
      {
        to: "/dashboard/mype/mensajes",
        icon: MessageSquare,
        label: "Mensajes",
      },
    ],
  },
  {
    label: "Cuenta",
    items: [
      { to: "/dashboard/mype/perfil", icon: UserCircle, label: "Mi perfil" },
      {
        to: "/dashboard/mype/configuracion",
        icon: Settings,
        label: "Configuración",
      },
    ],
  },
];

function NavItem({ to, icon: Icon, label, badge }) {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      style={{ fontFamily: FONT }}
      className={clsx(
        "flex items-center gap-2 px-2.5 py-[7px] rounded-lg text-[12px] transition-all duration-150 mb-[2px] border no-underline",
        active
          ? "bg-[rgba(27,111,232,0.18)] text-white border-[rgba(27,111,232,0.3)] font-semibold"
          : "text-white/45 hover:bg-white/[0.06] hover:text-white/80 border-transparent",
      )}
    >
      <Icon
        size={15}
        className={clsx("shrink-0", active && "text-[#06B6D4]")}
      />
      <span className="flex-1">{label}</span>
      {badge && (
        <span
          style={{
            background: "rgba(249,115,22,0.2)",
            color: "#FB923C",
            border: "1px solid rgba(249,115,22,0.3)",
            fontSize: 9,
            fontWeight: 700,
            padding: "1px 6px",
            borderRadius: 10,
          }}
        >
          •
        </span>
      )}
    </Link>
  );
}

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const initials =
    user?.nombre
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";

  const handleLogout = () => {
    queryClient.clear();
    logout();
    navigate("/login");
  };

  return (
    <aside
      style={{
        width: 210,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(170deg,#081828 0%,#0F2A4A 60%,#0C3260 100%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: FONT,
      }}
    >
      {/* Dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 1px 1px,rgba(255,255,255,0.045) 1px,transparent 0)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Glow orbe */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle,#06B6D4,transparent 70%)",
          opacity: 0.12,
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Logo */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "16px 14px 12px",
          borderBottom: "0.5px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          style={{ width: 26, height: 26, flexShrink: 0 }}
        >
          <path d="M20 15 L50 85 L65 85 L35 15 Z" fill="#1B6FE8" />
          <path
            d="M80 15 L50 85 L35 85 L65 15 Z"
            fill="#06B6D4"
            opacity="0.9"
          />
          <circle cx="50" cy="85" r="8" fill="#F97316" />
        </svg>
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: -0.3,
          }}
        >
          Vincu<span style={{ color: "#06B6D4" }}>MYPEs</span>
        </span>
      </div>

      {/* Usuario */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "10px 14px",
          borderBottom: "0.5px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            flexShrink: 0,
            background: "linear-gradient(135deg,#1B6FE8,#06B6D4)",
            border: "1.5px solid rgba(6,182,212,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          {initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "rgba(255,255,255,0.85)",
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user?.nombre}
          </p>
          <p
            style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", margin: 0 }}
          >
            MYPE · Cuenta activa
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          padding: "10px 8px",
          overflowY: "auto",
        }}
      >
        {NAV.map((section) => (
          <div key={section.label} style={{ marginBottom: 16 }}>
            <p
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "rgba(255,255,255,0.25)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                padding: "0 8px",
                marginBottom: 4,
                margin: "0 0 4px",
              }}
            >
              {section.label}
            </p>
            {section.items.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: 8,
          borderTop: "0.5px solid rgba(255,255,255,0.07)",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            fontFamily: FONT,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 10px",
            borderRadius: 8,
            fontSize: 12,
            color: "rgba(255,255,255,0.3)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            width: "100%",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.6)";
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.3)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <LogOut size={15} /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
