"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import type { Locale } from "@/shared/types/i18n";
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from "@/shared/types/i18n";
import viMessages from "@/messages/vi.json";
import enMessages from "@/messages/en.json";

type MessagesType = typeof viMessages;

interface LanguageContextType {
  locale: Locale;
  setLocale: (newLocale: Locale) => void;
  // Hàm dịch theo key lồng nhau, ví dụ: 'landing.hero.title'
  t: (path: string, fallback?: string) => string;
  messages: MessagesType;
}

const dictionaries: Record<Locale, MessagesType> = {
  vi: viMessages,
  en: enMessages as unknown as MessagesType,
};

const LanguageContext = createContext<LanguageContextType | null>(null);

// Hàm helper truy xuất giá trị lồng nhau từ chuỗi path "a.b.c"
function getNestedValue(obj: Record<string, unknown>, path: string): string | null {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return null;
    }
  }
  return typeof current === "string" ? current : null;
}

export function LanguageProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [, startTransition] = useTransition();

  useEffect(() => {
    // Đọc ngôn ngữ từ cookie trình duyệt nếu có
    const match = document.cookie.match(new RegExp(`(^|;\\s*)(${LOCALE_COOKIE_NAME})=([^;]*)`));
    if (match && (match[3] === "vi" || match[3] === "en")) {
      setLocaleState(match[3] as Locale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    startTransition(() => {
      setLocaleState(newLocale);
      // Lưu lựa chọn ngôn ngữ vào cookie trong 1 năm
      document.cookie = `${LOCALE_COOKIE_NAME}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    });
  };

  const t = (path: string, fallback?: string): string => {
    const currentDict = dictionaries[locale] as unknown as Record<string, unknown>;
    const value = getNestedValue(currentDict, path);
    if (value !== null) return value;

    // Fallback sang tiếng Việt nếu thiếu key tiếng Anh (theo DESIGN.md)
    if (locale !== "vi") {
      const viVal = getNestedValue(dictionaries.vi as unknown as Record<string, unknown>, path);
      if (viVal !== null) return viVal;
    }

    return fallback || path;
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        t,
        messages: dictionaries[locale],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage phải được sử dụng bên trong LanguageProvider");
  }
  return context;
}
