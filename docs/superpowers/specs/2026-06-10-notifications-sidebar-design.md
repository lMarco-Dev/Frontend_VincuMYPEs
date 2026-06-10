# Notificaciones y Sidebar — Especificación de Diseño

**Fecha:** 2026-06-10  
**Estado:** Aprobado

---

## Contexto

El frontend VincuMYPEs tiene tres portales (Estudiante, MYPE, Admin) con sus respectivos sidebars. Se detectaron dos problemas:

1. El sonido de notificación suena al cargar la página aunque no haya notificaciones nuevas desde el último logout.
2. El sidebar del estudiante no tiene indicadores visuales por módulo ni un diseño consistente con el MypeSidebar.

---

## Alcance

- `src/features/notificaciones/useNotificaciones.js`
- `src/features/notificaciones/useNotificacionesSocket.js`
- `src/features/notificaciones/NotificacionesPanel.jsx`
- `src/store/authStore.js`
- `src/shared/layouts/StudentLayout.jsx` (incluye StudentSidebar)
- `src/shared/layouts/MypeSidebar.jsx`
- `src/shared/layouts/AdminSidebar.jsx`
- `src/shared/hooks/useSidebarBadges.js` (archivo nuevo)
- `src/pages/estudiante/EstudianteDashboardPage.jsx` (eliminación de bell duplicado)

---

## 1. Corrección del sonido de notificaciones

### Comportamiento esperado

| Escenario | Resultado |
|---|---|
| Llega notificación por WebSocket (sesión activa) | Suena una vez |
| Usuario abre sesión y hay notifs nuevas desde su último logout | Suena una vez |
| Usuario abre sesión sin notifs nuevas desde su último logout | No suena |

### Cambios

**`authStore.js` — guardar timestamp en logout**

En la función `logout()`, antes de limpiar el estado, agregar:
```js
localStorage.setItem('vm_last_logout', Date.now().toString());
```

**`useNotificaciones.js` — eliminar lógica de sonido del polling**

- Eliminar la función `playNotificationSound()` del archivo.
- Eliminar `prevNoLeidasRef`, `isFirstLoad` y el `useEffect` de comparación de conteo.
- Agregar un único `useEffect` que se ejecuta solo cuando `query.data` pasa de `undefined` a tener datos (primera carga):
  - Lee `vm_last_logout` de localStorage.
  - Si hay alguna notificación con `!n.leida && new Date(n.fechaCreacion) > new Date(Number(lastLogout))` → llama a `playNotificationSound()` una vez.
  - Luego elimina el key `vm_last_logout` de localStorage para que no repita en navegaciones.
- La función `playNotificationSound()` se mueve a un módulo compartido: `src/shared/lib/notificationSound.js` (exportada, importada desde ambos hooks).

**`useNotificacionesSocket.js` — sin cambios de lógica**

- `playNotificationSound()` se importa desde `src/shared/lib/notificationSound.js` en lugar de estar definida inline.
- La lógica de WebSocket no cambia: suena en `ws.onmessage`.

**`StudentLayout.jsx` — activar WebSocket**

- Importar `useNotificacionesSocket` y llamarlo con `user?.id`.
- (Las líneas comentadas en `EstudianteDashboardPage.jsx` se eliminan directamente.)

---

## 2. Campanita en todas las páginas del portal estudiante

### Ubicación

Se agrega un **topbar de 44px** al área de contenido del `StudentLayout` (no dentro del sidebar). Está presente en todas las rutas del portal estudiante sin modificar ninguna page individual.

### Estructura del topbar

```
[Título de la página actual]          [🔔 badge rojo con conteo]
```

- Fondo: `#fff`, borde inferior: `0.5px solid #E5E7EB`, altura: `44px`.
- Título: `font-size: 15px`, `font-weight: 600`, `color: #111827`.  
  El título se deriva del pathname usando un mapa de rutas → labels.
- Botón bell: `32×32px`, `border-radius: 8px`, fondo `#F1F5F9`.
- Badge: círculo rojo `#EF4444`, `16×16px`, número de no leídas. Oculto si `noLeidas === 0`.

### Migración desde EstudianteDashboardPage

- El estado `isNotifPanelOpen` y el `<NotificacionesPanel>` se mueven a `StudentLayout`.
- Se elimina el botón bell y el `<NotificacionesPanel>` de `EstudianteDashboardPage.jsx`.
- `useNotificaciones()` pasa a vivir en `StudentLayout` (ya disponible para el topbar y el WebSocket hook).

---

## 3. Hook `useSidebarBadges`

**Archivo:** `src/shared/hooks/useSidebarBadges.js`

### Contrato

```js
const {
  explorar,       // boolean — nuevos proyectos desde última visita
  postulaciones,  // boolean — notif POSTULACION no leída
  workspace,      // boolean — notif ENTREGABLE no leída
  certificados,   // boolean — notif CERTIFICADO no leída
  mensajes,       // boolean — notif MENSAJE no leída (para MYPE)
  proyectosMype,  // boolean — notif PROYECTO no leída (para Admin)
} = useSidebarBadges();
```

### Lógica por módulo

**Explorar Proyectos (localStorage + API):**
- Key en localStorage: `vm_last_visit_proyectos` (timestamp en ms).
- Al montar el hook: lee el key, obtiene el primer proyecto del cache de React Query (`['proyectos', 0, 10]`), compara `fechaCreacion` del más reciente contra el timestamp.
- El badge `explorar` es `true` si `fechaCreacion > lastVisit`.
- Al navegar a `/proyectos` (detectado con `useEffect` + `useLocation`): actualiza `vm_last_visit_proyectos = Date.now()` → badge desaparece.
- Si no existe el key en localStorage, se asume primera visita → no muestra badge.

**Módulos basados en notificaciones:**
```js
const tieneNotifDeTipo = (tipo) =>
  notificaciones.some(n => !n.leida && n.tipo === tipo);

const postulaciones = tieneNotifDeTipo('POSTULACION');
const workspace     = tieneNotifDeTipo('ENTREGABLE');
const certificados  = tieneNotifDeTipo('CERTIFICADO');
const mensajes      = tieneNotifDeTipo('MENSAJE');
const proyectosMype = tieneNotifDeTipo('PROYECTO');
```

**Dependencias del hook:**
- `useNotificaciones()` — ya cacheado por React Query, sin requests adicionales.
- `useQueryClient()` — para leer `['proyectos', 0, 10]` del cache sin disparar un fetch propio.
- `useLocation()` — para detectar visita a `/proyectos`.

---

## 4. Rediseño visual del sidebar estudiante

El `StudentLayout.jsx` (que incluye el sidebar) se actualiza visualmente para coincidir con el estilo del `MypeSidebar` actual.

### Cambios de estilo

| Elemento | Antes | Después |
|---|---|---|
| Fondo sidebar | `bg-[#1e3a5f]` (Tailwind) | `background: linear-gradient(170deg, #081828 0%, #0F2A4A 60%, #0C3260 100%)` |
| Decorativo | ninguno | dot-grid overlay + 2 glow orbs (cyan top-right, azul bottom-left) |
| Avatar usuario | `bg-accent` (plano) | `background: linear-gradient(135deg, #1B6FE8, #06B6D4)` con borde `rgba(6,182,212,0.35)` |
| Item activo | `bg-white/10` | `background: rgba(27,111,232,0.18)` + `border: 1px solid rgba(27,111,232,0.3)` |
| Ícono item activo | color heredado | color `#06B6D4` |
| Item inactivo | `text-white/55` | `color: rgba(255,255,255,0.45)` |
| Separadores | `border-white/10` | `border: 0.5px solid rgba(255,255,255,0.07)` |
| Labels de sección | `text-white/30`, 10px | `rgba(255,255,255,0.25)`, 8px, `letter-spacing: 1px` |
| Tamaño de texto nav | 13px (Tailwind `text-sm`) | 12px |

### Logo Linkuy
El componente `<Logo />` se conserva exactamente igual. El sidebar dark usa el modo default (`theme="dark"`) que ya carga `linkuy_logo.svg` e `icon.svg`.

### Badges en NavItem

El componente `NavItem` del sidebar estudiante recibe una prop `showDot` (boolean) y `dotColor` (string hex). Renderiza:
```jsx
{showDot && (
  <span style={{
    width: 6, height: 6, borderRadius: '50%',
    background: dotColor,
    boxShadow: `0 0 6px ${dotColor}99`,
    flexShrink: 0,
    marginLeft: 'auto',
  }} />
)}
```

### Colores de dot por módulo

| Módulo | Color | Hex |
|---|---|---|
| Explorar Proyectos | Amarillo | `#F59E0B` |
| Mis Postulaciones | Azul | `#3B82F6` |
| Mi Workspace | Violeta | `#8B5CF6` |
| Mis Certificados | Verde | `#10B981` |

---

## 5. MypeSidebar — dots dinámicos

**Reemplaza** el `badge: true` hardcodeado en el array `NAV`.

`useSidebarBadges()` se llama dentro del componente `Sidebar` de `MypeSidebar.jsx`. El `NavItem` del MYPE recibe la misma prop `showDot` ya definida en su componente.

| Módulo | Condición | Color dot |
|---|---|---|
| Postulantes | `badges.postulaciones` | `#F97316` (naranja) |
| Mensajes | `badges.mensajes` | `#10B981` (verde) |
| En ejecución | `badges.workspace` | `#8B5CF6` (violeta) |

---

## 6. AdminSidebar — dots dinámicos

`useSidebarBadges()` se agrega al componente `AdminSidebar`. El `NavItem` del admin recibe prop `showDot`.

| Módulo | Condición | Color dot |
|---|---|---|
| Postulaciones | `badges.postulaciones` | `#F97316` (naranja) |
| Proyectos | `badges.proyectosMype` | `#F59E0B` (amarillo) |

---

## 7. NotificacionesPanel — header oscuro

Solo el header (`padding: '16px 20px'`) cambia de estilo. El cuerpo (lista de notificaciones) no se modifica.

| Elemento | Antes | Después |
|---|---|---|
| Header background | `#fafafa` | `linear-gradient(135deg, #081828, #0F2A4A)` |
| Título color | `#0f1f3d` | `#fff` |
| Subtítulo color | `#6b6b7a` | `rgba(255,255,255,0.5)` |
| Ícono campana bg | `#eff6ff` / `#f1f5f9` | `rgba(255,255,255,0.1)` |
| Botón X bg | `#f1f5f9` | `rgba(255,255,255,0.1)` |
| Botón filtro inactivo | bg `#f1f5f9`, text `#64748b` | bg `rgba(255,255,255,0.08)`, text `rgba(255,255,255,0.6)` |
| Botón filtro activo | bg `#1B6FE8`, text `#fff` | sin cambios |

---

## Archivos afectados

| Archivo | Acción |
|---|---|
| `src/shared/lib/notificationSound.js` | Crear — función `playNotificationSound()` extraída |
| `src/shared/hooks/useSidebarBadges.js` | Crear — lógica de badges centralizada |
| `src/store/authStore.js` | Modificar — guardar `vm_last_logout` en logout |
| `src/features/notificaciones/useNotificaciones.js` | Modificar — eliminar lógica de sonido, agregar check post-login |
| `src/features/notificaciones/useNotificacionesSocket.js` | Modificar — importar sound desde shared/lib |
| `src/features/notificaciones/NotificacionesPanel.jsx` | Modificar — header oscuro |
| `src/shared/layouts/StudentLayout.jsx` | Modificar — topbar con bell, WebSocket, sidebar rediseñado |
| `src/shared/layouts/MypeSidebar.jsx` | Modificar — dots dinámicos |
| `src/shared/layouts/AdminSidebar.jsx` | Modificar — dots dinámicos |
| `src/pages/estudiante/EstudianteDashboardPage.jsx` | Modificar — eliminar bell y NotificacionesPanel duplicados |

---

## Restricciones respetadas

- No se renombran paquetes ni se cambia la arquitectura general.
- No se tocan rutas, guards ni lógica de autenticación salvo el timestamp en logout.
- Los cambios en MypeSidebar y AdminSidebar son aditivos (solo se agrega `useSidebarBadges` y prop `showDot`).
- Si el backend no envía notificaciones de un tipo determinado a un rol, el badge simplemente no aparece (condición es `false`).
- El key `vm_last_visit_proyectos` en localStorage se documenta como solución temporal frontend hasta que exista un endpoint de última visita.
