export function useNivelAccesoMype(perfil) {
  if (!perfil)
    return {
      nivel: null,
      esPropietario: false,
      puedeVerContacto: false,
      puedeEditar: false,
    };

  const nivel = perfil.nivelAcceso; // "PROPIO" | "CONFIRMADO" | "PUBLICO"

  return {
    nivel,
    esPropietario: nivel === "PROPIO",
    puedeVerContacto: nivel === "PROPIO" || nivel === "CONFIRMADO",
    puedeEditar: nivel === "PROPIO",
  };
}
