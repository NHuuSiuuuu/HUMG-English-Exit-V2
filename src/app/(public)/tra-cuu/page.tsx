import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";

export default function CheckScoresPage() {
  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Tiêu đề trang */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Về trang chủ</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
              Tra cứu Điểm thi & Lịch thi CFI — HUMG
            </h1>
            <p className="text-muted text-base max-w-2xl leading-relaxed">
              Giao diện tra cứu trực tiếp từ Trung tâm Ngoại ngữ - Tin học (CFI) Trường Đại học Mỏ - Địa chất.
            </p>
          </div>

          {/* Nút dự phòng mở tab mới theo AGENTS.md rule 9 */}
          <a
            href="https://kqt.cfi.humg.edu.vn"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button variant="outline" className="gap-2">
              <span>Mở trang tra cứu tab mới</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>

        {/* Thông báo bảo mật & nguồn dữ liệu */}
        <div className="rounded-lg border border-secondary/30 bg-secondary/10 p-4 sm:p-5 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm text-foreground">
            <p className="font-bold">Đảm bảo an toàn thông tin sinh viên</p>
            <p className="text-muted text-xs sm:text-sm">
              Trang web nhúng trực tiếp cổng tra cứu của nhà trường (<strong>kqt.cfi.humg.edu.vn</strong>). Hệ thống tuyệt đối không lưu trữ, không ghi log mã sinh viên hay dữ liệu điểm thi của bạn.
            </p>
          </div>
        </div>

        {/* Khung nhúng iframe theo AGENTS.md */}
        <div className="relative w-full overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
          <div className="flex items-center justify-between border-b border-border bg-surface-raised px-4 py-2.5 text-xs text-muted">
            <span className="font-mono">https://kqt.cfi.humg.edu.vn</span>
            <span className="flex items-center gap-1 text-success font-semibold">
              <span className="h-2 w-2 rounded-full bg-success inline-block" />
              Kết nối trực tiếp CFI
            </span>
          </div>

          <div className="w-full min-h-[700px] h-[80vh]">
            <iframe
              src="https://kqt.cfi.humg.edu.vn"
              title="Tra cứu điểm thi và lịch thi CFI HUMG"
              className="w-full h-full border-0"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
