// src/shared/layouts/AdminSidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { queryClient } from "@/shared/api/queryClient";
import { Logo } from "@/shared/ui/Logo";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  History,
  BarChart,
  Settings,
  Award,
  LogOut,
  ShieldCheck,
  UserCheck,
  Star,
  Building2,
} from "lucide-react";
import { clsx } from "clsx";
import { useSidebarBadges } from "@/shared/hooks/useSidebarBadges";

const FONT = "'Angro Std', 'Outfit', sans-serif";

const getNAV = (badges) => [
  {
    label: "Principal",
    items: [
      { to: "/admin/dashboard", icon: LayoutDashboard, label: "Panel de Control" },
      { to: "/admin/proyectos", icon: FolderKanban, label: "Proyectos", showDot: badges.proyectosMype, dotColor: '#F59E0B' },
      { to: "/admin/usuarios", icon: Users, label: "Usuarios" },
    ],
  },
  {
    label: "Gestión",
    items: [
      { to: "/admin/mypes-pendientes", icon: Building2, label: "Validar MYPEs", showDot: badges.mypesPendientes, dotColor: '#F59E0B' },
      { to: "/admin/postulaciones", icon: UserCheck, label: "Postulaciones", showDot: badges.postulaciones, dotColor: '#3B82F6' },
      { to: "/admin/calificaciones", icon: Star, label: "Calificaciones" },
      { to: "/admin/certificados", icon: Award, label: "Certificados" },
      { to: "/admin/auditoria", icon: History, label: "Auditoría" },
      { to: "/admin/reportes", icon: BarChart, label: "Reportes" },
      { to: "/admin/configuracion", icon: Settings, label: "Configuración" },
    ],
  },
];

function NavItem({ to, icon: Icon, label, showDot, dotColor }) {
  const { pathname } = useLocation();
  const active = pathname === to || pathname.startsWith(to + "/");

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
      <Icon size={15} className={clsx("shrink-0", active && "text-[#06B6D4]")} />
      <span className="flex-1">{label}</span>
      {showDot && (
        <span style={{
          width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
          background: dotColor,
          boxShadow: `0 0 6px ${dotColor}99`,
        }} />
      )}
    </Link>
  );
}

export default function AdminSidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const badges = useSidebarBadges();
  const NAV = getNAV(badges);

  const initials =
    user?.nombre
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "A";

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
          "linear-gradient(170deg, #0A1628 0%, #0F2A4A 60%, #0C3260 100%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: FONT,
      }}
    >
      {/* Dot grid decorativo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.045) 1px, transparent 0)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Glow orbes */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, #06B6D4, transparent 70%)",
          opacity: 0.12,
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: -60,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "radial-gradient(circle, #A855F7, transparent 70%)",
          opacity: 0.08,
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
        <Logo />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.5px",
          }}
        >
          ADMIN
        </span>
      </div>

      {/* Info del Administrador */}
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
            background: "linear-gradient(135deg, #7C3AED, #A855F7)",
            border: "1.5px solid rgba(168,85,247,0.35)",
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
            {user?.nombre || "Administrador"}
          </p>
          <p
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.35)",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <ShieldCheck size={10} style={{ color: "#A855F7" }} />
            Super Admin
          </p>
        </div>
      </div>

      {/* Navegación */}
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

      {/* Botón de Cerrar Sesión */}
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
