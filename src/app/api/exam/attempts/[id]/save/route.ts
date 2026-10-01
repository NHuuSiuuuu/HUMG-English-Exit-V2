import { NextRequest, NextResponse } from "next/server";
import { attemptService } from "@/backend/services/attempt.service";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * Lưu đáp án bài thi liên tục (Autosave)
 */
export async function PUT(
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

    const body = await req.json();
    const answers = body?.answers && typeof body.answers === "object" ? body.answers : {};

    const result = await attemptService.saveAnswers(id, answers);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Lỗi khi lưu đáp án:", error);
    return NextResponse.json(
      { error: error?.message || "Không thể lưu bài làm" },
      { status: 400 }
    );
  }
}
