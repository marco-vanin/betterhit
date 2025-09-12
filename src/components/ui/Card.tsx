import type { ReactNode } from "react";

interface CardProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Simple card component
 */
export const Card = ({ children, className = "" }: CardProps) => (
  <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
    {children}
  </div>
);
