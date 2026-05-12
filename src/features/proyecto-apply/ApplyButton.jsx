import { httpClient } from "@shared/api/httpClient";
import { Button } from "@shared/ui/Button";
import { Modal } from "@shared/ui/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function ApplyButton({ proyectoId }) {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const postularMutation = useMutation({
    mutationFn: (data) => httpClient.post(`/proyectos/${proyectoId}/postular`, data),
    
    onSuccess: () => {
      alert("¡Postulación exitosa!");
      // Invalidamos las queries para refrescar la interfaz
      queryClient.invalidateQueries(["proyecto", proyectoId]);
      queryClient.invalidateQueries(["mis-postulaciones"]);
      setIsModalOpen(false);
      setMensaje("");
    },
    
    onError: (error) => {
      // Capturamos el mensaje de error que viene del backend
      const mensajeError = error.response?.data?.message || "Error al realizar la postulación";
      alert(mensajeError);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    postularMutation.mutate({
      mensajePostulacion: mensaje,
      archivoAdjunto: null // Por ahora lo enviamos null si no manejas archivos aún
    });
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        disabled={postularMutation.isPending}
        variant="primary"
      >
        Postular a este Proyecto
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Postular al Proyecto"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">
              Mensaje para tu postulación (opcional)
            </label>
            <textarea
              id="mensaje"
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-700"
              placeholder="Escribe aquí por qué te interesa el proyecto (máx. 200 caracteres)..."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              maxLength={200}
            ></textarea>
            <div className="text-xs text-gray-500 text-right mt-1">
              {mensaje.length}/200
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={postularMutation.isPending}
              variant="primary"
            >
              {postularMutation.isPending ? "Postulando..." : "Confirmar Postulación"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
