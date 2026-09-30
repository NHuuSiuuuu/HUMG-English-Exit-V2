import * as React from "react";
import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="rounded-full bg-surface-raised p-4 mb-4 text-muted">
        <FileQuestion className="h-12 w-12 text-primary" />
      </div>
      <h2 className="font-heading font-extrabold text-3xl text-foreground mb-2">
        404 — Không tìm thấy trang
      </h2>
      <p className="text-muted text-base max-w-md mb-6">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển sang đường dẫn khác.
      </p>
      <Link href="/">
        <Button variant="primary" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Về trang chủ</span>
        </Button>
      </Link>
    </div>
  );
}
