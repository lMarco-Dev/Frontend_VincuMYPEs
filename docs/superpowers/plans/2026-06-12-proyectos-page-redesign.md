# ProyectosPage Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar visualmente `ProyectosPage.jsx` con estilo sobrio — hero simplificado, badges de vacantes en azul/gris, info de MYPE visible cerca del título, y botón Postular como único acento de color.

**Architecture:** Un solo archivo modificado (`ProyectosPage.jsx`). Los cambios son estrictamente visuales; toda la lógica de datos, hooks, filtros, paginación y postulación permanece intacta.

**Tech Stack:** React 18, framer-motion, lucide-react, inline styles.

**Spec:** `docs/superpowers/specs/2026-06-12-proyectos-page-redesign.md`

---

## File Map

| Archivo | Acción |
|---------|--------|
| `src/pages/estudiante/ProyectosPage.jsx` | Modificar — único archivo tocado |

---

### Task 1: Simplificar `ExploreHero` — eliminar badge animado, agregar indicador estático

**Files:**
- Modify: `src/pages/estudiante/ProyectosPage.jsx` — componente `ExploreHero` (~líneas 179–384)

- [ ] **Step 1: Eliminar el estado y useEffect del badge rotativo**

Buscar y eliminar estas líneas:
```jsx
const [badgeText, setBadgeText] = useState("+28 proyectos activos");
const [badgeColor, setBadgeColor] = useState("#67d4f8");

const messages = [
  { text: "Proyectos con empresas locales", color: "#67d4f8" },
  { text: "Vacantes disponibles ahora", color: "#4ade80" },
  { text: "Nuevas oportunidades cada semana", color: "#8b5cf6" },
];

useEffect(() => {
  let index = 0;
  const interval = setInterval(() => {
    index = (index + 1) % messages.length;
    setBadgeText(messages[index].text);
    setBadgeColor(messages[index].color);
  }, 3500);
  return () => clearInterval(interval);
}, []);
```

- [ ] **Step 2: Actualizar el contenido JSX del hero**

Buscar el bloque del contenido izquierdo del hero (dentro del `div` con `zIndex: 10`):

```jsx
        <div>
          <h1
            style={{
              fontSize: "clamp(22px, 2.5vw, 28px)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              marginBottom: 6,
            }}
          >
            Descubre tu próximo reto profesional
          </h1>

          <p
            style={{
              fontSize: 13,
              opacity: 0.8,
              lineHeight: 1.5,
              fontWeight: 400,
              maxWidth: 400,
            }}
          >
            Proyectos reales con empresas locales. Construye experiencia
            mientras estudias.
          </p>
        </div>

        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3.5, repeat: Infinity }}
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
            padding: "8px 18px",
            borderRadius: 40,
            fontSize: 12,
            fontWeight: 600,
            border: `1px solid ${badgeColor}40`,
            color: badgeColor,
            flexShrink: 0,
          }}
        >
          {badgeText}
        </motion.div>
```

Reemplazar por:

```jsx
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)",
            borderRadius: 999, padding: "5px 12px", fontSize: 10,
            fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            marginBottom: 14,
          }}>
            <span style={{
              position: "relative", display: "inline-flex", width: 7, height: 7,
            }}>
              <span style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "#4ade80", animation: "vping 1.8s cubic-bezier(0,0,.2,1) infinite",
              }} />
              <span style={{
                position: "relative", width: 7, height: 7,
                borderRadius: "50%", background: "#4ade80",
              }} />
            </span>
            Sistema activo
          </div>
          <h1 style={{
            fontSize: "clamp(20px, 2.3vw, 26px)",
            fontWeight: 700, lineHeight: 1.15,
            letterSpacing: "-0.02em", marginBottom: 6,
          }}>
            Explora proyectos disponibles
          </h1>
          <p style={{
            fontSize: 13, opacity: 0.65, lineHeight: 1.5,
            fontWeight: 400, maxWidth: 380, margin: 0,
          }}>
            Conecta con empresas de Cajamarca. Construye tu experiencia.
          </p>
        </div>
```

- [ ] **Step 3: Reducir minHeight del hero**

Buscar:
```jsx
        minHeight: 140,
```
Reemplazar por:
```jsx
        minHeight: 120,
```

- [ ] **Step 4: Agregar `vping` al bloque de estilos globales**

Buscar el bloque `<style>` al final del componente principal:
```jsx
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
```

Reemplazar por:
```jsx
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes vping {
          75%, 100% { transform: scale(2.4); opacity: 0; }
        }
      `}</style>
```

- [ ] **Step 5: Build para verificar que no hay errores**

```bash
npm run build 2>&1 | tail -10
```

Expected: `✓ built in X.XXs`

- [ ] **Step 6: Commit**

```bash
git add src/pages/estudiante/ProyectosPage.jsx
git commit -m "feat: simplify ExploreHero - replace animated badge with static 'Sistema activo' indicator"
```

---

### Task 2: Neutralizar badges de vacantes en `ProjectCardLinkedIn`

**Files:**
- Modify: `src/pages/estudiante/ProyectosPage.jsx` — componente `ProjectCardLinkedIn` (~líneas 389–551)

- [ ] **Step 1: Reemplazar el badge de vacantes con color semántico por versión azul/gris**

Buscar el bloque del badge de vacantes dentro de `ProjectCardLinkedIn` (el `<span>` con `background: vacancyStatus.bg`):

```jsx
              {/* Badge de vacantes */}
              <span
                style={{
                  background: vacancyStatus.bg,
                  color: vacancyStatus.color,
                  padding: "1px 7px",
                  borderRadius: 10,
                  fontSize: 9,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  border: `1px solid ${vacancyStatus.border}`,
                }}
              >
                {vacancyStatus.icon}
                {vacancyStatus.remaining > 0 ? `${vacancyStatus.remaining} vacante${vacancyStatus.remaining !== 1 ? 's' : ''}` : 'Completo'}
              </span>
```

Reemplazar por:

```jsx
              {/* Indicador de vacantes — neutro */}
              {vacancyStatus.status === "complete" ? (
                <span style={{ fontSize: 9, fontWeight: 500, color: "#9CA3AF", whiteSpace: "nowrap" }}>
                  Completo
                </span>
              ) : (
                <span style={{
                  fontSize: 9,
                  fontWeight: vacancyStatus.status === "urgent" ? 700 : 500,
                  color: vacancyStatus.status === "urgent" ? "#1B6FE8" : (vacancyStatus.status === "limited" ? "#1B6FE8" : "#6B7280"),
                  whiteSpace: "nowrap",
                }}>
                  {vacancyStatus.remaining} vacante{vacancyStatus.remaining !== 1 ? "s" : ""}
                </span>
              )}
```

- [ ] **Step 2: Usar `mypeDireccion` en lugar de `ubicacion` para la ubicación**

Buscar dentro de `ProjectCardLinkedIn`:
```jsx
              <span
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <MapPin size={10} /> {proyecto.ubicacion || "Cajamarca"}
              </span>
```

Reemplazar por:
```jsx
              <span style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 2 }}>
                <MapPin size={10} /> {proyecto.mypeDireccion || proyecto.ubicacion || "Cajamarca"}
              </span>
```

- [ ] **Step 3: Build para verificar**

```bash
npm run build 2>&1 | tail -5
```

Expected: `✓ built in X.XXs`

- [ ] **Step 4: Commit**

```bash
git add src/pages/estudiante/ProyectosPage.jsx
git commit -m "feat: neutralize vacancy badges to blue/gray, use mypeDireccion in list card"
```

---

### Task 3: Rediseñar cabecera del `ProjectDetailPanel` — MYPE info cerca del título

**Files:**
- Modify: `src/pages/estudiante/ProyectosPage.jsx` — componente `ProjectDetailPanel` (~líneas 558–1077), bloque de cabecera del proyecto (~líneas 739–781)

- [ ] **Step 1: Reemplazar el bloque de cabecera del panel de detalle**

Buscar el bloque de cabecera (entre `<div style={{ padding: "24px 20px 20px"...` y el cierre de ese `div` con `borderBottom`):

```jsx
      <div
        style={{
          padding: "24px 20px 20px",
          position: "relative",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "#f1f5f9",
            border: "none",
            borderRadius: "50%",
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#64748b",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#e2e8f0";
            e.currentTarget.style.color = "#0f172a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f1f5f9";
            e.currentTarget.style.color = "#64748b";
          }}
        >
          <X size={14} />
        </button>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: area === "SOPORTE TI" ? "#eff6ff" : bg,
            color: area === "SOPORTE TI" ? "#1B6FE8" : color,
            padding: "4px 12px",
            borderRadius: 16,
            fontSize: 11,
            fontWeight: 700,
            marginBottom: 14,
            letterSpacing: "0.02em",
          }}
        >
          {area}
        </div>

        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#0f172a",
            lineHeight: 1.3,
            marginBottom: 6,
          }}
        >
          {proyecto.titulo}
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "#64748b",
          }}
        >
          <span style={{ fontWeight: 500 }}>
            {proyecto.mypeNombre || "Empresa"}
          </span>
        </div>
      </div>
```

Reemplazar por:

```jsx
      <div style={{ padding: "20px 20px 0", position: "relative" }}>
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 12, right: 12,
            background: "#f1f5f9", border: "none", borderRadius: "50%",
            width: 28, height: 28, display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", color: "#64748b",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#e2e8f0"; e.currentTarget.style.color = "#0f172a"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#64748b"; }}
        >
          <X size={14} />
        </button>

        {/* Área badge */}
        <div style={{
          display: "inline-flex", alignItems: "center",
          background: area === "SOPORTE TI" ? "#eff6ff" : bg,
          color: area === "SOPORTE TI" ? "#1B6FE8" : color,
          padding: "3px 10px", borderRadius: 16,
          fontSize: 10, fontWeight: 700, marginBottom: 10, letterSpacing: "0.02em",
        }}>
          {area}
        </div>

        {/* Título */}
        <h2 style={{
          fontSize: 18, fontWeight: 700, color: "#0f1f3d",
          lineHeight: 1.3, marginBottom: 10, paddingRight: 32,
        }}>
          {proyecto.titulo}
        </h2>

        {/* Fila MYPE: nombre + rating + dirección */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
          paddingBottom: 16, borderBottom: "1px solid #f1f5f9", marginBottom: 0,
        }}>
          {proyecto.mypeId ? (
            <Link
              to={`/mypes/${proyecto.mypeId}`}
              style={{ textDecoration: "none", color: "#0f1f3d", fontWeight: 600, fontSize: 13, transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1B6FE8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#0f1f3d")}
            >
              {proyecto.mypeNombre || "Empresa"}
            </Link>
          ) : (
            <span style={{ fontWeight: 600, fontSize: 13, color: "#0f1f3d" }}>
              {proyecto.mypeNombre || "Empresa"}
            </span>
          )}
          {proyecto.mypeUsuarioId && (
            <>
              <span style={{ color: "#e5e7eb", fontSize: 13 }}>·</span>
              <RatingDisplay usuarioId={proyecto.mypeUsuarioId} size="sm" />
            </>
          )}
          {proyecto.mypeDireccion && (
            <>
              <span style={{ color: "#e5e7eb", fontSize: 13 }}>·</span>
              <span style={{ fontSize: 11, color: "#6b7280", display: "flex", alignItems: "center", gap: 3 }}>
                <MapPin size={10} style={{ color: "#1B6FE8" }} />
                {proyecto.mypeDireccion}
              </span>
            </>
          )}
        </div>
      </div>
```

- [ ] **Step 2: Ajustar padding del bloque de contenido que sigue**

Buscar el `<div style={{ padding: 20 }}>` que contiene las métricas (inmediatamente después de la cabecera):

```jsx
      <div style={{ padding: 20 }}>
```

Reemplazar por:

```jsx
      <div style={{ padding: "16px 20px 20px" }}>
```

- [ ] **Step 3: Build para verificar**

```bash
npm run build 2>&1 | tail -5
```

Expected: `✓ built in X.XXs`

- [ ] **Step 4: Commit**

```bash
git add src/pages/estudiante/ProyectosPage.jsx
git commit -m "feat: move MYPE name, rating and address to detail panel header"
```

---

### Task 4: Limpiar sección "Sobre la empresa" y postulación

**Files:**
- Modify: `src/pages/estudiante/ProyectosPage.jsx` — `ProjectDetailPanel`, secciones "Sobre la empresa" y postulación

- [ ] **Step 1: Quitar nombre + rating de "Sobre la empresa" (ya están en cabecera)**

Buscar dentro del bloque "Sobre la empresa":
```jsx
            <div style={{ marginBottom: 8 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1e293b",
                  marginBottom: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {proyecto.mypeId ? (
                  <Link
                    to={`/mypes/${proyecto.mypeId}`}
                    style={{
                      textDecoration: "none",
                      color: "#1e293b",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#1B6FE8")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#1e293b")}
                  >
                    {proyecto.mypeNombre || "Empresa"}
                  </Link>
                ) : (
                  <span>{proyecto.mypeNombre || "Empresa"}</span>
                )}
                {proyecto.mypeUsuarioId && (
                  <RatingDisplay usuarioId={proyecto.mypeUsuarioId} size="sm" />
                )}
              </div>
              {(proyecto.mypeDireccion) && (
                <div style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                  <MapPin size={10} style={{ color: "#3b82f6" }} />
                  {proyecto.mypeDireccion}
                </div>
              )}
            </div>
```

Reemplazar por (solo el nombre sin link ni rating, la dirección se elimina ya que está en cabecera):

```jsx
            <div style={{ marginBottom: proyecto.mypeDescripcion ? 8 : 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>
                {proyecto.mypeNombre || "Empresa"}
              </div>
            </div>
```

- [ ] **Step 2: Agregar separador visual antes del botón Postular**

Buscar el bloque de la acción de postulación:
```jsx
        <div style={{ marginTop: 4 }}>
```

Reemplazar por:
```jsx
        <div style={{ marginTop: 4, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
```

- [ ] **Step 3: Suavizar el estado "proyecto completo" (quitar verde vibrante)**

Buscar el bloque de proyecto completo:
```jsx
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: "#ecfdf5",
                border: "2px solid #a7f3d0",
                borderRadius: 10,
                padding: "16px",
                textAlign: "center",
              }}
            >
              <UserCheck size={24} style={{ color: "#059669", marginBottom: 8 }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: "#059669", marginBottom: 4 }}>
                ¡Proyecto completado!
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                Todas las vacantes han sido cubiertas. ¡Sigue explorando otras oportunidades!
              </div>
            </motion.div>
```

Reemplazar por:
```jsx
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: "16px",
                textAlign: "center",
              }}
            >
              <UserCheck size={22} style={{ color: "#6b7280", marginBottom: 8 }} />
              <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
                Vacantes cubiertas
              </div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>
                Este proyecto ya no tiene plazas disponibles.
              </div>
            </motion.div>
```

- [ ] **Step 4: Build para verificar**

```bash
npm run build 2>&1 | tail -5
```

Expected: `✓ built in X.XXs`

- [ ] **Step 5: Commit**

```bash
git add src/pages/estudiante/ProyectosPage.jsx
git commit -m "feat: clean up empresa section, add postulation separator, mute complete-project state"
```

---

### Task 5: Mejorar placeholder y limpiar imports no usados

**Files:**
- Modify: `src/pages/estudiante/ProyectosPage.jsx` — placeholder del panel + imports (~líneas 7–39)

- [ ] **Step 1: Mejorar el placeholder visual**

Buscar el estado placeholder (cuando `!proyecto`):
```jsx
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          padding: 40,
          textAlign: "center",
          color: "#9ca3af",
        }}
      >
        <Briefcase size={40} style={{ margin: "0 auto 14px", opacity: 0.25 }} />
        <h3
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#6b7280",
            marginBottom: 6,
          }}
        >
          Selecciona un proyecto
        </h3>
        <p style={{ fontSize: 12, color: "#9ca3af" }}>
          Haz clic en un proyecto para ver sus detalles y postularte
        </p>
      </div>
    );
```

Reemplazar por:
```jsx
    return (
      <div style={{
        background: "#f8fafc",
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        minHeight: 300,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 40,
        color: "#9ca3af",
      }}>
        <Briefcase size={38} style={{ margin: "0 auto 14px", opacity: 0.15, color: "#1B6FE8" }} />
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>
          Selecciona un proyecto para ver los detalles
        </h3>
        <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
          Haz clic en cualquier proyecto de la lista
        </p>
      </div>
    );
```

- [ ] **Step 2: Verificar imports sin usar y eliminarlos**

Revisar qué íconos de lucide-react se usan actualmente tras los cambios. Los siguientes probablemente quedaron sin uso — verificar uno por uno buscando en el archivo:

```bash
grep -n "Award\|Bell\|Eye\|GraduationCap\|Hash\|Star\|Target\|TrendingUp\|Filter" \
  src/pages/estudiante/ProyectosPage.jsx
```

Eliminar del bloque de imports solo los que no aparezcan en el JSX. No tocar los que sí se usen (`Zap`, `AlertCircle`, `UserPlus` aún están en `getVacancyStatus` aunque no se rendericen — dejarlos para no romper la función).

- [ ] **Step 3: Build final limpio**

```bash
npm run build 2>&1 | tail -15
```

Expected: `✓ built in X.XXs` sin errores.

- [ ] **Step 4: Commit final**

```bash
git add src/pages/estudiante/ProyectosPage.jsx
git commit -m "feat: redesign ProyectosPage - sobrio, jerarquía clara, MYPE info en cabecera"
```

---

## Self-Review

**Cobertura del spec:**
- [x] ExploreHero simplificado con indicador estático: Task 1
- [x] `vping` keyframe: Task 1, Step 4
- [x] Badges de vacantes en azul/gris: Task 2, Step 1
- [x] `mypeDireccion` en tarjeta de lista: Task 2, Step 2
- [x] MYPE nombre + rating + dirección en cabecera del detalle: Task 3, Step 1
- [x] Sección "Sobre la empresa" limpiada (sin duplicar nombre/rating): Task 4, Step 1
- [x] Separador antes del botón Postular: Task 4, Step 2
- [x] Estado "completo" suavizado: Task 4, Step 3
- [x] Placeholder mejorado: Task 5, Step 1
- [x] Imports limpiados: Task 5, Step 2

**Placeholders:** Ninguno. Todo el código está presente.

**Consistencia:** `proyecto.mypeUsuarioId` y `proyecto.mypeId` se usan con los mismos nombres en Task 3 que en el archivo original. `RatingDisplay` mantiene su prop `usuarioId`.
