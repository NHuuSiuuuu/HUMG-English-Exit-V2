"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, BookOpen, Clock, FileText, Search, LogIn, UserPlus } from "lucide-react";
import { useLanguage } from "@/frontend/providers/language-provider";
import { Button } from "@/frontend/components/ui/button";
import { cn } from "@/frontend/lib/utils";

export function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  // Đóng drawer khi đổi trang
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Khóa cuộn trang khi drawer mở
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navItems = [
    { href: "/on-luyen", label: t("common.nav.practice", "Ôn luyện"), icon: BookOpen },
    { href: "/thi-thu", label: t("common.nav.mockExam", "Thi thử"), icon: Clock },
    { href: "/bai-viet", label: t("common.nav.articles", "Bài viết"), icon: FileText },
    { href: "/tra-cuu", label: t("common.nav.checkScore", "Tra cứu điểm"), icon: Search },
    { href: "/admin", label: t("common.nav.admin", "Quản trị"), icon: LogIn },
  ];

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Đóng danh mục" : "Mở danh mục"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in-50 duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-surface p-6 shadow-xl border-l border-border flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-border">
                <span className="font-heading font-bold text-lg text-primary">HUMG English Exit</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  aria-label="Đóng"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="mt-6 flex flex-col space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-lg text-base font-heading font-semibold transition-colors min-h-[44px]",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-surface-raised"
                      )}
                    >
                      <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted")} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-border flex flex-col space-y-3">
              <Link href="/dang-nhap" className="w-full">
                <Button variant="outline" className="w-full justify-center gap-2">
                  <LogIn className="h-4 w-4" />
                  {t("common.nav.login", "Đăng nhập")}
                </Button>
              </Link>
              <Link href="/dang-ky" className="w-full">
                <Button variant="primary" className="w-full justify-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  {t("common.nav.register", "Đăng ký")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
