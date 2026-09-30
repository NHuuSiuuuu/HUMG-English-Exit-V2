import * as React from "react";
import { cn } from "@/frontend/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, disabled, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-heading font-semibold transition-colors duration-150 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none";

    const variantStyles = {
      primary: "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.99] shadow-sm",
      secondary: "bg-secondary text-primary-foreground hover:opacity-90 active:scale-[0.99]",
      outline: "border border-border bg-surface text-foreground hover:bg-surface-raised active:scale-[0.99]",
      ghost: "text-foreground hover:bg-surface-raised active:bg-border/30",
      danger: "bg-danger text-accent-foreground hover:opacity-90 active:scale-[0.99]",
    };

    const sizeStyles = {
      sm: "h-9 px-3 text-sm min-h-[36px]",
      md: "h-11 px-4 text-base min-h-[44px]", // Đảm bảo vùng bấm tối thiểu 44px theo DESIGN.md
      lg: "h-12 px-6 text-base font-bold min-h-[48px]",
      icon: "h-11 w-11 min-h-[44px] min-w-[44px] p-2",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
