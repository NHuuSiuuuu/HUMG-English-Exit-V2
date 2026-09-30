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
      "inline-flex items-center justify-center font-heading font-semibold transition-all duration-150 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0095F6] disabled:pointer-events-none disabled:opacity-50 select-none";

    const variantStyles = {
      primary: "bg-[#0095F6] hover:bg-sky-600 text-white shadow-[0_2px_10px_rgba(0,149,246,0.25)] active:scale-[0.99]",
      secondary: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_2px_10px_rgba(16,185,129,0.25)] active:scale-[0.99]",
      outline: "border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm active:scale-[0.99]",
      ghost: "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.99]",
      danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-sm active:scale-[0.99]",
    };

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs min-h-[36px]",
      md: "h-11 px-4 text-sm min-h-[44px]",
      lg: "h-12 px-6 text-sm sm:text-base font-bold min-h-[48px]",
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
