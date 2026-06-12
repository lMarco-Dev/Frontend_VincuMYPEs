import { Sparkles } from "lucide-react";

export function PreseleccionadoBanner({ postulacion }) {
  return (
    <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500 flex items-center justify-center shrink-0">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-blue-800">
              ¡Has sido preseleccionado!
            </p>
            <p className="text-xs text-blue-600 mt-0.5 font-bold">
              {postulacion.proyectoTitulo}
            </p>
          </div>
        </div>
      </div>
      <p className="text-xs text-blue-700 leading-relaxed font-medium">
        El equipo de VincuMYPEs ha revisado tu perfil y te ha preseleccionado. 
        Ahora tu postulación ha sido enviada directamente a la MYPE para su evaluación final. 
        ¡Mantente atento a las notificaciones!
      </p>
    </div>
  );
}
