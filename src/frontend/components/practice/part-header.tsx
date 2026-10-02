import React from "react";
import Link from "next/link";
import type { PracticePartSummary } from "@/shared/types/practice";
import {
  ChevronRight,
  ArrowLeft,
  Play,
  RotateCcw,
  Target,
  CheckCircle2,
  Sparkles,
  Flame,
} from "lucide-react";

interface PartHeaderProps {
  part: PracticePartSummary;
  firstIncompleteItemId?: string;
}

/**
 * Phần đầu trang chi tiết Part phong cách tươi sáng, hiện đại:
 * Card bo tròn lớn rounded-3xl, shadow êm ái, khối Tiến độ chung bắt mắt với thanh progress bar sinh động,
 * các icon gradient tươi tắn, rực rỡ và dễ nhìn.
 */
export function PartHeader({ part, firstIncompleteItemId }: PartHeaderProps) {
  const skillName = part.skill === "reading_writing" ? "Reading & Writing" : "Listening";
  const skillPath = part.skill;

  // Xác định nhãn và icon cho nút bắt đầu luyện tập
  const isStarted = part.completedItems > 0;
  const isAllCompleted = part.completedItems === part.totalItems && part.totalItems > 0;
  const ctaLabel = isAllCompleted
    ? "Ôn luyện lại"
    : isStarted
    ? "Tiếp tục luyện tập"
    : "Bắt đầu luyện tập";

  const remainingItems = Math.max(0, part.totalItems - part.completedItems);

  return (
    <div className="space-y-4">
      {/* Breadcrumb điều hướng nhẹ nhàng */}
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
        <span className="text-[#0095F6] dark:text-sky-400 font-bold">Part {part.partNo}</span>
      </nav>

      {/* Card chính: Tiêu đề & Tiến độ chung */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-50 dark:bg-sky-950/60 text-[#0095F6] dark:text-sky-400 border border-sky-100 dark:border-sky-900/50">
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

          {/* CTA Nút Bắt đầu luyện tập */}
          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5">
            <Link
              href={`/on-luyen/${skillPath}/${part.partNo}/${firstIncompleteItemId || `p${part.partNo}-bai-1`}`}
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#0095F6] hover:bg-[#008be5] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_3.5px_0_0_#0275ba] active:translate-y-[2px] active:shadow-[0_1px_0_0_#0275ba] transition-all duration-150 select-none cursor-pointer"
            >
              {isAllCompleted ? (
                <RotateCcw className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 fill-white" />
              )}
              <span>{ctaLabel}</span>
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

        {/* Khối Tiến độ chung phong cách hiện đại với icon tươi tắn, bắt mắt */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
          {/* Thanh Tiến độ chung tổng quan với dải gradient sinh động */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50/70 via-blue-50/40 to-indigo-50/50 dark:from-sky-950/25 dark:via-blue-950/15 dark:to-indigo-950/25 border border-sky-100/80 dark:border-sky-900/40 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                {/* Icon Target tươi tắn, rực rỡ */}
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0095F6] via-blue-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-500/25 shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white">
                      Tiến độ chung
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#0095F6]/10 text-[#0095F6] dark:text-sky-400 border border-[#0095F6]/20">
                      Part {part.partNo}
                    </span>
                    {isAllCompleted && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-500" />
                        <span>Đã hoàn thành</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {part.completedItems === 0
                      ? `Chưa hoàn thành bài nào trong ${part.totalItems} bài luyện tập • Bắt đầu ngay hôm nay!`
                      : isAllCompleted
                      ? `Xuất sắc! Bạn đã hoàn thành toàn bộ ${part.totalItems} bài ôn luyện của phần này 🎉`
                      : `Đã làm xong ${part.completedItems}/${part.totalItems} bài ôn luyện • Cố gắng hoàn tất các bài còn lại!`}
                  </p>
                </div>
              </div>

              {/* Phần trăm tiến độ to rõ */}
              <div className="flex items-baseline gap-1.5 self-end sm:self-center shrink-0">
                <span className="text-2xl sm:text-3xl font-black text-[#0095F6] dark:text-sky-400 tracking-tight">
                  {part.progressPercent}%
                </span>
                <span className="text-xs font-semibold text-slate-400">hoàn thành</span>
              </div>
            </div>

            {/* Thanh tiến độ chuyển màu mượt mà */}
            <div className="space-y-1.5">
              <div className="w-full h-3 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#0095F6] via-blue-500 to-emerald-400 transition-all duration-700 ease-out shadow-sm"
                  style={{ width: `${Math.max(part.progressPercent, part.completedItems > 0 ? 5 : 0)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500 px-0.5">
                <span>0 bài</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {part.completedItems > 0
                    ? `Đã hoàn thành ${part.completedItems}/${part.totalItems} bài`
                    : "Chưa hoàn thành bài nào"}
                </span>
                <span>{part.totalItems} bài</span>
              </div>
            </div>
          </div>

          {/* 3 Thẻ chỉ số tươi tắn, bắt mắt và dễ nhìn */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Thẻ 1: Đã hoàn thành */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/60 dark:border-emerald-900/30 hover:shadow-sm transition-all">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Đã hoàn thành
                </p>
                <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 truncate">
                  {part.completedItems} / {part.totalItems} bài
                </p>
              </div>
            </div>

            {/* Thẻ 2: Cần ôn luyện */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100/60 dark:border-sky-900/30 hover:shadow-sm transition-all">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-sky-500/25 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Bài tập cần làm
                </p>
                <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 truncate">
                  {remainingItems} bài chưa làm
                </p>
              </div>
            </div>

            {/* Thẻ 3: Trạng thái ôn tập */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100/60 dark:border-amber-900/30 hover:shadow-sm transition-all">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Trạng thái ôn tập
                </p>
                <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 truncate">
                  {part.completedItems === 0
                    ? "Sẵn sàng ôn luyện"
                    : isAllCompleted
                    ? "Đã hoàn thành 100%"
                    : "Đang ôn luyện"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
