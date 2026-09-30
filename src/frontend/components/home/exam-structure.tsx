"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Headphones, Clock, HelpCircle, ArrowRight, Info } from "lucide-react";
import { useLanguage } from "@/frontend/providers/language-provider";

export function ExamStructure() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = React.useState<"all" | "rw" | "listening">("all");

  const readingWritingParts = [
    { no: "Part 1", name: "Phần 1: Biển báo (Nối câu với 8 biển báo/thông báo A-H)", q: "5 câu", type: "Ghép 1 trong 8" },
    { no: "Part 2", name: "Phần 2: Từ vựng (Điền từ A/B/C vào chỗ trống đoạn ngắn)", q: "5 câu", type: "Trắc nghiệm 3 lựa chọn" },
    { no: "Part 3", name: "Phần 3: Hội thoại (Chọn câu đối đáp phù hợp A/B/C)", q: "5 câu", type: "Trắc nghiệm 3 lựa chọn" },
    { no: "Part 4", name: "Phần 4: Đọc hiểu (Bài đọc kèm câu hỏi Right/Wrong/Doesn't say)", q: "7 câu", type: "Chọn 1 trong 3" },
    { no: "Part 5", name: "Phần 5: Điền đoạn (Đoạn văn khuyết 8 chỗ chọn A/B/C)", q: "8 câu", type: "Trắc nghiệm 3 lựa chọn" },
    { no: "Part 6", name: "Phần 6: Đoán từ (Định nghĩa từ, cho chữ cái đầu và số ký tự)", q: "5 câu", type: "Ô nhập text" },
    { no: "Part 7", name: "Phần 7: Điền từ vào thư/email (Viết đúng 1 từ mỗi ô)", q: "10 câu", type: "Ô nhập text" },
    { no: "Part 8", name: "Phần 8: Điền form thông tin (Đọc thư, điền phiếu thông tin)", q: "5 câu", type: "Ô nhập text" },
    { no: "Part 9", name: "Phần 9: Viết note ngắn (Viết note 25-35 từ đủ 3 ý yêu cầu)", q: "1 bài viết", type: "Tự luận văn bản ngắn" },
  ];

  const listeningParts = [
    { no: "Part 10", name: "Phần 10: Listening 1 (5 hội thoại ngắn chọn tranh A/B/C)", q: "5 câu", type: "Chọn 1 trong 3 tranh" },
    { no: "Part 11", name: "Phần 11: Listening 2 (Nối món đồ/sự kiện với lý do A-H)", q: "5 câu", type: "Ghép 1 trong 8" },
    { no: "Part 12", name: "Phần 12: Listening 3 (Trắc nghiệm A/B/C theo hội thoại)", q: "5 câu", type: "Trắc nghiệm 3 lựa chọn" },
    { no: "Part 13", name: "Phần 13: Listening 4 (Nghe và điền thông tin vào phiếu)", q: "5 câu", type: "Ô nhập text" },
    { no: "Part 14", name: "Phần 14: Listening 5 (Nghe và điền chi tiết vào tờ ghi chú)", q: "5 câu", type: "Ô nhập text" },
  ];

  return (
    <section className="py-16 sm:py-20 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0095F6]">
            Cấu trúc đề chuẩn
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Cấu trúc 14 Phần bài thi chuẩn đầu ra HUMG
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
            Đề thi bám sát định dạng Cambridge KET (A2 Key) với 2 khối kỹ năng làm liên tục trong 60 phút.
          </p>

          {/* Thanh tóm tắt nhanh */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-slate-800/80 px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800 shadow-sm">
              <Clock className="h-3.5 w-3.5 text-[#0095F6]" />
              <span>Thời gian làm bài: <strong>60 phút</strong></span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-slate-800/80 px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800 shadow-sm">
              <HelpCircle className="h-3.5 w-3.5 text-emerald-500" />
              <span>Tổng số câu: <strong>75 câu + 1 bài viết</strong></span>
            </div>
          </div>
        </div>

        {/* Tab chuyển đổi khối dạng Pill */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 bg-slate-200/50 dark:bg-slate-800/60 rounded-full shadow-inner">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-1.5 text-xs sm:text-sm font-bold rounded-full transition-all duration-300 ease-in-out ${
                activeTab === "all"
                  ? "bg-white dark:bg-slate-700 text-[#0095F6] dark:text-sky-300 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Tất cả (14 Parts)
            </button>
            <button
              onClick={() => setActiveTab("rw")}
              className={`px-4 py-1.5 text-xs sm:text-sm font-bold rounded-full transition-all duration-300 ease-in-out ${
                activeTab === "rw"
                  ? "bg-white dark:bg-slate-700 text-[#0095F6] dark:text-sky-300 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Reading & Writing (9 Parts)
            </button>
            <button
              onClick={() => setActiveTab("listening")}
              className={`px-4 py-1.5 text-xs sm:text-sm font-bold rounded-full transition-all duration-300 ease-in-out ${
                activeTab === "listening"
                  ? "bg-white dark:bg-slate-700 text-[#0095F6] dark:text-sky-300 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Listening (5 Parts)
            </button>
          </div>
        </div>

        {/* Danh sách các Part bọc trong Card lớn trắng sạch */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cột 1: Reading & Writing */}
          {(activeTab === "all" || activeTab === "rw") && (
            <div className={`space-y-4 ${activeTab === "rw" ? "lg:col-span-2 max-w-4xl mx-auto w-full" : ""}`}>
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800">
                <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shadow-sm">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    Khối Reading & Writing (Phần 1 – 9)
                  </h3>
                  <p className="text-xs text-slate-400">
                    50 câu hỏi trắc nghiệm & điền từ · 1 bài viết ngắn
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {readingWritingParts.map((part) => (
                  <div
                    key={part.no}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300 ease-in-out gap-2"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-bold text-xs px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 whitespace-nowrap mt-0.5 sm:mt-0">
                        {part.no}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">{part.name}</span>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <span className="text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        {part.type}
                      </span>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 min-w-[50px] text-right">
                        {part.q}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cột 2: Listening */}
          {(activeTab === "all" || activeTab === "listening") && (
            <div className={`space-y-4 ${activeTab === "listening" ? "lg:col-span-2 max-w-4xl mx-auto w-full" : ""}`}>
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800">
                <div className="p-2.5 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 shadow-sm">
                  <Headphones className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    Khối Listening (Phần 10 – 14)
                  </h3>
                  <p className="text-xs text-slate-400">
                    25 câu hỏi trắc nghiệm chọn tranh, nối ý & điền thông tin
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {listeningParts.map((part) => (
                  <div
                    key={part.no}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300 ease-in-out gap-2"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-bold text-xs px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 whitespace-nowrap mt-0.5 sm:mt-0">
                        {part.no}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">{part.name}</span>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <span className="text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        {part.type}
                      </span>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 min-w-[50px] text-right">
                        {part.q}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Thông báo Listening phong cách TADR OU */}
              <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-sky-100 dark:border-sky-900/50 shadow-sm text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-1.5">
                <p className="font-bold text-[#0095F6] dark:text-sky-300 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>Quy chế phần thi Nghe:</span>
                </p>
                <p>• Phần 10 gồm tranh minh họa mức giá, giờ đồng hồ, hoạt động, họa tiết áo.</p>
                <p>• Toàn bộ audio được nghe 2 lần theo đúng chuẩn đề thi Cambridge KET.</p>
              </div>
            </div>
          )}
        </div>

        {/* Nút hành động */}
        <div className="text-center pt-4">
          <Link
            href="/on-luyen"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0095F6] hover:bg-sky-600 text-white font-bold text-sm shadow-[0_4px_14px_rgba(0,149,246,0.3)] hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
          >
            <span>Bắt đầu ôn tập 14 phần</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
