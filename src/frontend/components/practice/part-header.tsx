import React from "react";
import Link from "next/link";
import type { PracticePartSummary } from "@/shared/types/practice";
import { ChevronRight, ArrowLeft, Play, CheckCircle2, TrendingUp, BookOpen } from "lucide-react";

interface PartHeaderProps {
  part: PracticePartSummary;
  firstIncompleteItemId?: string;
}

/**
 * Phần đầu trang chi tiết Part phong cách TADR OU:
 * Card bo tròn lớn rounded-3xl, shadow êm ái, màu sắc tươi sáng, nút bấm tròn mềm
 */
export function PartHeader({ part, firstIncompleteItemId }: PartHeaderProps) {
  const skillName = part.skill === "reading_writing" ? "Reading & Writing" : "Listening";
  const skillPath = part.skill;

  return (
    <div className="space-y-4">
      {/* Breadcrumb nhẹ nhàng */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 flex-wrap">
        <Link href="/" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/on-luyen" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
          Ôn luyện
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-600 dark:text-slate-300 font-medium">{skillName}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-sky-600 dark:text-sky-400 font-bold">Part {part.partNo}</span>
      </nav>

      {/* Card chính tiêu đề & tiến độ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/50">
                Part {part.partNo}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {skillName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {part.titleVi}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              {part.descriptionVi}
            </p>
          </div>

          {/* CTA Nút Luyện bài kế tiếp phong cách TADR OU */}
          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5">
            <Link
              href={`/on-luyen/${skillPath}/${part.partNo}/${firstIncompleteItemId || `p${part.partNo}-bai-1`}`}
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#0095F6] hover:bg-[#008be5] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_3.5px_0_0_#0275ba] active:translate-y-[2px] active:shadow-[0_1px_0_0_#0275ba] transition-all duration-150 select-none cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Bắt đầu luyện tập</span>
            </Link>
            <Link
              href="/on-luyen"
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_3px_0_0_#cbd5e1] dark:shadow-[0_3px_0_0_#334155] active:translate-y-[2px] active:shadow-[0_1px_0_0_#cbd5e1] transition-all duration-150 select-none cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Chọn phần khác</span>
            </Link>
          </div>
        </div>

        {/* 3 Chỉ số tiến độ cá nhân dạng Card nhỏ pastel */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/60 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Đã hoàn thành</p>
              <p className="text-base font-bold text-slate-800 dark:text-white">
                {part.completedItems} / {part.totalItems} bài
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Tiến độ bài học</p>
              <p className="text-base font-bold text-slate-800 dark:text-white">
                {part.progressPercent}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Điểm trung bình</p>
              <p className="text-base font-bold text-slate-800 dark:text-white">
                {part.averageScorePercent ? `${part.averageScorePercent}%` : "Chưa có"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
