# EstudianteDashboardPage v2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar `EstudianteDashboardPage.jsx` para integrar stats en el Hero, eliminar MetricCards, añadir "Tu siguiente paso", proyectos activos, widget de perfil en sidebar y actividad reciente compacta.

**Architecture:** Todo el cambio vive en un solo archivo (`EstudianteDashboardPage.jsx`). Se añaden componentes inline (en el mismo archivo) siguiendo el patrón existente. No se crean hooks nuevos — los datos necesarios ya están disponibles en los hooks que el componente ya usa.

**Tech Stack:** React 18, framer-motion, lucide-react, react-router-dom, TanStack Query.

---

## Mapa de archivos

| Archivo | Acción | Responsabilidad |
|---------|--------|-----------------|
| `src/pages/estudiante/EstudianteDashboardPage.jsx` | Modificar | Único archivo a tocar. Todos los componentes nuevos se añaden inline aquí. |

---

## Task 1: Actualizar imports y eliminar MetricCard

**Files:**
- Modify: `src/pages/estudiante/EstudianteDashboardPage.jsx:1-21` (imports lucide)
- Modify: `src/pages/estudiante/EstudianteDashboardPage.jsx:132-177` (componente MetricCard)

- [ ] **Step 1.1: Reemplazar imports de lucide-react**

En la línea 11-20 del archivo, reemplazar el bloque completo de imports de lucide:

```jsx
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Bell,
  Search,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
```

> Se eliminan: `ScanFace`, `ClipboardList`, `BadgeCheck` (usados solo en MetricCard).
> Se añaden: `AlertCircle` (SiguientePasoBanner), `ChevronRight` (ActividadReciente).

- [ ] **Step 1.2: Eliminar el componente MetricCard**

Borrar las líneas 132–177 completas (desde `/* ═══ SUB: Metric Card ═══ */` hasta el `};` de cierre del componente `MetricCard`). El componente `Ring` (líneas 83-108) se mantiene — se reutilizará adaptado en el PerfilWidget.

- [ ] **Step 1.3: Verificar que no hay referencias a MetricCard**

Buscar en el archivo que no quede ningún `<MetricCard` ni import de `ScanFace`, `ClipboardList`, `BadgeCheck`. Si el editor muestra errores de "not defined", confirmar que se eliminaron correctamente.

- [ ] **Step 1.4: Commit**

```bash
git add src/pages/estudiante/EstudianteDashboardPage.jsx
git commit -m "refactor(dashboard): eliminar MetricCard y actualizar imports"
```

---

## Task 2: Añadir funciones helper

**Files:**
- Modify: `src/pages/estudiante/EstudianteDashboardPage.jsx` — añadir después del bloque `getAreaStyle` (línea ~81)

- [ ] **Step 2.1: Añadir `renderDuracion` justo después de `getAreaStyle`**

```jsx
/* ─── Duración estimada de un proyecto ─── */
const renderDuracion = (proyecto) => {
  if (proyecto.diasEstimados) return { label: 'Duración', value: `${proyecto.diasEstimados} días` };
  if (proyecto.fechaLimiteCalculada) return { label: 'Fecha límite', value: new Date(proyecto.fechaLimiteCalculada).toLocaleDateString('es-PE') };
  if (proyecto.fechaLimite) {
    const dias = Math.ceil((new Date(proyecto.fechaLimite) - Date.now()) / 86400000);
    if (dias > 0) return { label: 'Duración aprox.', value: `${dias} días` };
  }
  return { label: 'Duración', value: 'Por definir' };
};
```

- [ ] **Step 2.2: Añadir `tiempoRelativo` justo después de `renderDuracion`**

```jsx
/* ─── Tiempo relativo para notificaciones ─── */
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

- [ ] **Step 2.3: Añadir `colorNotif` justo después de `tiempoRelativo`**

```jsx
/* ─── Color del borde izquierdo por estado de notificación ─── */
const colorNotif = (item) => {
  if (!item.leida) return '#1B6FE8';
  return '#d1d5db';
};
```

- [ ] **Step 2.4: Commit**

```bash
git add src/pages/estudiante/EstudianteDashboardPage.jsx
git commit -m "feat(dashboard): añadir helpers renderDuracion, tiempoRelativo, colorNotif"
```

---

## Task 3: Modificar HeroBanner — altura y stats

**Files:**
- Modify: `src/pages/estudiante/EstudianteDashboardPage.jsx` — componente `HeroBanner` (~líneas 246-450)

- [ ] **Step 3.1: Reducir altura del Hero**

En el `style` del `motion.div` raíz del HeroBanner (la que tiene `background: linear-gradient(...)`), cambiar:
- `padding: '36px 40px'` → `padding: '28px 40px'`
- `minHeight: 200` → `minHeight: 160`

- [ ] **Step 3.2: Rellenar el motion.div vacío con los 3 stats**

Localizar el bloque vacío al final del HeroBanner (actualmente tiene solo un comentario `{/* Stats (estilo MYPE) */}` y un `motion.div` con el interior vacío). Reemplazar el contenido interior de ese `motion.div` con:

```jsx
{[
  { num: counts.a, label: 'postulaciones' },
  { num: counts.b, label: 'aceptadas'     },
  { num: counts.c, label: 'certificados'  },
].map((stat, i) => (
  <React.Fragment key={i}>
    {i > 0 && (
      <div style={{ width: 1, height: 50, background: 'rgba(255,255,255,0.12)', margin: '0 24px' }} />
    )}
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 34, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>
        {stat.num}
      </div>
      <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>
        {stat.label}
      </div>
    </div>
  </React.Fragment>
))}
```

> `counts.a`, `counts.b`, `counts.c` ya son calculados por el `useEffect` de animación de contadores existente en el componente. La animación ya funciona — solo faltaba renderizar los valores.

- [ ] **Step 3.3: Verificar que el subtítulo del Hero no tiene padding innecesario**

El `<motion.p>` de subtítulo tiene `marginBottom: 24` — reducirlo a `marginBottom: 0` ya que el padding del hero se comprime.

- [ ] **Step 3.4: Arrancar dev server y verificar visualmente**

```bash
npm run dev
```

Abrir `http://localhost:5173` (o el puerto que use el proyecto). Verificar:
- Hero más compacto (~160px)
- Los 3 números aparecen animados a la derecha
- Partículas y orbs funcionan igual

- [ ] **Step 3.5: Commit**

```bash
git add src/pages/estudiante/EstudianteDashboardPage.jsx
git commit -m "feat(dashboard): reducir hero y añadir stats animados en el lado derecho"
```

---

## Task 4: Eliminar MetricCards del componente principal

**Files:**
- Modify: `src/pages/estudiante/EstudianteDashboardPage.jsx` — bloque de métricas (~líneas 552-584)

- [ ] **Step 4.1: Eliminar el bloque de las 3 MetricCard**

Localizar y borrar el bloque completo:
```jsx
{/* ── MÉTRICAS ── */}
<motion.div {...fadeUp(0.16)} style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
  <MetricCard ... />
  <MetricCard ... />
  <MetricCard ... />
</motion.div>
```

- [ ] **Step 4.2: Verificar que la página no tiene errores de consola**

Con el dev server corriendo, abrir la consola del navegador y confirmar que no hay errores de "MetricCard is not defined" ni warnings de hooks.

- [ ] **Step 4.3: Commit**

```bash
git add src/pages/estudiante/EstudianteDashboardPage.jsx
git commit -m "feat(dashboard): eliminar 3 MetricCards grandes"
```

---

## Task 5: Añadir SiguientePasoBanner

**Files:**
- Modify: `src/pages/estudiante/EstudianteDashboardPage.jsx` — añadir componente antes de `HeroBanner`, integrar en el render

- [ ] **Step 5.1: Añadir el componente `SiguientePasoBanner`**

Añadir justo antes del componente `HeroBanner` (línea ~246):

```jsx
/* ═══════════════════════════════════════════════
   SUB: SiguientePasoBanner
═══════════════════════════════════════════════ */
const SiguientePasoBanner = ({ postulaciones = [], completitud = 0, navigate }) => {
  const oferta     = postulaciones.find(p => p.estado === 'VALIDADO_MYPE');
  const enRevision = postulaciones.find(
    p => p.estado === 'CONFIRMADO' && p.proyectoEstado === 'EN_REVISION'
  );

  let cfg;
  if (oferta) {
    cfg = {
      Icon:   Bell,
      color:  '#dc2626',
      texto:  `Una MYPE validó tu postulación — confirma tu participación en "${oferta.proyectoTitulo || 'el proyecto'}"`,
      accion: 'Ver oferta',
      ruta:   '/mis-postulaciones',
    };
  } else if (enRevision) {
    cfg = {
      Icon:   AlertCircle,
      color:  '#f59e0b',
      texto:  `Tu proyecto "${enRevision.proyectoTitulo || 'activo'}" está en revisión — revisa el estado`,
      accion: 'Ir al workspace',
      ruta:   `/workspace/${enRevision.proyectoId}`,
    };
  } else if (completitud < 70) {
    cfg = {
      Icon:   ArrowUpRight,
      color:  '#f59e0b',
      texto:  'Completa tu perfil para aumentar tus posibilidades de ser seleccionado',
      accion: 'Completar perfil',
      ruta:   '/perfil',
    };
  } else {
    cfg = {
      Icon:   ArrowRight,
      color:  '#1B6FE8',
      texto:  'Revisa los nuevos proyectos publicados esta semana',
      accion: 'Ver proyectos',
      ruta:   '/proyectos',
    };
  }

  return (
    <motion.div
      {...fadeUp(0.14)}
      style={{
        background:   '#fff',
        border:       `1px solid ${C.border}`,
        borderLeft:   `4px solid ${cfg.color}`,
        borderRadius: 14,
        padding:      '14px 20px',
        display:      'flex',
        alignItems:   'center',
        gap:          12,
        marginBottom: 20,
      }}
    >
      <cfg.Icon size={16} color={cfg.color} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: C.ink }}>
        {cfg.texto}
      </div>
      <button
        onClick={() => navigate(cfg.ruta)}
        style={{
          fontSize:    12,
          fontWeight:  700,
          color:       cfg.color,
          background:  'none',
          border:      'none',
          cursor:      'pointer',
          display:     'flex',
          alignItems:  'center',
          gap:         4,
          flexShrink:  0,
        }}
      >
        {cfg.accion} <ArrowRight size={12} />
      </button>
    </motion.div>
  );
};
```

- [ ] **Step 5.2: Integrar el banner en el render del componente principal**

Justo después de la línea `<HeroBanner ... />` en el return del componente principal, añadir:

```jsx
{/* ── SIGUIENTE PASO ── */}
<SiguientePasoBanner
  postulaciones={postulaciones || []}
  completitud={completitud}
  navigate={navigate}
/>
```

- [ ] **Step 5.3: Verificar visualmente**

Con el dev server corriendo, confirmar que aparece el banner de siguiente paso con el color y mensaje correcto según el estado del usuario de prueba.

- [ ] **Step 5.4: Commit**

```bash
git add src/pages/estudiante/EstudianteDashboardPage.jsx
git commit -m "feat(dashboard): añadir SiguientePasoBanner con lógica de prioridad"
```

---

## Task 6: Añadir ProyectosActivosSection

**Files:**
- Modify: `src/pages/estudiante/EstudianteDashboardPage.jsx` — añadir componentes + integrar en columna principal

- [ ] **Step 6.1: Actualizar dato derivado `proyectosActivos` en el componente principal**

En el bloque de datos derivados (~línea 474), reemplazar:
```jsx
const proyectosActivos = postulaciones?.filter(p => p.estado === 'CONFIRMADO' || p.estado === 'ACEPTADO' || p.estado === 'Aceptado') || [];
```
Por:
```jsx
const proyectosActivos = postulaciones?.filter(
  p => p.estado === 'CONFIRMADO' && ['EN_DESARROLLO', 'EN_REVISION'].includes(p.proyectoEstado)
) || [];
```

- [ ] **Step 6.2: Añadir componente `ActiveProjectCard`**

Añadir justo antes de `SiguientePasoBanner` (que añadiste en Task 5):

```jsx
/* ═══════════════════════════════════════════════
   SUB: ActiveProjectCard
═══════════════════════════════════════════════ */
const ActiveProjectCard = ({ postulacion }) => {
  const nav = useNavigate();
  const isEnRevision = postulacion.proyectoEstado === 'EN_REVISION';
  const badgeColor   = isEnRevision ? '#d97706' : '#059669';
  const badgeBg      = isEnRevision ? '#fffbeb' : '#ecfdf5';
  const badgeText    = isEnRevision ? 'En revisión' : 'En desarrollo';

  return (
    <div
      style={{
        background:  '#fff',
        border:      '1px solid #E5E7EB',
        borderRadius: 12,
        padding:     16,
        position:    'relative',
        overflow:    'hidden',
        flex:        1,
        minWidth:    220,
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#1B6FE8,#06B6D4)' }} />
      <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 6, lineHeight: 1.3 }}>
        {postulacion.proyectoTitulo || 'Proyecto activo'}
      </div>
      <div style={{ fontSize: 11, color: '#6b6b7a', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
        <Building2 size={11} /> {postulacion.mypeNombre || 'MYPE'}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
          textTransform: 'uppercase', padding: '3px 8px',
          borderRadius: 4, background: badgeBg, color: badgeColor,
        }}>
          {badgeText}
        </span>
        <button
          onClick={() => nav(`/workspace/${postulacion.proyectoId}`)}
          style={{
            fontSize: 11, fontWeight: 700, color: '#1B6FE8',
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 3,
          }}
        >
          Ir al workspace <ArrowRight size={11} />
        </button>
      </div>
    </div>
  );
};
```

- [ ] **Step 6.3: Cambiar el layout de la columna principal de Panel a div contenedor**

En el componente principal, la columna principal actualmente tiene solo un `<Panel>` (proyectos recomendados). Ahora necesita dos secciones. Envolver ambas en un `div` flex:

Reemplazar:
```jsx
{/* ── FILA INFERIOR: PROYECTOS + SIDEBAR ── */}
<div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
  {/* Proyectos recomendados */}
  <Panel delay={0.20}>
    ...
  </Panel>
```

Por:
```jsx
{/* ── FILA INFERIOR: PROYECTOS + SIDEBAR ── */}
<div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
  {/* ── COLUMNA PRINCIPAL ── */}
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

    {/* Proyectos activos — solo si hay */}
    {proyectosActivos.length > 0 && (
      <Panel delay={0.18}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={S.sectionTitle}><span style={S.sectionBar} />Tus proyectos activos</div>
          <Link to="/mis-postulaciones" style={S.seeAll}>Ver todo <ArrowRight size={12} /></Link>
        </div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {proyectosActivos.map(p => (
            <ActiveProjectCard key={p.id || p.proyectoId} postulacion={p} />
          ))}
        </div>
      </Panel>
    )}

    {/* Proyectos recomendados */}
    <Panel delay={0.20}>
      ...  {/* contenido existente sin cambios aún */}
    </Panel>

  </div>  {/* fin columna principal */}
```

> Importante: cerrar el `</div>` de columna principal antes del bloque del sidebar.

- [ ] **Step 6.4: Verificar visualmente**

Confirmar que:
- Si el estudiante no tiene proyectos activos → sección "Tus proyectos activos" no aparece.
- Si tiene alguno → aparece con el badge correcto y el botón "Ir al workspace".

- [ ] **Step 6.5: Commit**

```bash
git add src/pages/estudiante/EstudianteDashboardPage.jsx
git commit -m "feat(dashboard): añadir sección de proyectos activos con ActiveProjectCard"
```

---

## Task 7: Limpiar ProjectCard — quitar Límite, añadir duración y badge "Nuevo"

**Files:**
- Modify: `src/pages/estudiante/EstudianteDashboardPage.jsx` — componente `ProjectCard` (~líneas 182-241)

- [ ] **Step 7.1: Reemplazar el bloque inferior de ProjectCard**

En `ProjectCard`, localizar el `<div>` que tiene el texto `Límite:`:
```jsx
<div style={{ fontSize: 10, color: '#6b6b7a' }}>
  Límite: <span style={{ color: '#e24b4a', fontWeight: 600 }}>{proyecto.fechaLimite}</span>
</div>
```

Reemplazarlo por:
```jsx
{(() => {
  const dur = renderDuracion(proyecto);
  return (
    <div style={{ fontSize: 10, color: '#6b6b7a' }}>
      {dur.label}: <span style={{ fontWeight: 600, color: '#0f1f3d' }}>{dur.value}</span>
    </div>
  );
})()}
```

- [ ] **Step 7.2: Añadir badge "Nuevo" junto al tag de área**

En `ProjectCard`, localizar el `<span>` que muestra el área:
```jsx
<span style={{ fontSize: 9, fontWeight: 700, ..., display: 'inline-flex', ... marginBottom: 10 }}>
  {area}
</span>
```

Envolver ese span y el badge en un `div` flex, añadiendo el badge condicionalmente:

```jsx
<div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4, background: bg, color, display: 'inline-flex', alignItems: 'center' }}>
    {area}
  </span>
  {proyecto.fechaCreacion && (Date.now() - new Date(proyecto.fechaCreacion).getTime()) < 172800000 && (
    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 6px', borderRadius: 4, background: '#dcfce7', color: '#15803d' }}>
      Nuevo
    </span>
  )}
</div>
```

> `172800000` = 48 horas en milisegundos.

- [ ] **Step 7.3: Verificar visualmente**

En la lista de proyectos recomendados, confirmar:
- No aparece "Límite: ..." 
- Aparece "Duración: X días" o "Por definir"
- Proyectos recientes muestran el badge verde "Nuevo"

- [ ] **Step 7.4: Commit**

```bash
git add src/pages/estudiante/EstudianteDashboardPage.jsx
git commit -m "feat(dashboard): quitar campo Límite en ProjectCard, añadir duración y badge Nuevo"
```

---

## Task 8: Añadir PerfilWidget en sidebar

**Files:**
- Modify: `src/pages/estudiante/EstudianteDashboardPage.jsx` — añadir componente + integrar en sidebar

- [ ] **Step 8.1: Añadir dato derivado `sugerencias`**

En el bloque de datos derivados del componente principal (después de `completitud`), añadir:

```jsx
const sugerencias = [
  !user?.cvUrl        && 'Agrega tu CV',
  !user?.linkedinUrl  && 'Conecta tu LinkedIn',
  !user?.bio          && 'Completa tu biografía',
  !user?.telefono     && 'Agrega tu teléfono',
].filter(Boolean).slice(0, 3);
```

- [ ] **Step 8.2: Añadir componente `PerfilWidget`**

Añadir justo antes de `ActiveProjectCard` (en la zona de componentes inline, por encima del `HeroBanner`):

```jsx
/* ═══════════════════════════════════════════════
   SUB: PerfilWidget (sidebar)
═══════════════════════════════════════════════ */
const PerfilWidget = ({ completitud = 0, sugerencias = [] }) => {
  const R    = 34;
  const circ = 2 * Math.PI * R;
  const offset = circ - (circ * Math.min(completitud, 100)) / 100;

  return (
    <Panel delay={0.20}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: sugerencias.length > 0 && completitud < 100 ? 14 : 0 }}>
        {/* Anillo sin icono */}
        <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
          <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="40" cy="40" r={R} stroke="#f1f5f9" strokeWidth="6" fill="none" />
            <circle
              cx="40" cy="40" r={R}
              stroke="#1B6FE8" strokeWidth="6" fill="none"
              strokeDasharray={circ} strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            fontSize: 18, fontWeight: 800, color: '#1B6FE8',
          }}>
            {completitud}%
          </div>
        </div>
        {/* Info */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 2 }}>
            Mi perfil
          </div>
          {completitud === 100 ? (
            <div style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>Perfil completo ✓</div>
          ) : (
            <div style={{ fontSize: 11, color: '#6b6b7a' }}>{completitud}% completado</div>
          )}
        </div>
      </div>

      {completitud < 100 && sugerencias.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          {sugerencias.map((s, i) => (
            <div key={i} style={{ fontSize: 12, color: '#6b6b7a', padding: '4px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#d1d5db', flexShrink: 0 }} />
              {s}
            </div>
          ))}
        </div>
      )}

      {completitud < 100 && (
        <Link to="/perfil" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#1B6FE8', display: 'flex', alignItems: 'center', gap: 4 }}>
            Completar perfil <ArrowRight size={12} />
          </div>
        </Link>
      )}
    </Panel>
  );
};
```

- [ ] **Step 8.3: Integrar PerfilWidget como primer elemento del sidebar**

En el bloque del sidebar, añadir `<PerfilWidget>` como primer hijo:

```jsx
{/* ── SIDEBAR ── */}
<div style={{ display:'flex', flexDirection:'column', gap:20 }}>

  {/* Perfil */}
  <PerfilWidget completitud={completitud} sugerencias={sugerencias} />

  {/* Actividad reciente — (existente por ahora) */}
  <Panel delay={0.24}>
    ...
  </Panel>

  {/* Calificaciones pendientes */}
  <CalificacionesPendientesCard />

</div>
```

- [ ] **Step 8.4: Verificar visualmente**

Confirmar:
- Anillo grande sin icono, con % al centro en azul
- Lista de sugerencias específicas
- Link "Completar perfil →"
- Si completitud = 100: mensaje verde, sin lista ni link

- [ ] **Step 8.5: Commit**

```bash
git add src/pages/estudiante/EstudianteDashboardPage.jsx
git commit -m "feat(dashboard): añadir PerfilWidget compacto en sidebar"
```

---

## Task 9: Rediseñar Actividad reciente

**Files:**
- Modify: `src/pages/estudiante/EstudianteDashboardPage.jsx` — bloque de ActividadReciente dentro del sidebar

- [ ] **Step 9.1: Añadir estado `expandido` en el componente principal**

En el bloque de estado del componente principal (junto a `isNotifPanelOpen`), añadir:

```jsx
const [expandido, setExpandido] = React.useState(null);
```

- [ ] **Step 9.2: Reemplazar el header del Panel de actividad**

Localizar:
```jsx
<Link to="/mis-postulaciones" style={S.seeAll}>Ver todo <ArrowRight size={12} /></Link>
```

Reemplazar por:
```jsx
<button
  onClick={() => setIsNotifPanelOpen(true)}
  style={{ ...S.seeAll, background: 'none', border: 'none', padding: 0 }}
>
  Ver todo <ArrowRight size={12} />
</button>
```

- [ ] **Step 9.3: Reemplazar el cuerpo de la lista de actividad**

Localizar el bloque que empieza con:
```jsx
<div style={{ position:'relative', paddingLeft:8 }}>
  <div style={{ position:'absolute', left:19, ... }} />   {/* línea vertical */}
  <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
    {activityItems.map((item, index) => { ... })}
  </div>
</div>
```

Reemplazarlo completamente por:

```jsx
<div style={{ display: 'flex', flexDirection: 'column' }}>
  {activityItems.map((item, index) => (
    <div
      key={item.id || index}
      onClick={() => {
        if (!item.leida) leerNotificacion(item.id);
        if (expandido === (item.id || index)) {
          const ruta = item.urlReferencia
            ? (item.urlReferencia.startsWith('/') ? item.urlReferencia : `/${item.urlReferencia}`)
            : null;
          if (ruta) navigate(ruta);
          setExpandido(null);
        } else {
          setExpandido(item.id || index);
        }
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FA'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
      style={{
        borderLeft:   `3px solid ${colorNotif(item)}`,
        borderRadius: 8,
        padding:      '10px 14px',
        cursor:       'pointer',
        background:   'transparent',
        transition:   'background 0.15s',
        marginBottom: 6,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: '#0f1f3d',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          flex: 1, marginRight: 8,
        }}>
          {item.titulo}
        </div>
        <ChevronRight
          size={14}
          color="#9CA3AF"
          style={{
            flexShrink: 0,
            transform: expandido === (item.id || index) ? 'rotate(90deg)' : 'none',
            transition: 'transform 0.2s',
          }}
        />
      </div>
      <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
        {tiempoRelativo(item.fechaCreacion)}
      </div>
      {expandido === (item.id || index) && item.mensaje && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{ overflow: 'hidden' }}
        >
          <div style={{ fontSize: 12, color: '#6b6b7a', marginTop: 8, paddingTop: 8, borderTop: '1px solid #F3F4F6' }}>
            {item.mensaje}
          </div>
        </motion.div>
      )}
    </div>
  ))}
</div>
```

- [ ] **Step 9.4: Verificar visualmente**

Confirmar:
- No hay línea vertical ni círculos azules
- Cada item tiene borde izquierdo de color
- Tiempo relativo ("hace 2h", "ayer") en lugar de la fecha completa
- Click abre acordeón con el mensaje; segundo click navega al link de la notificación
- "Ver todo" abre el panel de notificaciones (no navega a /mis-postulaciones)

- [ ] **Step 9.5: Commit**

```bash
git add src/pages/estudiante/EstudianteDashboardPage.jsx
git commit -m "feat(dashboard): rediseñar actividad reciente con acordeón y tiempo relativo"
```

---

## Task 10: Verificación final y limpieza

**Files:**
- Modify: `src/pages/estudiante/EstudianteDashboardPage.jsx` — revisión global

- [ ] **Step 10.1: Verificar que `Ring` ya no se referencia si quedó sin uso**

Buscar en el archivo si `Ring` sigue siendo usado. Si no hay ningún `<Ring` en el JSX (ya que `PerfilWidget` tiene su propio SVG inline), eliminar el componente `Ring` (líneas 83-108).

- [ ] **Step 10.2: Verificar imports finales**

El archivo debe importar exactamente estos iconos de lucide:
```jsx
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Bell,
  Search,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
```

No debe tener: `ScanFace`, `ClipboardList`, `BadgeCheck`, `ScanFace`.

- [ ] **Step 10.3: Recorrer el flujo completo en dev server**

```bash
npm run dev
```

Checklist visual:
- [ ] Topbar: saludo + buscador + campana con punto rojo si hay no leídas
- [ ] Hero: ~160px, partículas, texto animado, 3 stats a la derecha con animación de conteo
- [ ] SiguientePasoBanner: muestra el mensaje correcto y navega al hacer click
- [ ] "Tus proyectos activos": aparece solo si hay proyectos CONFIRMADO+EN_DESARROLLO/EN_REVISION; no aparece si no hay
- [ ] "Proyectos recomendados": duración en lugar de "Límite:", badge "Nuevo" en proyectos de <48h
- [ ] Sidebar: PerfilWidget con anillo grande + sugerencias, luego Actividad, luego Calificaciones
- [ ] Actividad reciente: borde de color, tiempo relativo, acordeón funciona, "Ver todo" abre el panel
- [ ] No hay errores de consola

- [ ] **Step 10.4: Commit final**

```bash
git add src/pages/estudiante/EstudianteDashboardPage.jsx
git commit -m "feat(dashboard): rediseño completo v2 — hero con stats, siguiente paso, proyectos activos, perfil sidebar, actividad compacta"
```

---

## Self-Review vs Spec

| Req. del spec | Tarea |
|---------------|-------|
| Hero ~160px + stats a la derecha | Task 3 |
| Eliminar 3 MetricCards | Task 4 |
| Banner "Tu siguiente paso" | Task 5 |
| Sección proyectos activos | Task 6 |
| ProjectCard sin Límite + duración + Nuevo | Task 7 |
| PerfilWidget en sidebar con anillo sin icono + sugerencias | Task 8 |
| ActividadReciente sin timeline + acordeón + tiempo relativo | Task 9 |
| "Ver todo" → panel de notificaciones | Task 9.2 |
| Eliminar motion.div vacío del Hero | Task 3.2 (se rellena, no queda vacío) |
| Mantener CalificacionesPendientesCard | ✅ no se toca |
| Mantener partículas/orbs del Hero | ✅ no se tocan |
| Helpers `renderDuracion`, `tiempoRelativo`, `colorNotif` | Task 2 |
| Imports limpios | Task 1 + Task 10 |

**Placeholders:** Ninguno. Cada step tiene código completo.

**Type consistency:** `postulacion.proyectoId`, `.proyectoTitulo`, `.mypeNombre`, `.proyectoEstado` — usados de forma consistente en Tasks 6 y 9 (confirmado en MisPostulacionesPage líneas 209-334).
