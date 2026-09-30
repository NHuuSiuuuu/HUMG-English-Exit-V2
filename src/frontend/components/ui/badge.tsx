import * as React from "react";
import { cn } from "@/frontend/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "danger" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-sky-50 dark:bg-sky-950/60 text-[#0095F6] dark:text-sky-300 border-sky-100 dark:border-sky-900/50",
    secondary: "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50",
    success: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50",
    danger: "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50",
    outline: "border-slate-200 dark:border-slate-700 text-slate-500",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold tracking-wide transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
