"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { useLanguage } from "@/frontend/providers/language-provider";
import { Button } from "@/frontend/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-11 w-11 rounded-lg border border-border bg-surface/50" />
    );
  }

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    if (theme === "dark") return <Moon className="h-5 w-5 text-primary" />;
    if (theme === "light") return <Sun className="h-5 w-5 text-accent" />;
    return <Laptop className="h-5 w-5 text-muted" />;
  };

  const getLabel = () => {
    if (theme === "dark") return t("common.theme.dark", "Tối");
    if (theme === "light") return t("common.theme.light", "Sáng");
    return t("common.theme.system", "Hệ thống");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={cycleTheme}
      title={`${t("common.theme.toggleTheme", "Đổi giao diện")}: ${getLabel()}`}
      aria-label={`${t("common.theme.toggleTheme", "Đổi giao diện")}: ${getLabel()}`}
      className="relative hover:bg-surface-raised"
    >
      {getIcon()}
    </Button>
  );
}
