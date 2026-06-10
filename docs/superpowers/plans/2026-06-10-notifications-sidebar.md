# Notificaciones y Sidebar — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corregir el sonido de notificaciones, mover la campanita al layout del estudiante, rediseñar el sidebar estudiante al estilo dark gradient del MYPE, y agregar puntos de notificación dinámicos en los tres sidebars.

**Architecture:** Hook centralizado `useSidebarBadges` que agrega lógica de badges desde `useNotificaciones` (por tipo) y localStorage (última visita a /proyectos). La función `playNotificationSound` se extrae a un módulo compartido. La campanita vive en el `StudentLayout` como topbar permanente.

**Tech Stack:** React 18, React Router v6, Zustand, TanStack Query v5, Framer Motion, lucide-react, inline styles + Tailwind CSS.

---

## Mapa de archivos

| Acción | Archivo |
|---|---|
| **Crear** | `src/shared/lib/notificationSound.js` |
| **Crear** | `src/shared/hooks/useSidebarBadges.js` |
| **Modificar** | `src/store/authStore.js` |
| **Modificar** | `src/features/notificaciones/useNotificaciones.js` |
| **Modificar** | `src/features/notificaciones/useNotificacionesSocket.js` |
| **Modificar** | `src/features/notificaciones/NotificacionesPanel.jsx` |
| **Modificar** | `src/shared/layouts/StudentLayout.jsx` |
| **Modificar** | `src/pages/estudiante/EstudianteDashboardPage.jsx` |
| **Modificar** | `src/shared/layouts/MypeSidebar.jsx` |
| **Modificar** | `src/shared/layouts/AdminSidebar.jsx` |

---

## Task 1: Extraer `playNotificationSound` a módulo compartido

**Files:**
- Create: `src/shared/lib/notificationSound.js`
- Modify: `src/features/notificaciones/useNotificacionesSocket.js`

- [ ] **Step 1: Crear `src/shared/lib/notificationSound.js`**

```js
export function playNotificationSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContext.resume();
    const playTone = (frequency, duration, startTime, volume = 0.2) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, startTime);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    const now = audioContext.currentTime;
    playTone(880, 0.15, now, 0.2);
    playTone(1108.73, 0.15, now + 0.12, 0.2);
    playTone(1318.51, 0.25, now + 0.24, 0.25);
    setTimeout(() => audioContext.close(), 800);
  } catch (e) {}
}
```

- [ ] **Step 2: Actualizar `useNotificacionesSocket.js` para importar desde el módulo compartido**

Reemplazar el contenido completo del archivo con:

```js
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { playNotificationSound } from '@shared/lib/notificationSound';

export function useNotificacionesSocket(userId) {
  const queryClient = useQueryClient();
  const wsRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    let reconnectTimer;
    let isConnected = false;

    const connect = () => {
      if (isConnected) return;
      try {
        const ws = new WebSocket('ws://localhost:8080/ws/websocket');
        wsRef.current = ws;

        ws.onopen = () => {
          isConnected = true;
          ws.send(JSON.stringify({
            type: 'SUBSCRIBE',
            destination: `/user/queue/notificaciones`,
          }));
        };

        ws.onmessage = (event) => {
          try {
            const notificacion = JSON.parse(event.data);
            queryClient.setQueryData(['notificaciones'], (oldData) => {
              if (!oldData) return [notificacion];
              return [notificacion, ...oldData];
            });
            playNotificationSound();
          } catch (e) {}
        };

        ws.onclose = () => {
          isConnected = false;
          reconnectTimer = setTimeout(connect, 5000);
        };

        ws.onerror = () => {};
      } catch (error) {
        reconnectTimer = setTimeout(connect, 5000);
      }
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (wsRef.current) wsRef.current.close();
    };
  }, [userId, queryClient]);
}
```

- [ ] **Step 3: Verificar que el módulo funciona**

Abrir la consola del navegador. Ir a `/dashboard/estudiante`. No debe haber errores de importación. El WebSocket intenta conectar a `ws://localhost:8080/ws/websocket` (puede fallar si el backend no está activo — eso es esperado).

- [ ] **Step 4: Commit**

```bash
git add src/shared/lib/notificationSound.js src/features/notificaciones/useNotificacionesSocket.js
git commit -m "refactor: extraer playNotificationSound a módulo compartido"
```

---

## Task 2: Guardar timestamp de logout en authStore

**Files:**
- Modify: `src/store/authStore.js`

- [ ] **Step 1: Agregar `localStorage.setItem` al inicio de la función `logout`**

En `src/store/authStore.js`, localizar la función `logout: () => {` (línea ~40). Agregar la siguiente línea como **primera instrucción** dentro del bloque, antes de todo lo demás:

```js
logout: () => {
  localStorage.setItem('vm_last_logout', Date.now().toString()); // ← agregar esta línea
  const refreshToken = tokenStorage.getRefreshToken();
  // ... resto del código sin cambios
```

El archivo completo actualizado queda así:

```js
import { queryClient } from "@/shared/api/queryClient";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { tokenStorage } from "@/shared/api/tokenStorage";
import { httpClient } from "@/shared/api/httpClient";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      rol: null,
      isAuthenticated: false,

      login: (data) => {
        const { token, nombre, rol, email, usuarioId, refreshToken } = data;
        const rolNormalizado = rol?.startsWith("ROLE_") ? rol.substring(5) : rol;
        if (token) tokenStorage.setTokens(token, refreshToken);
        set({
          token,
          user: { nombre, email, id: usuarioId },
          rol: rolNormalizado,
          isAuthenticated: true,
        });
      },

      setUser: (data) => {
        const { token, id, rol, refreshToken } = data;
        const rolNormalizado = rol?.startsWith("ROLE_") ? rol.substring(5) : rol;
        const currentUser = get().user || {};
        if (token) tokenStorage.setTokens(token, refreshToken);
        set((state) => ({
          token: token ?? state.token,
          user: { ...currentUser, id },
          rol: rolNormalizado ?? state.rol,
          isAuthenticated: true,
        }));
      },

      logout: () => {
        localStorage.setItem('vm_last_logout', Date.now().toString());
        const refreshToken = tokenStorage.getRefreshToken();
        if (refreshToken) {
          httpClient
            .post("/auth/logout", { refreshToken })
            .catch(() => {});
        }
        queryClient.clear();
        tokenStorage.clearTokens();
        set({
          token: null,
          user: null,
          rol: null,
          isAuthenticated: false,
        });
      },
    }),
    { name: "vincumypes-auth" }
  ),
);
```

- [ ] **Step 2: Verificar manualmente**

1. Iniciar sesión como estudiante.
2. Hacer clic en "Cerrar sesión".
3. En la consola del navegador, ejecutar: `localStorage.getItem('vm_last_logout')`.
4. Debe devolver un string numérico (timestamp en ms), ej: `"1749600000000"`.

- [ ] **Step 3: Commit**

```bash
git add src/store/authStore.js
git commit -m "feat: guardar timestamp de último logout para control de sonido"
```

---

## Task 3: Corregir lógica de sonido en `useNotificaciones`

**Files:**
- Modify: `src/features/notificaciones/useNotificaciones.js`

- [ ] **Step 1: Reemplazar el contenido completo del archivo**

```js
import { httpClient } from "@shared/api/httpClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { playNotificationSound } from "@shared/lib/notificationSound";

export function useNotificaciones() {
  const hasCheckedRef = useRef(false);

  const query = useQuery({
    queryKey: ["notificaciones"],
    queryFn: async () => {
      const response = await httpClient.get("/notificaciones");
      return response.data?.data || response.data || [];
    },
    refetchInterval: 5000,
    staleTime: 10000,
  });

  useEffect(() => {
    if (hasCheckedRef.current) return;
    if (!query.data) return;

    hasCheckedRef.current = true;

    const lastLogout = localStorage.getItem('vm_last_logout');
    if (!lastLogout) return;

    const hasNew = query.data.some(
      (n) => !n.leida && new Date(n.fechaCreacion) > new Date(Number(lastLogout))
    );

    if (hasNew) playNotificationSound();

    localStorage.removeItem('vm_last_logout');
  }, [query.data]);

  return query;
}

export function useLeerNotificacion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await httpClient.patch(`/notificaciones/${id}/leer`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
    },
  });
}

export function useEliminarNotificacion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await httpClient.delete(`/notificaciones/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
    },
  });
}
```

- [ ] **Step 2: Verificar escenario "sin notifs nuevas"**

1. Marcar todas las notificaciones como leídas.
2. Cerrar sesión (se guarda `vm_last_logout`).
3. Iniciar sesión nuevamente.
4. El sonido **no** debe sonar.
5. En consola: `localStorage.getItem('vm_last_logout')` debe devolver `null` (se borró después del check).

- [ ] **Step 3: Verificar escenario "con notifs nuevas desde logout"**

Para simular: después del logout, editar manualmente el timestamp en localStorage a uno muy antiguo:
```js
localStorage.setItem('vm_last_logout', '1000000000000'); // fecha pasada
```
Luego iniciar sesión. Si hay notificaciones no leídas, el sonido **debe** sonar una vez.

- [ ] **Step 4: Commit**

```bash
git add src/features/notificaciones/useNotificaciones.js
git commit -m "fix: sonido de notificación solo al login con notifs nuevas o por WebSocket"
```

---

## Task 4: Crear hook `useSidebarBadges`

**Files:**
- Create: `src/shared/hooks/useSidebarBadges.js`

- [ ] **Step 1: Crear el archivo**

```js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useNotificaciones } from '@/features/notificaciones/useNotificaciones';

export function useSidebarBadges() {
  const { data: notificaciones = [] } = useNotificaciones();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Registrar visita a /proyectos para resetear el badge
  useEffect(() => {
    if (location.pathname === '/proyectos') {
      localStorage.setItem('vm_last_visit_proyectos', Date.now().toString());
    }
  }, [location.pathname]);

  // Badge "Explorar Proyectos": proyectos nuevos desde última visita
  let explorar = false;
  const lastVisit = localStorage.getItem('vm_last_visit_proyectos');
  if (lastVisit) {
    const cached = queryClient.getQueryData(['proyectos', 0, 10]);
    // La API puede devolver { content: [...] } (paginado) o un array plano
    const lista = cached?.content ?? (Array.isArray(cached) ? cached : []);
    if (lista.length > 0) {
      explorar = lista.some(
        (p) => new Date(p.fechaCreacion) > new Date(Number(lastVisit))
      );
    }
  }

  const tieneNotifDeTipo = (tipo) =>
    notificaciones.some((n) => !n.leida && n.tipo === tipo);

  return {
    explorar,
    postulaciones: tieneNotifDeTipo('POSTULACION'),
    workspace: tieneNotifDeTipo('ENTREGABLE'),
    certificados: tieneNotifDeTipo('CERTIFICADO'),
    mensajes: tieneNotifDeTipo('MENSAJE'),
    proyectosMype: tieneNotifDeTipo('PROYECTO'),
  };
}
```

- [ ] **Step 2: Verificar manualmente**

En cualquier componente que use `useSidebarBadges`, abrir la consola y verificar:
- `useNotificaciones` resuelve sin errores.
- Si se navega a `/proyectos`, `localStorage.getItem('vm_last_visit_proyectos')` se actualiza.

- [ ] **Step 3: Commit**

```bash
git add src/shared/hooks/useSidebarBadges.js
git commit -m "feat: hook useSidebarBadges para badges dinámicos en sidebars"
```

---

## Task 5: Rediseñar `StudentLayout` — sidebar dark gradient + topbar con campanita

**Files:**
- Modify: `src/shared/layouts/StudentLayout.jsx`

Este es el cambio más grande. Reemplazar el contenido completo del archivo con la versión rediseñada.

- [ ] **Step 1: Reemplazar `src/shared/layouts/StudentLayout.jsx`**

```jsx
import React, { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Briefcase,
  User,
  LogOut,
  Menu,
  X,
  Award,
  FolderOpen,
  Bell,
  AlertTriangle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import { Logo } from "../ui/Logo";
import { useNotificaciones } from "../../features/notificaciones/useNotificaciones";
import { useNotificacionesSocket } from "../../features/notificaciones/useNotificacionesSocket";
import { NotificacionesPanel } from "../../features/notificaciones/NotificacionesPanel";
import { useSidebarBadges } from "../hooks/useSidebarBadges";

// ── Estilos del sidebar (dark gradient como MypeSidebar) ──────────────────
const SIDEBAR_BG = 'linear-gradient(170deg, #081828 0%, #0F2A4A 60%, #0C3260 100%)';

// ── Mapa de títulos por ruta ───────────────────────────────────────────────
function getPageTitle(pathname) {
  if (pathname === '/dashboard/estudiante') return 'Mi Panel';
  if (pathname.startsWith('/proyectos')) return 'Explorar Proyectos';
  if (pathname === '/mis-postulaciones') return 'Mis Postulaciones';
  if (pathname.startsWith('/workspace')) return 'Mi Workspace';
  if (pathname === '/certificados') return 'Mis Certificados';
  if (pathname === '/perfil') return 'Mi Perfil';
  return 'Portal Estudiante';
}

// ── NavItem del sidebar ────────────────────────────────────────────────────
const NavItem = ({ to, icon: Icon, label, pathname, onClick, showDot, dotColor }) => {
  const active = pathname === to || (to !== '/dashboard/estudiante' && pathname.startsWith(to));

  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '7px 8px',
        borderRadius: 8,
        fontSize: 12,
        marginBottom: 2,
        textDecoration: 'none',
        border: active ? '1px solid rgba(27,111,232,0.3)' : '1px solid transparent',
        background: active ? 'rgba(27,111,232,0.18)' : 'transparent',
        color: active ? '#fff' : 'rgba(255,255,255,0.45)',
        transition: 'all 0.15s',
        fontFamily: "'Inter', sans-serif",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <Icon
          size={15}
          style={{ flexShrink: 0, color: active ? '#06B6D4' : 'inherit' }}
        />
        {label}
      </div>
      {showDot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: dotColor,
            boxShadow: `0 0 6px ${dotColor}99`,
            flexShrink: 0,
          }}
        />
      )}
    </Link>
  );
};

// ── Layout principal ────────────────────────────────────────────────────────
const StudentLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isNotifPanelOpen, setIsNotifPanelOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Notificaciones y WebSocket
  const { data: notificaciones = [] } = useNotificaciones();
  useNotificacionesSocket(user?.id);
  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  // Badges del sidebar
  const badges = useSidebarBadges();

  const navigationSections = [
    {
      label: 'Principal',
      items: [
        {
          to: '/dashboard/estudiante',
          icon: LayoutDashboard,
          label: 'Mi Panel',
          showDot: false,
        },
        {
          to: '/proyectos',
          icon: Search,
          label: 'Explorar Proyectos',
          showDot: badges.explorar,
          dotColor: '#F59E0B',
        },
      ],
    },
    {
      label: 'Gestión',
      items: [
        {
          to: '/mis-postulaciones',
          icon: Briefcase,
          label: 'Mis Postulaciones',
          showDot: badges.postulaciones,
          dotColor: '#3B82F6',
        },
        {
          to: '/workspace',
          icon: FolderOpen,
          label: 'Mi Workspace',
          showDot: badges.workspace,
          dotColor: '#8B5CF6',
        },
        {
          to: '/certificados',
          icon: Award,
          label: 'Mis Certificados',
          showDot: badges.certificados,
          dotColor: '#10B981',
        },
      ],
    },
    {
      label: 'Cuenta',
      items: [
        {
          to: '/perfil',
          icon: User,
          label: 'Mi Perfil',
          showDot: false,
        },
      ],
    },
  ];

  const initials =
    user?.nombre
      ?.split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ?? '?';

  const handleConfirmLogout = () => {
    logout();
    navigate('/login');
    setShowLogoutModal(false);
  };

  // ── Contenido del sidebar (reutilizado en desktop y mobile) ────────────
  const sidebarContent = (closeMenu) => (
    <>
      {/* Dot grid decorativo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.045) 1px, transparent 0)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      {/* Glow orb top-right */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #06B6D4, transparent 70%)',
          opacity: 0.12,
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      {/* Glow orb bottom-left */}
      <div
        style={{
          position: 'absolute',
          bottom: -60,
          left: -60,
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #1B6FE8, transparent 70%)',
          opacity: 0.1,
          filter: 'blur(30px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Logo Linkuy */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '14px 16px',
          borderBottom: '0.5px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Logo />
      </div>

      {/* Info del usuario */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '10px 14px',
          borderBottom: '0.5px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            flexShrink: 0,
            background: 'linear-gradient(135deg, #1B6FE8, #06B6D4)',
            border: '1.5px solid rgba(6,182,212,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 700,
            color: '#fff',
          }}
        >
          {initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.88)',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {user?.nombre}
          </p>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
            Estudiante
          </p>
        </div>
      </div>

      {/* Navegación */}
      <nav
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          padding: '8px',
          overflowY: 'auto',
        }}
      >
        {navigationSections.map((section) => (
          <div key={section.label} style={{ marginBottom: 16 }}>
            <p
              style={{
                fontSize: 8,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                padding: '0 7px',
                marginBottom: 3,
              }}
            >
              {section.label}
            </p>
            {section.items.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                pathname={location.pathname}
                onClick={closeMenu}
                showDot={item.showDot}
                dotColor={item.dotColor}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Cerrar sesión */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: 8,
          borderTop: '0.5px solid rgba(255,255,255,0.07)',
        }}
      >
        <button
          onClick={() => setShowLogoutModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 10px',
            borderRadius: 8,
            fontSize: 12,
            color: 'rgba(255,255,255,0.3)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.15s',
            fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.3)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <LogOut size={15} /> Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <div
      className="portal-estudiante"
      style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', overflow: 'hidden' }}
    >
      {/* ── SIDEBAR DESKTOP ────────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex"
        style={{
          width: 220,
          flexShrink: 0,
          flexDirection: 'column',
          background: SIDEBAR_BG,
          position: 'relative',
          overflow: 'hidden',
          zIndex: 30,
        }}
      >
        {sidebarContent(null)}
      </aside>

      {/* ── MOBILE HEADER ──────────────────────────────────────────────── */}
      <div className="lg:hidden" style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 56,
        background: '#fff', borderBottom: '1px solid #e5e7eb',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', zIndex: 40,
      }}>
        <Logo theme="light" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Bell mobile */}
          <button
            onClick={() => setIsNotifPanelOpen(true)}
            style={{
              position: 'relative', width: 36, height: 36,
              borderRadius: 8, background: '#F1F5F9', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Bell size={18} color="#64748b" />
            {noLeidas > 0 && (
              <span style={{
                position: 'absolute', top: -3, right: -3,
                minWidth: 16, height: 16, borderRadius: 8,
                background: '#EF4444', border: '2px solid #fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700, color: '#fff', padding: '0 3px',
              }}>
                {noLeidas}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsSidebarOpen(true)}
            style={{ padding: 8, color: '#475569', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* ── MOBILE SIDEBAR ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 50 }}
            className="lg:hidden"
          >
            <div
              onClick={() => setIsSidebarOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(15,26,47,0.5)', backdropFilter: 'blur(4px)' }}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'absolute', top: 0, left: 0, bottom: 0,
                width: 240, background: SIDEBAR_BG,
                display: 'flex', flexDirection: 'column',
                boxShadow: '4px 0 30px rgba(0,0,0,0.3)',
                overflow: 'hidden', position: 'absolute',
              }}
            >
              <div style={{
                display: 'flex', justifyContent: 'flex-end',
                padding: 8, position: 'relative', zIndex: 1,
              }}>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  style={{
                    padding: 6, color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.08)',
                    border: 'none', cursor: 'pointer', borderRadius: 8,
                  }}
                >
                  <X size={18} />
                </button>
              </div>
              {sidebarContent(() => setIsSidebarOpen(false))}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ÁREA DE CONTENIDO ──────────────────────────────────────────── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* Topbar con campanita (solo desktop) */}
        <div
          className="hidden lg:flex"
          style={{
            height: 44,
            background: '#fff',
            borderBottom: '0.5px solid #E5E7EB',
            flexShrink: 0,
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
            {getPageTitle(location.pathname)}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setIsNotifPanelOpen(true)}
              style={{
                position: 'relative', width: 34, height: 34,
                borderRadius: 8, background: '#F1F5F9', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Bell size={17} color="#64748b" />
              {noLeidas > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4,
                  minWidth: 16, height: 16, borderRadius: 8,
                  background: '#EF4444', border: '2px solid #fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 700, color: '#fff', padding: '0 3px',
                }}>
                  {noLeidas}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Contenido de la página */}
        <div style={{ flex: 1, overflowY: 'auto', paddingTop: 0 }} className="pt-14 lg:pt-0">
          <Outlet />
        </div>
      </main>

      {/* ── PANEL DE NOTIFICACIONES ────────────────────────────────────── */}
      <NotificacionesPanel
        isOpen={isNotifPanelOpen}
        onClose={() => setIsNotifPanelOpen(false)}
      />

      {/* ── MODAL LOGOUT ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {showLogoutModal && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 60,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                position: 'relative', maxWidth: 420, width: '100%',
                background: '#fff', borderRadius: 20,
                boxShadow: '0 25px 60px rgba(0,0,0,0.2)', overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #d97706, #b45309)' }} />
              <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <AlertTriangle size={22} color="#d97706" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>Cerrar sesión</h3>
                    <p style={{ fontSize: 13, color: '#64748b', margin: '2px 0 0' }}>¿Seguro que quieres salir?</p>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: '#475569', marginBottom: 24 }}>
                  Se cerrará tu sesión actual y deberás volver a iniciar sesión para acceder a tu cuenta.
                </p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 12, border: 'none',
                      background: '#F1F5F9', color: '#475569', fontSize: 13,
                      fontWeight: 500, cursor: 'pointer',
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmLogout}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 12, border: 'none',
                      background: 'linear-gradient(135deg, #d97706, #b45309)',
                      color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentLayout;
```

- [ ] **Step 2: Verificar en navegador**

1. Iniciar la app: `npm run dev`.
2. Entrar como estudiante.
3. Verificar:
   - Sidebar desktop tiene fondo gradiente oscuro con dot-grid y logo Linkuy.
   - Topbar de 44px visible con título de página y campanita.
   - La campanita muestra badge rojo si hay notifs no leídas.
   - Al hacer clic en la campanita, se abre el panel de notificaciones.
   - Al navegar entre páginas (Explorar, Postulaciones, etc.), el título del topbar cambia.
   - El hover en los items del sidebar funciona.
   - El sidebar mobile sigue funcionando (ícono hamburguesa visible en móvil).

- [ ] **Step 3: Commit**

```bash
git add src/shared/layouts/StudentLayout.jsx
git commit -m "feat: sidebar estudiante dark gradient + topbar con campanita en todas las páginas"
```

---

## Task 6: Limpiar `EstudianteDashboardPage` — remover bell duplicado

**Files:**
- Modify: `src/pages/estudiante/EstudianteDashboardPage.jsx`

- [ ] **Step 1: Eliminar el import de `NotificacionesPanel`**

Buscar y eliminar esta línea (aprox. línea 23):
```js
import { NotificacionesPanel } from '../../features/notificaciones/NotificacionesPanel';
```

- [ ] **Step 2: Eliminar el import comentado del socket**

Buscar y eliminar esta línea (aprox. línea 24):
```js
//import { useNotificacionesSocket } from '../../features/notificaciones/useNotificacionesSocket';
```

- [ ] **Step 3: Eliminar el estado `isNotifPanelOpen`**

Buscar y eliminar la línea que define el estado (dentro del componente principal):
```js
const [isNotifPanelOpen, setIsNotifPanelOpen] = useState(false);
```

- [ ] **Step 4: Eliminar el botón bell del dashboard**

Buscar el bloque que contiene `<Bell size={16} color="#6b6b7a" />` (aprox. línea 535-555) y el div que lo rodea (botón con `onClick={() => setIsNotifPanelOpen(true)}`). Eliminar ese bloque completo.

El patrón a buscar y eliminar es similar a:
```jsx
<button
  onClick={() => setIsNotifPanelOpen(true)}
  style={{ ... }}
>
  <Bell size={16} color="#6b6b7a" />
  {activityItems.some(n => !n.leida) && (
    <div style={{ position: 'absolute', ... }} />
  )}
</button>
```

- [ ] **Step 5: Eliminar el `<NotificacionesPanel>` del JSX**

Buscar y eliminar el bloque (aprox. línea 737-741):
```jsx
{/* Panel de Notificaciones */}
<NotificacionesPanel 
  isOpen={isNotifPanelOpen} 
  onClose={() => setIsNotifPanelOpen(false)} 
/>
```

- [ ] **Step 6: Verificar que la página compila**

```bash
npm run dev
```

No debe haber errores de compilación. El dashboard del estudiante debe cargar correctamente. La campanita del topbar del layout sigue funcionando.

- [ ] **Step 7: Commit**

```bash
git add src/pages/estudiante/EstudianteDashboardPage.jsx
git commit -m "refactor: remover campanita duplicada de EstudianteDashboardPage"
```

---

## Task 7: Estilizar header oscuro del `NotificacionesPanel`

**Files:**
- Modify: `src/features/notificaciones/NotificacionesPanel.jsx`

- [ ] **Step 1: Localizar el div del header**

En `NotificacionesPanel.jsx`, buscar el div con `style={{ padding: '16px 20px', borderBottom: '1px solid #e8e8e4', background: '#fafafa' }}` (aprox. línea 101).

- [ ] **Step 2: Reemplazar los estilos del header**

Cambiar únicamente ese div y sus elementos internos de color/fondo:

```jsx
{/* Header */}
<div style={{
  padding: '16px 20px',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  background: 'linear-gradient(135deg, #081828, #0F2A4A)',
}}>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <Bell size={18} color={noLeidas > 0 ? '#06B6D4' : 'rgba(255,255,255,0.5)'} />
        {noLeidas > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            width: 18, height: 18, borderRadius: '50%',
            background: '#EF4444', color: '#fff',
            fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{noLeidas}</span>
        )}
      </div>
      <div>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>Notificaciones</h3>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
          {noLeidas} sin leer de {notificaciones.length}
        </p>
      </div>
    </div>
    <button onClick={onClose} style={{
      width: 32, height: 32, borderRadius: 8, border: 'none',
      background: 'rgba(255,255,255,0.1)', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <X size={16} color="rgba(255,255,255,0.7)" />
    </button>
  </div>
  {/* Filtros */}
  <div style={{ display: 'flex', gap: 8 }}>
    <button onClick={() => setFiltro('todas')} style={{
      padding: '6px 12px', borderRadius: 6, border: 'none',
      fontSize: 11, fontWeight: 600, cursor: 'pointer',
      background: filtro === 'todas' ? '#1B6FE8' : 'rgba(255,255,255,0.08)',
      color: filtro === 'todas' ? '#fff' : 'rgba(255,255,255,0.6)',
    }}>Todas</button>
    <button onClick={() => setFiltro('no-leidas')} style={{
      padding: '6px 12px', borderRadius: 6, border: 'none',
      fontSize: 11, fontWeight: 600, cursor: 'pointer',
      background: filtro === 'no-leidas' ? '#1B6FE8' : 'rgba(255,255,255,0.08)',
      color: filtro === 'no-leidas' ? '#fff' : 'rgba(255,255,255,0.6)',
    }}>No leídas</button>
  </div>
</div>
```

- [ ] **Step 3: Verificar visualmente**

Abrir el panel de notificaciones. El header debe tener fondo oscuro gradiente con texto blanco. La lista de notificaciones (cuerpo) debe seguir con fondo blanco.

- [ ] **Step 4: Commit**

```bash
git add src/features/notificaciones/NotificacionesPanel.jsx
git commit -m "feat: header oscuro en NotificacionesPanel alineado con sidebar"
```

---

## Task 8: Dots dinámicos en `MypeSidebar`

**Files:**
- Modify: `src/shared/layouts/MypeSidebar.jsx`

- [ ] **Step 1: Agregar import de `useSidebarBadges`**

Al inicio del archivo, agregar:
```js
import { useSidebarBadges } from '@/shared/hooks/useSidebarBadges';
```

- [ ] **Step 2: Actualizar el componente `NavItem` para aceptar `showDot`**

Reemplazar la definición actual de `NavItem`:

```jsx
function NavItem({ to, icon: Icon, label, showDot, dotColor = '#F97316' }) {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      style={{ fontFamily: FONT }}
      className={clsx(
        'flex items-center gap-2 px-2.5 py-[7px] rounded-lg text-[12px] transition-all duration-150 mb-[2px] border no-underline',
        active
          ? 'bg-[rgba(27,111,232,0.18)] text-white border-[rgba(27,111,232,0.3)] font-semibold'
          : 'text-white/45 hover:bg-white/[0.06] hover:text-white/80 border-transparent',
      )}
    >
      <Icon size={15} className={clsx('shrink-0', active && 'text-[#06B6D4]')} />
      <span className="flex-1">{label}</span>
      {showDot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: dotColor,
            boxShadow: `0 0 6px ${dotColor}99`,
            flexShrink: 0,
          }}
        />
      )}
    </Link>
  );
}
```

- [ ] **Step 3: Llamar `useSidebarBadges` dentro del componente `Sidebar`**

Al inicio del cuerpo de la función `Sidebar`, agregar:
```js
const badges = useSidebarBadges();
```

- [ ] **Step 4: Actualizar el array `NAV` para usar badges dinámicos**

Reemplazar el array `NAV` (definido fuera del componente) con una función que recibe los badges. Cambiar la definición a:

```js
const getNAV = (badges) => [
  {
    label: 'Principal',
    items: [
      { to: '/dashboard/mype', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/dashboard/mype/proyectos', icon: Briefcase, label: 'Mis proyectos' },
      {
        to: '/dashboard/mype/postulantes',
        icon: Users,
        label: 'Postulantes',
        showDot: badges.postulaciones,
        dotColor: '#F97316',
      },
    ],
  },
  {
    label: 'Gestión',
    items: [
      {
        to: '/dashboard/mype/ejecucion',
        icon: CheckCircle,
        label: 'En ejecución',
        showDot: badges.workspace,
        dotColor: '#8B5CF6',
      },
      { to: '/dashboard/mype/certificados', icon: Award, label: 'Certificados' },
      {
        to: '/dashboard/mype/mensajes',
        icon: MessageSquare,
        label: 'Mensajes',
        showDot: badges.mensajes,
        dotColor: '#10B981',
      },
    ],
  },
  {
    label: 'Cuenta',
    items: [
      { to: '/dashboard/mype/perfil', icon: UserCircle, label: 'Mi perfil' },
      { to: '/dashboard/mype/configuracion', icon: Settings, label: 'Configuración' },
    ],
  },
];
```

- [ ] **Step 5: Usar `getNAV(badges)` en el render del nav**

Dentro del componente `Sidebar`, en el render del `<nav>`, reemplazar:
```jsx
{NAV.map((section) => (
```
por:
```jsx
{getNAV(badges).map((section) => (
```

Y en la llamada a `<NavItem>`, pasar `showDot` y `dotColor`:
```jsx
{section.items.map((item) => (
  <NavItem key={item.to} {...item} />
))}
```
(Ya funciona porque `NavItem` recibe `showDot` y `dotColor` directamente del spread de `item`.)

- [ ] **Step 6: Verificar visualmente**

Entrar como MYPE. Si hay notificaciones no leídas de tipo POSTULACION, "Postulantes" debe mostrar un punto naranja. Si hay de tipo MENSAJE, "Mensajes" muestra punto verde.

- [ ] **Step 7: Commit**

```bash
git add src/shared/layouts/MypeSidebar.jsx
git commit -m "feat: badges dinámicos en MypeSidebar desde useNotificaciones"
```

---

## Task 9: Dots dinámicos en `AdminSidebar`

**Files:**
- Modify: `src/shared/layouts/AdminSidebar.jsx`

- [ ] **Step 1: Agregar imports**

Al inicio del archivo, agregar:
```js
import { useSidebarBadges } from '@/shared/hooks/useSidebarBadges';
```

- [ ] **Step 2: Actualizar `NavItem` para aceptar `showDot`**

Reemplazar la definición de `NavItem`:

```jsx
function NavItem({ to, icon: Icon, label, showDot, dotColor = '#F97316' }) {
  const { pathname } = useLocation();
  const active = pathname === to || pathname.startsWith(to + '/');

  return (
    <Link
      to={to}
      style={{ fontFamily: FONT }}
      className={clsx(
        'flex items-center gap-2 px-2.5 py-[7px] rounded-lg text-[12px] transition-all duration-150 mb-[2px] border no-underline',
        active
          ? 'bg-[rgba(27,111,232,0.18)] text-white border-[rgba(27,111,232,0.3)] font-semibold'
          : 'text-white/45 hover:bg-white/[0.06] hover:text-white/80 border-transparent',
      )}
    >
      <Icon size={15} className={clsx('shrink-0', active && 'text-[#06B6D4]')} />
      <span className="flex-1">{label}</span>
      {showDot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: dotColor,
            boxShadow: `0 0 6px ${dotColor}99`,
            flexShrink: 0,
          }}
        />
      )}
    </Link>
  );
}
```

- [ ] **Step 3: Llamar `useSidebarBadges` dentro de `AdminSidebar`**

Al inicio del cuerpo del componente `AdminSidebar`, agregar:
```js
const badges = useSidebarBadges();
```

- [ ] **Step 4: Actualizar el array `NAV` a función que recibe badges**

Reemplazar el array `NAV` estático con:

```js
const getNAV = (badges) => [
  {
    label: 'Principal',
    items: [
      { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Panel de Control' },
      {
        to: '/admin/proyectos',
        icon: FolderKanban,
        label: 'Proyectos',
        showDot: badges.proyectosMype,
        dotColor: '#F59E0B',
      },
      { to: '/admin/usuarios', icon: Users, label: 'Usuarios' },
    ],
  },
  {
    label: 'Gestión',
    items: [
      {
        to: '/admin/postulaciones',
        icon: UserCheck,
        label: 'Postulaciones',
        showDot: badges.postulaciones,
        dotColor: '#F97316',
      },
      { to: '/admin/calificaciones', icon: Star, label: 'Calificaciones' },
      { to: '/admin/certificados', icon: Award, label: 'Certificados' },
      { to: '/admin/auditoria', icon: History, label: 'Auditoría' },
      { to: '/admin/reportes', icon: BarChart, label: 'Reportes' },
      { to: '/admin/configuracion', icon: Settings, label: 'Configuración' },
    ],
  },
];
```

- [ ] **Step 5: Usar `getNAV(badges)` en el render**

En el JSX del componente, reemplazar:
```jsx
{NAV.map((section) => (
```
por:
```jsx
{getNAV(badges).map((section) => (
```

Y pasar props del item con spread:
```jsx
{section.items.map((item) => (
  <NavItem key={item.to} {...item} />
))}
```

- [ ] **Step 6: Verificar visualmente**

Entrar como Admin. Si hay notificaciones no leídas de tipo POSTULACION, "Postulaciones" debe mostrar punto naranja. Si hay de tipo PROYECTO, "Proyectos" muestra punto amarillo.

- [ ] **Step 7: Commit**

```bash
git add src/shared/layouts/AdminSidebar.jsx
git commit -m "feat: badges dinámicos en AdminSidebar desde useNotificaciones"
```

---

## Verificación final

- [ ] Iniciar sesión como **Estudiante**: sidebar con gradiente oscuro + Linkuy, topbar con campanita en todas las páginas, sonido solo si hay notifs nuevas desde el último logout.
- [ ] Iniciar sesión como **MYPE**: puntos en Postulantes/Mensajes/En ejecución si corresponde.
- [ ] Iniciar sesión como **Admin**: puntos en Postulaciones/Proyectos si corresponde.
- [ ] Cerrar sesión y volver a entrar sin notifs nuevas: **no suena**.
- [ ] Simular notif nueva por WebSocket: **suena una vez**.
- [ ] Navegar a `/proyectos` y volver al sidebar: el punto de "Explorar Proyectos" desaparece.

---

## Notas para el implementador

- `StudentSidebar.jsx` existe en el proyecto pero **no** es usado por el router. No modificarlo.
- El alias `@shared` apunta a `src/shared` (configurado en `vite.config.js`/`jsconfig.json`).
- Si el backend no está activo, el WebSocket fallará silenciosamente (reconexión cada 5s) — esperado.
- `localStorage.getItem('vm_last_visit_proyectos')` es `null` en la primera visita → `explorar: false` → no aparece badge hasta que el usuario visite `/proyectos` al menos una vez y vuelva. Esto es intencional.
