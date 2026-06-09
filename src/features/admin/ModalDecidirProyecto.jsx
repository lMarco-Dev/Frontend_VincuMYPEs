import { useState } from "react";
import { motion } from "framer-motion";
import { Gavel, X } from "lucide-react";

const DECISIONES = [
  { id: "CONTINUAR", label: "Continuar con el equipo actual" },
  { id: "AMPLIAR", label: "Ampliar plazo de entrega" },
  { id: "VACANTES", label: "Abrir vacantes (expulsar inactivos)" },
  { id: "CANCELAR", label: "Cancelar proyecto" },
];

export default function ModalDecidirProyecto({ proyecto, onClose, onConfirm, isDecidiendo }) {
  const [decision, setDecision] = useState("CONTINUAR");
  const [diasExtra, setDiasExtra] = useState(7);

  const handleConfirm = () => {
    onConfirm({
      proyectoId: proyecto.id,
      decision,
      diasExtra: decision === "AMPLIAR" ? diasExtra : null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10"
      >
        <div className="p-6">
          {/* Cabecera */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Gavel size={20} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Decidir sobre el proyecto</h3>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
              <X size={18} />
            </button>
          </div>

          <p className="text-sm text-slate-500 mb-6">
            Proyecto: <strong>{proyecto?.titulo}</strong>
          </p>

          {/* Selección de decisión */}
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
            Acción a tomar
          </label>
          <div className="space-y-2 mb-6">
            {DECISIONES.map((d) => (
              <label
                key={d.id}
                className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                  decision === d.id
                    ? "bg-blue-50 border-blue-200 ring-2 ring-blue-500/15"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="decision"
                  value={d.id}
                  checked={decision === d.id}
                  onChange={() => setDecision(d.id)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-slate-800">{d.label}</span>
              </label>
            ))}
          </div>

          {/* Campo de días extra (solo si se elige AMPLIAR) */}
          {decision === "AMPLIAR" && (
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                Días adicionales
              </label>
              <input
                type="number"
                min="1"
                max="90"
                value={diasExtra}
                onChange={(e) => setDiasExtra(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Se sumarán a la fecha límite actual.
              </p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDecidiendo}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              {isDecidiendo ? "Aplicando..." : "Confirmar decisión"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}