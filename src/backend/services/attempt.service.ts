import "server-only";
import { db } from "@/backend/lib/db";
import { calculateExamScore } from "@/backend/lib/exam-scoring";
import type {
  ExamAnswersMap,
  ExamResultDTO,
  ExamRoomSessionDTO,
  PartForExamRoom,
  PartResultDTO,
} from "@/shared/types/attempt";

/**
 * Service quản lý lượt thi thử (Attempt) và chấm điểm tự động
 * Tuân thủ nghiêm ngặt các quy tắc bảo mật và nghiệp vụ trong AGENTS.md
 */
export const attemptService = {
  /**
   * Khởi tạo lượt thi mới cho thí sinh
   * Tính toán thời gian bắt đầu và hạn chót (deadline) hoàn toàn tại máy chủ (AGENTS.md Quy tắc 2)
   */
  async createAttempt(
    examId: string,
    userId?: string
  ): Promise<{ attemptId: string; examId: string; deadlineAt: string }> {
    const exam = await db.exam.findUnique({
      where: { id: examId },
      include: { examParts: true },
    });

    if (!exam || exam.status !== "PUBLISHED") {
      throw new Error("Đề thi không tồn tại hoặc chưa được công khai");
    }

    if (exam.examParts.length === 0) {
      throw new Error("Đề thi chưa có nội dung câu hỏi");
    }

    const durationMinutes = exam.durationMinutes || 60;
    const startedAt = new Date();
    const deadlineAt = new Date(startedAt.getTime() + durationMinutes * 60 * 1000);

    const [attempt] = await db.$transaction([
      db.examAttempt.create({
        data: {
          examId,
          userId: userId || null,
          status: "IN_PROGRESS",
          startedAt,
          deadlineAt,
          durationSeconds: durationMinutes * 60,
          answers: {},
        },
      }),
      db.exam.update({
        where: { id: examId },
        data: { attemptsCount: { increment: 1 } },
      }),
    ]);

    return {
      attemptId: attempt.id,
      examId,
      deadlineAt: attempt.deadlineAt.toISOString(),
    };
  },

  /**
   * Lấy thông tin phòng thi và đề bài
   * BẢO MẬT BẮT BUỘC (AGENTS.md Quy tắc 1):
   * TUYỆT ĐỐI KHÔNG gửi `correctAnswer`, `acceptedAnswers`, `explanation` xuống trình duyệt
   */
  async getAttemptForExamRoom(attemptId: string): Promise<ExamRoomSessionDTO> {
    const attempt = await db.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        exam: {
          include: {
            examParts: {
              orderBy: { partNo: "asc" },
              include: {
                part: {
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
                },
              },
            },
          },
        },
      },
    });

    if (!attempt) {
      throw new Error("Không tìm thấy lượt thi yêu cầu");
    }

    const now = new Date();

    // Tự động chốt bài nếu đã quá hạn nộp + dung sai 30 giây
    if (
      attempt.status === "IN_PROGRESS" &&
      now.getTime() > attempt.deadlineAt.getTime() + 30 * 1000
    ) {
      await this.submitAttempt(
        attemptId,
        (attempt.answers as ExamAnswersMap) || {}
      );
      attempt.status = "COMPLETED";
    }

    const remainingSeconds = Math.max(
      0,
      Math.floor((attempt.deadlineAt.getTime() - now.getTime()) / 1000)
    );

    // Chuyển đổi dữ liệu sang định dạng an toàn cho phòng thi (lược bỏ đáp án đúng)
    const secureParts: PartForExamRoom[] = attempt.exam.examParts.map((ep) => {
      const part = ep.part;
      const group = part.questionGroups[0] || {
        id: "",
        type: "MCQ3",
        order: 1,
        maxPlays: 2,
        questions: [],
      };

      return {
        id: part.id,
        partNo: ep.partNo,
        skill: part.skill,
        title: part.title,
        sourceLabel: part.sourceLabel,
        instructions: part.instructions,
        exampleRow: part.exampleRow as any,
        questionGroup: {
          id: group.id,
          type: group.type,
          order: group.order,
          passageText: group.passageText,
          passageImageUrl: group.passageImageUrl,
          audioUrl: group.audioUrl,
          maxPlays: group.maxPlays || 2,
          poolOptions: group.poolOptions as any,
          writingRequirements: group.writingRequirements as any,
          minWords: group.minWords,
          maxWords: group.maxWords,
          questions: group.questions.map((q) => ({
            id: q.id,
            orderNumber: q.orderNumber,
            prompt: q.prompt,
            options: q.options as any,
            firstLetterHint: q.firstLetterHint,
            charCountHint: q.charCountHint,
            formFieldLabel: q.formFieldLabel,
          })),
        },
      };
    });

    return {
      attemptId: attempt.id,
      examId: attempt.examId,
      examTitle: attempt.exam.title,
      examCode: attempt.exam.code,
      durationMinutes: attempt.exam.durationMinutes,
      status: attempt.status,
      startedAt: attempt.startedAt.toISOString(),
      deadlineAt: attempt.deadlineAt.toISOString(),
      remainingSeconds,
      savedAnswers: (attempt.answers as ExamAnswersMap) || {},
      parts: secureParts,
    };
  },

  /**
   * Lưu đáp án liên tục trong lúc thí sinh đang làm bài (Autosave)
   */
  async saveAnswers(
    attemptId: string,
    answers: ExamAnswersMap
  ): Promise<{ success: boolean; remainingSeconds: number }> {
    const attempt = await db.examAttempt.findUnique({
      where: { id: attemptId },
      select: { status: true, deadlineAt: true },
    });

    if (!attempt) {
      throw new Error("Không tìm thấy lượt thi");
    }

    if (attempt.status !== "IN_PROGRESS") {
      throw new Error("Bài thi đã được nộp hoặc đã kết thúc");
    }

    const now = new Date();
    // Cho phép dung sai 30 giây khi mạng chập chờn
    if (now.getTime() > attempt.deadlineAt.getTime() + 30 * 1000) {
      throw new Error("Thời gian làm bài đã kết thúc");
    }

    await db.examAttempt.update({
      where: { id: attemptId },
      data: { answers },
    });

    const remainingSeconds = Math.max(
      0,
      Math.floor((attempt.deadlineAt.getTime() - now.getTime()) / 1000)
    );

    return { success: true, remainingSeconds };
  },

  /**
   * Nộp bài và chấm điểm bài thi 14 phần
   * Sử dụng đáp án chuẩn từ cơ sở dữ liệu để đối chiếu và lưu kết quả
   */
  async submitAttempt(
    attemptId: string,
    userAnswers: ExamAnswersMap
  ): Promise<ExamResultDTO> {
    const attempt = await db.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        exam: {
          include: {
            examParts: {
              orderBy: { partNo: "asc" },
              include: {
                part: {
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
                },
              },
            },
          },
        },
      },
    });

    if (!attempt) {
      throw new Error("Không tìm thấy bài thi cần nộp");
    }

    // Chuẩn bị dữ liệu đề thi kèm đáp án chuẩn cho bộ chấm điểm độc lập
    const partsForGrading = attempt.exam.examParts.map((ep) => {
      const part = ep.part;
      const group = part.questionGroups[0] || {
        type: "MCQ3",
        questions: [],
      };

      return {
        partNo: ep.partNo,
        title: part.title,
        skill: part.skill,
        questionGroup: {
          type: group.type,
          transcript: group.transcript,
          minWords: group.minWords,
          maxWords: group.maxWords,
          sampleWriting: group.sampleWriting,
          questions: group.questions.map((q) => ({
            id: q.id,
            orderNumber: q.orderNumber,
            correctAnswer: q.correctAnswer,
            acceptedAnswers: q.acceptedAnswers as string[],
            explanation: q.explanation,
          })),
        },
      };
    });

    // Thực hiện chấm điểm bằng hàm thuần
    const grading = calculateExamScore(partsForGrading, userAnswers);

    const submittedAt = new Date();
    const timeSpentSeconds = Math.min(
      attempt.durationSeconds,
      Math.max(
        1,
        Math.floor((submittedAt.getTime() - attempt.startedAt.getTime()) / 1000)
      )
    );

    // Cập nhật kết quả vào database
    await db.examAttempt.update({
      where: { id: attemptId },
      data: {
        status: "COMPLETED",
        submittedAt,
        answers: userAnswers,
        readingCorrect: grading.readingCorrect,
        readingTotal: grading.readingTotal,
        readingScore: grading.readingScore,
        listeningCorrect: grading.listeningCorrect,
        listeningTotal: grading.listeningTotal,
        listeningScore: grading.listeningScore,
        totalCorrect: grading.totalCorrect,
        totalQuestions: grading.totalQuestions,
        overallScore: grading.overallScore,
        isPassed: grading.isPassed,
        resultDetails: grading.parts as any,
      },
    });

    return {
      attemptId: attempt.id,
      examId: attempt.examId,
      examTitle: attempt.exam.title,
      examCode: attempt.exam.code,
      status: "COMPLETED",
      startedAt: attempt.startedAt.toISOString(),
      submittedAt: submittedAt.toISOString(),
      durationSeconds: attempt.durationSeconds,
      timeSpentSeconds,
      readingCorrect: grading.readingCorrect,
      readingTotal: grading.readingTotal,
      readingScore: grading.readingScore,
      listeningCorrect: grading.listeningCorrect,
      listeningTotal: grading.listeningTotal,
      listeningScore: grading.listeningScore,
      totalCorrect: grading.totalCorrect,
      totalQuestions: grading.totalQuestions,
      overallScore: grading.overallScore,
      isPassed: grading.isPassed,
      writingEvaluation: grading.writingEvaluation,
      parts: grading.parts,
    };
  },

  /**
   * Lấy kết quả thi chi tiết sau khi đã nộp bài
   * Bao gồm bảng điểm, lời giải thích từng câu và transcript
   */
  async getAttemptResult(attemptId: string): Promise<ExamResultDTO> {
    const attempt = await db.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        exam: {
          include: {
            examParts: {
              orderBy: { partNo: "asc" },
              include: {
                part: {
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
                },
              },
            },
          },
        },
      },
    });

    if (!attempt) {
      throw new Error("Không tìm thấy kết quả lượt thi");
    }

    if (attempt.status !== "COMPLETED") {
      throw new Error("Lượt thi chưa được nộp bài để xem kết quả");
    }

    const submittedAt = attempt.submittedAt || new Date();
    const timeSpentSeconds = Math.min(
      attempt.durationSeconds,
      Math.max(
        1,
        Math.floor((submittedAt.getTime() - attempt.startedAt.getTime()) / 1000)
      )
    );

    // Tái tạo hoặc lấy chi tiết phần chấm từ resultDetails đã lưu
    let parts: PartResultDTO[] = [];
    if (attempt.resultDetails && Array.isArray(attempt.resultDetails)) {
      parts = attempt.resultDetails as unknown as PartResultDTO[];
    } else {
      const partsForGrading = attempt.exam.examParts.map((ep) => {
        const part = ep.part;
        const group = part.questionGroups[0] || {
          type: "MCQ3",
          questions: [],
        };

        return {
          partNo: ep.partNo,
          title: part.title,
          skill: part.skill,
          questionGroup: {
            type: group.type,
            transcript: group.transcript,
            minWords: group.minWords,
            maxWords: group.maxWords,
            sampleWriting: group.sampleWriting,
            questions: group.questions.map((q) => ({
              id: q.id,
              orderNumber: q.orderNumber,
              correctAnswer: q.correctAnswer,
              acceptedAnswers: q.acceptedAnswers as string[],
              explanation: q.explanation,
            })),
          },
        };
      });

      const recalculated = calculateExamScore(
        partsForGrading,
        (attempt.answers as ExamAnswersMap) || {}
      );
      parts = recalculated.parts;
    }

    const writingPart = parts.find((p) => p.partNo === 9);

    return {
      attemptId: attempt.id,
      examId: attempt.examId,
      examTitle: attempt.exam.title,
      examCode: attempt.exam.code,
      status: "COMPLETED",
      startedAt: attempt.startedAt.toISOString(),
      submittedAt: submittedAt.toISOString(),
      durationSeconds: attempt.durationSeconds,
      timeSpentSeconds,
      readingCorrect: attempt.readingCorrect,
      readingTotal: attempt.readingTotal,
      readingScore: attempt.readingScore,
      listeningCorrect: attempt.listeningCorrect,
      listeningTotal: attempt.listeningTotal,
      listeningScore: attempt.listeningScore,
      totalCorrect: attempt.totalCorrect,
      totalQuestions: attempt.totalQuestions,
      overallScore: attempt.overallScore,
      isPassed: attempt.isPassed,
      writingEvaluation: writingPart?.writing || null,
      parts,
    };
  },
};
