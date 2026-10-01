"use client";

import React, { useEffect } from "react";
import {
  X,
  BookOpen,
  Clock,
  Laptop,
  Wifi,
  Volume2,
  ShieldAlert,
  Layers,
  CheckCircle2,
  HelpCircle,
  Headphones,
} from "lucide-react";

interface ExamGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal hiển thị Hướng dẫn & Quy chế thi thử mô phỏng 60 phút
 * Nền mờ phủ toàn màn hình (backdrop-blur), phân chia 4 phần rõ ràng
 */
export function ExamGuideModal({ isOpen, onClose }: ExamGuideModalProps) {
  // Đóng modal khi bấm phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Lớp phủ Backdrop Blur */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Nội dung Modal */}
      <div className="relative z-10 w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 flex-shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0095F6]/10 text-[#0095F6] flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Hướng dẫn & Quy chế thi thử 60 phút
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chuẩn đầu ra tiếng Anh Trường Đại học Mỏ - Địa chất (HUMG)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thân Modal cuộn */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-sm text-slate-600 dark:text-slate-300">
          {/* 1. Quy định làm bài thi thử */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <span>1. Quy định làm bài thi thử</span>
            </div>
            <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl p-4 space-y-2.5 text-xs sm:text-sm text-amber-950 dark:text-amber-200 leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>
                  <strong>Đồng hồ tính giờ độc lập từ máy chủ:</strong> Thời gian 60 phút bắt đầu đếm ngược ngay khi bấm &ldquo;Bắt đầu làm bài&rdquo;. Tải lại trang vẫn giữ nguyên thời gian còn lại.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>
                  <strong>Tự động lưu đáp án liên tục:</strong> Hệ thống tự động đồng bộ bài làm của bạn sau mỗi thao tác để chống mất dữ liệu khi gián đoạn mạng.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>
                  <strong>Hết giờ tự động nộp bài:</strong> Khi đồng hồ về 0, hệ thống tự động chốt bài thi với những câu bạn đã làm và chuyển sang trang kết quả chấm điểm.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>
                  <strong>Chuyển đổi linh hoạt 14 phần:</strong> Bạn có thể sử dụng thanh điều hướng để nhảy nhanh đến bất kỳ Part nào bất cứ lúc nào.
                </span>
              </div>
            </div>
          </div>

          {/* 2. Cấu trúc các phần thi trong đề (14 Parts) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base">
              <Layers className="w-5 h-5 text-purple-600" />
              <span>2. Cấu trúc 14 phần trong đề thi</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Khối Reading & Writing */}
              <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-3 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-2 font-bold text-purple-600 dark:text-purple-400 text-xs sm:text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>Khối 1: Reading & Writing (Part 1 – 9)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800/60">
                  <li className="pt-1.5 flex justify-between">
                    <span>Part 1: Biển báo & thông báo (Ghép A–H)</span>
                    <strong className="text-slate-800 dark:text-slate-200">5 câu</strong>
                  </li>
                  <li className="pt-1.5 flex justify-between">
                    <span>Part 2: Từ vựng điền câu (A/B/C)</span>
                    <strong className="text-slate-800 dark:text-slate-200">5 câu</strong>
                  </li>
                  <li className="pt-1.5 flex justify-between">
                    <span>Part 3: Hội thoại giao tiếp (A/B/C)</span>
                    <strong className="text-slate-800 dark:text-slate-200">5 câu</strong>
                  </li>
                  <li className="pt-1.5 flex justify-between">
                    <span>Part 4: Đọc hiểu văn bản (Right/Wrong/DS)</span>
                    <strong className="text-slate-800 dark:text-slate-200">7 câu</strong>
                  </li>
                  <li className="pt-1.5 flex justify-between">
                    <span>Part 5: Điền đoạn văn (A/B/C)</span>
                    <strong className="text-slate-800 dark:text-slate-200">8 câu</strong>
                  </li>
                  <li className="pt-1.5 flex justify-between">
                    <span>Part 6: Đoán từ vựng theo định nghĩa</span>
                    <strong className="text-slate-800 dark:text-slate-200">5 câu</strong>
                  </li>
                  <li className="pt-1.5 flex justify-between">
                    <span>Part 7: Điền từ vào thư/email</span>
                    <strong className="text-slate-800 dark:text-slate-200">10 câu</strong>
                  </li>
                  <li className="pt-1.5 flex justify-between">
                    <span>Part 8: Điền phiếu biểu mẫu</span>
                    <strong className="text-slate-800 dark:text-slate-200">5 câu</strong>
                  </li>
                  <li className="pt-1.5 flex justify-between text-amber-600 dark:text-amber-400 font-medium">
                    <span>Part 9: Viết note (Tự luận 25–35 từ)</span>
                    <strong>1 bài</strong>
                  </li>
                </ul>
              </div>

              {/* Khối Listening */}
              <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-3 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-2 font-bold text-sky-600 dark:text-sky-400 text-xs sm:text-sm">
                  <Headphones className="w-4 h-4" />
                  <span>Khối 2: Listening (Part 10 – 14)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800/60">
                  <li className="pt-1.5 flex justify-between">
                    <span>Part 10: Nghe hội thoại ngắn (Chọn tranh A/B/C)</span>
                    <strong className="text-slate-800 dark:text-slate-200">5 câu</strong>
                  </li>
                  <li className="pt-1.5 flex justify-between">
                    <span>Part 11: Ghép thông tin (A–H)</span>
                    <strong className="text-slate-800 dark:text-slate-200">5 câu</strong>
                  </li>
                  <li className="pt-1.5 flex justify-between">
                    <span>Part 12: Trắc nghiệm hội thoại (A/B/C)</span>
                    <strong className="text-slate-800 dark:text-slate-200">5 câu</strong>
                  </li>
                  <li className="pt-1.5 flex justify-between">
                    <span>Part 13: Nghe điền thông tin vào tờ</span>
                    <strong className="text-slate-800 dark:text-slate-200">5 câu</strong>
                  </li>
                  <li className="pt-1.5 flex justify-between">
                    <span>Part 14: Nghe điền biểu mẫu dịch vụ</span>
                    <strong className="text-slate-800 dark:text-slate-200">5 câu</strong>
                  </li>
                  <li className="pt-1.5 text-[11px] text-slate-400 italic">
                    * Mỗi đoạn nghe được phát đúng 2 lần theo tiêu chuẩn Cambridge KET.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3. Yêu cầu thiết bị & Kỹ thuật */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base">
              <Laptop className="w-5 h-5 text-[#0095F6]" />
              <span>3. Yêu cầu thiết bị & Kỹ thuật</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                <Volume2 className="w-4 h-4 text-sky-500" />
                <h4 className="font-bold text-slate-900 dark:text-white">Tai nghe âm thanh</h4>
                <p className="text-slate-500 dark:text-slate-400">
                  Kiểm tra loa hoặc tai nghe hoạt động tốt để nghe rõ audio ở Part 10 - 14.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                <Wifi className="w-4 h-4 text-emerald-500" />
                <h4 className="font-bold text-slate-900 dark:text-white">Kết nối Internet</h4>
                <p className="text-slate-500 dark:text-slate-400">
                  Duy trì đường truyền mạng ổn định trong suốt 60 phút làm bài.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
                <h4 className="font-bold text-slate-900 dark:text-white">Trình duyệt web</h4>
                <p className="text-slate-500 dark:text-slate-400">
                  Khuyến nghị Chrome, Edge, Safari hoặc Firefox phiên bản mới nhất.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end bg-slate-50/60 dark:bg-slate-900/60 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#0095F6] hover:bg-[#008be5] text-white text-sm font-bold shadow-[0_3px_0_0_#0275ba] active:translate-y-[2px] active:shadow-[0_1px_0_0_#0275ba] transition-all cursor-pointer min-h-[40px]"
          >
            Đã hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
