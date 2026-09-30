import React from "react";
import Link from "next/link";
import type { PracticeItemSummary } from "@/shared/types/practice";
import { CheckCircle2, Circle, ArrowRight, RotateCcw } from "lucide-react";

interface PracticeItemCardProps {
  item: PracticeItemSummary;
  viewMode?: "grid" | "list";
}

/**
 * Thẻ bài luyện tập phong cách TADR OU:
 * Bo tròn lớn rounded-2xl, shadow mềm, viền siêu mờ, nút bấm màu xanh tươi rực rỡ
 */
export function PracticeItemCard({ item, viewMode = "grid" }: PracticeItemCardProps) {
  const itemUrl = `/on-luyen/${item.skill}/${item.partNo}/${item.id}`;

  if (viewMode === "list") {
    return (
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300 ease-in-out gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          {item.isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                {item.sourceLabel}
              </span>
              <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                {item.title}
              </p>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {item.totalQuestions} câu hỏi trắc nghiệm
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {item.isCompleted && item.bestScore !== undefined && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              {item.bestScore}%
            </span>
          )}
          <Link
            href={itemUrl}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 ease-in-out ${
              item.isCompleted
                ? "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 text-slate-700 dark:text-slate-200"
                : "bg-[#0095F6] hover:bg-sky-600 text-white shadow-[0_2px_8px_rgba(0,149,246,0.25)]"
            }`}
          >
            {item.isCompleted ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm lại</span>
              </>
            ) : (
              <>
                <span>Bắt đầu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </Link>
        </div>
      </div>
    );
  }

  // Chế độ Grid (Mặc định)
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 flex flex-col justify-between hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 ease-in-out border border-slate-100 dark:border-slate-800/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
            {item.sourceLabel}
          </span>
          {item.isCompleted ? (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{item.bestScore}%</span>
            </span>
          ) : (
            <span className="text-xs text-slate-400 font-medium">Chưa làm</span>
          )}
        </div>

        <h3 className="text-sm font-bold text-slate-800 dark:text-white line-clamp-2 leading-snug">
          {item.title}
        </h3>
        <p className="text-xs text-slate-400 font-normal">
          Gồm {item.totalQuestions} câu hỏi trắc nghiệm
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">
          {item.groupSet}
        </span>
        <Link
          href={itemUrl}
          className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 ease-in-out ${
            item.isCompleted
              ? "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 text-slate-700 dark:text-slate-200"
              : "bg-[#0095F6] hover:bg-sky-600 text-white shadow-[0_2px_8px_rgba(0,149,246,0.25)]"
          }`}
        >
          {item.isCompleted ? (
            <>
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm lại</span>
            </>
          ) : (
            <>
              <span>Bắt đầu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </Link>
      </div>
    </div>
  );
}
