import type { SkillType, PartStatus, QuestionType } from "@prisma/client";

export interface PoolOptionDef {
  letter: string; // "A" - "H"
  text: string;   // Nội dung biển báo hoặc lý do
}

export interface QuestionOptionDef {
  key: string;      // "A", "B", "C"
  text: string;     // Văn bản lựa chọn
  imageUrl?: string; // Dành cho câu hỏi dạng tranh (Part 10)
}

export interface QuestionInputItem {
  id?: string;
  orderNumber: number;
  prompt: string;
  options?: QuestionOptionDef[];
  correctAnswer: string;
  acceptedAnswers?: string[];
  explanation?: string;
  firstLetterHint?: string;
  charCountHint?: number;
  formFieldLabel?: string;
}

export interface ExampleRowDef {
  question: string;
  correctAnswer: string;
  explanation?: string;
}

export interface CreatePartInput {
  partNo: number;
  skill: SkillType;
  questionType: QuestionType;
  title: string;
  sourceLabel: string;
  groupSet: string;
  instructions: string;
  exampleRow?: ExampleRowDef | null;
  difficulty?: string;
  status: PartStatus;
  
  // Stimulus / Tư liệu bài thi
  passageText?: string | null;
  passageImageUrl?: string | null;
  audioUrl?: string | null;
  maxPlays?: number;
  transcript?: string | null;
  poolOptions?: PoolOptionDef[] | null;
  writingRequirements?: string[] | null;
  minWords?: number;
  maxWords?: number;
  sampleWriting?: string | null;

  // Danh sách câu hỏi
  questions: QuestionInputItem[];
}

export interface PartCompletenessIssue {
  field: string;
  message: string;
  severity: "error" | "warning";
}

export interface PartFilterOptions {
  skill?: SkillType;
  partNo?: number;
  status?: PartStatus;
  search?: string;
}

export interface PartListItemDTO {
  id: string;
  partNo: number;
  skill: SkillType;
  title: string;
  sourceLabel: string;
  groupSet: string;
  difficulty: string;
  status: PartStatus;
  createdAt: string;
  updatedAt: string;
  questionType: QuestionType;
  totalQuestions: number;
}

export interface PartBankStatsDTO {
  totalParts: number;
  publishedCount: number;
  draftCount: number;
  coveredPartTypesCount: number;
  countsByPartNo: Record<number, number>;
}

