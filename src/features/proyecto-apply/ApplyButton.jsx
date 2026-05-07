import { httpClient } from "@/shared/api/httpClient";
import { Button } from "@/shared/ui/Button";
import { useMutation } from "@tanstack/react-query";

export function ApplyButton({ proyectoId }) {
  //Logica para llamar al back
  const postularMutation = useMutation({
    mutationFn: () => httpClient.post(`/proyectos/${proyectoId}/postular`),
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
