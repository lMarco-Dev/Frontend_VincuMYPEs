# Spec: Rediseño Visual ProyectosPage

**Fecha:** 2026-06-12  
**Archivo objetivo:** `src/pages/estudiante/ProyectosPage.jsx`  
**Referencia visual:** Paleta corporativa del sistema (navy + azul `#1B6FE8`, superficies blancas, sin colores vibrantes)

---

## Objetivo

Rediseñar visualmente la página de exploración de proyectos para lograr sobriedad, jerarquía clara y coherencia con el sistema visual. Sin romper funcionalidad existente (filtros, paginación, postulación, URL params, auto-refresh, límite de proyectos activos).

---

## Restricciones

- No eliminar ni cambiar lógica de hooks, filtros, paginación, postulación.
- No agregar secciones nuevas.
- No eliminar la distinción `yaPostulo` / disponible.
- No usar colores ámbar, verde, violeta, rojo como acentos. Solo azul `#1B6FE8` para acciones importantes.
- `mypeDireccion` como dato real de ubicación, con fallback a `"Cajamarca"`.
- Mantener `RatingDisplay` pero moverlo cerca del título.

---

## Cambios por componente

### 1. `ExploreHero`

**Canvas:** sin cambios (partículas + mouse interaction).  
**Gradiente:** sin cambios (`#0d1b35` → `#1e3a5f` → `#1B6FE8`).

**Eliminar:** badge animado con texto rotativo y colores multicolor (`badgeText`, `badgeColor`, `messages`, `useEffect` del intervalo).

**Agregar:** indicador estático "Sistema activo" (mismo patrón del MYPE dashboard):
```jsx
<div style={{
  display: "inline-flex", alignItems: "center", gap: 8,
  background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)",
  borderRadius: 999, padding: "5px 12px", fontSize: 10,
  fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
  marginBottom: 12,
}}>
  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", 
    animation: "vping 1.8s cubic-bezier(0,0,.2,1) infinite" }} />
  Sistema activo
</div>
```

**Texto:** título `"Explora proyectos disponibles"`, subtítulo `"Conecta con empresas de Cajamarca. Construye tu experiencia."`. Sin texto de badge adicional.

**Altura:** `minHeight: 120` (reducida de 140).

---

### 2. `ProjectCardLinkedIn`

**Badge de vacantes:** reemplazar el sistema de colores semánticos por solo azul/gris:

| Estado | Render |
|--------|--------|
| `available` (≥4) | texto gris: `"N vacantes"` |
| `limited` (2–3) | texto azul `#1B6FE8` normal: `"N vacantes"` |
| `urgent` (1) | texto azul `#1B6FE8` negrita: `"1 vacante"` |
| `complete` (0) | texto gris apagado `#9CA3AF`: `"Completo"` |

Sin fondo de color, sin borde de color, sin ícono. Solo texto compacto.

**Ubicación en tarjeta:** usar `proyecto.mypeDireccion || "Cajamarca"` en lugar de `proyecto.ubicacion || "Cajamarca"`.

**Sin otros cambios** en la estructura de la tarjeta.

---

### 3. `ProjectDetailPanel` — cabecera

**Estructura actual:** área badge → título → nombre MYPE (solo texto).

**Nueva estructura de cabecera:**

```jsx
{/* Área badge */}
<div style={{ ...areaBadge, marginBottom: 10 }}>{area}</div>

{/* Título */}
<h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f1f3d", 
  lineHeight: 1.3, marginBottom: 10 }}>{proyecto.titulo}</h2>

{/* Fila MYPE: nombre + rating + dirección */}
<div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
  fontSize: 13, paddingBottom: 16, borderBottom: "1px solid #f1f5f9" }}>
  {/* Nombre (link si mypeId) */}
  <span style={{ fontWeight: 600, color: "#0f1f3d" }}>
    {proyecto.mypeNombre || "Empresa"}
  </span>
  {/* Separador */}
  <span style={{ color: "#e5e7eb" }}>·</span>
  {/* Rating */}
  {proyecto.mypeUsuarioId && <RatingDisplay usuarioId={proyecto.mypeUsuarioId} size="sm" />}
  {/* Dirección */}
  {proyecto.mypeDireccion && (
    <span style={{ fontSize: 11, color: "#6b7280", display: "flex", 
      alignItems: "center", gap: 3 }}>
      <MapPin size={10} style={{ color: "#1B6FE8" }} />
      {proyecto.mypeDireccion}
    </span>
  )}
</div>
```

**Sección "Sobre la empresa":** se mantiene igual abajo como contexto ampliado, pero sin el nombre + rating (ya están arriba). Solo queda la descripción de la MYPE (`mypeDescripcion`).

---

### 4. `ProjectDetailPanel` — sección de postulación

**Botón Postular (`PostularButton`):** sin cambios de lógica.

**Estilo del bloque:** agregar un separador `borderTop: "1px solid #f1f5f9"` y `paddingTop: 16` antes del botón para separarlo visualmente del contenido.

**Estado "proyecto completo":** mantener el bloque existente pero usando colores apagados (fondo `#f8fafc`, borde `#e5e7eb`, texto gris) en lugar del verde vibrante actual.

---

### 5. `ProjectDetailPanel` — placeholder

Mantener la estructura actual. Mejorar solo el aspecto visual:
- Ícono `Briefcase` con `opacity: 0.15` (reducida de 0.25).
- Texto: `"Selecciona un proyecto para ver los detalles"` — sin cambios.
- Fondo: `#f8fafc` con borde `1px solid #e5e7eb`.
- Alineación: `minHeight: 300`, centrado vertical con flex.

---

### 6. Estilos globales

Agregar al bloque `<style>` existente:
```css
@keyframes vping { 75%, 100% { transform: scale(2.4); opacity: 0; } }
```
(para el indicador "Sistema activo" del hero).

---

## Lo que NO cambia

- Lógica de `getVacancyStatus` (se puede dejar, solo cambia el render).
- `AREA_STYLES`, `getAreaStyle`, `getGradient`, `getAreaIcon`.
- `ESTADOS_POSTULACION_ACTIVA`, `ESTADOS_PROYECTO_ACTIVOS`.
- `Pagination` component — sin cambios.
- Búsqueda + filtros — sin cambios.
- Grid `490px 1fr` — sin cambios.
- `useEffect` de auto-refresh, URL params, límite de proyectos.
- `PostularButton` — sin cambios de lógica.
- `RatingDisplay` — se mueve de lugar, no se modifica.
- `renderDuracion`, `renderDuracionLocal` — sin cambios.
- Métricas (fecha, cupos, ubicación), barra de progreso de vacantes — sin cambios.

---

## Imports afectados

Después de los cambios, los siguientes íconos de lucide-react pueden quedar sin uso y deben removerse si ESLint los reporta:
`Award`, `Bell`, `Eye`, `GraduationCap`, `Hash`, `Star`, `Target`, `TrendingUp`, `Zap` (reemplazado en render), `AlertCircle` (reemplazado en render), `UserPlus` (reemplazado en render).

Verificar ítem por ítem — algunos pueden usarse en `getVacancyStatus` aunque no se rendericen.
