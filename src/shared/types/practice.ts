import type { QuestionGroupDef, QuestionType } from "./question";

export interface PracticePartSummary {
  partNo: number;
  skill: "reading_writing" | "listening";
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  questionType: string;
  totalItems: number;
  completedItems: number;
  progressPercent: number;
  averageScorePercent?: number;
}

export interface PracticeItemSummary {
  id: string;
  partNo: number;
  skill: "reading_writing" | "listening";
  title: string;
  sourceLabel: string; // Ví dụ: "KET 5 · Test 3" hoặc "Đề 01"
  groupSet: string;    // Ví dụ: "KET 5", "KET 2", "Bộ đề 2026"
  isCompleted: boolean;
  bestScore?: number;  // Điểm tốt nhất (%) nếu đã làm
  totalQuestions: number;
}

export interface PracticeItemDetail {
  id: string;
  partNo: number;
  skill: "reading_writing" | "listening";
  title: string;
  sourceLabel: string;
  groupSet: string;
  questionGroup: QuestionGroupDef;
}

export interface PracticeAnswerSubmission {
  itemId: string;
  answers: Record<string, string>; // { [questionId]: "A" | "text" }
}

export interface QuestionGradingDetail {
  questionId: string;
  userAnswer?: string;
  correctAnswer: string | string[];
  isCorrect: boolean;
  explanation: string;
}

export interface PracticeGradeResult {
  itemId: string;
  totalQuestions: number;
  correctCount: number;
  scorePercent: number;
  details: QuestionGradingDetail[];
  transcript?: string;
  sampleWriting?: string;
}
