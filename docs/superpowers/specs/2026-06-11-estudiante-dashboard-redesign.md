# Spec: Rediseño Visual EstudianteDashboardPage

**Fecha:** 2026-06-11  
**Archivo objetivo:** `src/pages/estudiante/EstudianteDashboardPage.jsx`  
**Referencia visual:** `src/pages/mype/MypeDashboardPage.jsx`

---

## Objetivo

Rediseñar visualmente el dashboard del estudiante para que sea sobrio, limpio y coherente con el sistema visual del dashboard de MYPE, sin romper ninguna funcionalidad existente (hooks, navegación, notificaciones, panel de notificaciones).

---

## Restricciones

- No eliminar ni reemplazar componentes existentes (HeroBanner, MetricCard, ProjectCard, Panel, Ring).
- No modificar lógica de hooks ni de navegación.
- No romper `NotificacionesPanel` ni el botón de campana.
- `CalificacionesPendientesCard` se agrega al sidebar (actualmente importado pero no usado).
- Parches localizados; no refactorizar lo que no toca al rediseño.

---

## Cambios por sección

### 1. HeroBanner — Stats animados

**Problema actual:** El array de stats está vacío (`[]`), por lo que el lado derecho del banner queda en blanco.

**Solución:** Reemplazar el array vacío por 3 objetos con datos reales pasados como props:

| Stat | Valor | Label | Color barra |
|------|-------|-------|-------------|
| Postulaciones | `totalPostulaciones` | POSTULACIONES | `#1B6FE8` |
| Aceptadas | `aceptados` | ACEPTADAS | `#4ade80` |
| Certificados | `totalCertificados` | CERTIFICADOS | `#f59e0b` |

Patrón visual: igual a `MiniContext` del MYPE — número grande en `#67d4f8`, label en `rgba(255,255,255,0.3)`, separadores verticales entre stats, fondo `rgba(255,255,255,0.05)` con borde sutil.

Props añadidas a `HeroBanner`: `certificados` (number).

### 2. MetricCards (3 columnas)

Sin cambios. El diseño actual es correcto y coherente con MYPE.

### 3. Layout inferior — Opción B (columna principal + sidebar)

**Grid:** `1fr 340px` (en lugar de `1fr 1fr`).

**Columna izquierda (1fr):**  
Panel "Proyectos recomendados" — sin cambios de contenido.

**Sidebar (340px) — 3 paneles apilados con `gap: 20`:**

#### 3a. Actividad reciente
Adopta el estilo de timeline del MYPE:
- Línea vertical izquierda (`position: absolute`, `left: 19px`, `width: 1.5px`, `background: #E5E7EB`).
- Puntos indicadores con halo (`boxShadow: 0 0 0 3px rgba(...)`) — azul para no leídas, gris para leídas.
- Hover: fondo `#F7F8FA` con `paddingLeft` suave.
- Sin cambios en la lógica de `leerNotificacion` ni navegación.

#### 3b. CalificacionesPendientesCard
Insertar el componente ya importado. Sin props adicionales.

#### 3c. Accesos rápidos
Nuevo panel con 2 `QuickAction`-style links (mismo patrón visual que MYPE):
- **Buscar proyectos** → `/proyectos` (fondo `#EFF6FF`, color `#1B6FE8`, ícono `Search`)
- **Completar perfil** → `/perfil` (fondo `#F5F3FF`, color `#7C3AED`, ícono `ScanFace`)

Cada ítem: padding 12, borderRadius 13, ícono en caja blanca 30×30, flecha `ArrowUpRight` a la derecha.

### 4. Topbar

Sin cambios estructurales. El diseño actual es limpio. Solo ajuste menor: los botones (Buscar proyectos, campana) se eliminan del topbar ya que "Buscar proyectos" queda en el nuevo panel de accesos rápidos. La campana se mantiene.

**Actualización:** Dejar el botón "Buscar proyectos" en el topbar también — proporciona acceso rápido desde arriba sin duplicar lógica.

---

## Animaciones

- Canvas de partículas: sin cambios.
- Animación de palabras (`words` array): sin cambios.
- `fadeUp` en todas las secciones: sin cambios.
- Nuevos stats del banner: usar el mismo `useEffect` de conteo animado ya existente en `HeroBanner`.

---

## Componentes modificados

| Componente | Tipo de cambio |
|-----------|---------------|
| `HeroBanner` | Agregar prop `certificados`; llenar array de stats |
| `EstudianteDashboardPage` | Cambiar grid inferior a `1fr 340px`; agregar sidebar; mover actividad a sidebar; agregar `CalificacionesPendientesCard`; agregar panel de accesos rápidos |

## Componentes sin cambios

`MetricCard`, `ProjectCard`, `Panel`, `Ring`, `useCountUp`, `AREA_STYLES`, `getAreaStyle`, paleta `C`, variantes `fadeUp`.

---

## Dependencias

No se agregan dependencias nuevas. Se reutilizan íconos ya importados (`Search`, `ScanFace`, `ArrowRight`) y se agrega `ArrowUpRight` de `lucide-react`.
