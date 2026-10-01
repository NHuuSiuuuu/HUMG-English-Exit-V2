"use client";

import React from "react";
import type { PartForExamRoom } from "@/shared/types/attempt";
import type { QuestionGroupDef, QuestionType } from "@/shared/types/question";
import { QuestionRendererDispatcher } from "@/frontend/components/practice/questions/question-renderer-dispatcher";
import { AudioPlayerListening } from "@/frontend/components/practice/audio-player-listening";
import { CheckCircle2, Headphones, BookOpen } from "lucide-react";

interface ExamPartCardProps {
  part: PartForExamRoom;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
}

/**
 * Thẻ hiển thị một Part trong phòng thi 14 phần
 * Cuộn liên tục, bao gồm tiêu đề, ví dụ, trình nghe audio Listening và câu hỏi
 */
export function ExamPartCard({
  part,
  answers,
  onAnswerChange,
}: ExamPartCardProps) {
  const group = part.questionGroup;
  const isListening = part.partNo >= 10 || part.skill === "LISTENING";

  const totalQuestions = group.questions.length;
  const answeredCount = group.questions.filter(
    (q) => (answers[q.id] || "").trim().length > 0
  ).length;

  // Chuẩn hóa sang định dạng QuestionGroupDef để dùng lại bộ renderer câu hỏi
  const normalizedType: QuestionType = (
    group.type.toLowerCase() === "mcq3_image"
      ? "mcq3_image"
      : group.type.toLowerCase() === "match_pool"
      ? "match_pool"
      : group.type.toLowerCase() === "cloze_mcq"
      ? "cloze_mcq"
      : group.type.toLowerCase() === "short_text"
      ? "short_text"
      : group.type.toLowerCase() === "writing"
      ? "writing"
      : "mcq3"
  ) as QuestionType;

  // Chuẩn hóa poolOptions nếu là record { A: "text" }
  const poolOptionsList = group.poolOptions
    ? Object.entries(group.poolOptions).map(([letter, text]) => ({
        letter,
        text: String(text),
      }))
    : undefined;

  const questionGroupDef: QuestionGroupDef = {
    id: group.id,
    type: normalizedType,
    title: part.title,
    instruction: part.instructions,
    passageText: group.passageText || undefined,
    passageImageUrl: group.passageImageUrl || undefined,
    audioUrl: group.audioUrl || undefined,
    poolOptions: poolOptionsList,
    writingRequirements: group.writingRequirements || undefined,
    minWords: group.minWords || 25,
    maxWords: group.maxWords || 35,
    example: part.exampleRow
      ? {
          question: part.exampleRow.prompt || "",
          correctAnswer: part.exampleRow.answer || "",
          explanation: part.exampleRow.explanation || "",
        }
      : undefined,
    items: group.questions.map((q) => {
      // Chuẩn hóa options từ record { A: "text" } sang array [{ label, text }]
      let optionsArray = undefined;
      if (q.options && typeof q.options === "object") {
        optionsArray = Object.entries(q.options).map(([label, text]) => ({
          label,
          text: String(text),
        }));
      }

      return {
        id: q.id,
        orderNumber: q.orderNumber,
        prompt: q.prompt,
        options: optionsArray,
        firstLetterHint: q.firstLetterHint || undefined,
        charCountHint: q.charCountHint || undefined,
        formFieldLabel: q.formFieldLabel || undefined,
      };
    }),
  };

  return (
    <section
      id={`part-${part.partNo}`}
      className="scroll-mt-28 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] border border-slate-200/80 dark:border-slate-800 space-y-6"
    >
      {/* Header của Part */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-sm ${
              isListening ? "bg-sky-500 shadow-sky-200" : "bg-purple-600 shadow-purple-200"
            }`}
          >
            {part.partNo}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Phần {part.partNo} / 14
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {part.sourceLabel}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {isListening ? (
                <Headphones className="w-4 h-4 text-sky-500 inline-block" />
              ) : (
                <BookOpen className="w-4 h-4 text-purple-600 inline-block" />
              )}
              {part.title}
            </h2>
          </div>
        </div>

        {/* Tiến độ của Part */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300">
          <CheckCircle2
            className={`w-4 h-4 ${
              answeredCount >= totalQuestions && totalQuestions > 0
                ? "text-emerald-500"
                : "text-slate-400"
            }`}
          />
          <span>
            Đã làm: {answeredCount}/{totalQuestions} câu
          </span>
        </div>
      </div>

      {/* Dòng ví dụ (câu 0) theo PRD 3.4 */}
      {part.exampleRow && (
        <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs sm:text-[13px] text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
          <span className="font-bold px-2 py-0.5 rounded bg-amber-500 text-white text-[10px] tracking-wide uppercase mt-0.5">
            Example 0
          </span>
          <div className="space-y-1">
            <p className="font-medium">{part.exampleRow.prompt}</p>
            <p className="font-bold text-emerald-600 dark:text-emerald-400">
              Đáp án mẫu: {part.exampleRow.answer} ✓
              {part.exampleRow.explanation && (
                <span className="font-normal text-slate-500 dark:text-slate-400 ml-1.5">
                  ({part.exampleRow.explanation})
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Hướng dẫn làm bài */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal border border-slate-100 dark:border-slate-800/60">
        <span className="font-bold text-slate-800 dark:text-slate-100 mr-1.5">
          Directions:
        </span>
        {part.instructions}
      </div>

      {/* Trình phát âm thanh cho Listening */}
      {group.audioUrl && (
        <AudioPlayerListening
          audioUrl={group.audioUrl}
          isGraded={false}
        />
      )}

      {/* Nội dung câu hỏi theo đúng dạng renderer */}
      <div className="pt-2">
        <QuestionRendererDispatcher
          questionGroup={questionGroupDef}
          answers={answers}
          onAnswerChange={onAnswerChange}
          isGraded={false}
        />
      </div>
    </section>
  );
}
