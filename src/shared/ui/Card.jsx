import { clsx } from "clsx";

export const Card = ({ children, className }) => {
  return (
    <div
      className={clsx(
        "bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
};
