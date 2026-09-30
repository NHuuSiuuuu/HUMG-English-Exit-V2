"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, LogIn } from "lucide-react";
import { useLanguage } from "@/frontend/providers/language-provider";
import { ThemeToggle } from "@/frontend/components/layout/theme-toggle";
import { MobileNav } from "@/frontend/components/layout/mobile-nav";
import { Button } from "@/frontend/components/ui/button";
import { cn } from "@/frontend/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navLinks = [
    { href: "/on-luyen", label: t("common.nav.practice", "Ôn luyện") },
    { href: "/thi-thu", label: t("common.nav.mockExam", "Thi thử") },
    { href: "/bai-viet", label: t("common.nav.articles", "Bài viết") },
    { href: "/tra-cuu", label: t("common.nav.checkScore", "Tra cứu điểm") },
    { href: "/admin", label: t("common.nav.admin", "Quản trị") },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo và Tên thương hiệu */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-base sm:text-lg tracking-tight text-foreground leading-none">
              HUMG English Exit
            </span>
            <span className="text-xs text-muted font-medium hidden sm:inline-block">
              {t("common.brandTagline", "Chuẩn đầu ra Tiếng Anh HUMG")}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-heading font-semibold rounded-md transition-colors min-h-[40px] flex items-center",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted hover:text-foreground hover:bg-surface-raised"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Controls: Theme, Auth, Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/dang-nhap">
              <Button variant="ghost" size="sm" className="font-semibold gap-1.5">
                <LogIn className="h-4 w-4" />
                {t("common.nav.login", "Đăng nhập")}
              </Button>
            </Link>
            <Link href="/dang-ky">
              <Button variant="primary" size="sm" className="font-semibold">
                {t("common.nav.register", "Đăng ký")}
              </Button>
            </Link>
          </div>

          {/* Mobile Drawer Button */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
