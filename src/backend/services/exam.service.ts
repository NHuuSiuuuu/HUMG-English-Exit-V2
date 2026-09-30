import "server-only";
import { db } from "@/backend/lib/db";
import {
  createExamSchema,
  updateExamSchema,
  validateExamForPublish,
} from "@/shared/schemas/exam.schema";
import type {
  CreateExamInput,
  UpdateExamInput,
  ExamListItemDTO,
  ExamDetailDTO,
  ExamStatsDTO,
  ExamCompletenessIssue,
} from "@/shared/types/exam";
import type { Prisma } from "@prisma/client";

export class ExamValidationError extends Error {
  constructor(
    public issues: ExamCompletenessIssue[],
    message = "Đề thi chưa đạt tiêu chuẩn để công khai"
  ) {
    super(message);
    this.name = "ExamValidationError";
  }
}

/**
 * Service quản lý đề thi thử và ghép 14 parts từ Kho phần
 */
export const examService = {
  /**
   * Lấy danh sách đề thi kèm số lượng Part đã ghép và tổng số câu hỏi
   */
  async getExams(filters?: { status?: string; search?: string }): Promise<ExamListItemDTO[]> {
    const where: Prisma.ExamWhereInput = {};

    if (filters?.status === "DRAFT" || filters?.status === "PUBLISHED") {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { code: { contains: filters.search, mode: "insensitive" } },
        { title: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const exams = await db.exam.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        examParts: {
          include: {
            part: {
              include: {
                questionGroups: {
                  include: {
                    questions: { select: { id: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    return exams.map((ex) => {
      // Đếm tổng số câu hỏi từ tất cả các part trong đề
      let totalQuestions = 0;
      ex.examParts.forEach((ep) => {
        ep.part.questionGroups.forEach((g) => {
          totalQuestions += g.questions.length;
        });
      });

      return {
        id: ex.id,
        code: ex.code,
        title: ex.title,
        description: ex.description,
        durationMinutes: ex.durationMinutes,
        difficulty: ex.difficulty,
        status: ex.status,
        partsCount: ex.examParts.length,
        totalQuestions,
        attemptsCount: ex.attemptsCount,
        createdAt: ex.createdAt.toLocaleDateString("vi-VN"),
        updatedAt: ex.updatedAt.toLocaleDateString("vi-VN"),
      };
    });
  },

  /**
   * Lấy thống kê số lượng đề thi
   */
  async getExamStats(): Promise<ExamStatsDTO> {
    const [total, published, draft, aggregate] = await Promise.all([
      db.exam.count(),
      db.exam.count({ where: { status: "PUBLISHED" } }),
      db.exam.count({ where: { status: "DRAFT" } }),
      db.exam.aggregate({
        _sum: { attemptsCount: true },
      }),
    ]);

    return {
      total,
      published,
      draft,
      totalAttempts: aggregate._sum.attemptsCount || 0,
    };
  },

  /**
   * Lấy chi tiết đề thi kèm danh sách 14 parts đã ghép
   */
  async getExamById(id: string): Promise<ExamDetailDTO | null> {
    const exam = await db.exam.findUnique({
      where: { id },
      include: {
        examParts: {
          orderBy: { partNo: "asc" },
          include: {
            part: {
              include: {
                questionGroups: {
                  include: {
                    questions: { select: { id: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!exam) return null;

    const parts = exam.examParts.map((ep) => {
      let totalQuestions = 0;
      let passageText: string | null = null;
      let passageImageUrl: string | null = null;
      let audioUrl: string | null = null;

      ep.part.questionGroups.forEach((g) => {
        totalQuestions += g.questions.length;
        if (g.passageText) passageText = g.passageText;
        if (g.passageImageUrl) passageImageUrl = g.passageImageUrl;
        if (g.audioUrl) audioUrl = g.audioUrl;
      });

      return {
        id: ep.id,
        partId: ep.partId,
        partNo: ep.partNo,
        title: ep.part.title,
        sourceLabel: ep.part.sourceLabel,
        skill: ep.part.skill,
        totalQuestions,
        passageText,
        passageImageUrl,
        audioUrl,
      };
    });

    return {
      id: exam.id,
      code: exam.code,
      title: exam.title,
      description: exam.description,
      durationMinutes: exam.durationMinutes,
      difficulty: exam.difficulty,
      status: exam.status,
      attemptsCount: exam.attemptsCount,
      createdAt: exam.createdAt.toLocaleDateString("vi-VN"),
      updatedAt: exam.updatedAt.toLocaleDateString("vi-VN"),
      parts,
    };
  },

  /**
   * Tạo đề thi mới và ghép các parts từ Kho phần
   */
  async createExam(rawInput: CreateExamInput) {
    const validated = createExamSchema.parse(rawInput);

    // Kiểm tra tính đầy đủ nếu bấm Công khai
    if (validated.status === "PUBLISHED") {
      const issues = validateExamForPublish(validated);
      if (issues.length > 0) {
        throw new ExamValidationError(issues);
      }
    }

    // Kiểm tra mã đề đã tồn tại chưa
    const existing = await db.exam.findUnique({
      where: { code: validated.code },
    });
    if (existing) {
      throw new Error(`Mã đề thi "${validated.code}" đã tồn tại. Vui lòng nhập mã khác.`);
    }

    // Thực hiện lưu đề thi và liên kết các part bằng transaction
    return db.$transaction(async (tx: Prisma.TransactionClient) => {
      const exam = await tx.exam.create({
        data: {
          code: validated.code,
          title: validated.title,
          description: validated.description || null,
          durationMinutes: validated.durationMinutes || 60,
          difficulty: validated.difficulty || "MEDIUM",
          status: validated.status,
        },
      });

      // Tạo các liên kết ExamPart nếu có
      if (validated.partSelections.length > 0) {
        await tx.examPart.createMany({
          data: validated.partSelections.map((sel, idx) => ({
            examId: exam.id,
            partId: sel.partId,
            partNo: sel.partNo,
            order: idx + 1,
          })),
        });
      }

      return exam;
    });
  },

  /**
   * Cập nhật thông tin đề thi và danh sách ghép Part
   */
  async updateExam(rawInput: UpdateExamInput) {
    const validated = updateExamSchema.parse(rawInput);

    const existing = await db.exam.findUnique({
      where: { id: validated.id },
    });
    if (!existing) {
      throw new Error("Không tìm thấy đề thi cần cập nhật");
    }

    if (validated.status === "PUBLISHED") {
      const issues = validateExamForPublish(validated);
      if (issues.length > 0) {
        throw new ExamValidationError(issues);
      }
    }

    return db.$transaction(async (tx: Prisma.TransactionClient) => {
      const exam = await tx.exam.update({
        where: { id: validated.id },
        data: {
          ...(validated.code && { code: validated.code }),
          ...(validated.title && { title: validated.title }),
          ...(validated.description !== undefined && { description: validated.description }),
          ...(validated.durationMinutes && { durationMinutes: validated.durationMinutes }),
          ...(validated.difficulty && { difficulty: validated.difficulty }),
          ...(validated.status && { status: validated.status }),
        },
      });

      // Nếu có cập nhật danh sách Part: xóa liên kết cũ và thêm mới
      if (validated.partSelections) {
        await tx.examPart.deleteMany({
          where: { examId: exam.id },
        });

        if (validated.partSelections.length > 0) {
          await tx.examPart.createMany({
            data: validated.partSelections.map((sel, idx) => ({
              examId: exam.id,
              partId: sel.partId,
              partNo: sel.partNo,
              order: idx + 1,
            })),
          });
        }
      }

      return exam;
    });
  },

  /**
   * Xóa đề thi (xóa liên kết, không xóa các bài trong Kho phần)
   */
  async deleteExam(id: string) {
    const existing = await db.exam.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new Error("Không tìm thấy đề thi cần xóa");
    }

    return db.exam.delete({
      where: { id },
    });
  },
};
