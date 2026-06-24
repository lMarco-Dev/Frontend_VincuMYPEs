import { motion } from "framer-motion";

const FONT = "'Inter', 'Outfit', sans-serif";

export function MypeInfoCard({ perfil }) {
  const fechaRegistro = perfil.fechaRegistro
    ? new Date(perfil.fechaRegistro).toLocaleDateString("es-PE", { month: "long", year: "numeric" })
    : null;

  const totalProyectos = perfil.totalProyectos ?? 0;
  const proyectosActivos = perfil.proyectosActivos ?? 0;
  const porcentaje = totalProyectos > 0 ? Math.round((proyectosActivos / totalProyectos) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: "#FFFFFF",
        border: "1px solid #F1F5F9",
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 14,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
      }}
    >
      <div style={{ padding: "24px" }}>
        
        <h3 style={{
          fontFamily: FONT,
          fontSize: 13,
          fontWeight: 500,
          color: "#71717a",
          margin: "0 0 20px",
          letterSpacing: "-0.01em",
        }}>
          Actividad de proyectos
        </h3>

        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <span style={{
            fontFamily: FONT,
            fontSize: 56,
            fontWeight: 400,
            color: "#09090b",
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}>
            {proyectosActivos}
          </span>
          <span style={{
            fontFamily: FONT,
            fontSize: 20,
            fontWeight: 300,
            color: "#a1a1aa",
            marginLeft: 4,
          }}>
            / {totalProyectos}
          </span>
        </div>

        <p style={{
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 400,
          color: "#a1a1aa",
          textAlign: "center",
          margin: "0 0 20px",
        }}>
          Proyectos activos del total
        </p>

        <div style={{ marginBottom: 6 }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}>
            <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 400, color: "#a1a1aa" }}>
              Progreso
            </span>
            <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 400, color: "#71717a" }}>
              {porcentaje}%
            </span>
          </div>
          <div style={{
            height: 4,
            background: "#F1F5F9",
            borderRadius: 2,
            overflow: "hidden",
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${porcentaje}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              style={{
                height: "100%",
                background: "#09090b",
                borderRadius: 2,
              }}
            />
          </div>
        </div>

        {fechaRegistro && (
          <div style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: "1px solid #F8FAFC",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
            <div style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "#d4d4d8",
            }} />
            <span style={{
              fontFamily: FONT,
              fontSize: 11,
              fontWeight: 400,
              color: "#a1a1aa",
            }}>
              Registrada en {fechaRegistro}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}