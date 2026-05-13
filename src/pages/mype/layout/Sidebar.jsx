import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Logo } from "@/shared/ui/Logo";
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

const NAV = [
  {
    label: "Principal",
    items: [
      {
        to: "/dashboard/mype",
        icon: LayoutDashboard,
        label: "Dashboard",
      },
      {
        to: "/dashboard/mype/proyectos",
        icon: Briefcase,
        label: "Mis proyectos",
      },
      {
        to: "/dashboard/mype/postulantes",
        icon: Users,
        label: "Postulantes",
      },
    ],
  },
  {
    label: "Gestion",
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
      {
        to: "/dashboard/mype/perfil",
        icon: UserCircle,
        label: "Mi perfil",
      },
      {
        to: "/dashboard/mype/configuracion",
        icon: Settings,
        label: "Configuración",
      },
    ],
  },
];

function NavItem({ to, icon: Icon, label }) {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      className={clsx(
        "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 mb-0.5",
        active
          ? "bg-white/12 text-white font-medium"
          : "text-white/55 hover:bg-white/7 hover:text-white/85",
      )}
    >
      <Icon size={17} className="shrink-0" />
      {label}
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
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-[220px] bg-primary flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/8">
        <Logo />
      </div>

      {/* Usuario */}
      <div className="px-4 py-3.5 border-b border-white/8 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-medium shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-white/90 text-xs font-medium truncate">
            {user?.nombre}
          </p>
          <p className="text-white/40 text-[11px]">MYPE</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        {NAV.map((section) => (
          <div key={section.label} className="mb-5">
            <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider px-2 mb-1">
              {section.label}
            </p>
            {section.items.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-white/8">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all w-full"
        >
          <LogOut size={17} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
