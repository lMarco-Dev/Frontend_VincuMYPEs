// src/pages/auth/components/TermsModal.jsx
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, FileText } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

export function TermsModal({ isOpen, onClose, type }) {
  if (!isOpen) return null;

  const isPrivacy = type === "privacidad";
  const title = isPrivacy ? "Política de Privacidad" : "Términos y Condiciones de Uso";
  const version = "Mayo 2026";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(10,22,40,0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{
              background: "#fafaf8",
              borderRadius: 16,
              maxWidth: 820,
              width: "100%",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: "28px 32px 20px",
                borderBottom: "1px solid #e8e8e4",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexShrink: 0,
                gap: 16,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <div>
                    <h2
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: 20,
                        fontWeight: 400,
                        color: "#0f1f3d",
                        margin: 0,
                        letterSpacing: "-.01em",
                      }}
                    >
                      {title}
                    </h2>
                    <p
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: 12,
                        fontWeight: 400,
                        color: "#8888a0",
                        margin: 0,
                        marginTop: 2,
                      }}
                    >
                      {version}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 6,
                  borderRadius: 6,
                  color: "#8888a0",
                  transition: "all 0.2s",
                  flexShrink: 0,
                  marginTop: 4,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f0f0ec";
                  e.currentTarget.style.color = "#0f1f3d";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#8888a0";
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div
              style={{
                padding: "28px 32px 32px",
                overflowY: "auto",
                flex: 1,
                fontFamily: "Arial, sans-serif",
                fontSize: 14,
                color: "#1a1a2e",
                lineHeight: 1.7,
              }}
            >
              {isPrivacy ? <PrivacyContent /> : <TermsContent />}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "16px 32px 24px",
                borderTop: "1px solid #e8e8e4",
                display: "flex",
                justifyContent: "flex-end",
                flexShrink: 0,
              }}
            >
              <button
                onClick={onClose}
                style={{
                  padding: "10px 28px",
                  background: "#0f1f3d",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  fontFamily: "Arial, sans-serif",
                  fontSize: 13,
                  fontWeight: 400,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1B6FE8";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(27,111,232,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#0f1f3d";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── CONTENIDO DE TÉRMINOS Y CONDICIONES ───
function TermsContent() {
  return (
    <div>
      <p style={{ marginBottom: 16, color: "#6b6b7a" }}>
        <strong style={{ color: "#0f1f3d" }}>Lee el documento completo antes de aceptar.</strong> Estos Términos y Condiciones rigen el acceso y uso de la plataforma Linkuy, disponible en linkuy.org.pe y todos los servicios ofrecidos a través de ella.
      </p>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0f1f3d", marginBottom: 8 }}>1. Términos y su aceptación</h3>
        <p style={{ color: "#6b6b7a", fontSize: 13 }}>
          El registro en la Plataforma es obligatorio para acceder a los Servicios. El Usuario se compromete a utilizar la Plataforma de conformidad con estos Términos, la legislación peruana vigente, la moral y las buenas costumbres.
        </p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0f1f3d", marginBottom: 8 }}>2. Registro y elegibilidad</h3>
        <p style={{ color: "#6b6b7a", fontSize: 13 }}>
          Para registrarse como estudiante, el Usuario debe ser estudiante activo de una institución universitaria participante. Para registrarse como empresa, el Usuario debe ser representante legal o apoderado autorizado de una empresa con RUC activo registrado en SUNAT.
        </p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0f1f3d", marginBottom: 8 }}>3. Usos aceptables y prohibidos</h3>
        <p style={{ color: "#6b6b7a", fontSize: 13 }}>
          Los Usuarios tienen prohibido utilizar la Plataforma para transmitir, distribuir, almacenar o publicar material que viole la normativa vigente en la República del Perú, que infrinja derechos de terceros o vulnere la confidencialidad, privacidad, honor o imagen de otras personas.
        </p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0f1f3d", marginBottom: 8 }}>4. Propiedad intelectual y confidencialidad</h3>
        <p style={{ color: "#6b6b7a", fontSize: 13 }}>
          Los entregables producidos por el estudiante en el marco de un proyecto registrado en la Plataforma son de propiedad de la MYPE una vez que esta haya aprobado formalmente el cierre del proyecto. El estudiante conserva el derecho de mencionar el proyecto en su portafolio personal.
        </p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0f1f3d", marginBottom: 8 }}>5. Datos personales</h3>
        <p style={{ color: "#6b6b7a", fontSize: 13 }}>
          En cumplimiento de la Ley N° 29733 — Ley de Protección de Datos Personales del Perú, Linkuy recopila y utiliza los datos exclusivamente para operar la Plataforma. El usuario tiene derecho a acceder, rectificar, cancelar u oponerse al tratamiento de sus datos personales.
        </p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0f1f3d", marginBottom: 8 }}>6. Contacto</h3>
        <p style={{ color: "#6b6b7a", fontSize: 13 }}>
          Para consultas, reclamos o ejercicio de derechos sobre datos personales: <strong style={{ color: "#0f1f3d" }}>capstoneclaud@gmail.com</strong>
        </p>
      </div>
    </div>
  );
}

// ─── CONTENIDO DE POLÍTICA DE PRIVACIDAD ───
function PrivacyContent() {
  return (
    <div>
      <p style={{ marginBottom: 16, color: "#6b6b7a" }}>
        <strong style={{ color: "#0f1f3d" }}>En cumplimiento de la Ley N° 29733</strong> — Ley de Protección de Datos Personales del Perú y su Reglamento aprobado por Decreto Supremo N° 016-2024-JUS.
      </p>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0f1f3d", marginBottom: 8 }}>1. Responsable del tratamiento</h3>
        <p style={{ color: "#6b6b7a", fontSize: 13 }}>
          El equipo de Linkuy, en su condición de operador de la Plataforma en el marco de un proyecto académico universitario. Para cualquier asunto relativo a datos personales, el Usuario puede dirigirse a <strong style={{ color: "#0f1f3d" }}>capstoneclaud@gmail.com</strong>.
        </p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0f1f3d", marginBottom: 8 }}>2. Datos recopilados</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: "#f8f8f6", padding: "12px 16px", borderRadius: 6 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#0f1f3d", margin: "0 0 4px 0" }}>Estudiantes</p>
            <p style={{ fontSize: 12, color: "#6b6b7a", margin: 0 }}>Nombre, DNI, correo, teléfono, universidad, carrera y código de estudiante.</p>
          </div>
          <div style={{ background: "#f8f8f6", padding: "12px 16px", borderRadius: 6 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#0f1f3d", margin: "0 0 4px 0" }}>MYPEs</p>
            <p style={{ fontSize: 12, color: "#6b6b7a", margin: 0 }}>Razón social, RUC, dirección, rubro y nombre del representante legal.</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0f1f3d", marginBottom: 8 }}>3. Finalidad del tratamiento</h3>
        <p style={{ color: "#6b6b7a", fontSize: 13 }}>
          Los datos son recopilados y utilizados exclusivamente para operar la Plataforma: verificar identidades, facilitar la conexión entre empresas y estudiantes, emitir badges digitales de participación y generar estadísticas de impacto en el marco del proyecto académico universitario.
        </p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0f1f3d", marginBottom: 8 }}>4. Confidencialidad y cesión a terceros</h3>
        <p style={{ color: "#6b6b7a", fontSize: 13 }}>
          Linkuy no vende, alquila ni comparte información personal de los usuarios con terceros con fines comerciales o publicitarios. Los datos podrán ser compartidos exclusivamente entre Usuarios conectados en un proyecto, con proveedores de infraestructura o con autoridades competentes por orden judicial.
        </p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0f1f3d", marginBottom: 8 }}>5. Conservación de datos</h3>
        <p style={{ color: "#6b6b7a", fontSize: 13 }}>
          Los datos se conservarán durante la vigencia de la cuenta activa y por un período adicional de tres (3) años después de la última actividad registrada, con fines de auditoría. Transcurrido ese período, serán eliminados de forma segura.
        </p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0f1f3d", marginBottom: 8 }}>6. Derechos ARCO</h3>
        <p style={{ color: "#6b6b7a", fontSize: 13 }}>
          El usuario tiene derecho a acceder, rectificar, cancelar u oponerse al tratamiento de sus datos personales. Para ejercer estos derechos debe enviar una solicitud a <strong style={{ color: "#0f1f3d" }}>capstoneclaud@gmail.com</strong> identificándose de la siguiente manera:
        </p>
        <ul style={{ color: "#6b6b7a", fontSize: 13, paddingLeft: 20, marginTop: 8 }}>
          <li><strong>Estudiantes:</strong> nombre completo y DNI.</li>
          <li><strong>MYPEs:</strong> nombre del representante legal y RUC de la empresa.</li>
        </ul>
      </div>
    </div>
  );
}