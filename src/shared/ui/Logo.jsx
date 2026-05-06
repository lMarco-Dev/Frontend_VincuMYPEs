import { clsx } from "clsx";

export const Logo = ({ className }) => {
  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 shrink-0"
      >
        <path d="M20 15 L50 85 L65 85 L35 15 Z" fill="#1E3A5F" />
        <path d="M80 15 L50 85 L35 85 L65 15 Z" fill="#A23B72" opacity="0.9" />
        <circle cx="50" cy="85" r="8" fill="#2E86AB" />
      </svg>
      <span className="text-xl font-bold tracking-tight">
        <span className="text-[#1E3A5F]">Vincu</span>
        <span className="text-[#A23B72]">MYPEs</span>
      </span>
    </div>
  );
};
