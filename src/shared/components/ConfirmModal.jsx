import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, XCircle, CheckCircle } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "warning",
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: <XCircle size={24} className="text-red-600" />,
      buttonBg: "from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
      shadow: "shadow-red-600/20",
      borderColor: "border-red-100",
    },
  warning: {
    icon: <AlertTriangle size={24} className="text-amber-600" />,
    buttonBg: "from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800",
    shadow: "shadow-amber-600/20",
    borderColor: "border-amber-100",
  },
  info: {
    icon: <CheckCircle size={24} className="text-blue-600" />,
    buttonBg: "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
    shadow: "shadow-blue-600/20",
    borderColor: "border-blue-100",
  },
  // ✅ Agregar success
  success: {
    icon: <CheckCircle size={24} className="text-green-600" />,
    buttonBg: "from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
    shadow: "shadow-green-600/20",
    borderColor: "border-green-100",
  },
};

  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${styles.buttonBg.split(' ')[0]}`} />
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  {styles.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                  <p className="text-slate-500 text-sm mt-0.5">¿Seguro que quieres continuar?</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-6">{message}</p>
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r ${styles.buttonBg} rounded-xl transition-all shadow-md ${styles.shadow} disabled:opacity-50`}
                >
                  {isLoading ? "Procesando..." : confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};