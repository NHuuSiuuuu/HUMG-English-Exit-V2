"use client";

import React, { useMemo } from "react";
import type { QuestionGroupDef } from "@/shared/types/question";
import type { QuestionGradingDetail } from "@/shared/types/practice";
import { CheckCircle2, AlertTriangle, Sparkles, Mail, Check, AlertCircle } from "lucide-react";

interface WritingRendererProps {
  group: QuestionGroupDef;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
  isGraded?: boolean;
  gradingDetails?: Record<string, QuestionGradingDetail>;
  sampleWriting?: string;
}

/**
 * Hàm đếm từ chuẩn tiếng Anh tại client phục vụ cập nhật UI đếm từ thời gian thực
 */
function clientWordCount(text: string): number {
  if (!text || typeof text !== "string") return 0;
  const trimmed = text.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

/**
 * Renderer cho Part 9 Writing (Viết ghi chú/email 25–35 từ)
 */
export function WritingRenderer({
  group,
  answers,
  onAnswerChange,
  isGraded = false,
  gradingDetails = {},
  sampleWriting,
}: WritingRendererProps) {
  const item = group.items[0];
  const questionId = item ? item.id : "q56";
  const userText = answers[questionId] || "";
  const wordCount = useMemo(() => clientWordCount(userText), [userText]);

  const minWords = group.minWords || 25;
  const maxWords = group.maxWords || 35;

  // Trạng thái đếm từ
  let statusColor = "text-amber-600 dark:text-amber-400";
  let statusBadge = "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800";
  let statusMessage = `Cần viết thêm (hiện có ${wordCount} từ, tối thiểu ${minWords} từ)`;

  if (wordCount >= minWords && wordCount <= maxWords) {
    statusColor = "text-emerald-600 dark:text-emerald-400";
    statusBadge = "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800";
    statusMessage = `Độ dài đạt chuẩn (${wordCount}/${minWords}–${maxWords} từ)`;
  } else if (wordCount > maxWords) {
    statusColor = "text-yellow-600 dark:text-yellow-400";
    statusBadge = "bg-yellow-50 dark:bg-yellow-950/40 border-yellow-300 dark:border-yellow-800";
    statusMessage = `Hơi dài (${wordCount} từ, khuyến nghị từ ${minWords} đến ${maxWords} từ)`;
  }

  return (
    <div className="space-y-6">
      {/* Khối hướng dẫn */}
      <div className="bg-[var(--surface-paper)] border border-[var(--border-subtle)] rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium text-[var(--text-primary)] leading-relaxed">
          {group.instruction}
        </p>
      </div>

      {/* Bố cục 2 cột: Cột trái đề bài & 3 gợi ý, Cột phải ô viết bài */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Đề bài (Email/Note nhận được) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[var(--surface-paper)] border border-[var(--border-subtle)] rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3 pb-2 border-b border-[var(--border-subtle)]">
              <Mail className="w-4 h-4 text-sky-500" />
              <span>Thư / Tin nhắn nhận được</span>
            </div>
            <div className="bg-[var(--surface-bg)] border border-[var(--border-subtle)] rounded p-3 text-xs sm:text-sm font-mono leading-relaxed whitespace-pre-line text-[var(--text-primary)]">
              {group.passageText}
            </div>
          </div>

          {/* 3 ý bắt buộc cần nêu */}
          {group.writingRequirements && group.writingRequirements.length > 0 && (
            <div className="bg-[var(--surface-paper)] border border-[var(--border-subtle)] rounded-lg p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-navy)] dark:text-sky-300 mb-2.5">
                3 ý bắt buộc cần trả lời trong bài viết:
              </h4>
              <ul className="space-y-2">
                {group.writingRequirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[var(--text-primary)]">
                    <span className="w-4 h-4 shrink-0 rounded-full bg-sky-100 dark:bg-sky-900/40 text-[var(--color-navy)] dark:text-sky-300 flex items-center justify-center font-bold text-[10px] mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Khung soạn thảo bài viết */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[var(--surface-paper)] border border-[var(--border-subtle)] rounded-lg p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label
                htmlFor="writing-textarea"
                className="font-bold text-sm text-[var(--color-navy)] dark:text-sky-300"
              >
                Bài viết của bạn:
              </label>
              {/* Huy hiệu đếm từ trực tiếp */}
              <div
                className={`px-3 py-1 rounded border text-xs font-semibold flex items-center gap-1.5 transition-all ${statusBadge} ${statusColor}`}
              >
                {wordCount >= minWords && wordCount <= maxWords ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                <span>{statusMessage}</span>
              </div>
            </div>

            <textarea
              id="writing-textarea"
              rows={8}
              disabled={isGraded}
              value={userText}
              onChange={(e) => onAnswerChange(questionId, e.target.value)}
              placeholder="Viết câu trả lời của bạn bằng tiếng Anh vào đây (ví dụ: Hi Alex, Let's meet...)..."
              className="w-full p-3.5 rounded border border-[var(--border-subtle)] bg-[var(--surface-bg)] text-sm text-[var(--text-primary)] leading-relaxed focus:border-[var(--color-navy)] focus:ring-1 focus:ring-[var(--color-navy)] outline-none resize-y min-h-[160px]"
            />

            <div className="text-xs text-[var(--text-secondary)] flex items-center justify-between">
              <span>Độ dài quy định: {minWords} – {maxWords} từ</span>
              <span>Tổng số từ hiện tại: <strong>{wordCount}</strong></span>
            </div>
          </div>

          {/* Sau khi nộp bài: Hiển thị bài mẫu và hướng dẫn đối chiếu */}
          {isGraded && (sampleWriting || group.sampleWriting) && (
            <div className="p-4 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Bài viết mẫu tham khảo (Sample Answer)</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 rounded p-3 text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-line text-slate-800 dark:text-slate-200">
                {sampleWriting || group.sampleWriting}
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Lưu ý: Đối chiếu xem bài làm của bạn đã trả lời đầy đủ 3 ý gợi ý và dùng đúng ngữ pháp thì tương lai/lời mời hay chưa.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
