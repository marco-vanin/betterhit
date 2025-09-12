import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  readonly variant?: "primary" | "secondary" | "danger";
  readonly size?: "sm" | "md" | "lg";
  readonly children: ReactNode;
}

const buttonVariants = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
  danger: "bg-red-600 hover:bg-red-700 text-white",
} as const;

const buttonSizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5",
  lg: "px-8 py-3 text-lg font-medium",
} as const;

/**
 * Reusable Button component with consistent styling
 */
export const Button = ({
  variant = "primary",
  size = "md",
  children,
  disabled,
  ...props
}: ButtonProps) => (
  <button
    className={`
      font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105
      ${buttonVariants[variant]}
      ${buttonSizes[size]}
      ${disabled ? "opacity-50 cursor-not-allowed hover:scale-100" : ""}
    `}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);
