import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Vote,
  User,
  Clock,
  CheckCircle2,
  Loader2,
  X,
  Trophy,
  Users,
  AlertCircle,
} from "lucide-react";
import { useVotacion, useVotar } from "@/features/votacion/useVotacion";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale/es";

export function VotacionModal({ proyectoId, onClose }) {
  const { votacion, isLoading, refetch } = useVotacion(proyectoId);
  const { votar, isVotando } = useVotar(proyectoId);
  const [votoExitoso, setVotoExitoso] = useState(false);

  const handleVotar = (candidatoId) => {
    votar(candidatoId, {
      onSuccess: () => {
        setVotoExitoso(true);
        setTimeout(() => {
          refetch();
          setVotoExitoso(false);
        }, 2000);
      },
    });
  };

  const tiempoRestante = votacion?.fechaLimite
    ? formatDistanceToNow(new Date(votacion.fechaLimite), {
        addSuffix: true,
        locale: es,
      })
    : "";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  const completada = votacion?.estado === "COMPLETADA";
  const ganador = votacion?.candidatos?.find((c) => c.esGanador);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Vote size={24} />
              <div>
                <h2 className="text-lg font-bold">
                  {completada
                    ? "✅ Delegado Elegido"
                    : "🗳️ Votación de Delegado"}
                </h2>
                <p className="text-sm opacity-80">{votacion?.proyectoTitulo}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {votoExitoso && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700"
            >
              <CheckCircle2 size={18} />
              <span className="text-sm font-medium">¡Voto registrado!</span>
            </motion.div>
          )}

          {completada && ganador ? (
            /* Ganador */
            <div className="text-center py-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Trophy size={36} className="text-yellow-600" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {ganador.estudianteNombre}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                Delegado del equipo · {ganador.votosRecibidos} votos
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                <CheckCircle2 size={14} />
                Solo el delegado puede subir entregables
              </div>

              {/* Todos los candidatos */}
              <div className="mt-6 space-y-2">
                {votacion.candidatos.map((c) => (
                  <div
                    key={c.estudianteId}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      c.esGanador
                        ? "bg-yellow-50 border border-yellow-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <span className="text-sm font-medium">
                        {c.estudianteNombre}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-600">
                      {c.votosRecibidos} votos
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Votación en curso */
            <>
              {/* Timer */}
              <div className="flex items-center gap-2 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700">
                <Clock size={18} />
                <span className="text-sm font-medium">
                  Termina {tiempoRestante}
                </span>
              </div>

              {/* Info */}
              <p className="text-sm text-gray-500 mb-4">
                El delegado será el único que pueda subir entregables. Elige
                sabiamente:
              </p>

              {/* Candidatos */}
              <div className="space-y-3">
                {votacion?.candidatos?.map((candidato) => (
                  <motion.button
                    key={candidato.estudianteId}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleVotar(candidato.estudianteId)}
                    disabled={isVotando || votacion?.yaVote}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      votacion?.yaVote
                        ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                        : "border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                          {candidato.estudianteNombre?.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800">
                          {candidato.estudianteNombre}
                        </span>
                      </div>
                      {!votacion?.yaVote && (
                        <span className="text-xs text-blue-600 font-medium">
                          Votar →
                        </span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Ya votó */}
              {votacion?.yaVote && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2 text-blue-700">
                  <CheckCircle2 size={18} />
                  <span className="text-sm font-medium">
                    Ya has votado. Espera los resultados...
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>
              {votacion?.totalVotos || 0} de {votacion?.candidatos?.length || 0}{" "}
              votos
            </span>
          </div>
          <button
            onClick={refetch}
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            Actualizar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
