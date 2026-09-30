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
    <div className="border-b border-slate-100 dark:border-slate-800/80 py-4 transition-colors last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="flex w-full items-center justify-between text-left font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 hover:text-[#0095F6] transition-colors focus-visible:outline-none rounded-lg p-1"
      >
        <span className="pr-4">{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180 text-[#0095F6]"
          )}
        />
      </button>
      {isOpen && (
        <div id={contentId} className="pt-2.5 pb-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal animate-in fade-in-50 duration-150">
          {children}
        </div>
      )}
    </div>
  );
}

export function Accordion({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("divide-y divide-slate-100 dark:divide-slate-800/80", className)}>{children}</div>;
}
