import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Loader2, X } from "lucide-react";

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  const isDanger = variant === "danger";

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(2px)",
            }}
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: "relative",
              background: "#fff",
              borderRadius: 20,
              padding: "28px 28px 24px",
              width: "100%",
              maxWidth: 420,
              boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            }}
          >
            <button
              onClick={onCancel}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                background: "#f1f5f9",
                border: "none",
                borderRadius: 8,
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#64748b",
              }}
            >
              <X size={15} />
            </button>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: isDanger ? "#fef2f2" : "#ecfdf5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {isDanger ? (
                  <AlertTriangle size={22} color="#dc2626" />
                ) : (
                  <CheckCircle2 size={22} color="#059669" />
                )}
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#0f1f3d",
                    margin: "0 0 6px",
                    lineHeight: 1.3,
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {message}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
              <button
                onClick={onCancel}
                disabled={isLoading}
                style={{
                  padding: "9px 18px",
                  borderRadius: 10,
                  border: "0.5px solid #e2e8f0",
                  background: "#fff",
                  color: "#374151",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                style={{
                  padding: "9px 20px",
                  borderRadius: 10,
                  border: "none",
                  background: isDanger
                    ? "linear-gradient(135deg, #ef4444, #dc2626)"
                    : "linear-gradient(135deg, #10b981, #059669)",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: isLoading ? "wait" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  opacity: isLoading ? 0.7 : 1,
                  boxShadow: isDanger
                    ? "0 4px 12px rgba(220,38,38,0.25)"
                    : "0 4px 12px rgba(5,150,105,0.25)",
                }}
              >
                {isLoading && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
