// src/shared/api/apiErrors.js

export const handleApiError = (error) => {
  // 1. Si el backend envió una respuesta estructurada con un mensaje (Tu API Error personalizado en Spring Boot)
  if (error.response && error.response.data) {
    const backendMessage =
      error.response.data.message || error.response.data.error;
    if (backendMessage) {
      return backendMessage;
    }
  }

  // 2. Errores genéricos HTTP (Por si el backend no mandó un mensaje claro)
  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 400:
        return "Datos incorrectos. Por favor, revisa el formulario.";
      case 401:
        return "Sesión expirada o credenciales inválidas.";
      case 403:
        return "No tienes permisos para realizar esta acción.";
      case 404:
        return "El recurso solicitado no existe.";
      case 500:
        return "Error interno del servidor. Intenta de nuevo más tarde.";
      default:
        return `Ocurrió un error inesperado (Código: ${status})`;
    }
  }

  // 3. Errores de red (El servidor está caído, no hay internet, etc.)
  if (error.request) {
    return "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
  }

  // 4. Cualquier otra cosa (errores de código en el frontend al armar la petición)
  return error.message || "Ocurrió un error desconocido.";
};
