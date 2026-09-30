"use client";

import React from "react";
import type { QuestionGroupDef } from "@/shared/types/question";
import type { PracticeGradeResult, QuestionGradingDetail } from "@/shared/types/practice";
import { MatchPoolRenderer } from "./match-pool-renderer";
import { Mcq3Renderer } from "./mcq3-renderer";
import { Mcq3ImageRenderer } from "./mcq3-image-renderer";
import { ClozeMcqRenderer } from "./cloze-mcq-renderer";
import { ShortTextRenderer } from "./short-text-renderer";
import { WritingRenderer } from "./writing-renderer";

interface QuestionRendererDispatcherProps {
  questionGroup: QuestionGroupDef;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
  isGraded?: boolean;
  gradeResult?: PracticeGradeResult | null;
}

/**
 * Dispatcher điều phối hiển thị đúng Renderer tương ứng với dạng câu hỏi của Part
 */
export function QuestionRendererDispatcher({
  questionGroup,
  answers,
  onAnswerChange,
  isGraded = false,
  gradeResult = null,
}: QuestionRendererDispatcherProps) {
  // Bản đồ chi tiết chấm điểm theo id câu hỏi
  const gradingDetailsMap: Record<string, QuestionGradingDetail> = {};
  if (gradeResult?.details) {
    for (const d of gradeResult.details) {
      gradingDetailsMap[d.questionId] = d;
    }
  }

  switch (questionGroup.type) {
    case "match_pool":
      return (
        <MatchPoolRenderer
          group={questionGroup}
          answers={answers}
          onAnswerChange={onAnswerChange}
          isGraded={isGraded}
          gradingDetails={gradingDetailsMap}
        />
      );

    case "mcq3":
      return (
        <Mcq3Renderer
          group={questionGroup}
          answers={answers}
          onAnswerChange={onAnswerChange}
          isGraded={isGraded}
          gradingDetails={gradingDetailsMap}
        />
      );

    case "mcq3_image":
      return (
        <Mcq3ImageRenderer
          group={questionGroup}
          answers={answers}
          onAnswerChange={onAnswerChange}
          isGraded={isGraded}
          gradingDetails={gradingDetailsMap}
        />
      );

    case "cloze_mcq":
      return (
        <ClozeMcqRenderer
          group={questionGroup}
          answers={answers}
          onAnswerChange={onAnswerChange}
          isGraded={isGraded}
          gradingDetails={gradingDetailsMap}
        />
      );

    case "short_text":
      return (
        <ShortTextRenderer
          group={questionGroup}
          answers={answers}
          onAnswerChange={onAnswerChange}
          isGraded={isGraded}
          gradingDetails={gradingDetailsMap}
        />
      );

    case "writing":
      return (
        <WritingRenderer
          group={questionGroup}
          answers={answers}
          onAnswerChange={onAnswerChange}
          isGraded={isGraded}
          gradingDetails={gradingDetailsMap}
          sampleWriting={gradeResult?.sampleWriting}
        />
      );

    default:
      return (
        <Mcq3Renderer
          group={questionGroup}
          answers={answers}
          onAnswerChange={onAnswerChange}
          isGraded={isGraded}
          gradingDetails={gradingDetailsMap}
        />
      );
  }
}
