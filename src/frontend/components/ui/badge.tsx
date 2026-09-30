import * as React from "react";
import { cn } from "@/frontend/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "danger" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary/15 text-secondary border-secondary/30",
    success: "bg-success/15 text-success border-success/30",
    danger: "bg-danger/15 text-danger border-danger/30",
    outline: "border-border text-muted",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-semibold font-heading tracking-wide transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
