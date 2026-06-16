# Dashboard Estudiante — Rediseño Visual
**Fecha:** 2026-06-16  
**Archivo:** `src/pages/estudiante/EstudianteDashboardPage.jsx`

---

## Alcance

Tres cambios coordinados sobre el dashboard del estudiante (`EstudianteDashboardPage`), sin tocar arquitectura ni rutas.

---

## 1. Eliminar barra azul superior + estado "visto"

### Problema
`ProjectCard` y `ActiveProjectCard` tienen un `<div>` de `height: 2` con gradiente azul/cyan pegado al tope de cada card. Visualmente sobrecarga y el usuario quiere marcadores de "ya revisé esto".

### Cambio
- Eliminar el `<div style={{ height: 2, background: gradient }}>` de ambos componentes.
- Reemplazarlo por un **borde izquierdo de 3px** con el color del área (`WEB → #1B6FE8`, `DATA → #059669`, `UX → #8B5CF6`, default → `#1B6FE8`).
- **Estado "visto"**: los IDs de proyectos visitados se guardan en `localStorage` bajo la clave `vmp_viewed_projects` (Set serializado como JSON array).
  - Al hacer click en un `ProjectCard`, se añade el ID al Set y se persiste.
  - Card no visitada: fondo `#FCFDFD`, borde izq. color área al 100%.
  - Card visitada: fondo `#F8FAFC`, borde izq. color área al 35% de opacidad — indica "ya lo vi".
- `ActiveProjectCard` no necesita estado visto (son proyectos en los que ya participa).

### Implementación
- Hook local `useViewedProjects()` que lee/escribe `localStorage`.
- Lógica dentro de `EstudianteDashboardPage` → se pasa `isViewed` como prop a `ProjectCard`.

---

## 2. Sección "Las empresas" (scroll horizontal)

### Ubicación
Después del `SiguientePasoBanner` y antes del grid de columnas (proyectos + sidebar).

### Fuente de datos
`proyectosData.content` ya cargado. Se deduplican por `mypeId`, descartando entradas sin `mypeId`. Si el resultado está vacío, la sección no se renderiza.

### Card de empresa
- Tamaño fijo: `130 × 110px`.
- Avatar circular de 44px: inicial del nombre con color por hash (función `getAvatarColor` de ProyectosPage — copiar/importar).
- Nombre de empresa: 2 líneas máximo, `font-size: 12px`, `font-weight: 600`, centrado.
- Borde: `1px solid #F1F5F9`, fondo `#FFFFFF`, `border-radius: 14px`.
- Hover: `transform: translateY(-4px)` + `box-shadow: 0 8px 20px rgba(15,23,42,0.10)` — transición `0.18s ease`.
- Click: `navigate('/mypes/:mypeId')`.

### Contenedor
```
overflow-x: auto
display: flex
gap: 12px
padding-bottom: 8px   ← espacio para la sombra inferior de las cards
scrollbar-width: thin
```
Sin paginación, scroll nativo.

---

## 3. Mejoras visuales generales (Enfoque A — sobrio con acentos suaves)

### 3a. Headers de sección
- Mantienen la barra vertical azul de 3px existente.
- Se añade un chip pill a la derecha del título: `"N proyectos"` / `"N empresas"` etc.
  - Estilo: `background: #EFF6FF`, `color: #1B6FE8`, `font-size: 10px`, `font-weight: 600`, `border-radius: 20px`, `padding: 2px 8px`.

### 3b. Actividad reciente
- Ítem **no leído**: fondo `#EFF6FF` (azul-50), sin borde izquierdo de color.
- Ítem **leído**: fondo `#FFFFFF`, sin borde izquierdo de color.
- En ambos casos, borde izquierdo fijo `3px solid #E2E8F0` (gris claro) — da estructura sin distraer.
- Transición de fondo al leer: `transition: background 0.3s ease`.

### 3c. SiguientePasoBanner
- El ícono (`Bell`, `AlertCircle`, `ArrowUpRight`, `ArrowRight`) se envuelve en un círculo de 32px.
- Color del círculo: `background: <color>-50 equivalent` (ej. rojo → `#FEF2F2`, amarillo → `#FFFBEB`, azul → `#EFF6FF`).
- Reemplaza el borde izquierdo `4px` actual por borde izquierdo `3px` + leve fondo tintado `rgba(<color>, 0.04)` en el contenedor.

### 3d. PerfilWidget
- Bajo el área del anillo SVG + texto, agregar barra de progreso lineal:
  - Contenedor: `height: 4px`, `background: #F1F5F9`, `border-radius: 2px`.
  - Relleno: `width: ${completitud}%`, `background: #1B6FE8`, `transition: width 1s ease`.
- Solo visible cuando `completitud < 100`. Cuando es 100%, mostrar check verde ya existente.

---

## Paleta de colores (referencia)

| Token     | Valor     | Uso                          |
|-----------|-----------|------------------------------|
| blue      | `#1B6FE8` | Acento principal             |
| blue-50   | `#EFF6FF` | Fondos suaves azul           |
| green     | `#059669` | Área DATA / estados OK       |
| violet    | `#8B5CF6` | Área UX                      |
| slate-50  | `#F8FAFC` | Card "vista"                 |
| slate-100 | `#F1F5F9` | Bordes, separadores          |
| slate-400 | `#94A3B8` | Textos terciarios            |

---

## Restricciones

- No cambiar arquitectura de componentes ni rutas.
- No agregar nuevas dependencias.
- No modificar el `HeroBanner` (está completo y con buen estado).
- Los cambios deben ser parches localizados dentro de `EstudianteDashboardPage.jsx`.
