// src/entities/user/UserAvatar.jsx

export function UserAvatar({ avatarUrl, name, size = "md" }) {

  const initials = name ? name.charAt(0).toUpperCase() : "?"

  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-14 h-14 text-xl",
  }

  // Si hay foto, mostramos la imagen
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    )
  }

  // Si no hay foto, mostramos un círculo de color con la inicial
  // bg-primary usa el color que definiste en el @theme del index.css
  return (
    <div
      className={`${sizes[size]} rounded-full bg-primary flex items-center justify-center`}
    >
      <span className="text-white font-semibold">{initials}</span>
    </div>
  )
}