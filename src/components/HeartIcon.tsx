"use client";

type Props = {
  filled?: boolean;
  className?: string;
  onClick?: () => void;
};

export function HeartIcon({ filled = false, className = "", onClick }: Props) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
      className={`p-1 rounded-full transition-colors ${className}`}
      type="button"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        className={`transition-colors ${
          filled 
            ? "fill-red-500 text-red-500" 
            : "fill-none text-gray-400 hover:text-red-400"
        }`}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
