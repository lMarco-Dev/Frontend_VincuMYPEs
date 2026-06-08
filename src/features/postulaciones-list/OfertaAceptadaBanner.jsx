import { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useConfirmarPostulacion } from "@/features/proyecto-postulaciones/usePostulaciones";
import { useQueryClient } from "@tanstack/react-query"; // ✨ Añadido para refresco inmediato
import { ConfirmModal } from "@/shared/components/ConfirmModal";
export function OfertaAceptadaBanner({ postulacion }) {
  const queryClient = useQueryClient(); // ✨ Instanciamos el cliente de consultas
  const { confirmar, isLoading, error } = useConfirmarPostulacion();
  const [tiempoRestante, setTiempoRestante] = useState("");
  const [expirada, setExpirada] = useState(false);

  // Countdown en tiempo real (Sigue perfecto tu lógica)
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

      const horas = Math.floor(diff / (1000 * 60 * 60));
      const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diff % (1000 * 60)) / 1000);
      setTiempoRestante(
        `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`,
      );
    };

    calcular();
    const interval = setInterval(calcular, 1000);
    return () => clearInterval(interval);
  }, [postulacion.fechaLimiteConfirmacion]);

  const handleConfirmar = () => {
    //  Regra oficial cumplida: Al confirmar pasa a CONFIRMADO en base de datos
    confirmar(
      { postulacionId: postulacion.id, confirmar: true },
      {
        onSuccess: () => {
          // Forzamos la actualización inmediata de los estados en la UI del estudiante
          queryClient.invalidateQueries({ queryKey: ["mis-postulaciones"] });
          queryClient.invalidateQueries({ queryKey: ["perfil"] });
        },
      },
    );
  };

  const handleRechazar = () => {
    if (
      !window.confirm(
        "¿Seguro que quieres rechazar esta oferta? Esta acción no se puede deshacer.",
      )
    )
      return;

    // Regla oficial cumplida: Al rechazar pasa a RECHAZADO en base de datos
    confirmar(
      { postulacionId: postulacion.id, confirmar: false },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["mis-postulaciones"] });
        },
      },
    );
  };

  return (
    <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 shadow-sm">
      {/* Encabezado */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-emerald-800">
              ¡Tienes una oferta esperando tu respuesta!
            </p>
            <p className="text-xs text-emerald-600 mt-0.5 font-bold">
              {postulacion.proyectoTitulo}
            </p>
          </div>
        </div>

        {/* Countdown */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold shrink-0
          ${
            expirada
              ? "bg-red-100 text-red-600 border border-red-200"
              : "bg-white text-slate-700 border border-slate-200 shadow-sm"
          }`}
        >
          <Clock
            size={14}
            className={expirada ? "text-red-500" : "text-slate-400"}
          />
          {tiempoRestante || "Calculando..."}
        </div>
      </div>

      {/* Descripción */}
      <p className="text-xs text-emerald-700 mb-4 leading-relaxed font-medium">
        La empresa aceptó tu postulación. Debes confirmar o rechazar antes de
        que venza el plazo de 12 horas. Si no respondes a tiempo, el cupo
        quedará libre automáticamente.
      </p>

      {/* Error del servidor */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-3">
          <AlertTriangle size={14} className="text-red-500 shrink-0" />
          <p className="text-xs text-red-600 font-bold">{error}</p>
        </div>
      )}

      {/* Botones de acción bilateral */}
      {!expirada && (
        <div className="flex gap-3">
          <button
            onClick={handleConfirmar}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-sm font-bold py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-wait shadow-md shadow-emerald-500/10"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCircle2 size={16} />
            )}
            Confirmar participación
          </button>
          <button
            onClick={handleRechazar}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-white hover:bg-red-50 active:scale-95 text-red-600 border border-red-200 text-sm font-bold px-4 py-2.5 rounded-xl transition-all disabled:opacity-50"
          >
            <XCircle size={16} />
            Rechazar
          </button>
        </div>
      )}

      {expirada && (
        <div className="flex items-center gap-2 text-xs text-red-600 font-semibold bg-red-50 border border-red-100 p-3 rounded-xl">
          <AlertTriangle size={14} />
          Esta oferta expiró. El cupo de la vacante fue liberado automáticamente
          por VincuMYPEs.
        </div>
      )}
    </div>
  );
}
