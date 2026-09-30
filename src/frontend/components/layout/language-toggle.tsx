"use client";

import * as React from "react";
import { Languages } from "lucide-react";
import { useLanguage } from "@/frontend/providers/language-provider";
import { Button } from "@/frontend/components/ui/button";

export function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage();

  const toggleLanguage = () => {
    setLocale(locale === "vi" ? "en" : "vi");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      title={`${t("common.language.switchLanguage", "Đổi ngôn ngữ")}: ${locale === "vi" ? "English" : "Tiếng Việt"}`}
      aria-label={`${t("common.language.switchLanguage", "Đổi ngôn ngữ")}: ${locale === "vi" ? "English" : "Tiếng Việt"}`}
      className="flex items-center gap-1.5 px-3 min-w-[64px] font-heading font-bold"
    >
      <Languages className="h-4 w-4 text-muted" />
      <span className="text-xs uppercase tracking-wider">{locale}</span>
    </Button>
  );
}
