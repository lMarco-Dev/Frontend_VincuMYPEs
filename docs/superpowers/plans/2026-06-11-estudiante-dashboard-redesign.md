# Estudiante Dashboard Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar visualmente `EstudianteDashboardPage.jsx` con estilo sobrio alineado al dashboard de MYPE: stats animados en el HeroBanner, layout inferior con sidebar (actividad + CalificacionesPendientesCard + accesos rápidos).

**Architecture:** Un solo archivo modificado (`EstudianteDashboardPage.jsx`). Se añade prop `certificados` a `HeroBanner`, se rellena el array de stats vacío, y el grid inferior cambia de `1fr 1fr` a `1fr 340px` con el sidebar apilando 3 paneles.

**Tech Stack:** React 18, framer-motion, lucide-react, inline styles (mismo patrón que el archivo actual).

**Spec:** `docs/superpowers/specs/2026-06-11-estudiante-dashboard-redesign.md`

---

## File Map

| Archivo | Acción |
|---------|--------|
| `src/pages/estudiante/EstudianteDashboardPage.jsx` | Modificar — único archivo tocado |

---

### Task 1: Verificar estado del archivo y resolver conflicto de merge

El archivo aparece como `UU` en git (unmerged). Antes de editar, verificar que no hay marcadores de conflicto.

**Files:**
- Modify: `src/pages/estudiante/EstudianteDashboardPage.jsx`

- [ ] **Step 1: Verificar marcadores de conflicto**

```bash
grep -n "<<<<<<\|======\|>>>>>>" "src/pages/estudiante/EstudianteDashboardPage.jsx"
```

Expected: sin output (archivo limpio). Si hay marcadores, el archivo tiene conflictos pendientes — resolverlos antes de continuar.

- [ ] **Step 2: Si no hay conflictos, marcar como resuelto en git**

```bash
git add src/pages/estudiante/EstudianteDashboardPage.jsx
```

- [ ] **Step 3: Verificar que el proyecto compila**

```bash
npm run build 2>&1 | tail -20
```

Expected: build sin errores relacionados con `EstudianteDashboardPage`.

---

### Task 2: Agregar `ArrowUpRight` a los imports de lucide-react

**Files:**
- Modify: `src/pages/estudiante/EstudianteDashboardPage.jsx` (línea ~11)

- [ ] **Step 1: Actualizar el import de lucide-react**

Reemplazar el bloque de imports de lucide-react actual:

```jsx
import {
  ArrowRight,
  Award,
  Building2,
  Bell,
  Search,
  ScanFace,
  ClipboardList,
  BadgeCheck,
  FileText,
  Users,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
```

Por:

```jsx
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Building2,
  Bell,
  Search,
  ScanFace,
  ClipboardList,
  BadgeCheck,
  FileText,
  Users,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/estudiante/EstudianteDashboardPage.jsx
git commit -m "feat: add ArrowUpRight import for quick actions panel"
```

---

### Task 3: Actualizar `HeroBanner` — añadir prop `certificados` y llenar stats

**Files:**
- Modify: `src/pages/estudiante/EstudianteDashboardPage.jsx` — componente `HeroBanner` (~línea 250)

- [ ] **Step 1: Añadir `certificados` a la firma del componente**

Buscar la línea:
```jsx
const HeroBanner = ({ proyectosTotal = 0, aceptados = 0 }) => {
```

Reemplazar por:
```jsx
const HeroBanner = ({ proyectosTotal = 0, aceptados = 0, certificados = 0 }) => {
```

- [ ] **Step 2: Actualizar el estado `counts` para incluir certificados**

Buscar:
```jsx
const [counts, setCounts] = React.useState({ a: 0, b: 0 });
```

Reemplazar por:
```jsx
const [counts, setCounts] = React.useState({ a: 0, b: 0, c: 0 });
```

- [ ] **Step 3: Actualizar el `useEffect` de conteo animado**

Buscar el bloque:
```jsx
React.useEffect(() => {
    const targets = { a: proyectosTotal || 0, b: aceptados || 0 };
    if (targets.a === 0 && targets.b === 0) {
      setCounts({ a: 0, b: 0 });
      return;
    }
    const dur = 1400, start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      setCounts({ a: Math.round(e * targets.a), b: Math.round(e * targets.b) });
      if (p < 1) requestAnimationFrame(step);
    };
    const tid = setTimeout(() => requestAnimationFrame(step), 600);
    return () => clearTimeout(tid);
  }, [proyectosTotal, aceptados]);
```

Reemplazar por:
```jsx
React.useEffect(() => {
    const targets = { a: totalPostulaciones || 0, b: aceptados || 0, c: certificados || 0 };
    if (targets.a === 0 && targets.b === 0 && targets.c === 0) {
      setCounts({ a: 0, b: 0, c: 0 });
      return;
    }
    const dur = 1400, start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      setCounts({ a: Math.round(e * targets.a), b: Math.round(e * targets.b), c: Math.round(e * targets.c) });
      if (p < 1) requestAnimationFrame(step);
    };
    const tid = setTimeout(() => requestAnimationFrame(step), 600);
    return () => clearTimeout(tid);
  }, [totalPostulaciones, aceptados, certificados]);
```

**Nota:** el prop se llama `proyectosTotal` en la firma pero debería mostrar postulaciones. Cambiar también la firma a `totalPostulaciones`:

```jsx
const HeroBanner = ({ totalPostulaciones = 0, aceptados = 0, certificados = 0 }) => {
```

- [ ] **Step 4: Reemplazar el array vacío `[]` de stats por los 3 stats**

Buscar el bloque de stats (dentro del `motion.div` a la derecha del hero, alrededor de línea 449):

```jsx
      {[
      ].map((s, i) => (
```

Reemplazar el bloque completo `motion.div` de stats (desde `<motion.div` hasta su cierre `</motion.div>` que contiene el `.map`) por:

```jsx
      <motion.div
        initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
        transition={{ delay:0.7, duration:0.7 }}
        style={{ position:'absolute', right:40, top:'50%', transform:'translateY(-50%)', zIndex:10, display:'flex', alignItems:'center', gap:0 }}
      >
        {[
          { val: counts.a, label: 'POSTULACIONES', bar: '#1B6FE8', w: '70%' },
          { val: counts.b, label: 'ACEPTADAS',     bar: '#4ade80', w: '40%' },
          { val: counts.c, label: 'CERTIFICADOS',  bar: '#f59e0b', w: '55%' },
        ].map((s, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <div style={{ width:1, height:40, background:'rgba(255,255,255,0.12)', margin:'0 4px' }} />
            )}
            <div style={{ textAlign:'center', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:'12px 20px', minWidth:110 }}>
              <div style={{ fontSize:26, fontWeight:800, color:'#67d4f8', letterSpacing:'-0.04em', lineHeight:1 }}>{s.val}</div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:4 }}>{s.label}</div>
              <div style={{ height:2, background:'rgba(255,255,255,0.08)', borderRadius:1, marginTop:6, overflow:'hidden' }}>
                <motion.div
                  initial={{ scaleX:0 }} animate={{ scaleX:1 }}
                  transition={{ delay: 0.9 + i * 0.2, duration:1.2, ease:[0.22,1,0.36,1] }}
                  style={{ height:'100%', width:s.w, background:s.bar, borderRadius:1, transformOrigin:'left' }}
                />
              </div>
            </div>
          </React.Fragment>
        ))}
      </motion.div>
```

- [ ] **Step 5: Actualizar el llamado a `HeroBanner` en el componente principal**

Buscar:
```jsx
      <HeroBanner
        proyectosTotal={proyectosData?.totalElements}
        aceptados={aceptados}
      />
```

Reemplazar por:
```jsx
      <HeroBanner
        totalPostulaciones={totalPostulaciones}
        aceptados={aceptados}
        certificados={totalCertificados}
      />
```

- [ ] **Step 6: Verificar visualmente en el navegador**

```bash
npm run dev
```

Abrir el dashboard de estudiante. El hero debe mostrar 3 bloques de stats a la derecha con contadores animados.

- [ ] **Step 7: Commit**

```bash
git add src/pages/estudiante/EstudianteDashboardPage.jsx
git commit -m "feat: add animated stats to EstudianteDashboard hero banner"
```

---

### Task 4: Cambiar el layout inferior a `1fr 340px` y construir el sidebar

**Files:**
- Modify: `src/pages/estudiante/EstudianteDashboardPage.jsx` — sección `FILA INFERIOR` (~línea 606)

- [ ] **Step 1: Cambiar el grid de `1fr 1fr` a `1fr 340px`**

Buscar:
```jsx
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
```

Reemplazar por:
```jsx
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
```

- [ ] **Step 2: Envolver los paneles del sidebar en una columna apilada**

El layout inferior actualmente tiene 2 hijos directos del grid: Panel de proyectos y Panel de actividad. Necesitamos que el segundo hijo sea un `div` columna que contenga 3 paneles.

Reemplazar el segundo Panel (actividad) y su cierre con la estructura de sidebar completa. Buscar el Panel de actividad desde su apertura hasta antes del cierre del div del grid:

```jsx
        {/* Actividad reciente */}
        <Panel delay={0.24}>
          ...contenido de actividad...
        </Panel>
      </div>
```

Reemplazar por:

```jsx
        {/* ── SIDEBAR ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

          {/* Actividad reciente */}
          <Panel delay={0.24}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={S.sectionTitle}><span style={S.sectionBar} />Actividad reciente</div>
              <Link to="/mis-postulaciones" style={S.seeAll}>Ver todo <ArrowRight size={12} /></Link>
            </div>

            {loadingNotificaciones ? (
              <div style={{ padding:16, textAlign:'center', color:'#6b6b7a', fontSize:13 }}>Cargando actividad…</div>
            ) : activityItems.length === 0 ? (
              <div style={{ padding:20, textAlign:'center', color:'#6b6b7a', fontSize:13, border:'0.5px dashed #e8e8e4', borderRadius:10 }}>
                No hay actividad reciente.
              </div>
            ) : (
              <div style={{ position:'relative', paddingLeft:8 }}>
                <div style={{ position:'absolute', left:19, top:8, bottom:8, width:1.5, background:'#E5E7EB' }} />
                <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                  {activityItems.map((item, index) => {
                    const getRutaNotificacion = (notif) => {
                      if (notif.urlReferencia && notif.urlReferencia.trim() !== '') {
                        return notif.urlReferencia.startsWith('/')
                            ? notif.urlReferencia
                            : `/${notif.urlReferencia}`;
                      }
                      return '/mis-postulaciones';
                    };
                    return (
                      <div
                        key={item.id || index}
                        onClick={() => {
                          if (!item.leida) leerNotificacion(item.id);
                          navigate(getRutaNotificacion(item));
                        }}
                        style={{
                          position:'relative', display:'flex', alignItems:'flex-start',
                          gap:14, padding:'10px 14px', borderRadius:12,
                          cursor:'pointer', transition:'background 0.15s ease', background:'transparent',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FA'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <div style={{
                          width:10, height:10, borderRadius:'50%',
                          background: !item.leida ? '#1B6FE8' : '#9CA3AF',
                          flexShrink:0, marginTop:4, zIndex:1,
                          boxShadow: !item.leida ? '0 0 0 3px rgba(27,111,232,0.15)' : '0 0 0 3px rgba(156,163,175,0.1)',
                        }} />
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:13, color:'#0f1f3d', fontWeight:600, lineHeight:1.35 }}>
                            {item.titulo}
                          </div>
                          {item.mensaje && (
                            <div style={{ fontSize:11.5, color:'#6b6b7a', marginTop:2, fontWeight:400 }}>
                              {item.mensaje}
                            </div>
                          )}
                          <div style={{ fontSize:11, color:'#9CA3AF', marginTop:4 }}>
                            {item.fechaCreacion
                              ? new Date(item.fechaCreacion).toLocaleDateString('es-PE', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })
                              : 'Fecha no disponible'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Panel>

          {/* Calificaciones pendientes */}
          <CalificacionesPendientesCard />

          {/* Accesos rápidos */}
          <Panel delay={0.32}>
            <div style={{ display:'flex', alignItems:'center', marginBottom:14 }}>
              <div style={S.sectionTitle}><span style={S.sectionBar} />Accesos rápidos</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <Link to="/proyectos" style={{ textDecoration:'none' }}>
                <div
                  style={{
                    padding:12, borderRadius:13,
                    background:'#EFF6FF', border:'1px solid #BFDBFE',
                    color:'#1B6FE8', display:'flex', alignItems:'center',
                    gap:11, fontWeight:700, fontSize:13, cursor:'pointer',
                    transition:'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{ width:30, height:30, borderRadius:9, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Search size={15} color="#1B6FE8" />
                  </div>
                  Buscar proyectos
                  <ArrowUpRight size={15} style={{ marginLeft:'auto', opacity:0.55 }} />
                </div>
              </Link>
              <Link to="/perfil" style={{ textDecoration:'none' }}>
                <div
                  style={{
                    padding:12, borderRadius:13,
                    background:'#F5F3FF', border:'1px solid #DDD6FE',
                    color:'#7C3AED', display:'flex', alignItems:'center',
                    gap:11, fontWeight:700, fontSize:13, cursor:'pointer',
                    transition:'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{ width:30, height:30, borderRadius:9, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <ScanFace size={15} color="#7C3AED" />
                  </div>
                  Completar perfil
                  <ArrowUpRight size={15} style={{ marginLeft:'auto', opacity:0.55 }} />
                </div>
              </Link>
            </div>
          </Panel>

        </div>{/* fin sidebar */}
      </div>
```

- [ ] **Step 3: Verificar en el navegador**

El layout debe mostrar:
- Columna izquierda ancha: Proyectos recomendados
- Sidebar derecho: Actividad (timeline con línea vertical) + Calificaciones pendientes + Accesos rápidos

- [ ] **Step 4: Commit**

```bash
git add src/pages/estudiante/EstudianteDashboardPage.jsx
git commit -m "feat: add sidebar with activity timeline, ratings card, and quick actions"
```

---

### Task 5: Verificación final y limpieza

**Files:**
- Modify: `src/pages/estudiante/EstudianteDashboardPage.jsx` (revisar imports no usados)

- [ ] **Step 1: Verificar que `NotificacionesPanel` sigue funcionando**

Hacer clic en el ícono de campana → el panel lateral de notificaciones debe abrirse normalmente.

- [ ] **Step 2: Verificar que la navegación funciona**

- Clic en una MetricCard → navega a la ruta correcta.
- Clic en un ProjectCard → navega a `/proyectos?selected=<id>`.
- Clic en un item de actividad → navega a la ruta del item.
- Clic en "Buscar proyectos" → navega a `/proyectos`.
- Clic en "Completar perfil" → navega a `/perfil`.

- [ ] **Step 3: Verificar que no hay imports sin usar**

Los siguientes imports del archivo original podrían quedar sin usar tras los cambios:
- `Award` — verificar si se usa en algún componente visible.
- `FileText`, `Users`, `CheckCircle`, `TrendingUp` — verificar.

Si alguno está sin usar, eliminarlo del import de lucide-react.

- [ ] **Step 4: Build final**

```bash
npm run build 2>&1 | tail -30
```

Expected: sin errores ni warnings de imports no usados que rompan el build.

- [ ] **Step 5: Commit final**

```bash
git add src/pages/estudiante/EstudianteDashboardPage.jsx
git commit -m "feat: redesign EstudianteDashboardPage - sobrio, coherente con MYPE"
```

---

## Self-Review

**Cobertura del spec:**
- [x] HeroBanner stats: Task 3
- [x] Prop `certificados`: Task 3, Step 1
- [x] `ArrowUpRight` import: Task 2
- [x] Grid `1fr 340px`: Task 4, Step 1
- [x] Actividad timeline estilo MYPE: Task 4, Step 2
- [x] `CalificacionesPendientesCard` en sidebar: Task 4, Step 2
- [x] Accesos rápidos (Buscar proyectos + Completar perfil): Task 4, Step 2
- [x] Funcionalidad intacta (`leerNotificacion`, `NotificacionesPanel`): Task 5

**Placeholders:** Ninguno. Todos los steps incluyen código completo.

**Consistencia de tipos:** La prop `proyectosTotal` fue renombrada a `totalPostulaciones` en Task 3 y se usa consistentemente en el llamado del componente principal (Task 3, Step 5).
