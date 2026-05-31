import { clsx } from "clsx";

export const Logo = ({ className, imgClassName, theme = "dark" }) => {
  // theme="dark" asume que el contenedor es oscuro y usa las letras blancas.
  // theme="light" asume que el contenedor es blanco/claro y usa las letras oscuras.
  const logoSrc = theme === "dark" ? "/linkuy_logo.svg" : "/linkuy_logo_Blanco.svg";
  const iconSrc = theme === "dark" ? "/icon.svg" : "/iconBlanco.svg";

  return (
    <div className={clsx("flex items-center", className)} style={{ gap: 0 }}>
      <img
        src={iconSrc}
        alt="Linkuy Icon"
        className={clsx("object-contain", imgClassName || "h-8 w-auto")}
      />
      <img
        src={logoSrc}
        alt="Linkuy Text"
        className={clsx("object-contain", imgClassName || "h-8 w-auto")}
        style={{ marginLeft: -4 }}
      />
    </div>
  );
};
