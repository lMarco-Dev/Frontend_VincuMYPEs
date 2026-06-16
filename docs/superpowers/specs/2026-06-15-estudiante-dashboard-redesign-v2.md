# Spec: Rediseño EstudianteDashboardPage v2

**Fecha:** 2026-06-15
**Archivo objetivo:** `src/pages/estudiante/EstudianteDashboardPage.jsx`

---

## Contexto

El dashboard actual tiene tres problemas principales:
1. Las 3 MetricCards grandes (Perfil / Postulaciones / Certificados) consumen espacio sin aportar acción.
2. El Hero Banner tiene el lado derecho vacío — espacio desperdiciado.
3. No hay visibilidad de proyectos activos ni de un siguiente paso claro.

---

## Qué se mantiene (NO tocar)

- `HeroBanner`: texto animado + canvas de partículas + orbs (solo se ajusta altura y se rellena el lado derecho con stats).
- Paleta `C` completa.
- Sistema de animaciones `fadeUp`.
- Topbar: saludo + buscador + botón de notificaciones.
- `CalificacionesPendientesCard` en sidebar.
- `NotificacionesPanel`.
- Cards de proyectos recomendados (solo limpieza interior).
- Hooks existentes: `useMisPostulaciones`, `useCertificados`, `useNotificaciones`, `useProyectos`, `usePerfil`.

---

## Qué se elimina

- Las 3 `MetricCard` (Perfil + Postulaciones + Certificados).
- El `motion.div` vacío al final del HeroBanner (donde irían los stats vacíos actualmente).
- La línea vertical + dots del timeline de Actividad reciente.
- El campo `Límite:` en `ProjectCard`.
- El `Link to="/mis-postulaciones"` del footer de Actividad reciente.
- El componente `MetricCard` completo (ya no se usa).
- El componente `Ring` con icono (se reutiliza el SVG del anillo, sin icono, en el widget de perfil).

---

## Cambios por sección

### 1. Hero Banner — reducir altura y añadir stats

**Altura:** `minHeight: 200` → `minHeight: 160`. Padding: `36px 40px` → `28px 40px`.

**Stats en el lado derecho** (dentro del `motion.div` que hoy está vacío):

Estructura: tres bloques separados por divisores verticales.

```
[  12  ] | [  5  ] | [  3  ]
postul.      acept.    certif.
```

Cada bloque:
- Número: `fontSize: 34`, `fontWeight: 800`, `color: '#fff'`, `letterSpacing: '-0.04em'`
- Label: `fontSize: 10`, `fontWeight: 600`, `color: 'rgba(255,255,255,0.5)'`, `textTransform: 'uppercase'`, `letterSpacing: '0.1em'`
- Divisor: `width: 1px`, `height: 50px`, `background: 'rgba(255,255,255,0.12)'`

Los números usan la animación `useCountUp` existente (ya está en el archivo).

En mobile (`< 768px`), los stats se apilan debajo del texto en `flexDirection: 'row'`, `justifyContent: 'center'`, con separación visual.

**En el componente principal**, pasar `totalCertificados` al Hero (ya recibe `certificados`).

---

### 2. Eliminar MetricCards

Borrar el bloque `motion.div` completo que contiene los 3 `<MetricCard .../>`.
El componente `MetricCard` puede borrarse también del archivo (ya no se referencia).

---

### 3. Nueva sección: "Tu siguiente paso"

**Posición:** Justo debajo del Hero Banner, antes del layout de 2 columnas.
**Altura:** ~60px. Ancho completo.

**Lógica de prioridad (primera condición que aplique):**

| Condición | Mensaje | Ruta | Color borde |
|-----------|---------|------|-------------|
| `postulacion.estado === 'VALIDADO_MYPE'` existe | "Una MYPE validó tu postulación — confirma tu participación en [proyectoTitulo]" | `/mis-postulaciones` | `#dc2626` (rojo) |
| `postulacion.estado === 'CONFIRMADO'` y `proyectoEstado === 'EN_REVISION'` | "Tu proyecto [proyectoTitulo] está en revisión — revisa el estado" | `/workspace/${proyectoId}` | `#f59e0b` (ámbar) |
| `completitud < 70` | "Completa tu perfil para aumentar tus posibilidades de ser seleccionado" | `/perfil` | `#f59e0b` (ámbar) |
| `totalPostulaciones === 0` | "Explora los proyectos disponibles y postula a los que coincidan contigo" | `/proyectos` | `#1B6FE8` (azul) |
| Default | "Revisa los nuevos proyectos publicados esta semana" | `/proyectos` | `#1B6FE8` (azul) |

**Estructura visual:**
```
[ ícono ] Mensaje del paso siguiente               [ Acción → ]
```
- Fondo: `#fff`
- Borde: `1px solid #E5E7EB`
- `borderLeft: '4px solid [color de urgencia]'`
- `borderRadius: 14`
- `padding: '14px 20px'`
- Ícono: `Bell` (rojo), `AlertCircle` (ámbar), o `ArrowRight` (azul) — tamaño 16
- Texto: `fontSize: 13`, `fontWeight: 500`, `color: '#0f1f3d'`
- Botón derecho: texto del link, `fontSize: 12`, `fontWeight: 700`, `color: [color de urgencia]`, `cursor: 'pointer'`

Componente: `SiguientePasoBanner` (inline en el archivo).

---

### 4. Nueva sección: "Proyectos activos"

**Condición de render:** Solo si existe al menos una postulación con `estado === 'CONFIRMADO'` y `proyectoEstado` en `['EN_DESARROLLO', 'EN_REVISION']`.

Si no hay ninguno → la sección no se renderiza (sin mensaje "no hay").

**Posición:** Primera sección dentro de la columna principal (antes de "Proyectos recomendados").

**Header:** `"Tus proyectos activos"` + link `"Ver todo →"` → `/mis-postulaciones`.

**Card por proyecto activo:**
- Nombre del proyecto: `fontWeight: 700`, `fontSize: 14`
- MYPE: `Building2` (11px) + `mypeNombre`, color `#6b6b7a`
- Badge de estado: `EN DESARROLLO` (verde `#059669` bg `#ecfdf5`) o `EN REVISIÓN` (ámbar `#d97706` bg `#fffbeb`)
- CTA: `"Ir al workspace →"` → `/workspace/${proyectoId}`
- Estilo card: `border: '1px solid #E5E7EB'`, `borderRadius: 12`, `padding: 16`, borde superior de acento de 2px (gradiente azul)

Datos necesarios de cada postulación: `proyectoTitulo`, `mypeNombre`, `proyectoId`, `proyectoEstado`.

---

### 5. ProjectCard — limpiar y enriquecer

**Borrar:** `<div>Límite: <span ...>{proyecto.fechaLimite}</span></div>`

**Añadir en su lugar:**
```jsx
{(() => {
  const dur = renderDuracion(proyecto);
  return <div style={{ fontSize: 10, color: '#6b6b7a' }}>{dur.label}: <span style={{ fontWeight: 600, color: '#0f1f3d' }}>{dur.value}</span></div>;
})()}
```

Donde `renderDuracion` es la función ya existente en `ProyectosPage.jsx` — copiarla al archivo (o extraerla a un util compartido si el usuario lo aprueba en el futuro).

**Badge "Nuevo":**
Junto al tag de área, añadir condicionalmente:
```jsx
{(() => {
  const horasDif = (Date.now() - new Date(proyecto.fechaCreacion).getTime()) / 3600000;
  return horasDif < 48 ? (
    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 6px', borderRadius: 4, background: '#dcfce7', color: '#15803d' }}>Nuevo</span>
  ) : null;
})()}
```

---

### 6. Widget "Mi perfil" — sidebar

**Posición en sidebar:** Primer elemento del sidebar (antes de Actividad reciente y CalificacionesPendientesCard).

**Estructura:**
```
[ Anillo 80px + % ] Mi perfil
                    • Falta: CV
                    • Falta: Teléfono
                    [Completar perfil →]
```

**Anillo grande (80px):**
- SVG igual al `Ring` actual pero sin icono y con radio/dimensiones ajustados a `80px`
- En el centro: porcentaje en `fontSize: 20`, `fontWeight: 800`, color `#1B6FE8`

**Microsugerencias** (máx. 3 items):
```
if (!user?.cvUrl)       → "Agrega tu CV"
if (!user?.linkedinUrl) → "Conecta tu LinkedIn"
if (!user?.bio)         → "Completa tu biografía"
if (!user?.telefono)    → "Agrega tu teléfono"
```
Mostrar las primeras 3 que apliquen. Si `completitud === 100`: mostrar mensaje "Perfil completo ✓" y ocultar la lista.

**Botón:** `"Completar perfil →"` → `Link to="/perfil"`. Solo visible si `completitud < 100`.

**Condición de render del widget:** Siempre visible en sidebar (no condicional).

---

### 7. Actividad reciente — rediseño

**Quitar:** 
- `<div style={{ position:'absolute', left:19, top:8, bottom:8, width:1.5, background:'#E5E7EB' }}` (línea vertical)
- `<div style={{ width:10, height:10, borderRadius:'50%', ...dot }}` (el círculo/punto)
- `paddingLeft: 8` del contenedor

**Mantener el onClick** actual (leer notificación + navegar a `urlReferencia`).

**Nueva estructura por item:**
```jsx
<div
  style={{
    borderLeft: `3px solid ${colorPorTipo}`,
    borderRadius: 8,
    padding: '10px 14px',
    cursor: 'pointer',
    background: 'transparent',
    transition: 'background 0.15s',
    marginBottom: 6,
    // hover: background '#F7F8FA'
  }}
>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f1f3d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
      {item.titulo}
    </div>
    <ChevronRight size={14} color="#9CA3AF" />
  </div>
  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
    {tiempoRelativo(item.fechaCreacion)}
  </div>
  {/* Acordeón expandible al hacer click */}
  {expandido === item.id && (
    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} style={{ overflow: 'hidden' }}>
      <div style={{ fontSize: 12, color: '#6b6b7a', marginTop: 8, paddingTop: 8, borderTop: '1px solid #F3F4F6' }}>
        {item.mensaje}
      </div>
    </motion.div>
  )}
</div>
```

**Color del borde izquierdo según tipo:**
```js
const colorPorTipo = (item) => {
  if (!item.leida) return '#1B6FE8';        // azul — no leída
  if (item.tipo === 'URGENTE') return '#dc2626';  // rojo
  if (item.tipo === 'ACCION') return '#f59e0b';   // ámbar
  return '#d1d5db';                                // gris — leída/info
};
```
Si no hay campo `tipo` en la API, usar solo la condición de `!item.leida` (azul) vs gris.

**Función de tiempo relativo:**
```js
const tiempoRelativo = (fecha) => {
  if (!fecha) return 'Fecha no disponible';
  const diff = Date.now() - new Date(fecha).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (h < 1) return 'hace un momento';
  if (h < 24) return `hace ${h}h`;
  if (d === 1) return 'ayer';
  return `hace ${d} días`;
};
```

**Estado de expansión:** `const [expandido, setExpandido] = React.useState(null)` — toggle al hacer click en el item (en vez de navegar directamente, primero expandir; si ya está expandido, navegar).

**Footer "Ver todo":** 
```jsx
<button onClick={() => setIsNotifPanelOpen(true)} style={S.seeAll}>
  Ver todo <ArrowRight size={12} />
</button>
```
(Eliminar el `Link to="/mis-postulaciones"` actual.)

---

## Layout final

```
Topbar
Hero Banner (160px) con stats en la derecha
SiguientePasoBanner (full-width ~60px)
─────────────────────────────────────────────
Columna principal (2/3)    │ Sidebar (1/3)
  ProyectosActivosSection  │   PerfilWidget
  ProyectosRecomendados    │   ActividadReciente
                           │   CalificacionesPendientesCard
─────────────────────────────────────────────
NotificacionesPanel (modal)
```

---

## Datos derivados necesarios en el componente principal

```js
// Proyectos activos (ya trabajan con campos de postulación)
const proyectosActivos = postulaciones?.filter(
  p => p.estado === 'CONFIRMADO' && ['EN_DESARROLLO', 'EN_REVISION'].includes(p.proyectoEstado)
) || [];

// Postulaciones con oferta pendiente
const ofertasPendientes = postulaciones?.filter(p => p.estado === 'VALIDADO_MYPE') || [];

// Stats para hero
const aceptados = postulaciones?.filter(
  p => ['CONFIRMADO', 'VALIDADO_MYPE'].length // mantener lógica actual
) || [];

// Microsugerencias de perfil
const sugerencias = [
  !user?.cvUrl && 'Agrega tu CV',
  !user?.linkedinUrl && 'Conecta tu LinkedIn',
  !user?.bio && 'Completa tu biografía',
  !user?.telefono && 'Agrega tu teléfono',
].filter(Boolean).slice(0, 3);
```

---

## Nuevos iconos a importar (adicionales a los actuales)

```js
import { AlertCircle, ChevronRight } from 'lucide-react';
```

Eliminar de imports: `ScanFace`, `ClipboardList`, `BadgeCheck` (usados solo en MetricCard).

---

## Spec self-review

- ✅ No hay TBDs ni secciones incompletas.
- ✅ El tipo de notificación (`item.tipo`) puede no existir en la API — el spec lo maneja con fallback.
- ✅ La condición "entregable vencido" se simplificó a `proyectoEstado === 'EN_REVISION'` (sin hook extra).
- ✅ `renderDuracion` se copia del ProyectosPage (pequeña duplicación temporal aceptable).
- ✅ El componente `Ring` se reutiliza/adapta para el widget de perfil.
- ✅ Los datos de `proyectosActivos` vienen de `postulaciones` (no requiere hook adicional).
- ✅ El layout responsive en Hero (mobile) queda como mejora progresiva con media query inline.
