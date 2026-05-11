import { useUserStore } from "@/entities/user/userStore";
import { httpClient } from "@shared/api/httpClient";
import { Button } from "@shared/ui/Button";
import { useMutation } from "@tanstack/react-query";

export function ApplyButton({ proyectoId }) {
  const { isAuthenticated, user } = useUserStore();

  if (!isAuthenticated || user?.rol != "ESTUDIANTE") return null;

  //Logica para llamar al back
  const postularMutation = useMutation({
    mutationFn: () =>
      httpClient.post(`/proyectos/${proyectoId}/postular`, {
        mensajePostulacion: "",
      }),
    onSuccess: () => alert("!Postulación exitosa"),
  });

  return (
    <Button
      onClick={() => postularMutation.mutate()}
      disabled={postularMutation.isPending}
      variant="primary"
    >
      {postularMutation.isPending
        ? "Postulando..."
        : "Postular a este Proyecto"}
    </Button>
  );
}
