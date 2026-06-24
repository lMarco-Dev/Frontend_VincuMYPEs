import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, XCircle, CheckCircle, Info } from 'lucide-react';

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
      icon: <XCircle size={18} className="text-slate-500" strokeWidth={1.5} />,
      iconBg: "bg-slate-100",
      buttonBg: "bg-slate-800 hover:bg-slate-900",
      buttonText: "text-white",
      accentColor: "border-slate-300",
    },
    warning: {
      icon: <AlertTriangle size={18} className="text-slate-500" strokeWidth={1.5} />,
      iconBg: "bg-slate-100",
      buttonBg: "bg-slate-800 hover:bg-slate-900",
      buttonText: "text-white",
      accentColor: "border-slate-300",
    },
    info: {
      icon: <Info size={18} className="text-slate-500" strokeWidth={1.5} />,
      iconBg: "bg-slate-100",
      buttonBg: "bg-slate-800 hover:bg-slate-900",
      buttonText: "text-white",
      accentColor: "border-slate-300",
    },
    success: {
      icon: <CheckCircle size={18} className="text-slate-500" strokeWidth={1.5} />,
      iconBg: "bg-slate-100",
      buttonBg: "bg-slate-800 hover:bg-slate-900",
      buttonText: "text-white",
      accentColor: "border-slate-300",
    },
  };

  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0A]/40 backdrop-blur-[1px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-[420px] w-full bg-white rounded-xl shadow-[0_24px_80px_-8px_rgba(0,0,0,0.18)] overflow-hidden"
          >
            {/* Línea de acento sutil */}
            <div className={`h-[2px] w-full ${styles.accentColor}`} />

            <div className="p-7">
              {/* Encabezado */}
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center`}>
                  {styles.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[16px] font-semibold text-slate-800 leading-tight tracking-[-0.01em]">
                    {title}
                  </h3>
                  <p className="text-[13.5px] text-slate-500 mt-1 leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>

              {/* Separador */}
              <div className="h-px w-full bg-slate-200/60 mt-6" />

              {/* Botones */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 text-[13px] font-medium text-slate-600 bg-transparent hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-40 border border-slate-200 hover:border-slate-300"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-2.5 text-[13px] font-medium ${styles.buttonText} ${styles.buttonBg} rounded-lg transition-colors shadow-sm hover:shadow-md disabled:opacity-40`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2.5">
                      <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3.5"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      Procesando...
                    </span>
                  ) : confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};