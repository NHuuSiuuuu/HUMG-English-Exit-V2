"use client";

import * as React from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto text-xl font-bold">
        !
      </div>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
        Không thể tải nội dung trang
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
        {error?.message || "Đã xảy ra lỗi trong quá trình hiển thị dữ liệu."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="px-4 py-2 bg-[#0095F6] hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
      >
        Thử lại
      </button>
    </div>
  );
}
