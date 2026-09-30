"use client";

import React, { useMemo } from "react";
import type { QuestionGroupDef } from "@/shared/types/question";
import type { QuestionGradingDetail } from "@/shared/types/practice";
import { Sparkles, Mail, Check, AlertCircle } from "lucide-react";

interface WritingRendererProps {
  group: QuestionGroupDef;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
  isGraded?: boolean;
  gradingDetails?: Record<string, QuestionGradingDetail>;
  sampleWriting?: string;
}

function clientWordCount(text: string): number {
  if (!text || typeof text !== "string") return 0;
  const trimmed = text.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

/**
 * Renderer cho Part 9 Writing phong cách TADR OU:
 * Khung viết bài bo tròn lớn rounded-2xl, pill đếm từ mềm mại, checklist pastel
 */
export function WritingRenderer({
  group,
  answers,
  onAnswerChange,
  isGraded = false,
  sampleWriting,
}: WritingRendererProps) {
  const item = group.items[0];
  const questionId = item ? item.id : "q56";
  const userText = answers[questionId] || "";
  const wordCount = useMemo(() => clientWordCount(userText), [userText]);

  const minWords = group.minWords || 25;
  const maxWords = group.maxWords || 35;

  let statusBadge = "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400";
  let statusMessage = `Cần viết thêm (${wordCount}/${minWords} từ)`;

  if (wordCount >= minWords && wordCount <= maxWords) {
    statusBadge = "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400";
    statusMessage = `Độ dài đạt chuẩn (${wordCount} từ)`;
  } else if (wordCount > maxWords) {
    statusBadge = "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400";
    statusMessage = `Hơi dài (${wordCount} từ, tối đa ${maxWords})`;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Đề bài (Email/Note nhận được) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
            <Mail className="w-4 h-4 text-sky-500" />
            <span>Thư / Tin nhắn nhận được</span>
          </div>
          <div className="text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-200">
            {group.passageText}
          </div>
        </div>

        {/* 3 ý bắt buộc cần nêu */}
        {group.writingRequirements && group.writingRequirements.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              3 ý bắt buộc cần trả lời:
            </h4>
            <ul className="space-y-2">
              {group.writingRequirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <span className="w-4 h-4 shrink-0 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 flex items-center justify-center font-bold text-[10px] mt-0.5">
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label
              htmlFor="writing-textarea"
              className="font-bold text-sm text-slate-800 dark:text-slate-100"
            >
              Bài viết của bạn:
            </label>
            {/* Huy hiệu đếm từ pill */}
            <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${statusBadge}`}>
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
            className="w-full p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 text-sm text-slate-800 dark:text-slate-100 leading-relaxed focus:bg-white focus:border-[#0095F6] focus:ring-2 focus:ring-sky-100 outline-none resize-y min-h-[160px] transition-all"
          />

          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Quy định: {minWords} – {maxWords} từ</span>
            <span>Hiện tại: <strong className="text-slate-700 dark:text-slate-200">{wordCount} từ</strong></span>
          </div>
        </div>

        {/* Bài mẫu sau khi nộp */}
        {isGraded && (sampleWriting || group.sampleWriting) && (
          <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Bài viết mẫu tham khảo (Sample Answer)</span>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-line text-slate-800 dark:text-slate-200 border border-emerald-100 dark:border-emerald-900/40 shadow-sm">
              {sampleWriting || group.sampleWriting}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
