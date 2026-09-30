"use client";

import * as React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <h2 className="text-lg font-bold">Đã xảy ra sự cố hệ thống</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {error?.message || "Đã xảy ra lỗi không mong muốn khi tải trang."}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 bg-[#0095F6] hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            Thử tải lại
          </button>
        </div>
      </body>
    </html>
  );
}
