import "server-only";

import { db } from "@/backend/lib/db";
import { Prisma } from "@prisma/client";
import type {
  PracticePartSummary,
  PracticeItemSummary,
  PracticeItemDetail,
  PracticeGradeResult,
  QuestionGradingDetail,
} from "@/shared/types/practice";
import type {
  QuestionGroupDef,
  QuestionItemDef,
  QuestionType,
  MatchPoolOption,
} from "@/shared/types/question";
import { EXAM_PARTS } from "@/shared/constants/exam-parts";
import { scoreShortText, countWords } from "@/backend/lib/text-scoring";

/**
 * Chuyển đổi enum QuestionType trong Prisma sang chuỗi type dùng ở frontend
 */
function toFrontendQuestionType(type: string): QuestionType {
  const lower = type.toLowerCase();
  switch (lower) {
    case "match_pool":
      return "match_pool";
    case "mcq3":
      return "mcq3";
    case "mcq3_image":
      return "mcq3_image";
    case "cloze_mcq":
      return "cloze_mcq";
    case "short_text":
      return "short_text";
    case "writing":
      return "writing";
    default:
      return "mcq3";
  }
}

/**
 * Chuyển đổi enum SkillType trong Prisma sang định dạng frontend
 */
function toFrontendSkill(skill: string): "reading_writing" | "listening" {
  return skill === "LISTENING" || skill === "listening"
    ? "listening"
    : "reading_writing";
}

/**
 * Lấy danh sách tổng hợp 14 Part kèm số lượng bài thực tế đã công khai trong cơ sở dữ liệu
 */
export async function getPartSummaryList(): Promise<PracticePartSummary[]> {
  const publishedCounts = await db.part.groupBy({
    by: ["partNo"],
    where: { status: "PUBLISHED" },
    _count: { id: true },
  });

  const countMap = new Map<number, number>();
  publishedCounts.forEach((c) => countMap.set(c.partNo, c._count.id));

  return EXAM_PARTS.map((ep) => {
    const totalItems = countMap.get(ep.partNo) || 0;
    return {
      partNo: ep.partNo,
      skill: ep.skill,
      titleVi: `Part ${ep.partNo} — ${ep.titleVi}`,
      titleEn: `Part ${ep.partNo} — ${ep.titleEn}`,
      descriptionVi: ep.questionType,
      questionType: ep.inputFormat,
      totalItems,
      completedItems: 0,
      progressPercent: 0,
      averageScorePercent: undefined,
    };
  });
}

/**
 * Lấy thông tin tóm tắt của 1 Part cụ thể kèm số bài thực tế trong DB
 */
export async function getPartSummary(partNo: number): Promise<PracticePartSummary | null> {
  const ep = EXAM_PARTS.find((p) => p.partNo === partNo);
  if (!ep) return null;

  const totalItems = await db.part.count({
    where: { partNo, status: "PUBLISHED" },
  });

  return {
    partNo: ep.partNo,
    skill: ep.skill,
    titleVi: `Part ${ep.partNo} — ${ep.titleVi}`,
    titleEn: `Part ${ep.partNo} — ${ep.titleEn}`,
    descriptionVi: ep.questionType,
    questionType: ep.inputFormat,
    totalItems,
    completedItems: 0,
    progressPercent: 0,
  };
}

/**
 * Lấy danh sách các bài luyện tập thật của 1 Part từ database, hỗ trợ tìm kiếm và lọc
 */
export async function getPartItems(
  partNo: number,
  options?: { groupSet?: string; query?: string; status?: "all" | "completed" | "uncompleted" }
): Promise<PracticeItemSummary[]> {
  const where: Prisma.PartWhereInput = {
    partNo,
    status: "PUBLISHED",
  };

  if (options?.groupSet && options.groupSet !== "Tất cả") {
    where.groupSet = options.groupSet;
  }

  if (options?.query && options.query.trim().length > 0) {
    const q = options.query.trim();
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { sourceLabel: { contains: q, mode: "insensitive" } },
    ];
  }

  const parts = await db.part.findMany({
    where,
    orderBy: { createdAt: "asc" },
    include: {
      questionGroups: {
        include: {
          questions: { select: { id: true } },
        },
      },
    },
  });

  const summaries: PracticeItemSummary[] = parts.map((p) => {
    let totalQuestions = 0;
    p.questionGroups.forEach((g) => {
      totalQuestions += g.questions.length;
    });

    return {
      id: p.id,
      partNo: p.partNo,
      skill: toFrontendSkill(p.skill),
      title: p.title,
      sourceLabel: p.sourceLabel,
      groupSet: p.groupSet,
      isCompleted: false, // Sinh viên khách / chưa lưu lịch sử lượt làm
      totalQuestions,
    };
  });

  return summaries;
}

/**
 * Lấy chi tiết bài luyện thật từ database để thí sinh làm bài
 * QUY TẮC BẢO MẬT TUYỆT ĐỐI (AGENTS.md):
 * Tuyệt đối không trả về `correctAnswer`, `acceptedAnswers`, `explanation`, `transcript`
 * hay `sampleWriting` khi thí sinh chưa nộp bài!
 */
export async function getPracticeItemDetail(itemId: string): Promise<PracticeItemDetail | null> {
  const part = await db.part.findUnique({
    where: { id: itemId },
    include: {
      questionGroups: {
        orderBy: { order: "asc" },
        include: {
          questions: {
            orderBy: { orderNumber: "asc" },
          },
        },
      },
    },
  });

  if (!part || part.status !== "PUBLISHED") {
    return null;
  }

  const firstGroup = part.questionGroups[0];
  if (!firstGroup) {
    return null;
  }

  // Khử sạch thông tin đáp án và lời giải thích trước khi gửi xuống client
  const safeQuestions: QuestionItemDef[] = firstGroup.questions.map((q) => {
    const item: QuestionItemDef = {
      id: q.id,
      orderNumber: q.orderNumber,
      prompt: q.prompt,
    };
    if (q.options) {
      item.options = q.options as unknown as QuestionItemDef["options"];
    }
    if (q.firstLetterHint) {
      item.firstLetterHint = q.firstLetterHint;
    }
    if (q.charCountHint) {
      item.charCountHint = q.charCountHint;
    }
    if (q.formFieldLabel) {
      item.formFieldLabel = q.formFieldLabel;
    }
    return item;
  });

  const questionGroup: QuestionGroupDef = {
    id: firstGroup.id,
    type: toFrontendQuestionType(firstGroup.type),
    title: part.title,
    instruction: part.instructions,
    items: safeQuestions,
  };

  if (firstGroup.passageText) {
    questionGroup.passageText = firstGroup.passageText;
  }
  if (firstGroup.passageImageUrl) {
    questionGroup.passageImageUrl = firstGroup.passageImageUrl;
  }
  if (firstGroup.audioUrl) {
    questionGroup.audioUrl = firstGroup.audioUrl;
  }
  if (part.exampleRow) {
    questionGroup.example = part.exampleRow as unknown as QuestionGroupDef["example"];
  }
  if (firstGroup.poolOptions) {
    questionGroup.poolOptions = firstGroup.poolOptions as unknown as MatchPoolOption[];
  }
  if (firstGroup.writingRequirements) {
    questionGroup.writingRequirements = firstGroup.writingRequirements as unknown as string[];
  }
  if (firstGroup.minWords) {
    questionGroup.minWords = firstGroup.minWords;
  }
  if (firstGroup.maxWords) {
    questionGroup.maxWords = firstGroup.maxWords;
  }

  return {
    id: part.id,
    partNo: part.partNo,
    skill: toFrontendSkill(part.skill),
    title: part.title,
    sourceLabel: part.sourceLabel,
    groupSet: part.groupSet,
    questionGroup,
  };
}

/**
 * Chấm điểm bài làm luyện tập dựa trên câu hỏi thật trong PostgreSQL
 * Trả về kết quả kèm đáp án chuẩn, lời giải thích và transcript sau khi nộp
 */
export async function gradePracticeItem(
  itemId: string,
  answers: Record<string, string>
): Promise<PracticeGradeResult> {
  const part = await db.part.findUnique({
    where: { id: itemId },
    include: {
      questionGroups: {
        orderBy: { order: "asc" },
        include: {
          questions: {
            orderBy: { orderNumber: "asc" },
          },
        },
      },
    },
  });

  if (!part) {
    throw new Error("Không tìm thấy bài luyện tập cần chấm điểm");
  }

  const group = part.questionGroups[0];
  if (!group) {
    throw new Error("Bài luyện chưa có nội dung câu hỏi");
  }

  const qType = toFrontendQuestionType(group.type);
  const details: QuestionGradingDetail[] = [];
  let correctCount = 0;

  for (const question of group.questions) {
    const userAnswer = (answers[question.id] || "").trim();
    const correctKey = question.correctAnswer.trim();
    const acceptedAnswers = Array.isArray(question.acceptedAnswers)
      ? (question.acceptedAnswers as string[])
      : [];
    const explanation =
      question.explanation ||
      "Đối chiếu với nội dung đề bài để xác định đáp án đúng.";

    let isCorrect = false;

    if (qType === "writing") {
      // Đối với Part 9 Writing: Đánh giá theo độ dài từ 25-35 từ
      const minW = group.minWords || 25;
      const maxW = group.maxWords || 35;
      const words = countWords(userAnswer);
      isCorrect = words >= minW && words <= maxW;
    } else if (qType === "short_text") {
      // Đối với dạng điền từ ngắn: So khớp không phân biệt hoa thường và chấp nhận từ đồng nghĩa
      const allAccepted = [correctKey, ...acceptedAnswers];
      isCorrect = scoreShortText(userAnswer, allAccepted);
    } else {
      // Dạng trắc nghiệm hoặc match_pool: So khớp trực tiếp mã chữ cái hoa
      isCorrect = userAnswer.toUpperCase() === correctKey.toUpperCase();
    }

    if (isCorrect) {
      correctCount++;
    }

    details.push({
      questionId: question.id,
      userAnswer,
      correctAnswer: correctKey,
      isCorrect,
      explanation,
    });
  }

  const totalQuestions = group.questions.length;
  const scorePercent =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return {
    itemId,
    totalQuestions,
    correctCount,
    scorePercent,
    details,
    transcript: group.transcript || undefined,
    sampleWriting: group.sampleWriting || undefined,
  };
}
