import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/backend/lib/auth";
import { attemptService } from "@/backend/services/attempt.service";

/**
 * Khởi tạo lượt thi thử mới (AGENTS.md: Route handler mỏng)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { examId } = body;

    if (!examId || typeof examId !== "string") {
      return NextResponse.json(
        { error: "Mã đề thi không hợp lệ" },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    const result = await attemptService.createAttempt(examId, user?.id);

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Lỗi khi khởi tạo lượt thi:", error);
    return NextResponse.json(
      { error: error?.message || "Đã xảy ra sự cố khi bắt đầu bài thi" },
      { status: 500 }
    );
  }
}
