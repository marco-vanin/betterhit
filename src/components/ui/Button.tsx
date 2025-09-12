import type { ReactNode } from "react";

interface ButtonProps {
  readonly children: ReactNode;
  readonly onClick?: () => void;
  readonly variant?: "primary" | "secondary";
  readonly className?: string;
}

/**
 * Simple, clean button component
 */
export const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
}: ButtonProps) => {
  const baseClasses = "px-6 py-3 rounded-lg font-medium transition-colors";

  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
