import { useForm } from "react-hook-form";
import { useCrearProyecto } from "./useCrearProyecto";
import { Button } from "@/shared/ui/Button"; // ← AGREGAR
import { AREA_SISTEMAS_LABELS } from "@/entities/proyecto/proyecto.constants";

export function CrearProyectoForm() {
  const { crearProyecto, isLoading, error } = useCrearProyecto();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => crearProyecto(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Título del proyecto
        </label>
        <input
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="Ej: Crear tienda online para mi negocio"
          {...register("titulo", { required: "El título es obligatorio" })}
        />
        {errors.titulo && (
          <p className="text-red-500 text-xs mt-1">{errors.titulo.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Descripción del problema
        </label>
        <textarea
          rows={4}
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
          placeholder="Describe qué problema tiene tu negocio y qué necesitas solucionar"
          {...register("descripcion", {
            required: "La descripción es obligatoria",
          })}
        />
        {errors.descripcion && (
          <p className="text-red-500 text-xs mt-1">
            {errors.descripcion.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Objetivo
        </label>
        <textarea
          rows={2}
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
          placeholder="¿Qué esperas lograr con este proyecto?"
          {...register("objetivo")}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Entregables esperados
        </label>
        <textarea
          rows={2}
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
          placeholder="Ej: Página web funcional, manual de usuario, código fuente"
          {...register("entregablesSugeridos")}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Área de sistemas
        </label>
        <select
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
          {...register("areaSistemas", { required: "Selecciona un área" })}
        >
          <option value="">Selecciona un área...</option>
          {Object.entries(AREA_SISTEMAS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errors.areaSistemas && (
          <p className="text-red-500 text-xs mt-1">
            {errors.areaSistemas.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Fecha de inicio
          </label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            {...register("fechaInicio")}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Fecha límite
          </label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            {...register("fechaLimite")}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-12 text-base"
        disabled={isLoading}
      >
        {isLoading ? "Publicando proyecto..." : "Publicar proyecto"}
      </Button>
    </form>
  );
}
