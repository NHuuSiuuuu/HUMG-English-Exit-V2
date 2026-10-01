/**
 * DTO và Type cho chức năng thi thử và chấm điểm (AGENTS.md & PRD.md)
 */

export type AttemptStatus = "IN_PROGRESS" | "COMPLETED" | "EXPIRED";

export type ExamAnswersMap = Record<string, string>;

/**
 * Câu hỏi được gửi xuống phòng thi (BẢO MẬT: TUYỆT ĐỐI KHÔNG CÓ ĐÁP ÁN ĐÚNG HOẶC LỜI GIẢI)
 */
export interface QuestionForExamRoom {
  id: string;
  orderNumber: number;
  prompt: string;
  options?: Record<string, string> | null;
  firstLetterHint?: string | null;
  charCountHint?: number | null;
  formFieldLabel?: string | null;
}

/**
 * Nhóm câu hỏi gửi xuống phòng thi
 */
export interface QuestionGroupForExamRoom {
  id: string;
  type: string;
  order: number;
  passageText?: string | null;
  passageImageUrl?: string | null;
  audioUrl?: string | null;
  maxPlays: number;
  poolOptions?: Record<string, string> | null;
  writingRequirements?: string[] | null;
  minWords?: number | null;
  maxWords?: number | null;
  questions: QuestionForExamRoom[];
}

/**
 * Một phần thi trong 14 phần gửi xuống phòng thi
 */
export interface PartForExamRoom {
  id: string;
  partNo: number;
  skill: "READING_WRITING" | "LISTENING";
  title: string;
  sourceLabel: string;
  instructions: string;
  exampleRow?: {
    prompt?: string;
    answer?: string;
    explanation?: string;
  } | null;
  questionGroup: QuestionGroupForExamRoom;
}

/**
 * Thông tin phòng thi gửi xuống trình duyệt khi thí sinh đang làm bài
 */
export interface ExamRoomSessionDTO {
  attemptId: string;
  examId: string;
  examTitle: string;
  examCode: string;
  durationMinutes: number;
  status: AttemptStatus;
  startedAt: string;
  deadlineAt: string;
  remainingSeconds: number;
  savedAnswers: ExamAnswersMap;
  parts: PartForExamRoom[];
}

/**
 * Đánh giá chi tiết phần tự luận Part 9 Writing
 */
export interface WritingEvaluationDTO {
  questionId?: string;
  userAnswer: string;
  wordCount: number;
  minWords: number;
  maxWords: number;
  isWordCountValid: boolean;
  sampleWriting?: string;
}

/**
 * Chi tiết từng câu hỏi sau khi đã nộp bài và chấm điểm
 */
export interface QuestionGradingDetailDTO {
  questionId: string;
  orderNumber: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

/**
 * Chi tiết từng Part sau khi nộp bài
 */
export interface PartResultDTO {
  partNo: number;
  title: string;
  skill: "READING_WRITING" | "LISTENING";
  isObjective: boolean;
  totalQuestions?: number;
  correctCount?: number;
  scorePercent?: number;
  details?: QuestionGradingDetailDTO[];
  transcript?: string | null;
  writing?: WritingEvaluationDTO | null;
}

/**
 * Kết quả thi thử hoàn chỉnh hiển thị trên trang Kết quả (sau khi nộp bài)
 */
export interface ExamResultDTO {
  attemptId: string;
  examId: string;
  examTitle: string;
  examCode: string;
  status: AttemptStatus;
  startedAt: string;
  submittedAt: string;
  durationSeconds: number;
  timeSpentSeconds: number;

  // Điểm số trắc nghiệm khách quan
  readingCorrect: number;
  readingTotal: number;
  readingScore: number;

  listeningCorrect: number;
  listeningTotal: number;
  listeningScore: number;

  totalCorrect: number;
  totalQuestions: number;
  overallScore: number;
  isPassed: boolean;

  // Đánh giá Writing
  writingEvaluation?: WritingEvaluationDTO | null;

  // Chi tiết 14 phần kèm giải thích và transcript
  parts: PartResultDTO[];
}
