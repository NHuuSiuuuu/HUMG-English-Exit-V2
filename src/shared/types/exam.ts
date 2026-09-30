export type ExamStatus = "DRAFT" | "PUBLISHED";

export interface ExamPartAssignment {
  partNo: number;
  partId: string;
}

export interface CreateExamInput {
  code: string;
  title: string;
  description?: string | null;
  durationMinutes?: number;
  difficulty?: string;
  status: ExamStatus;
  partSelections: ExamPartAssignment[];
}

export interface UpdateExamInput extends Partial<CreateExamInput> {
  id: string;
}

export interface ExamListItemDTO {
  id: string;
  code: string;
  title: string;
  description?: string | null;
  durationMinutes: number;
  difficulty: string;
  status: ExamStatus;
  partsCount: number;
  totalQuestions: number;
  attemptsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExamDetailPartDTO {
  id: string;
  partId: string;
  partNo: number;
  title: string;
  sourceLabel: string;
  skill: string;
  totalQuestions: number;
  passageText?: string | null;
  passageImageUrl?: string | null;
  audioUrl?: string | null;
}

export interface ExamDetailDTO {
  id: string;
  code: string;
  title: string;
  description?: string | null;
  durationMinutes: number;
  difficulty: string;
  status: ExamStatus;
  attemptsCount: number;
  createdAt: string;
  updatedAt: string;
  parts: ExamDetailPartDTO[];
}

export interface ExamStatsDTO {
  total: number;
  published: number;
  draft: number;
  totalAttempts: number;
}

export interface ExamCompletenessIssue {
  field: string;
  message: string;
  severity: "error" | "warning";
}
