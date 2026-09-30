import * as React from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { LoginForm } from "@/frontend/components/auth/login-form";

export const metadata = {
  title: "Đăng nhập — HUMG English Exit",
  description: "Đăng nhập tài khoản để lưu tiến độ ôn luyện và lịch sử thi thử chuẩn đầu ra tiếng Anh HUMG",
};

export default function LoginPage() {
  return (
    <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center p-4 sm:p-6 bg-transparent">
      <div className="w-full max-w-md space-y-6">
        <div className="rounded-3xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] space-y-6 transition-all duration-300 ease-in-out">
          <div className="text-center space-y-2.5">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-[#0095F6] shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
              Đăng nhập tài khoản
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Lưu tiến độ ôn luyện và theo dõi lịch sử thi thử của bạn
            </p>
          </div>

          <LoginForm />

          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 text-center text-xs text-slate-500 dark:text-slate-400">
            Chưa có tài khoản?{" "}
            <Link
              href="/dang-ky"
              className="font-semibold text-[#0095F6] hover:underline"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
