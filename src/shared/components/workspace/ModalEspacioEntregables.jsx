import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, User, Send, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const C = {
  primary: "#1B6FE8",
  success: "#059669",
  warning: "#d4580a",
  border: "#e8e8e4",
  textPrimary: "#0f1f3d",
  textSecondary: "#6b6b7a",
  textMuted: "#94a3b8",
};

export function ModalEspacioEntregables({
  isOpen,
  onClose,
  estadoEspacio,
  isLoading,
  error,
  onIngresar,
  onSolicitarAcceso,
  onTransferirAcceso,
  onRechazarSolicitud,
  onSalir,
}) {
  if (!isOpen) return null;

  const { ocupado, ocupadoPor, esMiSesion, minutosRestantes, puedeSolicitar, solicitudPendiente, solicitante } =
    estadoEspacio || {};

  const formatTiempo = (minutos) => {
    if (!minutos || minutos <= 0) return "Expirado";
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return h > 0 ? `${h}h ${m}min` : `${m} min`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10"
        >
          {/* Header */}
          <div
            className="p-6 text-center"
            style={{
              background: "linear-gradient(135deg, #f8fafc, #eff6ff)",
              borderBottom: `0.5px solid ${C.border}`,
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{
                background: esMiSesion
                  ? "linear-gradient(135deg, #10b981, #059669)"
                  : ocupado
                    ? "linear-gradient(135deg, #f59e0b, #d97706)"
                    : "linear-gradient(135deg, #1B6FE8, #06B6D4)",
              }}
            >
              {esMiSesion ? (
                <CheckCircle2 size={28} color="#fff" />
              ) : ocupado ? (
                <Clock size={28} color="#fff" />
              ) : (
                <Send size={28} color="#fff" />
              )}
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-1">
              {esMiSesion
                ? "Estás en el espacio de entregables"
                : ocupado
                  ? "Espacio ocupado"
                  : "Espacio disponible"}
            </h3>
            <p className="text-sm text-slate-500">
              {esMiSesion
                ? `Tiempo restante: ${formatTiempo(minutosRestantes)}`
                : ocupado
                  ? `${ocupadoPor} está usando el espacio`
                  : "Puedes ingresar para gestionar entregables"}
            </p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            {/* Sesión propia */}
            {esMiSesion && (
              <>
                {minutosRestantes > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                    <p className="text-sm font-bold text-emerald-900 mb-1">
                      ⏱️ {formatTiempo(minutosRestantes)} restantes
                    </p>
                    <p className="text-xs text-emerald-700">
                      Tu sesión se cerrará automáticamente al llegar a 1 hora
                    </p>
                  </div>
                )}

                {solicitudPendiente && solicitante && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <User size={16} className="text-amber-600" />
                      <p className="text-sm font-bold text-amber-900">
                        {solicitante} quiere ingresar
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={onTransferirAcceso}
                        disabled={isLoading}
                        className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isLoading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                        Transferir
                      </button>
                      <button
                        onClick={onRechazarSolicitud}
                        disabled={isLoading}
                        className="flex-1 py-2.5 bg-red-100 text-red-700 rounded-xl text-sm font-bold hover:bg-red-200 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <X size={14} />
                        Rechazar
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={onSalir}
                  disabled={isLoading}
                  className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 disabled:opacity-50 transition-colors"
                >
                  Salir del espacio
                </button>
              </>
            )}

            {/* Espacio ocupado por otro */}
            {ocupado && !esMiSesion && (
              <>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <User size={16} className="text-slate-500" />
                    <span className="text-sm font-bold text-slate-700">{ocupadoPor}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Tiempo restante: {formatTiempo(minutosRestantes)}
                  </p>
                </div>

                {puedeSolicitar && (
                  <button
                    onClick={onSolicitarAcceso}
                    disabled={isLoading}
                    className="w-full py-3 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                    Solicitar permiso de acceso
                  </button>
                )}
              </>
            )}

            {/* Espacio libre */}
            {!ocupado && !esMiSesion && (
              <button
                onClick={onIngresar}
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
              >
                {isLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                Ingresar al espacio de entregables
              </button>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                <AlertCircle size={14} className="text-red-500 shrink-0" />
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <button
              onClick={onClose}
              className="w-full py-2.5 text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}