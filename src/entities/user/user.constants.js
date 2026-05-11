// src/entities/user/user.constants.js

// Estos son los valores EXACTOS que manda el backend de tu compañero
// Si escribes "MYPE" en vez de "ROLE_MYPE", el RoleBadge no va a funcionar
export const USER_ROLES = {
  MYPE: "MYPE",
  ESTUDIANTE: "ESTUDIANTE",
  ADMIN: "ADMIN",
};

// Lo que el usuario VE en pantalla
// El objeto usa los valores de arriba como "llaves"
export const ROLE_LABELS = {
  [USER_ROLES.MYPE]: "Empresa",
  [USER_ROLES.ESTUDIANTE]: "Estudiante",
  [USER_ROLES.ADMIN]: "Administrador",
};

// El color del badge según el rol
// Estos strings deben coincidir con los variants de tu Badge.jsx
export const ROLE_COLORS = {
  [USER_ROLES.MYPE]: "primary",
  [USER_ROLES.ESTUDIANTE]: "success",
  [USER_ROLES.ADMIN]: "warning",
};
