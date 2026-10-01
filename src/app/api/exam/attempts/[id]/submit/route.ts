import { NextRequest, NextResponse } from "next/server";
import { attemptService } from "@/backend/services/attempt.service";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * Nộp bài thi thử và kích hoạt chấm điểm tự động
 */
export async function POST(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Mã lượt thi không hợp lệ" },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const answers = body?.answers && typeof body.answers === "object" ? body.answers : {};

    const result = await attemptService.submitAttempt(id, answers);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Lỗi khi nộp bài thi thử:", error);
    return NextResponse.json(
      { error: error?.message || "Đã xảy ra sự cố khi nộp bài" },
      { status: 500 }
    );
  }
}
