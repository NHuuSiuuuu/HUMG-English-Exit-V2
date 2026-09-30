"use client";

import * as React from "react";
import { AdminSidebar } from "@/frontend/components/admin/admin-sidebar";
import { ThemeToggle } from "@/frontend/components/layout/theme-toggle";
import { Menu, ShieldAlert, Bell } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar (Desktop cố định, Mobile drawer) */}
      <AdminSidebar
        isMobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Navbar Admin */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-surface px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Mở menu quản trị"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-base text-foreground">
                Bảng điều khiển Quản trị viên
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent border border-accent/20">
                <ShieldAlert className="h-3 w-3" />
                Admin Role
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            
            {/* Avatar Admin */}
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary font-heading font-extrabold text-xs">
                AD
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold font-heading text-foreground leading-none">
                  Quản trị viên
                </span>
                <span className="text-[11px] text-muted leading-tight mt-0.5">
                  admin@humg.edu.vn
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Nội dung trang admin */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
