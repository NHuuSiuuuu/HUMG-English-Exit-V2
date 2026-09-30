import { NextRequest, NextResponse } from "next/server";
import { gradePracticeItem } from "@/backend/services/practice.service";

/**
 * Route handler chấm điểm bài luyện tập
 * Tuân thủ AGENTS.md: Mỏng, chỉ nhận dữ liệu, gọi backend service và trả về kết quả
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { itemId, answers } = body;

    if (!itemId || typeof itemId !== "string") {
      return NextResponse.json(
        { error: "Mã bài luyện không hợp lệ" },
        { status: 400 }
      );
    }

    const safeAnswers: Record<string, string> =
      typeof answers === "object" && answers !== null ? answers : {};

    const result = await gradePracticeItem(itemId, safeAnswers);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Lỗi khi chấm điểm bài luyện tập:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi trong quá trình chấm điểm" },
      { status: 500 }
    );
  }
}
