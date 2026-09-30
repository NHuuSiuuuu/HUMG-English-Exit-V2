import React from "react";
import Link from "next/link";
import type { PracticeItemSummary } from "@/shared/types/practice";
import { CheckCircle2, Circle, ArrowRight, RotateCcw } from "lucide-react";

interface PracticeItemCardProps {
  item: PracticeItemSummary;
  viewMode?: "grid" | "list";
}

/**
 * Thẻ bài luyện tập hỗ trợ 2 chế độ hiển thị: Grid (hộp) và List (dòng gọn)
 */
export function PracticeItemCard({ item, viewMode = "grid" }: PracticeItemCardProps) {
  const itemUrl = `/on-luyen/${item.skill}/${item.partNo}/${item.id}`;

  if (viewMode === "list") {
    return (
      <div className="flex items-center justify-between p-3.5 bg-[var(--surface-paper)] border border-[var(--border-subtle)] rounded-lg hover:border-slate-400 transition-all gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {item.isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <Circle className="w-5 h-5 text-slate-400 shrink-0" />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded font-semibold bg-slate-100 dark:bg-slate-800 text-[var(--color-navy)] dark:text-sky-300">
                {item.sourceLabel}
              </span>
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                {item.title}
              </p>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {item.totalQuestions} câu hỏi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {item.isCompleted && item.bestScore !== undefined && (
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              {item.bestScore}%
            </span>
          )}
          <Link
            href={itemUrl}
            className={`min-h-[44px] px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
              item.isCompleted
                ? "border border-[var(--border-subtle)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-primary)]"
                : "bg-[var(--color-navy)] hover:opacity-95 text-white shadow-sm"
            }`}
          >
            {item.isCompleted ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm lại</span>
              </>
            ) : (
              <>
                <span>Làm bài</span>
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
    <div className="bg-[var(--surface-paper)] border border-[var(--border-subtle)] rounded-lg p-5 flex flex-col justify-between hover:border-slate-400 transition-all shadow-sm">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            {item.sourceLabel}
          </span>
          {item.isCompleted ? (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Đã làm ({item.bestScore}%)</span>
            </span>
          ) : (
            <span className="text-xs text-[var(--text-secondary)]">Chưa làm</span>
          )}
        </div>

        <h3 className="text-sm font-bold text-[var(--text-primary)] line-clamp-2 leading-snug">
          {item.title}
        </h3>
        <p className="text-xs text-[var(--text-secondary)]">
          Gồm {item.totalQuestions} câu hỏi trắc nghiệm
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--text-secondary)]">
          Bộ đề: {item.groupSet}
        </span>
        <Link
          href={itemUrl}
          className={`min-h-[44px] px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
            item.isCompleted
              ? "border border-[var(--border-subtle)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-primary)]"
              : "bg-[var(--color-navy)] hover:opacity-95 text-white shadow-sm"
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
