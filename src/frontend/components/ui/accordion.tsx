"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/frontend/lib/utils";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpenDefault?: boolean;
}

export function AccordionItem({ title, children, isOpenDefault = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(isOpenDefault);
  const contentId = React.useId();

  return (
    <div className="border-b border-border py-4 transition-colors">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="flex w-full items-center justify-between text-left font-heading text-lg font-bold text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm p-1"
      >
        <span className="pr-4">{title}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted transition-transform duration-200",
            isOpen && "rotate-180 text-primary"
          )}
        />
      </button>
      {isOpen && (
        <div id={contentId} className="pt-3 pb-1 text-base text-muted leading-relaxed font-sans animate-in fade-in-50 duration-150">
          {children}
        </div>
      )}
    </div>
  );
}

export function Accordion({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("divide-y divide-border", className)}>{children}</div>;
}
