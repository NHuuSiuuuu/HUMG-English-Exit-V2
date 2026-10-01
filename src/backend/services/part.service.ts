import "server-only";

import { db } from "@/backend/lib/db";
import { Prisma } from "@prisma/client";
import type {
  CreatePartInput,
  UpdatePartInput,
  PartDetailDTO,
  PoolOptionDef,
  QuestionOptionDef,
  ExampleRowDef,
  PartCompletenessIssue,
} from "@/shared/types/part";
import { validatePartForPublish } from "@/shared/schemas/part.schema";

export class PartValidationError extends Error {
  issues: PartCompletenessIssue[];

  constructor(message: string, issues: PartCompletenessIssue[]) {
    super(message);
    this.name = "PartValidationError";
    this.issues = issues;
  }
}

/**
 * Kiểm tra tính đầy đủ của Part trước khi công khai.
 */
export function checkPartCompleteness(input: CreatePartInput): PartCompletenessIssue[] {
  return validatePartForPublish(input);
}

/**
 * Tạo mới một Part cùng toàn bộ nhóm câu hỏi và câu hỏi liên quan trong PostgreSQL.
 */
export async function createPart(input: CreatePartInput, _adminId?: string) {
  // Nếu lưu với trạng thái PUBLISHED: bắt buộc thẩm định đạt chuẩn
  if (input.status === "PUBLISHED") {
    const issues = checkPartCompleteness(input);
    if (issues.length > 0) {
      throw new PartValidationError("Nội dung Part chưa đủ điều kiện để công khai", issues);
    }
  }

  // Thực hiện ghi quan hệ lồng nhau (nested write) an toàn
  const newPart = await db.part.create({
    data: {
      partNo: input.partNo,
      skill: input.skill,
      title: input.title,
      sourceLabel: input.sourceLabel,
      groupSet: input.groupSet,
      instructions: input.instructions,
      exampleRow: input.exampleRow ? (input.exampleRow as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
      difficulty: input.difficulty ?? "MEDIUM",
      status: input.status,
      questionGroups: {
        create: [
          {
            type: input.questionType,
            order: 1,
            passageText: input.passageText || null,
            passageImageUrl: input.passageImageUrl || null,
            audioUrl: input.audioUrl || null,
            maxPlays: input.maxPlays ?? 2,
            transcript: input.transcript || null,
            poolOptions: input.poolOptions ? (input.poolOptions as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
            writingRequirements: input.writingRequirements ? (input.writingRequirements as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
            minWords: input.minWords ?? (input.questionType === "WRITING" ? 25 : null),
            maxWords: input.maxWords ?? (input.questionType === "WRITING" ? 35 : null),
            sampleWriting: input.sampleWriting || null,
            questions: {
              create: input.questions.map((q, idx) => ({
                orderNumber: q.orderNumber || idx + 1,
                prompt: q.prompt,
                options: q.options ? (q.options as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
                correctAnswer: q.correctAnswer,
                acceptedAnswers: q.acceptedAnswers ? (q.acceptedAnswers as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
                explanation: q.explanation || null,
                firstLetterHint: q.firstLetterHint || null,
                charCountHint: q.charCountHint ?? null,
                formFieldLabel: q.formFieldLabel || null,
              })),
            },
          },
        ],
      },
    },
    include: {
      questionGroups: {
        include: {
          questions: true,
        },
      },
    },
  });

  return newPart;
}

/**
 * Lấy danh sách Part trong kho kèm bộ lọc (tìm kiếm, kỹ năng, partNo, trạng thái)
 */
export async function getParts(filters?: import("@/shared/types/part").PartFilterOptions) {
  const where: Prisma.PartWhereInput = {};

  if (filters?.skill) {
    where.skill = filters.skill;
  }

  if (filters?.partNo) {
    where.partNo = filters.partNo;
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.search && filters.search.trim() !== "") {
    const s = filters.search.trim();
    where.OR = [
      { title: { contains: s, mode: "insensitive" } },
      { sourceLabel: { contains: s, mode: "insensitive" } },
      { groupSet: { contains: s, mode: "insensitive" } },
    ];
  }

  const parts = await db.part.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      questionGroups: {
        include: {
          questions: {
            select: { id: true },
          },
        },
      },
    },
  });

  return parts.map((p) => {
    const firstGroup = p.questionGroups[0];
    const totalQuestions = p.questionGroups.reduce(
      (sum, g) => sum + g.questions.length,
      0
    );

    return {
      id: p.id,
      partNo: p.partNo,
      skill: p.skill,
      title: p.title,
      sourceLabel: p.sourceLabel,
      groupSet: p.groupSet,
      difficulty: p.difficulty,
      status: p.status,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      questionType: firstGroup?.type || "MCQ3",
      totalQuestions,
    };
  });
}

/**
 * Lấy số liệu thống kê tổng quan của Kho phần
 */
export async function getPartStats() {
  const allParts = await db.part.findMany({
    select: {
      id: true,
      partNo: true,
      status: true,
    },
  });

  const totalParts = allParts.length;
  let publishedCount = 0;
  let draftCount = 0;
  const countsByPartNo: Record<number, number> = {};

  for (let i = 1; i <= 14; i++) {
    countsByPartNo[i] = 0;
  }

  for (const p of allParts) {
    if (p.status === "PUBLISHED") publishedCount++;
    if (p.status === "DRAFT") draftCount++;
    countsByPartNo[p.partNo] = (countsByPartNo[p.partNo] || 0) + 1;
  }

  const coveredPartTypesCount = Object.values(countsByPartNo).filter(
    (c) => c > 0
  ).length;

  return {
    totalParts,
    publishedCount,
    draftCount,
    coveredPartTypesCount,
    countsByPartNo,
  };
}

/**
 * Xóa một Part khỏi cơ sở dữ liệu
 */
export async function deletePart(id: string) {
  try {
    await db.part.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Lấy chi tiết một Part theo ID (bao gồm cả nhóm câu hỏi và câu hỏi liên quan)
 */
export async function getPartById(id: string): Promise<PartDetailDTO | null> {
  const part = await db.part.findUnique({
    where: { id },
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
    return null;
  }

  const firstGroup = part.questionGroups[0];

  return {
    id: part.id,
    partNo: part.partNo,
    skill: part.skill,
    questionType: firstGroup?.type || "MCQ3",
    title: part.title,
    sourceLabel: part.sourceLabel,
    groupSet: part.groupSet,
    instructions: part.instructions,
    exampleRow: (part.exampleRow as unknown as ExampleRowDef) ?? null,
    difficulty: part.difficulty,
    status: part.status,
    createdAt: part.createdAt.toISOString(),
    updatedAt: part.updatedAt.toISOString(),

    passageText: firstGroup?.passageText ?? null,
    passageImageUrl: firstGroup?.passageImageUrl ?? null,
    audioUrl: firstGroup?.audioUrl ?? null,
    maxPlays: firstGroup?.maxPlays ?? 2,
    transcript: firstGroup?.transcript ?? null,
    poolOptions: (firstGroup?.poolOptions as unknown as PoolOptionDef[]) ?? null,
    writingRequirements: (firstGroup?.writingRequirements as unknown as string[]) ?? null,
    minWords: firstGroup?.minWords ?? null,
    maxWords: firstGroup?.maxWords ?? null,
    sampleWriting: firstGroup?.sampleWriting ?? null,

    questions: firstGroup
      ? firstGroup.questions.map((q) => ({
          id: q.id,
          orderNumber: q.orderNumber,
          prompt: q.prompt,
          options: (q.options as unknown as QuestionOptionDef[]) ?? undefined,
          correctAnswer: q.correctAnswer,
          acceptedAnswers: (q.acceptedAnswers as unknown as string[]) ?? undefined,
          explanation: q.explanation ?? undefined,
          firstLetterHint: q.firstLetterHint ?? undefined,
          charCountHint: q.charCountHint ?? undefined,
          formFieldLabel: q.formFieldLabel ?? undefined,
        }))
      : [],
  };
}

/**
 * Cập nhật một Part hiện có cùng toàn bộ nhóm câu hỏi và câu hỏi liên quan trong transaction
 */
export async function updatePart(input: UpdatePartInput, _adminId?: string): Promise<PartDetailDTO> {
  const existing = await db.part.findUnique({
    where: { id: input.id },
  });

  if (!existing) {
    throw new Error("Không tìm thấy Part cần cập nhật");
  }

  // Nếu chuyển sang trạng thái PUBLISHED: bắt buộc thẩm định đạt chuẩn
  if (input.status === "PUBLISHED") {
    const issues = checkPartCompleteness(input);
    if (issues.length > 0) {
      throw new PartValidationError("Nội dung Part chưa đủ điều kiện để công khai", issues);
    }
  }

  // Cập nhật thông tin Part và đồng bộ nhóm câu hỏi trong transaction
  await db.$transaction(async (tx) => {
    // 1. Cập nhật thông tin cơ bản của Part
    await tx.part.update({
      where: { id: input.id },
      data: {
        partNo: input.partNo,
        skill: input.skill,
        title: input.title,
        sourceLabel: input.sourceLabel,
        groupSet: input.groupSet,
        instructions: input.instructions,
        exampleRow: input.exampleRow ? (input.exampleRow as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
        difficulty: input.difficulty ?? "MEDIUM",
        status: input.status,
      },
    });

    // 2. Xóa các questionGroups cũ (onDelete: Cascade sẽ tự xóa toàn bộ questions tương ứng)
    await tx.questionGroup.deleteMany({
      where: { partId: input.id },
    });

    // 3. Tạo lại questionGroup và danh sách questions mới
    await tx.questionGroup.create({
      data: {
        partId: input.id,
        type: input.questionType,
        order: 1,
        passageText: input.passageText || null,
        passageImageUrl: input.passageImageUrl || null,
        audioUrl: input.audioUrl || null,
        maxPlays: input.maxPlays ?? 2,
        transcript: input.transcript || null,
        poolOptions: input.poolOptions ? (input.poolOptions as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
        writingRequirements: input.writingRequirements ? (input.writingRequirements as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
        minWords: input.minWords ?? (input.questionType === "WRITING" ? 25 : null),
        maxWords: input.maxWords ?? (input.questionType === "WRITING" ? 35 : null),
        sampleWriting: input.sampleWriting || null,
        questions: {
          create: input.questions.map((q, idx) => ({
            orderNumber: q.orderNumber || idx + 1,
            prompt: q.prompt,
            options: q.options ? (q.options as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
            correctAnswer: q.correctAnswer,
            acceptedAnswers: q.acceptedAnswers ? (q.acceptedAnswers as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
            explanation: q.explanation || null,
            firstLetterHint: q.firstLetterHint || null,
            charCountHint: q.charCountHint ?? null,
            formFieldLabel: q.formFieldLabel || null,
          })),
        },
      },
    });
  });

  const updated = await getPartById(input.id);
  if (!updated) {
    throw new Error("Lỗi khi tải lại dữ liệu Part sau cập nhật");
  }

  return updated;
}

/**
 * Cập nhật nhanh trạng thái của một Part (Bản nháp <-> Công khai)
 */
export async function updatePartStatus(
  id: string,
  status: import("@prisma/client").PartStatus
): Promise<{ id: string; status: import("@prisma/client").PartStatus }> {
  const part = await getPartById(id);
  if (!part) {
    throw new Error("Không tìm thấy Part cần đổi trạng thái");
  }

  // Nếu chuyển sang trạng thái PUBLISHED: bắt buộc kiểm tra tính đầy đủ
  if (status === "PUBLISHED") {
    const issues = checkPartCompleteness(part);
    if (issues.length > 0) {
      throw new PartValidationError("Nội dung Part chưa đủ điều kiện để công khai", issues);
    }
  }

  await db.part.update({
    where: { id },
    data: { status },
  });

  return { id, status };
}

export const partService = {
  createPart,
  getPartById,
  updatePart,
  updatePartStatus,
  checkPartCompleteness,
  getParts,
  getPartStats,
  deletePart,
};

