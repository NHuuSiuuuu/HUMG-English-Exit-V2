"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Award, ShieldCheck, CheckCircle2, Sparkles, BookOpen } from "lucide-react";
import { useLanguage } from "@/frontend/providers/language-provider";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-transparent py-12 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Cột trái: Nội dung Hero */}
          <div className="flex flex-col items-start lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 py-1 px-3.5 rounded-full text-xs sm:text-sm font-semibold bg-sky-50 dark:bg-sky-950/60 text-[#0095F6] dark:text-sky-300 border border-sky-100 dark:border-sky-900/50 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#0095F6]" />
              <span>{t("landing.hero.badge", "Đề thi chuẩn Cambridge KET (A2 Key)")}</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-5xl leading-[1.15] text-slate-900 dark:text-white">
              {t("landing.hero.title", "Chinh phục chuẩn đầu ra Tiếng Anh HUMG tự tin & hiệu quả")}
            </h1>

            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed font-normal">
              {t(
                "landing.hero.subtitle",
                "Nền tảng ôn luyện bám sát 14 dạng bài thi chuẩn đầu ra Trường Đại học Mỏ - Địa chất. Luyện tập theo từng kỹ năng, thi thử 60 phút mô phỏng áp lực thực tế và tra cứu kết quả nhanh chóng."
              )}
            </p>

            {/* Hàng CTA: Nút 3D xúc giác hiện đại (3D Tactile Pushable Buttons) */}
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3.5 pt-2">
              <Link
                href="/on-luyen"
                className="w-full sm:w-auto min-h-[52px] px-7 py-3 rounded-2xl bg-[#0095F6] hover:bg-[#008be5] text-white font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-[0_4px_0_0_#0275ba] active:translate-y-[2px] active:shadow-[0_2px_0_0_#0275ba] transition-all duration-150 select-none cursor-pointer"
              >
                <BookOpen className="h-5 w-5" />
                <span>Bắt đầu ôn luyện</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/thi-thu"
                className="w-full sm:w-auto min-h-[52px] px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border-2 border-[#0095F6] dark:border-sky-400 text-[#0095F6] dark:text-sky-400 font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-[0_4px_0_0_#0095F6] dark:shadow-[0_4px_0_0_#38bdf8] hover:bg-sky-50/40 dark:hover:bg-sky-950/30 active:translate-y-[2px] active:shadow-[0_2px_0_0_#0095F6] transition-all duration-150 select-none cursor-pointer"
              >
                <Clock className="h-5 w-5 text-[#0095F6]" />
                <span>Thi thử 60 phút</span>
              </Link>
              <Link
                href="/tra-cuu"
                className="w-full sm:w-auto min-h-[52px] px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-[0_3.5px_0_0_#cbd5e1] dark:shadow-[0_3.5px_0_0_#334155] hover:bg-slate-50 dark:hover:bg-slate-800 active:translate-y-[2px] active:shadow-[0_1.5px_0_0_#cbd5e1] transition-all duration-150 select-none cursor-pointer"
              >
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <span>Tra cứu điểm CFI</span>
              </Link>
            </div>

            {/* 3 Cam kết uy tín */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>14 Part chuẩn Cambridge KET</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Đồng hồ đếm ngược server 60 phút</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Tự động lưu nháp liên tục</span>
              </div>
            </div>
          </div>

          {/* Cột phải: Mockup bài thi KET bo tròn lớn rounded-3xl */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md rounded-3xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-[0_10px_35px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_-4px_rgba(0,0,0,0.09)] transition-all duration-300 ease-in-out">
              {/* Header của thẻ Mockup */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-sm text-slate-800 dark:text-white">
                    Đề thi thử chuẩn số 01
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 px-3 py-1 text-xs font-mono font-bold text-[#0095F6] dark:text-sky-300">
                  <Clock className="h-3.5 w-3.5" />
                  <span>60:00</span>
                </div>
              </div>

              {/* Tiến độ & Phần thi */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    Phần 1/14: Biển báo & Thông báo
                  </span>
                  <span>18/75 câu</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full w-[24%] rounded-full bg-[#0095F6] transition-all duration-500" />
                </div>
              </div>

              {/* Câu hỏi mẫu minh họa phong cách TADR OU */}
              <div className="mt-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 p-4 space-y-3 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                    Question 01 · Signs
                  </span>
                  <span className="text-[11px] text-sky-600 dark:text-sky-400 font-bold">1 point</span>
                </div>

                <div className="rounded-xl border border-slate-200/70 bg-white p-3 text-slate-900 shadow-sm text-center">
                  <p className="font-bold text-xs uppercase tracking-wide text-rose-600">NOTICE</p>
                  <p className="font-semibold text-xs sm:text-sm mt-0.5">NO MOBILE PHONES IN READING ROOM</p>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Where can you see this notice?
                </p>

                {/* Các phương án A, B, C - Dùng border-2 đồng nhất để không bị giật */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 rounded-xl border border-[#0095F6] ring-2 ring-[#0095F6]/20 bg-sky-50/40 dark:bg-sky-950/30 p-2.5 text-[#0095F6] font-semibold transition-all duration-300 ease-in-out">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>A. In a library</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-100 dark:border-slate-800 hover:ring-2 hover:ring-slate-200 dark:hover:ring-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-600 dark:text-slate-300 transition-all duration-300 ease-in-out">
                    <span className="h-3.5 w-3.5 rounded-full border border-slate-300 inline-block shrink-0" />
                    <span>B. On a train</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-100 dark:border-slate-800 hover:ring-2 hover:ring-slate-200 dark:hover:ring-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-600 dark:text-slate-300 transition-all duration-300 ease-in-out">
                    <span className="h-3.5 w-3.5 rounded-full border border-slate-300 inline-block shrink-0" />
                    <span>C. In a museum</span>
                  </div>
                </div>
              </div>

              {/* Chân card mockup */}
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-emerald-500">
                  <Award className="h-3.5 w-3.5" />
                  <span>Chấm tự động tức thì</span>
                </span>
                <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  Server Time Sync
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
