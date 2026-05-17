import React, { useState } from 'react';
import { usePostular } from './usePostular';
import { Send, Loader2, CheckCircle } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const PostularButton = ({ proyectoId, yaPostulo, disabled }) => {
  const [mensaje, setMensaje] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Usamos el hook y renombramos la función a 'postular' como se solicitó
  const { postular, estaCargando } = usePostular();

  const manejarEnvioDePostulacion = (e) => {
    e.preventDefault();
    if (mensaje.length > 200) return;
    
    // Ejecutamos la acción de postular con callbacks de mutación personalizados
    postular({ 
      proyectoId: proyectoId,
      datos: {
        mensajePostulacion: mensaje,
        archivoAdjunto: "" // Opcional según manual técnico
      }
    }, {
      onSuccess: () => {
        setIsSuccess(true);
        setMensaje('');
        // Ocultar mensaje de éxito después de 3.5 segundos
        setTimeout(() => {
          setIsSuccess(false);
          setShowForm(false);
        }, 3500);
      },
      onError: (err) => {
        const msg = err.response?.data?.message || err.message || "Error al enviar la postulación";
        setErrorMessage(msg);
        setTimeout(() => setErrorMessage(''), 5000);
      }
    });
  };

  if (yaPostulo) {
    return (
      <button 
        disabled 
        className="flex items-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-xl font-semibold cursor-not-allowed border border-green-200"
      >
        <CheckCircle size={20} />
        Ya postulaste
      </button>
    );
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg shadow-emerald-50/50"
      >
        <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-3 shadow-md shadow-emerald-200">
          <CheckCircle size={24} className="animate-bounce" style={{ animationDuration: '2s' }} />
        </div>
        <h4 className="text-sm font-extrabold text-emerald-800 mb-1">¡Postulación Enviada!</h4>
        <p className="text-xs text-emerald-600 font-semibold leading-relaxed">
          Tu aplicación ha sido registrada y enviada a la MYPE con éxito.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-md">
      {!showForm ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          disabled={disabled}
          className={`flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
            disabled 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
          }`}
        >
          {disabled ? 'No disponible' : 'Postular ahora'}
          {!disabled && <Send size={18} />}
        </motion.button>
      ) : (
        <motion.form 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={manejarEnvioDePostulacion} 
          className="space-y-4 p-4 bg-white rounded-2xl border border-indigo-100 shadow-xl"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensaje de postulación ({mensaje.length}/200)
            </label>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Explica por qué eres ideal para este proyecto..."
              className={`w-full p-3 rounded-xl border transition-all focus:ring-2 outline-none resize-none h-32 ${
                mensaje.length > 200 
                  ? 'border-red-300 focus:ring-red-100' 
                  : 'border-gray-200 focus:ring-indigo-100 focus:border-indigo-400'
              }`}
              required
            />
            {mensaje.length > 200 && (
              <p className="text-red-500 text-xs mt-1">El mensaje no puede superar los 200 caracteres.</p>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 px-4 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={estaCargando || mensaje.length > 200 || mensaje.length === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              {estaCargando ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                'Enviar'
              )}
            </button>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-[11px] font-bold text-center bg-red-50 p-2.5 rounded-xl border border-red-100 mt-2">
              ⚠️ {errorMessage}
            </p>
          )}
        </motion.form>
      )}
    </div>
  );
};

export default PostularButton;
