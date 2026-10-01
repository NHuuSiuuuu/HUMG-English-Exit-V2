import "server-only";
import { countWords, scoreShortText } from "@/backend/lib/text-scoring";
import type {
  ExamAnswersMap,
  ExamResultDTO,
  PartResultDTO,
  QuestionGradingDetailDTO,
  WritingEvaluationDTO,
} from "@/shared/types/attempt";

export interface QuestionGradingInput {
  id: string;
  orderNumber: number;
  correctAnswer: string;
  acceptedAnswers?: string[] | null;
  explanation?: string | null;
}

export interface QuestionGroupGradingInput {
  type: string;
  transcript?: string | null;
  minWords?: number | null;
  maxWords?: number | null;
  sampleWriting?: string | null;
  questions: QuestionGradingInput[];
}

export interface PartGradingInput {
  partNo: number;
  title: string;
  skill: "READING_WRITING" | "LISTENING";
  questionGroup: QuestionGroupGradingInput;
}

export interface ExamScoringCalculationResult {
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
  writingEvaluation?: WritingEvaluationDTO | null;
  parts: PartResultDTO[];
}

/**
 * Hàm thuần chấm điểm toàn bộ đề thi 14 phần
 * Độc lập với DB, đảm bảo 100% tính tất định theo AGENTS.md
 */
export function calculateExamScore(
  examParts: PartGradingInput[],
  userAnswers: ExamAnswersMap
): ExamScoringCalculationResult {
  let readingCorrect = 0;
  let readingTotal = 0;
  let listeningCorrect = 0;
  let listeningTotal = 0;

  const parts: PartResultDTO[] = [];
  let writingEvaluation: WritingEvaluationDTO | null = null;

  for (const part of examParts) {
    const isListening = part.partNo >= 10 || part.skill === "LISTENING";
    const group = part.questionGroup;
    const questions = group.questions || [];

    // Part 9 Writing: Tách riêng, không tính vào điểm trắc nghiệm khách quan
    if (group.type === "WRITING" || part.partNo === 9) {
      const q = questions[0];
      const userAnswer = q ? (userAnswers[q.id] || "").trim() : "";
      const words = countWords(userAnswer);
      const minW = group.minWords || 25;
      const maxW = group.maxWords || 35;
      const isWordCountValid = words >= minW && words <= maxW;

      writingEvaluation = {
        questionId: q?.id,
        userAnswer,
        wordCount: words,
        minWords: minW,
        maxWords: maxW,
        isWordCountValid,
        sampleWriting: group.sampleWriting || undefined,
      };

      parts.push({
        partNo: part.partNo,
        title: part.title,
        skill: part.skill,
        isObjective: false,
        writing: writingEvaluation,
      });
      continue;
    }

    let partCorrect = 0;
    const details: QuestionGradingDetailDTO[] = [];

    for (const q of questions) {
      const userAnswer = (userAnswers[q.id] || "").trim();
      const correctKey = (q.correctAnswer || "").trim();
      const accepted = Array.isArray(q.acceptedAnswers) ? q.acceptedAnswers : [];

      let isCorrect = false;

      if (group.type === "SHORT_TEXT") {
        isCorrect = scoreShortText(userAnswer, [correctKey, ...accepted]);
      } else {
        isCorrect =
          userAnswer.length > 0 &&
          userAnswer.toUpperCase() === correctKey.toUpperCase();
      }

      if (isCorrect) {
        partCorrect++;
        if (isListening) {
          listeningCorrect++;
        } else {
          readingCorrect++;
        }
      }

      if (isListening) {
        listeningTotal++;
      } else {
        readingTotal++;
      }

      details.push({
        questionId: q.id,
        orderNumber: q.orderNumber,
        userAnswer,
        correctAnswer: correctKey,
        isCorrect,
        explanation: q.explanation || "Đối chiếu nội dung bài để kiểm tra đáp án.",
      });
    }

    parts.push({
      partNo: part.partNo,
      title: part.title,
      skill: part.skill,
      isObjective: true,
      totalQuestions: questions.length,
      correctCount: partCorrect,
      scorePercent:
        questions.length > 0
          ? Math.round((partCorrect / questions.length) * 100)
          : 0,
      details,
      transcript: group.transcript || null,
    });
  }

  const totalCorrect = readingCorrect + listeningCorrect;
  const totalQuestions = readingTotal + listeningTotal;
  const overallScore =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const readingScore =
    readingTotal > 0 ? Math.round((readingCorrect / readingTotal) * 100) : 0;
  const listeningScore =
    listeningTotal > 0 ? Math.round((listeningCorrect / listeningTotal) * 100) : 0;
  const isPassed = overallScore >= 50;

  return {
    readingCorrect,
    readingTotal,
    readingScore,
    listeningCorrect,
    listeningTotal,
    listeningScore,
    totalCorrect,
    totalQuestions,
    overallScore,
    isPassed,
    writingEvaluation,
    parts,
  };
}
