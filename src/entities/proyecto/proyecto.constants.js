// src/entities/proyecto/proyecto.constants.js

// Estados del ciclo de vida de un proyecto
// Estos valores vienen del Enum workflow_estado del backend
export const PROYECTO_ESTADO = {
  BORRADOR: "BORRADOR",
  PENDIENTE: "PENDIENTE",
  EN_DESARROLLO: "EN_DESARROLLO",
  EN_REVISION: "EN_REVISION",
  COMPLETADO: "COMPLETADO",
}

// Lo que el usuario ve
export const PROYECTO_ESTADO_LABELS = {
  [PROYECTO_ESTADO.BORRADOR]: "Borrador",
  [PROYECTO_ESTADO.PENDIENTE]: "Pendiente",
  [PROYECTO_ESTADO.EN_DESARROLLO]: "En Desarrollo",
  [PROYECTO_ESTADO.EN_REVISION]: "En Revisión",
  [PROYECTO_ESTADO.COMPLETADO]: "Completado",
}

// El color del badge según el estado
export const PROYECTO_ESTADO_COLORS = {
  [PROYECTO_ESTADO.BORRADOR]: "gray",
  [PROYECTO_ESTADO.PENDIENTE]: "primary",
  [PROYECTO_ESTADO.EN_DESARROLLO]: "warning",
  [PROYECTO_ESTADO.EN_REVISION]: "warning",
  [PROYECTO_ESTADO.COMPLETADO]: "success",
}

// Las áreas de sistemas del Enum area_sistemas del backend
export const AREA_SISTEMAS_LABELS = {
  DESARROLLO_WEB: "Desarrollo Web",
  DESARROLLO_MOVIL: "Desarrollo Móvil",
  DESARROLLO_SOFTWARE: "Desarrollo Software",
  BASE_DE_DATOS: "Base de Datos",
  ANALISIS_DATOS: "Análisis de Datos",
  SOPORTE_TI: "Soporte TI",
  OTRO: "Otro",
}