"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserPlus, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useAuth } from "@/frontend/providers/auth-provider";

export function RegisterForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [studentCode, setStudentCode] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = "Họ và tên phải có tối thiểu 2 ký tự";
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Địa chỉ email không đúng định dạng";
    }

    if (!password || password.length < 8) {
      errors.password = "Mật khẩu phải có tối thiểu 8 ký tự";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          studentCode: studentCode.trim() || undefined,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
        setIsLoading(false);
        return;
      }

      // Cập nhật trạng thái người dùng tức thì không cần reload thủ công
      if (data.user) {
        setUser(data.user);
      }

      // Chuyển hướng đồng bộ phiên đăng nhập
      window.location.href = returnUrl;
    } catch {
      setErrorMessage("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs sm:text-sm animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Họ và tên */}
      <div className="space-y-1.5">
        <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
          Họ và tên <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (fieldErrors.fullName) setFieldErrors((prev) => ({ ...prev, fullName: "" }));
          }}
          placeholder="Nguyễn Văn A"
          disabled={isLoading}
          required
          autoComplete="name"
          className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 px-3.5 py-2.5 text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#0095F6] focus:border-transparent transition-all duration-200 min-h-[44px] disabled:opacity-60"
        />
        {fieldErrors.fullName && (
          <p className="text-xs text-rose-500 dark:text-rose-400">{fieldErrors.fullName}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
          Email sinh viên <span className="text-rose-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
          }}
          placeholder="sinhvien@humg.edu.vn"
          disabled={isLoading}
          required
          autoComplete="email"
          className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 px-3.5 py-2.5 text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#0095F6] focus:border-transparent transition-all duration-200 min-h-[44px] disabled:opacity-60"
        />
        {fieldErrors.email && (
          <p className="text-xs text-rose-500 dark:text-rose-400">{fieldErrors.email}</p>
        )}
      </div>

      {/* Mã sinh viên */}
      <div className="space-y-1.5">
        <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
          Mã sinh viên <span className="text-xs font-normal text-slate-400">(tùy chọn)</span>
        </label>
        <input
          type="text"
          value={studentCode}
          onChange={(e) => setStudentCode(e.target.value)}
          placeholder="212105xxxx"
          disabled={isLoading}
          className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 px-3.5 py-2.5 text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#0095F6] focus:border-transparent transition-all duration-200 min-h-[44px] disabled:opacity-60"
        />
      </div>

      {/* Mật khẩu */}
      <div className="space-y-1.5">
        <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
          Mật khẩu <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }));
            }}
            placeholder="Tối thiểu 8 ký tự"
            disabled={isLoading}
            required
            autoComplete="new-password"
            className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 pl-3.5 pr-11 py-2.5 text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#0095F6] focus:border-transparent transition-all duration-200 min-h-[44px] disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {fieldErrors.password && (
          <p className="text-xs text-rose-500 dark:text-rose-400">{fieldErrors.password}</p>
        )}
      </div>

      {/* Xác nhận mật khẩu */}
      <div className="space-y-1.5">
        <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
          Xác nhận mật khẩu <span className="text-rose-500">*</span>
        </label>
        <input
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (fieldErrors.confirmPassword)
              setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
          }}
          placeholder="Nhập lại mật khẩu"
          disabled={isLoading}
          required
          autoComplete="new-password"
          className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 px-3.5 py-2.5 text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#0095F6] focus:border-transparent transition-all duration-200 min-h-[44px] disabled:opacity-60"
        />
        {fieldErrors.confirmPassword && (
          <p className="text-xs text-rose-500 dark:text-rose-400">{fieldErrors.confirmPassword}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        disabled={isLoading}
        className="w-full justify-center gap-2 mt-2 min-h-[44px] hover:-translate-y-0.5 transition-all duration-200 shadow-[0_4px_12px_rgba(0,149,246,0.25)]"
      >
        <UserPlus className="h-4 w-4" />
        <span>Đăng ký ngay</span>
      </Button>
    </form>
  );
}
