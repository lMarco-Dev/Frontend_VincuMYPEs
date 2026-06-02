import api from "@/shared/api/httpClient";

export const listarEstudiantesAdminApi = () => api.get("/admin/estudiantes");

export const actualizarLimiteProyectosApi = ({ estudianteId, nuevoLimite }) =>
  api.patch(`/admin/estudiantes/${estudianteId}/limite-proyectos`, { nuevoLimite });