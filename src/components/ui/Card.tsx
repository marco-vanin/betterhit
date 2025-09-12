import type { ReactNode } from "react";

interface CardProps {
  readonly children: ReactNode;
  readonly variant?: "default" | "success" | "warning" | "error";
  readonly className?: string;
}

const cardVariants = {
  default: "bg-white border-gray-200",
  success: "bg-green-50 border-green-200",
  warning: "bg-yellow-50 border-yellow-200",
  error: "bg-red-50 border-red-200",
} as const;

/**
 * Reusable Card component for consistent layout
 */
export const Card = ({
  children,
  variant = "default",
  className = "",
}: CardProps) => (
  <div
    className={`
    rounded-lg shadow-lg border p-4 sm:p-6
    ${cardVariants[variant]}
    ${className}
  `}
  >
    {children}
  </div>
);
