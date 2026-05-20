import { useRef, useState } from "react";
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useSubirCv } from "./useSubirCv";

const MAX_MB = 5;
const MAX_BYTES = MAX_MB * 1024 * 1024;

export function CvUploader({ cvUrl, compact = false }) {
  const inputRef = useRef(null);
  const [localError, setLocalError] = useState(null);
  const { subirCv, isLoading, isSuccess, error: serverError } = useSubirCv();

  const handleClick = () => {
    setLocalError(null);
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setLocalError("Solo se permiten archivos PDF.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setLocalError(`El archivo no puede superar los ${MAX_MB}MB.`);
      return;
    }

    setLocalError(null);
    subirCv(file);

    e.target.value = "";
  };

  const errorMsg =
    localError || serverError?.response?.data?.message || serverError?.message;

  // ── Modo compacto: solo para listas de la MYPE ───────────────
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {cvUrl ? (
          <a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition-colors"
          >
            <FileText size={13} />
            Ver CV
            <ExternalLink size={11} />
          </a>
        ) : (
          <span className="text-xs text-slate-400 italic">Sin CV</span>
        )}
      </div>
    );
  }

  // ── Modo completo: para PerfilPage del estudiante ─────────────
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      {/* Encabezado */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
          <FileText size={16} className="text-indigo-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800">Currículum Vitae</p>
          <p className="text-xs text-slate-400">PDF · máx {MAX_MB}MB</p>
        </div>
      </div>

      {/* Si ya tiene CV: mostrar estado y opción de reemplazar */}
      {cvUrl ? (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-700">
                CV subido correctamente
              </p>
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-600 underline underline-offset-2 hover:text-emerald-800 flex items-center gap-1 mt-0.5"
              >
                Ver mi CV actual <ExternalLink size={10} />
              </a>
            </div>
          </div>
          <button
            onClick={handleClick}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
            {isLoading ? "Subiendo..." : "Reemplazar"}
          </button>
        </div>
      ) : (
        /* Si no tiene CV: zona de subida */
        <button
          onClick={handleClick}
          disabled={isLoading}
          className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-3 transition-all
            ${
              isLoading
                ? "border-indigo-200 bg-indigo-50 cursor-wait"
                : "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 cursor-pointer"
            }`}
        >
          {isLoading ? (
            <Loader2 size={24} className="text-indigo-500 animate-spin" />
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <Upload size={20} className="text-slate-400" />
            </div>
          )}
          <div className="text-center">
            <p className="text-sm font-bold text-slate-700">
              {isLoading ? "Subiendo tu CV..." : "Subir CV"}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {isLoading
                ? "Por favor espera"
                : "Haz clic para seleccionar un PDF"}
            </p>
          </div>
        </button>
      )}

      {/* Mensaje de éxito al reemplazar (cuando ya había CV) */}
      {isSuccess && cvUrl && (
        <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 mt-2">
          <CheckCircle2 size={12} /> CV actualizado correctamente
        </p>
      )}

      {/* Error de validación o del servidor */}
      {errorMsg && (
        <div className="flex items-start gap-2 mt-3 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
          <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
        </div>
      )}

      {/* Input oculto — se activa al hacer clic en los botones de arriba */}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
