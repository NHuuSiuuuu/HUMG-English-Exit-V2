"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group font-sans"
      richColors
      closeButton
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-surface group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-2xl",
          description: "group-[.toast]:text-muted text-xs",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-semibold",
          cancelButton:
            "group-[.toast]:bg-surface-raised group-[.toast]:text-muted",
        },
      }}
      {...props}
    />
  );
}

export { toast } from "sonner";
