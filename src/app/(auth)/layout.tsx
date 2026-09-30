import * as React from "react";
import { Header } from "@/frontend/components/layout/header";
import { Footer } from "@/frontend/components/layout/footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-transparent">
        {children}
      </main>
      <Footer />
    </div>
  );
}
