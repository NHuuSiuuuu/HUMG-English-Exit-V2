import * as React from "react";
import Link from "next/link";
import { Headphones, BookOpen, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { getPartSummaryList } from "@/backend/services/practice.service";

export const metadata = {
  title: "Luyện thi đầu ra — HUMG English Exit",
  description: "Chọn kỹ năng Nghe hoặc Đọc & Viết để bắt đầu ôn luyện chuẩn format Cambridge KET A2",
};

export default async function PracticeHubPage() {
  const allParts = await getPartSummaryList();
  const rwParts = allParts.filter((p) => p.skill === "reading_writing");
  const listeningParts = allParts.filter((p) => p.skill === "listening");

  return (
    <div className="min-h-screen bg-transparent py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Tiêu đề trang - Đồng bộ với cấu trúc trang Thi thử */}
        <div className="space-y-3 text-left">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Về trang chủ</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mt-4">
            Luyện thi đầu ra
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base max-w-3xl mt-2 leading-relaxed">
            Chọn một kỹ năng bên dưới để bắt đầu luyện tập chuyên sâu theo định dạng đề thi chuẩn đầu ra HUMG
          </p>
        </div>

        {/* 3 Thẻ Kỹ Năng Lớn phong cách TADR OU */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Thẻ 1: Luyện Nghe */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 ease-in-out text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto shadow-sm">
                <Headphones className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Luyện Nghe
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                Nghe và trả lời câu hỏi trắc nghiệm theo format đề thi Cambridge KET (5 phần)
              </p>
            </div>
            <div className="mt-6 pt-2">
              <Link
                href="/on-luyen/listening/10"
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#0095F6] hover:bg-[#008be5] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_3.5px_0_0_#0275ba] active:translate-y-[2px] active:shadow-[0_1px_0_0_#0275ba] transition-all duration-150 select-none cursor-pointer"
              >
                <span>→ Bắt đầu</span>
              </Link>
            </div>
          </div>

          {/* Thẻ 2: Luyện Đọc & Viết */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 ease-in-out text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-sm">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Luyện Đọc & Viết
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                Luyện đọc hiểu từ vựng, ngữ pháp, điền đoạn và viết note ngắn (9 phần)
              </p>
            </div>
            <div className="mt-6 pt-2">
              <Link
                href="/on-luyen/reading_writing/1"
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_3.5px_0_0_#7e22ce] active:translate-y-[2px] active:shadow-[0_1px_0_0_#7e22ce] transition-all duration-150 select-none cursor-pointer"
              >
                <span>→ Bắt đầu</span>
              </Link>
            </div>
          </div>

          {/* Thẻ 3: Phòng Luyện Đề Thi */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 ease-in-out text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Phòng Luyện Đề Thi
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                Mô phỏng đề thi đầu ra đầy đủ 14 phần với thời gian thực và tự động chấm điểm
              </p>
            </div>
            <div className="mt-6 pt-2">
              <Link
                href="/thi-thu"
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_3.5px_0_0_#047857] active:translate-y-[2px] active:shadow-[0_1px_0_0_#047857] transition-all duration-150 select-none cursor-pointer"
              >
                <span>→ Bắt đầu</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Danh mục chi tiết 9 Part Đọc & Viết */}
        <div className="space-y-5 pt-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-6 rounded-full bg-purple-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Kỹ năng Đọc & Viết (Part 1 – Part 9)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rwParts.map((part) => (
              <div
                key={part.partNo}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-100 dark:border-slate-800/80 hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300 ease-in-out flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                      Part {part.partNo}
                    </span>
                    <span className="text-xs text-slate-400">
                      {part.totalItems > 0 ? `${part.totalItems} bài luyện` : "Sắp có"}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white line-clamp-1">
                    {part.titleVi}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                    {part.descriptionVi}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                  <Link
                    href={`/on-luyen/reading_writing/${part.partNo}`}
                    className="w-full min-h-[38px] py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 font-semibold text-xs flex items-center justify-between transition-all duration-300 ease-in-out"
                  >
                    <span>Luyện phần này</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Danh mục chi tiết 5 Part Nghe */}
        <div className="space-y-5 pt-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-6 rounded-full bg-sky-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Kỹ năng Nghe (Part 10 – Part 14)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listeningParts.map((part) => (
              <div
                key={part.partNo}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-100 dark:border-slate-800/80 hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300 ease-in-out flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                      Part {part.partNo}
                    </span>
                    <span className="text-xs text-slate-400">
                      {part.totalItems > 0 ? `${part.totalItems} bài luyện` : "Sắp có"}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white line-clamp-1">
                    {part.titleVi}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                    {part.descriptionVi}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                  <Link
                    href={`/on-luyen/listening/${part.partNo}`}
                    className="w-full min-h-[38px] py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 font-semibold text-xs flex items-center justify-between transition-all duration-300 ease-in-out"
                  >
                    <span>Luyện phần này</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
