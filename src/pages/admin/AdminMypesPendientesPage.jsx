import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Building2,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  Ban,
  AlertCircle,
} from "lucide-react";
import { useAdminMypesPendientes } from "@/features/admin/useAdminMypesPendientes";

const FONT = "'Angro Std', 'Outfit', sans-serif";
const TABS = [
  { key: "PENDIENTE", label: "Pendientes", icon: Clock, color: "#F59E0B" },
  { key: "APROBADO", label: "Aprobadas", icon: CheckCircle2, color: "#059669" },
  { key: "RECHAZADO", label: "Rechazadas", icon: Ban, color: "#DC2626" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function AdminMypesPendientesPage() {
  const [tab, setTab] = useState("PENDIENTE");
  const { mypes, isLoading, aprobar, rechazar, isApproving, isRechazando } =
    useAdminMypesPendientes(tab);
  const [search, setSearch] = useState("");
  const [rechazarModal, setRechazarModal] = useState({ open: false, mype: null });
  const [motivoRechazo, setMotivoRechazo] = useState("");

  const filtered = Array.isArray(mypes)
    ? mypes.filter(
        (m) =>
          m.ruc?.includes(search) ||
          m.nombre?.toLowerCase().includes(search.toLowerCase()) ||
          m.email?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const emptyMsg = tab === "PENDIENTE"
    ? "No hay MYPEs pendientes de aprobación"
    : tab === "APROBADO"
    ? "No hay MYPEs aprobadas"
    : "No hay MYPEs rechazadas";

  return (
    <div style={{ padding: "32px 40px", fontFamily: FONT }}>
      <motion.div {...fadeUp(0)}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#0f1f3d",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Building2 size={22} color="#059669" />
              Validar MYPEs
            </h1>
            <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
              Revisa, aprueba o rechaza las solicitudes de registro de MYPEs
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 4,
            padding: 3,
            background: "#F3F4F6",
            borderRadius: 8,
            marginBottom: 20,
            maxWidth: 480,
          }}
        >
          {TABS.map((t) => {
            const active = tab === t.key;
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: 6,
                  background: active ? "#fff" : "transparent",
                  color: active ? t.color : "#6B7280",
                  fontWeight: active ? 600 : 500,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: FONT,
                  boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.2s",
                }}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>

        <div
          style={{
            position: "relative",
            maxWidth: 360,
            marginBottom: 24,
          }}
        >
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
            }}
          />
          <input
            type="text"
            placeholder="Buscar por RUC, nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px 10px 36px",
              border: "1.5px solid #E5E7EB",
              borderRadius: 10,
              fontSize: 13,
              outline: "none",
              boxSizing: "border-box",
              fontFamily: FONT,
            }}
          />
        </div>
      </motion.div>

      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: 60,
            color: "#94a3b8",
          }}
        >
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          {...fadeUp(0.1)}
          style={{
            textAlign: "center",
            padding: 60,
            color: "#94a3b8",
          }}
        >
          <CheckCircle2 size={48} style={{ margin: "0 auto 16px", opacity: 0.4 }} />
          <p style={{ fontSize: 15, margin: 0 }}>
            {search ? "No se encontraron MYPEs con ese criterio" : emptyMsg}
          </p>
        </motion.div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((mype, i) => (
            <motion.div
              key={mype.id ?? i}
              {...fadeUp(0.05 * (i + 1))}
              style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: 12,
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#0f1f3d",
                  }}
                >
                  {mype.nombreUsuario || mype.razonSocial || mype.nombreComercial || "Sin nombre"}
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: 12,
                    color: "#64748b",
                    display: "flex",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <span>RUC: {mype.ruc || "-"}</span>
                  <span>Email: {mype.email || "-"}</span>
                  {mype.telefono && <span>Tel: {mype.telefono}</span>}
                </p>
              </div>

              {tab === "PENDIENTE" && (
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => aprobar(mype.id)}
                    disabled={isApproving}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 16px",
                      border: "none",
                      borderRadius: 8,
                      background: "#059669",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: FONT,
                      transition: "opacity 0.2s",
                      opacity: isApproving ? 0.6 : 1,
                    }}
                  >
                    {isApproving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                    Aprobar
                  </button>
                  <button
                    onClick={() => setRechazarModal({ open: true, mype })}
                    disabled={isRechazando}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 16px",
                      border: "none",
                      borderRadius: 8,
                      background: "#DC2626",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: FONT,
                      transition: "opacity 0.2s",
                      opacity: isRechazando ? 0.6 : 1,
                    }}
                  >
                    <XCircle size={14} />
                    Rechazar
                  </button>
                </div>
              )}

              {tab !== "PENDIENTE" && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "4px 12px",
                    borderRadius: 6,
                    background: tab === "APROBADO" ? "#ECFDF5" : "#FEF2F2",
                    color: tab === "APROBADO" ? "#059669" : "#DC2626",
                  }}
                >
                  {tab === "APROBADO" ? "Aprobada" : "Rechazada"}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de rechazo */}
      <AnimatePresence>
        {rechazarModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
              background: "rgba(13, 27, 53, 0.6)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setRechazarModal({ open: false, mype: null })}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "32px 28px",
                maxWidth: 440,
                width: "100%",
                boxShadow: "0 25px 60px rgba(13, 27, 53, 0.3)",
                fontFamily: FONT,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "#FEF2F2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <AlertCircle size={26} color="#DC2626" />
              </div>

              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0f1f3d",
                  margin: "0 0 4px",
                  textAlign: "center",
                }}
              >
                Rechazar MYPE
              </h3>

              <p
                style={{
                  fontSize: 13,
                  color: "#64748b",
                  textAlign: "center",
                  margin: "0 0 20px",
                }}
              >
                {rechazarModal.mype?.nombreUsuario || rechazarModal.mype?.nombreComercial || "Esta MYPE"}
              </p>

              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Motivo del rechazo
              </label>
              <textarea
                value={motivoRechazo}
                onChange={(e) => setMotivoRechazo(e.target.value)}
                placeholder="Indica por qué se rechaza esta solicitud..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1.5px solid #E5E7EB",
                  borderRadius: 10,
                  fontSize: 13,
                  fontFamily: "inherit",
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                  color: "#111827",
                }}
              />

              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button
                  onClick={() => {
                    setRechazarModal({ open: false, mype: null });
                    setMotivoRechazo("");
                  }}
                  style={{
                    flex: 1,
                    height: 44,
                    border: "1.5px solid #E5E7EB",
                    borderRadius: 10,
                    background: "#fff",
                    color: "#374151",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: FONT,
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    rechazar({ mypeId: rechazarModal.mype?.id, motivo: motivoRechazo });
                    setRechazarModal({ open: false, mype: null });
                    setMotivoRechazo("");
                  }}
                  disabled={isRechazando}
                  style={{
                    flex: 1,
                    height: 44,
                    border: "none",
                    borderRadius: 10,
                    background: isRechazando ? "#FCA5A5" : "#DC2626",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: FONT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    transition: "background 0.2s",
                  }}
                >
                  {isRechazando ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                  {isRechazando ? "Rechazando..." : "Rechazar"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
