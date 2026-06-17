import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Building2,
  MapPin,
  Calendar,
} from "lucide-react";
import { useConfirmarPostulacion } from "@/features/proyecto-postulaciones/usePostulaciones";
import { useQueryClient } from "@tanstack/react-query";
import { ConfirmModal } from "@/shared/components/ConfirmModal";

const FONT = "'Angro Std', 'Outfit', sans-serif";

export function OfertaAceptadaBanner({ postulacion }) {
  const queryClient = useQueryClient();
  const { confirmar, isLoading, error } = useConfirmarPostulacion();
  const [tiempoRestante, setTiempoRestante] = useState("");
  const [expirada, setExpirada] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  useEffect(() => {
    if (!postulacion.fechaLimiteConfirmacion) return;
    const calcular = () => {
      const limite = new Date(postulacion.fechaLimiteConfirmacion);
      const ahora = new Date();
      const diff = limite - ahora;
      if (diff <= 0) {
        setExpirada(true);
        setTiempoRestante("Expirada");
        return;
      }
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTiempoRestante(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    calcular();
    const interval = setInterval(calcular, 1000);
    return () => clearInterval(interval);
  }, [postulacion.fechaLimiteConfirmacion]);

  const handleConfirmar = () => {
    confirmar(
      { postulacionId: postulacion.id, confirmar: true },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["mis-postulaciones"] });
          queryClient.invalidateQueries({ queryKey: ["perfil"] });
        },
      }
    );
  };

  const handleRechazarClick = () => setShowRejectModal(true);

  const handleConfirmReject = () => {
    setRejecting(true);
    confirmar(
      { postulacionId: postulacion.id, confirmar: false },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["mis-postulaciones"] });
          setShowRejectModal(false);
          setRejecting(false);
        },
        onError: () => setRejecting(false),
      }
    );
  };

  const tituloProyecto = postulacion.proyectoTitulo || "Proyecto";
  const mypeNombre = postulacion.mypeNombre || "MYPE";
  const area = postulacion.proyectoArea || postulacion.areaSistemas || "";
  const descripcion = postulacion.proyectoDescripcion || "";
  const direccion = postulacion.mypeDireccion || "Cajamarca";  // ahora viene del backend
  const dias = postulacion.diasEstimados || null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: isExpanded ? "#F0FDF4" : "#F0FDF4",
        border: "1px solid",
        borderColor: isExpanded ? "#BBF7D0" : "#BBF7D0",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: isExpanded
          ? "0 12px 32px -8px rgba(5,150,105,0.10)"
          : "0 2px 4px rgba(5,150,105,0.04)",
        transition: "box-shadow 0.3s ease, border-color 0.3s ease",
        marginBottom: 16,
      }}
    >
      {/* Fila principal */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: "20px 24px",
          display: "grid",
          gridTemplateColumns: "minmax(280px, 2fr) 1.5fr 1fr auto",
          gap: 20,
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        {/* ID + Proyecto */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 10,
                fontFamily: FONT,
                fontWeight: 700,
                color: "#059669",
                background: "#D1FAE5",
                padding: "2px 8px",
                borderRadius: 4,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Oferta
            </span>
          </div>
          <h3
            style={{
              margin: 0,
              fontFamily: FONT,
              fontSize: 15,
              fontWeight: 600,
              color: "#0F1F3D",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {tituloProyecto}
          </h3>
        </div>

        {/* Timer */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 8,
              fontFamily: "'Inter', monospace",
              fontSize: 13,
              fontWeight: 600,
              background: expirada ? "#FEF2F2" : "#FFF7ED",
              border: expirada ? "1px solid #FECACA" : "1px solid #FED7AA",
              color: expirada ? "#DC2626" : "#B91C1C",
              whiteSpace: "nowrap",
            }}
          >
            <Clock size={14} color={expirada ? "#DC2626" : "#9CA3AF"} />
            {tiempoRestante || "Calculando..."}
          </div>
        </div>

        {/* Estado */}
        <div>
          <span style={{ fontSize: 12, fontFamily: FONT, fontWeight: 600, color: "#065F46" }}>
            Responde ahora
          </span>
        </div>

        {/* Flecha */}
        <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
          <ChevronRight size={18} color="#94A3B8" />
        </motion.div>
      </div>

      {/* Panel expandido */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden", borderTop: "1px solid #D1FAE5" }}
          >
            <div
              style={{
                padding: "24px 24px 32px",
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: 48,
                background: "#FFFFFF",
              }}
            >
              {/* Detalles del proyecto */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {descripcion && (
                  <div>
                    <h4
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: 11,
                        fontFamily: FONT,
                        color: "#64748B",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Descripción
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        fontFamily: FONT,
                        color: "#475569",
                        lineHeight: 1.6,
                      }}
                    >
                      {descripcion}
                    </p>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "28px 48px",
                    flexWrap: "wrap",
                    borderTop: "1px dashed #E2E8F0",
                    paddingTop: 20,
                  }}
                >
                  <div>
                    <span style={{ display: "block", fontSize: 11, fontFamily: FONT, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Empresa</span>
                    <span style={{ fontSize: 13, fontFamily: FONT, color: "#0F1F3D", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                      <Building2 size={13} /> {mypeNombre}
                    </span>
                  </div>

                  <div>
                    <span style={{ display: "block", fontSize: 11, fontFamily: FONT, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Dirección</span>
                    <span style={{ fontSize: 13, fontFamily: FONT, color: "#0F1F3D", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                      <MapPin size={13} /> {direccion}
                    </span>
                  </div>

                  {area && (
                    <div style={{ marginTop: 8 }}>
                      <span style={{ display: "block", fontSize: 11, fontFamily: FONT, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Área</span>
                      <span style={{ fontSize: 13, fontFamily: FONT, color: "#0F1F3D", fontWeight: 600 }}>
                        {area.replace("_", " ")}
                      </span>
                    </div>
                  )}

                  {dias && (
                    <div>
                      <span style={{ display: "block", fontSize: 11, fontFamily: FONT, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Duración</span>
                      <span style={{ fontSize: 13, fontFamily: FONT, color: "#0F1F3D", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                        <Calendar size={13} /> {dias} días
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Panel de acciones */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  background: "#F8FAFC",
                  borderRadius: 12,
                  padding: 20,
                  border: "1px solid #E2E8F0",
                }}
              >
                <div style={{ fontSize: 10, fontFamily: FONT, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>
                  Acciones
                </div>

                {error && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
                    <AlertTriangle size={14} color="#DC2626" />
                    <p style={{ fontSize: 12, color: "#DC2626", fontWeight: 600, margin: 0, fontFamily: FONT }}>{error}</p>
                  </div>
                )}

                {!expirada && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowConfirmModal(true); }}
                      disabled={isLoading}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        padding: "10px 0", borderRadius: 8, border: "none",
                        background: isLoading ? "#A7F3D0" : "#059669", color: "#FFFFFF",
                        fontSize: 12, fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer",
                        fontFamily: FONT, transition: "background 0.15s", width: "100%",
                      }}
                      onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = "#047857"; }}
                      onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.background = "#059669"; }}
                    >
                      {isLoading ? <Loader2 size={14} className="animate-spin" /> : null}
                      Confirmar participación
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRechazarClick(); }}
                      disabled={isLoading || rejecting}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: "10px 0", borderRadius: 8, border: "1px solid #E5E7EB",
                        background: "#FFFFFF", color: "#DC2626", fontSize: 12, fontWeight: 600,
                        cursor: isLoading || rejecting ? "not-allowed" : "pointer",
                        opacity: isLoading || rejecting ? 0.5 : 1,
                        fontFamily: FONT, transition: "all 0.15s", width: "100%",
                      }}
                      onMouseEnter={(e) => { if (!isLoading && !rejecting) { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.borderColor = "#FECACA"; } }}
                      onMouseLeave={(e) => { if (!isLoading && !rejecting) { e.currentTarget.style.background = "#FFFFFF"; e.currentTarget.style.borderColor = "#E5E7EB"; } }}
                    >
                      Rechazar oferta
                    </button>
                  </div>
                )}

                {expirada && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8 }}>
                    <AlertTriangle size={14} color="#DC2626" />
                    <p style={{ fontSize: 12, color: "#DC2626", fontWeight: 600, margin: 0, fontFamily: FONT }}>
                      Esta oferta expiró. El cupo fue liberado automáticamente.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={showRejectModal}
        title="Rechazar oferta"
        message={`¿Seguro que quieres rechazar la oferta para "${tituloProyecto}"?`}
        confirmText="Rechazar"
        variant="danger"
        onConfirm={handleConfirmReject}
        onCancel={() => setShowRejectModal(false)}
        isLoading={rejecting}
      />
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Confirmar participación"
        message={`Al aceptar, te comprometes a participar en "${tituloProyecto}".`}
        confirmText="Confirmar"
        variant="success"
        onConfirm={() => { setShowConfirmModal(false); handleConfirmar(); }}
        onCancel={() => setShowConfirmModal(false)}
        isLoading={isLoading}
      />
    </motion.div>
  );
}