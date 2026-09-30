import React from "react";
import Link from "next/link";
import type { PracticePartSummary } from "@/shared/types/practice";
import { ChevronRight, ArrowLeft, Play, CheckCircle2, TrendingUp, BookOpen } from "lucide-react";

interface PartHeaderProps {
  part: PracticePartSummary;
  firstIncompleteItemId?: string;
}

/**
 * Phần đầu trang chi tiết Part: Breadcrumbs, Tiêu đề, Mô tả, 3 chỉ số tiến độ và CTA
 */
export function PartHeader({ part, firstIncompleteItemId }: PartHeaderProps) {
  const skillName = part.skill === "reading_writing" ? "Reading & Writing" : "Listening";
  const skillPath = part.skill;

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] flex-wrap">
        <Link href="/" className="hover:text-[var(--text-primary)]">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/on-luyen" className="hover:text-[var(--text-primary)]">
          Ôn luyện
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[var(--text-primary)] font-medium">{skillName}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[var(--color-navy)] dark:text-sky-400 font-bold">
          Part {part.partNo}
        </span>
      </nav>

      {/* Khối chính tiêu đề & tiến độ */}
      <div className="bg-[var(--surface-paper)] border border-[var(--border-subtle)] rounded-lg p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-[var(--color-navy)] text-white">
                Part {part.partNo}
              </span>
              <span className="text-xs font-semibold text-[var(--text-secondary)]">
                {skillName}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--color-navy)] dark:text-white">
              {part.titleVi}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {part.descriptionVi}
            </p>
          </div>

          {/* CTA Nút Luyện bài kế tiếp */}
          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2">
            <Link
              href={`/on-luyen/${skillPath}/${part.partNo}/${firstIncompleteItemId || `p${part.partNo}-bai-1`}`}
              className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[var(--color-navy)] hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Bắt đầu luyện tập</span>
            </Link>
            <Link
              href="/on-luyen"
              className="min-h-[44px] px-4 py-2.5 rounded-lg border border-[var(--border-subtle)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-primary)] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Chọn phần khác</span>
            </Link>
          </div>
        </div>

        {/* 3 Chỉ số tiến độ cá nhân */}
        <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Đã hoàn thành</p>
              <p className="text-base font-bold text-[var(--text-primary)]">
                {part.completedItems} / {part.totalItems} bài
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Tiến độ bài học</p>
              <p className="text-base font-bold text-[var(--text-primary)]">
                {part.progressPercent}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Điểm trung bình</p>
              <p className="text-base font-bold text-[var(--text-primary)]">
                {part.averageScorePercent ? `${part.averageScorePercent}%` : "Chưa có"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
